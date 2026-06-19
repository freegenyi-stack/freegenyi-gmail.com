import { db } from "@/db";
import {
  libraryBooks,
  libraryBookAnnexes,
  libraryReadingSessions,
  libraryReviews,
  libraryUserAnnotations,
  libraryUserProgress,
  users,
} from "@/db/schema";
import type { LibraryBookRow } from "@/lib/library/books.server";
import { and, desc, eq, gt, lt, sql, inArray } from "drizzle-orm";
import { computeReadingStreakFromDayKeys } from "@/lib/library/reading-streak.server";
import { assertPdfKitDataAvailable, createPdfDocument } from "@/lib/pdf/pdfkit-server";

export type UserContinueRow = {
  bookId: number;
  title: string;
  author: string | null;
  coverUrl: string | null;
  subject: string | null;
  format: string;
  percent: number;
  status: string;
  locatorJson: string | null;
  updatedAt: Date;
};

export type UserHistoryRow = UserContinueRow & {
  finishedAt: Date | null;
  startedAt: Date;
};

export type UserReadingStats = {
  booksFinished: number;
  booksReading: number;
  totalPagesRead: number;
  pagesThisMonth: number;
  pagesToday: number;
  readingStreakDays: number;
};

export type UserAnnotationRow = {
  id: number;
  locator: unknown;
  label: string | null;
  noteText: string | null;
  kind: string;
  color: string | null;
  createdAt: Date;
};

export type BookReviewRow = {
  id: number;
  userId: number;
  userName: string | null;
  rating: number;
  comment: string | null;
  visibility: string;
  createdAt: Date;
};

export async function getUserReadingProgress(userId: number, bookId: number) {
  const [row] = await db
    .select()
    .from(libraryUserProgress)
    .where(and(eq(libraryUserProgress.userId, userId), eq(libraryUserProgress.bookId, bookId)))
    .limit(1);
  return row ?? null;
}

export async function saveUserReadingProgress(input: {
  userId: number;
  bookId: number;
  locatorJson?: string;
  percent?: number;
  pagesRead?: number;
}) {
  const now = new Date();
  const percent = Math.min(100, Math.max(0, input.percent ?? 0));
  const status = percent >= 100 ? "finished" : percent > 0 ? "reading" : "reading";

  const [existing] = await db
    .select({ id: libraryUserProgress.id, pagesRead: libraryUserProgress.pagesRead })
    .from(libraryUserProgress)
    .where(
      and(eq(libraryUserProgress.userId, input.userId), eq(libraryUserProgress.bookId, input.bookId))
    )
    .limit(1);

  const pagesRead = Math.max(existing?.pagesRead ?? 0, input.pagesRead ?? 0);

  const values = {
    locatorJson: input.locatorJson ?? null,
    percent,
    status,
    pagesRead,
    updatedAt: now,
    finishedAt: percent >= 100 ? now : null,
  };

  if (existing) {
    await db.update(libraryUserProgress).set(values).where(eq(libraryUserProgress.id, existing.id));
  } else {
    await db.insert(libraryUserProgress).values({
      userId: input.userId,
      bookId: input.bookId,
      startedAt: now,
      ...values,
    });
  }

  const stats = await getUserReadingStats(input.userId);
  const { awardReadingBadges } = await import("@/lib/library/badges.server");
  await awardReadingBadges({ userId: input.userId, stats });
}

export async function listUserContinueReading(
  userId: number,
  limit = 8
): Promise<UserContinueRow[]> {
  const rows = await db
    .select({
      bookId: libraryBooks.id,
      title: libraryBooks.title,
      author: libraryBooks.author,
      coverUrl: libraryBooks.coverUrl,
      subject: libraryBooks.subject,
      format: libraryBooks.format,
      percent: libraryUserProgress.percent,
      status: libraryUserProgress.status,
      locatorJson: libraryUserProgress.locatorJson,
      updatedAt: libraryUserProgress.updatedAt,
    })
    .from(libraryUserProgress)
    .innerJoin(libraryBooks, eq(libraryBooks.id, libraryUserProgress.bookId))
    .where(
      and(
        eq(libraryUserProgress.userId, userId),
        gt(libraryUserProgress.percent, 0),
        lt(libraryUserProgress.percent, 100)
      )
    )
    .orderBy(desc(libraryUserProgress.updatedAt))
    .limit(limit);

  return rows;
}

export async function listUserReadingHistory(
  userId: number,
  limit = 24
): Promise<UserHistoryRow[]> {
  const rows = await db
    .select({
      bookId: libraryBooks.id,
      title: libraryBooks.title,
      author: libraryBooks.author,
      coverUrl: libraryBooks.coverUrl,
      subject: libraryBooks.subject,
      format: libraryBooks.format,
      percent: libraryUserProgress.percent,
      status: libraryUserProgress.status,
      locatorJson: libraryUserProgress.locatorJson,
      updatedAt: libraryUserProgress.updatedAt,
      startedAt: libraryUserProgress.startedAt,
      finishedAt: libraryUserProgress.finishedAt,
    })
    .from(libraryUserProgress)
    .innerJoin(libraryBooks, eq(libraryBooks.id, libraryUserProgress.bookId))
    .where(and(eq(libraryUserProgress.userId, userId), gt(libraryUserProgress.percent, 0)))
    .orderBy(desc(libraryUserProgress.updatedAt))
    .limit(limit);

  return rows;
}

export async function listUserProgressMap(
  userId: number,
  bookIds: number[]
): Promise<Map<number, number>> {
  if (!bookIds.length) return new Map();
  const rows = await db
    .select({
      bookId: libraryUserProgress.bookId,
      percent: libraryUserProgress.percent,
    })
    .from(libraryUserProgress)
    .where(
      and(eq(libraryUserProgress.userId, userId), inArray(libraryUserProgress.bookId, bookIds))
    );
  return new Map(rows.map((r) => [r.bookId, r.percent]));
}

export async function getUserReadingStats(userId: number): Promise<UserReadingStats> {
  const progressRows = await db
    .select({
      status: libraryUserProgress.status,
      percent: libraryUserProgress.percent,
      pagesRead: libraryUserProgress.pagesRead,
    })
    .from(libraryUserProgress)
    .where(eq(libraryUserProgress.userId, userId));

  const booksFinished = progressRows.filter((r) => r.status === "finished" || r.percent >= 100).length;
  const booksReading = progressRows.filter((r) => r.percent > 0 && r.percent < 100).length;
  const totalPagesRead = progressRows.reduce((s, r) => s + (r.pagesRead ?? 0), 0);

  const [monthRow] = await db
    .select({ total: sql<number>`coalesce(sum(${libraryReadingSessions.pagesDelta}), 0)::int` })
    .from(libraryReadingSessions)
    .where(
      and(
        eq(libraryReadingSessions.userId, userId),
        gt(libraryReadingSessions.startedAt, sql`date_trunc('month', NOW())`)
      )
    );

  const [todayRow] = await db
    .select({ total: sql<number>`coalesce(sum(${libraryReadingSessions.pagesDelta}), 0)::int` })
    .from(libraryReadingSessions)
    .where(
      and(
        eq(libraryReadingSessions.userId, userId),
        gt(libraryReadingSessions.startedAt, sql`date_trunc('day', NOW())`)
      )
    );

  const sessionDays = await db
    .select({ day: sql<string>`distinct date(${libraryReadingSessions.startedAt})::text` })
    .from(libraryReadingSessions)
    .where(and(eq(libraryReadingSessions.userId, userId), gt(libraryReadingSessions.pagesDelta, 0)));

  const progressDays = await db
    .select({ day: sql<string>`distinct date(${libraryUserProgress.updatedAt})::text` })
    .from(libraryUserProgress)
    .where(and(eq(libraryUserProgress.userId, userId), gt(libraryUserProgress.percent, 0)));

  const dayKeys = [
    ...sessionDays.map((r) => r.day),
    ...progressDays.map((r) => r.day),
  ].filter(Boolean);

  return {
    booksFinished,
    booksReading,
    totalPagesRead,
    pagesThisMonth: monthRow?.total ?? 0,
    pagesToday: todayRow?.total ?? 0,
    readingStreakDays: computeReadingStreakFromDayKeys(dayKeys),
  };
}

export async function recordReadingSession(input: {
  userId: number;
  bookId: number;
  childId?: number | null;
  pagesDelta?: number;
  durationSec?: number;
}) {
  await db.insert(libraryReadingSessions).values({
    userId: input.userId,
    bookId: input.bookId,
    childId: input.childId ?? null,
    pagesDelta: input.pagesDelta ?? 0,
    durationSec: input.durationSec ?? 0,
    endedAt: new Date(),
  });
}

export async function listUserAnnotations(
  userId: number,
  bookId: number
): Promise<UserAnnotationRow[]> {
  const rows = await db
    .select()
    .from(libraryUserAnnotations)
    .where(
      and(eq(libraryUserAnnotations.userId, userId), eq(libraryUserAnnotations.bookId, bookId))
    )
    .orderBy(desc(libraryUserAnnotations.createdAt));

  return rows.map((r) => ({
    id: r.id,
    locator: JSON.parse(r.locatorJson),
    label: r.label,
    noteText: r.noteText,
    kind: r.kind,
    color: r.color,
    createdAt: r.createdAt,
  }));
}

export async function addUserAnnotation(input: {
  userId: number;
  bookId: number;
  locator: unknown;
  label?: string;
  noteText?: string;
  kind?: string;
  color?: string;
}) {
  const [row] = await db
    .insert(libraryUserAnnotations)
    .values({
      userId: input.userId,
      bookId: input.bookId,
      locatorJson: JSON.stringify(input.locator),
      label: input.label?.trim() || null,
      noteText: input.noteText?.trim() || null,
      kind: input.kind || "bookmark",
      color: input.color || null,
    })
    .returning({ id: libraryUserAnnotations.id });
  return row.id;
}

export async function deleteUserAnnotation(userId: number, bookId: number, annotationId: number) {
  await db
    .delete(libraryUserAnnotations)
    .where(
      and(
        eq(libraryUserAnnotations.id, annotationId),
        eq(libraryUserAnnotations.userId, userId),
        eq(libraryUserAnnotations.bookId, bookId)
      )
    );
}

export async function upsertBookReview(input: {
  userId: number;
  bookId: number;
  rating: number;
  comment?: string;
  visibility?: string;
}) {
  const now = new Date();
  const rating = Math.min(5, Math.max(1, input.rating));
  const [existing] = await db
    .select({ id: libraryReviews.id })
    .from(libraryReviews)
    .where(and(eq(libraryReviews.userId, input.userId), eq(libraryReviews.bookId, input.bookId)))
    .limit(1);

  const values = {
    rating,
    comment: input.comment?.trim() || null,
    visibility: input.visibility || "private",
    updatedAt: now,
  };

  if (existing) {
    await db.update(libraryReviews).set(values).where(eq(libraryReviews.id, existing.id));
  } else {
    await db.insert(libraryReviews).values({
      userId: input.userId,
      bookId: input.bookId,
      ...values,
      createdAt: now,
    });
  }
}

export async function getUserBookReview(userId: number, bookId: number) {
  const [row] = await db
    .select()
    .from(libraryReviews)
    .where(and(eq(libraryReviews.userId, userId), eq(libraryReviews.bookId, bookId)))
    .limit(1);
  return row ?? null;
}

export async function listBookReviewsForTeachers(
  bookId: number,
  limit = 12
): Promise<BookReviewRow[]> {
  const rows = await db
    .select({
      id: libraryReviews.id,
      userId: libraryReviews.userId,
      userName: users.fullName,
      rating: libraryReviews.rating,
      comment: libraryReviews.comment,
      visibility: libraryReviews.visibility,
      createdAt: libraryReviews.createdAt,
    })
    .from(libraryReviews)
    .innerJoin(users, eq(users.id, libraryReviews.userId))
    .where(
      and(
        eq(libraryReviews.bookId, bookId),
        inArray(libraryReviews.visibility, ["school", "teachers"])
      )
    )
    .orderBy(desc(libraryReviews.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    userId: r.userId,
    userName: r.userName,
    rating: r.rating,
    comment: r.comment,
    visibility: r.visibility,
    createdAt: r.createdAt,
  }));
}

export async function listBookAnnexes(bookId: number) {
  return db
    .select()
    .from(libraryBookAnnexes)
    .where(eq(libraryBookAnnexes.bookId, bookId))
    .orderBy(libraryBookAnnexes.sortOrder);
}

export async function listRecommendationsForUser(
  userId: number,
  limit = 6
): Promise<LibraryBookRow[]> {
  const recent = await db
    .select({ subject: libraryBooks.subject })
    .from(libraryUserProgress)
    .innerJoin(libraryBooks, eq(libraryBooks.id, libraryUserProgress.bookId))
    .where(eq(libraryUserProgress.userId, userId))
    .orderBy(desc(libraryUserProgress.updatedAt))
    .limit(3);

  const subjects = [...new Set(recent.map((r) => r.subject).filter(Boolean))] as string[];
  if (!subjects.length) {
    const fallback = await db
      .select()
      .from(libraryBooks)
      .where(eq(libraryBooks.isPublished, true))
      .orderBy(desc(libraryBooks.createdAt))
      .limit(limit);
    return fallback.map((r) => ({
      id: r.id,
      title: r.title,
      author: r.author,
      description: r.description,
      format: r.format,
      fileUrl: r.fileUrl,
      coverUrl: r.coverUrl,
      ageMin: r.ageMin,
      ageMax: r.ageMax,
      subject: r.subject,
      language: r.language,
      audience: (r.audience as "teachers" | "parents" | "family") || "family",
      isPublished: r.isPublished,
      isFeatured: r.isFeatured,
      pageCount: r.pageCount,
      calibreId: r.calibreId,
      createdAt: r.createdAt,
    }));
  }

  const rows = await db
    .select()
    .from(libraryBooks)
    .where(and(eq(libraryBooks.isPublished, true), inArray(libraryBooks.subject, subjects)))
    .orderBy(desc(libraryBooks.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    title: r.title,
    author: r.author,
    description: r.description,
    format: r.format,
    fileUrl: r.fileUrl,
    coverUrl: r.coverUrl,
    ageMin: r.ageMin,
    ageMax: r.ageMax,
    subject: r.subject,
    language: r.language,
    audience: (r.audience as "teachers" | "parents" | "family") || "family",
    isPublished: r.isPublished,
    isFeatured: r.isFeatured,
    pageCount: r.pageCount,
    calibreId: r.calibreId,
    createdAt: r.createdAt,
  }));
}

export type DailyReadingPoint = { date: string; pages: number };

export async function getDailyReadingStats(userId: number, days = 30): Promise<DailyReadingPoint[]> {
  const rows = await db
    .select({
      day: sql<string>`date_trunc('day', ${libraryReadingSessions.startedAt})::date::text`,
      pages: sql<number>`coalesce(sum(${libraryReadingSessions.pagesDelta}), 0)::int`,
    })
    .from(libraryReadingSessions)
    .where(
      and(
        eq(libraryReadingSessions.userId, userId),
        gt(libraryReadingSessions.startedAt, sql`NOW() - (${days} || ' days')::interval`)
      )
    )
    .groupBy(sql`date_trunc('day', ${libraryReadingSessions.startedAt})`)
    .orderBy(sql`date_trunc('day', ${libraryReadingSessions.startedAt})`);

  return rows.map((r) => ({ date: r.day, pages: r.pages }));
}

export async function exportAnnotationsMarkdown(
  userId: number,
  bookId: number,
  bookTitle: string
): Promise<string> {
  const rows = await listUserAnnotations(userId, bookId);
  const lines = [`# Annotations — ${bookTitle}`, "", `Exporté le ${new Date().toLocaleDateString("fr-FR")}`, ""];

  for (const row of rows) {
    const kind =
      row.kind === "highlight"
        ? "Surlignage"
        : row.kind === "underline"
          ? "Soulignement"
          : row.kind === "note"
            ? "Note"
            : "Signet";
    lines.push(`## ${kind}${row.label ? ` : ${row.label}` : ""}`);
    if (row.noteText) lines.push(row.noteText);
    lines.push("");
  }

  if (rows.length === 0) lines.push("_Aucune annotation._");
  return lines.join("\n");
}

export async function exportAnnotationsPdf(
  userId: number,
  bookId: number,
  bookTitle: string
): Promise<Buffer> {
  const rows = await listUserAnnotations(userId, bookId);
  assertPdfKitDataAvailable();

  return new Promise((resolve, reject) => {
    const doc = createPdfDocument({ margin: 50 });
    const chunks: Buffer[] = [];
    doc.on("data", (c: Buffer) => chunks.push(c));
    doc.on("end", () => resolve(Buffer.concat(chunks)));
    doc.on("error", reject);

    doc.fontSize(18).text(`Annotations — ${bookTitle}`, { underline: true });
    doc.moveDown();
    doc.fontSize(10).fillColor("#666").text(`Exporté le ${new Date().toLocaleDateString("fr-FR")}`);
    doc.moveDown();

    if (rows.length === 0) {
      doc.fontSize(12).fillColor("#000").text("Aucune annotation.");
    } else {
      for (const row of rows) {
        const kind =
          row.kind === "highlight"
            ? "Surlignage"
            : row.kind === "underline"
              ? "Soulignement"
              : row.kind === "note"
                ? "Note"
                : "Signet";
        doc.fontSize(13).fillColor("#111").text(`${kind}${row.label ? ` : ${row.label}` : ""}`, {
          continued: false,
        });
        if (row.color) doc.fontSize(9).fillColor("#888").text(`Couleur : ${row.color}`);
        if (row.noteText) doc.fontSize(11).fillColor("#333").text(row.noteText);
        doc.moveDown(0.8);
      }
    }

    doc.end();
  });
}

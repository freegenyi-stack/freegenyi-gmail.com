import { db } from "@/db";
import { libraryBooks, libraryReadingProgress, libraryAssignments, children } from "@/db/schema";
import type { LibraryAudience } from "@/lib/library/audience";
import { desc, eq, and, inArray, gt, lt, or, isNull } from "drizzle-orm";

const READABLE_FORMATS = ["epub", "pdf"] as const;
export type LibraryBookFormat = (typeof READABLE_FORMATS)[number];

export type LibraryBookRow = {
  id: number;
  title: string;
  author: string | null;
  description: string | null;
  format: string;
  fileUrl: string | null;
  coverUrl: string | null;
  ageMin: number | null;
  ageMax: number | null;
  subject: string | null;
  language: string | null;
  audience: LibraryAudience;
  isPublished: boolean;
  isFeatured: boolean;
  pageCount: number | null;
  calibreId: string | null;
  createdAt: Date;
};

function mapRow(row: typeof libraryBooks.$inferSelect): LibraryBookRow {
  const audience = row.audience as LibraryAudience;
  return {
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description,
    format: row.format,
    fileUrl: row.fileUrl,
    coverUrl: row.coverUrl,
    ageMin: row.ageMin,
    ageMax: row.ageMax,
    subject: row.subject,
    language: row.language,
    audience: audience === "teachers" || audience === "parents" ? audience : "family",
    isPublished: row.isPublished,
    isFeatured: row.isFeatured,
    pageCount: row.pageCount,
    calibreId: row.calibreId,
    createdAt: row.createdAt,
  };
}

function publishedBookConditions(audiences?: LibraryAudience[]) {
  const conditions = [
    eq(libraryBooks.isPublished, true),
    inArray(libraryBooks.format, [...READABLE_FORMATS]),
  ];
  if (audiences?.length) {
    conditions.push(inArray(libraryBooks.audience, audiences));
  }
  return and(...conditions);
}

export async function listPublishedBooks(
  limit = 48,
  audiences?: LibraryAudience[]
): Promise<LibraryBookRow[]> {
  const rows = await db
    .select()
    .from(libraryBooks)
    .where(publishedBookConditions(audiences))
    .orderBy(desc(libraryBooks.createdAt))
    .limit(limit);
  return rows.map(mapRow);
}

export async function listAllBooks(limit = 100): Promise<LibraryBookRow[]> {
  const rows = await db
    .select()
    .from(libraryBooks)
    .orderBy(desc(libraryBooks.createdAt))
    .limit(limit);
  return rows.map(mapRow);
}

export async function countPublishedBooks(): Promise<number> {
  const rows = await db
    .select({ id: libraryBooks.id })
    .from(libraryBooks)
    .where(eq(libraryBooks.isPublished, true));
  return rows.length;
}

export async function getBookByCalibreId(calibreId: string): Promise<LibraryBookRow | null> {
  const [row] = await db
    .select()
    .from(libraryBooks)
    .where(eq(libraryBooks.calibreId, calibreId))
    .limit(1);
  return row ? mapRow(row) : null;
}

export async function upsertLibraryBook(input: {
  id?: number;
  title: string;
  author?: string;
  description?: string;
  format?: LibraryBookFormat;
  fileUrl?: string;
  coverUrl?: string;
  ageMin?: number | null;
  ageMax?: number | null;
  subject?: string;
  language?: string;
  audience?: LibraryAudience;
  isPublished?: boolean;
  pageCount?: number | null;
  calibreId?: string | null;
}): Promise<{ id: number }> {
  const now = new Date();
  const existing = input.id ? await getBookById(input.id) : null;
  const values = {
    title: input.title.trim(),
    author: input.author?.trim() || null,
    description: input.description?.trim() || null,
    format: input.format ?? existing?.format ?? "epub",
    fileUrl: input.fileUrl?.trim() || null,
    coverUrl: input.coverUrl?.trim() || null,
    ageMin: input.ageMin ?? null,
    ageMax: input.ageMax ?? null,
    subject: input.subject?.trim() || null,
    language: input.language || "fr",
    audience: input.audience || "family",
    isPublished: input.isPublished ?? false,
    pageCount: input.pageCount ?? existing?.pageCount ?? null,
    calibreId: input.calibreId ?? null,
    updatedAt: now,
  };

  if (input.id) {
    await db.update(libraryBooks).set(values).where(eq(libraryBooks.id, input.id));
    return { id: input.id };
  }

  const [row] = await db
    .insert(libraryBooks)
    .values({ ...values, createdAt: now })
    .returning({ id: libraryBooks.id });
  return { id: row.id };
}

export async function getPublishedBookById(
  id: number,
  audiences?: LibraryAudience[]
): Promise<LibraryBookRow | null> {
  const conditions = [eq(libraryBooks.id, id), eq(libraryBooks.isPublished, true), inArray(libraryBooks.format, [...READABLE_FORMATS])];
  if (audiences?.length) conditions.push(inArray(libraryBooks.audience, audiences));

  const [row] = await db
    .select()
    .from(libraryBooks)
    .where(and(...conditions))
    .limit(1);
  return row ? mapRow(row) : null;
}

export async function getBookById(id: number): Promise<LibraryBookRow | null> {
  const [row] = await db.select().from(libraryBooks).where(eq(libraryBooks.id, id)).limit(1);
  return row ? mapRow(row) : null;
}

export async function saveReadingProgress(input: {
  childId: number;
  bookId: number;
  location?: string;
  locatorJson?: string;
  percent?: number;
}) {
  const now = new Date();
  const existing = await db
    .select({ id: libraryReadingProgress.id })
    .from(libraryReadingProgress)
    .where(
      and(
        eq(libraryReadingProgress.childId, input.childId),
        eq(libraryReadingProgress.bookId, input.bookId)
      )
    )
    .limit(1);

  const values = {
    location: input.location ?? null,
    locatorJson: input.locatorJson ?? null,
    percent: input.percent ?? 0,
    updatedAt: now,
  };

  if (existing.length > 0) {
    await db
      .update(libraryReadingProgress)
      .set(values)
      .where(eq(libraryReadingProgress.id, existing[0].id));
  } else {
    await db.insert(libraryReadingProgress).values({
      childId: input.childId,
      bookId: input.bookId,
      ...values,
    });
  }

  const percent = input.percent ?? 0;
  if (percent >= 100) {
    const { awardChildBadges } = await import("@/lib/library/badges.server");
    await awardChildBadges(input.childId);
  }
}

export async function getReadingProgress(childId: number, bookId: number) {
  const [row] = await db
    .select()
    .from(libraryReadingProgress)
    .where(
      and(
        eq(libraryReadingProgress.childId, childId),
        eq(libraryReadingProgress.bookId, bookId)
      )
    )
    .limit(1);
  return row ?? null;
}

export async function toggleBookPublished(id: number, isPublished: boolean): Promise<void> {
  await db
    .update(libraryBooks)
    .set({ isPublished, updatedAt: new Date() })
    .where(eq(libraryBooks.id, id));
}

export type TeacherSchoolChild = {
  id: number;
  fullName: string;
  schoolName: string | null;
  educationLevel: string | null;
};

export async function listTeacherSchoolChildren(teacherSchoolId: number): Promise<TeacherSchoolChild[]> {
  const rows = await db
    .select({
      id: children.id,
      fullName: children.fullName,
      schoolName: children.schoolName,
      educationLevel: children.educationLevel,
    })
    .from(children)
    .where(eq(children.schoolId, teacherSchoolId))
    .orderBy(children.fullName);
  return rows;
}

export type LibraryAssignmentRow = {
  id: number;
  bookId: number;
  bookTitle: string;
  childId: number | null;
  childName: string | null;
  note: string | null;
  createdAt: Date;
};

export async function listTeacherAssignments(teacherId: number, limit = 50): Promise<LibraryAssignmentRow[]> {
  const rows = await db
    .select({
      id: libraryAssignments.id,
      bookId: libraryAssignments.bookId,
      bookTitle: libraryBooks.title,
      childId: libraryAssignments.childId,
      childName: children.fullName,
      note: libraryAssignments.note,
      createdAt: libraryAssignments.createdAt,
    })
    .from(libraryAssignments)
    .innerJoin(libraryBooks, eq(libraryAssignments.bookId, libraryBooks.id))
    .leftJoin(children, eq(libraryAssignments.childId, children.id))
    .where(eq(libraryAssignments.teacherId, teacherId))
    .orderBy(desc(libraryAssignments.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    bookId: r.bookId,
    bookTitle: r.bookTitle,
    childId: r.childId,
    childName: r.childName,
    note: r.note,
    createdAt: r.createdAt,
  }));
}

export async function createLibraryAssignment(input: {
  teacherId: number;
  bookId: number;
  childId?: number | null;
  note?: string | null;
}) {
  const [book] = await db
    .select({ id: libraryBooks.id })
    .from(libraryBooks)
    .where(and(eq(libraryBooks.id, input.bookId), eq(libraryBooks.isPublished, true)))
    .limit(1);
  if (!book) return { error: "Livre introuvable." };

  if (input.childId) {
    const [child] = await db.select({ id: children.id }).from(children).where(eq(children.id, input.childId)).limit(1);
    if (!child) return { error: "Élève introuvable." };
  }

  await db.insert(libraryAssignments).values({
    teacherId: input.teacherId,
    bookId: input.bookId,
    childId: input.childId ?? null,
    note: input.note?.trim() || null,
  });

  return { success: true };
}

export type FamilyAssignmentRow = {
  assignmentId: number;
  bookId: number;
  bookTitle: string;
  bookAuthor: string | null;
  bookSubject: string | null;
  bookLanguage: string | null;
  childId: number | null;
  childName: string | null;
  teacherName: string | null;
  note: string | null;
  createdAt: Date;
};

export async function listFamilyLibraryAssignments(
  childIds: number[],
  limit = 50
): Promise<FamilyAssignmentRow[]> {
  if (childIds.length === 0) return [];

  const { inArray, or, isNull } = await import("drizzle-orm");
  const { users } = await import("@/db/schema");

  const rows = await db
    .select({
      assignmentId: libraryAssignments.id,
      bookId: libraryAssignments.bookId,
      bookTitle: libraryBooks.title,
      bookAuthor: libraryBooks.author,
      bookSubject: libraryBooks.subject,
      bookLanguage: libraryBooks.language,
      childId: libraryAssignments.childId,
      childName: children.fullName,
      teacherName: users.fullName,
      note: libraryAssignments.note,
      createdAt: libraryAssignments.createdAt,
    })
    .from(libraryAssignments)
    .innerJoin(libraryBooks, eq(libraryAssignments.bookId, libraryBooks.id))
    .leftJoin(children, eq(libraryAssignments.childId, children.id))
    .innerJoin(users, eq(libraryAssignments.teacherId, users.id))
    .where(
      and(
        eq(libraryBooks.isPublished, true),
        or(inArray(libraryAssignments.childId, childIds), isNull(libraryAssignments.childId))
      )
    )
    .orderBy(desc(libraryAssignments.createdAt))
    .limit(limit);

  return rows.map((r) => ({
    assignmentId: r.assignmentId,
    bookId: r.bookId,
    bookTitle: r.bookTitle,
    bookAuthor: r.bookAuthor,
    bookSubject: r.bookSubject,
    bookLanguage: r.bookLanguage,
    childId: r.childId,
    childName: r.childName,
    teacherName: r.teacherName,
    note: r.note,
    createdAt: r.createdAt,
  }));
}

export function teacherSchoolIdFromMetadata(metadata: unknown): number | null {
  let meta: Record<string, unknown> = {};
  if (typeof metadata === "string") {
    try {
      meta = JSON.parse(metadata || "{}") as Record<string, unknown>;
    } catch {
      meta = {};
    }
  } else if (metadata && typeof metadata === "object") {
    meta = metadata as Record<string, unknown>;
  }
  const raw = meta.teacherSchoolId ?? meta.schoolId;
  if (raw == null || raw === "") return null;
  const n = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  return Number.isNaN(n) ? null : n;
}

export type ContinueReadingRow = {
  bookId: number;
  title: string;
  author: string | null;
  coverUrl: string | null;
  subject: string | null;
  format: string;
  percent: number;
  childId: number;
  childName: string;
  locatorJson: string | null;
  updatedAt: Date;
};

export async function listContinueReading(
  childIds: number[],
  limit = 8
): Promise<ContinueReadingRow[]> {
  if (!childIds.length) return [];

  const rows = await db
    .select({
      bookId: libraryBooks.id,
      title: libraryBooks.title,
      author: libraryBooks.author,
      coverUrl: libraryBooks.coverUrl,
      subject: libraryBooks.subject,
      format: libraryBooks.format,
      percent: libraryReadingProgress.percent,
      childId: libraryReadingProgress.childId,
      childName: children.fullName,
      locatorJson: libraryReadingProgress.locatorJson,
      updatedAt: libraryReadingProgress.updatedAt,
    })
    .from(libraryReadingProgress)
    .innerJoin(libraryBooks, eq(libraryBooks.id, libraryReadingProgress.bookId))
    .innerJoin(children, eq(children.id, libraryReadingProgress.childId))
    .where(
      and(
        inArray(libraryReadingProgress.childId, childIds),
        gt(libraryReadingProgress.percent, 0),
        lt(libraryReadingProgress.percent, 100)
      )
    )
    .orderBy(desc(libraryReadingProgress.updatedAt))
    .limit(limit);

  return rows;
}

export async function listProgressForBooks(
  childIds: number[],
  bookIds: number[]
): Promise<Map<number, number>> {
  if (!childIds.length || !bookIds.length) return new Map();

  const rows = await db
    .select({
      bookId: libraryReadingProgress.bookId,
      percent: libraryReadingProgress.percent,
    })
    .from(libraryReadingProgress)
    .where(
      and(
        inArray(libraryReadingProgress.childId, childIds),
        inArray(libraryReadingProgress.bookId, bookIds)
      )
    );

  const map = new Map<number, number>();
  for (const row of rows) {
    const prev = map.get(row.bookId) ?? 0;
    if (row.percent > prev) map.set(row.bookId, row.percent);
  }
  return map;
}

export async function listChildAssignedBooks(childId: number, limit = 48): Promise<LibraryBookRow[]> {
  const rows = await db
    .select({
      id: libraryBooks.id,
      title: libraryBooks.title,
      author: libraryBooks.author,
      description: libraryBooks.description,
      format: libraryBooks.format,
      fileUrl: libraryBooks.fileUrl,
      coverUrl: libraryBooks.coverUrl,
      ageMin: libraryBooks.ageMin,
      ageMax: libraryBooks.ageMax,
      subject: libraryBooks.subject,
      language: libraryBooks.language,
      audience: libraryBooks.audience,
      isPublished: libraryBooks.isPublished,
      isFeatured: libraryBooks.isFeatured,
      pageCount: libraryBooks.pageCount,
      calibreId: libraryBooks.calibreId,
      createdAt: libraryBooks.createdAt,
    })
    .from(libraryAssignments)
    .innerJoin(libraryBooks, eq(libraryBooks.id, libraryAssignments.bookId))
    .where(
      and(
        or(eq(libraryAssignments.childId, childId), isNull(libraryAssignments.childId)),
        eq(libraryBooks.isPublished, true),
        inArray(libraryBooks.format, [...READABLE_FORMATS]),
        eq(libraryBooks.audience, "family")
      )
    )
    .orderBy(desc(libraryAssignments.createdAt))
    .limit(limit);

  return rows.map((row) => ({
    id: row.id,
    title: row.title,
    author: row.author,
    description: row.description,
    format: row.format,
    fileUrl: row.fileUrl,
    coverUrl: row.coverUrl,
    ageMin: row.ageMin,
    ageMax: row.ageMax,
    subject: row.subject,
    language: row.language,
    audience: (row.audience as LibraryAudience) || "family",
    isPublished: row.isPublished,
    isFeatured: row.isFeatured,
    pageCount: row.pageCount,
    calibreId: row.calibreId,
    createdAt: row.createdAt,
  }));
}

export type SchoolReadingRow = {
  childId: number;
  childName: string;
  bookId: number;
  bookTitle: string;
  percent: number;
  updatedAt: Date;
};

export type SchoolReadingSummary = {
  activeReaders: number;
  booksInProgress: number;
  avgPercent: number;
};

export function summarizeSchoolReading(rows: SchoolReadingRow[]): SchoolReadingSummary {
  if (rows.length === 0) return { activeReaders: 0, booksInProgress: 0, avgPercent: 0 };
  const childIds = new Set(rows.map((r) => r.childId));
  const bookIds = new Set(rows.map((r) => r.bookId));
  const avgPercent = Math.round(rows.reduce((sum, r) => sum + r.percent, 0) / rows.length);
  return { activeReaders: childIds.size, booksInProgress: bookIds.size, avgPercent };
}

export async function listSchoolReadingOverview(schoolId: number, limit = 100): Promise<SchoolReadingRow[]> {
  const rows = await db
    .select({
      childId: libraryReadingProgress.childId,
      childName: children.fullName,
      bookId: libraryReadingProgress.bookId,
      bookTitle: libraryBooks.title,
      percent: libraryReadingProgress.percent,
      updatedAt: libraryReadingProgress.updatedAt,
    })
    .from(libraryReadingProgress)
    .innerJoin(children, eq(libraryReadingProgress.childId, children.id))
    .innerJoin(libraryBooks, eq(libraryReadingProgress.bookId, libraryBooks.id))
    .where(eq(children.schoolId, schoolId))
    .orderBy(desc(libraryReadingProgress.updatedAt))
    .limit(limit);

  return rows.map((r) => ({
    childId: r.childId,
    childName: r.childName,
    bookId: r.bookId,
    bookTitle: r.bookTitle,
    percent: r.percent,
    updatedAt: r.updatedAt,
  }));
}

import { db } from "@/db";
import {
  libraryBooks,
  libraryReadingProgress,
  libraryUserProgress,
} from "@/db/schema";
import type { LibraryAudience } from "@/lib/library/audience";
import type { LibraryBookRow } from "@/lib/library/books.server";
import { desc, eq, sql, and, gt, inArray } from "drizzle-orm";

function mapBook(row: typeof libraryBooks.$inferSelect): LibraryBookRow {
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

function publishedFilter(audiences?: LibraryAudience[]) {
  const parts = [eq(libraryBooks.isPublished, true), inArray(libraryBooks.format, ["epub", "pdf"])];
  if (audiences?.length) parts.push(inArray(libraryBooks.audience, audiences));
  return and(...parts);
}

export type LibraryDiscovery = {
  recent: LibraryBookRow[];
  trending: LibraryBookRow[];
  mostRead: LibraryBookRow[];
};

export async function getLibraryDiscovery(
  limit = 8,
  audiences?: LibraryAudience[]
): Promise<LibraryDiscovery> {
  const recent = await db
    .select()
    .from(libraryBooks)
    .where(publishedFilter(audiences))
    .orderBy(desc(libraryBooks.createdAt))
    .limit(limit);

  const trendingRows = await db
    .select({
      bookId: libraryUserProgress.bookId,
      score: sql<number>`count(*)::int`.as("score"),
    })
    .from(libraryUserProgress)
    .where(gt(libraryUserProgress.updatedAt, sql`NOW() - INTERVAL '7 days'`))
    .groupBy(libraryUserProgress.bookId)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);

  let trendingIds = trendingRows.map((r) => r.bookId);
  if (trendingIds.length === 0) {
    const childTrend = await db
      .select({
        bookId: libraryReadingProgress.bookId,
        score: sql<number>`count(*)::int`.as("score"),
      })
      .from(libraryReadingProgress)
      .where(gt(libraryReadingProgress.updatedAt, sql`NOW() - INTERVAL '7 days'`))
      .groupBy(libraryReadingProgress.bookId)
      .orderBy(desc(sql`count(*)`))
      .limit(limit);
    trendingIds = childTrend.map((r) => r.bookId);
  }

  const mostReadRows = await db
    .select({
      bookId: libraryUserProgress.bookId,
      score: sql<number>`count(*)::int`.as("score"),
    })
    .from(libraryUserProgress)
    .where(eq(libraryUserProgress.status, "finished"))
    .groupBy(libraryUserProgress.bookId)
    .orderBy(desc(sql`count(*)`))
    .limit(limit);

  let mostReadIds = mostReadRows.map((r) => r.bookId);
  if (mostReadIds.length === 0) {
    mostReadIds = recent.slice(0, limit).map((b) => b.id);
  }

  const fetchByIds = async (ids: number[]) => {
    if (!ids.length) return [] as LibraryBookRow[];
    const rows = await db
      .select()
      .from(libraryBooks)
      .where(and(publishedFilter(audiences), inArray(libraryBooks.id, ids)));
    const byId = new Map(rows.map((r) => [r.id, mapBook(r)]));
    return ids.map((id) => byId.get(id)).filter(Boolean) as LibraryBookRow[];
  };

  return {
    recent: recent.map(mapBook),
    trending: await fetchByIds(trendingIds),
    mostRead: await fetchByIds(mostReadIds),
  };
}

export async function listRelatedBooks(
  bookId: number,
  subject: string | null,
  audiences?: LibraryAudience[],
  limit = 6
): Promise<LibraryBookRow[]> {
  const base = subject
    ? and(publishedFilter(audiences), eq(libraryBooks.subject, subject))
    : publishedFilter(audiences);

  const rows = await db
    .select()
    .from(libraryBooks)
    .where(base)
    .orderBy(desc(libraryBooks.createdAt))
    .limit(limit + 1);

  return rows.filter((r) => r.id !== bookId).slice(0, limit).map(mapBook);
}

export function bookCoverSrc(book: { id: number; coverUrl: string | null }): string | null {
  if (!book.coverUrl) return null;
  if (book.coverUrl.startsWith("uploads://")) return `/api/library/books/${book.id}/cover`;
  return book.coverUrl;
}

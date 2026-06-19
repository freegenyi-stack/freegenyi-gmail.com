import { db } from "@/db";
import { libraryReadingProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import {
  getPublishedBookById,
  listChildAssignedBooks,
  listContinueReading,
  listProgressForBooks,
  saveReadingProgress,
  type LibraryBookRow,
} from "@/lib/library/books.server";
import { loadBookFileBuffer } from "@/lib/library/book-file.server";

export async function getMobileChildLibraryPayload(childId: number) {
  const [assigned, continueReading] = await Promise.all([
    listChildAssignedBooks(childId, 48),
    listContinueReading([childId], 8),
  ]);
  const progressMap = await listProgressForBooks(
    [childId],
    assigned.map((b) => b.id)
  );

  return {
    books: assigned.map((b) => mapBookRow(b, progressMap.get(b.id) ?? 0)),
    continueReading: continueReading.map((r) => ({
      bookId: r.bookId,
      title: r.title,
      author: r.author,
      format: r.format,
      percent: r.percent,
      coverPath: `/api/mobile/child/library/books/${r.bookId}/cover`,
    })),
  };
}

function mapBookRow(b: LibraryBookRow, percent: number) {
  return {
    id: b.id,
    title: b.title,
    author: b.author,
    format: b.format,
    subject: b.subject,
    language: b.language,
    pageCount: b.pageCount,
    percent,
    coverPath: `/api/mobile/child/library/books/${b.id}/cover`,
    filePath: `/api/mobile/child/library/books/${b.id}/file`,
  };
}

export async function assertMobileChildBookAccess(childId: number, bookId: number) {
  const book = await getPublishedBookById(bookId);
  if (!book?.fileUrl) return { error: "not_found" as const };

  const assigned = await listChildAssignedBooks(childId, 200);
  if (!assigned.some((b) => b.id === bookId)) return { error: "forbidden" as const };

  return { book };
}

export async function getMobileChildBookDetail(childId: number, bookId: number) {
  const access = await assertMobileChildBookAccess(childId, bookId);
  if ("error" in access) return access;

  const [progress] = await db
    .select({ percent: libraryReadingProgress.percent, locatorJson: libraryReadingProgress.locatorJson })
    .from(libraryReadingProgress)
    .where(and(eq(libraryReadingProgress.childId, childId), eq(libraryReadingProgress.bookId, bookId)))
    .limit(1);

  const b = access.book;
  return {
    book: {
      id: b.id,
      title: b.title,
      author: b.author,
      description: b.description,
      format: b.format,
      subject: b.subject,
      language: b.language,
      pageCount: b.pageCount,
      percent: progress?.percent ?? 0,
      locatorJson: progress?.locatorJson ?? null,
      coverPath: `/api/mobile/child/library/books/${b.id}/cover`,
      filePath: `/api/mobile/child/library/books/${b.id}/file`,
    },
  };
}

export async function saveMobileChildReadingProgress(input: {
  childId: number;
  bookId: number;
  percent?: number;
  locatorJson?: string;
  location?: string;
}) {
  const access = await assertMobileChildBookAccess(input.childId, input.bookId);
  if ("error" in access) return { error: access.error };

  await saveReadingProgress({
    childId: input.childId,
    bookId: input.bookId,
    percent: input.percent ?? 0,
    locatorJson: input.locatorJson,
    location: input.location,
  });

  return { ok: true as const };
}

export async function loadMobileChildBookFile(childId: number, bookId: number) {
  const access = await assertMobileChildBookAccess(childId, bookId);
  if ("error" in access) return { error: access.error };

  const book = access.book;
  if (book.format !== "pdf" && book.format !== "epub") return { error: "unsupported_format" as const };

  try {
    const buffer = await loadBookFileBuffer(book.fileUrl!);
    return {
      buffer,
      contentType: book.format === "pdf" ? "application/pdf" : "application/epub+zip",
      filename: `book-${bookId}.${book.format}`,
    };
  } catch {
    return { error: "download_error" as const };
  }
}

export async function loadMobileChildBookCover(childId: number, bookId: number) {
  const access = await assertMobileChildBookAccess(childId, bookId);
  if ("error" in access) return { error: access.error };

  const book = access.book;
  if (!book.coverUrl) return { error: "no_cover" as const };

  try {
    const buffer = await loadBookFileBuffer(book.coverUrl);
    return { buffer, contentType: "image/jpeg" };
  } catch {
    return { error: "download_error" as const };
  }
}

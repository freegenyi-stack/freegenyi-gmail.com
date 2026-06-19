import { getPublishedBookById } from "@/lib/library/books.server";
import { loadBookFileBuffer } from "@/lib/library/book-file.server";
import { assertLibraryBookAccess } from "@/lib/library/library-access.server";
import { LIBRARY_ERROR, libraryAccessHttpStatus } from "@/lib/library/library-errors";
import { NextResponse } from "next/server";

export async function GET(_req: Request, { params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  if (Number.isNaN(bookId)) {
    return NextResponse.json({ error: LIBRARY_ERROR.INVALID_BOOK }, { status: 400 });
  }

  const access = await assertLibraryBookAccess(bookId);
  if ("error" in access) {
    return NextResponse.json({ error: access.error }, { status: libraryAccessHttpStatus(access.error) });
  }

  const book = await getPublishedBookById(bookId);
  if (!book?.fileUrl || (book.format !== "epub" && book.format !== "pdf")) {
    return NextResponse.json({ error: LIBRARY_ERROR.BOOK_NOT_FOUND }, { status: 404 });
  }

  try {
    const buffer = await loadBookFileBuffer(book.fileUrl);
    const isPdf = book.format === "pdf";
    return new NextResponse(buffer, {
      headers: {
        "Content-Type": isPdf ? "application/pdf" : "application/epub+zip",
        "Content-Disposition": `inline; filename="book-${bookId}.${isPdf ? "pdf" : "epub"}"`,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: LIBRARY_ERROR.DOWNLOAD_ERROR }, { status: 502 });
  }
}

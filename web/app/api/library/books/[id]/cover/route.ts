import { NextResponse } from "next/server";
import { assertLibraryBookAccess } from "@/lib/library/library-access.server";
import { LIBRARY_ERROR, libraryAccessHttpStatus } from "@/lib/library/library-errors";
import { readLibraryCoverBuffer } from "@/lib/library/library-upload.server";
import { getPublishedBookById } from "@/lib/library/books.server";

const MIME: Record<string, string> = {
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".webp": "image/webp",
};

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
  if (book?.coverUrl?.startsWith("http")) {
    return NextResponse.redirect(book.coverUrl);
  }

  const stored = await readLibraryCoverBuffer(bookId);
  if (!stored) {
    return NextResponse.json({ error: "Pas de couverture" }, { status: 404 });
  }

  return new NextResponse(new Uint8Array(stored.buffer), {
    headers: {
      "Content-Type": MIME[stored.ext] ?? "image/jpeg",
      "Cache-Control": "public, max-age=86400",
    },
  });
}

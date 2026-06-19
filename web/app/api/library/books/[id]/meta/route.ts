import { NextRequest, NextResponse } from "next/server";
import { assertLibraryBookAccess } from "@/lib/library/library-access.server";
import { listBookAnnexes } from "@/lib/library/user-library.server";
import { listRelatedBooks } from "@/lib/library/discovery.server";
import { getPublishedBookById } from "@/lib/library/books.server";
import { listBookReviewsForTeachers } from "@/lib/library/user-library.server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const bookId = parseInt(id, 10);
  if (Number.isNaN(bookId)) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const access = await assertLibraryBookAccess(bookId);
  if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

  const book = await getPublishedBookById(bookId);
  if (!book) return NextResponse.json({ error: "Livre introuvable" }, { status: 404 });

  const [annexes, related, teacherReviews] = await Promise.all([
    listBookAnnexes(bookId),
    listRelatedBooks(bookId, book.subject),
    listBookReviewsForTeachers(bookId),
  ]);

  return NextResponse.json({
    book: { id: book.id, title: book.title, author: book.author, description: book.description },
    annexes,
    related,
    teacherReviews,
  });
}

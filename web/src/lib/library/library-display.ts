export function bookCoverSrc(book: { id: number; coverUrl: string | null }): string | null {
  if (!book.coverUrl) return null;
  if (book.coverUrl.startsWith("uploads://")) return `/api/library/books/${book.id}/cover`;
  return book.coverUrl;
}

/** Codes d'erreur bibliothèque — traduits côté client via Library.errors */
export type LibraryErrorCode =
  | "book_not_found"
  | "unauthorized"
  | "access_denied"
  | "child_not_found"
  | "invalid_book"
  | "download_error"
  | "title_required"
  | "file_required"
  | "pick_file_or_cover"
  | "upload_failed";

export const LIBRARY_ERROR = {
  BOOK_NOT_FOUND: "book_not_found",
  UNAUTHORIZED: "unauthorized",
  ACCESS_DENIED: "access_denied",
  CHILD_NOT_FOUND: "child_not_found",
  INVALID_BOOK: "invalid_book",
  DOWNLOAD_ERROR: "download_error",
  TITLE_REQUIRED: "title_required",
  FILE_REQUIRED: "file_required",
  PICK_FILE_OR_COVER: "pick_file_or_cover",
  UPLOAD_FAILED: "upload_failed",
} as const satisfies Record<string, LibraryErrorCode>;

export function libraryAccessHttpStatus(error: LibraryErrorCode): number {
  if (error === LIBRARY_ERROR.UNAUTHORIZED) return 401;
  if (error === LIBRARY_ERROR.ACCESS_DENIED) return 403;
  return 404;
}

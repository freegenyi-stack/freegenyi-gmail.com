import { mkdir, readFile, writeFile, unlink } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");
const LIBRARY_DIR = path.join(UPLOAD_ROOT, "library");
const COVER_DIR = path.join(LIBRARY_DIR, "covers");

const MAX_EPUB_BYTES = 80 * 1024 * 1024;
const MAX_PDF_BYTES = 80 * 1024 * 1024;
const MAX_COVER_BYTES = 5 * 1024 * 1024;

export function libraryEpubStorageKey(bookId: number): string {
  return `uploads://library/${bookId}.epub`;
}

export function libraryPdfStorageKey(bookId: number): string {
  return `uploads://library/${bookId}.pdf`;
}

export function libraryCoverStorageKey(bookId: number, ext: string): string {
  return `uploads://library/covers/${bookId}${ext}`;
}

function resolveUploadPath(storageKey: string): string | null {
  if (!storageKey.startsWith("uploads://")) return null;
  const rel = storageKey.slice("uploads://".length);
  if (rel.includes("..")) return null;
  const abs = path.join(UPLOAD_ROOT, rel);
  if (!abs.startsWith(UPLOAD_ROOT)) return null;
  return abs;
}

export async function saveLibraryEpub(bookId: number, file: File): Promise<string> {
  if (!file.name.toLowerCase().endsWith(".epub") && file.type !== "application/epub+zip") {
    throw new Error("Seuls les fichiers EPUB sont acceptés.");
  }
  if (file.size > MAX_EPUB_BYTES) {
    throw new Error("EPUB trop volumineux (max 80 Mo).");
  }

  await mkdir(LIBRARY_DIR, { recursive: true });
  const abs = path.join(LIBRARY_DIR, `${bookId}.epub`);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(abs, buffer);
  return libraryEpubStorageKey(bookId);
}

export async function saveLibraryPdf(bookId: number, file: File): Promise<string> {
  const name = file.name.toLowerCase();
  if (!name.endsWith(".pdf") && file.type !== "application/pdf") {
    throw new Error("pdf_only");
  }
  if (file.size > MAX_PDF_BYTES) {
    throw new Error("pdf_too_large");
  }

  await mkdir(LIBRARY_DIR, { recursive: true });
  const abs = path.join(LIBRARY_DIR, `${bookId}.pdf`);
  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(abs, buffer);
  return libraryPdfStorageKey(bookId);
}

export async function readLibraryPdfBuffer(bookId: number): Promise<Buffer | null> {
  const abs = path.join(LIBRARY_DIR, `${bookId}.pdf`);
  try {
    return await readFile(abs);
  } catch {
    return null;
  }
}

export async function saveLibraryCover(bookId: number, file: File): Promise<string> {
  const ext = path.extname(file.name).toLowerCase() || ".jpg";
  if (![".jpg", ".jpeg", ".png", ".webp"].includes(ext)) {
    throw new Error("Couverture : JPG, PNG ou WebP uniquement.");
  }
  if (file.size > MAX_COVER_BYTES) {
    throw new Error("Couverture trop volumineuse (max 5 Mo).");
  }

  await mkdir(COVER_DIR, { recursive: true });
  const abs = path.join(COVER_DIR, `${bookId}${ext}`);
  await writeFile(abs, Buffer.from(await file.arrayBuffer()));
  return libraryCoverStorageKey(bookId, ext);
}

export async function deleteLibraryFiles(bookId: number): Promise<void> {
  const epubPath = path.join(LIBRARY_DIR, `${bookId}.epub`);
  const pdfPath = path.join(LIBRARY_DIR, `${bookId}.pdf`);
  await unlink(epubPath).catch(() => undefined);
  await unlink(pdfPath).catch(() => undefined);
  for (const ext of [".jpg", ".jpeg", ".png", ".webp"]) {
    await unlink(path.join(COVER_DIR, `${bookId}${ext}`)).catch(() => undefined);
  }
}

export function resolveLibraryFilePath(fileUrl: string): string | null {
  return resolveUploadPath(fileUrl.trim());
}

export async function readLibraryFileBuffer(fileUrl: string): Promise<Buffer> {
  const abs = resolveUploadPath(fileUrl.trim());
  if (!abs) throw new Error("Chemin stockage invalide");
  return readFile(abs);
}

export async function readLibraryCoverBuffer(bookId: number): Promise<{ buffer: Buffer; ext: string } | null> {
  for (const ext of [".webp", ".jpg", ".jpeg", ".png"]) {
    const abs = path.join(COVER_DIR, `${bookId}${ext}`);
    try {
      const buffer = await readFile(abs);
      return { buffer, ext };
    } catch {
      /* try next */
    }
  }
  return null;
}

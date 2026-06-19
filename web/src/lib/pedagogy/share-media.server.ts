import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "pedagogy");
const MAX_FILE_SIZE = 12 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "application/msword",
  "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
  "text/plain",
]);

export type SavedPedagogyFile = {
  url: string;
  fileName: string;
  mimeType: string;
  fileSize: number;
};

function isAllowedMime(file: File): boolean {
  if (!file.type) {
    const ext = path.extname(file.name).toLowerCase();
    return [".pdf", ".jpg", ".jpeg", ".png", ".webp", ".doc", ".docx", ".txt"].includes(ext);
  }
  const base = file.type.split(";")[0]?.trim();
  return ALLOWED_TYPES.has(file.type) || (base ? ALLOWED_TYPES.has(base) : false);
}

export async function savePedagogyShareFile(userId: number, file: File): Promise<SavedPedagogyFile> {
  if (!file || file.size === 0) {
    throw new Error("Fichier manquant.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Fichier trop volumineux (max 12 Mo).");
  }
  if (!isAllowedMime(file)) {
    throw new Error("Format non accepté (PDF, images, Word, texte).");
  }

  const mime = file.type || "application/octet-stream";
  const ext =
    path.extname(file.name) ||
    (mime === "application/pdf"
      ? ".pdf"
      : mime === "text/plain"
        ? ".txt"
        : mime.startsWith("image/")
          ? ".jpg"
          : ".bin");
  const base =
    path.basename(file.name, path.extname(file.name)).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60) ||
    "fichier";
  const storedName = `${Date.now()}-${base}${ext}`;
  const dir = path.join(UPLOAD_ROOT, String(userId));
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, storedName), buffer);

  return {
    url: `/uploads/pedagogy/${userId}/${storedName}`,
    fileName: file.name || storedName,
    mimeType: mime,
    fileSize: file.size,
  };
}

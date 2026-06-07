import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "chat");
const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
]);

export type SavedChatMedia = {
  url: string;
  messageType: "image" | "file";
  fileName: string;
};

export async function saveChatMedia(userId: number, file: File): Promise<SavedChatMedia> {
  if (!file || file.size === 0) {
    throw new Error("Fichier manquant.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Fichier trop volumineux (max 8 Mo).");
  }
  if (file.type && !ALLOWED_TYPES.has(file.type)) {
    throw new Error("Format non accepté (PDF ou image uniquement).");
  }

  const isImage = file.type.startsWith("image/");
  const ext =
    path.extname(file.name) ||
    (file.type === "application/pdf" ? ".pdf" : isImage ? ".jpg" : ".bin");
  const base =
    path.basename(file.name, path.extname(file.name)).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60) ||
    "fichier";
  const storedName = `${Date.now()}-${base}${ext}`;
  const dir = path.join(UPLOAD_ROOT, String(userId));
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, storedName), buffer);

  const url = `/uploads/chat/${userId}/${storedName}`;
  return {
    url,
    messageType: isImage ? "image" : "file",
    fileName: file.name || storedName,
  };
}

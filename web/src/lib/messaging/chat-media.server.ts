import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "chat");
const MAX_FILE_SIZE = 16 * 1024 * 1024;

const ALLOWED_TYPES = new Set([
  "application/pdf",
  "image/jpeg",
  "image/jpg",
  "image/png",
  "image/webp",
  "image/gif",
  "video/mp4",
  "video/webm",
  "video/quicktime",
  "audio/mpeg",
  "audio/mp4",
  "audio/aac",
  "audio/x-m4a",
  "video/3gpp",
  "audio/webm",
  "audio/ogg",
  "audio/wav",
  "audio/x-wav",
]);

export type SavedChatMedia = {
  url: string;
  messageType: "image" | "file" | "video" | "audio" | "voice";
  fileName: string;
};

function isAllowedMime(file: File): boolean {
  if (!file.type) return true;
  const base = file.type.split(";")[0]?.trim();
  return ALLOWED_TYPES.has(file.type) || (base ? ALLOWED_TYPES.has(base) : false);
}

function detectMessageType(mime: string, fileName: string): SavedChatMedia["messageType"] {
  if (mime.startsWith("image/")) return "image";
  if (mime.startsWith("video/")) return "video";
  if (mime.startsWith("audio/")) {
    return fileName.toLowerCase().includes("voice") ? "voice" : "audio";
  }
  return "file";
}

export async function saveChatMedia(
  userId: number,
  file: File,
  options?: { voice?: boolean }
): Promise<SavedChatMedia> {
  if (!file || file.size === 0) {
    throw new Error("Fichier manquant.");
  }
  if (file.size > MAX_FILE_SIZE) {
    throw new Error("Fichier trop volumineux (max 16 Mo).");
  }
  if (!isAllowedMime(file)) {
    throw new Error("Format non accepté.");
  }

  const mime = file.type || "application/octet-stream";
  const messageType = options?.voice ? "voice" : detectMessageType(mime, file.name);
  const ext =
    path.extname(file.name) ||
    (mime === "application/pdf"
      ? ".pdf"
      : mime.startsWith("image/")
        ? ".jpg"
        : mime.startsWith("video/")
          ? ".mp4"
          : mime.startsWith("audio/")
            ? ".webm"
            : ".bin");
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
    messageType,
    fileName: file.name || storedName,
  };
}

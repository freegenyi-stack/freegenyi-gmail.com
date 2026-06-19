import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "news-comments");
const MAX_FILE_SIZE = 8 * 1024 * 1024;

const ALLOWED_IMAGE_TYPES = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp", "image/gif"]);

export type SavedNewsCommentMedia = {
  url: string;
  attachmentType: "image" | "gif";
};

function isAllowedImage(file: File): boolean {
  if (!file.type) return true;
  const base = file.type.split(";")[0]?.trim();
  return ALLOWED_IMAGE_TYPES.has(file.type) || (base ? ALLOWED_IMAGE_TYPES.has(base) : false);
}

export async function saveNewsCommentMedia(userId: number, file: File): Promise<SavedNewsCommentMedia> {
  if (!file || file.size === 0) throw new Error("Fichier manquant.");
  if (file.size > MAX_FILE_SIZE) throw new Error("Image trop volumineuse (max 8 Mo).");
  if (!isAllowedImage(file)) throw new Error("Format non accepté (JPEG, PNG, WebP, GIF).");

  const mime = file.type || "image/jpeg";
  const isGif = mime === "image/gif" || file.name.toLowerCase().endsWith(".gif");
  const ext =
    path.extname(file.name) ||
    (isGif ? ".gif" : mime === "image/png" ? ".png" : mime === "image/webp" ? ".webp" : ".jpg");
  const base =
    path.basename(file.name, path.extname(file.name)).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 60) ||
    "photo";
  const storedName = `${Date.now()}-${base}${ext}`;
  const dir = path.join(UPLOAD_ROOT, String(userId));
  await mkdir(dir, { recursive: true });

  const buffer = Buffer.from(await file.arrayBuffer());
  await writeFile(path.join(dir, storedName), buffer);

  return {
    url: `/uploads/news-comments/${userId}/${storedName}`,
    attachmentType: isGif ? "gif" : "image",
  };
}

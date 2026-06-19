import { mkdir, writeFile } from "fs/promises";
import path from "path";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "profiles");
const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/jpg", "image/png", "image/webp"]);

export async function saveTeacherProfilePhoto(userId: number, file: File): Promise<string> {
  if (!file || file.size === 0) throw new Error("Photo manquante.");
  if (file.size > MAX_SIZE) throw new Error("Photo trop volumineuse (max 5 Mo).");
  if (file.type && !ALLOWED.has(file.type)) throw new Error("Format non accepté (JPG, PNG, WebP).");

  const ext = path.extname(file.name) || (file.type.includes("png") ? ".png" : ".jpg");
  const storedName = `avatar-${Date.now()}${ext}`;
  const dir = path.join(UPLOAD_ROOT, String(userId));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, storedName), Buffer.from(await file.arrayBuffer()));
  return `/uploads/profiles/${userId}/${storedName}`;
}

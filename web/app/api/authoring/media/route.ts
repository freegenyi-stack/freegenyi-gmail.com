import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "activity");
const MAX_SIZE = 8 * 1024 * 1024;
const ALLOWED = new Set(["image/jpeg", "image/png", "image/webp", "image/gif", "audio/mpeg", "audio/wav", "audio/ogg"]);

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const form = await req.formData();
  const file = form.get("file");
  if (!(file instanceof File) || file.size === 0) {
    return NextResponse.json({ error: "missing_file" }, { status: 400 });
  }
  if (file.size > MAX_SIZE) {
    return NextResponse.json({ error: "too_large" }, { status: 400 });
  }
  const mime = file.type || "application/octet-stream";
  if (!ALLOWED.has(mime) && !mime.startsWith("image/") && !mime.startsWith("audio/")) {
    return NextResponse.json({ error: "invalid_type" }, { status: 400 });
  }

  const ext = path.extname(file.name) || (mime.startsWith("image/") ? ".jpg" : ".bin");
  const base = path.basename(file.name, ext).replace(/[^a-zA-Z0-9._-]/g, "_").slice(0, 40) || "media";
  const stored = `${Date.now()}-${base}${ext}`;
  const dir = path.join(UPLOAD_ROOT, String(user.id));
  await mkdir(dir, { recursive: true });
  await writeFile(path.join(dir, stored), Buffer.from(await file.arrayBuffer()));

  return NextResponse.json({
    url: `/uploads/activity/${user.id}/${stored}`,
    fileName: file.name,
    mimeType: mime,
  });
}

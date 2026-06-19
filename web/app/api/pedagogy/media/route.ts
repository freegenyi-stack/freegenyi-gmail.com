import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import path from "path";
import { Readable } from "stream";
import { auth } from "@/auth";
import { pedagogyMimeFromPath } from "@/lib/pedagogy/media-url";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "pedagogy");

function resolveSafePath(publicPath: string): string | null {
  if (!publicPath.startsWith("/uploads/pedagogy/")) return null;
  const segments = publicPath.split("/").filter(Boolean);
  if (segments.length < 4) return null;
  const userId = segments[2];
  const fileName = segments.slice(3).join("/");
  if (!userId || !fileName || fileName.includes("..")) return null;

  const abs = path.join(UPLOAD_ROOT, userId, fileName);
  const normalized = path.normalize(abs);
  if (!normalized.startsWith(path.normalize(UPLOAD_ROOT))) return null;
  if (!existsSync(normalized)) return null;
  return normalized;
}

function contentDisposition(fileName: string, download: boolean): string {
  const safe = fileName.replace(/[^\w.\-() ]+/g, "_").slice(0, 120) || "fichier";
  const type = download ? "attachment" : "inline";
  return `${type}; filename="${safe}"; filename*=UTF-8''${encodeURIComponent(fileName)}`;
}

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const publicPath = req.nextUrl.searchParams.get("path") || "";
  const abs = resolveSafePath(publicPath);
  if (!abs) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const stat = statSync(abs);
  const mime =
    pedagogyMimeFromPath(publicPath, req.nextUrl.searchParams.get("type") || undefined) ||
    "application/octet-stream";
  const download = req.nextUrl.searchParams.get("download") !== "0";
  const fileName = path.basename(abs);

  const stream = createReadStream(abs);
  return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(stat.size),
      "Content-Disposition": contentDisposition(fileName, download),
      "Cache-Control": "private, max-age=3600",
    },
  });
}

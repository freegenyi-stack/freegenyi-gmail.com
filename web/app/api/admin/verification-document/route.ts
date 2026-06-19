import { NextRequest, NextResponse } from "next/server";
import { readFile } from "fs/promises";
import path from "path";
import { requireAdminSession } from "@/lib/admin/requireAdmin";

const UPLOAD_ROOT = path.join(process.cwd(), "uploads");

export async function GET(req: NextRequest) {
  const admin = await requireAdminSession();
  if ("error" in admin) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  const rel = req.nextUrl.searchParams.get("path");
  if (!rel || rel.includes("..") || rel.startsWith("/")) {
    return NextResponse.json({ error: "Chemin invalide." }, { status: 400 });
  }

  const fullPath = path.join(UPLOAD_ROOT, rel);
  if (!fullPath.startsWith(UPLOAD_ROOT)) {
    return NextResponse.json({ error: "Accès refusé." }, { status: 403 });
  }

  try {
    const buffer = await readFile(fullPath);
    const ext = path.extname(fullPath).toLowerCase();
    const type =
      ext === ".pdf"
        ? "application/pdf"
        : ext === ".png"
          ? "image/png"
          : ext === ".webp"
            ? "image/webp"
            : "image/jpeg";

    return new NextResponse(buffer, {
      headers: {
        "Content-Type": type,
        "Cache-Control": "private, max-age=3600",
      },
    });
  } catch {
    return NextResponse.json({ error: "Fichier introuvable." }, { status: 404 });
  }
}

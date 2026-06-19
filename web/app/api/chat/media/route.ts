import { NextRequest, NextResponse } from "next/server";
import { createReadStream, existsSync, statSync } from "fs";
import path from "path";
import { Readable } from "stream";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";
import { userCanAccessChatMedia } from "@/lib/messaging/chat-reports.server";
import { mimeFromPath } from "@/lib/messaging/media-url";
import { MESSAGING_ERROR, messagingAccessHttpStatus, messagingError } from "@/lib/messaging/messaging-errors";

const UPLOAD_ROOT = path.join(process.cwd(), "public", "uploads", "chat");

function resolveSafePath(publicPath: string): string | null {
  if (!publicPath.startsWith("/uploads/chat/")) return null;
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

export async function GET(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) {
    const err = messagingError(MESSAGING_ERROR.UNAUTHORIZED);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  const publicPath = req.nextUrl.searchParams.get("path") || "";
  const abs = resolveSafePath(publicPath);
  if (!abs) {
    const err = messagingError(MESSAGING_ERROR.FILE_NOT_FOUND);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  if (!(await userCanAccessChatMedia(user.id, publicPath))) {
    const err = messagingError(MESSAGING_ERROR.ACCESS_DENIED);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  const stat = statSync(abs);
  const mime =
    mimeFromPath(publicPath, req.nextUrl.searchParams.get("type") || undefined) ||
    "application/octet-stream";

  const range = req.headers.get("range");
  if (range) {
    const match = /^bytes=(\d+)-(\d*)$/.exec(range);
    if (match) {
      const start = parseInt(match[1], 10);
      const end = match[2] ? parseInt(match[2], 10) : stat.size - 1;
      if (start >= stat.size || end >= stat.size || start > end) {
        return new NextResponse(null, {
          status: 416,
          headers: { "Content-Range": `bytes */${stat.size}` },
        });
      }
      const stream = createReadStream(abs, { start, end });
      return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
        status: 206,
        headers: {
          "Content-Type": mime,
          "Content-Length": String(end - start + 1),
          "Content-Range": `bytes ${start}-${end}/${stat.size}`,
          "Accept-Ranges": "bytes",
          "Content-Disposition": "inline",
          "Cache-Control": "private, max-age=3600",
        },
      });
    }
  }

  const stream = createReadStream(abs);
  return new NextResponse(Readable.toWeb(stream) as ReadableStream, {
    headers: {
      "Content-Type": mime,
      "Content-Length": String(stat.size),
      "Accept-Ranges": "bytes",
      "Content-Disposition": "inline",
      "Cache-Control": "private, max-age=3600",
    },
  });
}

import { NextRequest, NextResponse } from "next/server";
import { assertUserLibraryAccess } from "@/lib/library/library-access.server";
import {
  getUserReadingProgress,
  recordReadingSession,
  saveUserReadingProgress,
} from "@/lib/library/user-library.server";

export async function POST(req: NextRequest) {
  const body = (await req.json()) as {
    userId?: number;
    bookId?: number;
    locatorJson?: string;
    percent?: number;
    pagesRead?: number;
    sessionPages?: number;
    sessionDurationSec?: number;
  };

  const userId = body.userId;
  const bookId = body.bookId;
  if (!userId || !bookId) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const access = await assertUserLibraryAccess(userId, bookId);
  if ("error" in access) {
    return NextResponse.json({ error: access.error }, { status: 403 });
  }

  const prev = await getUserReadingProgress(userId, bookId);
  const prevPercent = prev?.percent ?? 0;
  const newPercent = body.percent ?? 0;
  const pagesDelta =
    body.sessionPages ??
    Math.max(0, Math.round(((newPercent - prevPercent) / 100) * 200));

  await saveUserReadingProgress({
    userId,
    bookId,
    locatorJson: body.locatorJson,
    percent: newPercent,
    pagesRead: body.pagesRead,
  });

  if (pagesDelta > 0 || (body.sessionDurationSec ?? 0) > 0) {
    await recordReadingSession({
      userId,
      bookId,
      pagesDelta,
      durationSec: body.sessionDurationSec ?? 0,
    });
  }

  return NextResponse.json({ success: true });
}

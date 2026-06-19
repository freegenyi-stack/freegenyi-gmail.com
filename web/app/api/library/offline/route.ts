import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { assertChildLibraryAccess, assertLibraryBookAccess } from "@/lib/library/library-access.server";
import { getOfflineDownloadThisWeek, registerOfflineDownload } from "@/lib/library/offline.server";

export async function GET(req: NextRequest) {
  const userIdRaw = req.nextUrl.searchParams.get("userId");
  const childIdRaw = req.nextUrl.searchParams.get("childId");
  const userId = userIdRaw ? parseInt(userIdRaw, 10) : null;
  const childId = childIdRaw ? parseInt(childIdRaw, 10) : null;

  if ((!userId || Number.isNaN(userId)) && (!childId || Number.isNaN(childId))) {
    return NextResponse.json({ error: "Paramètres invalides" }, { status: 400 });
  }

  const row = await getOfflineDownloadThisWeek({ userId, childId });
  return NextResponse.json({
    weekBookId: row?.bookId ?? null,
    weekStart: row?.weekStart ?? null,
  });
}

export async function POST(req: NextRequest) {
  const body = (await req.json()) as { bookId?: number; userId?: number; childId?: number };
  const bookId = body.bookId ?? 0;
  if (Number.isNaN(bookId) || bookId < 1) {
    return NextResponse.json({ error: "Livre invalide" }, { status: 400 });
  }

  const session = await auth();
  if (!session?.user?.id && !body.childId) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  if (body.childId) {
    const access = await assertChildLibraryAccess(body.childId, bookId);
    if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });
  } else {
    const access = await assertLibraryBookAccess(bookId);
    if ("error" in access) return NextResponse.json({ error: access.error }, { status: 403 });

    const sessionUserId = parseInt(session!.user!.id!, 10);
    const [user] = await db.select().from(users).where(eq(users.id, sessionUserId)).limit(1);
    if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

    body.userId = sessionUserId;
  }

  const result = await registerOfflineDownload({
    userId: body.userId ?? null,
    childId: body.childId ?? null,
    bookId,
  });

  if (!result.ok) {
    return NextResponse.json(
      { error: result.error, quotaBookId: result.bookId },
      { status: 429 }
    );
  }

  return NextResponse.json({ success: true, bookId });
}

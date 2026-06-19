import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { getUserReadingStats } from "@/lib/library/user-library.server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = parseInt(req.nextUrl.searchParams.get("userId") || session.user.id, 10);
  if (userId !== parseInt(session.user.id, 10)) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const stats = await getUserReadingStats(userId);
  return NextResponse.json({ stats });
}

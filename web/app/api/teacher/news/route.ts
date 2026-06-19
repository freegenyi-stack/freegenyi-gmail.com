import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { listTeacherNewsForUser, markTeacherNewsRead } from "@/lib/teacher/news.server";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || user.role !== "enseignant") {
    return NextResponse.json({ error: "Accès réservé" }, { status: 403 });
  }

  const topic = req.nextUrl.searchParams.get("topic") || undefined;
  const articles = await listTeacherNewsForUser(user.id, { topic, limit: 50 });
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || user.role !== "enseignant") {
    return NextResponse.json({ error: "Accès réservé" }, { status: 403 });
  }

  const body = (await req.json()) as { articleId?: number };
  if (!body.articleId) {
    return NextResponse.json({ error: "articleId requis" }, { status: 400 });
  }

  await markTeacherNewsRead(user.id, body.articleId);
  return NextResponse.json({ ok: true });
}

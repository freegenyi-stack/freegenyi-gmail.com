import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { listNewsForUser, markNewsRead } from "@/lib/news/articles.server";

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || !["enseignant", "parent", "coparent"].includes(user.role || "")) return null;
  return user;
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const topic = req.nextUrl.searchParams.get("topic") || undefined;
  const articles = await listNewsForUser(user.id, { topic, limit: 50 });
  return NextResponse.json({ articles });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = (await req.json()) as { articleId?: number };
  if (!body.articleId) {
    return NextResponse.json({ error: "articleId requis" }, { status: 400 });
  }

  await markNewsRead(user.id, body.articleId);
  return NextResponse.json({ ok: true });
}

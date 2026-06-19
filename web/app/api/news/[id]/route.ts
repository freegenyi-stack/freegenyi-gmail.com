import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getNewsArticleForUser, markNewsRead } from "@/lib/news/articles.server";

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || !["enseignant", "parent", "coparent"].includes(user.role || "")) return null;
  return user;
}

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await params;
  const articleId = parseInt(id, 10);
  if (Number.isNaN(articleId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  const article = await getNewsArticleForUser(user.id, articleId);
  if (!article) return NextResponse.json({ error: "Article introuvable" }, { status: 404 });

  await markNewsRead(user.id, articleId);
  return NextResponse.json({ article });
}

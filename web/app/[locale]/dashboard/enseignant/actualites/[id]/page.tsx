import React from "react";
import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getNewsArticleForUser, markNewsRead } from "@/lib/news/articles.server";
import NewsArticleView from "@/components/news/NewsArticleView";

export default async function TeacherNewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || user.role !== "enseignant") redirect(`/${locale}/dashboard/parent`);

  const articleId = parseInt(id, 10);
  if (Number.isNaN(articleId)) redirect(`/${locale}/dashboard/enseignant/actualites`);

  const article = await getNewsArticleForUser(user.id, articleId);
  if (!article) redirect(`/${locale}/dashboard/enseignant/actualites`);

  if (article.unread) {
    await markNewsRead(user.id, articleId);
    revalidatePath("/dashboard/enseignant");
    revalidatePath("/dashboard/enseignant/actualites");
  }

  return <NewsArticleView role="enseignant" article={{ ...article, unread: false }} />;
}

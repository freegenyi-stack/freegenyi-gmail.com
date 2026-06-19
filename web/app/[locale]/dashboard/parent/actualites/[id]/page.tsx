import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isFamilyAdult } from "@/lib/family/constants";
import { getNewsArticleForUser } from "@/lib/news/articles.server";
import NewsArticleView from "@/components/news/NewsArticleView";

export default async function ParentNewsArticlePage({
  params,
}: {
  params: Promise<{ locale: string; id: string }>;
}) {
  const { locale, id } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || !isFamilyAdult(user.role)) redirect(`/${locale}/dashboard/parent`);

  const articleId = parseInt(id, 10);
  if (Number.isNaN(articleId)) redirect(`/${locale}/dashboard/parent/actualites`);

  const article = await getNewsArticleForUser(user.id, articleId);
  if (!article) redirect(`/${locale}/dashboard/parent/actualites`);

  return (
    <div className="min-h-full bg-[#FFFBF7] px-4 py-8 font-dm-sans sm:px-6">
      <div className="mx-auto max-w-2xl">
        <NewsArticleView role="parent" article={article} />
      </div>
    </div>
  );
}

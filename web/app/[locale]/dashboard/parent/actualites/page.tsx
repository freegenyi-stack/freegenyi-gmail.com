import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isFamilyAdult } from "@/lib/family/constants";
import { listNewsForUser } from "@/lib/news/articles.server";
import NewsFeedClient from "@/components/news/NewsFeedClient";
import { getTranslations } from "next-intl/server";
import { ParentPageHeader } from "@/components/parent/ParentShell";

export default async function ParentNewsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("News");
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  if (!user || !isFamilyAdult(user.role)) redirect(`/${locale}/dashboard/parent`);
  if (user.onboardingStep! < 4) redirect(`/${locale}/dashboard/onboarding`);

  const articles = await listNewsForUser(user.id);

  return (
    <div className="mx-auto max-w-2xl">
      <ParentPageHeader title={t("title")} subtitle={t("subtitleParent")} badge={t("badge")} premium />
      <NewsFeedClient role="parent" initialArticles={articles} />
    </div>
  );
}

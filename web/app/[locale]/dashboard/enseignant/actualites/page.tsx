import React from "react";

import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";

import NewsFeedClient from "@/components/news/NewsFeedClient";

import { listNewsForUser } from "@/lib/news/articles.server";

import { auth } from "@/auth";

import { db } from "@/db";

import { users } from "@/db/schema";

import { eq } from "drizzle-orm";

import { getTranslations } from "next-intl/server";

import { TeacherPageHeader } from "@/components/teacher/TeacherShell";



export default async function TeacherNewsPage({

  params,

}: {

  params: Promise<{ locale: string }>;

}) {

  const { locale } = await params;

  await requireTeacherPage(locale);

  const t = await getTranslations("News");



  const session = await auth();

  const [user] = await db.select().from(users).where(eq(users.email, session!.user!.email!)).limit(1);

  const articles = user ? await listNewsForUser(user.id) : [];



  return (

    <NewsFeedClient

      role="enseignant"

      initialArticles={articles}

      showHeader={<TeacherPageHeader title={t("title")} subtitle={t("subtitleTeacher")} badge={t("badge")} />}

    />

  );

}


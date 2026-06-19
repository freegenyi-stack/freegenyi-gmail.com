import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  listPublishedBooks,
  listFamilyLibraryAssignments,
  listContinueReading,
  listProgressForBooks,
} from "@/lib/library/books.server";
import { getLibraryDiscovery } from "@/lib/library/discovery.server";
import { audiencesForContext } from "@/lib/library/audience";
import {
  getUserReadingStats,
  listRecommendationsForUser,
  listUserContinueReading,
  listUserProgressMap,
  listUserReadingHistory,
} from "@/lib/library/user-library.server";
import { getFamilyChildren } from "@/lib/family/server";
import { listUserBadges } from "@/lib/library/badges.server";
import { getTranslations } from "next-intl/server";
import { ParentPageHeader } from "@/components/parent/ParentShell";
import BibliothequeClient from "./BibliothequeClient";

export default async function ParentBibliothequePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Library");
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) redirect(`/${locale}/auth/login`);

  const children = await getFamilyChildren(user);
  const childIds = children.map((c) => c.id);

  const parentAudiences = audiencesForContext("parent");

  const [books, assignments, childContinue, discovery, userStats, userContinue, userHistory, forYou, userBadges] =
    await Promise.all([
      listPublishedBooks(100, parentAudiences),
      listFamilyLibraryAssignments(childIds),
      listContinueReading(childIds),
      getLibraryDiscovery(8, parentAudiences),
      getUserReadingStats(user.id),
      listUserContinueReading(user.id),
      listUserReadingHistory(user.id),
      listRecommendationsForUser(user.id),
      listUserBadges(user.id),
    ]);

  const bookIds = [...new Set([...books.map((b) => b.id), ...assignments.map((a) => a.bookId)])];
  const [childProgressEntries, userProgressMap] = await Promise.all([
    listProgressForBooks(childIds, bookIds),
    listUserProgressMap(user.id, bookIds),
  ]);

  const childProgressMap = Object.fromEntries(childProgressEntries.entries());
  const userProgressRecord = Object.fromEntries(userProgressMap.entries());

  return (
    <div>
      <ParentPageHeader title={t("title")} subtitle={t("parentPageSubtitle")} badge={t("badge")} premium />
      <BibliothequeClient
        books={books}
        assignments={assignments}
        continueReading={childContinue}
        progressMap={childProgressMap}
        userProgressMap={userProgressRecord}
        discovery={discovery}
        userStats={userStats}
        userContinue={userContinue}
        userHistory={userHistory}
        forYou={forYou}
        statsPath="/dashboard/parent/bibliotheque/stats"
        badges={userBadges.map((b) => ({ key: b.badgeKey, label: b.label }))}
        userId={user.id}
      />
    </div>
  );
}

import React from "react";
import { auth } from "@/auth";
import { Link } from "@/i18n/routing";
import { Users } from "lucide-react";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import {
  listPublishedBooks,
  listTeacherAssignments,
  listTeacherSchoolChildren,
  teacherSchoolIdFromMetadata,
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
import { getTranslations } from "next-intl/server";
import TeacherLibraryClient from "@/components/teacher/TeacherLibraryClient";
import LibraryHub from "@/components/library/LibraryHub";

export default async function TeacherLibraryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireTeacherPage(locale);
  const t = await getTranslations("Library");

  const session = await auth();
  if (!session?.user?.email) return null;

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) return null;

  const teacherAudiences = audiencesForContext("teacher");

  const books = await listPublishedBooks(100, teacherAudiences);
  const schoolId = teacherSchoolIdFromMetadata(user.metadata);
  const schoolChildren = schoolId ? await listTeacherSchoolChildren(schoolId) : [];
  const assignments = await listTeacherAssignments(user.id);

  const [discovery, userStats, userContinue, userHistory, forYou] = await Promise.all([
    getLibraryDiscovery(8, teacherAudiences),
    getUserReadingStats(user.id),
    listUserContinueReading(user.id),
    listUserReadingHistory(user.id),
    listRecommendationsForUser(user.id),
  ]);

  const userProgressMap = Object.fromEntries(
    (await listUserProgressMap(user.id, books.map((b) => b.id))).entries()
  );

  return (
    <div className="space-y-10">
      <Link
        href="/dashboard/enseignant/bibliotheque/classe"
        className="inline-flex items-center gap-2 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-black text-amber-900 hover:bg-amber-100"
      >
        <Users className="h-4 w-4" />
        {t("teacherClassLink")}
      </Link>
      <LibraryHub
        basePath="/dashboard/enseignant/bibliotheque"
        userStats={userStats}
        discovery={discovery}
        userContinue={userContinue}
        userHistory={userHistory}
        userProgressMap={userProgressMap}
        forYou={forYou}
        statsPath="/dashboard/enseignant/bibliotheque/stats"
        userId={user.id}
      />
      <TeacherLibraryClient
        books={books}
        schoolChildren={schoolChildren}
        assignments={assignments}
      />
    </div>
  );
}

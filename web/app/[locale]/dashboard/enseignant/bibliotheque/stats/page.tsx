import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { requireTeacherPage } from "@/lib/teacher/requireTeacherPage";
import LibraryStatsClient from "@/components/library/LibraryStatsClient";
import { listUserBadges } from "@/lib/library/badges.server";
import { getDailyReadingStats, getUserReadingStats } from "@/lib/library/user-library.server";

export default async function TeacherLibraryStatsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  await requireTeacherPage(locale);

  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) redirect(`/${locale}/auth/login`);

  const [stats, daily, badges] = await Promise.all([
    getUserReadingStats(user.id),
    getDailyReadingStats(user.id),
    listUserBadges(user.id),
  ]);

  return (
    <LibraryStatsClient
      stats={stats}
      daily={daily}
      badges={badges}
      statsHref="/dashboard/enseignant/bibliotheque/stats"
      backHref="/dashboard/enseignant/bibliotheque"
      variant="teacher"
    />
  );
}

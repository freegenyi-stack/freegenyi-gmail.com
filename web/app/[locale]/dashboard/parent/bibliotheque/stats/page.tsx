import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import { ParentPageHeader } from "@/components/parent/ParentShell";
import LibraryStatsClient from "@/components/library/LibraryStatsClient";
import { listUserBadges } from "@/lib/library/badges.server";
import { getDailyReadingStats, getUserReadingStats } from "@/lib/library/user-library.server";

export default async function ParentLibraryStatsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations("Library.stats");
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
    <div>
      <ParentPageHeader title={t("title")} subtitle={t("last30Days")} badge={t("badge")} premium />
      <LibraryStatsClient
        stats={stats}
        daily={daily}
        badges={badges}
        statsHref="/dashboard/parent/bibliotheque/stats"
        backHref="/dashboard/parent/bibliotheque"
        variant="parent"
      />
    </div>
  );
}

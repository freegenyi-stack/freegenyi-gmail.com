import { NextResponse } from "next/server";
import { requireMobileParent } from "@/lib/mobile/require-mobile-auth";
import { getFamilyChildren } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { getParentDashboardInsights } from "@/lib/parent/dashboard-insights.server";
import { getChildDailyActivity } from "@/lib/parent/parent-progress.server";

export async function GET(request: Request) {
  const auth = await requireMobileParent(request);
  if (auth instanceof NextResponse) return auth;

  if (!isFamilyAdult(auth.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const childrenRows = await getFamilyChildren(auth.user);
  const insights = await getParentDashboardInsights(childrenRows);

  const dailyByChild = await Promise.all(
    insights.children.map(async (c) => ({
      childId: c.childId,
      daily: await getChildDailyActivity(c.childId, 30),
    }))
  );

  return NextResponse.json({
    children: insights.children.map((c) => ({
      childId: c.childId,
      fullName: c.fullName,
      educationLevel: c.educationLevel,
      learningMode: c.learningMode,
      dailyScreenMinutes: c.dailyScreenMinutes,
      stats: {
        totalXp: c.stats.totalXp,
        level: c.stats.level,
        progress: c.stats.progress,
        breakdown: c.stats.breakdown,
        pendingMissions: c.stats.pendingMissions,
        booksRead: c.stats.booksRead,
        exercisesDone: c.stats.exercisesDone,
      },
      readingStats: c.readingStats,
      recentMissions: c.recentMissions,
      dailyActivity: dailyByChild.find((d) => d.childId === c.childId)?.daily ?? [],
    })),
    selectedChildId: insights.selectedChildId,
  });
}

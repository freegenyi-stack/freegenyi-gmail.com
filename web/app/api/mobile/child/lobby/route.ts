import { NextResponse } from "next/server";
import { db } from "@/db";
import { children } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { getChildGamificationStats } from "@/lib/child/gamification.server";
import { getLatestChildBoost } from "@/lib/parent/child-boost.server";
import { getPendingWorksheetsForChild } from "@/lib/parent/parent-worksheets.server";
import { countPendingCurriculumSessions } from "@/lib/curriculum/assign.server";
import { parseChildLearningProfileJson } from "@/lib/child/learning-profile";

export async function GET(request: Request) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const [child] = await db
    .select({
      id: children.id,
      fullName: children.fullName,
      learningProfile: children.learningProfile,
    })
    .from(children)
    .where(eq(children.id, auth.childId))
    .limit(1);

  if (!child) {
    return NextResponse.json({ error: "not_found" }, { status: 404 });
  }

  const [stats, latestBoost, pendingWorksheets, pendingCurriculum] = await Promise.all([
    getChildGamificationStats(child.id),
    getLatestChildBoost(child.id),
    getPendingWorksheetsForChild(child.id),
    countPendingCurriculumSessions(child.id),
  ]);

  const learningProfile = parseChildLearningProfileJson(child.learningProfile);

  return NextResponse.json({
    child: {
      id: child.id,
      fullName: child.fullName,
      firstName: child.fullName.split(" ")[0],
    },
    stats: {
      xp: stats.totalXp,
      level: stats.level,
      progress: stats.progress,
      breakdown: stats.breakdown,
      pendingMissions: stats.pendingMissions,
      booksRead: stats.booksRead,
      exercisesDone: stats.exercisesDone,
    },
    latestBoost,
    pendingWorksheets: pendingWorksheets.length,
    pendingGeny: pendingWorksheets.length + pendingCurriculum,
    pendingCurriculum,
    learningMode: learningProfile.learningMode,
    dailyScreenMinutes: learningProfile.dailyScreenMinutes ?? 20,
  });
}

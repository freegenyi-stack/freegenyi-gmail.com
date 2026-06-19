import {
  getChildGamificationStats,
  listChildAtelierMissions,
  type ChildGamificationStats,
  type ChildMissionRow,
} from "@/lib/child/gamification.server";
import { parseChildLearningProfileJson, type LearningMode } from "@/lib/child/learning-profile";
import { getChildReadingStats } from "@/lib/library/badges.server";
import type { UserReadingStats } from "@/lib/library/user-library.server";
import { getSelectedChildId } from "@/lib/parent/selected-child";
import type { children } from "@/db/schema";

type ChildRow = typeof children.$inferSelect;

export type ParentChildInsights = {
  childId: number;
  fullName: string;
  educationLevel: string | null;
  birthDate: string | null;
  learningMode: LearningMode;
  dailyScreenMinutes: number;
  stats: ChildGamificationStats;
  readingStats: UserReadingStats;
  recentMissions: ChildMissionRow[];
};

export type ParentDashboardInsights = {
  children: ParentChildInsights[];
  selectedChildId: number | null;
};

async function buildChildInsights(child: ChildRow): Promise<ParentChildInsights> {
  const profile = parseChildLearningProfileJson(child.learningProfile);
  const [stats, readingStats, recentMissions] = await Promise.all([
    getChildGamificationStats(child.id),
    getChildReadingStats(child.id),
    listChildAtelierMissions(child.id, 5),
  ]);

  return {
    childId: child.id,
    fullName: child.fullName,
    educationLevel: child.educationLevel,
    birthDate: child.birthDate,
    learningMode: profile.learningMode,
    dailyScreenMinutes: profile.dailyScreenMinutes,
    stats,
    readingStats,
    recentMissions,
  };
}

export async function getParentDashboardInsights(childrenRows: ChildRow[]): Promise<ParentDashboardInsights> {
  const childIds = childrenRows.map((c) => c.id);
  const selectedChildId = await getSelectedChildId(childIds);
  const children = await Promise.all(childrenRows.map(buildChildInsights));

  return { children, selectedChildId };
}

export function getSelectedChildInsights(
  insights: ParentDashboardInsights
): ParentChildInsights | null {
  if (insights.children.length === 0) return null;
  if (insights.selectedChildId) {
    return insights.children.find((c) => c.childId === insights.selectedChildId) ?? insights.children[0];
  }
  return insights.children[0];
}

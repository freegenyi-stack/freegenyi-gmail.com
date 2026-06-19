import React from "react";
import ParentGoalsClient from "@/components/parent/ParentGoalsClient";
import {
  getParentDashboardInsights,
  getSelectedChildInsights,
} from "@/lib/parent/dashboard-insights.server";
import {
  computeQuarterProgress,
  parseQuarterGoalsFromMetadata,
} from "@/lib/parent/quarter-goals";
import { requireParentPage } from "@/lib/parent/requireParentPage";

export default async function ParentGoalsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, children, selectedChildId } = await requireParentPage(locale);
  const insights = await getParentDashboardInsights(children);
  const selected = getSelectedChildInsights(insights);

  const childGoals = insights.children.map((child) => {
    const targets = parseQuarterGoalsFromMetadata(user.metadata, child.childId);
    return {
      childId: child.childId,
      fullName: child.fullName,
      educationLevel: child.educationLevel,
      progress: computeQuarterProgress(targets, {
        booksRead: child.stats.booksRead,
        exercisesDone: child.stats.exercisesDone,
        readingStreakDays: child.readingStats.readingStreakDays,
      }),
    };
  });

  return (
    <ParentGoalsClient
      children={childGoals}
      selectedChildId={selected?.childId ?? selectedChildId}
    />
  );
}

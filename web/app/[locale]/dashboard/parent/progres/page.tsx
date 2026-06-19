import React from "react";
import ParentProgressClient from "@/components/parent/ParentProgressClient";
import {
  getParentDashboardInsights,
  getSelectedChildInsights,
} from "@/lib/parent/dashboard-insights.server";
import { getChildDailyActivity, getChildRecentActivity } from "@/lib/parent/parent-progress.server";
import { requireParentPage } from "@/lib/parent/requireParentPage";

export default async function ParentProgressPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { children } = await requireParentPage(locale);
  const insights = await getParentDashboardInsights(children);
  const selected = getSelectedChildInsights(insights);

  const [daily, history] = selected
    ? await Promise.all([getChildDailyActivity(selected.childId, 30), getChildRecentActivity(selected.childId, 15)])
    : [[], []];

  return <ParentProgressClient child={selected} daily={daily} history={history} />;
}

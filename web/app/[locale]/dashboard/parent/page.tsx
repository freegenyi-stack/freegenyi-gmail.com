import React from "react";
import ParentHomeClient from "@/components/parent/ParentHomeClient";
import {
  getParentDashboardInsights,
  getSelectedChildInsights,
} from "@/lib/parent/dashboard-insights.server";
import {
  buildFamilyChallenge,
  buildParentGenyInsight,
} from "@/lib/parent/parent-geny-insight.server";
import { getFamilyWeeklyMomentum } from "@/lib/parent/parent-progress.server";
import { topParentSuggestion } from "@/lib/parent/parent-suggestions.server";
import { requireParentPage } from "@/lib/parent/requireParentPage";
import { getParentHomeExtras } from "@/lib/parent/parent-home.server";

export default async function ParentDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, children, profileComplete, partner } = await requireParentPage(locale);
  const insights = await getParentDashboardInsights(children);
  const selected = getSelectedChildInsights(insights);
  const suggestion = topParentSuggestion(selected, selected?.fullName.split(" ")[0] ?? "");
  const genyInsight = buildParentGenyInsight(selected);
  const weekly = await getFamilyWeeklyMomentum(children.map((c) => c.id));
  const familyChallenge = buildFamilyChallenge(insights.children, weekly.score);
  const extras = await getParentHomeExtras(user.id, insights.children);

  return (
    <ParentHomeClient
      locale={locale}
      userName={user.fullName}
      profileComplete={profileComplete}
      role={user.role || "parent"}
      insights={insights}
      extras={extras}
      suggestion={suggestion}
      genyInsight={genyInsight}
      familyChallenge={familyChallenge}
      weeklyMomentum={weekly}
      partner={partner}
      childrenPins={children.map((c) => ({ id: c.id, hasPin: !!c.accessPinHash }))}
    />
  );
}

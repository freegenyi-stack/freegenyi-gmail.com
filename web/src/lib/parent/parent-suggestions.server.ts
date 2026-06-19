import type { ParentChildInsights } from "@/lib/parent/dashboard-insights.server";

export type ParentSuggestion = {
  id: string;
  kind: "mission" | "reading" | "celebration" | "guidance" | "general";
  titleKey: string;
  bodyKey: string;
  bodyParams?: Record<string, string | number>;
  ctaKey: string;
  href?: string;
  priority: number;
};

export function getParentSuggestions(
  child: ParentChildInsights | null,
  childFirstName: string
): ParentSuggestion[] {
  if (!child) {
    return [
      {
        id: "add-child",
        kind: "general",
        titleKey: "noChildTitle",
        bodyKey: "noChildBody",
        ctaKey: "addChild",
        href: "/dashboard/children",
        priority: 100,
      },
    ];
  }

  const suggestions: ParentSuggestion[] = [];
  const { stats, readingStats, recentMissions } = child;

  if (stats.pendingMissions > 0) {
    suggestions.push({
      id: "pending-missions",
      kind: "mission",
      titleKey: "pendingMissionsTitle",
      bodyKey: "pendingMissionsBody",
      bodyParams: { name: childFirstName, count: stats.pendingMissions },
      ctaKey: "viewMissions",
      href: "/dashboard/parent/atelier",
      priority: 90,
    });
  }

  const recentDone = recentMissions.filter((m) => m.status === "done").length;
  if (recentDone >= 2 || stats.exercisesDone >= 5) {
    suggestions.push({
      id: "celebration",
      kind: "celebration",
      titleKey: "celebrationTitle",
      bodyKey: "celebrationBody",
      bodyParams: { name: childFirstName },
      ctaKey: "encourage",
      priority: 80,
    });
  }

  if (readingStats.booksReading > 0 && readingStats.readingStreakDays < 3) {
    suggestions.push({
      id: "reading-streak",
      kind: "reading",
      titleKey: "readingStreakTitle",
      bodyKey: "readingStreakBody",
      bodyParams: { name: childFirstName },
      ctaKey: "openLibrary",
      href: "/dashboard/parent/bibliotheque",
      priority: 70,
    });
  }

  if (stats.breakdown.quizzes > stats.breakdown.reading) {
    suggestions.push({
      id: "weekend-activity",
      kind: "celebration",
      titleKey: "weekendTitle",
      bodyKey: "weekendBody",
      bodyParams: { name: childFirstName },
      ctaKey: "discussGeny",
      priority: 60,
    });
  }

  if (child.learningMode === "explorer" && stats.pendingMissions > 2) {
    suggestions.push({
      id: "guidance-hint",
      kind: "guidance",
      titleKey: "guidanceTitle",
      bodyKey: "guidanceBody",
      bodyParams: { name: childFirstName },
      ctaKey: "adjustGuidance",
      href: "/dashboard/parent/reglages",
      priority: 50,
    });
  }

  if (suggestions.length === 0) {
    suggestions.push({
      id: "default",
      kind: "general",
      titleKey: "defaultTitle",
      bodyKey: "defaultBody",
      bodyParams: { name: childFirstName },
      ctaKey: "discussGeny",
      priority: 10,
    });
  }

  return suggestions.sort((a, b) => b.priority - a.priority);
}

export function topParentSuggestion(
  child: ParentChildInsights | null,
  childFirstName: string
): ParentSuggestion {
  return getParentSuggestions(child, childFirstName)[0];
}

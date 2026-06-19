import type { ParentChildInsights } from "@/lib/parent/dashboard-insights.server";

export type ParentGenyInsight = {
  headlineFr: string;
  headlineAr: string;
  bodyFr: string;
  bodyAr: string;
  accent: "celebration" | "nudge" | "balance" | "focus";
  ctaHref?: string;
  ctaKey?: string;
};

export function buildParentGenyInsight(child: ParentChildInsights | null): ParentGenyInsight {
  if (!child) {
    return {
      headlineFr: "Bienvenue sur Le Pont",
      headlineAr: "مرحباً بك على Le Pont",
      bodyFr: "Ajoutez un enfant pour recevoir des conseils personnalisés chaque semaine.",
      bodyAr: "أضف طفلاً لتلقي نصائح مخصصة كل أسبوع.",
      accent: "focus",
      ctaHref: "/dashboard/children",
      ctaKey: "addChild",
    };
  }

  const name = child.fullName.split(" ")[0];
  const { stats, readingStats } = child;

  if (readingStats.readingStreakDays >= 5) {
    return {
      headlineFr: `${name} est en feu !`,
      headlineAr: `${name} في أفضل حالاته!`,
      bodyFr: `Série de ${readingStats.readingStreakDays} jours de lecture. Célébrez ce rituel — la régularité bat le talent.`,
      bodyAr: `سلسلة ${readingStats.readingStreakDays} أيام قراءة. احتفلوا بهذا الروتين — الانتظام أهم من الموهبة.`,
      accent: "celebration",
      ctaHref: "/dashboard/parent/atelier?tab=geny",
      ctaKey: "printable",
    };
  }

  if (stats.pendingMissions >= 3) {
    return {
      headlineFr: "Priorité missions",
      headlineAr: "أولوية المهام",
      bodyFr: `${name} a ${stats.pendingMissions} missions en attente. 15 minutes par jour suffisent pour rattraper sereinement.`,
      bodyAr: `لدى ${name} ${stats.pendingMissions} مهام معلقة. 15 دقيقة يومياً كافية لللحاق بهدوء.`,
      accent: "nudge",
      ctaHref: "/dashboard/parent/atelier?tab=missions",
      ctaKey: "viewMissions",
    };
  }

  if (child.learningMode === "explorer" && stats.exercisesDone < 2) {
    return {
      headlineFr: "Mode explorateur actif",
      headlineAr: "وضع المستكشف مفعّل",
      bodyFr: `${name} navigue librement. Fixez un mini-objectif hebdo (2 missions) pour ancrer la routine.`,
      bodyAr: `${name} يتنقل بحرية. حدّدوا هدفاً أسبوعياً صغيراً (مهمتان) لترسيخ الروتين.`,
      accent: "balance",
      ctaHref: "/dashboard/parent/objectifs",
      ctaKey: "setGoals",
    };
  }

  if (stats.totalXp > 500) {
    return {
      headlineFr: "Progression remarquable",
      headlineAr: "تقدم ملحوظ",
      bodyFr: `${name} a accumulé ${stats.totalXp} XP. Proposez un défi famille ce week-end — lecture ou atelier ensemble.`,
      bodyAr: `${name} جمع ${stats.totalXp} XP. اقترحوا تحدياً عائلياً هذا الأسبوع — قراءة أو ورشة معاً.`,
      accent: "celebration",
      ctaHref: "/dashboard/parent/objectifs",
      ctaKey: "familyChallenge",
    };
  }

  return {
    headlineFr: "Routine sereine",
    headlineAr: "روتين هادئ",
    bodyFr: `${name} progresse à son rythme. 10 minutes de lecture ce soir renforceront la série demain.`,
    bodyAr: `${name} يتقدم بوتيرته. 10 دقائق قراءة الليلة تعزز السلسلة غداً.`,
    accent: "focus",
    ctaHref: "/dashboard/parent/bibliotheque",
    ctaKey: "openLibrary",
  };
}

export type FamilyChallenge = {
  weekLabel: string;
  targetXp: number;
  currentXp: number;
  percent: number;
  childrenCount: number;
};

export function buildFamilyChallenge(
  children: ParentChildInsights[],
  weeklyScore = 0
): FamilyChallenge {
  const targetXp = Math.max(120, children.length * 80);
  const currentXp = weeklyScore;
  const percent = targetXp > 0 ? Math.min(100, Math.round((currentXp / targetXp) * 100)) : 0;
  const weekNum = Math.ceil(
    (Date.now() - new Date(new Date().getFullYear(), 0, 1).getTime()) / (7 * 86400000)
  );

  return {
    weekLabel: `S${weekNum}`,
    targetXp,
    currentXp,
    percent,
    childrenCount: children.length,
  };
}

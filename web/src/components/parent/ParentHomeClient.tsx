"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowRight, Sparkles, Zap } from "lucide-react";
import { RTL_ARROW_FLIP } from "@/lib/parent/parent-rtl";
import ProfileCompleteBanner from "@/components/family/ProfileCompleteBanner";
import ParentChildrenCompare from "@/components/parent/ParentChildrenCompare";
import ParentHomeHero from "@/components/parent/home/ParentHomeHero";
import ParentHomeToday from "@/components/parent/home/ParentHomeToday";
import ParentHomeHubs from "@/components/parent/home/ParentHomeHubs";
import ParentHomeChildFocus from "@/components/parent/home/ParentHomeChildFocus";
import ParentHomeSidebar from "@/components/parent/home/ParentHomeSidebar";
import { BlurFade } from "@/components/magicui/blur-fade";
import { cn } from "@/lib/utils";
import type { ParentDashboardInsights } from "@/lib/parent/dashboard-insights.server";
import type { FamilyChallenge, ParentGenyInsight } from "@/lib/parent/parent-geny-insight.server";
import type { FamilyWeeklyMomentum } from "@/lib/parent/parent-progress.server";
import type { ParentSuggestion } from "@/lib/parent/parent-suggestions.server";
import type { ParentHomeExtras } from "@/lib/parent/parent-home.types";
import { getSelectedChildToday } from "@/lib/parent/parent-home.utils";

type Partner = {
  id: number;
  fullName: string | null;
  lastLoginAt: Date | string | null;
} | null;

type Props = {
  locale: string;
  userName: string;
  profileComplete: boolean;
  role: string;
  insights: ParentDashboardInsights;
  extras: ParentHomeExtras;
  suggestion: ParentSuggestion;
  genyInsight: ParentGenyInsight;
  familyChallenge: FamilyChallenge;
  weeklyMomentum: FamilyWeeklyMomentum;
  partner: Partner;
  childrenPins: { id: number; hasPin: boolean }[];
};

export default function ParentHomeClient({
  locale,
  userName,
  profileComplete,
  role,
  insights,
  extras,
  suggestion,
  genyInsight,
  familyChallenge,
  weeklyMomentum,
  partner,
  childrenPins,
}: Props) {
  const tGeny = useTranslations("ParentSpace.geny");
  const tChallenge = useTranslations("ParentSpace.challenge");
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const isAr = isRTL;

  const firstName = userName.split(" ")[0] || userName;
  const selected =
    insights.children.find((c) => c.childId === insights.selectedChildId) ?? insights.children[0] ?? null;
  const today = getSelectedChildToday(extras, insights.selectedChildId);

  const genyHeadline = isAr ? genyInsight.headlineAr : genyInsight.headlineFr;
  const genyBody = isAr ? genyInsight.bodyAr : genyInsight.bodyFr;
  const accentStyles = {
    celebration: "from-amber-500/15 to-orange-600/5 border-amber-200/60",
    nudge: "from-orange-500/15 to-red-600/5 border-orange-200/60",
    balance: "from-violet-500/15 to-purple-600/5 border-violet-200/60",
    focus: "from-orange-500/15 to-amber-600/5 border-orange-200/60",
  } as const;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ProfileCompleteBanner locale={locale} role={role} complete={profileComplete} />

      <ParentHomeHero firstName={firstName} selectedChildId={selected?.childId ?? null} />

      <ParentHomeToday today={today} childName={selected?.fullName ?? null} />

      <ParentHomeHubs unreadMessages={extras.totalUnreadMessages} />

      <ParentChildrenCompare children={insights.children} />

      {insights.children.length > 0 && (
        <div className="mb-8 grid gap-4 lg:grid-cols-2">
          <BlurFade>
            <div
              className={cn(
                "relative overflow-hidden rounded-3xl border bg-gradient-to-br p-6 shadow-sm",
                accentStyles[genyInsight.accent]
              )}
            >
              <div className="absolute -end-8 -top-8 h-32 w-32 rounded-full bg-orange-100/40 blur-2xl" />
              <div className="relative z-10">
                <div className="mb-3 flex items-center gap-2 text-orange-700">
                  <Sparkles className="h-4 w-4" />
                  <span className="text-[10px] font-black uppercase tracking-widest">{tGeny("badge")}</span>
                </div>
                <h3 className="text-xl font-black text-slate-900">{genyHeadline}</h3>
                <p className="mt-2 text-sm leading-relaxed text-slate-600">{genyBody}</p>
                {genyInsight.ctaHref && genyInsight.ctaKey && (
                  <Link
                    href={genyInsight.ctaHref}
                    className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-400"
                  >
                    {tGeny(genyInsight.ctaKey)} <ArrowRight className={cn("h-3 w-3", RTL_ARROW_FLIP)} />
                  </Link>
                )}
              </div>
            </div>
          </BlurFade>

          <BlurFade delay={0.05}>
            <div className="relative overflow-hidden rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4 text-orange-500" />
                  <h3 className="text-lg font-black text-slate-900">{tChallenge("title")}</h3>
                </div>
                <span className="rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-700">
                  {familyChallenge.weekLabel}
                </span>
              </div>
              <p className="text-sm text-slate-600">
                {tChallenge("subtitle", { count: familyChallenge.childrenCount })}
              </p>
              <div className="mt-4 h-3 overflow-hidden rounded-full bg-slate-100">
                <div
                  className="h-full rounded-full bg-gradient-to-r from-orange-500 via-amber-500 to-yellow-400 transition-all"
                  style={{ width: `${familyChallenge.percent}%` }}
                />
              </div>
              <div className="mt-3 flex flex-wrap items-center justify-between gap-2 text-xs font-bold text-slate-500">
                <span>
                  {tChallenge("score", { current: familyChallenge.currentXp, target: familyChallenge.targetXp })}
                </span>
                <span>
                  {tChallenge("stats", { pages: weeklyMomentum.readingPages, missions: weeklyMomentum.missionsDone })}
                </span>
              </div>
              <Link
                href="/dashboard/parent/objectifs"
                className="mt-4 inline-flex items-center gap-1 text-xs font-black text-orange-700 hover:underline"
              >
                {tChallenge("cta")} <ArrowRight className={cn("h-3 w-3", RTL_ARROW_FLIP)} />
              </Link>
            </div>
          </BlurFade>
        </div>
      )}

      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <ParentHomeChildFocus
            locale={locale}
            children={insights.children}
            selectedChildId={insights.selectedChildId}
            profileComplete={profileComplete}
            childrenPins={childrenPins}
            partner={partner}
          />
        </div>

        <ParentHomeSidebar
          locale={locale}
          selected={selected}
          suggestion={suggestion}
          extras={extras}
          partner={partner}
        />
      </div>
    </div>
  );
}

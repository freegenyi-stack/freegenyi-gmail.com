"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { BookOpen, CheckCircle2, Clock } from "lucide-react";
import { cn } from "@/lib/utils";
import { isParentRtl } from "@/lib/parent/parent-rtl";
import { ParentEmptyState, ParentPageHeader, ParentSectionCard } from "@/components/parent/ParentShell";
import type { ParentChildInsights } from "@/lib/parent/dashboard-insights.server";
import type { DailyActivityPoint } from "@/lib/parent/parent-progress.server";

type Props = {
  child: ParentChildInsights | null;
  daily: DailyActivityPoint[];
  history: { type: "mission" | "reading"; title: string; status?: string; date: Date | string }[];
};

export default function ParentProgressClient({ child, daily, history }: Props) {
  const t = useTranslations("ParentSpace.progress");
  const locale = useLocale();
  const isRTL = isParentRtl(locale);

  const maxActivity = Math.max(1, ...daily.map((d) => d.readingPages + d.exercisesDone * 5));

  if (!child) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />
        <ParentEmptyState>
          <p className="text-slate-600">{t("noChild")}</p>
          <Link href="/dashboard/children" className="mt-4 inline-block text-sm font-black text-orange-700 hover:underline">
            {t("addChild")}
          </Link>
        </ParentEmptyState>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ParentPageHeader
        title={t("title")}
        subtitle={t("subtitleNamed", { name: child.fullName })}
        badge={t("badge")}
        premium
      />

      <div className="mb-6 grid gap-3 sm:grid-cols-4">
        {[
          { label: t("kpiStreak"), value: child.readingStats.readingStreakDays, suffix: t("daySuffix") },
          { label: t("kpiLevel"), value: child.stats.level, suffix: "" },
          { label: t("kpiBooks"), value: child.stats.booksRead, suffix: "" },
          { label: t("kpiXp"), value: child.stats.totalXp, suffix: " XP" },
        ].map((kpi) => (
          <div
            key={kpi.label}
            className="rounded-2xl border border-orange-100/80 bg-white p-4 shadow-sm"
          >
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">{kpi.label}</p>
            <p className="mt-1 text-3xl font-black text-slate-900">
              {kpi.value}
              {kpi.suffix && <span className="text-base text-slate-400">{kpi.suffix}</span>}
            </p>
          </div>
        ))}
      </div>

      <ParentSectionCard className="mb-8">
        <h2 className="mb-1 text-lg font-black text-slate-900">{t("chartTitle")}</h2>
        <p className="mb-4 text-xs text-slate-500">{t("chartSubtitle")}</p>
        {daily.length === 0 ? (
          <p className="text-sm text-slate-500">{t("chartEmpty")}</p>
        ) : (
          <div className="flex h-44 items-end gap-1">
            {daily.map((d) => {
              const total = d.readingPages + d.exercisesDone * 5;
              const readH = (d.readingPages / maxActivity) * 100;
              const exH = ((d.exercisesDone * 5) / maxActivity) * 100;
              return (
                <div key={d.date} className="group flex flex-1 flex-col items-center justify-end gap-0.5">
                  <div className="flex w-full flex-col justify-end" style={{ height: "100%" }}>
                    {exH > 0 && (
                      <div
                        className="w-full rounded-t bg-gradient-to-t from-orange-500 to-amber-400"
                        style={{ height: `${Math.max(4, exH)}%` }}
                        title={t("chartExercises", { count: d.exercisesDone })}
                      />
                    )}
                    {readH > 0 && (
                      <div
                        className="w-full bg-gradient-to-t from-amber-500 to-yellow-400"
                        style={{ height: `${Math.max(4, readH)}%`, borderRadius: exH > 0 ? 0 : "4px 4px 0 0" }}
                        title={t("chartPages", { pages: d.readingPages })}
                      />
                    )}
                    {total === 0 && <div className="h-1 w-full rounded bg-slate-100" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
        <div className="mt-4 flex gap-4 text-[10px] font-bold uppercase tracking-wider text-slate-500">
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-amber-500" /> {t("legendReading")}
          </span>
          <span className="flex items-center gap-1">
            <span className="h-2 w-2 rounded-full bg-orange-500" /> {t("legendExercises")}
          </span>
        </div>
      </ParentSectionCard>

      <ParentSectionCard>
        <h2 className="mb-4 text-lg font-black text-slate-900">{t("historyTitle")}</h2>
        {history.length === 0 ? (
          <p className="text-sm text-slate-500">{t("historyEmpty")}</p>
        ) : (
          <ul className="space-y-3">
            {history.map((item, i) => (
              <li key={i} className="flex items-start gap-3 rounded-xl border border-orange-50 bg-[#FFFBF7] p-3">
                <div
                  className={cn(
                    "mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg",
                    item.type === "reading" ? "bg-amber-100 text-amber-800" : "bg-orange-100 text-orange-700"
                  )}
                >
                  {item.type === "reading" ? <BookOpen className="h-4 w-4" /> : item.status === "done" ? <CheckCircle2 className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-bold text-slate-800">{item.title}</p>
                  <p className="text-xs text-slate-500">
                    {new Date(item.date).toLocaleDateString(locale, { day: "numeric", month: "short", hour: "2-digit", minute: "2-digit" })}
                  </p>
                </div>
              </li>
            ))}
          </ul>
        )}
        <Link href="/dashboard/parent/historique" className="mt-4 inline-block text-xs font-black text-orange-700 hover:underline">
          {t("fullHistory")}
        </Link>
      </ParentSectionCard>
    </div>
  );
}

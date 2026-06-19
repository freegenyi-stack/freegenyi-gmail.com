"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { isParentRtl } from "@/lib/parent/parent-rtl";
import type { ParentChildInsights } from "@/lib/parent/dashboard-insights.server";

type Props = {
  children: ParentChildInsights[];
};

export default function ParentChildrenCompare({ children }: Props) {
  const t = useTranslations("ParentSpace.compare");
  const locale = useLocale();
  const isRtl = isParentRtl(locale);

  if (children.length < 2) return null;

  return (
    <section className="mb-8 overflow-hidden rounded-3xl border border-orange-200/80 bg-white shadow-sm">
      <div className="border-b border-orange-100 bg-[#FFFBF7] px-5 py-4">
        <h2 className="text-sm font-black text-slate-900">{t("title")}</h2>
        <p className="text-xs text-slate-600">{t("subtitle")}</p>
      </div>
      <div className="overflow-x-auto">
        <table className={cn("w-full min-w-[520px] text-sm", isRtl ? "text-end" : "text-start")}>
          <thead>
            <tr className="border-b border-slate-100 text-[10px] font-black uppercase tracking-widest text-slate-400">
              <th className="px-5 py-3">{t("child")}</th>
              <th className="px-3 py-3">{t("streak")}</th>
              <th className="px-3 py-3">{t("level")}</th>
              <th className="px-3 py-3">{t("books")}</th>
              <th className="px-3 py-3">{t("missions")}</th>
              <th className="px-3 py-3">{t("xp")}</th>
            </tr>
          </thead>
          <tbody>
            {children.map((c) => (
              <tr key={c.childId} className="border-b border-slate-50 last:border-0">
                <td className="px-5 py-3 font-bold text-slate-900">{c.fullName.split(" ")[0]}</td>
                <td className="px-3 py-3 font-black text-orange-600">
                  {c.readingStats.readingStreakDays}
                  {t("daySuffix")}
                </td>
                <td className="px-3 py-3">
                  {c.stats.level}
                  <span className="text-slate-400"> · {c.stats.progress}%</span>
                </td>
                <td className="px-3 py-3">{c.stats.booksRead}</td>
                <td className="px-3 py-3">
                  <span className={c.stats.pendingMissions > 0 ? "font-black text-orange-600" : ""}>
                    {c.stats.pendingMissions}
                  </span>
                </td>
                <td className="px-3 py-3 font-bold text-orange-600">{c.stats.totalXp}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}

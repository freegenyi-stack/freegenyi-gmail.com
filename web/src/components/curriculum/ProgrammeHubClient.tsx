"use client";

import React, { useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import {
  BookOpen,
  Globe2,
  GraduationCap,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ParentPageHeader, ParentSectionCard } from "@/components/parent/ParentShell";
import type { ProgramHubResponse } from "@/lib/curriculum/types";

type Props = {
  hub: ProgramHubResponse;
  mode: "parent" | "teacher";
  basePath: string;
};

export default function ProgrammeHubClient({ hub, mode, basePath }: Props) {
  const t = useTranslations("Programme");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const [subject, setSubject] = useState(hub.subjects[0]?.code ?? "ar_islam_civique");
  const [filter, setFilter] = useState("all");

  const activeSubject = hub.subjects.find((s) => s.code === subject) ?? hub.subjects[0];

  const sections = useMemo(() => {
    if (!activeSubject) return [];
    return [...activeSubject.sections].sort((a, b) => a.order - b.order);
  }, [activeSubject]);

  const Header = mode === "parent" ? ParentPageHeader : null;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      {Header ? (
        <ParentPageHeader
          title={t("title")}
          subtitle={t("subtitle", { level: hub.labelFr })}
          badge={t("badge")}
          premium
        />
      ) : (
        <div className="mb-8">
          <span className="mb-2 inline-flex rounded-full bg-violet-100 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-violet-700">
            {t("badgeTeacher")}
          </span>
          <h1 className="text-2xl font-black text-slate-900 md:text-3xl">{t("title")}</h1>
          <p className="mt-1 text-sm text-slate-600">{t("subtitle", { level: hub.labelFr })}</p>
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {hub.subjects.map((s) => (
          <button
            key={s.code}
            type="button"
            onClick={() => setSubject(s.code)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-black transition",
              subject === s.code
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                : "bg-slate-100 text-slate-600 hover:bg-orange-50"
            )}
          >
            {isRTL ? s.labelAr ?? s.labelFr : s.labelFr}
          </button>
        ))}
      </div>

      <div className="mb-6 flex flex-wrap gap-2">
        {hub.contentFilters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-[11px] font-bold transition",
              filter === f.id
                ? "border-orange-300 bg-orange-50 text-orange-700"
                : "border-slate-200 bg-white text-slate-500 hover:border-orange-200"
            )}
          >
            {isRTL ? f.labelAr ?? f.labelFr : f.labelFr}
          </button>
        ))}
      </div>

      <ParentSectionCard className="mb-8">
        <div className="mb-4 flex items-center gap-2">
          <GraduationCap className="h-5 w-5 text-orange-500" />
          <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">{t("officialTitle")}</h2>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {sections.map((sec) => {
            const isPilot = sec.status !== "planned" && sec.unitCount > 0;
            const href = `${basePath}/${sec.maqtaId}?subject=${activeSubject?.code ?? subject}`;
            return (
              <Link
                key={sec.maqtaId}
                href={href}
                className={cn(
                  "group relative overflow-hidden rounded-2xl border p-4 transition hover:-translate-y-0.5 hover:shadow-lg",
                  isPilot
                    ? "border-orange-200 bg-gradient-to-br from-orange-50 to-amber-50 hover:border-orange-300"
                    : "border-slate-200 bg-slate-50 opacity-80 hover:opacity-100"
                )}
              >
                <div className="mb-3 flex items-start justify-between gap-2">
                  <span className="text-[10px] font-black uppercase tracking-wider text-orange-600">
                    {t("section", { n: sec.order })}
                  </span>
                  {isPilot && (
                    <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[9px] font-black text-white">
                      {t("pilot")}
                    </span>
                  )}
                </div>
                <p className="font-black text-slate-900" dir="rtl">
                  {sec.titreAr ?? sec.titreFr}
                </p>
                <p className="mt-1 text-xs text-slate-500">{sec.titreFr}</p>
                <div className="mt-3 flex flex-wrap gap-2 text-[10px] font-bold text-slate-500">
                  <span>{t("units", { count: sec.unitCount })}</span>
                  <span>·</span>
                  <span>{t("exercises", { count: sec.exerciseCount })}</span>
                </div>
              </Link>
            );
          })}
        </div>
      </ParentSectionCard>

      {hub.enrichment && (
        <ParentSectionCard>
          <div className="mb-4 flex items-center gap-2">
            <Globe2 className="h-5 w-5 text-violet-500" />
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-700">{t("enrichmentTitle")}</h2>
          </div>
          <p className="mb-4 text-xs text-slate-500">{t("enrichmentHint")}</p>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {hub.enrichment.modules.map((mod) => (
              <div
                key={mod.code}
                className="flex items-center gap-3 rounded-xl border border-dashed border-violet-200 bg-violet-50/50 p-4"
              >
                <Sparkles className="h-5 w-5 shrink-0 text-violet-500" />
                <div>
                  <p className="text-sm font-black text-slate-800">{mod.labelFr}</p>
                  <p className="text-[10px] font-bold uppercase tracking-wider text-violet-600">{t("comingSoon")}</p>
                </div>
              </div>
            ))}
          </div>
        </ParentSectionCard>
      )}

      <div className="mt-6 flex items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-xs text-slate-600">
        <BookOpen className="h-4 w-4 shrink-0 text-orange-500" />
        {mode === "parent" ? t("parentHint") : t("teacherHint")}
      </div>
    </div>
  );
}

"use client";

import React, { useState, useTransition, useEffect } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Bell, Compass, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParentPageHeader } from "@/components/parent/ParentShell";
import { LEARNING_MODES, type LearningMode } from "@/lib/child/learning-profile";
import { updateChildLearningProfileAction } from "@/lib/actions/children";
import { updateParentPreferencesAction } from "@/lib/actions/parent-settings";
import { parseChildLearningProfileJson } from "@/lib/child/learning-profile";

type ChildOption = {
  id: number;
  fullName: string;
  learningProfile: string | null;
};

type ParentPrefs = {
  weeklyReport: boolean;
  missionAlerts: boolean;
  readingDigest: boolean;
};

type Props = {
  children: ChildOption[];
  selectedChildId: number | null;
  preferences: ParentPrefs;
};

export default function ParentSettingsClient({ children, selectedChildId, preferences }: Props) {
  const t = useTranslations("ParentSpace.settings");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const isAr = locale.endsWith("-ar") || locale === "ar";

  const initialChildId = selectedChildId ?? children[0]?.id ?? null;
  const [activeChildId, setActiveChildId] = useState(initialChildId);
  const [prefs, setPrefs] = useState(preferences);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const activeChild = children.find((c) => c.id === activeChildId);
  const profile = parseChildLearningProfileJson(activeChild?.learningProfile);
  const [learningMode, setLearningMode] = useState<LearningMode>(profile.learningMode);
  const [dailyMinutes, setDailyMinutes] = useState(profile.dailyScreenMinutes);

  useEffect(() => {
    if (!activeChild) return;
    const p = parseChildLearningProfileJson(activeChild.learningProfile);
    setLearningMode(p.learningMode);
    setDailyMinutes(p.dailyScreenMinutes);
  }, [activeChildId, activeChild]);

  const saveGuidance = () => {
    if (!activeChildId || !activeChild) return;
    setMessage(null);
    const base = parseChildLearningProfileJson(activeChild.learningProfile);
    startTransition(async () => {
      const res = await updateChildLearningProfileAction(activeChildId, {
        ...base,
        learningMode,
        dailyScreenMinutes: dailyMinutes,
      });
      setMessage(res.error ? res.error : t("saved"));
    });
  };

  const savePrefs = () => {
    setMessage(null);
    startTransition(async () => {
      const res = await updateParentPreferencesAction(prefs);
      setMessage(res.error ? res.error : t("saved"));
    });
  };

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />

      {message && (
        <p className={cn("mb-4 rounded-xl px-4 py-2 text-sm font-medium", message === t("saved") ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700")}>
          {message}
        </p>
      )}

      <div className="grid gap-8 lg:grid-cols-2">
        <section className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Compass className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-black text-slate-900">{t("guidanceTitle")}</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600">{t("guidanceDesc")}</p>

          {children.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {children.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveChildId(c.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-black transition",
                    activeChildId === c.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600 hover:bg-orange-50"
                  )}
                >
                  {c.fullName.split(" ")[0]}
                </button>
              ))}
            </div>
          )}

          <div className="space-y-3">
            {LEARNING_MODES.map((mode) => (
              <button
                key={mode.id}
                type="button"
                onClick={() => setLearningMode(mode.id)}
                className={cn(
                  "w-full rounded-2xl border p-4 text-start transition",
                  learningMode === mode.id ? "border-orange-400 bg-orange-50 ring-2 ring-orange-100" : "border-slate-200 hover:border-orange-200"
                )}
              >
                <p className="font-black text-slate-900">{isAr ? mode.labelAr : mode.labelFr}</p>
                <p className="mt-1 text-xs text-slate-600">{isAr ? mode.descAr : mode.descFr}</p>
              </button>
            ))}
          </div>

          <div className="mt-4">
            <label className="text-xs font-black uppercase tracking-widest text-slate-500">{t("screenTime")}</label>
            <select
              value={dailyMinutes}
              onChange={(e) => setDailyMinutes(parseInt(e.target.value, 10))}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
            >
              {[10, 15, 20, 30, 45, 60].map((m) => (
                <option key={m} value={m}>
                  {m} {t("minutes")}
                </option>
              ))}
            </select>
          </div>

          <button
            type="button"
            disabled={pending || !activeChildId}
            onClick={saveGuidance}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-orange-400 disabled:opacity-50"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("saveGuidance")}
          </button>
        </section>

        <section className="rounded-3xl border border-orange-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-2">
            <Bell className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-black text-slate-900">{t("reportsTitle")}</h2>
          </div>
          <p className="mb-4 text-sm text-slate-600">{t("reportsDesc")}</p>

          {(
            [
              { key: "weeklyReport" as const, label: t("weeklyReport") },
              { key: "missionAlerts" as const, label: t("missionAlerts") },
              { key: "readingDigest" as const, label: t("readingDigest") },
            ] as const
          ).map((item) => (
            <label key={item.key} className="mb-3 flex cursor-pointer items-center justify-between rounded-xl border border-orange-50 bg-[#FFFBF7] px-4 py-3">
              <span className="text-sm font-bold text-slate-800">{item.label}</span>
              <input
                type="checkbox"
                checked={prefs[item.key]}
                onChange={(e) => setPrefs((p) => ({ ...p, [item.key]: e.target.checked }))}
                className="h-4 w-4 rounded border-slate-300 text-orange-600"
              />
            </label>
          ))}

          <button
            type="button"
            disabled={pending}
            onClick={savePrefs}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {pending && <Loader2 className="h-4 w-4 animate-spin" />}
            {t("saveReports")}
          </button>

          <a
            href={`/api/parent/reports/weekly?locale=${encodeURIComponent(locale)}`}
            className="mt-3 flex w-full items-center justify-center rounded-xl border border-orange-200 bg-orange-50 py-3 text-xs font-black uppercase tracking-widest text-orange-800 hover:bg-orange-100"
          >
            {t("downloadReport")}
          </a>
          <p className="mt-2 text-center text-[10px] text-slate-500">{t("downloadReportDesc")}</p>
        </section>
      </div>
    </div>
  );
}

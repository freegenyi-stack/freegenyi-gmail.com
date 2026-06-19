"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParentEmptyState, ParentPageHeader, ParentSectionCard } from "@/components/parent/ParentShell";
import ChildNeedsStep from "@/components/onboarding/ChildNeedsStep";
import ChildLearningPreferencesStep from "@/components/onboarding/ChildLearningPreferencesStep";
import {
  childAgeFromBirthDate,
  parseChildLearningProfileJson,
  type ChildLearningProfile,
} from "@/lib/child/learning-profile";
import { updateChildLearningProfileAction } from "@/lib/actions/children";
import { updateChildSchoolAction } from "@/lib/actions/parent-geny";
import SchoolPicker from "@/components/SchoolPicker";
import { toast } from "sonner";

type ChildRow = {
  id: number;
  fullName: string;
  birthDate: string | null;
  learningProfile: string | null;
  schoolId: number | null;
  schoolName: string | null;
};

function screenStatus(minutes: number, limit: number): "ok" | "warn" | "over" {
  if (limit <= 0) return "ok";
  const ratio = minutes / limit;
  if (ratio >= 1) return "over";
  if (ratio >= 0.75) return "warn";
  return "ok";
}

export default function ParentChildNeedsClient({
  children,
  selectedChildId,
  country,
  screenMinutesToday,
}: {
  children: ChildRow[];
  selectedChildId: number | null;
  country: string;
  screenMinutesToday: Record<number, number>;
}) {
  const t = useTranslations("ParentSpace.needs");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const [activeId, setActiveId] = useState(selectedChildId ?? children[0]?.id ?? null);
  const active = children.find((c) => c.id === activeId);
  const [profile, setProfile] = useState<ChildLearningProfile>(() =>
    parseChildLearningProfileJson(active?.learningProfile ?? null)
  );
  const [school, setSchool] = useState<{ id: number; name: string } | null>(
    active?.schoolId ? { id: active.schoolId, name: active.schoolName || "" } : null
  );
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    if (!active) return;
    setProfile(parseChildLearningProfileJson(active.learningProfile));
    setSchool(active.schoolId ? { id: active.schoolId, name: active.schoolName || "" } : null);
  }, [active]);

  const onSave = async () => {
    if (!activeId) return;
    setSaving(true);
    const profileRes = await updateChildLearningProfileAction(activeId, profile);
    if ("error" in profileRes && profileRes.error) {
      toast.error(profileRes.error);
      setSaving(false);
      return;
    }
    const schoolRes = await updateChildSchoolAction({
      childId: activeId,
      schoolId: school?.id ?? null,
      schoolName: school?.name ?? null,
      locale,
    });
    setSaving(false);
    if (schoolRes.error) {
      toast.error(schoolRes.error);
      return;
    }
    toast.success(t("saved"));
  };

  if (children.length === 0) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />
        <ParentEmptyState className="text-sm text-slate-600">{t("noChild")}</ParentEmptyState>
      </div>
    );
  }

  const childAge = childAgeFromBirthDate(active?.birthDate ?? null);
  const minutesToday = activeId ? (screenMinutesToday[activeId] ?? 0) : 0;
  const limit = profile.dailyScreenMinutes;
  const status = screenStatus(minutesToday, limit);
  const pct = limit > 0 ? Math.min(100, Math.round((minutesToday / limit) * 100)) : 0;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />

      <div className="mb-6 flex flex-wrap gap-2">
        {children.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => setActiveId(c.id)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-black transition",
              activeId === c.id
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "bg-slate-100 text-slate-600 hover:bg-orange-50"
            )}
          >
            {c.fullName.split(" ")[0]}
          </button>
        ))}
      </div>

      <ParentSectionCard className="mb-6">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div>
            <p className="mb-1 flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-orange-600">
              <Clock className="h-3.5 w-3.5" />
              {t("screenTimeToday")}
            </p>
            <p className="text-2xl font-black text-slate-900">
              {minutesToday}
              <span className="text-base font-bold text-slate-400">
                {" / "}
                {limit > 0 ? limit : "—"} {t("screenTimeMin")}
              </span>
            </p>
            <p className="mt-1 text-xs text-slate-500">{t("screenTimeUsed", { used: minutesToday, limit: limit || "—" })}</p>
          </div>
          {status === "over" && (
            <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs font-bold text-red-700">
              {t("screenTimeOver")}
            </p>
          )}
        </div>
        {limit > 0 && (
          <div className="mt-4 h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className={cn(
                "h-full rounded-full transition-all",
                status === "over" ? "bg-red-500" : status === "warn" ? "bg-amber-500" : "bg-orange-500"
              )}
              style={{ width: `${pct}%` }}
            />
          </div>
        )}
      </ParentSectionCard>

      <div className="grid gap-8 lg:grid-cols-2">
        <ParentSectionCard>
          <h2 className="mb-4 text-lg font-black text-slate-900">{t("healthTitle")}</h2>
          <ChildNeedsStep value={profile} onChange={setProfile} />
        </ParentSectionCard>

        <div className="space-y-8">
          <ParentSectionCard>
            <h2 className="mb-4 text-lg font-black text-slate-900">{t("learningTitle")}</h2>
            <ChildLearningPreferencesStep childAge={childAge} value={profile} onChange={setProfile} />
          </ParentSectionCard>

          <ParentSectionCard>
            <h2 className="mb-4 text-lg font-black text-slate-900">{t("schoolTitle")}</h2>
            <p className="mb-4 text-xs text-slate-500">{t("schoolDesc")}</p>
            <SchoolPicker value={school} onChange={setSchool} country={country} />
          </ParentSectionCard>

          <button
            type="button"
            disabled={saving}
            onClick={() => void onSave()}
            className="flex w-full items-center justify-center gap-2 rounded-2xl bg-orange-500 py-4 text-sm font-black uppercase tracking-wide text-white shadow-lg shadow-orange-500/20 hover:bg-orange-400 disabled:opacity-50"
          >
            {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

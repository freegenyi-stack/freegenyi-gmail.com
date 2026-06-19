"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Compass, Footprints, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DAILY_SCREEN_OPTIONS,
  LEARNING_MODES,
  recommendedMaxMinutes,
  screenTimeHintAr,
  screenTimeHintFr,
  type ChildLearningProfile,
  type LearningMode,
} from "@/lib/child/learning-profile";

type Props = {
  childAge: string;
  value: ChildLearningProfile;
  onChange: (next: ChildLearningProfile) => void;
};

const MODE_ICONS = {
  guided: Footprints,
  semi_guided: Compass,
  explorer: Sparkles,
} as const;

export default function ChildLearningPreferencesStep({ childAge, value, onChange }: Props) {
  const t = useTranslations("ChildOnboarding");
  const locale = useLocale();
  const isAr = locale.startsWith("ar");
  const ageNum = parseInt(childAge, 10);
  const age = Number.isNaN(ageNum) ? null : ageNum;
  const maxRec = recommendedMaxMinutes(age);

  return (
    <div className="space-y-6 pb-2">
      <div>
        <p className="text-[10px] font-black uppercase text-slate-600 mb-2 flex items-center gap-2">
          <Compass className="h-4 w-4 text-orange-500" />
          {t("learningModeTitle")}
        </p>
        <div className="grid gap-2 sm:grid-cols-3">
          {LEARNING_MODES.map((mode) => {
            const Icon = MODE_ICONS[mode.id];
            const active = value.learningMode === mode.id;
            return (
              <button
                key={mode.id}
                type="button"
                onClick={() => onChange({ ...value, learningMode: mode.id as LearningMode })}
                className={cn(
                  "rounded-2xl border-2 p-3 text-left transition",
                  active ? "border-orange-500 bg-orange-50 shadow-sm" : "border-slate-100 bg-white hover:border-orange-200"
                )}
              >
                <Icon className={cn("h-5 w-5 mb-2", active ? "text-orange-600" : "text-slate-400")} />
                <p className="text-[11px] font-black text-slate-900">{isAr ? mode.labelAr : mode.labelFr}</p>
                <p className="text-[9px] text-slate-500 mt-1 leading-snug">{isAr ? mode.descAr : mode.descFr}</p>
              </button>
            );
          })}
        </div>
        <p className="text-[10px] text-slate-500 mt-2 leading-snug">{t("learningModeChangeHint")}</p>
      </div>

      <div>
        <p className="text-[10px] font-black uppercase text-slate-600 mb-2 flex items-center gap-2">
          <Clock className="h-4 w-4 text-orange-500" />
          {t("screenTimeTitle")}
        </p>
        <p className="text-[10px] text-slate-500 mb-2">{isAr ? screenTimeHintAr(age) : screenTimeHintFr(age)}</p>
        <div className="flex flex-wrap gap-2">
          {DAILY_SCREEN_OPTIONS.filter((m) => m <= maxRec || m === value.dailyScreenMinutes).map((mins) => (
            <button
              key={mins}
              type="button"
              onClick={() => onChange({ ...value, dailyScreenMinutes: mins })}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-black transition",
                value.dailyScreenMinutes === mins
                  ? "bg-orange-500 text-white shadow-md"
                  : "bg-slate-100 text-slate-600 hover:bg-orange-50"
              )}
            >
              {mins} {t("minutesPerDay")}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

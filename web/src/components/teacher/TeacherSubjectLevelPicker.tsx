"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { PEDAGOGY_LEVELS, PEDAGOGY_SUBJECTS_AR, PEDAGOGY_SUBJECTS_FR } from "@/lib/pedagogy/constants";

type Props = {
  subjects: string[];
  levels: string[];
  onSubjectsChange: (v: string[]) => void;
  onLevelsChange: (v: string[]) => void;
  compact?: boolean;
};

export default function TeacherSubjectLevelPicker({
  subjects,
  levels,
  onSubjectsChange,
  onLevelsChange,
  compact,
}: Props) {
  const t = useTranslations("TeacherProfile");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const subjectList = isRTL ? PEDAGOGY_SUBJECTS_AR : PEDAGOGY_SUBJECTS_FR;

  const toggle = (list: string[], value: string, onChange: (v: string[]) => void) => {
    onChange(list.includes(value) ? list.filter((x) => x !== value) : [...list, value]);
  };

  return (
    <div className={cn("space-y-4", compact && "space-y-3")}>
      <div>
        <label className="mb-2 block text-[10px] font-black uppercase text-slate-500">{t("subjects")}</label>
        <div className="flex flex-wrap gap-2">
          {subjectList.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => toggle(subjects, s, onSubjectsChange)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-bold border-2 transition",
                subjects.includes(s) ? "border-teal-500 bg-teal-50 text-teal-800" : "border-slate-100 text-slate-600"
              )}
            >
              {s}
            </button>
          ))}
        </div>
      </div>
      <div>
        <label className="mb-2 block text-[10px] font-black uppercase text-slate-500">{t("levels")}</label>
        <div className="flex flex-wrap gap-2">
          {PEDAGOGY_LEVELS.map((l) => (
            <button
              key={l}
              type="button"
              onClick={() => toggle(levels, l, onLevelsChange)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-black border-2 transition",
                levels.includes(l) ? "border-teal-500 bg-teal-600 text-white" : "border-slate-100 text-slate-600"
              )}
            >
              {l}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

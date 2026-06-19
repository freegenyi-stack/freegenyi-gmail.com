"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Brain } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getConditionCategories,
  type ChildLearningProfile,
  type ChildQuestionnaire,
} from "@/lib/child/learning-profile";

type Props = {
  value: ChildLearningProfile;
  onChange: (next: ChildLearningProfile) => void;
};

export default function ChildNeedsStep({ value, onChange }: Props) {
  const t = useTranslations("ChildOnboarding");
  const locale = useLocale();
  const isAr = locale.startsWith("ar");
  const categories = getConditionCategories();

  const toggleCondition = (id: string) => {
    const set = new Set(value.conditionIds);
    if (set.has(id)) set.delete(id);
    else set.add(id);
    onChange({ ...value, conditionIds: [...set] });
  };

  const setQuestion = <K extends keyof ChildQuestionnaire>(key: K, val: ChildQuestionnaire[K]) => {
    onChange({ ...value, questionnaire: { ...value.questionnaire, [key]: val } });
  };

  const toggleQ3 = (opt: string) => {
    const cur = value.questionnaire.q3 ?? [];
    const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
    setQuestion("q3", next);
  };

  const toggleQ4 = (opt: string) => {
    const cur = value.questionnaire.q4 ?? [];
    const next = cur.includes(opt) ? cur.filter((x) => x !== opt) : [...cur, opt];
    setQuestion("q4", next);
  };

  return (
    <div className="space-y-5 pb-2">
      <div className="rounded-2xl bg-emerald-50/80 border border-emerald-100 px-4 py-3">
        <p className="text-[11px] font-black uppercase tracking-wider text-emerald-800 flex items-center gap-2">
          <Brain className="h-4 w-4" />
          {t("needsTitle")}
        </p>
        <p className="text-xs text-emerald-900/80 mt-1">{t("needsHint")}</p>
      </div>

      <div className="space-y-3">
        {categories.map((cat) => (
          <div key={cat.key} className="rounded-xl border border-slate-200 overflow-hidden bg-white">
            <div className="px-3 py-2.5 bg-slate-100 border-b border-slate-200">
              <span className="text-[10px] font-black uppercase text-slate-800">
                {isAr ? cat.labelAr : cat.labelFr}
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5 p-2.5">
              {cat.items.map((item) => {
                const active = value.conditionIds.includes(item.id);
                return (
                  <button
                    key={item.id}
                    type="button"
                    title={item.description}
                    onClick={() => toggleCondition(item.id)}
                    className={cn(
                      "rounded-full px-2.5 py-1.5 text-[10px] font-bold transition",
                      active
                        ? "bg-emerald-600 text-white shadow-sm"
                        : "bg-slate-50 border border-slate-200 text-slate-700 hover:border-emerald-400"
                    )}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      <div className="space-y-3 rounded-2xl border border-slate-100 p-3 bg-slate-50/50">
        <p className="text-[10px] font-black uppercase text-slate-600">{t("questionsTitle")}</p>

        {(["q1", "q2", "q5", "q7"] as const).map((q) => (
          <label key={q} className="flex items-start gap-2 text-xs text-slate-700 cursor-pointer">
            <input
              type="checkbox"
              checked={Boolean(value.questionnaire[q])}
              onChange={(e) => setQuestion(q, e.target.checked)}
              className="mt-0.5 rounded border-slate-300"
            />
            <span>{t(`questions.${q}`)}</span>
          </label>
        ))}

        <div>
          <p className="text-xs font-bold text-slate-700 mb-1.5">{t("questions.q3")}</p>
          <div className="flex flex-wrap gap-1.5">
            {(["Lecture", "Écriture", "Calcul", "Aucune difficulté particulière"] as const).map((opt) => (
              <button
                key={opt}
                type="button"
                onClick={() => toggleQ3(opt)}
                className={cn(
                  "rounded-lg px-2 py-1 text-[10px] font-bold border",
                  (value.questionnaire.q3 ?? []).includes(opt)
                    ? "bg-teal-600 text-white border-teal-600"
                    : "bg-white border-slate-200 text-slate-600"
                )}
              >
                {t(`q3Options.${opt}` as "q3Options.Lecture")}
              </button>
            ))}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-700 mb-1.5">{t("questions.q4")}</p>
          <div className="flex flex-wrap gap-1.5">
            {(["Orthophoniste", "Psychomotricien", "Ergothérapeute", "Psychologue", "Autre", "Non"] as const).map(
              (opt) => (
                <button
                  key={opt}
                  type="button"
                  onClick={() => toggleQ4(opt)}
                  className={cn(
                    "rounded-lg px-2 py-1 text-[10px] font-bold border",
                    (value.questionnaire.q4 ?? []).includes(opt)
                      ? "bg-violet-600 text-white border-violet-600"
                      : "bg-white border-slate-200 text-slate-600"
                  )}
                >
                  {t(`q4Options.${opt}` as "q4Options.Orthophoniste")}
                </button>
              )
            )}
          </div>
        </div>

        <div>
          <p className="text-xs font-bold text-slate-700 mb-1">{t("questions.q6")}</p>
          <input
            type="range"
            min={1}
            max={5}
            value={value.questionnaire.q6 ?? 3}
            onChange={(e) => setQuestion("q6", parseInt(e.target.value, 10))}
            className="w-full accent-orange-500"
          />
          <p className="text-[10px] text-slate-500 text-center">{value.questionnaire.q6 ?? 3} / 5</p>
        </div>
      </div>
    </div>
  );
}

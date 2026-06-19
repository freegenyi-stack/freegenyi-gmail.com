"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { ArrowLeft, ArrowRight, Check, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BilingualField } from "./composerShared";
import type { ActivityContentEnvelope, ActivityType } from "@/types/activity";
import { buildDefaultEnvelope } from "@/lib/activities/content";

type Props = {
  activityType: ActivityType;
  envelope: ActivityContentEnvelope;
  onChange: (envelope: ActivityContentEnvelope) => void;
  onDone: () => void;
};

export default function ActivityComposerAssistant({ activityType, envelope, onChange, onDone }: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const [step, setStep] = useState(0);
  const [count, setCount] = useState(3);

  const steps = [t("assistantStep1"), t("assistantStep2"), t("assistantStep3")];

  const generateSkeleton = () => {
    const base = buildDefaultEnvelope(activityType, envelope.titre_fr || "Activité", "fr");
    const next: ActivityContentEnvelope = {
      ...envelope,
      titre_fr: envelope.titre_fr || base.titre_fr,
      titre_ar: envelope.titre_ar || base.titre_ar,
      instructions_fr: envelope.instructions_fr || t("activityInstructionsPlaceholder"),
      instructions_ar: envelope.instructions_ar || "",
      activityType,
      contenu: base.contenu,
    };

    if (activityType === "QCM") {
      const questions = Array.from({ length: Math.min(10, Math.max(1, count)) }, (_, i) => ({
        question_fr: `Question ${i + 1}`,
        question_ar: `سؤال ${i + 1}`,
        choix: [
          { id: `c${i}a`, texte_fr: "Réponse A", texte_ar: "أ", correct: true },
          { id: `c${i}b`, texte_fr: "Réponse B", texte_ar: "ب", correct: false },
          { id: `c${i}c`, texte_fr: "Réponse C", texte_ar: "ج", correct: false },
        ],
        explication_fr: "",
        explication_ar: "",
      }));
      next.contenu = { type: "QCM", question_fr: "", question_ar: "", choix: [], questions };
    }

    if (activityType === "VRAI_FAUX") {
      const items = Array.from({ length: Math.min(10, Math.max(1, count)) }, (_, i) => ({
        affirmation_fr: `Affirmation ${i + 1}`,
        affirmation_ar: `عبارة ${i + 1}`,
        reponse_correcte: true,
        explication_fr: "",
        explication_ar: "",
      }));
      next.contenu = { type: "VRAI_FAUX", affirmation_fr: "", affirmation_ar: "", reponse_correcte: true, items };
    }

    onChange(next);
    setStep(2);
  };

  return (
    <div className="rounded-2xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-5">
      <div className="mb-4 flex items-center gap-2">
        <Sparkles className="h-5 w-5 text-violet-600" />
        <p className="font-black text-violet-950">{t("assistantFormTitle")}</p>
      </div>

      <div className="mb-6 flex gap-2">
        {steps.map((label, i) => (
          <div
            key={label}
            className={`flex-1 rounded-xl px-2 py-2 text-center text-[10px] font-black uppercase ${
              i === step ? "bg-violet-600 text-white" : i < step ? "bg-violet-100 text-violet-800" : "bg-slate-100 text-slate-400"
            }`}
          >
            {i + 1}. {label}
          </div>
        ))}
      </div>

      {step === 0 && (
        <div className="space-y-4">
          <p className="text-sm text-slate-600">{t("assistantInfoDesc")}</p>
          <BilingualField
            labelFr="Titre (FR)"
            labelAr="العنوان (AR)"
            valueFr={envelope.titre_fr ?? ""}
            valueAr={envelope.titre_ar ?? ""}
            onChangeFr={(v) => onChange({ ...envelope, titre_fr: v })}
            onChangeAr={(v) => onChange({ ...envelope, titre_ar: v })}
            rows={1}
          />
          <BilingualField
            labelFr={t("assistantInstructions")}
            labelAr="التعليمات"
            valueFr={envelope.instructions_fr ?? ""}
            valueAr={envelope.instructions_ar ?? ""}
            onChangeFr={(v) => onChange({ ...envelope, instructions_fr: v })}
            onChangeAr={(v) => onChange({ ...envelope, instructions_ar: v })}
            placeholderFr={t("assistantInstructionsPlaceholder")}
          />
          <Button type="button" onClick={() => setStep(1)} className="gap-2">
            {t("assignStepNext")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}

      {step === 1 && (
        <div className="space-y-4">
          <label className="block text-sm font-bold text-slate-700">
            {t("assistantQuestionsCount")}
            <input
              type="number"
              min={1}
              max={10}
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10) || 1)}
              className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2"
            />
          </label>
          <div className="flex gap-2">
            <Button type="button" variant="outline" onClick={() => setStep(0)} className="gap-2">
              <ArrowLeft className="h-4 w-4" /> {t("assignStepBack")}
            </Button>
            <Button type="button" onClick={generateSkeleton} className="gap-2">
              {t("assistantGenerate")} <Sparkles className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-4 text-center">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-100 text-emerald-700">
            <Check className="h-7 w-7" />
          </div>
          <p className="font-black text-slate-900">{t("assistantGenerated")}</p>
          <p className="text-sm text-slate-500">{t("assistantGeneratedHint")}</p>
          <Button type="button" onClick={onDone} className="gap-2">
            {t("openExpert")} <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  );
}

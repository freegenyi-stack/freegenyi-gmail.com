"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActivityMediaPicker from "./ActivityMediaPicker";
import { COMPOSER_LABELS, UnifiedField, unifiedText } from "./composerShared";
import type { ActivityLang, QcmChoice, QcmContent } from "@/types/activity";

type Props = {
  content: QcmContent;
  langue: ActivityLang;
  onChange: (content: QcmContent) => void;
};

function newChoice(index: number): QcmChoice {
  const id = `c${Date.now()}_${index}`;
  return { id, texte_fr: "", texte_ar: "", correct: index === 0 };
}

function newQuestion(index: number): Omit<QcmContent, "type" | "questions"> {
  return {
    question_fr: `Question ${index + 1}`,
    question_ar: `سؤال ${index + 1}`,
    choix: [newChoice(0), newChoice(1), newChoice(2), newChoice(3)],
    explication_fr: "",
    explication_ar: "",
  };
}

export default function ActivityComposerQCM({ content, onChange }: Props) {
  const questions =
    content.questions?.length && content.questions.length > 0
      ? content.questions
      : [{ question_fr: content.question_fr, question_ar: content.question_ar, choix: content.choix, explication_fr: content.explication_fr, explication_ar: content.explication_ar, question_image_url: content.question_image_url }];

  const sync = (nextQuestions: typeof questions) => {
    if (nextQuestions.length === 1) {
      const q = nextQuestions[0];
      onChange({
        type: "QCM",
        question_fr: q.question_fr,
        question_ar: q.question_ar,
        question_image_url: q.question_image_url,
        choix: q.choix,
        explication_fr: q.explication_fr,
        explication_ar: q.explication_ar,
      });
    } else {
      onChange({ type: "QCM", question_fr: "", question_ar: "", choix: [], questions: nextQuestions });
    }
  };

  const updateQuestion = (qi: number, patch: Partial<(typeof questions)[0]>) => {
    const next = questions.map((q, i) => (i === qi ? { ...q, ...patch } : q));
    sync(next);
  };

  const updateChoice = (qi: number, ci: number, patch: Partial<QcmChoice>) => {
    const next = questions.map((q, i) => {
      if (i !== qi) return q;
      const choix = q.choix.map((c, j) => (j === ci ? { ...c, ...patch } : c));
      return { ...q, choix };
    });
    sync(next);
  };

  const setCorrect = (qi: number, choiceId: string) => {
    const next = questions.map((q, i) => {
      if (i !== qi) return q;
      return { ...q, choix: q.choix.map((c) => ({ ...c, correct: c.id === choiceId })) };
    });
    sync(next);
  };

  return (
    <div className="space-y-6">
      {questions.map((q, qi) => (
        <div key={qi} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black text-slate-900">Question {qi + 1}</p>
            {questions.length > 1 && (
              <button
                type="button"
                onClick={() => sync(questions.filter((_, i) => i !== qi))}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <UnifiedField
            label={COMPOSER_LABELS.question}
            value={unifiedText(q.question_fr, q.question_ar)}
            onChange={(v) => updateQuestion(qi, { question_fr: v, question_ar: v })}
          />

          <ActivityMediaPicker
            label="Illustration (optionnel)"
            value={q.question_image_url}
            onChange={(url) => updateQuestion(qi, { question_image_url: url })}
          />

          <p className="mb-2 mt-4 text-xs font-black uppercase text-slate-500">Réponses — cochez la bonne</p>
          <div className="space-y-2">
            {q.choix.map((choice, ci) => (
              <div key={choice.id} className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-100 p-2">
                <input
                  type="radio"
                  name={`correct-${qi}`}
                  checked={choice.correct}
                  onChange={() => setCorrect(qi, choice.id)}
                  className="accent-teal-600"
                />
                <input
                  value={unifiedText(choice.texte_fr, choice.texte_ar)}
                  onChange={(e) => updateChoice(qi, ci, { texte_fr: e.target.value, texte_ar: e.target.value })}
                  placeholder={COMPOSER_LABELS.answer}
                  dir={/[\u0600-\u06FF]/.test(unifiedText(choice.texte_fr, choice.texte_ar)) ? "rtl" : "auto"}
                  className="min-w-[120px] flex-1 rounded-lg border border-slate-200 px-2 py-1.5 text-sm"
                />
                {q.choix.length > 2 && (
                  <button type="button" onClick={() => updateQuestion(qi, { choix: q.choix.filter((_, j) => j !== ci) })}>
                    <Trash2 className="h-4 w-4 text-slate-400" />
                  </button>
                )}
              </div>
            ))}
          </div>
          {q.choix.length < 4 && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              className="mt-2 gap-1"
              onClick={() => updateQuestion(qi, { choix: [...q.choix, newChoice(q.choix.length)] })}
            >
              <Plus className="h-3 w-3" /> Ajouter une réponse
            </Button>
          )}
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={() => sync([...questions, newQuestion(questions.length)])}
      >
        <Plus className="h-4 w-4" /> Ajouter une question
      </Button>
    </div>
  );
}

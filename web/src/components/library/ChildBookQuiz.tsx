"use client";

import React, { useState } from "react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Question = { id: number; question: string; options: string[] };

type Props = {
  bookId: number;
  childId: number;
  quizId: number;
  title: string;
  questions: Question[];
  onClose: () => void;
};

export default function ChildBookQuiz({ bookId, childId, quizId, title, questions, onClose }: Props) {
  const t = useTranslations("Library.quiz");
  const [answers, setAnswers] = useState<number[]>(() => questions.map(() => -1));
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState<{ score: number; total: number; badges: { label: string }[] } | null>(
    null
  );

  const submit = async () => {
    if (answers.some((a) => a < 0)) {
      toast.error(t("answerAll"));
      return;
    }
    setSubmitting(true);
    try {
      const res = await fetch(`/api/library/books/${bookId}/quiz`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ childId, quizId, answers }),
      });
      if (!res.ok) throw new Error();
      const data = (await res.json()) as { score: number; total: number; badges: { label: string }[] };
      setResult(data);
      toast.success(t("bravo", { score: data.score, total: data.total }));
    } catch {
      toast.error(t("submitFailed"));
    } finally {
      setSubmitting(false);
    }
  };

  if (result) {
    return (
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
        <div className="w-full max-w-md rounded-3xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl">
          <h2 className="text-xl font-black">{t("successTitle")}</h2>
          <p className="mt-2 text-sm text-slate-300">
            {t("score", { score: result.score, total: result.total })}
          </p>
          {result.badges.length > 0 && (
            <div className="mt-4 space-y-1">
              {result.badges.map((b) => (
                <p key={b.label} className="text-sm font-bold text-amber-300">
                  {t("newBadge", { label: t(`badges.${b.label}` as "badges.first_book") })}
                </p>
              ))}
            </div>
          )}
          <button
            type="button"
            onClick={onClose}
            className="mt-6 w-full rounded-xl bg-teal-600 py-3 text-sm font-black uppercase"
          >
            {t("continue")}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">
      <div className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border border-white/10 bg-slate-900 p-6 text-white shadow-2xl">
        <h2 className="text-xl font-black">{title}</h2>
        <p className="mt-1 text-sm text-slate-400">{t("endQuiz")}</p>
        <div className="mt-6 space-y-6">
          {questions.map((q, qi) => (
            <div key={q.id}>
              <p className="text-sm font-bold">{qi + 1}. {q.question}</p>
              <div className="mt-2 space-y-2">
                {q.options.map((opt, oi) => (
                  <label
                    key={opt}
                    className={`flex cursor-pointer items-center gap-2 rounded-xl border px-3 py-2 text-sm ${
                      answers[qi] === oi ? "border-teal-400 bg-teal-600/30" : "border-white/10 bg-white/5"
                    }`}
                  >
                    <input
                      type="radio"
                      name={`q-${q.id}`}
                      checked={answers[qi] === oi}
                      onChange={() =>
                        setAnswers((prev) => {
                          const next = [...prev];
                          next[qi] = oi;
                          return next;
                        })
                      }
                    />
                    {opt}
                  </label>
                ))}
              </div>
            </div>
          ))}
        </div>
        <button
          type="button"
          disabled={submitting}
          onClick={() => void submit()}
          className="mt-8 w-full rounded-xl bg-orange-600 py-3 text-sm font-black uppercase disabled:opacity-50"
        >
          {submitting ? t("submitting") : t("submit")}
        </button>
      </div>
    </div>
  );
}

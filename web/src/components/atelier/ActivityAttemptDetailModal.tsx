"use client";

import React, { useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Loader2, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActivityWrapper from "@/components/activities/ActivityWrapper";
import ActivitySolutionPanel from "@/components/activities/ActivitySolutionPanel";
import ActivityAttemptAnswersPanel from "@/components/atelier/ActivityAttemptAnswersPanel";
import { getAtelierAttemptDetailAction } from "@/lib/actions/authoring";
import type { ActivityAttemptAnswers, ActivityContentEnvelope } from "@/types/activity";
import { activityLangFromLocale } from "@/lib/activities/content";

type Props = {
  attemptId: number | null;
  locale: string;
  onClose: () => void;
};

export default function ActivityAttemptDetailModal({ attemptId, locale, onClose }: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const [loading, setLoading] = useState(false);
  const [envelope, setEnvelope] = useState<ActivityContentEnvelope | null>(null);
  const [answers, setAnswers] = useState<ActivityAttemptAnswers | null>(null);
  const [meta, setMeta] = useState<{
    childName: string | null;
    resourceTitle: string;
    score: number;
    stars: number | null;
    errors: number | null;
    durationSeconds: number | null;
    source: string;
    completedAt: string;
  } | null>(null);

  useEffect(() => {
    if (!attemptId) return;
    setLoading(true);
    setEnvelope(null);
    setAnswers(null);
    setMeta(null);
    void getAtelierAttemptDetailAction(attemptId).then((res) => {
      setLoading(false);
      if ("error" in res) return;
      const d = res.detail;
      setMeta({
        childName: d.childName,
        resourceTitle: d.resourceTitle,
        score: d.score,
        stars: d.stars,
        errors: d.errors,
        durationSeconds: d.durationSeconds,
        source: d.source,
        completedAt: d.completedAt,
      });
      if (d.envelope) {
        try {
          setEnvelope(JSON.parse(d.envelope) as ActivityContentEnvelope);
        } catch {
          setEnvelope(null);
        }
      }
      if (d.answers) {
        try {
          setAnswers(JSON.parse(d.answers) as ActivityAttemptAnswers);
        } catch {
          setAnswers(null);
        }
      }
    });
  }, [attemptId]);

  if (!attemptId) return null;

  const lang = activityLangFromLocale(locale);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      <div className="flex max-h-[90vh] w-full max-w-3xl flex-col rounded-2xl bg-white shadow-xl">
        <div className="flex items-center justify-between border-b border-slate-100 px-6 py-4">
          <div>
            <h3 className="text-lg font-black text-slate-900">{t("attemptDetailTitle")}</h3>
            {meta && (
              <p className="text-sm text-slate-500">
                {meta.childName ?? "—"} · {meta.resourceTitle}
              </p>
            )}
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-slate-400 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          {loading && (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-teal-600" />
            </div>
          )}

          {!loading && meta && (
            <div className="mb-6 grid gap-2 rounded-xl border border-teal-100 bg-teal-50/50 p-4 text-sm sm:grid-cols-2">
              <p>
                <span className="font-black text-slate-500">{t("colScore")}: </span>
                {meta.score}%
                {meta.stars != null ? (
                  <span className="ml-1 text-amber-600">{"★".repeat(Math.min(3, meta.stars))}</span>
                ) : null}
              </p>
              <p>
                <span className="font-black text-slate-500">{t("colErrors")}: </span>
                {meta.errors ?? "—"}
              </p>
              <p>
                <span className="font-black text-slate-500">{t("colDuration")}: </span>
                {meta.durationSeconds != null ? `${meta.durationSeconds}s` : "—"}
              </p>
              <p>
                <span className="font-black text-slate-500">{t("colSource")}: </span>
                {meta.source}
              </p>
              <p className="sm:col-span-2">
                <span className="font-black text-slate-500">{t("colUpdated")}: </span>
                {new Date(meta.completedAt).toLocaleString(locale)}
              </p>
            </div>
          )}

          {!loading && envelope && meta && (
            <>
              <ActivityWrapper envelope={envelope} langue={lang} activityId={0} readOnlyPreview />
              <ActivitySolutionPanel envelope={envelope} langue={lang} score={meta.score} />
            </>
          )}

          {!loading && answers && envelope && (
            <ActivityAttemptAnswersPanel envelope={envelope} answers={answers} langue={lang} />
          )}

          {!loading && !envelope && meta && (
            <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
              {t("attemptDetailNoContent")}
            </p>
          )}
        </div>

        <div className="border-t border-slate-100 px-6 py-4 text-right">
          <Button type="button" variant="outline" onClick={onClose}>
            {t("attemptDetailClose")}
          </Button>
        </div>
      </div>
    </div>
  );
}

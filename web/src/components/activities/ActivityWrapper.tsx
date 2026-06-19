"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Send, Star, Volume2, VolumeX } from "lucide-react";
import { getActivityPlayer } from "@/lib/activities/resolver";
import {
  bonusXpSansErreur,
  starsFromScore,
  xpForActivityType,
} from "@/lib/activities/xp";
import {
  fireConfetti,
  isActivitySoundsMuted,
  playActivitySound,
  setActivitySoundsMuted,
} from "@/lib/activities/sounds";
import ActivitySolutionPanel from "@/components/activities/ActivitySolutionPanel";
import type {
  ActivityAnswerEntry,
  ActivityContentEnvelope,
  ActivityContentPayload,
  ActivityLang,
  ActivityResult,
  ActivityAttemptAnswers,
} from "@/types/activity";

type Props = {
  envelope: ActivityContentEnvelope;
  langue: ActivityLang;
  activityId: string | number;
  onComplete?: (result: ActivityResult) => void;
  showTimer?: boolean;
  readOnlyPreview?: boolean;
  immersive?: boolean;
  /** Attendre un clic « Soumettre » avant d'envoyer le score et débloquer les corrections */
  requireSubmit?: boolean;
};

function countSteps(contenu: ActivityContentPayload): number {
  if ("questions" in contenu && Array.isArray(contenu.questions) && contenu.questions.length > 0) {
    return contenu.questions.length;
  }
  if ("items" in contenu && Array.isArray(contenu.items) && contenu.items.length > 0) {
    return contenu.items.length;
  }
  return 1;
}

export default function ActivityWrapper({
  envelope,
  langue,
  activityId,
  onComplete,
  showTimer = false,
  readOnlyPreview = false,
  immersive = false,
  requireSubmit = false,
}: Props) {
  const reduce = useReducedMotion();
  const started = useRef(Date.now());
  const [muted, setMuted] = useState(false);
  const [correctCount, setCorrectCount] = useState(0);
  const totalSteps = useMemo(() => countSteps(envelope.contenu), [envelope.contenu]);
  const [stepIndex, setStepIndex] = useState(0);
  const [errors, setErrors] = useState(0);
  const [attempts, setAttempts] = useState(0);
  const [finished, setFinished] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [pendingResult, setPendingResult] = useState<ActivityResult | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [xpPopup, setXpPopup] = useState<number | null>(null);
  const [feedbackFlash, setFeedbackFlash] = useState<"ok" | "ko" | null>(null);
  const consecutiveErrors = useRef(0);
  const answerEntries = useRef<ActivityAnswerEntry[]>([]);

  const recordAnswer = useCallback((entry: ActivityAnswerEntry) => {
    const existing = answerEntries.current.findIndex((e) => e.index === entry.index);
    if (existing >= 0) answerEntries.current[existing] = entry;
    else answerEntries.current.push(entry);
  }, []);

  const regles = envelope.regles;
  const primary = regles?.couleurPrincipale ?? "#F97316";
  const bg = regles?.couleurFond ?? "#FFFBF5";
  const maxAttempts = regles?.maxTentatives ?? 3;
  const notePassage = envelope.notation?.notePassage ?? 50;

  const Player = useMemo(() => getActivityPlayer(envelope.activityType), [envelope.activityType]);

  const title =
    langue === "ar"
      ? envelope.titre_ar || envelope.titre_fr || ""
      : envelope.titre_fr || envelope.titre_ar || "";

  const fontFamily =
    langue === "ar"
      ? regles?.policeAr ?? "Scheherazade New, serif"
      : regles?.policeFr ?? "Nunito, sans-serif";

  useEffect(() => {
    setActivitySoundsMuted(muted);
  }, [muted]);

  const finishSession = useCallback(
    (finalCorrect: number, finalTotal: number, finalErrors: number) => {
      const score = finalTotal > 0 ? Math.round((finalCorrect / finalTotal) * 100) : 100;
      const xpBase = (envelope.xpReward ?? xpForActivityType(envelope.activityType)) * Math.max(1, finalCorrect);
      const xpGagne = xpBase + bonusXpSansErreur(finalErrors);
      const nbEtoiles = starsFromScore(score, finalErrors);
      const tempsSecondes = Math.round((Date.now() - started.current) / 1000);
      const result: ActivityResult = {
        activityId: String(activityId),
        score,
        xpGagne,
        nbEtoiles,
        tempsSecondes,
        erreurs: finalErrors,
        answers:
          answerEntries.current.length > 0
            ? {
                activityType: envelope.activityType,
                entries: [...answerEntries.current].sort((a, b) => a.index - b.index),
              }
            : undefined,
      };

      setFinished(true);
      void playActivitySound(score >= notePassage ? "fanfare" : "encourage");
      if (score >= notePassage) void fireConfetti(score >= 100 ? "perfect" : "success");

      if (requireSubmit && !readOnlyPreview) {
        setPendingResult(result);
        return;
      }

      onComplete?.(result);
    },
    [activityId, envelope.activityType, envelope.xpReward, notePassage, onComplete, readOnlyPreview, requireSubmit]
  );

  const handleSubmit = useCallback(async () => {
    if (!pendingResult || submitted || submitting) return;
    setSubmitting(true);
    try {
      await onComplete?.(pendingResult);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  }, [onComplete, pendingResult, submitted, submitting]);

  const handleAnswer = useCallback(
    (correct: boolean) => {
      if (finished || readOnlyPreview) return;
      setAttempts((a) => a + 1);

      if (correct) {
        consecutiveErrors.current = 0;
        const nextCorrect = correctCount + 1;
        setCorrectCount(nextCorrect);
        setFeedbackFlash("ok");
        void playActivitySound("succes");
        void fireConfetti("success");
        setXpPopup(envelope.xpReward ?? xpForActivityType(envelope.activityType));
        setTimeout(() => setXpPopup(null), 1200);
        if (nextCorrect >= totalSteps) {
          setTimeout(() => finishSession(nextCorrect, totalSteps, errors), 600);
        }
      } else {
        consecutiveErrors.current += 1;
        setErrors((e) => e + 1);
        setFeedbackFlash("ko");
        void playActivitySound(consecutiveErrors.current >= 2 ? "encourage" : "erreur");
        if (attempts + 1 >= maxAttempts && regles?.autoriserRefaire === false) {
          setTimeout(() => finishSession(correctCount, totalSteps, errors + 1), 800);
        }
      }
      setTimeout(() => setFeedbackFlash(null), 600);
    },
    [
      attempts,
      correctCount,
      envelope.activityType,
      envelope.xpReward,
      errors,
      finishSession,
      finished,
      maxAttempts,
      readOnlyPreview,
      regles?.autoriserRefaire,
      totalSteps,
    ]
  );

  const handleStepComplete = useCallback(() => {
    if (stepIndex + 1 >= totalSteps) {
      finishSession(correctCount, totalSteps, errors);
    } else {
      setStepIndex((s) => s + 1);
    }
  }, [correctCount, errors, finishSession, stepIndex, totalSteps]);

  const progressPct = totalSteps > 0 ? Math.min(100, ((correctCount + (finished ? 0 : 0)) / totalSteps) * 100) : 0;
  const displayScore = pendingResult?.score ?? Math.round((correctCount / Math.max(totalSteps, 1)) * 100);
  const displayStars = pendingResult?.nbEtoiles ?? starsFromScore(displayScore, errors);
  const passed = displayScore >= notePassage;
  const hideCorrections = requireSubmit && !submitted && !readOnlyPreview;

  return (
    <div
      className={`relative overflow-hidden ${immersive ? "rounded-2xl" : "rounded-3xl"} p-4 md:p-8`}
      style={{ backgroundColor: bg, fontFamily }}
      dir={langue === "ar" ? "rtl" : "ltr"}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          {title ? <h2 className="text-lg font-black text-slate-900 md:text-xl">{title}</h2> : null}
          {showTimer ? <p className="mt-1 text-xs font-bold" style={{ color: regles?.couleurAccent ?? "#F59E0B" }}>⏱</p> : null}
        </div>
        <button
          type="button"
          onClick={() => setMuted((m) => !m)}
          className="rounded-full bg-white/80 p-2 shadow-sm"
          aria-label={muted ? "Activer le son" : "Couper le son"}
        >
          {muted || isActivitySoundsMuted() ? (
            <VolumeX className="h-5 w-5 text-slate-500" />
          ) : (
            <Volume2 className="h-5 w-5" style={{ color: primary }} />
          )}
        </button>
      </div>

      <div className="mb-4 h-3 overflow-hidden rounded-full bg-[#E4E4E7]">
        <motion.div
          className="h-full rounded-full"
          style={{ backgroundColor: primary }}
          animate={{ width: `${progressPct}%` }}
          transition={{ duration: reduce ? 0 : 0.5 }}
        />
      </div>

      <div className="relative min-h-[280px]">
        <AnimatePresence>
          {feedbackFlash && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className={`pointer-events-none absolute inset-0 z-10 rounded-3xl ${
                feedbackFlash === "ok" ? "bg-[#10B981]/10" : "bg-[#EF4444]/10"
              }`}
            />
          )}
        </AnimatePresence>

        {!finished ? (
          <motion.div
            initial={reduce ? undefined : { opacity: 0, y: 32 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, ease: "easeOut" }}
          >
            <Player
              content={envelope.contenu}
              langue={langue}
              onAnswer={readOnlyPreview ? undefined : handleAnswer}
              onStepComplete={readOnlyPreview ? undefined : handleStepComplete}
              onRecordAnswer={readOnlyPreview ? undefined : recordAnswer}
              hideCorrections={hideCorrections}
            />
          </motion.div>
        ) : (
          <div className="flex flex-col items-center justify-center py-10 text-center">
            <div className="mb-4 flex gap-2">
              {[1, 2, 3].map((n) => (
                <Star
                  key={n}
                  className={`h-10 w-10 ${
                    n <= displayStars ? "fill-[#F59E0B] text-[#F59E0B]" : "text-slate-200"
                  }`}
                />
              ))}
            </div>
            <p className="text-xl font-black text-slate-900">
              {passed
                ? langue === "ar"
                  ? "أحسنت!"
                  : "Bravo !"
                : langue === "ar"
                  ? "حاول مرة أخرى"
                  : "Continue, tu y es presque !"}
            </p>
            <p className="mt-2 text-sm font-bold text-slate-500">{displayScore}%</p>

            {requireSubmit && !submitted && pendingResult && (
              <button
                type="button"
                disabled={submitting}
                onClick={() => void handleSubmit()}
                className="mt-6 inline-flex items-center gap-2 rounded-2xl px-8 py-4 text-lg font-black text-white shadow-lg transition hover:opacity-95 disabled:opacity-60"
                style={{ backgroundColor: primary }}
              >
                <Send className="h-5 w-5" />
                {langue === "ar" ? "إرسال" : "Soumettre"}
              </button>
            )}

            {requireSubmit && !submitted && (
              <p className="mt-3 max-w-sm text-xs font-medium text-slate-500">
                {langue === "ar"
                  ? "اضغط على « إرسال » لإرسال نتيجتك إلى معلمك وعرض التصحيح."
                  : "Cliquez sur « Soumettre » pour envoyer votre score à l'enseignant et voir les corrections."}
              </p>
            )}
          </div>
        )}

        <AnimatePresence>
          {xpPopup !== null && (
            <motion.div
              initial={{ opacity: 0, scale: 0.5, y: 0 }}
              animate={{ opacity: [0, 1, 1, 0], scale: [0.5, 1.2, 1, 0.8], y: [0, -60, -80, -100] }}
              transition={{ duration: 1.2, times: [0, 0.2, 0.7, 1] }}
              className="pointer-events-none absolute left-1/2 top-1/3 z-20 -translate-x-1/2 text-4xl font-black"
              style={{ color: primary }}
            >
              +{xpPopup} XP
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {submitted && pendingResult && (
        <ActivitySolutionPanel envelope={envelope} langue={langue} score={pendingResult.score} />
      )}
    </div>
  );
}

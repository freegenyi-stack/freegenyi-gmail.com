import type { ActivityContentEnvelope, ActivityType, QcmQuestion } from "@/types/activity";
import type { ChildSessionPayload, ResolvedExerciseItem } from "./types";
import { curriculumTypeToActivity } from "./activity-map";

function itemToQcmQuestion(item: ResolvedExerciseItem, idx: number): QcmQuestion {
  if (item.type === "true_false") {
    const correct = item.correctAnswer === true || item.correctAnswer === "true";
    return {
      question_fr: item.statementFr,
      question_ar: item.statementAr,
      choix: [
        { id: `tf_${idx}_t`, texte_fr: "Vrai", texte_ar: "صح", correct: correct },
        { id: `tf_${idx}_f`, texte_fr: "Faux", texte_ar: "خطأ", correct: !correct },
      ],
      explication_fr: item.explanationFr,
    };
  }

  const optionsFr = item.optionsFr ?? [];
  const optionsAr = item.optionsAr ?? optionsFr;
  const correctStr = String(item.correctAnswer);

  return {
    question_fr: item.statementFr,
    question_ar: item.statementAr,
    choix: optionsFr.map((opt, i) => ({
      id: `opt_${idx}_${i}`,
      texte_fr: opt,
      texte_ar: optionsAr[i] ?? opt,
      correct: opt === correctStr || optionsAr[i] === correctStr,
    })),
    explication_fr: item.explanationFr,
  };
}

/** Convertit une session curriculum en enveloppe activité native (QCM multi-questions). */
export function sessionPayloadToEnvelope(payload: ChildSessionPayload): {
  envelope: ActivityContentEnvelope;
  activityType: ActivityType;
} {
  const questions = payload.items.map((item, i) => itemToQcmQuestion(item, i));
  const primaryType = curriculumTypeToActivity(payload.items[0]?.type ?? "multiple_choice");

  const envelope: ActivityContentEnvelope = {
    version: 1,
    activityType: "QCM",
    titre_fr: payload.titleFr,
    titre_ar: payload.titleAr,
    xpReward: payload.xpReward,
    contenu: {
      type: "QCM",
      questions,
    },
  };

  return { envelope, activityType: primaryType === "VRAI_FAUX" ? "QCM" : "QCM" };
}

export type CurriculumPlayPayload = {
  sessionKey: string;
  sessionId: string;
  source: ChildSessionPayload["source"];
  titleFr: string;
  titleAr: string;
  subject: ChildSessionPayload["subject"];
  competencyId: string;
  xpReward: number;
  envelope: ActivityContentEnvelope;
  activityType: ActivityType;
  itemCount: number;
};

export function toCurriculumPlayPayload(payload: ChildSessionPayload): CurriculumPlayPayload {
  const { envelope, activityType } = sessionPayloadToEnvelope(payload);
  return {
    sessionKey: payload.sessionId,
    sessionId: payload.sessionId,
    source: payload.source,
    titleFr: payload.titleFr,
    titleAr: payload.titleAr,
    subject: payload.subject,
    competencyId: payload.competencyId,
    xpReward: payload.xpReward,
    envelope,
    activityType,
    itemCount: payload.items.length,
  };
}

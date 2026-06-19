import type {
  ActivityAttemptAnswers,
  ActivityContentEnvelope,
  ActivityLang,
  ActivityResult,
  ActivityType,
} from "@/types/activity";

export function pickLang(fr: string, ar: string, lang: ActivityLang): string {
  return lang === "ar" && ar?.trim() ? ar : fr;
}

export function parseActivityEnvelope(raw: string | null | undefined): ActivityContentEnvelope | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as ActivityContentEnvelope;
    if (parsed?.version === 1 && parsed.activityType && parsed.contenu) return parsed;
    return null;
  } catch {
    return null;
  }
}

const XP_MAP: Partial<Record<ActivityType, number>> = {
  QCM: 10,
  VRAI_FAUX: 5,
  FLASHCARDS: 8,
  MEMORY_GAME: 15,
  TEXTE_A_TROUS: 10,
  DRAG_DROP: 12,
  SEQUENCING: 15,
  MATCHING: 12,
  IMAGE_HOTSPOT: 10,
  COLORIAGE: 20,
  LETTRES_MANQUANTES: 10,
  CALCUL_INTERACTIF: 10,
};

export function xpForActivityType(type: ActivityType, envelope?: ActivityContentEnvelope): number {
  return envelope?.xpReward ?? XP_MAP[type] ?? 10;
}

export function starsFromScore(score: number, erreurs: number): 1 | 2 | 3 {
  if (score >= 100 && erreurs === 0) return 3;
  if (score >= 75) return 2;
  return 1;
}

export function buildActivityResult(input: {
  activityId: number;
  activityType: ActivityType;
  envelope?: ActivityContentEnvelope;
  answers: ActivityAttemptAnswers;
  startedAt: number;
}): ActivityResult {
  const total = input.answers.entries.length || 1;
  const correct = input.answers.entries.filter((e) => e.correct).length;
  const erreurs = total - correct;
  const score = Math.round((correct / total) * 100);
  const baseXp = xpForActivityType(input.activityType, input.envelope);
  const xpGagne = score >= 50 ? baseXp + (erreurs === 0 ? 20 : 0) : Math.max(1, Math.round(baseXp * 0.3));

  return {
    activityId: String(input.activityId),
    score,
    xpGagne,
    nbEtoiles: starsFromScore(score, erreurs),
    tempsSecondes: Math.max(1, Math.round((Date.now() - input.startedAt) / 1000)),
    erreurs,
    answers: input.answers,
  };
}

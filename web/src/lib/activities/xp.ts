import type { ActivityType } from "@/types/activity";
import { getActivityTypeMeta } from "./constants";

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

export function xpForActivityType(type: ActivityType): number {
  return XP_MAP[type] ?? getActivityTypeMeta(type).xpDefault;
}

export function starsFromScore(score: number, erreurs: number, usedHelp = false): 1 | 2 | 3 {
  if (score >= 100 && erreurs === 0 && !usedHelp) return 3;
  if (score >= 75) return 2;
  return 1;
}

export function bonusXpSansErreur(erreurs: number): number {
  return erreurs === 0 ? 20 : 0;
}

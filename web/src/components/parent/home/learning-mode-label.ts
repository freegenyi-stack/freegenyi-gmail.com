import { LEARNING_MODES, type LearningMode } from "@/lib/child/learning-profile";

export function learningModeLabel(mode: LearningMode, isAr: boolean): string {
  const row = LEARNING_MODES.find((m) => m.id === mode);
  if (!row) return mode;
  return isAr ? row.labelAr : row.labelFr;
}

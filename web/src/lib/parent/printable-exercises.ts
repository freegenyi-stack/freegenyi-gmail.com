import { generateGenyExerciseSet, toPrintableBlock } from "@/lib/parent/geny-exercise-generator.server";
import type { PrintableWeakness } from "@/lib/parent/printable-types";
export type { PrintableWeakness } from "@/lib/parent/printable-types";

/** Bloc exercice Printable Factory / Geny. */
export type PrintableExerciseBlock = {
  id: string;
  subjectFr: string;
  subjectAr: string;
  titleFr: string;
  titleAr: string;
  instructionsFr: string;
  instructionsAr: string;
  questions: { fr: string; ar: string }[];
};

export function pickGenyExerciseBlocks(
  weaknesses: PrintableWeakness[],
  educationLevel: string | null,
  count = 3
): PrintableExerciseBlock[] {
  return generateGenyExerciseSet({ weaknesses, educationLevel, count }).map(toPrintableBlock);
}

export function pickSampleExercise(
  weaknessSubject?: string | null,
  educationLevel: string | null = null
): PrintableExerciseBlock {
  const weaknesses = weaknessSubject
    ? [{ kind: "mission" as const, subject: weaknessSubject, label: "", detail: "" }]
    : [];
  return pickGenyExerciseBlocks(weaknesses, educationLevel, 1)[0];
}

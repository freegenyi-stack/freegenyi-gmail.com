import type { ActivityType } from "@/types/activity";
import type { ExerciseItemType } from "./types";

/** Pont usine curriculum (6 types) ↔ moteur activités natif (12 types). */
const CURRICULUM_TO_ACTIVITY: Record<ExerciseItemType, ActivityType> = {
  multiple_choice: "QCM",
  true_false: "VRAI_FAUX",
  fill_blank: "TEXTE_A_TROUS",
  matching: "MATCHING",
  ordering: "SEQUENCING",
  calcul_interactif: "CALCUL_INTERACTIF",
};

const EXTENSION_TO_ACTIVITY: Record<string, ActivityType> = {
  flashcards: "FLASHCARDS",
  memory_game: "MEMORY_GAME",
  drag_drop: "DRAG_DROP",
  image_hotspot: "IMAGE_HOTSPOT",
  coloriage: "COLORIAGE",
  letters_missing: "LETTRES_MANQUANTES",
};

export function curriculumTypeToActivity(type: string): ActivityType {
  if (type in CURRICULUM_TO_ACTIVITY) {
    return CURRICULUM_TO_ACTIVITY[type as ExerciseItemType];
  }
  return EXTENSION_TO_ACTIVITY[type] ?? "QCM";
}

export const NATIVE_ACTIVITY_TYPE_COUNT = 12;

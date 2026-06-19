import type { ComponentType } from "react";
import type { ActivityContentPayload, ActivityLang, ActivityPlayerProps, ActivityType } from "@/types/activity";
import {
  ActivityCalculInteractif,
  ActivityColoriage,
  ActivityDragDrop,
  ActivityFlashcards,
  ActivityImageHotspot,
  ActivityLettresManquantes,
  ActivityMatching,
  ActivityMemoryGame,
  ActivityQCM,
  ActivitySequencing,
  ActivityTexteATrous,
  ActivityVraiFaux,
} from "@/components/activities";

type PlayerComponent = ComponentType<ActivityPlayerProps>;

const MAP: Record<ActivityType, PlayerComponent> = {
  QCM: ActivityQCM as PlayerComponent,
  VRAI_FAUX: ActivityVraiFaux as PlayerComponent,
  FLASHCARDS: ActivityFlashcards as PlayerComponent,
  MEMORY_GAME: ActivityMemoryGame as PlayerComponent,
  TEXTE_A_TROUS: ActivityTexteATrous as PlayerComponent,
  DRAG_DROP: ActivityDragDrop as PlayerComponent,
  SEQUENCING: ActivitySequencing as PlayerComponent,
  MATCHING: ActivityMatching as PlayerComponent,
  IMAGE_HOTSPOT: ActivityImageHotspot as PlayerComponent,
  COLORIAGE: ActivityColoriage as PlayerComponent,
  LETTRES_MANQUANTES: ActivityLettresManquantes as PlayerComponent,
  CALCUL_INTERACTIF: ActivityCalculInteractif as PlayerComponent,
};

export function getActivityPlayer(type: ActivityType): PlayerComponent {
  return MAP[type] ?? ActivityQCM;
}

export function renderActivityPlayer(
  type: ActivityType,
  content: ActivityContentPayload,
  langue: ActivityLang,
  handlers: Pick<ActivityPlayerProps, "onAnswer" | "onStepComplete" | "disabled">
) {
  const Player = getActivityPlayer(type);
  return <Player content={content} langue={langue} {...handlers} />;
}

export type ActivityLang = "fr" | "ar";

export type ActivityType =
  | "QCM"
  | "VRAI_FAUX"
  | "FLASHCARDS"
  | "MEMORY_GAME"
  | "TEXTE_A_TROUS"
  | "DRAG_DROP"
  | "SEQUENCING"
  | "MATCHING"
  | "IMAGE_HOTSPOT"
  | "COLORIAGE"
  | "LETTRES_MANQUANTES"
  | "CALCUL_INTERACTIF";

export type ActivityAnswerEntry = {
  index: number;
  questionId?: string;
  label?: string;
  answer: string | boolean | null;
  correct?: boolean;
};

export type ActivityAttemptAnswers = {
  activityType: ActivityType;
  entries: ActivityAnswerEntry[];
};

export type ActivityResult = {
  activityId: string;
  score: number;
  xpGagne: number;
  nbEtoiles: 1 | 2 | 3;
  tempsSecondes: number;
  erreurs: number;
  answers?: ActivityAttemptAnswers;
};

export type QcmChoice = {
  id: string;
  texte_fr: string;
  texte_ar: string;
  correct: boolean;
};

export type QcmQuestion = {
  question_fr: string;
  question_ar: string;
  question_image_url?: string | null;
  choix: QcmChoice[];
  explication_fr?: string;
  explication_ar?: string;
};

export type QcmContent = {
  type: "QCM";
  questions?: QcmQuestion[];
} & QcmQuestion;

export type VraiFauxItem = {
  affirmation_fr: string;
  affirmation_ar: string;
  reponse_correcte: boolean;
  explication_fr?: string;
  explication_ar?: string;
};

export type VraiFauxContent = {
  type: "VRAI_FAUX";
  items?: VraiFauxItem[];
} & VraiFauxItem;

export type ActivityContentEnvelope = {
  version: 1;
  activityType: ActivityType;
  titre_fr?: string;
  titre_ar?: string;
  xpReward?: number;
  contenu: QcmContent | VraiFauxContent | { type: string };
};

export type MissionPayload = {
  progressId: number;
  status: string;
  resourceId: number;
  resourceTitle: string;
  resourceKind: string;
  isActivity: boolean;
  activityType: ActivityType;
  envelope: ActivityContentEnvelope;
  langue: ActivityLang;
};

export type ChildMission = {
  progressId: number;
  resourceId: number;
  resourceTitle: string;
  resourceKind: string;
  isActivity: boolean;
  teacherName: string | null;
  status: string;
  note: string | null;
  xpEarned: number | null;
};

export type GenyWorksheet = {
  id: number;
  childId: number;
  childName: string;
  sets: {
    id: string;
    titleFr: string;
    titleAr: string;
    subjectFr: string;
    subjectAr: string;
    instructionsFr: string;
    instructionsAr: string;
    questions: { fr: string; ar: string }[];
  }[];
  status: "pending" | "done" | "archived";
  note?: string;
};

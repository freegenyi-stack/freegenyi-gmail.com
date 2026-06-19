/** Types activités interactives FreeGeny (moteur natif, remplace H5P). */

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

export type ActivityMatiere =
  | "MATHEMATIQUES"
  | "FRANCAIS"
  | "ARABE"
  | "HISTOIRE"
  | "GEOGRAPHIE"
  | "SCIENCES"
  | "EDUCATION_ISLAMIQUE";

export type ActivityResult = {
  activityId: string;
  score: number;
  xpGagne: number;
  nbEtoiles: 1 | 2 | 3;
  tempsSecondes: number;
  erreurs: number;
  answers?: ActivityAttemptAnswers;
};

/** Réponse élève pour une question / étape */
export type ActivityAnswerEntry = {
  index: number;
  questionId?: string;
  label?: string;
  answer: string | boolean | Record<string, string> | number[] | null;
  correct?: boolean;
};

export type ActivityAttemptAnswers = {
  activityType: ActivityType;
  entries: ActivityAnswerEntry[];
};

/** Règles pédagogiques définies par l'enseignant */
export type ActivityRegles = {
  autoriserRefaire?: boolean;
  maxTentatives?: number;
  notePassage?: number;
  couleurPrincipale?: string;
  couleurFond?: string;
  couleurAccent?: string;
  policeFr?: string;
  policeAr?: string;
  afficherChrono?: boolean;
};

export type ActivityNotation = {
  /** Note minimale pour réussir (0–100) */
  notePassage: number;
  /** Barème sur lequel la note est calculée */
  bareme: number;
};

/** Enveloppe stockée dans authoring_resources.content_json */
export type ActivityContentEnvelope = {
  version: 1;
  activityType: ActivityType;
  matiere?: ActivityMatiere;
  titre_fr?: string;
  titre_ar?: string;
  instructions_fr?: string;
  instructions_ar?: string;
  xpReward?: number;
  dureeEstimeeSecondes?: number;
  notation?: ActivityNotation;
  regles?: ActivityRegles;
  contenu: ActivityContentPayload;
};

export type ActivityContentPayload =
  | QcmContent
  | VraiFauxContent
  | FlashcardsContent
  | MemoryGameContent
  | TexteATrousContent
  | DragDropContent
  | SequencingContent
  | MatchingContent
  | ImageHotspotContent
  | ColoriageContent
  | LettresManquantesContent
  | CalculInteractifContent;

export type QcmChoice = {
  id: string;
  texte_fr: string;
  texte_ar: string;
  correct: boolean;
};

export type QcmContent = {
  type: "QCM";
  question_fr: string;
  question_ar: string;
  question_image_url?: string | null;
  question_audio_url?: string | null;
  choix: QcmChoice[];
  explication_fr?: string;
  explication_ar?: string;
  /** Plusieurs questions pour une session quiz */
  questions?: Array<Omit<QcmContent, "type" | "questions">>;
};

export type VraiFauxContent = {
  type: "VRAI_FAUX";
  affirmation_fr: string;
  affirmation_ar: string;
  affirmation_audio_url?: string | null;
  reponse_correcte: boolean;
  explication_fr?: string;
  explication_ar?: string;
  items?: Array<Omit<VraiFauxContent, "type" | "items">>;
};

export type FlashcardItem = {
  id: string;
  recto_texte_fr: string;
  recto_texte_ar: string;
  recto_image_url?: string | null;
  verso_texte_fr: string;
  verso_texte_ar: string;
  verso_audio_url?: string | null;
};

export type FlashcardsContent = {
  type: "FLASHCARDS";
  cartes: FlashcardItem[];
};

export type MemoryPair = {
  id: string;
  carte_a: { type: "image" | "texte" | "texte_ar"; valeur: string };
  carte_b: { type: "image" | "texte" | "texte_ar"; valeur: string };
};

export type MemoryGameContent = {
  type: "MEMORY_GAME";
  grille: "4x3" | "4x4";
  timer_secondes?: number | null;
  paires: MemoryPair[];
};

export type TexteTrou = {
  id: string;
  reponse_correcte: string;
  reponse_correcte_ar?: string;
  position: number;
};

export type TexteATrousContent = {
  type: "TEXTE_A_TROUS";
  mode: "choix" | "clavier";
  texte_fr: string;
  texte_ar: string;
  trous: TexteTrou[];
  word_bank_fr?: string[];
  word_bank_ar?: string[];
};

export type DragDropElement = {
  id: string;
  texte_fr: string;
  texte_ar: string;
  image_url?: string | null;
  zone_correcte: string;
};

export type DragDropZone = {
  id: string;
  label_fr: string;
  label_ar: string;
  couleur_fond?: string;
  icone?: string;
  /** Position sur le canvas (%) — éditeur visuel Phase 3 */
  x_percent?: number;
  y_percent?: number;
  width_percent?: number;
  height_percent?: number;
};

export type DragDropContent = {
  type: "DRAG_DROP";
  instruction_fr: string;
  instruction_ar: string;
  image_url?: string | null;
  elements: DragDropElement[];
  zones: DragDropZone[];
};

export type SequencingItem = {
  id: string;
  texte_fr: string;
  texte_ar: string;
  image_url?: string | null;
  ordre_correct: number;
};

export type SequencingContent = {
  type: "SEQUENCING";
  instruction_fr: string;
  instruction_ar: string;
  elements: SequencingItem[];
};

export type MatchingPair = {
  id: string;
  colonne_a: { type: "texte" | "image"; valeur_fr?: string; valeur_ar?: string; valeur?: string };
  colonne_b: { type: "texte" | "image"; valeur_fr?: string; valeur_ar?: string; valeur?: string };
};

export type MatchingContent = {
  type: "MATCHING";
  instruction_fr: string;
  instruction_ar: string;
  paires: MatchingPair[];
};

export type HotspotZone = {
  id: string;
  label_fr: string;
  label_ar: string;
  x_percent: number;
  y_percent: number;
  rayon_percent: number;
  correct: boolean;
};

export type ImageHotspotContent = {
  type: "IMAGE_HOTSPOT";
  image_url: string;
  instruction_fr: string;
  instruction_ar: string;
  instruction_audio_url?: string | null;
  zones: HotspotZone[];
};

export type ColoriageZone = {
  zone_id: string;
  couleur_correcte: string;
  label_fr: string;
  label_ar: string;
};

export type ColoriageContent = {
  type: "COLORIAGE";
  mode: "guide" | "libre";
  svg_url: string;
  instruction_fr: string;
  instruction_ar: string;
  zones_guidees?: ColoriageZone[];
  palette: string[];
};

export type LettresManquantesContent = {
  type: "LETTRES_MANQUANTES";
  image_url?: string | null;
  mot_fr: string;
  mot_ar: string;
  lettres_masquees_fr: number[];
  lettres_masquees_ar: number[];
  lettres_disponibles_fr: string[];
  lettres_disponibles_ar: string[];
  audio_url_fr?: string | null;
  audio_url_ar?: string | null;
};

export type CalculInteractifContent = {
  type: "CALCUL_INTERACTIF";
  operation: "addition" | "soustraction" | "multiplication" | "division";
  nombre_a: number;
  nombre_b: number;
  icone_visuelle?: string;
  question_fr: string;
  question_ar: string;
  reponse_correcte: number;
  aide_visuelle?: boolean;
  chiffres_arabes?: boolean;
  items?: Array<Omit<CalculInteractifContent, "type" | "items">>;
};

export type ActivityPlayerProps = {
  content: ActivityContentPayload;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
  /** Masque explications et réponses correctes jusqu'à la soumission finale */
  hideCorrections?: boolean;
};

/** Codes pays / niveaux / matières — usine curriculum FreeGeny */

export type CurriculumCountry = "DZ";
export type CurriculumLevel = "1AP" | "2AP" | "3AP" | "4AP" | "5AP";
export type CurriculumSubject = "ar_islam_civique" | "math_est";

export type CurriculumProfile = "parent" | "teacher" | "official_path" | "child";

export type SessionSource = "official_path" | "parent_geny" | "teacher_quick" | "teacher_atelier";

export type ExerciseItemType =
  | "multiple_choice"
  | "true_false"
  | "fill_blank"
  | "matching"
  | "ordering"
  | "calcul_interactif";

export type CurriculumBundleMeta = {
  country: CurriculumCountry;
  level: CurriculumLevel;
  subject: CurriculumSubject;
  moduleId: string;
  version: number;
};

export type CurriculumNode = {
  nodeId: string;
  type: "competency" | "unit" | "maqta";
  domaine: string;
  order: number;
  titreFr: string;
  titreAr?: string;
  maqtaId?: string;
  trimesterId?: string;
  pageRef?: number;
  learningObjectives?: string[];
  learningObjectivesFr?: string[];
  officialObjectiveAr?: string;
};

export type CompetencyRecord = {
  competencyId: string;
  domaine: string;
  maqtaId?: string;
  nameFr: string;
  nameAr?: string;
  skillType: string;
  indicators: { indicatorId: string; textFr?: string; text?: string; bloomLevel: string }[];
};

export type ExerciseBankItem = {
  id: string;
  competencyId: string;
  variantGroup: string;
  type: ExerciseItemType;
  domaine: string;
  difficulty: number;
  points: number;
  profiles: CurriculumProfile[];
  statementFr?: string;
  statementAr?: string;
  optionsFr?: string[];
  optionsAr?: string[];
  correctAnswer: string | boolean | number;
  explanationFr?: string;
  feedback?: { correctFr?: string; incorrectFr?: string };
  templateVars?: Record<string, string[]>;
};

export type ResolvedExerciseItem = {
  itemId: string;
  type: ExerciseItemType;
  statementFr: string;
  statementAr: string;
  optionsFr?: string[];
  optionsAr?: string[];
  correctAnswer: string | boolean;
  explanationFr?: string;
  feedbackCorrect?: string;
  feedbackIncorrect?: string;
  points: number;
};

export type ChildSessionPayload = {
  sessionId: string;
  payloadVersion: 1;
  source: SessionSource;
  profile: "child";
  country: CurriculumCountry;
  level: CurriculumLevel;
  subject: CurriculumSubject;
  competencyId: string;
  titleFr: string;
  titleAr: string;
  xpReward: number;
  items: ResolvedExerciseItem[];
  meta?: {
    fromTeacherName?: string;
    dueAt?: string;
    allowRetry?: boolean;
  };
};

export type PathNodeStatus = "locked" | "available" | "in_progress" | "completed" | "mastered";

export type ChildPathNode = {
  nodeId: string;
  competencyId: string;
  titreFr: string;
  titreAr?: string;
  domaine: string;
  order: number;
  status: PathNodeStatus;
  stars: 0 | 1 | 2 | 3;
};

export type ChildPathResponse = {
  country: CurriculumCountry;
  level: CurriculumLevel;
  subject: CurriculumSubject;
  moduleId: string;
  nodes: ChildPathNode[];
  currentNodeId: string | null;
};

export type ContentKind =
  | "lesson"
  | "surah"
  | "mahfoudat"
  | "exercise"
  | "project"
  | "audio";

export type CurriculumLessonRecord = {
  lessonId: string;
  unitId: string;
  contentKind: ContentKind;
  status: string;
  formats: string[];
  figmaTemplateSlot?: string;
  audioRef?: string | null;
};

export type ProgramHubSection = {
  maqtaId: string;
  order: number;
  titreFr: string;
  titreAr?: string;
  status?: string;
  unitCount: number;
  nodeCount: number;
  exerciseCount: number;
  worldThemeId?: string;
};

export type ProgramHubSubject = {
  code: CurriculumSubject;
  labelFr: string;
  labelAr?: string;
  moduleId: string;
  sections: ProgramHubSection[];
};

export type ProgramHubEnrichmentModule = {
  code: string;
  labelFr: string;
  status: string;
};

export type ProgramHubResponse = {
  country: CurriculumCountry;
  level: CurriculumLevel;
  labelFr: string;
  labelAr?: string;
  subjects: ProgramHubSubject[];
  enrichment: {
    labelFr: string;
    labelAr?: string;
    modules: ProgramHubEnrichmentModule[];
  } | null;
  contentFilters: { id: string; labelFr: string; labelAr?: string }[];
};

export type ProgramSectionUnit = {
  unitId: string;
  blockId?: string;
  titreFr: string;
  titreAr?: string;
  pageRef?: number;
  contentKind: ContentKind;
  lessonId?: string;
  lessonStatus?: string;
  competencyId?: string;
};

export type ProgramSectionBlock = {
  blockId: string;
  domaine: string;
  titreFr: string;
  titreAr?: string;
  contentKinds: ContentKind[];
  units: ProgramSectionUnit[];
};

export type ProgramSectionDetail = {
  maqtaId: string;
  titreFr: string;
  titreAr?: string;
  subject: CurriculumSubject;
  level: CurriculumLevel;
  blocks: ProgramSectionBlock[];
  nodes: ChildPathNode[];
};

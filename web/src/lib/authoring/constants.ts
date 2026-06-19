import type { AuthoringResourceType } from "./types";

export const AUTHORING_RESOURCE_TYPES: {
  id: AuthoringResourceType;
  labelFr: string;
  labelAr: string;
}[] = [
  { id: "lesson", labelFr: "Leçon", labelAr: "درس" },
  { id: "exam", labelFr: "Examen", labelAr: "امتحان" },
  { id: "control", labelFr: "Contrôle continu", labelAr: "مراقبة مستمرة" },
  { id: "activity", labelFr: "Activité", labelAr: "نشاط" },
  { id: "revision", labelFr: "Fiche de révision", labelAr: "ورقة مراجعة" },
  { id: "planning", labelFr: "Planning", labelAr: "خطة" },
  { id: "parent_sheet", labelFr: "Fiche parent", labelAr: "ورقة ولي" },
  { id: "other", labelFr: "Autre", labelAr: "أخرى" },
];

/** Assistants H5P — mapping vers libraries H5P standard */
export const H5P_ASSISTANT_TYPES = [
  {
    id: "quiz",
    library: "H5P.QuestionSet",
    labelFr: "Quiz / QCM",
    labelAr: "اختبار / QCM",
    descriptionFr: "Série de questions variées (QCM, vrai/faux…) avec score.",
    descriptionAr: "سلسلة أسئلة متنوعة مع نقاط.",
    icon: "list-checks",
    resourceType: "activity" as AuthoringResourceType,
  },
  {
    id: "blanks",
    library: "H5P.Blanks",
    labelFr: "Texte à trous",
    labelAr: "نص بفراغات",
    descriptionFr: "Compléter un texte en glissant ou tapant les mots manquants.",
    descriptionAr: "أكمل نصاً بالكلمات الناقصة.",
    icon: "text-cursor-input",
    resourceType: "activity" as AuthoringResourceType,
  },
  {
    id: "drag",
    library: "H5P.DragQuestion",
    labelFr: "Glisser-déposer",
    labelAr: "سحب وإفلات",
    descriptionFr: "Associer des éléments à des zones sur une image.",
    descriptionAr: "اربط عناصر بمناطق على صورة.",
    icon: "move",
    resourceType: "activity" as AuthoringResourceType,
  },
  {
    id: "flashcards",
    library: "H5P.Flashcards",
    labelFr: "Flashcards",
    labelAr: "بطاقات",
    descriptionFr: "Cartes recto/verso pour mémoriser vocabulaire ou notions.",
    descriptionAr: "بطاقات أمام/خلف للحفظ.",
    icon: "layers",
    resourceType: "revision" as AuthoringResourceType,
  },
  {
    id: "truefalse",
    library: "H5P.TrueFalse",
    labelFr: "Vrai / Faux",
    labelAr: "صح / خطأ",
    descriptionFr: "Valider ou infirmer une affirmation simple.",
    descriptionAr: "صحّح أو انفِ عبارة بسيطة.",
    icon: "toggle-left",
    resourceType: "activity" as AuthoringResourceType,
  },
  {
    id: "ivideo",
    library: "H5P.InteractiveVideo",
    labelFr: "Vidéo interactive",
    labelAr: "فيديو تفاعلي",
    descriptionFr: "Vidéo YouTube enrichie de questions et repères.",
    descriptionAr: "فيديو يوتيوب مع أسئلة تفاعلية.",
    icon: "video",
    resourceType: "activity" as AuthoringResourceType,
  },
] as const;

export function currentSchoolYear(): string {
  const now = new Date();
  const y = now.getFullYear();
  const m = now.getMonth();
  return m >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`;
}

export function templateToResourceType(templateId: string): AuthoringResourceType {
  const map: Record<string, AuthoringResourceType> = {
    t1: "lesson",
    t2: "exam",
    t3: "revision",
    t4: "exam",
    t5: "parent_sheet",
    t6: "planning",
  };
  return map[templateId] ?? "other";
}

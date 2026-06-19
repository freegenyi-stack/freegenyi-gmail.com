import type { ActivityLang, ActivityType, ActivityMatiere } from "@/types/activity";

export type ActivityTypeMeta = {
  id: ActivityType;
  labelFr: string;
  labelAr: string;
  descriptionFr: string;
  descriptionAr: string;
  icon: string;
  matieres: ActivityMatiere[];
  xpDefault: number;
  /** Vidéo interactive reportée */
  comingSoon?: boolean;
};

export const ACTIVITY_TYPES: ActivityTypeMeta[] = [
  {
    id: "QCM",
    labelFr: "QCM — Choix multiple",
    labelAr: "اختيار من متعدد",
    descriptionFr: "Une question, plusieurs réponses possibles.",
    descriptionAr: "سؤال مع عدة إجابات.",
    icon: "list-checks",
    matieres: ["MATHEMATIQUES", "FRANCAIS", "ARABE", "HISTOIRE", "GEOGRAPHIE", "SCIENCES", "EDUCATION_ISLAMIQUE"],
    xpDefault: 10,
  },
  {
    id: "VRAI_FAUX",
    labelFr: "Vrai ou Faux",
    labelAr: "صح أو خطأ",
    descriptionFr: "Valider ou infirmer une affirmation.",
    descriptionAr: "صحّح أو انفِ عبارة.",
    icon: "toggle-left",
    matieres: ["MATHEMATIQUES", "FRANCAIS", "HISTOIRE", "SCIENCES", "EDUCATION_ISLAMIQUE"],
    xpDefault: 5,
  },
  {
    id: "FLASHCARDS",
    labelFr: "Flashcards",
    labelAr: "بطاقات",
    descriptionFr: "Cartes recto/verso pour mémoriser.",
    descriptionAr: "بطاقات للحفظ.",
    icon: "layers",
    matieres: ["ARABE", "FRANCAIS", "HISTOIRE", "GEOGRAPHIE", "EDUCATION_ISLAMIQUE"],
    xpDefault: 8,
  },
  {
    id: "MEMORY_GAME",
    labelFr: "Jeu des paires",
    labelAr: "لعبة الذاكرة",
    descriptionFr: "Retrouver les paires identiques.",
    descriptionAr: "اعثر على الأزواج.",
    icon: "grid-3x3",
    matieres: ["ARABE", "FRANCAIS", "MATHEMATIQUES", "SCIENCES", "EDUCATION_ISLAMIQUE"],
    xpDefault: 15,
  },
  {
    id: "TEXTE_A_TROUS",
    labelFr: "Texte à trous",
    labelAr: "نص بفراغات",
    descriptionFr: "Compléter un texte avec les bons mots.",
    descriptionAr: "أكمل النص بالكلمات الصحيحة.",
    icon: "text-cursor-input",
    matieres: ["FRANCAIS", "ARABE", "SCIENCES", "HISTOIRE"],
    xpDefault: 10,
  },
  {
    id: "DRAG_DROP",
    labelFr: "Glisser-déposer",
    labelAr: "سحب وإفلات",
    descriptionFr: "Classer des éléments dans les bonnes zones.",
    descriptionAr: "صنّف العناصر في الخانات.",
    icon: "move",
    matieres: ["MATHEMATIQUES", "SCIENCES", "GEOGRAPHIE", "FRANCAIS", "ARABE"],
    xpDefault: 12,
  },
  {
    id: "SEQUENCING",
    labelFr: "Remettre dans l'ordre",
    labelAr: "ترتيب",
    descriptionFr: "Réordonner des cartes dans le bon ordre.",
    descriptionAr: "رتّب البطاقات.",
    icon: "arrow-down-up",
    matieres: ["HISTOIRE", "SCIENCES", "FRANCAIS", "MATHEMATIQUES"],
    xpDefault: 15,
  },
  {
    id: "MATCHING",
    labelFr: "Relier",
    labelAr: "ربط",
    descriptionFr: "Relier deux colonnes d'éléments.",
    descriptionAr: "اربط العمودين.",
    icon: "link-2",
    matieres: ["ARABE", "FRANCAIS", "MATHEMATIQUES", "SCIENCES", "HISTOIRE"],
    xpDefault: 12,
  },
  {
    id: "IMAGE_HOTSPOT",
    labelFr: "Image interactive",
    labelAr: "صورة تفاعلية",
    descriptionFr: "Cliquer la bonne zone sur une image.",
    descriptionAr: "انقر على المنطقة الصحيحة.",
    icon: "map-pin",
    matieres: ["SCIENCES", "GEOGRAPHIE", "HISTOIRE"],
    xpDefault: 10,
  },
  {
    id: "COLORIAGE",
    labelFr: "Coloriage",
    labelAr: "تلوين",
    descriptionFr: "Colorier une image SVG.",
    descriptionAr: "لوّن الصورة.",
    icon: "palette",
    matieres: ["SCIENCES", "ARABE", "FRANCAIS"],
    xpDefault: 20,
  },
  {
    id: "LETTRES_MANQUANTES",
    labelFr: "Lettres manquantes",
    labelAr: "حروف ناقصة",
    descriptionFr: "Compléter un mot lettre par lettre.",
    descriptionAr: "أكمل الكلمة.",
    icon: "spell-check",
    matieres: ["ARABE", "FRANCAIS"],
    xpDefault: 10,
  },
  {
    id: "CALCUL_INTERACTIF",
    labelFr: "Calcul interactif",
    labelAr: "حساب تفاعلي",
    descriptionFr: "Résoudre une opération avec clavier numérique.",
    descriptionAr: "حل العملية الحسابية.",
    icon: "calculator",
    matieres: ["MATHEMATIQUES"],
    xpDefault: 10,
  },
];

export const H5P_LIBRARY_TO_ACTIVITY: Record<string, ActivityType> = {
  "H5P.QuestionSet": "QCM",
  "H5P.MultiChoice": "QCM",
  "H5P.TrueFalse": "VRAI_FAUX",
  "H5P.Flashcards": "FLASHCARDS",
  "H5P.Blanks": "TEXTE_A_TROUS",
  "H5P.DragQuestion": "DRAG_DROP",
};

export function getActivityTypeMeta(type: ActivityType): ActivityTypeMeta {
  return ACTIVITY_TYPES.find((t) => t.id === type) ?? ACTIVITY_TYPES[0];
}

export function activityTypeLabel(type: ActivityType, lang: ActivityLang): string {
  const meta = getActivityTypeMeta(type);
  return lang === "ar" ? meta.labelAr : meta.labelFr;
}

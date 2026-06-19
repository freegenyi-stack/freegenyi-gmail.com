import catalog from "@/data/child-needs-catalog.json";

export type LearningMode = "guided" | "semi_guided" | "explorer";

export type ChildQuestionnaire = {
  q1?: boolean;
  q2?: boolean;
  q3?: string[];
  q4?: string[];
  q5?: boolean;
  q6?: number;
  q7?: boolean;
};

export type ChildLearningProfile = {
  conditionIds: string[];
  questionnaire: ChildQuestionnaire;
  learningMode: LearningMode;
  dailyScreenMinutes: number;
  updatedAt: string;
};

export const LEARNING_MODES: {
  id: LearningMode;
  labelFr: string;
  labelAr: string;
  descFr: string;
  descAr: string;
}[] = [
  {
    id: "guided",
    labelFr: "Pas à pas",
    labelAr: "خطوة بخطوة",
    descFr: "L'app guide votre enfant séquence par séquence.",
    descAr: "التطبيق يرافق طفلك خطوة بخطوة.",
  },
  {
    id: "semi_guided",
    labelFr: "Avec un fil conducteur",
    labelAr: "مع مسار مرافق",
    descFr: "Liberté encadrée — votre enfant choisit dans un cadre.",
    descAr: "حرية مع إطار — يختار ضمن مسار واضح.",
  },
  {
    id: "explorer",
    labelFr: "Explorateur",
    labelAr: "مستكشف",
    descFr: "Votre enfant navigue seul dans le catalogue.",
    descAr: "طفلك يتنقل بحرية في المحتوى.",
  },
];

export const DAILY_SCREEN_OPTIONS = [10, 15, 20, 30] as const;

/** Recommandation OMS / bonnes pratiques — indicatif pour les parents */
export function recommendedMaxMinutes(age: number | null): number {
  if (!age || age <= 5) return 20;
  if (age <= 8) return 30;
  if (age <= 11) return 45;
  return 60;
}

export function screenTimeHintFr(age: number | null): string {
  const max = recommendedMaxMinutes(age);
  if (!age || age <= 5) {
    return `Pour ${age || "3–5"} ans : privilégiez 10–20 min de contenu éducatif de qualité (max indicatif ${max} min/jour).`;
  }
  if (age <= 8) {
    return `Pour ${age} ans : 15–30 min/jour recommandées pour un usage scolaire serein (max indicatif ${max} min).`;
  }
  return `Pour ${age} ans : fixez une routine régulière — max indicatif ${max} min/jour d'écran éducatif.`;
}

export function screenTimeHintAr(age: number | null): string {
  const max = recommendedMaxMinutes(age);
  if (!age || age <= 5) {
    return `لعمر ${age || "3–5"} سنوات: 10–20 دقيقة يومياً (حد إرشادي ${max} د).`;
  }
  if (age <= 8) {
    return `لعمر ${age} سنوات: 15–30 دقيقة يومياً (حد إرشادي ${max} د).`;
  }
  return `لعمر ${age} سنوات: رoutine منتظمة — حد إرشادي ${max} د/يوم.`;
}

export type ConditionCategory = {
  key: string;
  labelFr: string;
  labelAr: string;
  items: { id: string; label: string; description: string }[];
};

const CATEGORY_LABELS: Record<string, { fr: string; ar: string }> = {
  troubles_apprentissages_dys: { fr: "Troubles DYS", ar: "صعوبات التعلم" },
  troubles_attention: { fr: "Attention & hyperactivité", ar: "الانتباه والنشاط" },
  troubles_neurodeveloppement: { fr: "Neurodéveloppement", ar: "التطور العصبي" },
  troubles_emotionnels_comportementaux: { fr: "Émotions & comportement", ar: "المشاعر والسلوك" },
  troubles_langage_communication: { fr: "Langage & communication", ar: "اللغة والتواصل" },
  troubles_sensoriels: { fr: "Sensoriel", ar: "حسي" },
  troubles_sommeil_fatigue: { fr: "Sommeil & fatigue", ar: "النوم والتعب" },
  maladies_chroniques: { fr: "Maladies chroniques", ar: "أمراض مزمنة" },
  troubles_moteurs_physiques: { fr: "Motricité & physique", ar: "حركي وجسدي" },
};

export function getConditionCategories(): ConditionCategory[] {
  const raw = catalog.troubles_et_maladies as Record<
    string,
    { id: string; label: string; description: string }[]
  >;
  return Object.entries(raw).map(([key, items]) => ({
    key,
    labelFr: CATEGORY_LABELS[key]?.fr ?? key,
    labelAr: CATEGORY_LABELS[key]?.ar ?? key,
    items,
  }));
}

export function parseChildLearningProfileFromForm(formData: FormData): ChildLearningProfile {
  const raw = formData.get("child_learning_profile");
  if (typeof raw === "string" && raw.trim()) {
    try {
      return JSON.parse(raw) as ChildLearningProfile;
    } catch {
      /* fallback below */
    }
  }

  return {
    conditionIds: [],
    questionnaire: {},
    learningMode: "semi_guided",
    dailyScreenMinutes: 20,
    updatedAt: new Date().toISOString(),
  };
}

export function serializeChildLearningProfile(profile: ChildLearningProfile): string {
  return JSON.stringify({ ...profile, updatedAt: new Date().toISOString() });
}

export function parseChildLearningProfileJson(raw: string | null | undefined): ChildLearningProfile {
  if (raw?.trim()) {
    try {
      return JSON.parse(raw) as ChildLearningProfile;
    } catch {
      /* fallback */
    }
  }
  return {
    conditionIds: [],
    questionnaire: {},
    learningMode: "semi_guided",
    dailyScreenMinutes: 20,
    updatedAt: new Date().toISOString(),
  };
}

export function childAgeFromBirthDate(birthDate: string | null | undefined): string {
  if (!birthDate) return "8";
  const birth = new Date(birthDate);
  if (Number.isNaN(birth.getTime())) return "8";
  const age = new Date().getFullYear() - birth.getFullYear();
  return String(Math.max(3, Math.min(18, age)));
}

export function childAgeYears(birthDate: string | null | undefined): number {
  return parseInt(childAgeFromBirthDate(birthDate), 10);
}

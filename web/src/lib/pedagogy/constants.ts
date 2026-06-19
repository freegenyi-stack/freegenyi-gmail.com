export const PEDAGOGY_POST_TYPES = ["lesson", "exercise", "exam", "resource"] as const;
export type PedagogyPostType = (typeof PEDAGOGY_POST_TYPES)[number];

export const PEDAGOGY_LEVELS = ["1AP", "2AP", "3AP", "4AP", "5AP"] as const;

export const PEDAGOGY_SUBJECTS_FR = [
  "Arabe",
  "Français",
  "Mathématiques",
  "Sciences",
  "Anglais",
  "Histoire-Géo",
  "Autre",
] as const;

export const PEDAGOGY_SUBJECTS_AR = [
  "اللغة العربية",
  "اللغة الفرنسية",
  "الرياضيات",
  "العلوم",
  "اللغة الإنجليزية",
  "التاريخ والجغرافيا",
  "أخرى",
] as const;

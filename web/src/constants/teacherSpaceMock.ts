export const TEACHER_NEWS_TOPICS = [
  { id: "pedagogy", labelFr: "Pédagogie", labelAr: "بيداغوجيا" },
  { id: "ai", labelFr: "IA & classe", labelAr: "الذكاء الاصطناعي" },
  { id: "policy", labelFr: "Politiques éducation", labelAr: "سياسات التربية" },
  { id: "wellbeing", labelFr: "Bien-être enseignant", labelAr: "رفاهية الأستاذ" },
];

export const TEACHER_NEWS_ITEMS = [
  {
    id: "1",
    topic: "policy",
    titleFr: "Réforme des programmes : ce qui change en primaire",
    titleAr: "إصلاح البرامج: ما الذي يتغير في التعليم الابتدائي",
    excerptFr: "Synthèse des annonces du ministère et impacts concrets en classe.",
    excerptAr: "ملخص إعلانات الوزارة وتأثيراتها المباشرة في القسم.",
    date: "2026-06-05",
    unread: true,
  },
  {
    id: "2",
    topic: "ai",
    titleFr: "IA générative : 5 usages responsables en correction",
    titleAr: "الذكاء الاصطناعي: 5 استخدامات مسؤولة في التصحيح",
    excerptFr: "Gagner du temps sans déléguer votre jugement pédagogique.",
    excerptAr: "توفير الوقت دون التفريط في حكمك التربوي.",
    date: "2026-06-04",
    unread: true,
  },
  {
    id: "3",
    topic: "pedagogy",
    titleFr: "Différenciation : une séance type en 45 minutes",
    titleAr: "التمايز البيداغوجي: حصة نموذجية في 45 دقيقة",
    excerptFr: "Trame prête à adapter selon votre niveau.",
    excerptAr: "إطار جاهز للتكييف حسب مستواك.",
    date: "2026-06-02",
    unread: false,
  },
];

export const TEACHER_DIRECT_COURSES = [
  {
    id: "d1",
    titleFr: "Gérer une classe hétérogène en 45 minutes",
    titleAr: "إدارة قسم متنوع في 45 دقيقة",
    duration: "25 min",
    tag: "Classe",
  },
  {
    id: "d2",
    titleFr: "Évaluer sans stresser : quiz et rubriques",
    titleAr: "التقييم دون إجهاد: اختبارات قصيرة ومعايير",
    duration: "18 min",
    tag: "Évaluation",
  },
  {
    id: "d3",
    titleFr: "L'IA en classe : ce qu'on peut (et ne doit pas) faire",
    titleAr: "الذكاء الاصطناعي في القسم: ما يجوز وما لا يجوز",
    duration: "32 min",
    tag: "Numérique",
  },
  {
    id: "d4",
    titleFr: "Communication parents : messages clairs et pro",
    titleAr: "التواصل مع الأولياء: رسائل واضحة ومهنية",
    duration: "15 min",
    tag: "Relation",
  },
];

export const TEACHER_SERIES = [
  {
    id: "s1",
    titleFr: "Rentrée sereine (4 épisodes)",
    titleAr: "عودة هادئة للمدرسة (4 حلقات)",
    progress: 1,
    total: 4,
    nextEpisodeFr: "Épisode 2 — Règles et routines",
    nextEpisodeAr: "الحلقة 2 — القواعد والروتين",
  },
  {
    id: "s2",
    titleFr: "Devenir enseignant data-informed (6 épisodes)",
    titleAr: "أستاذ يقرأ بياناته (6 حلقات)",
    progress: 0,
    total: 6,
    nextEpisodeFr: "Épisode 1 — Collecter sans se noyer",
    nextEpisodeAr: "الحلقة 1 — جمع البيانات دون غرق",
  },
  {
    id: "s3",
    titleFr: "Classe inclusive (5 épisodes)",
    titleAr: "قسم شامل (5 حلقات)",
    progress: 3,
    total: 5,
    nextEpisodeFr: "Épisode 4 — Adapter une activité",
    nextEpisodeAr: "الحلقة 4 — تكييف نشاط",
  },
];

export const TEACHER_TEMPLATES = [
  { id: "t1", titleFr: "Leçon complète", titleAr: "درس كامل", icon: "book" as const },
  { id: "t2", titleFr: "Contrôle / examen", titleAr: "فرض / امتحان", icon: "clipboard" as const },
  { id: "t3", titleFr: "Fiche de révision", titleAr: "ورقة مراجعة", icon: "file" as const },
  { id: "t4", titleFr: "Sujet avec corrigé", titleAr: "موضوع مع التصحيح", icon: "check" as const },
  { id: "t5", titleFr: "Fiche élève / parent", titleAr: "ورقة تلميذ / ولي", icon: "users" as const },
  { id: "t6", titleFr: "Planning hebdomadaire", titleAr: "خطة أسبوعية", icon: "calendar" as const },
];

export const TEACHER_RECENT_DOCS = [
  { id: "r1", titleFr: "Fractions — 4ᵉ année", titleAr: "الكسور — السنة الرابعة", updated: "Hier", type: "Leçon" },
  { id: "r2", titleFr: "Contrôle n°2 — Grammaire", titleAr: "الفرض 2 — القواعد", updated: "Lun.", type: "Examen" },
  { id: "r3", titleFr: "Révision trimestre 2", titleAr: "مراجعة الفصل الثاني", updated: "12 mai", type: "Fiche" },
];

export const TEACHER_BOOKS = [
  {
    id: "b1",
    titleFr: "أساسيات التربية الحديثة",
    titleAr: "أساسيات التربية الحديثة",
    lang: "ar",
    themeFr: "Pédagogie",
    themeAr: "بيداغوجيا",
    pages: 128,
  },
  {
    id: "b2",
    titleFr: "Guide de la classe inclusive",
    titleAr: "دليل القسم الشامل",
    lang: "ar",
    themeFr: "Inclusion",
    themeAr: "الإدماج",
    pages: 96,
  },
  {
    id: "b3",
    titleFr: "Méthodes actives en primaire",
    titleAr: "Méthodes actives en primaire",
    lang: "fr",
    themeFr: "Pratiques",
    themeAr: "ممارسات",
    pages: 210,
  },
  {
    id: "b4",
    titleFr: "تقويم التعلمات",
    titleAr: "تقويم التعلمات",
    lang: "ar",
    themeFr: "Évaluation",
    themeAr: "تقويم",
    pages: 84,
  },
];

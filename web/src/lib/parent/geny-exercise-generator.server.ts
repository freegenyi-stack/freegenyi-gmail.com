import type { PrintableExerciseBlock } from "@/lib/parent/printable-exercises";
import type { PrintableWeakness } from "@/lib/parent/printable-types";

export type GenyExerciseSet = {
  id: string;
  subjectFr: string;
  subjectAr: string;
  titleFr: string;
  titleAr: string;
  instructionsFr: string;
  instructionsAr: string;
  questions: { fr: string; ar: string }[];
  weaknessFocus?: string;
};

const MATH_CE1: GenyExerciseSet = {
  id: "math-addition-ce1",
  subjectFr: "Mathématiques",
  subjectAr: "رياضيات",
  titleFr: "Additions simples — CP/1AP",
  titleAr: "جمع بسيط — السنة الأولى",
  instructionsFr: "Calcule sans calculatrice. Écris le résultat.",
  instructionsAr: "احسب بدون آلة حاسبة. اكتب النتيجة.",
  questions: [
    { fr: "3 + 4 =", ar: "3 + 4 =" },
    { fr: "5 + 2 =", ar: "5 + 2 =" },
    { fr: "7 + 8 =", ar: "7 + 8 =" },
    { fr: "12 + 6 =", ar: "12 + 6 =" },
  ],
};

const MATH_CE2: GenyExerciseSet = {
  id: "math-addition-ce2",
  subjectFr: "Mathématiques",
  subjectAr: "رياضيات",
  titleFr: "Additions avec retenue — CE2/2AP",
  titleAr: "جمع مع حمل — السنة الثانية",
  instructionsFr: "Calcule sans calculatrice. Pose tes opérations si besoin.",
  instructionsAr: "احسب بدون آلة حاسبة. ضع العمليات على ورقة إن لزم.",
  questions: [
    { fr: "47 + 38 =", ar: "47 + 38 =" },
    { fr: "156 + 89 =", ar: "156 + 89 =" },
    { fr: "305 + 127 =", ar: "305 + 127 =" },
    {
      fr: "Un cahier coûte 125 DA et une gomme 35 DA. Combien en tout ?",
      ar: "دفتر بـ 125 دج وممحاة بـ 35 دج. ما المجموع؟",
    },
  ],
};

const MATH_CM1: GenyExerciseSet = {
  id: "math-multiply-cm1",
  subjectFr: "Mathématiques",
  subjectAr: "رياضيات",
  titleFr: "Multiplications — CM1/3AP",
  titleAr: "ضرب — السنة الثالثة",
  instructionsFr: "Utilise les tables de multiplication.",
  instructionsAr: "استخدم جدول الضرب.",
  questions: [
    { fr: "6 × 7 =", ar: "6 × 7 =" },
    { fr: "8 × 9 =", ar: "8 × 9 =" },
    { fr: "12 × 4 =", ar: "12 × 4 =" },
    { fr: "Un paquet de 6 stylos coûte 45 DA. Prix de 3 paquets ?", ar: "علبة 6 أقلام بـ 45 دج. ثمن 3 علب؟" },
  ],
};

const FRENCH_READING: GenyExerciseSet = {
  id: "french-reading-ce2",
  subjectFr: "Français",
  subjectAr: "فرنسية",
  titleFr: "Lecture & compréhension",
  titleAr: "قراءة وفهم",
  instructionsFr: "Lis la phrase et réponds par vrai ou faux, ou complète.",
  instructionsAr: "اقرأ الجملة وأجب بصح أو خطأ، أو أكمل.",
  questions: [
    { fr: "Le chat dort sur le tapis. Vrai ou faux ?", ar: "القط ينام على السجادة. صح أم خطأ؟" },
    { fr: "Complète : « La maison est ___ » (grand/grande)", ar: "أكمل: « La maison est ___ »" },
    { fr: "Trouve le synonyme de « content » :", ar: "مرادف « content »:" },
    { fr: "Écris une phrase avec le mot « école ».", ar: "اكتب جملة بكلمة « école »." },
  ],
};

const ARABIC_WRITING: GenyExerciseSet = {
  id: "arabic-writing",
  subjectFr: "Arabe",
  subjectAr: "عربية",
  titleFr: "Arabe — écriture et vocabulaire",
  titleAr: "عربية — كتابة ومفردات",
  instructionsFr: "Écris en arabe ou traduis.",
  instructionsAr: "اكتب بالعربية أو ترجم.",
  questions: [
    { fr: "Écris en arabe : « livre »", ar: "اكتب بالعربية: « livre »" },
    { fr: "Écris en arabe : « école »", ar: "اكتب بالعربية: « école »" },
    { fr: "Complète : « أنا ___ في المدرسة » (أذهب)", ar: "أكمل: « أنا ___ في المدرسة »" },
    { fr: "Traduis : « Bonjour, comment vas-tu ? »", ar: "ترجم: « Bonjour, comment vas-tu ? »" },
  ],
};

const QUIZ_REVIEW: GenyExerciseSet = {
  id: "quiz-review",
  subjectFr: "Révision générale",
  subjectAr: "مراجعة عامة",
  titleFr: "Révision quiz & lecture",
  titleAr: "مراجعة اختبار وقراءة",
  instructionsFr: "Repasse les notions vues en classe cette semaine.",
  instructionsAr: "راجع ما درسته في الصف هذا الأسبوع.",
  questions: [
    { fr: "Note 3 choses apprises cette semaine :", ar: "اكتب 3 أشياء تعلمتها هذا الأسبوع:" },
    { fr: "Quelle matière veux-tu renforcer ?", ar: "أي مادة تريد تقويتها؟" },
    { fr: "Relis 5 pages de ton livre en cours.", ar: "اقرأ 5 صفحات من كتابك الحالي." },
    { fr: "Explique à un parent ce que tu as compris.", ar: "اشرح لوالديك ما فهمته." },
  ],
};

const BANK: GenyExerciseSet[] = [MATH_CE1, MATH_CE2, MATH_CM1, FRENCH_READING, ARABIC_WRITING, QUIZ_REVIEW];

function levelFromEducation(educationLevel: string | null): "ce1" | "ce2" | "cm1" | "default" {
  const l = (educationLevel || "").toUpperCase();
  if (l.includes("1AP") || l.includes("CP") || l.includes("1")) return "ce1";
  if (l.includes("2AP") || l.includes("CE2") || l.includes("2")) return "ce2";
  if (l.includes("3AP") || l.includes("CM1") || l.includes("3")) return "cm1";
  return "default";
}

function subjectFromWeakness(w: PrintableWeakness): string {
  const s = w.subject.toLowerCase();
  if (s.includes("math") || s.includes("رياض")) return "math";
  if (s.includes("fr") || s.includes("lecture") || s.includes("lect")) return "french";
  if (s.includes("ar") || s.includes("عرب")) return "arabic";
  if (s.includes("quiz")) return "quiz";
  return "general";
}

export function generateGenyExerciseSet(input: {
  weaknesses: PrintableWeakness[];
  educationLevel: string | null;
  count?: number;
}): GenyExerciseSet[] {
  const level = levelFromEducation(input.educationLevel);
  const count = input.count ?? 2;
  const picked: GenyExerciseSet[] = [];
  const seen = new Set<string>();

  const push = (set: GenyExerciseSet) => {
    if (seen.has(set.id)) return;
    seen.add(set.id);
    picked.push({ ...set, weaknessFocus: input.weaknesses[0]?.subject });
  };

  for (const w of input.weaknesses) {
    const subj = subjectFromWeakness(w);
    if (subj === "math") push(level === "ce1" ? MATH_CE1 : level === "cm1" ? MATH_CM1 : MATH_CE2);
    else if (subj === "french") push(FRENCH_READING);
    else if (subj === "arabic") push(ARABIC_WRITING);
    else if (subj === "quiz") push(QUIZ_REVIEW);
  }

  if (picked.length === 0) {
    push(level === "ce1" ? MATH_CE1 : level === "cm1" ? MATH_CM1 : MATH_CE2);
    push(FRENCH_READING);
  }

  if (picked.length < count) {
    for (const b of BANK) {
      if (picked.length >= count) break;
      push(b);
    }
  }

  return picked.slice(0, count);
}

export function toPrintableBlock(set: GenyExerciseSet): PrintableExerciseBlock {
  return {
    id: set.id,
    subjectFr: set.subjectFr,
    subjectAr: set.subjectAr,
    titleFr: set.titleFr,
    titleAr: set.titleAr,
    instructionsFr: set.instructionsFr,
    instructionsAr: set.instructionsAr,
    questions: set.questions,
  };
}

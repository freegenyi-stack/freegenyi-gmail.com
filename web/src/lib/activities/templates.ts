import type { ActivityType } from "@/types/activity";

export type ActivityTemplate = {
  id: string;
  activityType: ActivityType;
  titleFr: string;
  titleAr: string;
  subject?: string;
  level?: string;
};

export const ACTIVITY_TEMPLATES: ActivityTemplate[] = [
  { id: "qcm-revision", activityType: "QCM", titleFr: "QCM de révision", titleAr: "اختبار مراجعة", subject: "Mathématiques", level: "3AP" },
  { id: "vf-grammaire", activityType: "VRAI_FAUX", titleFr: "Vrai ou Faux — Grammaire", titleAr: "صحيح أو خطأ — قواعد", subject: "Français", level: "4AP" },
  { id: "flash-vocab", activityType: "FLASHCARDS", titleFr: "Flashcards vocabulaire", titleAr: "بطاقات مفردات", subject: "Français" },
  { id: "memory-calc", activityType: "MEMORY_GAME", titleFr: "Memory calcul mental", titleAr: "لعبة الذاكرة — حساب", subject: "Mathématiques", level: "2AP" },
  { id: "seq-histoire", activityType: "SEQUENCING", titleFr: "Ordre chronologique", titleAr: "ترتيب زمني", subject: "Histoire", level: "5AP" },
  { id: "calc-add", activityType: "CALCUL_INTERACTIF", titleFr: "Additions interactives", titleAr: "جمع تفاعلي", subject: "Mathématiques", level: "1AP" },
];

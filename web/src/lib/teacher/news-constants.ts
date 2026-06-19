/** Topics fil actualités + mapping vers centres d'intérêt onboarding */
export const TEACHER_NEWS_TOPICS = [
  { id: "pedagogy", labelFr: "Pédagogie", labelAr: "بيداغوجيا" },
  { id: "ai", labelFr: "IA & classe", labelAr: "الذكاء الاصطناعي" },
  { id: "policy", labelFr: "Politiques éducation", labelAr: "سياسات التربية" },
  { id: "wellbeing", labelFr: "Bien-être enseignant", labelAr: "رفاهية الأستاذ" },
] as const;

export type TeacherNewsTopicId = (typeof TEACHER_NEWS_TOPICS)[number]["id"];

export const TOPIC_INTEREST_TAGS: Record<TeacherNewsTopicId, string[]> = {
  pedagogy: ["education"],
  ai: ["technology", "education"],
  policy: ["news", "education"],
  wellbeing: ["health", "education"],
};

export function parseInterestTags(raw: string | null): string[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    return Array.isArray(parsed) ? parsed.filter((x): x is string => typeof x === "string") : [];
  } catch {
    return [];
  }
}

export function articleInterestTags(topic: string, raw: string | null): string[] {
  const fromDb = parseInterestTags(raw);
  if (fromDb.length) return fromDb;
  return TOPIC_INTEREST_TAGS[topic as TeacherNewsTopicId] || ["education"];
}

export function matchesUserInterests(articleTags: string[], userInterests: string[]): boolean {
  if (!userInterests.length) return true;
  return articleTags.some((t) => userInterests.includes(t));
}

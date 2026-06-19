import { parseMetadata } from "@/lib/teacher/profile.server";
import { extractTeacherProfile } from "@/lib/teacher/profile.server";
import { TEACHER_NEWS_TOPICS } from "@/lib/teacher/news-constants";
import type { NotificationInterestId } from "@/lib/onboarding/interest-topics";

export type NewsPreferences = {
  /** Sous-thèmes éditoriaux (pedagogy, ai, policy, wellbeing) — vide = tous */
  enabledTopics: string[];
  /** Alertes push nouvel article */
  pushBreaking: boolean;
  /** Digest hebdomadaire */
  pushDigest: boolean;
};

const DEFAULT: NewsPreferences = {
  enabledTopics: [],
  pushBreaking: true,
  pushDigest: false,
};

const VALID_TOPIC_IDS = new Set(TEACHER_NEWS_TOPICS.map((t) => t.id));

export function parseNewsPreferences(metadataRaw: string | null): NewsPreferences {
  const meta = parseMetadata(metadataRaw);
  const raw = meta.newsPreferences as Partial<NewsPreferences> | undefined;
  if (!raw || typeof raw !== "object") return { ...DEFAULT };

  const enabledTopics = Array.isArray(raw.enabledTopics)
    ? raw.enabledTopics.filter(
        (t): t is (typeof TEACHER_NEWS_TOPICS)[number]["id"] =>
          typeof t === "string" && VALID_TOPIC_IDS.has(t as (typeof TEACHER_NEWS_TOPICS)[number]["id"])
      )
    : [];

  return {
    enabledTopics,
    pushBreaking: raw.pushBreaking !== false,
    pushDigest: raw.pushDigest === true,
  };
}

export function getUserNotificationInterests(metadataRaw: string | null): NotificationInterestId[] {
  const meta = parseMetadata(metadataRaw);
  const tp = extractTeacherProfile(meta);
  const fromTeacher = tp.notificationInterests;
  if (fromTeacher?.length) return fromTeacher as NotificationInterestId[];
  const fromMeta = meta.notificationInterests;
  if (Array.isArray(fromMeta)) {
    return fromMeta.filter((x): x is NotificationInterestId => typeof x === "string");
  }
  return [];
}

export function mergeNewsPreferencesIntoMetadata(
  prev: Record<string, unknown>,
  prefs: NewsPreferences
): Record<string, unknown> {
  return { ...prev, newsPreferences: prefs };
}

export function userNewsPushAllowed(
  metadataRaw: string | null,
  role: string | null | undefined,
  category: "news" | "digest"
): boolean {
  const prefs = parseNewsPreferences(metadataRaw);
  if (role === "enseignant") {
    const tp = extractTeacherProfile(parseMetadata(metadataRaw));
    const push = { news: true, digest: false, ...tp.pushPrefs };
    if (category === "news") return push.news !== false && prefs.pushBreaking !== false;
    return push.digest === true || prefs.pushDigest === true;
  }
  if (role === "parent" || role === "coparent") {
    if (category === "news") return prefs.pushBreaking !== false;
    return prefs.pushDigest === true;
  }
  return false;
}

export function articleMatchesTopicFilter(topic: string, prefs: NewsPreferences): boolean {
  if (!prefs.enabledTopics.length) return true;
  return prefs.enabledTopics.includes(topic);
}

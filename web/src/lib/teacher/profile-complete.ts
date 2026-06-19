import { extractTeacherProfile, parseMetadata } from "./profile.server";

export function isTeacherProfileComplete(
  metadata: string | null,
  user: { image?: string | null; avatarConfig?: string | null }
): boolean {
  const tp = extractTeacherProfile(parseMetadata(metadata));
  const hasAvatar = !!(user.image?.trim() || user.avatarConfig?.trim());
  const hasBio = !!(tp.bio?.trim());
  const hasSubjects = (tp.subjects?.length ?? 0) > 0;
  const hasLevels = (tp.levels?.length ?? 0) > 0;
  return hasAvatar && hasBio && hasSubjects && hasLevels;
}

export type TeacherPushCategory = "messages" | "mur" | "digest" | "news";

const DEFAULT_PUSH = { mur: true, messages: true, digest: false, news: true };

export function teacherPushAllowed(
  metadata: string | null,
  role: string | null | undefined,
  category: TeacherPushCategory
): boolean {
  if (role !== "enseignant") return true;
  const tp = extractTeacherProfile(parseMetadata(metadata));
  const prefs = { ...DEFAULT_PUSH, ...tp.pushPrefs };
  return prefs[category] ?? true;
}

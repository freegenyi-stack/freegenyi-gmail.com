import type { TeacherProfileData } from "./profile.types";

export function parseTeacherSubjectsLevelsFromForm(formData: FormData): {
  subjects: string[];
  levels: string[];
} {
  const subjects = formData.getAll("teacher_subjects").map(String).filter(Boolean);
  const levels = formData.getAll("teacher_levels").map(String).filter(Boolean);
  const legacySubject = (formData.get("teacher_subject") as string)?.trim();
  const legacyLevel = (formData.get("teacher_level") as string)?.trim();

  return {
    subjects: subjects.length ? subjects : legacySubject ? [legacySubject] : [],
    levels: levels.length ? levels : legacyLevel ? [legacyLevel] : [],
  };
}

export function appendTeacherSubjectsLevels(fd: FormData, subjects: string[], levels: string[]) {
  subjects.forEach((s) => fd.append("teacher_subjects", s));
  levels.forEach((l) => fd.append("teacher_levels", l));
}

export function buildTeacherMetadataFields(
  prev: Record<string, unknown>,
  opts: {
    teacherSchoolId?: string;
    teacherSchoolName?: string;
    subjects: string[];
    levels: string[];
    bio?: string;
    notificationInterests?: string[];
  }
): Record<string, unknown> {
  const prevProfile = (prev.teacherProfile as TeacherProfileData) || {};
  const teacherProfile: TeacherProfileData = {
    ...prevProfile,
    bio: opts.bio ?? (prevProfile.bio as string) ?? (prev.teacherBio as string) ?? "",
    subjects: opts.subjects,
    levels: opts.levels,
    notificationInterests:
      opts.notificationInterests ??
      prevProfile.notificationInterests ??
      (Array.isArray(prev.notificationInterests) ? (prev.notificationInterests as string[]) : undefined),
    contactEnabled: prevProfile.contactEnabled ?? false,
    contactAllowParents: prevProfile.contactAllowParents !== false,
    contactAllowTeachers: prevProfile.contactAllowTeachers ?? false,
    pushPrefs: prevProfile.pushPrefs ?? { mur: true, messages: true, digest: false, news: true },
    availability: prevProfile.availability ?? { enabled: false, acceptsTutoring: false, slots: [] },
    avatarMode: prevProfile.avatarMode ?? "catalog",
  };

  return {
    ...prev,
    teacherSchoolId: opts.teacherSchoolId ?? prev.teacherSchoolId,
    teacherSchoolName: opts.teacherSchoolName ?? prev.teacherSchoolName,
    teacherSubject: opts.subjects[0] || prev.teacherSubject,
    teacherLevel: opts.levels[0] || prev.teacherLevel,
    teacherBio: teacherProfile.bio,
    notificationInterests: teacherProfile.notificationInterests,
    teacherProfile,
  };
}

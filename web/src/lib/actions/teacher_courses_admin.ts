"use server";

import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { deleteTeacherCourse, upsertTeacherCourse } from "@/lib/teacher/courses-admin.server";

function parseCourseForm(formData: FormData) {
  const kind = String(formData.get("kind") || "direct").trim();
  const slug = String(formData.get("slug") || "").trim();
  const titleFr = String(formData.get("title_fr") || "").trim();
  const titleAr = String(formData.get("title_ar") || "").trim();
  if (!slug || !titleFr || !titleAr) return { error: "Slug et titres obligatoires." as const };

  return {
    kind: kind === "series" ? "series" : "direct",
    slug,
    titleFr,
    titleAr,
    durationLabel: String(formData.get("duration_label") || "").trim() || null,
    durationMinutes: parseInt(String(formData.get("duration_minutes") || ""), 10) || null,
    difficultyLevel: parseInt(String(formData.get("difficulty_level") || "1"), 10) || 1,
    tagFr: String(formData.get("tag_fr") || "").trim() || null,
    tagAr: String(formData.get("tag_ar") || "").trim() || null,
    totalEpisodes: parseInt(String(formData.get("total_episodes") || "1"), 10) || 1,
    externalUrl: String(formData.get("external_url") || "").trim() || null,
    sortOrder: parseInt(String(formData.get("sort_order") || "0"), 10) || 0,
    isPublished: formData.get("is_published") === "on",
  };
}

export async function createTeacherCourseAction(formData: FormData) {
  await requireAdminSession();
  const parsed = parseCourseForm(formData);
  if ("error" in parsed) return parsed;
  await upsertTeacherCourse(parsed);
  revalidatePath("/dashboard/admin/teacher-courses");
  revalidatePath("/dashboard/enseignant/formation");
  return { success: true as const };
}

export async function updateTeacherCourseAction(id: number, formData: FormData) {
  await requireAdminSession();
  const parsed = parseCourseForm(formData);
  if ("error" in parsed) return parsed;
  await upsertTeacherCourse({ ...parsed, id });
  revalidatePath("/dashboard/admin/teacher-courses");
  revalidatePath("/dashboard/enseignant/formation");
  return { success: true as const };
}

export async function deleteTeacherCourseAction(id: number) {
  await requireAdminSession();
  await deleteTeacherCourse(id);
  revalidatePath("/dashboard/admin/teacher-courses");
  revalidatePath("/dashboard/enseignant/formation");
  return { success: true as const };
}

export async function seedTeacherCoursesAction() {
  await requireAdminSession();
  const { execSync } = require("child_process");
  const path = require("path");
  execSync("node scripts/seed-platform-content.js", { cwd: path.join(process.cwd()), stdio: "inherit" });
  revalidatePath("/dashboard/admin/teacher-courses");
  revalidatePath("/dashboard/enseignant/formation");
  return { success: true as const };
}

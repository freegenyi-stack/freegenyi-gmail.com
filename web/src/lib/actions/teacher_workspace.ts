"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { users, teacherCourses, teacherCourseProgress } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import {
  createTeacherDocument,
  upsertCourseProgress,
} from "@/lib/teacher/workspace.server";
import { makeCertificateCode } from "@/lib/teacher/course-certificate.server";
import { notifyCourseCompleted, notifyCourseEpisodeReady } from "@/lib/teacher/course-notify.server";

export async function startTeacherCourseAction(courseId: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthorized" as const };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.role !== "enseignant") return { error: "forbidden" as const };

  const [course] = await db
    .select({ slug: teacherCourses.slug, totalEpisodes: teacherCourses.totalEpisodes, progressEpisode: teacherCourseProgress.episode })
    .from(teacherCourses)
    .leftJoin(
      teacherCourseProgress,
      and(eq(teacherCourseProgress.courseId, teacherCourses.id), eq(teacherCourseProgress.userId, userId))
    )
    .where(eq(teacherCourses.id, courseId))
    .limit(1);

  if (!course) return { error: "not_found" as const };

  const episode = Math.max(1, course.progressEpisode ?? 1);
  await upsertCourseProgress(userId, courseId, episode, course.totalEpisodes);
  revalidatePath("/dashboard/enseignant/formation");
  return { success: true as const, slug: course.slug };
}

export async function completeTeacherCourseEpisodeAction(courseId: number, episode: number, locale = "fr") {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthorized" as const };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user || user.role !== "enseignant") return { error: "forbidden" as const };

  const [course] = await db
    .select()
    .from(teacherCourses)
    .where(eq(teacherCourses.id, courseId))
    .limit(1);

  if (!course) return { error: "not_found" as const };

  const total = Math.max(1, course.totalEpisodes);
  const completed = episode >= total;
  const nextEpisode = Math.min(total, episode + 1);
  const certificateCode = completed ? makeCertificateCode(userId, courseId) : undefined;

  await upsertCourseProgress(userId, courseId, completed ? total : nextEpisode, total, {
    completed,
    certificateCode,
  });

  if (completed && certificateCode) {
    await notifyCourseCompleted({
      userId,
      courseSlug: course.slug,
      courseTitleFr: course.titleFr,
      courseTitleAr: course.titleAr,
      certificateCode,
      locale,
    });
  } else if (course.kind === "series" && nextEpisode <= total) {
    await notifyCourseEpisodeReady({
      userId,
      courseSlug: course.slug,
      courseTitleFr: course.titleFr,
      courseTitleAr: course.titleAr,
      nextEpisode,
      totalEpisodes: total,
      locale,
    });
  }

  revalidatePath("/dashboard/enseignant/formation");
  revalidatePath(`/dashboard/enseignant/formation/${course.slug}`);

  return {
    success: true as const,
    completed,
    nextEpisode: completed ? total : nextEpisode,
    percent: completed ? 100 : Math.round((nextEpisode / total) * 100),
    certificateCode: certificateCode ?? null,
  };
}

export async function getTeacherCourseCertificateMeta(courseId: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "unauthorized" as const };

  const userId = parseInt(session.user.id, 10);
  const [row] = await db
    .select({
      certificateCode: teacherCourseProgress.certificateCode,
      completedAt: teacherCourseProgress.completedAt,
      titleFr: teacherCourses.titleFr,
      titleAr: teacherCourses.titleAr,
      fullName: users.fullName,
      email: users.email,
    })
    .from(teacherCourseProgress)
    .innerJoin(teacherCourses, eq(teacherCourses.id, teacherCourseProgress.courseId))
    .innerJoin(users, eq(users.id, teacherCourseProgress.userId))
    .where(and(eq(teacherCourseProgress.userId, userId), eq(teacherCourseProgress.courseId, courseId)))
    .limit(1);

  if (!row?.certificateCode || !row.completedAt) return { error: "not_found" as const };

  return {
    certificateCode: row.certificateCode,
    completedAt: row.completedAt,
    titleFr: row.titleFr,
    titleAr: row.titleAr,
    teacherName: row.fullName?.trim() || row.email.split("@")[0],
  };
}

export async function createTeacherDocumentAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.role !== "enseignant") return { error: "Réservé aux enseignants." };

  const templateId = String(formData.get("templateId") || "t1");
  const title = String(formData.get("title") || "").trim();
  if (!title) return { error: "Titre obligatoire." };

  const row = await createTeacherDocument({ userId, templateId, title });
  revalidatePath("/dashboard/enseignant/atelier");
  return { success: true, id: row.id };
}

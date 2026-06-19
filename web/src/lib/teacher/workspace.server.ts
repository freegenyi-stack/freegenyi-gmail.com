import { db } from "@/db";
import {
  teacherCourseProgress,
  teacherCourses,
  teacherDocuments,
} from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";

export type TeacherCourseDto = {
  id: number;
  kind: string;
  slug: string;
  titleFr: string;
  titleAr: string;
  durationLabel: string | null;
  durationMinutes: number | null;
  difficultyLevel: number;
  tagFr: string | null;
  tagAr: string | null;
  totalEpisodes: number;
  externalUrl: string | null;
  progressEpisode: number;
  progressPercent: number;
  completedAt: Date | null;
  certificateCode: string | null;
};

function mapCourseDto(
  c: typeof teacherCourses.$inferSelect,
  p: typeof teacherCourseProgress.$inferSelect | undefined
): TeacherCourseDto {
  return {
    id: c.id,
    kind: c.kind,
    slug: c.slug,
    titleFr: c.titleFr,
    titleAr: c.titleAr,
    durationLabel: c.durationLabel,
    durationMinutes: c.durationMinutes,
    difficultyLevel: c.difficultyLevel ?? 1,
    tagFr: c.tagFr,
    tagAr: c.tagAr,
    totalEpisodes: c.totalEpisodes,
    externalUrl: c.externalUrl,
    progressEpisode: p?.episode ?? 0,
    progressPercent: p?.percent ?? 0,
    completedAt: p?.completedAt ?? null,
    certificateCode: p?.certificateCode ?? null,
  };
}

export async function listTeacherCoursesWithProgress(userId: number): Promise<TeacherCourseDto[]> {
  const courses = await db
    .select()
    .from(teacherCourses)
    .where(eq(teacherCourses.isPublished, true))
    .orderBy(teacherCourses.sortOrder);

  const progressRows = await db
    .select()
    .from(teacherCourseProgress)
    .where(eq(teacherCourseProgress.userId, userId));

  const progressMap = new Map(progressRows.map((p) => [p.courseId, p]));

  return courses.map((c) => mapCourseDto(c, progressMap.get(c.id)));
}

export type TeacherDocumentDto = {
  id: number;
  templateId: string;
  title: string;
  updatedAt: Date;
};

export async function listTeacherDocuments(userId: number, limit = 20): Promise<TeacherDocumentDto[]> {
  const rows = await db
    .select({
      id: teacherDocuments.id,
      templateId: teacherDocuments.templateId,
      title: teacherDocuments.title,
      updatedAt: teacherDocuments.updatedAt,
    })
    .from(teacherDocuments)
    .where(eq(teacherDocuments.userId, userId))
    .orderBy(desc(teacherDocuments.updatedAt))
    .limit(limit);

  return rows;
}

export async function upsertCourseProgress(
  userId: number,
  courseId: number,
  episode: number,
  totalEpisodes = 1,
  opts?: { completed?: boolean; certificateCode?: string }
) {
  const existing = await db
    .select({
      id: teacherCourseProgress.id,
      certificateCode: teacherCourseProgress.certificateCode,
      completedAt: teacherCourseProgress.completedAt,
    })
    .from(teacherCourseProgress)
    .where(and(eq(teacherCourseProgress.userId, userId), eq(teacherCourseProgress.courseId, courseId)))
    .limit(1);

  const total = Math.max(1, totalEpisodes);
  const percent = opts?.completed ? 100 : Math.min(100, Math.round((episode / total) * 100));
  const completedAt = opts?.completed ? new Date() : undefined;
  const certificateCode =
    opts?.completed && opts.certificateCode
      ? opts.certificateCode
      : opts?.completed
        ? existing[0]?.certificateCode ?? opts.certificateCode
        : undefined;

  if (existing.length > 0) {
    await db
      .update(teacherCourseProgress)
      .set({
        episode,
        percent,
        updatedAt: new Date(),
        ...(completedAt ? { completedAt } : {}),
        ...(certificateCode ? { certificateCode } : {}),
      })
      .where(eq(teacherCourseProgress.id, existing[0].id));
  } else {
    await db.insert(teacherCourseProgress).values({
      userId,
      courseId,
      episode,
      percent,
      completedAt: completedAt ?? null,
      certificateCode: certificateCode ?? null,
    });
  }
}

export async function getTeacherCourseBySlug(slug: string, userId: number) {
  const [course] = await db
    .select()
    .from(teacherCourses)
    .where(and(eq(teacherCourses.slug, slug), eq(teacherCourses.isPublished, true)))
    .limit(1);

  if (!course) return null;

  const [progress] = await db
    .select()
    .from(teacherCourseProgress)
    .where(and(eq(teacherCourseProgress.userId, userId), eq(teacherCourseProgress.courseId, course.id)))
    .limit(1);

  return mapCourseDto(course, progress);
}

export async function createTeacherDocument(input: {
  userId: number;
  templateId: string;
  title: string;
  contentJson?: string;
}) {
  const [row] = await db
    .insert(teacherDocuments)
    .values({
      userId: input.userId,
      templateId: input.templateId,
      title: input.title,
      contentJson:
        input.contentJson ??
        JSON.stringify({
          blocks: [
            { type: "heading", text: input.title },
            {
              type: "paragraph",
              text: "Document créé dans l'atelier FreeGeny. Modifiez ce contenu depuis votre espace enseignant.",
            },
          ],
        }),
      updatedAt: new Date(),
    })
    .returning({ id: teacherDocuments.id });

  return row;
}

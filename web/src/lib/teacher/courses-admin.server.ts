import { db } from "@/db";
import { teacherCourses } from "@/db/schema";
import { asc, eq } from "drizzle-orm";

export type TeacherCourseAdminDto = {
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
  sortOrder: number;
  isPublished: boolean;
};

export async function listAllTeacherCoursesAdmin(): Promise<TeacherCourseAdminDto[]> {
  const rows = await db.select().from(teacherCourses).orderBy(asc(teacherCourses.sortOrder), asc(teacherCourses.id));
  return rows.map((row) => ({
    id: row.id,
    kind: row.kind,
    slug: row.slug,
    titleFr: row.titleFr,
    titleAr: row.titleAr,
    durationLabel: row.durationLabel,
    durationMinutes: row.durationMinutes,
    difficultyLevel: row.difficultyLevel ?? 1,
    tagFr: row.tagFr,
    tagAr: row.tagAr,
    totalEpisodes: row.totalEpisodes,
    externalUrl: row.externalUrl,
    sortOrder: row.sortOrder,
    isPublished: row.isPublished,
  }));
}

export async function upsertTeacherCourse(input: {
  id?: number;
  kind: string;
  slug: string;
  titleFr: string;
  titleAr: string;
  durationLabel?: string | null;
  durationMinutes?: number | null;
  difficultyLevel: number;
  tagFr?: string | null;
  tagAr?: string | null;
  totalEpisodes?: number;
  externalUrl?: string | null;
  sortOrder?: number;
  isPublished?: boolean;
}) {
  const values = {
    kind: input.kind,
    slug: input.slug,
    titleFr: input.titleFr,
    titleAr: input.titleAr,
    durationLabel: input.durationLabel ?? null,
    durationMinutes: input.durationMinutes ?? null,
    difficultyLevel: Math.min(3, Math.max(1, input.difficultyLevel)),
    tagFr: input.tagFr ?? null,
    tagAr: input.tagAr ?? null,
    totalEpisodes: input.totalEpisodes ?? 1,
    externalUrl: input.externalUrl ?? null,
    sortOrder: input.sortOrder ?? 0,
    isPublished: input.isPublished ?? true,
  };

  if (input.id) {
    await db.update(teacherCourses).set(values).where(eq(teacherCourses.id, input.id));
    return input.id;
  }

  const [row] = await db.insert(teacherCourses).values(values).returning({ id: teacherCourses.id });
  return row.id;
}

export async function deleteTeacherCourse(id: number) {
  await db.delete(teacherCourses).where(eq(teacherCourses.id, id));
}

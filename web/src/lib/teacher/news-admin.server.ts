import { db } from "@/db";
import { teacherNewsArticles } from "@/db/schema";
import { desc } from "drizzle-orm";

export type TeacherNewsArticleAdminDto = {
  id: number;
  topic: string;
  interestTags: string | null;
  titleFr: string;
  titleAr: string;
  excerptFr: string;
  excerptAr: string;
  bodyFr: string | null;
  bodyAr: string | null;
  publishedAt: string;
  isPublished: boolean;
  createdAt: string;
};

export async function listAllTeacherNewsArticles(): Promise<TeacherNewsArticleAdminDto[]> {
  const rows = await db
    .select()
    .from(teacherNewsArticles)
    .orderBy(desc(teacherNewsArticles.publishedAt));

  return rows.map((row) => ({
    id: row.id,
    topic: row.topic,
    interestTags: row.interestTags,
    titleFr: row.titleFr,
    titleAr: row.titleAr,
    excerptFr: row.excerptFr,
    excerptAr: row.excerptAr,
    bodyFr: row.bodyFr,
    bodyAr: row.bodyAr,
    publishedAt: row.publishedAt?.toISOString().slice(0, 16) ?? "",
    isPublished: row.isPublished,
    createdAt: row.createdAt?.toISOString() ?? "",
  }));
}

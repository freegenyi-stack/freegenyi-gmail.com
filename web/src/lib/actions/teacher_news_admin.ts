"use server";

import { db } from "@/db";
import { teacherNewsArticles } from "@/db/schema";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { notifyUsersOnNewsArticle } from "@/lib/news/notify.server";
import { TEACHER_NEWS_TOPICS } from "@/lib/teacher/news-constants";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

const VALID_TOPICS = new Set(TEACHER_NEWS_TOPICS.map((t) => t.id));

function parseArticlePayload(formData: FormData) {
  const topic = (formData.get("topic") as string)?.trim();
  const titleFr = (formData.get("title_fr") as string)?.trim();
  const titleAr = (formData.get("title_ar") as string)?.trim();
  const excerptFr = (formData.get("excerpt_fr") as string)?.trim();
  const excerptAr = (formData.get("excerpt_ar") as string)?.trim();
  const bodyFr = (formData.get("body_fr") as string)?.trim() || null;
  const bodyAr = (formData.get("body_ar") as string)?.trim() || null;
  const interestTagsRaw = (formData.get("interest_tags") as string)?.trim();
  const publishedAtRaw = (formData.get("published_at") as string)?.trim();
  const isPublished = formData.get("is_published") === "on" || formData.get("is_published") === "true";

  if (!topic || !VALID_TOPICS.has(topic as (typeof TEACHER_NEWS_TOPICS)[number]["id"])) {
    return { error: "Topic invalide." as const };
  }
  if (!titleFr || !titleAr || !excerptFr || !excerptAr) {
    return { error: "Titres et extraits FR/AR obligatoires." as const };
  }

  let interestTags: string | null = null;
  if (interestTagsRaw) {
    try {
      const parsed = JSON.parse(interestTagsRaw) as unknown;
      if (!Array.isArray(parsed)) return { error: "Tags d'intérêt invalides (JSON array)." as const };
      interestTags = JSON.stringify(parsed.filter((x): x is string => typeof x === "string"));
    } catch {
      return { error: "Tags d'intérêt invalides (JSON)." as const };
    }
  }

  const publishedAt = publishedAtRaw ? new Date(publishedAtRaw) : new Date();
  if (Number.isNaN(publishedAt.getTime())) {
    return { error: "Date de publication invalide." as const };
  }

  return {
    data: {
      topic,
      titleFr,
      titleAr,
      excerptFr,
      excerptAr,
      bodyFr,
      bodyAr,
      interestTags,
      publishedAt,
      isPublished,
    },
  };
}

export async function createTeacherNewsArticleAction(
  formData: FormData
): Promise<{ success: true; id: number } | { error: string }> {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const parsed = parseArticlePayload(formData);
  if ("error" in parsed) return { error: parsed.error ?? "Erreur de validation." };

  const [row] = await db
    .insert(teacherNewsArticles)
    .values({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .returning({ id: teacherNewsArticles.id });

  if (parsed.data.isPublished) {
    await notifyUsersOnNewsArticle(row.id, "fr");
  }

  revalidatePath("/dashboard/admin/teacher-news");
  revalidatePath("/dashboard/enseignant/actualites");
  return { success: true, id: row.id };
}

export async function updateTeacherNewsArticleAction(
  id: number,
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const [existing] = await db
    .select({ id: teacherNewsArticles.id, isPublished: teacherNewsArticles.isPublished })
    .from(teacherNewsArticles)
    .where(eq(teacherNewsArticles.id, id))
    .limit(1);

  if (!existing) return { error: "Article introuvable." };

  const parsed = parseArticlePayload(formData);
  if ("error" in parsed) return { error: parsed.error ?? "Erreur de validation." };

  await db
    .update(teacherNewsArticles)
    .set({
      ...parsed.data,
      updatedAt: new Date(),
    })
    .where(eq(teacherNewsArticles.id, id));

  if (parsed.data.isPublished && !existing.isPublished) {
    await notifyUsersOnNewsArticle(id, "fr");
  }

  revalidatePath("/dashboard/admin/teacher-news");
  revalidatePath("/dashboard/enseignant/actualites");
  return { success: true };
}

export async function toggleTeacherNewsPublishAction(
  id: number,
  publish: boolean
): Promise<{ success: true } | { error: string }> {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const [existing] = await db
    .select({ id: teacherNewsArticles.id, isPublished: teacherNewsArticles.isPublished })
    .from(teacherNewsArticles)
    .where(eq(teacherNewsArticles.id, id))
    .limit(1);

  if (!existing) return { error: "Article introuvable." };

  await db
    .update(teacherNewsArticles)
    .set({ isPublished: publish, updatedAt: new Date() })
    .where(eq(teacherNewsArticles.id, id));

  if (publish && !existing.isPublished) {
    await notifyUsersOnNewsArticle(id, "fr");
  }

  revalidatePath("/dashboard/admin/teacher-news");
  revalidatePath("/dashboard/enseignant/actualites");
  return { success: true };
}

export async function deleteTeacherNewsArticleAction(
  id: number
): Promise<{ success: true } | { error: string }> {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await db.delete(teacherNewsArticles).where(eq(teacherNewsArticles.id, id));

  revalidatePath("/dashboard/admin/teacher-news");
  revalidatePath("/dashboard/enseignant/actualites");
  return { success: true };
}

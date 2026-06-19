export { TEACHER_NEWS_TOPICS, articleInterestTags, matchesUserInterests, parseInterestTags } from "@/lib/teacher/news-constants";
export type { TeacherNewsTopicId } from "@/lib/teacher/news-constants";

/** Articles retirés du fil après cette durée (suppression physique via cron) */
export const NEWS_RETENTION_DAYS = 90;

export function newsRetentionCutoff(): Date {
  return new Date(Date.now() - NEWS_RETENTION_DAYS * 24 * 60 * 60 * 1000);
}

export function newsListHref(role: string | null | undefined): string {
  return role === "enseignant" ? "/dashboard/enseignant/actualites" : "/dashboard/parent/actualites";
}

export function newsArticleHref(role: string | null | undefined, id: number): string {
  return `${newsListHref(role)}/${id}`;
}

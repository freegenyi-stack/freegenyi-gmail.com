import { db } from "@/db";
import { teacherNewsArticles, users } from "@/db/schema";
import { notifyUser } from "@/lib/messaging/notify";
import { extractTeacherProfile, parseMetadata } from "@/lib/teacher/profile.server";
import { teacherPushAllowed } from "@/lib/teacher/profile-complete";
import {
  articleInterestTags,
  matchesUserInterests,
} from "@/lib/teacher/news-constants";
import { getArticlesForDigest } from "@/lib/teacher/news.server";
import { eq } from "drizzle-orm";

function formatDigestContent(
  articles: { titleFr: string; titleAr: string }[],
  locale: string
): string {
  const isAr = locale.startsWith("ar");
  const titles = articles.slice(0, 5).map((a) => (isAr ? a.titleAr : a.titleFr));
  const more = articles.length > 5 ? ` (+${articles.length - 5})` : "";
  return titles.join(" · ") + more;
}

export async function sendTeacherWeeklyDigest(opts?: { locale?: string; dryRun?: boolean }) {
  const locale = opts?.locale ?? "fr";
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const articles = await getArticlesForDigest(since);
  if (articles.length === 0) {
    return { sent: 0, skipped: 0, reason: "no_articles" as const };
  }

  const teachers = await db
    .select({ id: users.id, metadata: users.metadata })
    .from(users)
    .where(eq(users.role, "enseignant"));

  let sent = 0;
  let skipped = 0;

  for (const teacher of teachers) {
    if (!teacherPushAllowed(teacher.metadata, "enseignant", "digest")) {
      skipped++;
      continue;
    }

    const interests = extractTeacherProfile(parseMetadata(teacher.metadata)).notificationInterests || [];
    const relevant = articles.filter((a) =>
      matchesUserInterests(articleInterestTags(a.topic, a.interestTags), interests)
    );
    if (relevant.length === 0) {
      skipped++;
      continue;
    }

    const isAr = locale.startsWith("ar");
    const title = isAr ? "ملخصك الأسبوعي" : "Votre semaine pédagogique";
    const content = formatDigestContent(relevant, locale);

    if (!opts?.dryRun) {
      await notifyUser({
        recipientUserId: teacher.id,
        type: "system",
        title,
        content,
        link: "/dashboard/enseignant/actualites",
        locale,
        push: true,
        pushCategory: "digest",
      });
    }
    sent++;
  }

  return { sent, skipped, articles: articles.length };
}

export async function notifyTeachersOnNewsArticle(articleId: number, locale = "fr") {
  const [article] = await db
    .select()
    .from(teacherNewsArticles)
    .where(eq(teacherNewsArticles.id, articleId))
    .limit(1);

  if (!article || !article.isPublished) return { sent: 0 };

  const tags = articleInterestTags(article.topic, article.interestTags);
  const teachers = await db
    .select({ id: users.id, metadata: users.metadata })
    .from(users)
    .where(eq(users.role, "enseignant"));

  let sent = 0;
  const isAr = locale.startsWith("ar");
  const title = isAr ? "خبر جديد" : "Nouvelle actualité";
  const content = isAr ? article.titleAr : article.titleFr;

  for (const teacher of teachers) {
    if (!teacherPushAllowed(teacher.metadata, "enseignant", "news")) continue;
    const interests = extractTeacherProfile(parseMetadata(teacher.metadata)).notificationInterests || [];
    if (!matchesUserInterests(tags, interests)) continue;

    await notifyUser({
      recipientUserId: teacher.id,
      type: "system",
      title,
      content,
      link: "/dashboard/enseignant/actualites",
      locale,
      push: true,
      pushCategory: "news",
    });
    sent++;
  }

  return { sent };
}

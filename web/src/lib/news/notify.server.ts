import { db } from "@/db";
import { teacherNewsArticles, users } from "@/db/schema";
import { notifyUser } from "@/lib/messaging/notify";
import { articleInterestTags } from "@/lib/teacher/news-constants";
import { matchesUserInterests } from "@/lib/teacher/news-constants";
import { getArticlesForDigest } from "@/lib/news/articles.server";
import { newsArticleHref } from "@/lib/news/constants";
import {
  getUserNotificationInterests,
  userNewsPushAllowed,
} from "@/lib/news/preferences";
import { eq, inArray } from "drizzle-orm";

function formatDigestContent(
  articles: { titleFr: string; titleAr: string }[],
  locale: string
): string {
  const isAr = locale.startsWith("ar");
  const titles = articles.slice(0, 5).map((a) => (isAr ? a.titleAr : a.titleFr));
  const more = articles.length > 5 ? ` (+${articles.length - 5})` : "";
  return titles.join(" · ") + more;
}

const NEWS_ROLES = ["enseignant", "parent", "coparent"] as const;

export async function sendNewsWeeklyDigest(opts?: { locale?: string; dryRun?: boolean }) {
  const locale = opts?.locale ?? "fr";
  const since = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const articles = await getArticlesForDigest(since);
  if (articles.length === 0) {
    return { sent: 0, skipped: 0, reason: "no_articles" as const };
  }

  const recipients = await db
    .select({ id: users.id, metadata: users.metadata, role: users.role })
    .from(users)
    .where(inArray(users.role, [...NEWS_ROLES]));

  let sent = 0;
  let skipped = 0;
  const isAr = locale.startsWith("ar");
  const title = isAr ? "ملخصك الأسبوعي" : "Votre semaine FreeGeny";

  for (const user of recipients) {
    const role = user.role || "parent";
    if (!userNewsPushAllowed(user.metadata, role, "digest")) {
      skipped++;
      continue;
    }

    const interests = getUserNotificationInterests(user.metadata);
    const relevant = articles.filter((a) =>
      matchesUserInterests(articleInterestTags(a.topic, a.interestTags), interests)
    );
    if (relevant.length === 0) {
      skipped++;
      continue;
    }

    const content = formatDigestContent(relevant, locale);
    const link = newsArticleHref(role, relevant[0]!.id);

    if (!opts?.dryRun) {
      await notifyUser({
        recipientUserId: user.id,
        type: "system",
        title,
        content,
        link,
        locale,
        push: true,
        pushCategory: "digest",
      });
    }
    sent++;
  }

  return { sent, skipped, articles: articles.length };
}

/** @deprecated alias */
export const sendTeacherWeeklyDigest = sendNewsWeeklyDigest;

export async function notifyUsersOnNewsArticle(articleId: number, locale = "fr") {
  const [article] = await db
    .select()
    .from(teacherNewsArticles)
    .where(eq(teacherNewsArticles.id, articleId))
    .limit(1);

  if (!article || !article.isPublished) return { sent: 0 };

  const tags = articleInterestTags(article.topic, article.interestTags);
  const recipients = await db
    .select({ id: users.id, metadata: users.metadata, role: users.role })
    .from(users)
    .where(inArray(users.role, [...NEWS_ROLES]));

  let sent = 0;
  const isAr = locale.startsWith("ar");
  const title = isAr ? "خبر جديد" : "Nouvelle actualité";
  const content = isAr ? article.titleAr : article.titleFr;

  for (const user of recipients) {
    const role = user.role || "parent";
    if (!userNewsPushAllowed(user.metadata, role, "news")) continue;
    const interests = getUserNotificationInterests(user.metadata);
    if (!matchesUserInterests(tags, interests)) continue;

    await notifyUser({
      recipientUserId: user.id,
      type: "system",
      title,
      content,
      link: newsArticleHref(role, articleId),
      locale,
      push: true,
      pushCategory: "news",
    });
    sent++;
  }

  return { sent };
}

export const notifyTeachersOnNewsArticle = notifyUsersOnNewsArticle;

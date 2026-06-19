import { db } from "@/db";
import { newsArticleComments, teacherNewsArticles, teacherNewsReads, users } from "@/db/schema";
import {
  articleInterestTags,
  matchesUserInterests,
} from "@/lib/teacher/news-constants";
import { newsRetentionCutoff } from "@/lib/news/constants";
import {
  articleMatchesTopicFilter,
  getUserNotificationInterests,
  parseNewsPreferences,
} from "@/lib/news/preferences";
import { and, desc, eq, gte, inArray, lt, sql } from "drizzle-orm";

export type NewsArticleListItem = {
  id: number;
  topic: string;
  titleFr: string;
  titleAr: string;
  excerptFr: string;
  excerptAr: string;
  publishedAt: string;
  unread: boolean;
  commentCount: number;
  interestTags: string[];
};

export type NewsArticleDetail = NewsArticleListItem & {
  bodyFr: string | null;
  bodyAr: string | null;
};

function mapListRow(
  row: typeof teacherNewsArticles.$inferSelect,
  readSet: Set<number>,
  commentCounts: Map<number, number>
): NewsArticleListItem {
  return {
    id: row.id,
    topic: row.topic,
    titleFr: row.titleFr,
    titleAr: row.titleAr,
    excerptFr: row.excerptFr,
    excerptAr: row.excerptAr,
    publishedAt: row.publishedAt?.toISOString().slice(0, 10) ?? "",
    unread: !readSet.has(row.id),
    commentCount: commentCounts.get(row.id) ?? 0,
    interestTags: articleInterestTags(row.topic, row.interestTags),
  };
}

async function getCommentCounts(articleIds: number[]): Promise<Map<number, number>> {
  const map = new Map<number, number>();
  if (!articleIds.length) return map;

  const rows = await db
    .select({
      articleId: newsArticleComments.articleId,
      count: sql<number>`count(*)::int`,
    })
    .from(newsArticleComments)
    .where(
      and(
        inArray(newsArticleComments.articleId, articleIds),
        eq(newsArticleComments.isHidden, false)
      )
    )
    .groupBy(newsArticleComments.articleId);

  rows.forEach((r) => map.set(r.articleId, r.count));
  return map;
}

export async function listNewsForUser(
  userId: number,
  options?: { topic?: string; limit?: number }
): Promise<NewsArticleListItem[]> {
  const [u] = await db.select({ metadata: users.metadata }).from(users).where(eq(users.id, userId)).limit(1);
  const interests = u ? getUserNotificationInterests(u.metadata) : [];
  const newsPrefs = u ? parseNewsPreferences(u.metadata) : parseNewsPreferences(null);
  const cutoff = newsRetentionCutoff();

  const conditions = [
    eq(teacherNewsArticles.isPublished, true),
    gte(teacherNewsArticles.publishedAt, cutoff),
  ];
  if (options?.topic && options.topic !== "all") {
    conditions.push(eq(teacherNewsArticles.topic, options.topic));
  }

  const rows = await db
    .select()
    .from(teacherNewsArticles)
    .where(and(...conditions))
    .orderBy(desc(teacherNewsArticles.publishedAt))
    .limit(options?.limit ?? 50);

  const ids = rows.map((r) => r.id);
  const readSet = new Set<number>();
  if (ids.length > 0) {
    const reads = await db
      .select({ articleId: teacherNewsReads.articleId })
      .from(teacherNewsReads)
      .where(and(eq(teacherNewsReads.userId, userId), inArray(teacherNewsReads.articleId, ids)));
    reads.forEach((r) => readSet.add(r.articleId));
  }

  const commentCounts = await getCommentCounts(ids);

  return rows
    .filter((row) => {
      const tags = articleInterestTags(row.topic, row.interestTags);
      if (!matchesUserInterests(tags, interests)) return false;
      return articleMatchesTopicFilter(row.topic, newsPrefs);
    })
    .map((row) => mapListRow(row, readSet, commentCounts));
}

export async function getNewsArticleForUser(
  userId: number,
  articleId: number
): Promise<NewsArticleDetail | null> {
  const [u] = await db.select({ metadata: users.metadata }).from(users).where(eq(users.id, userId)).limit(1);
  const interests = u ? getUserNotificationInterests(u.metadata) : [];
  const newsPrefs = u ? parseNewsPreferences(u.metadata) : parseNewsPreferences(null);
  const cutoff = newsRetentionCutoff();

  const [row] = await db
    .select()
    .from(teacherNewsArticles)
    .where(
      and(
        eq(teacherNewsArticles.id, articleId),
        eq(teacherNewsArticles.isPublished, true),
        gte(teacherNewsArticles.publishedAt, cutoff)
      )
    )
    .limit(1);

  if (!row) return null;

  const tags = articleInterestTags(row.topic, row.interestTags);
  if (!matchesUserInterests(tags, interests)) return null;
  if (!articleMatchesTopicFilter(row.topic, newsPrefs)) return null;

  const [read] = await db
    .select({ id: teacherNewsReads.id })
    .from(teacherNewsReads)
    .where(and(eq(teacherNewsReads.userId, userId), eq(teacherNewsReads.articleId, articleId)))
    .limit(1);

  const commentCounts = await getCommentCounts([articleId]);

  return {
    ...mapListRow(row, new Set(read ? [articleId] : []), commentCounts),
    bodyFr: row.bodyFr,
    bodyAr: row.bodyAr,
  };
}

export async function markNewsRead(userId: number, articleId: number): Promise<void> {
  const existing = await db
    .select({ id: teacherNewsReads.id })
    .from(teacherNewsReads)
    .where(and(eq(teacherNewsReads.userId, userId), eq(teacherNewsReads.articleId, articleId)))
    .limit(1);
  if (existing.length) return;
  await db.insert(teacherNewsReads).values({ userId, articleId });
}

export async function getArticlesForDigest(since: Date) {
  const cutoff = newsRetentionCutoff();
  const effectiveSince = since > cutoff ? since : cutoff;
  return db
    .select()
    .from(teacherNewsArticles)
    .where(
      and(
        eq(teacherNewsArticles.isPublished, true),
        gte(teacherNewsArticles.publishedAt, effectiveSince)
      )
    )
    .orderBy(desc(teacherNewsArticles.publishedAt));
}

/** Supprime articles plus vieux que NEWS_RETENTION_DAYS (commentaires en cascade) */
export async function purgeExpiredNewsArticles(): Promise<{ deleted: number }> {
  const cutoff = newsRetentionCutoff();
  const expired = await db
    .select({ id: teacherNewsArticles.id })
    .from(teacherNewsArticles)
    .where(lt(teacherNewsArticles.publishedAt, cutoff));

  if (!expired.length) return { deleted: 0 };

  await db
    .delete(teacherNewsArticles)
    .where(
      inArray(
        teacherNewsArticles.id,
        expired.map((e) => e.id)
      )
    );

  return { deleted: expired.length };
}

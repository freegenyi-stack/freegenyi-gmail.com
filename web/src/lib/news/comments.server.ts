import { db } from "@/db";
import { newsArticleComments, newsCommentLikes, teacherNewsArticles, users } from "@/db/schema";
import {
  isCommentContentAllowed,
  sanitizeCommentBody,
  COMMENT_REPORT_HIDE_THRESHOLD,
} from "@/lib/news/moderation";
import { and, desc, eq, gte, inArray, sql } from "drizzle-orm";

export type NewsCommentAuthor = {
  id: number;
  name: string;
  role: string | null;
  image: string | null;
  avatarConfig: { id: string } | null;
};

export type NewsCommentAttachmentType = "none" | "image" | "gif" | "sticker";

export type NewsCommentDto = {
  id: number;
  body: string;
  createdAt: string;
  author: NewsCommentAuthor;
  isOwn: boolean;
  likeCount: number;
  likedByMe: boolean;
  attachmentType: NewsCommentAttachmentType;
  attachmentUrl: string | null;
  attachmentSticker: string | null;
  replies: NewsCommentDto[];
};

export type NewsCommentViewer = {
  name: string;
  role: string | null;
  image: string | null;
  avatarConfig: { id: string } | null;
};

const COMMENTS_PER_HOUR = 15;

function parseAvatarConfig(raw: string | null): { id: string } | null {
  if (!raw) return null;
  try {
    const parsed = JSON.parse(raw) as { id?: string };
    return parsed?.id ? { id: parsed.id } : null;
  } catch {
    return null;
  }
}

function toAuthor(row: {
  userId: number;
  fullName: string | null;
  role: string | null;
  image: string | null;
  avatarConfig: string | null;
}): NewsCommentAuthor {
  return {
    id: row.userId,
    name: row.fullName || "Membre",
    role: row.role,
    image: row.image,
    avatarConfig: parseAvatarConfig(row.avatarConfig),
  };
}

type FlatRow = {
  id: number;
  parentId: number | null;
  body: string;
  createdAt: Date | null;
  userId: number;
  attachmentType: string;
  attachmentUrl: string | null;
  attachmentSticker: string | null;
  likeCount: number;
  fullName: string | null;
  role: string | null;
  image: string | null;
  avatarConfig: string | null;
};

function buildCommentTree(
  rows: FlatRow[],
  viewerId: number,
  likedIds: Set<number>
): NewsCommentDto[] {
  const byParent = new Map<number | null, FlatRow[]>();
  for (const row of rows) {
    const key = row.parentId ?? null;
    const list = byParent.get(key) ?? [];
    list.push(row);
    byParent.set(key, list);
  }

  const toDto = (row: FlatRow): NewsCommentDto => ({
    id: row.id,
    body: row.body,
    createdAt: row.createdAt?.toISOString() ?? "",
      author: toAuthor({
        userId: row.userId,
        fullName: row.fullName,
        role: row.role,
        image: row.image,
        avatarConfig: row.avatarConfig,
      }),
    isOwn: row.userId === viewerId,
    likeCount: row.likeCount,
    likedByMe: likedIds.has(row.id),
    attachmentType: (row.attachmentType as NewsCommentAttachmentType) || "none",
    attachmentUrl: row.attachmentUrl,
    attachmentSticker: row.attachmentSticker,
    replies: (byParent.get(row.id) ?? [])
      .sort((a, b) => (a.createdAt?.getTime() ?? 0) - (b.createdAt?.getTime() ?? 0))
      .map(toDto),
  });

  return (byParent.get(null) ?? [])
    .sort((a, b) => (b.createdAt?.getTime() ?? 0) - (a.createdAt?.getTime() ?? 0))
    .map(toDto);
}

export async function getNewsCommentViewer(userId: number): Promise<NewsCommentViewer | null> {
  const [user] = await db
    .select({
      fullName: users.fullName,
      role: users.role,
      image: users.image,
      avatarConfig: users.avatarConfig,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!user) return null;
  return {
    name: user.fullName || "Membre",
    role: user.role,
    image: user.image,
    avatarConfig: parseAvatarConfig(user.avatarConfig),
  };
}

export async function listNewsComments(
  articleId: number,
  viewerId: number
): Promise<{ comments: NewsCommentDto[]; viewer: NewsCommentViewer | null }> {
  const rows = await db
    .select({
      id: newsArticleComments.id,
      parentId: newsArticleComments.parentId,
      body: newsArticleComments.body,
      createdAt: newsArticleComments.createdAt,
      userId: newsArticleComments.userId,
      attachmentType: newsArticleComments.attachmentType,
      attachmentUrl: newsArticleComments.attachmentUrl,
      attachmentSticker: newsArticleComments.attachmentSticker,
      likeCount: newsArticleComments.likeCount,
      fullName: users.fullName,
      role: users.role,
      image: users.image,
      avatarConfig: users.avatarConfig,
    })
    .from(newsArticleComments)
    .innerJoin(users, eq(newsArticleComments.userId, users.id))
    .where(and(eq(newsArticleComments.articleId, articleId), eq(newsArticleComments.isHidden, false)))
    .orderBy(desc(newsArticleComments.createdAt))
    .limit(200);

  const commentIds = rows.map((r) => r.id);
  const likedIds = new Set<number>();

  if (commentIds.length > 0) {
    const likes = await db
      .select({ commentId: newsCommentLikes.commentId })
      .from(newsCommentLikes)
      .where(and(eq(newsCommentLikes.userId, viewerId), inArray(newsCommentLikes.commentId, commentIds)));
    for (const l of likes) likedIds.add(l.commentId);
  }

  const viewer = await getNewsCommentViewer(viewerId);
  return { comments: buildCommentTree(rows, viewerId, likedIds), viewer };
}

export type AddNewsCommentInput = {
  body?: string;
  parentId?: number | null;
  attachmentType?: NewsCommentAttachmentType;
  attachmentUrl?: string | null;
  attachmentSticker?: string | null;
};

async function assertRateLimit(userId: number): Promise<{ ok: true } | { error: string }> {
  const since = new Date(Date.now() - 60 * 60 * 1000);
  const [{ count }] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(newsArticleComments)
    .where(and(eq(newsArticleComments.userId, userId), gte(newsArticleComments.createdAt, since)));

  if (count >= COMMENTS_PER_HOUR) {
    return { error: "Trop de commentaires — réessayez plus tard." };
  }
  return { ok: true };
}

export async function addNewsComment(
  userId: number,
  articleId: number,
  input: AddNewsCommentInput
): Promise<{ comment: NewsCommentDto } | { error: string }> {
  const [article] = await db
    .select({ id: teacherNewsArticles.id })
    .from(teacherNewsArticles)
    .where(and(eq(teacherNewsArticles.id, articleId), eq(teacherNewsArticles.isPublished, true)))
    .limit(1);

  if (!article) return { error: "Article introuvable." };

  const attachmentType: NewsCommentAttachmentType = input.attachmentType ?? "none";
  const attachmentUrl = input.attachmentUrl?.trim() || null;
  const attachmentSticker = input.attachmentSticker?.trim() || null;
  const body = sanitizeCommentBody(input.body ?? "");
  const hasAttachment =
    attachmentType !== "none" &&
    Boolean(attachmentUrl || attachmentSticker);

  const check = isCommentContentAllowed(body, hasAttachment);
  if (!check.ok) return { error: check.reason };

  let parentId: number | null = input.parentId ?? null;
  if (parentId) {
    const [parent] = await db
      .select({
        id: newsArticleComments.id,
        articleId: newsArticleComments.articleId,
        parentId: newsArticleComments.parentId,
      })
      .from(newsArticleComments)
      .where(and(eq(newsArticleComments.id, parentId), eq(newsArticleComments.isHidden, false)))
      .limit(1);

    if (!parent || parent.articleId !== articleId) {
      return { error: "Commentaire parent introuvable." };
    }
    if (parent.parentId !== null) {
      return { error: "Réponse impossible à ce niveau." };
    }
  }

  const rate = await assertRateLimit(userId);
  if ("error" in rate) return rate;

  const [user] = await db
    .select({
      fullName: users.fullName,
      role: users.role,
      image: users.image,
      avatarConfig: users.avatarConfig,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const [row] = await db
    .insert(newsArticleComments)
    .values({
      articleId,
      userId,
      parentId,
      body,
      attachmentType,
      attachmentUrl,
      attachmentSticker,
    })
    .returning();

  return {
    comment: {
      id: row.id,
      body: row.body,
      createdAt: row.createdAt?.toISOString() ?? "",
      author: toAuthor({
        userId,
        fullName: user?.fullName ?? null,
        role: user?.role ?? null,
        image: user?.image ?? null,
        avatarConfig: user?.avatarConfig ?? null,
      }),
      isOwn: true,
      likeCount: 0,
      likedByMe: false,
      attachmentType,
      attachmentUrl,
      attachmentSticker,
      replies: [],
    },
  };
}

export async function toggleNewsCommentLike(
  userId: number,
  commentId: number
): Promise<{ liked: boolean; likeCount: number } | { error: string }> {
  const [comment] = await db
    .select()
    .from(newsArticleComments)
    .where(and(eq(newsArticleComments.id, commentId), eq(newsArticleComments.isHidden, false)))
    .limit(1);

  if (!comment) return { error: "Commentaire introuvable." };

  const [existing] = await db
    .select({ id: newsCommentLikes.id })
    .from(newsCommentLikes)
    .where(and(eq(newsCommentLikes.commentId, commentId), eq(newsCommentLikes.userId, userId)))
    .limit(1);

  if (existing) {
    await db.delete(newsCommentLikes).where(eq(newsCommentLikes.id, existing.id));
    const nextCount = Math.max(0, comment.likeCount - 1);
    await db.update(newsArticleComments).set({ likeCount: nextCount }).where(eq(newsArticleComments.id, commentId));
    return { liked: false, likeCount: nextCount };
  }

  await db.insert(newsCommentLikes).values({ commentId, userId });
  const nextCount = comment.likeCount + 1;
  await db.update(newsArticleComments).set({ likeCount: nextCount }).where(eq(newsArticleComments.id, commentId));
  return { liked: true, likeCount: nextCount };
}

export async function reportNewsComment(
  reporterId: number,
  commentId: number
): Promise<{ ok: true } | { error: string }> {
  const [comment] = await db
    .select()
    .from(newsArticleComments)
    .where(eq(newsArticleComments.id, commentId))
    .limit(1);

  if (!comment) return { error: "Commentaire introuvable." };
  if (comment.userId === reporterId) return { error: "Vous ne pouvez pas signaler votre commentaire." };

  const nextCount = comment.reportCount + 1;
  await db
    .update(newsArticleComments)
    .set({
      reportCount: nextCount,
      isHidden: nextCount >= COMMENT_REPORT_HIDE_THRESHOLD ? true : comment.isHidden,
    })
    .where(eq(newsArticleComments.id, commentId));

  return { ok: true };
}

export async function deleteOwnNewsComment(
  userId: number,
  commentId: number
): Promise<{ ok: true } | { error: string }> {
  const [comment] = await db
    .select()
    .from(newsArticleComments)
    .where(eq(newsArticleComments.id, commentId))
    .limit(1);

  if (!comment) return { error: "Commentaire introuvable." };
  if (comment.userId !== userId) return { error: "Non autorisé." };

  await db.delete(newsArticleComments).where(eq(newsArticleComments.id, commentId));
  return { ok: true };
}

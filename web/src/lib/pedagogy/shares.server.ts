import { db } from "@/db";
import {
  authoringResources,
  children,
  pedagogyShareAttachments,
  pedagogyShareComments,
  pedagogyShareLikes,
  pedagogyShares,
  users,
} from "@/db/schema";
import { savePedagogyShareFile } from "@/lib/pedagogy/share-media.server";
import { notifyNewPedagogyShare } from "@/lib/pedagogy/share-notify.server";
import {
  COMMENT_REPORT_HIDE_THRESHOLD,
  isCommentContentAllowed,
  sanitizeCommentBody,
} from "@/lib/news/moderation";
import { PEDAGOGY_POST_TYPES, type PedagogyPostType } from "@/lib/pedagogy/constants";
import type { PedagogyShareDto } from "@/lib/pedagogy/types";
import { and, desc, eq, inArray, sql } from "drizzle-orm";
import { requireTeacherVerified } from "@/lib/orgVerification.guard";

export type { PedagogyShareDto };

async function getParentLevels(userId: number): Promise<string[]> {
  const rows = await db
    .select({ level: children.educationLevel })
    .from(children)
    .where(eq(children.parentId, userId));
  const levels = rows.map((r) => r.level).filter((l): l is string => !!l);
  return [...new Set(levels)];
}

async function getUserLikeSet(userId: number, shareIds: number[]): Promise<Set<number>> {
  if (shareIds.length === 0) return new Set();
  const likes = await db
    .select({ shareId: pedagogyShareLikes.shareId })
    .from(pedagogyShareLikes)
    .where(and(eq(pedagogyShareLikes.userId, userId), inArray(pedagogyShareLikes.shareId, shareIds)));
  return new Set(likes.map((l) => l.shareId));
}

function parseAuthorMetadata(metadata: string | null) {
  if (!metadata) return { subject: null as string | null, avatarMode: "catalog" as const };
  try {
    const m = JSON.parse(metadata) as {
      teacherSubject?: string;
      teacherProfile?: { avatarMode?: "photo" | "catalog"; subjects?: string[] };
    };
    const subject =
      m.teacherProfile?.subjects?.[0] || m.teacherSubject || null;
    return {
      subject,
      avatarMode: m.teacherProfile?.avatarMode || ("catalog" as const),
    };
  } catch {
    return { subject: null as string | null, avatarMode: "catalog" as const };
  }
}

export async function listPedagogySharesForUser(
  userId: number,
  role: string,
  options?: { level?: string; mine?: boolean }
): Promise<PedagogyShareDto[]> {
  const conditions = [eq(pedagogyShares.isRemoved, false), eq(pedagogyShares.isHidden, false)];

  if (options?.mine) {
    conditions.push(eq(pedagogyShares.authorId, userId));
  } else if (role === "parent" || role === "coparent") {
    const levels = options?.level ? [options.level] : await getParentLevels(userId);
    if (levels.length === 0) return [];
    conditions.push(inArray(pedagogyShares.educationLevel, levels));
  } else if (options?.level) {
    conditions.push(eq(pedagogyShares.educationLevel, options.level));
  }

  const rows = await db
    .select({
      id: pedagogyShares.id,
      postType: pedagogyShares.postType,
      title: pedagogyShares.title,
      description: pedagogyShares.description,
      educationLevel: pedagogyShares.educationLevel,
      subject: pedagogyShares.subject,
      viewCount: pedagogyShares.viewCount,
      likeCount: pedagogyShares.likeCount,
      createdAt: pedagogyShares.createdAt,
      authorId: pedagogyShares.authorId,
      authoringResourceId: pedagogyShares.authoringResourceId,
      authoringResourceKind: authoringResources.kind,
      authorName: users.fullName,
      authorImage: users.image,
      authorAvatarConfig: users.avatarConfig,
      authorMetadata: users.metadata,
    })
    .from(pedagogyShares)
    .innerJoin(users, eq(users.id, pedagogyShares.authorId))
    .leftJoin(authoringResources, eq(authoringResources.id, pedagogyShares.authoringResourceId))
    .where(and(...conditions))
    .orderBy(desc(pedagogyShares.createdAt))
    .limit(50);

  const shareIds = rows.map((r) => r.id);
  const liked = await getUserLikeSet(userId, shareIds);

  const attachmentRows =
    shareIds.length === 0
      ? []
      : await db
          .select()
          .from(pedagogyShareAttachments)
          .where(inArray(pedagogyShareAttachments.shareId, shareIds));

  const attachmentsByShare = new Map<number, PedagogyShareDto["attachments"]>();
  for (const att of attachmentRows) {
    const list = attachmentsByShare.get(att.shareId) ?? [];
    list.push({
      id: att.id,
      fileUrl: att.fileUrl,
      fileName: att.fileName,
      mimeType: att.mimeType,
    });
    attachmentsByShare.set(att.shareId, list);
  }

  return rows.map((row) => {
    const meta = parseAuthorMetadata(row.authorMetadata);
    let avatarConfig = null;
    try {
      avatarConfig = row.authorAvatarConfig ? JSON.parse(row.authorAvatarConfig) : null;
    } catch {
      avatarConfig = null;
    }
    return {
      id: row.id,
      postType: row.postType as PedagogyPostType,
      title: row.title,
      description: row.description,
      educationLevel: row.educationLevel,
      subject: row.subject,
      viewCount: row.viewCount,
      likeCount: row.likeCount,
      likedByMe: liked.has(row.id),
      createdAt: row.createdAt?.toISOString() ?? new Date().toISOString(),
      author: {
        id: row.authorId,
        fullName: row.authorName || "Enseignant",
        image: row.authorImage,
        subject: meta.subject,
        avatarConfig,
        avatarMode: meta.avatarMode,
      },
      attachments: attachmentsByShare.get(row.id) ?? [],
      authoringResourceId: row.authoringResourceId,
      authoringResourceKind: row.authoringResourceKind as PedagogyShareDto["authoringResourceKind"],
    };
  });
}

export async function createPedagogyShare(
  authorId: number,
  formData: FormData
): Promise<{ id: number } | { error: string }> {
  const [author] = await db
    .select({ metadata: users.metadata })
    .from(users)
    .where(eq(users.id, authorId))
    .limit(1);

  const verified = await requireTeacherVerified(authorId, author?.metadata);
  if (!verified.ok) return { error: verified.error };

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim() || null;
  const postType = (formData.get("post_type") as string)?.trim();
  const educationLevel = (formData.get("education_level") as string)?.trim();
  const subject = (formData.get("subject") as string)?.trim() || null;
  const authoringResourceIdRaw = formData.get("authoring_resource_id") as string | null;
  const authoringResourceId = authoringResourceIdRaw ? parseInt(authoringResourceIdRaw, 10) : null;

  if (!title || !postType || !educationLevel) {
    return { error: "Veuillez remplir les champs obligatoires." };
  }
  if (!PEDAGOGY_POST_TYPES.includes(postType as PedagogyPostType)) {
    return { error: "Type de publication invalide." };
  }

  const files = formData.getAll("files").filter((f): f is File => f instanceof File && f.size > 0);
  const hasLinkedResource =
    authoringResourceId != null && !Number.isNaN(authoringResourceId) && authoringResourceId > 0;
  if (files.length === 0 && !hasLinkedResource && postType !== "exercise") {
    return { error: "Ajoutez au moins un fichier." };
  }
  if (files.length > 5) {
    return { error: "Maximum 5 fichiers par publication." };
  }

  try {
    const savedFiles = await Promise.all(files.map((f) => savePedagogyShareFile(authorId, f)));

    const [share] = await db
      .insert(pedagogyShares)
      .values({
        authorId,
        postType,
        title,
        description,
        educationLevel,
        subject,
        authoringResourceId: hasLinkedResource ? authoringResourceId : null,
      })
      .returning({ id: pedagogyShares.id });

    if (savedFiles.length > 0) {
      await db.insert(pedagogyShareAttachments).values(
        savedFiles.map((f) => ({
          shareId: share.id,
          fileUrl: f.url,
          fileName: f.fileName,
          mimeType: f.mimeType,
          fileSize: f.fileSize,
        }))
      );
    }

    const [author] = await db
      .select({ fullName: users.fullName })
      .from(users)
      .where(eq(users.id, authorId))
      .limit(1);

    try {
      await notifyNewPedagogyShare({
        shareId: share.id,
        authorId,
        authorName: author?.fullName || "Enseignant",
        title,
        educationLevel,
        postType: postType as PedagogyPostType,
      });
    } catch (e) {
      console.warn("notifyNewPedagogyShare (non bloquant):", e);
    }

    return { id: share.id };
  } catch (e) {
    console.error("createPedagogyShare:", e);
    return { error: e instanceof Error ? e.message : "Erreur lors de la publication." };
  }
}

export async function togglePedagogyShareLike(
  userId: number,
  shareId: number
): Promise<{ liked: boolean; likeCount: number } | { error: string }> {
  const [share] = await db
    .select({ id: pedagogyShares.id, likeCount: pedagogyShares.likeCount })
    .from(pedagogyShares)
    .where(and(eq(pedagogyShares.id, shareId), eq(pedagogyShares.isRemoved, false)))
    .limit(1);

  if (!share) return { error: "Publication introuvable." };

  const [existing] = await db
    .select({ id: pedagogyShareLikes.id })
    .from(pedagogyShareLikes)
    .where(and(eq(pedagogyShareLikes.shareId, shareId), eq(pedagogyShareLikes.userId, userId)))
    .limit(1);

  if (existing) {
    await db.delete(pedagogyShareLikes).where(eq(pedagogyShareLikes.id, existing.id));
    const nextCount = Math.max(0, share.likeCount - 1);
    await db.update(pedagogyShares).set({ likeCount: nextCount }).where(eq(pedagogyShares.id, shareId));
    return { liked: false, likeCount: nextCount };
  }

  await db.insert(pedagogyShareLikes).values({ shareId, userId });
  const nextCount = share.likeCount + 1;
  await db.update(pedagogyShares).set({ likeCount: nextCount }).where(eq(pedagogyShares.id, shareId));
  return { liked: true, likeCount: nextCount };
}

export async function recordPedagogyShareView(shareId: number): Promise<void> {
  await db
    .update(pedagogyShares)
    .set({ viewCount: sql`${pedagogyShares.viewCount} + 1` })
    .where(eq(pedagogyShares.id, shareId));
}

export async function unpublishMurSharesForResource(
  authorId: number,
  resourceId: number
): Promise<{ removed: number }> {
  const result = await db
    .update(pedagogyShares)
    .set({ isRemoved: true, updatedAt: new Date() })
    .where(
      and(
        eq(pedagogyShares.authorId, authorId),
        eq(pedagogyShares.authoringResourceId, resourceId),
        eq(pedagogyShares.isRemoved, false)
      )
    )
    .returning({ id: pedagogyShares.id });
  return { removed: result.length };
}

export async function deletePedagogyShare(authorId: number, shareId: number): Promise<{ ok: true } | { error: string }> {
  const [share] = await db
    .select({ authorId: pedagogyShares.authorId })
    .from(pedagogyShares)
    .where(eq(pedagogyShares.id, shareId))
    .limit(1);

  if (!share) return { error: "Publication introuvable." };
  if (share.authorId !== authorId) return { error: "Non autorisé." };

  await db.update(pedagogyShares).set({ isRemoved: true, updatedAt: new Date() }).where(eq(pedagogyShares.id, shareId));
  return { ok: true };
}

export async function getTeacherShareStats(authorId: number) {
  const [row] = await db
    .select({
      count: sql<number>`count(*)::int`,
      views: sql<number>`coalesce(sum(${pedagogyShares.viewCount}), 0)::int`,
      likes: sql<number>`coalesce(sum(${pedagogyShares.likeCount}), 0)::int`,
    })
    .from(pedagogyShares)
    .where(and(eq(pedagogyShares.authorId, authorId), eq(pedagogyShares.isRemoved, false)));

  return {
    publications: row?.count ?? 0,
    views: row?.views ?? 0,
    likes: row?.likes ?? 0,
  };
}

export async function getTeacherLeaderboard(limit = 5) {
  const rows = await db
    .select({
      authorId: pedagogyShares.authorId,
      fullName: users.fullName,
      posts: sql<number>`count(*)::int`,
      likes: sql<number>`coalesce(sum(${pedagogyShares.likeCount}), 0)::int`,
    })
    .from(pedagogyShares)
    .innerJoin(users, eq(pedagogyShares.authorId, users.id))
    .where(eq(pedagogyShares.isRemoved, false))
    .groupBy(pedagogyShares.authorId, users.fullName)
    .orderBy(sql`coalesce(sum(${pedagogyShares.likeCount}), 0) desc`, sql`count(*) desc`)
    .limit(limit);

  return rows.map((r, i) => ({
    rank: i + 1,
    authorId: r.authorId,
    fullName: r.fullName ?? "Enseignant",
    posts: r.posts,
    likes: r.likes,
  }));
}

export type PedagogyShareCommentDto = {
  id: number;
  body: string;
  createdAt: string;
  author: { id: number; fullName: string | null; role: string | null };
  canDelete: boolean;
};

export async function listPedagogyShareComments(shareId: number): Promise<PedagogyShareCommentDto[]> {
  const rows = await db
    .select({
      id: pedagogyShareComments.id,
      body: pedagogyShareComments.body,
      createdAt: pedagogyShareComments.createdAt,
      authorId: pedagogyShareComments.authorId,
      fullName: users.fullName,
      role: users.role,
    })
    .from(pedagogyShareComments)
    .innerJoin(users, eq(pedagogyShareComments.authorId, users.id))
    .where(and(eq(pedagogyShareComments.shareId, shareId), eq(pedagogyShareComments.isHidden, false)))
    .orderBy(pedagogyShareComments.createdAt);

  return rows.map((r) => ({
    id: r.id,
    body: r.body,
    createdAt: r.createdAt.toISOString(),
    author: { id: r.authorId, fullName: r.fullName, role: r.role },
    canDelete: false,
  }));
}

export async function listPedagogyShareCommentsForUser(
  shareId: number,
  viewerUserId: number,
  shareAuthorId?: number
): Promise<PedagogyShareCommentDto[]> {
  const comments = await listPedagogyShareComments(shareId);
  return comments.map((c) => ({
    ...c,
    canDelete: c.author.id === viewerUserId || (shareAuthorId != null && shareAuthorId === viewerUserId),
  }));
}

export async function addPedagogyShareComment(userId: number, shareId: number, body: string) {
  const trimmed = sanitizeCommentBody(body);
  const allowed = isCommentContentAllowed(trimmed, false);
  if (!allowed.ok) return { error: "invalid_body" as const, detail: allowed.reason };

  const [share] = await db
    .select({ id: pedagogyShares.id })
    .from(pedagogyShares)
    .where(and(eq(pedagogyShares.id, shareId), eq(pedagogyShares.isRemoved, false), eq(pedagogyShares.isHidden, false)))
    .limit(1);
  if (!share) return { error: "not_found" as const };

  const [row] = await db
    .insert(pedagogyShareComments)
    .values({ shareId, authorId: userId, body: trimmed })
    .returning({
      id: pedagogyShareComments.id,
      body: pedagogyShareComments.body,
      createdAt: pedagogyShareComments.createdAt,
      authorId: pedagogyShareComments.authorId,
    });

  const [author] = await db
    .select({ fullName: users.fullName, role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  return {
    comment: {
      id: row.id,
      body: row.body,
      createdAt: row.createdAt.toISOString(),
      author: { id: row.authorId, fullName: author?.fullName ?? null, role: author?.role ?? null },
      canDelete: true,
    } satisfies PedagogyShareCommentDto,
  };
}

export async function deletePedagogyShareComment(userId: number, shareId: number, commentId: number) {
  const [comment] = await db
    .select({ id: pedagogyShareComments.id, authorId: pedagogyShareComments.authorId })
    .from(pedagogyShareComments)
    .where(and(eq(pedagogyShareComments.id, commentId), eq(pedagogyShareComments.shareId, shareId)))
    .limit(1);

  if (!comment) return { error: "not_found" as const };

  const [share] = await db
    .select({ authorId: pedagogyShares.authorId })
    .from(pedagogyShares)
    .where(eq(pedagogyShares.id, shareId))
    .limit(1);

  const canDelete = comment.authorId === userId || share?.authorId === userId;
  if (!canDelete) return { error: "forbidden" as const };

  await db.delete(pedagogyShareComments).where(eq(pedagogyShareComments.id, commentId));
  return { ok: true as const };
}

export async function reportPedagogyShareComment(userId: number, shareId: number, commentId: number) {
  const [comment] = await db
    .select({
      id: pedagogyShareComments.id,
      reportCount: pedagogyShareComments.reportCount,
      isHidden: pedagogyShareComments.isHidden,
    })
    .from(pedagogyShareComments)
    .where(and(eq(pedagogyShareComments.id, commentId), eq(pedagogyShareComments.shareId, shareId)))
    .limit(1);

  if (!comment) return { error: "not_found" as const };

  const nextCount = comment.reportCount + 1;
  await db
    .update(pedagogyShareComments)
    .set({
      reportCount: nextCount,
      isHidden: nextCount >= COMMENT_REPORT_HIDE_THRESHOLD ? true : comment.isHidden,
    })
    .where(eq(pedagogyShareComments.id, commentId));

  return { ok: true as const, hidden: nextCount >= COMMENT_REPORT_HIDE_THRESHOLD };
}

export async function reportPedagogyShare(userId: number, shareId: number) {
  const [share] = await db
    .select({
      id: pedagogyShares.id,
      authorId: pedagogyShares.authorId,
      reportCount: pedagogyShares.reportCount,
      isHidden: pedagogyShares.isHidden,
    })
    .from(pedagogyShares)
    .where(and(eq(pedagogyShares.id, shareId), eq(pedagogyShares.isRemoved, false)))
    .limit(1);

  if (!share) return { error: "not_found" as const };
  if (share.authorId === userId) return { error: "forbidden" as const };

  const nextCount = share.reportCount + 1;
  await db
    .update(pedagogyShares)
    .set({
      reportCount: nextCount,
      isHidden: nextCount >= COMMENT_REPORT_HIDE_THRESHOLD ? true : share.isHidden,
      updatedAt: new Date(),
    })
    .where(eq(pedagogyShares.id, shareId));

  return { ok: true as const, hidden: nextCount >= COMMENT_REPORT_HIDE_THRESHOLD };
}

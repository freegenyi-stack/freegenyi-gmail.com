import { db } from "@/db";
import {
  chatMessages,
  conversationMembers,
  conversations,
  users,
} from "@/db/schema";
import { and, desc, eq, gt, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { isWithinSchoolMessagingHours, schoolHoursBlockMessage } from "./moderation";
import { canUsersMessage } from "./permissions";
import {
  displayName,
  getMessagingUserById,
  isOnline,
  requireMessagingUser,
  toUserPreview,
  type MessagingUser,
} from "./session";
import { notifyUser } from "./notify";
import { setTyping } from "./typing.server";
import type { ChatMessageDto, ConversationPreview, SendMessageOptions } from "./types";
import { isFamilyAdult } from "@/lib/family/constants";
import { getRoomMeta } from "./channel-catalog";
import { provisionChannelsForUser } from "./channels.server";
import {
  allowBroadcastInChannel,
  canUserPostInChannel,
} from "./channel-permissions";

const MAX_MESSAGE_LENGTH = 4000;
const EDIT_WINDOW_MS = 15 * 60_000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 40;
const recentSends = new Map<number, number[]>();

function directKeyFor(a: number, b: number): string {
  const lo = Math.min(a, b);
  const hi = Math.max(a, b);
  return `d:${lo}:${hi}`;
}

function checkRateLimit(userId: number): boolean {
  const now = Date.now();
  const hits = (recentSends.get(userId) || []).filter((t) => now - t < RATE_WINDOW_MS);
  if (hits.length >= RATE_MAX) return false;
  hits.push(now);
  recentSends.set(userId, hits);
  return true;
}

function formatMessagePreview(msg: {
  content: string | null;
  messageType: string | null;
  mediaUrl: string | null;
}): string {
  const type = msg.messageType || "text";
  if (type === "image") return msg.content?.trim() || "📷 Image";
  if (type === "file") return msg.content?.trim() || "📎 Fichier";
  return msg.content || "";
}

function notificationPreview(text: string, messageType: string): string {
  const trimmed = text.trim();
  if (trimmed) return trimmed.length > 120 ? `${trimmed.slice(0, 117)}…` : trimmed;
  if (messageType === "image") return "📷 Image";
  if (messageType === "file") return "📎 Fichier";
  return "Nouveau message";
}

export function validateMediaOwnership(mediaUrl: string, userId: number): boolean {
  if (!mediaUrl.startsWith("/uploads/chat/")) return false;
  const segments = mediaUrl.split("/").filter(Boolean);
  return segments[2] === String(userId);
}

async function mergeDirectConversation(fromId: number, toId: number): Promise<void> {
  if (fromId === toId) return;
  await db.update(chatMessages).set({ conversationId: toId }).where(eq(chatMessages.conversationId, fromId));
  await db.delete(conversations).where(eq(conversations.id, fromId));
}

/** Trouve la conversation directe canonique entre deux utilisateurs (fusionne les doublons). */
async function findDirectConversationBetween(
  userA: number,
  userB: number
): Promise<{ id: number } | null> {
  const dkey = directKeyFor(userA, userB);

  const [byKey] = await db
    .select({ id: conversations.id })
    .from(conversations)
    .where(eq(conversations.directKey, dkey))
    .limit(1);
  if (byKey) return byKey;

  const convsForA = await db
    .select({ conversationId: conversationMembers.conversationId })
    .from(conversationMembers)
    .innerJoin(conversations, eq(conversations.id, conversationMembers.conversationId))
    .where(
      and(
        eq(conversationMembers.userId, userA),
        or(eq(conversations.type, "direct"), isNull(conversations.type))
      )
    );

  const candidates: { id: number; lastMessageAt: Date | null }[] = [];

  for (const row of convsForA) {
    const members = await db
      .select({ userId: conversationMembers.userId })
      .from(conversationMembers)
      .where(eq(conversationMembers.conversationId, row.conversationId));

    if (members.length !== 2) continue;
    if (!members.some((m) => m.userId === userB)) continue;

    const [conv] = await db
      .select({ id: conversations.id, lastMessageAt: conversations.lastMessageAt })
      .from(conversations)
      .where(eq(conversations.id, row.conversationId))
      .limit(1);
    if (conv) candidates.push(conv);
  }

  if (candidates.length === 0) return null;

  candidates.sort((a, b) => {
    const ta = a.lastMessageAt?.getTime() ?? 0;
    const tb = b.lastMessageAt?.getTime() ?? 0;
    return tb - ta || b.id - a.id;
  });

  const canonical = candidates[0];
  await db
    .update(conversations)
    .set({ directKey: dkey, type: "direct" })
    .where(eq(conversations.id, canonical.id));

  for (let i = 1; i < candidates.length; i++) {
    await mergeDirectConversation(candidates[i].id, canonical.id);
  }

  return { id: canonical.id };
}

export async function findOrCreateDirectConversation(
  current: MessagingUser,
  targetUserId: number
): Promise<{ conversationId: number } | { error: string }> {
  const target = await getMessagingUserById(targetUserId);
  if (!target) return { error: "Utilisateur introuvable." };

  const perm = await canUsersMessage(current, target);
  if (!perm.allowed) return { error: "Vous ne pouvez pas contacter cette personne." };

  const existing = await findDirectConversationBetween(current.id, targetUserId);
  if (existing) return { conversationId: existing.id };

  const dkey = directKeyFor(current.id, targetUserId);

  const [conv] = await db
    .insert(conversations)
    .values({
      type: "direct",
      directKey: dkey,
      schoolId: perm.schoolId ?? null,
      updatedAt: new Date(),
    })
    .returning({ id: conversations.id });

  await db.insert(conversationMembers).values([
    { conversationId: conv.id, userId: current.id },
    { conversationId: conv.id, userId: targetUserId },
  ]);

  return { conversationId: conv.id };
}

export async function listConversationsForUser(userId: number): Promise<ConversationPreview[]> {
  const user = await getMessagingUserById(userId);
  if (user) {
    try {
      await provisionChannelsForUser(user);
    } catch (e) {
      console.warn("Provision salons (non bloquant):", e);
    }
  }

  const memberships = await db
    .select({
      conversationId: conversationMembers.conversationId,
      lastReadAt: conversationMembers.lastReadAt,
      muted: conversationMembers.muted,
    })
    .from(conversationMembers)
    .where(eq(conversationMembers.userId, userId));

  if (memberships.length === 0) return [];

  const convIds = memberships.map((m) => m.conversationId);
  const readMap = new Map(memberships.map((m) => [m.conversationId, m.lastReadAt]));
  const mutedMap = new Map(memberships.map((m) => [m.conversationId, m.muted ?? false]));

  const convRows = await db
    .select()
    .from(conversations)
    .where(inArray(conversations.id, convIds))
    .orderBy(desc(conversations.lastMessageAt), desc(conversations.updatedAt));

  const previews: ConversationPreview[] = [];

  for (const conv of convRows) {
    const [lastMsg] = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, conv.id))
      .orderBy(desc(chatMessages.createdAt))
      .limit(1);

    const lastRead = readMap.get(conv.id);
    const unreadRows = await db
      .select({ count: sql<number>`count(*)::int` })
      .from(chatMessages)
      .where(
        and(
          eq(chatMessages.conversationId, conv.id),
          ne(chatMessages.senderId, userId),
          lastRead ? gt(chatMessages.createdAt, lastRead) : sql`true`
        )
      );

    let lastSenderName: string | null = null;
    if (lastMsg) {
      const sender = await getMessagingUserById(lastMsg.senderId);
      lastSenderName = sender ? displayName(sender) : null;
    }

    const lastMessage = lastMsg
      ? {
          id: lastMsg.id,
          content: formatMessagePreview(lastMsg),
          messageType: lastMsg.messageType,
          mediaUrl: lastMsg.mediaUrl,
          senderId: lastMsg.senderId,
          senderName: lastSenderName,
          createdAt: lastMsg.createdAt.toISOString(),
          isMine: lastMsg.senderId === userId,
        }
      : null;

    if (conv.type === "channel") {
      const slug = conv.name || "";
      const meta = getRoomMeta(slug, "c");
      previews.push({
        id: conv.id,
        type: "channel",
        otherUser: null,
        channelMeta: {
          slug,
          key: meta.key,
          section: meta.section,
          labelKey: meta.labelKey,
        },
        lastMessage,
        unreadCount: unreadRows[0]?.count ?? 0,
        muted: mutedMap.get(conv.id) ?? false,
        updatedAt: (conv.lastMessageAt || conv.updatedAt || conv.createdAt).toISOString(),
      });
      continue;
    }

    const members = await db
      .select({ userId: conversationMembers.userId })
      .from(conversationMembers)
      .where(eq(conversationMembers.conversationId, conv.id));

    const otherId = members.map((m) => m.userId).find((id) => id !== userId);
    if (!otherId) continue;

    const other = await getMessagingUserById(otherId);
    if (!other) continue;

    previews.push({
      id: conv.id,
      type: conv.type || "direct",
      otherUser: toUserPreview(other),
      lastMessage,
      unreadCount: unreadRows[0]?.count ?? 0,
      muted: mutedMap.get(conv.id) ?? false,
      updatedAt: (conv.lastMessageAt || conv.updatedAt || conv.createdAt).toISOString(),
    });
  }

  return dedupeDirectPreviews(previews);
}

/** Évite d'afficher plusieurs fils DM avec la même personne. */
function dedupeDirectPreviews(previews: ConversationPreview[]): ConversationPreview[] {
  const channels = previews.filter((p) => p.type === "channel");
  const directBest = new Map<number, ConversationPreview>();

  for (const p of previews) {
    if (p.type === "channel" || !p.otherUser) continue;
    const oid = p.otherUser.id;
    const prev = directBest.get(oid);
    if (!prev || new Date(p.updatedAt).getTime() > new Date(prev.updatedAt).getTime()) {
      directBest.set(oid, p);
    }
  }

  return [...channels, ...directBest.values()].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );
}

export async function userIsMember(conversationId: number, userId: number): Promise<boolean> {
  const [row] = await db
    .select({ id: conversationMembers.id })
    .from(conversationMembers)
    .where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId)))
    .limit(1);
  return !!row;
}

export async function getMessages(
  conversationId: number,
  userId: number,
  limit = 50,
  beforeId?: number
): Promise<ChatMessageDto[]> {
  const member = await userIsMember(conversationId, userId);
  if (!member) return [];

  const conditions = [
    eq(chatMessages.conversationId, conversationId),
    or(eq(chatMessages.isDeleted, false), isNull(chatMessages.isDeleted)),
  ];
  if (beforeId) {
    conditions.push(sql`${chatMessages.id} < ${beforeId}`);
  }

  const rows = await db
    .select()
    .from(chatMessages)
    .where(and(...conditions))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);

  const [membership] = await db
    .select({ lastReadAt: conversationMembers.lastReadAt })
    .from(conversationMembers)
    .where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId)))
    .limit(1);

  const lastRead = membership?.lastReadAt;

  const senderIds = [...new Set(rows.map((m) => m.senderId))];
  const senderMap = new Map<number, { name: string; role: string | null }>();
  for (const sid of senderIds) {
    const u = await getMessagingUserById(sid);
    if (u) senderMap.set(sid, { name: displayName(u), role: u.role });
  }

  return rows.reverse().map((m) => {
    const sender = senderMap.get(m.senderId);
    const messageType = (m.messageType || "text") as ChatMessageDto["messageType"];
    return {
      id: m.id,
      conversationId: m.conversationId,
      senderId: m.senderId,
      senderName: sender?.name ?? null,
      senderRole: sender?.role ?? null,
      content: m.content || "",
      messageType,
      mediaUrl: m.mediaBlocked ? null : m.mediaUrl,
      mediaBlocked: m.mediaBlocked ?? false,
      editedAt: m.editedAt?.toISOString() ?? null,
      createdAt: m.createdAt.toISOString(),
      isMine: m.senderId === userId,
      isRead: lastRead ? m.createdAt <= lastRead || m.senderId === userId : m.senderId === userId,
    };
  });
}

export async function markConversationRead(conversationId: number, userId: number): Promise<void> {
  const now = new Date();
  await db
    .update(conversationMembers)
    .set({ lastReadAt: now })
    .where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId)));
}

export async function sendMessage(
  conversationId: number,
  sender: MessagingUser,
  content: string,
  options: SendMessageOptions = {}
): Promise<{ message: ChatMessageDto } | { error: string }> {
  const locale = options.locale || "fr";
  const trimmed = content.trim();
  const mediaUrl = options.mediaUrl?.trim() || "";
  const messageType = options.messageType || (mediaUrl ? "file" : "text");

  if (!trimmed && !mediaUrl) return { error: "Message vide." };
  if (trimmed.length > MAX_MESSAGE_LENGTH) return { error: "Message trop long." };
  if (mediaUrl && messageType !== "image" && messageType !== "file" && messageType !== "text") {
    return { error: "Type de message invalide." };
  }

  if (!checkRateLimit(sender.id)) return { error: "Trop de messages — patientez." };

  const member = await userIsMember(conversationId, sender.id);
  if (!member) return { error: "Accès refusé." };

  const [conv] = await db
    .select({ type: conversations.type, name: conversations.name })
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (conv?.type === "channel") {
    const slug = conv.name || "";
    if (!canUserPostInChannel(sender.role, slug)) {
      return { error: "Vous ne pouvez pas publier dans ce salon." };
    }
  }

  if (mediaUrl && !validateMediaOwnership(mediaUrl, sender.id)) {
    return { error: "Fichier non autorisé." };
  }

  const role = sender.role || "parent";
  const devMode =
    process.env.FREEGENY_DEV_AUTO_APPROVE === "true" ||
    process.env.NODE_ENV === "development";
  if (isFamilyAdult(role) && !devMode && !isWithinSchoolMessagingHours()) {
    return { error: schoolHoursBlockMessage(locale) };
  }

  const storedContent =
    trimmed || (messageType === "file" ? options.fileName || "Fichier" : messageType === "image" ? "" : "");

  const [inserted] = await db
    .insert(chatMessages)
    .values({
      conversationId,
      senderId: sender.id,
      messageType: mediaUrl ? messageType : "text",
      content: storedContent,
      mediaUrl: mediaUrl || null,
    })
    .returning();

  const now = new Date();
  await db
    .update(conversations)
    .set({ lastMessageAt: now, updatedAt: now })
    .where(eq(conversations.id, conversationId));

  await markConversationRead(conversationId, sender.id);
  setTyping(conversationId, sender.id, displayName(sender), false);

  const members = await db
    .select({ userId: conversationMembers.userId, muted: conversationMembers.muted })
    .from(conversationMembers)
    .where(and(eq(conversationMembers.conversationId, conversationId), ne(conversationMembers.userId, sender.id)));

  const preview = notificationPreview(storedContent, mediaUrl ? messageType : "text");
  const senderLabel = displayName(sender);
  const slug = conv?.name || "";
  const isBroadcast =
    !!options.broadcast &&
    conv?.type === "channel" &&
    allowBroadcastInChannel(sender.role, slug);

  for (const m of members) {
    if (m.muted && !isBroadcast) continue;
    await notifyUser({
      recipientUserId: m.userId,
      type: isBroadcast ? "alert" : "message",
      title: isBroadcast ? `📢 ${senderLabel}` : senderLabel,
      content: isBroadcast ? preview : preview,
      link: `/dashboard/messages?c=${conversationId}`,
      push: true,
    });
  }

  return {
    message: {
      id: inserted.id,
      conversationId,
      senderId: sender.id,
      content: storedContent,
      messageType: (inserted.messageType || "text") as ChatMessageDto["messageType"],
      mediaUrl: inserted.mediaUrl,
      editedAt: null,
      createdAt: inserted.createdAt.toISOString(),
      isMine: true,
      isRead: true,
    },
  };
}

export async function setConversationMuted(
  conversationId: number,
  userId: number,
  muted: boolean
): Promise<{ muted: boolean } | { error: string }> {
  if (!(await userIsMember(conversationId, userId))) return { error: "Accès refusé." };
  await db
    .update(conversationMembers)
    .set({ muted })
    .where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId)));
  return { muted };
}

export async function editMessage(
  messageId: number,
  userId: number,
  content: string
): Promise<{ message: ChatMessageDto } | { error: string }> {
  const trimmed = content.trim();
  if (!trimmed) return { error: "Message vide." };
  if (trimmed.length > MAX_MESSAGE_LENGTH) return { error: "Message trop long." };

  const [row] = await db.select().from(chatMessages).where(eq(chatMessages.id, messageId)).limit(1);
  if (!row || row.senderId !== userId) return { error: "Message introuvable." };
  if (row.isDeleted) return { error: "Message supprimé." };
  if (row.mediaUrl) return { error: "Impossible de modifier un message avec pièce jointe." };
  if (Date.now() - row.createdAt.getTime() > EDIT_WINDOW_MS) {
    return { error: "Délai de modification dépassé (15 min)." };
  }
  if (!(await userIsMember(row.conversationId, userId))) return { error: "Accès refusé." };

  const now = new Date();
  const [updated] = await db
    .update(chatMessages)
    .set({ content: trimmed, editedAt: now })
    .where(eq(chatMessages.id, messageId))
    .returning();

  return {
    message: {
      id: updated.id,
      conversationId: updated.conversationId,
      senderId: updated.senderId,
      content: trimmed,
      messageType: (updated.messageType || "text") as ChatMessageDto["messageType"],
      mediaUrl: updated.mediaUrl,
      editedAt: updated.editedAt?.toISOString() ?? null,
      createdAt: updated.createdAt.toISOString(),
      isMine: true,
      isRead: true,
    },
  };
}

export async function deleteMessage(
  messageId: number,
  userId: number
): Promise<{ ok: true } | { error: string }> {
  const [row] = await db.select().from(chatMessages).where(eq(chatMessages.id, messageId)).limit(1);
  if (!row || row.senderId !== userId) return { error: "Message introuvable." };
  if (!(await userIsMember(row.conversationId, userId))) return { error: "Accès refusé." };

  await db.update(chatMessages).set({ isDeleted: true }).where(eq(chatMessages.id, messageId));

  return { ok: true };
}

export async function getConversationPartner(conversationId: number, userId: number) {
  const [conv] = await db
    .select({ type: conversations.type, name: conversations.name })
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (conv?.type === "channel") {
    const slug = conv.name || "";
    const meta = getRoomMeta(slug, "c");
    const current = await getMessagingUserById(userId);
    const userRole = current?.role ?? null;
    const [mem] = await db
      .select({ muted: conversationMembers.muted })
      .from(conversationMembers)
      .where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId)))
      .limit(1);
    return {
      kind: "channel" as const,
      slug,
      labelKey: meta.labelKey,
      section: meta.section,
      canPost: canUserPostInChannel(userRole, slug),
      allowBroadcast: allowBroadcastInChannel(userRole, slug),
      muted: mem?.muted ?? false,
    };
  }

  const members = await db
    .select({ userId: conversationMembers.userId })
    .from(conversationMembers)
    .where(eq(conversationMembers.conversationId, conversationId));

  const otherId = members.map((m) => m.userId).find((id) => id !== userId);
  if (!otherId) return null;
  const other = await getMessagingUserById(otherId);
  const [mem] = await db
    .select({ muted: conversationMembers.muted })
    .from(conversationMembers)
    .where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId)))
    .limit(1);
  return other
    ? { kind: "direct" as const, user: toUserPreview(other), muted: mem?.muted ?? false }
    : null;
}

export { requireMessagingUser, isOnline };

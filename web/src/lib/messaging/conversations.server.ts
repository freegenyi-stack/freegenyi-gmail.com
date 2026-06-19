import { db } from "@/db";
import {
  chatMessages,
  conversationMembers,
  conversations,
  users,
} from "@/db/schema";
import { and, asc, desc, eq, gt, ilike, inArray, isNull, ne, or, sql } from "drizzle-orm";
import { isWithinSchoolMessagingHours } from "./moderation";
import { canUsersMessage } from "./permissions";
import { canContactTeacherViaProfile } from "@/lib/teacher/profile.server";
import {
  displayName,
  getMessagingUserById,
  isOnline,
  requireMessagingUser,
  toUserPreview,
  type MessagingUser,
} from "./session";
import { notifyUser, upsertMessageNotification, markMessageNotificationsRead } from "./notify";
import { setTyping } from "./typing.server";
import type { ChatMessageDto, ConversationPreview, SendMessageOptions } from "./types";
import { buildReplyPreview, rowToChatMessageDto } from "./message-mapper";
import { isFamilyAdult } from "@/lib/family/constants";
import { getRoomMeta } from "./channel-catalog";
import { provisionChannelsForUser } from "./channels.server";
import {
  allowBroadcastInChannel,
  canUserPostInChannel,
} from "./channel-permissions";
import { parseReactions, resolveMediaContent, toggleReaction } from "./media-labels";
import {
  MESSAGING_ERROR,
  messagingError,
  type MessagingErrorResult,
} from "./messaging-errors";

const MAX_MESSAGE_LENGTH = 4000;
const EDIT_WINDOW_MS = 15 * 60_000;
const RATE_WINDOW_MS = 60_000;
const RATE_MAX = 40;
const MAX_PINNED_PER_CONV = 3;
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

async function getMemberReadMap(conversationId: number): Promise<Map<number, Date | null>> {
  const rows = await db
    .select({ userId: conversationMembers.userId, lastReadAt: conversationMembers.lastReadAt })
    .from(conversationMembers)
    .where(eq(conversationMembers.conversationId, conversationId));
  return new Map(rows.map((r) => [r.userId, r.lastReadAt]));
}

function recipientLastRead(
  senderId: number,
  readMap: Map<number, Date | null>
): Date | null | undefined {
  for (const [uid, at] of readMap) {
    if (uid !== senderId) return at;
  }
  return null;
}

function mapMessageDto(
  m: typeof chatMessages.$inferSelect,
  userId: number,
  readMap: Map<number, Date | null>,
  sender?: { name: string; role: string | null } | null,
  reply?: ReturnType<typeof buildReplyPreview> | null
): ChatMessageDto {
  const viewerLastRead = readMap.get(userId);
  const partnerRead = recipientLastRead(m.senderId, readMap);
  return rowToChatMessageDto(m, userId, viewerLastRead, sender, reply, partnerRead);
}

function formatMessagePreview(msg: {
  content: string | null;
  messageType: string | null;
  mediaUrl: string | null;
}): string {
  const type = msg.messageType || "text";
  if (type === "image") return msg.content?.trim() || "📷 Image";
  if (type === "video") return msg.content?.trim() || "🎬 Vidéo";
  if (type === "voice") return msg.content?.trim() || "🎤 Vocal";
  if (type === "audio") return msg.content?.trim() || "🔊 Audio";
  if (type === "file") return msg.content?.trim() || "📎 Fichier";
  return msg.content || "";
}

function notificationPreview(text: string, messageType: string): string {
  const trimmed = text.trim();
  if (trimmed) return trimmed.length > 120 ? `${trimmed.slice(0, 117)}…` : trimmed;
  if (messageType === "image") return "📷 Image";
  if (messageType === "video") return "🎬 Vidéo";
  if (messageType === "voice") return "🎤 Message vocal";
  if (messageType === "audio") return "🔊 Audio";
  if (messageType === "file") return "📎 Fichier";
  return "Nouveau message";
}

export function validateMediaOwnership(mediaUrl: string, userId: number): boolean {
  if (!mediaUrl.startsWith("/uploads/chat/")) return false;
  const segments = mediaUrl.split("/").filter(Boolean);
  return segments[2] === String(userId);
}

async function userCanAccessMediaUrl(userId: number, mediaUrl: string): Promise<boolean> {
  const [row] = await db
    .select({ id: chatMessages.id })
    .from(chatMessages)
    .innerJoin(conversationMembers, eq(conversationMembers.conversationId, chatMessages.conversationId))
    .where(and(eq(conversationMembers.userId, userId), eq(chatMessages.mediaUrl, mediaUrl)))
    .limit(1);
  return !!row;
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
): Promise<{ conversationId: number } | MessagingErrorResult> {
  const target = await getMessagingUserById(targetUserId);
  if (!target) return messagingError(MESSAGING_ERROR.USER_NOT_FOUND);

  const perm = await canUsersMessage(current, target);
  let allowed = perm.allowed;
  let schoolId = perm.schoolId;

  if (!allowed && target.role === "enseignant") {
    if (await canContactTeacherViaProfile(current, targetUserId)) {
      allowed = true;
      schoolId = undefined;
    }
  }

  if (!allowed) return messagingError(MESSAGING_ERROR.CANNOT_CONTACT);

  const existing = await findDirectConversationBetween(current.id, targetUserId);
  if (existing) return { conversationId: existing.id };

  const dkey = directKeyFor(current.id, targetUserId);

  const [conv] = await db
    .insert(conversations)
    .values({
      type: "direct",
      directKey: dkey,
      schoolId: schoolId ?? null,
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
  const mutedMap = new Map(memberships.map((m) => [m.conversationId, m.muted ?? false]));

  const convRows = await db
    .select()
    .from(conversations)
    .where(inArray(conversations.id, convIds))
    .orderBy(desc(conversations.lastMessageAt), desc(conversations.updatedAt));

  const allRecentMessages = await db
    .select()
    .from(chatMessages)
    .where(
      and(
        inArray(chatMessages.conversationId, convIds),
        or(eq(chatMessages.isDeleted, false), isNull(chatMessages.isDeleted))
      )
    )
    .orderBy(desc(chatMessages.createdAt));

  const lastMsgMap = new Map<number, (typeof allRecentMessages)[0]>();
  for (const msg of allRecentMessages) {
    if (!lastMsgMap.has(msg.conversationId)) lastMsgMap.set(msg.conversationId, msg);
  }

  const unreadRows = await db
    .select({
      conversationId: chatMessages.conversationId,
      count: sql<number>`count(*)::int`,
    })
    .from(chatMessages)
    .innerJoin(
      conversationMembers,
      and(
        eq(conversationMembers.conversationId, chatMessages.conversationId),
        eq(conversationMembers.userId, userId)
      )
    )
    .where(
      and(
        inArray(chatMessages.conversationId, convIds),
        ne(chatMessages.senderId, userId),
        or(
          isNull(conversationMembers.lastReadAt),
          gt(chatMessages.createdAt, conversationMembers.lastReadAt)
        )
      )
    )
    .groupBy(chatMessages.conversationId);

  const unreadMap = new Map(unreadRows.map((r) => [r.conversationId, r.count]));

  const allMembers = await db
    .select({ conversationId: conversationMembers.conversationId, userId: conversationMembers.userId })
    .from(conversationMembers)
    .where(inArray(conversationMembers.conversationId, convIds));

  const membersByConv = new Map<number, number[]>();
  for (const m of allMembers) {
    const list = membersByConv.get(m.conversationId) || [];
    list.push(m.userId);
    membersByConv.set(m.conversationId, list);
  }

  const otherUserIds = new Set<number>();
  for (const conv of convRows) {
    if (conv.type === "channel") continue;
    const members = membersByConv.get(conv.id) || [];
    const otherId = members.find((id) => id !== userId);
    if (otherId) otherUserIds.add(otherId);
  }

  const lastSenderIds = new Set<number>();
  for (const msg of lastMsgMap.values()) lastSenderIds.add(msg.senderId);

  const profileIds = new Set([...otherUserIds, ...lastSenderIds]);
  const profileMap = new Map<number, MessagingUser>();
  for (const pid of profileIds) {
    const u = await getMessagingUserById(pid);
    if (u) profileMap.set(pid, u);
  }

  const previews: ConversationPreview[] = [];

  for (const conv of convRows) {
    const lastMsg = lastMsgMap.get(conv.id);
    const unreadCount = unreadMap.get(conv.id) ?? 0;

    let lastSenderName: string | null = null;
    if (lastMsg) {
      const sender = profileMap.get(lastMsg.senderId);
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
        unreadCount,
        muted: mutedMap.get(conv.id) ?? false,
        updatedAt: (conv.lastMessageAt || conv.updatedAt || conv.createdAt).toISOString(),
      });
      continue;
    }

    const members = membersByConv.get(conv.id) || [];
    const otherId = members.find((id) => id !== userId);
    if (!otherId) continue;

    const other = profileMap.get(otherId);
    if (!other) continue;

    previews.push({
      id: conv.id,
      type: conv.type || "direct",
      otherUser: toUserPreview(other),
      lastMessage,
      unreadCount,
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

  const readMap = await getMemberReadMap(conversationId);

  const senderIds = [...new Set(rows.map((m) => m.senderId))];
  const senderMap = new Map<number, { name: string; role: string | null }>();
  for (const sid of senderIds) {
    const u = await getMessagingUserById(sid);
    if (u) senderMap.set(sid, { name: displayName(u), role: u.role });
  }

  const replyIds = [...new Set(rows.map((m) => m.replyToMessageId).filter((id): id is number => !!id))];
  const replyMap = new Map<number, ReturnType<typeof buildReplyPreview>>();
  if (replyIds.length > 0) {
    const replyRows = await db.select().from(chatMessages).where(inArray(chatMessages.id, replyIds));
    for (const rr of replyRows) {
      let name = senderMap.get(rr.senderId)?.name ?? null;
      if (!name) {
        const u = await getMessagingUserById(rr.senderId);
        name = u ? displayName(u) : null;
      }
      replyMap.set(rr.id, buildReplyPreview(rr, name));
    }
  }

  return rows.reverse().map((m) =>
    mapMessageDto(
      m,
      userId,
      readMap,
      senderMap.get(m.senderId),
      m.replyToMessageId ? replyMap.get(m.replyToMessageId) ?? null : null
    )
  );
}

export async function getMessagesSince(
  conversationId: number,
  userId: number,
  sinceId: number
): Promise<ChatMessageDto[]> {
  if (!(await userIsMember(conversationId, userId))) return [];
  if (sinceId <= 0) return getMessages(conversationId, userId, 30);

  const rows = await db
    .select()
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.conversationId, conversationId),
        gt(chatMessages.id, sinceId),
        or(eq(chatMessages.isDeleted, false), isNull(chatMessages.isDeleted))
      )
    )
    .orderBy(asc(chatMessages.createdAt))
    .limit(50);

  if (rows.length === 0) return [];

  const readMap = await getMemberReadMap(conversationId);
  const senderIds = [...new Set(rows.map((m) => m.senderId))];
  const senderMap = new Map<number, { name: string; role: string | null }>();
  for (const sid of senderIds) {
    const u = await getMessagingUserById(sid);
    if (u) senderMap.set(sid, { name: displayName(u), role: u.role });
  }

  return rows.map((m) => mapMessageDto(m, userId, readMap, senderMap.get(m.senderId), null));
}

export async function markConversationRead(conversationId: number, userId: number): Promise<void> {
  const now = new Date();
  await db
    .update(conversationMembers)
    .set({ lastReadAt: now })
    .where(and(eq(conversationMembers.conversationId, conversationId), eq(conversationMembers.userId, userId)));

  await markMessageNotificationsRead(userId, `/dashboard/messages?c=${conversationId}`);
}

export async function sendMessage(
  conversationId: number,
  sender: MessagingUser,
  content: string,
  options: SendMessageOptions = {}
): Promise<{ message: ChatMessageDto } | MessagingErrorResult> {
  const locale = options.locale || "fr";
  const trimmed = content.trim();
  const mediaUrl = options.mediaUrl?.trim() || "";
  const messageType = options.messageType || (mediaUrl ? "file" : "text");

  if (!trimmed && !mediaUrl) return messagingError(MESSAGING_ERROR.EMPTY_MESSAGE);
  if (trimmed.length > MAX_MESSAGE_LENGTH) return messagingError(MESSAGING_ERROR.MESSAGE_TOO_LONG);
  if (mediaUrl && messageType !== "image" && messageType !== "file" && messageType !== "video" && messageType !== "audio" && messageType !== "voice" && messageType !== "text") {
    return messagingError(MESSAGING_ERROR.INVALID_MESSAGE_TYPE);
  }

  if (!checkRateLimit(sender.id)) return messagingError(MESSAGING_ERROR.RATE_LIMITED);

  const member = await userIsMember(conversationId, sender.id);
  if (!member) return messagingError(MESSAGING_ERROR.ACCESS_DENIED);

  const [conv] = await db
    .select({ type: conversations.type, name: conversations.name })
    .from(conversations)
    .where(eq(conversations.id, conversationId))
    .limit(1);

  if (conv?.type === "channel") {
    const slug = conv.name || "";
    if (!canUserPostInChannel(sender.role, slug)) {
      return messagingError(MESSAGING_ERROR.CANNOT_POST_CHANNEL);
    }
  }

  if (mediaUrl && !validateMediaOwnership(mediaUrl, sender.id)) {
    if (!(await userCanAccessMediaUrl(sender.id, mediaUrl))) {
      return messagingError(MESSAGING_ERROR.FILE_NOT_ALLOWED);
    }
  }

  const role = sender.role || "parent";
  const devMode =
    process.env.FREEGENY_DEV_AUTO_APPROVE === "true" ||
    process.env.NODE_ENV === "development";
  if (isFamilyAdult(role) && !devMode && !isWithinSchoolMessagingHours()) {
    return messagingError(MESSAGING_ERROR.SCHOOL_HOURS_BLOCKED);
  }

  let replyToMessageId: number | null = null;
  if (options.replyToMessageId) {
    const [replyRow] = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.id, options.replyToMessageId))
      .limit(1);
    if (!replyRow || replyRow.conversationId !== conversationId || replyRow.isDeleted) {
      return messagingError(MESSAGING_ERROR.REPLY_NOT_FOUND);
    }
    replyToMessageId = replyRow.id;
  }

  const storedContent = mediaUrl
    ? resolveMediaContent(trimmed, messageType, options.fileName, locale)
    : trimmed;

  const [inserted] = await db
    .insert(chatMessages)
    .values({
      conversationId,
      senderId: sender.id,
      messageType: mediaUrl ? messageType : "text",
      content: storedContent,
      mediaUrl: mediaUrl || null,
      replyToMessageId,
    })
    .returning();

  const now = new Date();
  await db
    .update(conversations)
    .set({ lastMessageAt: now, updatedAt: now })
    .where(eq(conversations.id, conversationId));

  await markConversationRead(conversationId, sender.id);
  await setTyping(conversationId, sender.id, displayName(sender), false);

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
    const link = `/dashboard/messages?c=${conversationId}`;
    if (isBroadcast) {
      await notifyUser({
        recipientUserId: m.userId,
        type: "alert",
        title: `📢 ${senderLabel}`,
        content: preview,
        link,
        push: true,
      });
    } else {
      await upsertMessageNotification({
        recipientUserId: m.userId,
        title: senderLabel,
        content: preview,
        link,
      });
    }
  }

  const senderInfo = { name: displayName(sender), role: sender.role };
  let replyPreview = null;
  if (replyToMessageId) {
    const [replyRow] = await db.select().from(chatMessages).where(eq(chatMessages.id, replyToMessageId)).limit(1);
    if (replyRow) {
      const ru = await getMessagingUserById(replyRow.senderId);
      replyPreview = buildReplyPreview(replyRow, ru ? displayName(ru) : null);
    }
  }

  const readMap = await getMemberReadMap(conversationId);

  return {
    message: mapMessageDto(inserted, sender.id, readMap, senderInfo, replyPreview),
  };
}

export async function setConversationMuted(
  conversationId: number,
  userId: number,
  muted: boolean
): Promise<{ muted: boolean } | MessagingErrorResult> {
  if (!(await userIsMember(conversationId, userId))) return messagingError(MESSAGING_ERROR.ACCESS_DENIED);
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
): Promise<{ message: ChatMessageDto } | MessagingErrorResult> {
  const trimmed = content.trim();
  if (!trimmed) return messagingError(MESSAGING_ERROR.EMPTY_MESSAGE);
  if (trimmed.length > MAX_MESSAGE_LENGTH) return messagingError(MESSAGING_ERROR.MESSAGE_TOO_LONG);

  const [row] = await db.select().from(chatMessages).where(eq(chatMessages.id, messageId)).limit(1);
  if (!row || row.senderId !== userId) return messagingError(MESSAGING_ERROR.MESSAGE_NOT_FOUND);
  if (row.isDeleted) return messagingError(MESSAGING_ERROR.MESSAGE_DELETED);
  if (row.mediaUrl) return messagingError(MESSAGING_ERROR.CANNOT_EDIT_ATTACHMENT);
  if (Date.now() - row.createdAt.getTime() > EDIT_WINDOW_MS) {
    return messagingError(MESSAGING_ERROR.EDIT_WINDOW_EXPIRED);
  }
  if (!(await userIsMember(row.conversationId, userId))) return messagingError(MESSAGING_ERROR.ACCESS_DENIED);

  const now = new Date();
  const [updated] = await db
    .update(chatMessages)
    .set({ content: trimmed, editedAt: now })
    .where(eq(chatMessages.id, messageId))
    .returning();

  const readMap = await getMemberReadMap(row.conversationId);
  const sender = await getMessagingUserById(userId);

  return {
    message: mapMessageDto(
      updated,
      userId,
      readMap,
      sender ? { name: displayName(sender), role: sender.role } : null,
      null
    ),
  };
}

export async function getPinnedMessages(
  conversationId: number,
  userId: number
): Promise<ChatMessageDto[]> {
  if (!(await userIsMember(conversationId, userId))) return [];

  const rows = await db
    .select()
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.conversationId, conversationId),
        sql`${chatMessages.pinnedAt} IS NOT NULL`,
        or(eq(chatMessages.isDeleted, false), isNull(chatMessages.isDeleted))
      )
    )
    .orderBy(desc(chatMessages.pinnedAt))
    .limit(MAX_PINNED_PER_CONV);

  const readMap = await getMemberReadMap(conversationId);

  const senderIds = [...new Set(rows.map((m) => m.senderId))];
  const senderMap = new Map<number, { name: string; role: string | null }>();
  for (const sid of senderIds) {
    const u = await getMessagingUserById(sid);
    if (u) senderMap.set(sid, { name: displayName(u), role: u.role });
  }

  return rows.map((m) => mapMessageDto(m, userId, readMap, senderMap.get(m.senderId), null));
}

export async function searchConversationMessages(
  conversationId: number,
  userId: number,
  query: string,
  limit = 40
): Promise<ChatMessageDto[]> {
  if (!(await userIsMember(conversationId, userId))) return [];
  const q = query.trim();
  if (q.length < 2) return [];

  const rows = await db
    .select()
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.conversationId, conversationId),
        or(eq(chatMessages.isDeleted, false), isNull(chatMessages.isDeleted)),
        ilike(chatMessages.content, `%${q}%`)
      )
    )
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);

  const readMap = await getMemberReadMap(conversationId);

  const senderIds = [...new Set(rows.map((m) => m.senderId))];
  const senderMap = new Map<number, { name: string; role: string | null }>();
  for (const sid of senderIds) {
    const u = await getMessagingUserById(sid);
    if (u) senderMap.set(sid, { name: displayName(u), role: u.role });
  }

  return rows.reverse().map((m) => mapMessageDto(m, userId, readMap, senderMap.get(m.senderId), null));
}

export async function pinMessage(
  messageId: number,
  userId: number
): Promise<{ pinned: boolean } | MessagingErrorResult> {
  const [row] = await db.select().from(chatMessages).where(eq(chatMessages.id, messageId)).limit(1);
  if (!row || row.isDeleted) return messagingError(MESSAGING_ERROR.MESSAGE_NOT_FOUND);
  if (!(await userIsMember(row.conversationId, userId))) return messagingError(MESSAGING_ERROR.ACCESS_DENIED);

  const [conv] = await db
    .select({ type: conversations.type, name: conversations.name })
    .from(conversations)
    .where(eq(conversations.id, row.conversationId))
    .limit(1);

  const user = await getMessagingUserById(userId);
  if (conv?.type === "channel") {
    if (!canUserPostInChannel(user?.role ?? null, conv.name || "")) {
      return messagingError(MESSAGING_ERROR.CANNOT_PIN_CHANNEL);
    }
  }

  if (row.pinnedAt) return { pinned: true };

  const pinned = await db
    .select({ id: chatMessages.id })
    .from(chatMessages)
    .where(
      and(
        eq(chatMessages.conversationId, row.conversationId),
        sql`${chatMessages.pinnedAt} IS NOT NULL`
      )
    )
    .orderBy(asc(chatMessages.pinnedAt));

  if (pinned.length >= MAX_PINNED_PER_CONV) {
    await db
      .update(chatMessages)
      .set({ pinnedAt: null })
      .where(eq(chatMessages.id, pinned[0].id));
  }

  await db.update(chatMessages).set({ pinnedAt: new Date() }).where(eq(chatMessages.id, messageId));
  return { pinned: true };
}

export async function unpinMessage(
  messageId: number,
  userId: number
): Promise<{ pinned: false } | MessagingErrorResult> {
  const [row] = await db.select().from(chatMessages).where(eq(chatMessages.id, messageId)).limit(1);
  if (!row) return messagingError(MESSAGING_ERROR.MESSAGE_NOT_FOUND);
  if (!(await userIsMember(row.conversationId, userId))) return messagingError(MESSAGING_ERROR.ACCESS_DENIED);

  const [conv] = await db
    .select({ type: conversations.type, name: conversations.name })
    .from(conversations)
    .where(eq(conversations.id, row.conversationId))
    .limit(1);

  const user = await getMessagingUserById(userId);
  if (conv?.type === "channel") {
    if (!canUserPostInChannel(user?.role ?? null, conv.name || "")) {
      return messagingError(MESSAGING_ERROR.CANNOT_PIN_CHANNEL);
    }
  }

  await db.update(chatMessages).set({ pinnedAt: null }).where(eq(chatMessages.id, messageId));
  return { pinned: false };
}

export async function touchLastSeen(userId: number): Promise<void> {
  await db.update(users).set({ lastSeenAt: new Date(), updatedAt: new Date() }).where(eq(users.id, userId));
}

export async function deleteMessage(
  messageId: number,
  userId: number
): Promise<{ ok: true } | MessagingErrorResult> {
  const [row] = await db.select().from(chatMessages).where(eq(chatMessages.id, messageId)).limit(1);
  if (!row || row.senderId !== userId) return messagingError(MESSAGING_ERROR.MESSAGE_NOT_FOUND);
  if (!(await userIsMember(row.conversationId, userId))) return messagingError(MESSAGING_ERROR.ACCESS_DENIED);

  await db.update(chatMessages).set({ isDeleted: true }).where(eq(chatMessages.id, messageId));

  return { ok: true };
}

export async function toggleMessageReaction(
  messageId: number,
  userId: number,
  emoji: string
): Promise<{ reactions: Record<string, number[]> } | MessagingErrorResult> {
  const safe = emoji.trim().slice(0, 8);
  if (!safe) return messagingError(MESSAGING_ERROR.INVALID_REACTION);

  const [row] = await db.select().from(chatMessages).where(eq(chatMessages.id, messageId)).limit(1);
  if (!row || row.isDeleted) return messagingError(MESSAGING_ERROR.MESSAGE_NOT_FOUND);
  if (!(await userIsMember(row.conversationId, userId))) return messagingError(MESSAGING_ERROR.ACCESS_DENIED);

  const next = toggleReaction(parseReactions(row.reactions), safe, userId);
  await db
    .update(chatMessages)
    .set({ reactions: JSON.stringify(next) })
    .where(eq(chatMessages.id, messageId));

  return { reactions: next };
}

export async function forwardMessage(
  sourceMessageId: number,
  targetConversationId: number,
  user: MessagingUser,
  locale = "fr"
): Promise<{ message: ChatMessageDto } | MessagingErrorResult> {
  const [source] = await db.select().from(chatMessages).where(eq(chatMessages.id, sourceMessageId)).limit(1);
  if (!source || source.isDeleted || source.isHidden) return messagingError(MESSAGING_ERROR.MESSAGE_NOT_FOUND);
  if (!(await userIsMember(source.conversationId, user.id))) return messagingError(MESSAGING_ERROR.ACCESS_DENIED);
  if (!(await userIsMember(targetConversationId, user.id))) return messagingError(MESSAGING_ERROR.ACCESS_DENIED);

  if (source.mediaUrl) {
    return sendMessage(targetConversationId, user, source.content || "", {
      mediaUrl: source.mediaUrl,
      messageType: (source.messageType || "file") as SendMessageOptions["messageType"],
      locale,
    });
  }

  const text = source.content?.trim();
  if (!text) return messagingError(MESSAGING_ERROR.EMPTY_MESSAGE);

  const prefix = locale.startsWith("ar") ? "↪ " : "↪ ";
  return sendMessage(targetConversationId, user, `${prefix}${text}`, { locale });
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

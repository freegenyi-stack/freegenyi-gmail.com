import { db } from "@/db";
import { chatMessages, conversations } from "@/db/schema";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import { getSchoolIdForUser } from "./channels.server";
import { displayName, getMessagingUserById, type MessagingUser } from "./session";

export type ModeratedMediaItem = {
  messageId: number;
  conversationId: number;
  senderId: number;
  senderName: string;
  messageType: string | null;
  mediaUrl: string | null;
  content: string | null;
  mediaBlocked: boolean;
  createdAt: string;
  conversationLabel: string;
};

export async function listMediaForSchoolModerator(
  user: MessagingUser,
  limit = 40
): Promise<ModeratedMediaItem[]> {
  if (user.role !== "ecole") return [];

  const schoolId = await getSchoolIdForUser(user);
  if (!schoolId) return [];

  const rows = await db
    .select({
      id: chatMessages.id,
      conversationId: chatMessages.conversationId,
      senderId: chatMessages.senderId,
      messageType: chatMessages.messageType,
      mediaUrl: chatMessages.mediaUrl,
      content: chatMessages.content,
      mediaBlocked: chatMessages.mediaBlocked,
      createdAt: chatMessages.createdAt,
      convType: conversations.type,
      convName: conversations.name,
      convSchoolId: conversations.schoolId,
    })
    .from(chatMessages)
    .innerJoin(conversations, eq(conversations.id, chatMessages.conversationId))
    .where(and(isNotNull(chatMessages.mediaUrl), eq(conversations.schoolId, schoolId)))
    .orderBy(desc(chatMessages.createdAt))
    .limit(limit);

  const out: ModeratedMediaItem[] = [];

  for (const row of rows) {
    const sender = await getMessagingUserById(row.senderId);
    out.push({
      messageId: row.id,
      conversationId: row.conversationId,
      senderId: row.senderId,
      senderName: sender ? displayName(sender) : "?",
      messageType: row.messageType,
      mediaUrl: row.mediaUrl,
      content: row.content,
      mediaBlocked: row.mediaBlocked ?? false,
      createdAt: row.createdAt.toISOString(),
      conversationLabel: row.convName || row.convType || "conversation",
    });
  }

  return out;
}

export async function blockChatMedia(
  messageId: number,
  moderator: MessagingUser
): Promise<{ ok: true } | { error: string }> {
  if (moderator.role !== "ecole") return { error: "Accès refusé." };

  const schoolId = await getSchoolIdForUser(moderator);
  if (!schoolId) return { error: "École introuvable." };

  const [row] = await db
    .select({
      id: chatMessages.id,
      convSchoolId: conversations.schoolId,
    })
    .from(chatMessages)
    .innerJoin(conversations, eq(conversations.id, chatMessages.conversationId))
    .where(eq(chatMessages.id, messageId))
    .limit(1);

  if (!row) return { error: "Message introuvable." };
  if (row.convSchoolId !== schoolId) return { error: "Hors périmètre école." };

  await db
    .update(chatMessages)
    .set({
      mediaBlocked: true,
      moderatedAt: new Date(),
      moderatedBy: moderator.id,
    })
    .where(eq(chatMessages.id, messageId));

  return { ok: true };
}

export async function unblockChatMedia(
  messageId: number,
  moderator: MessagingUser
): Promise<{ ok: true } | { error: string }> {
  if (moderator.role !== "ecole") return { error: "Accès refusé." };

  const schoolId = await getSchoolIdForUser(moderator);
  if (!schoolId) return { error: "École introuvable." };

  const [row] = await db
    .select({ id: chatMessages.id, convSchoolId: conversations.schoolId })
    .from(chatMessages)
    .innerJoin(conversations, eq(conversations.id, chatMessages.conversationId))
    .where(eq(chatMessages.id, messageId))
    .limit(1);

  if (!row || row.convSchoolId !== schoolId) return { error: "Message introuvable." };

  await db
    .update(chatMessages)
    .set({ mediaBlocked: false, moderatedAt: new Date(), moderatedBy: moderator.id })
    .where(eq(chatMessages.id, messageId));

  return { ok: true };
}

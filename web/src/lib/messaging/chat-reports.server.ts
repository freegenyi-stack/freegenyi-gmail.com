import { db } from "@/db";
import { chatMessageReports, chatMessages, conversationMembers } from "@/db/schema";
import { and, eq, sql } from "drizzle-orm";
import { userIsMember } from "./conversations.server";
import { MESSAGING_ERROR, messagingError, type MessagingErrorResult } from "./messaging-errors";

const AUTO_HIDE_REPORTS = 3;

export async function reportChatMessage(
  messageId: number,
  reporterId: number
): Promise<{ ok: true; reportCount: number; autoHidden: boolean } | MessagingErrorResult> {
  const [row] = await db.select().from(chatMessages).where(eq(chatMessages.id, messageId)).limit(1);
  if (!row || row.isDeleted) return messagingError(MESSAGING_ERROR.MESSAGE_NOT_FOUND);
  if (row.senderId === reporterId) return messagingError(MESSAGING_ERROR.CANNOT_REPORT_OWN);
  if (!(await userIsMember(row.conversationId, reporterId))) {
    return messagingError(MESSAGING_ERROR.ACCESS_DENIED);
  }

  const inserted = await db
    .insert(chatMessageReports)
    .values({ messageId, reporterId })
    .onConflictDoNothing()
    .returning({ id: chatMessageReports.id });

  if (inserted.length === 0) return messagingError(MESSAGING_ERROR.ALREADY_REPORTED);

  const [updated] = await db
    .update(chatMessages)
    .set({ reportCount: sql`${chatMessages.reportCount} + 1` })
    .where(eq(chatMessages.id, messageId))
    .returning({ reportCount: chatMessages.reportCount });

  const reportCount = updated?.reportCount ?? row.reportCount + 1;
  let autoHidden = false;
  if (reportCount >= AUTO_HIDE_REPORTS && !row.isHidden) {
    await db.update(chatMessages).set({ isHidden: true }).where(eq(chatMessages.id, messageId));
    autoHidden = true;
  }

  return { ok: true, reportCount, autoHidden };
}

export async function setChatMessageHidden(
  messageId: number,
  hidden: boolean,
  moderatorId?: number
): Promise<{ ok: true } | MessagingErrorResult> {
  const [row] = await db.select({ id: chatMessages.id }).from(chatMessages).where(eq(chatMessages.id, messageId)).limit(1);
  if (!row) return messagingError(MESSAGING_ERROR.MESSAGE_NOT_FOUND);

  await db
    .update(chatMessages)
    .set({
      isHidden: hidden,
      moderatedAt: new Date(),
      moderatedBy: moderatorId ?? null,
    })
    .where(eq(chatMessages.id, messageId));

  return { ok: true };
}

export async function userCanAccessChatMedia(userId: number, publicPath: string): Promise<boolean> {
  if (!publicPath.startsWith("/uploads/chat/")) return false;
  const [row] = await db
    .select({ id: chatMessages.id })
    .from(chatMessages)
    .innerJoin(conversationMembers, eq(conversationMembers.conversationId, chatMessages.conversationId))
    .where(and(eq(conversationMembers.userId, userId), eq(chatMessages.mediaUrl, publicPath)))
    .limit(1);
  return !!row;
}

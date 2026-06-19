import type { chatMessages } from "@/db/schema";
import type { ChatMessageDto, ChatMessageType, ReplyPreview } from "./types";
import { parseReactions } from "./media-labels";
import { defaultMediaLabel } from "./media-labels";
import { deletedReplyLabel, hiddenReplyLabel } from "./reply-labels";

type MessageRow = typeof chatMessages.$inferSelect;

export function buildReplyPreview(
  row: MessageRow | undefined,
  senderName: string | null,
  locale = "fr"
): ReplyPreview | null {
  if (!row) return null;
  if (row.isDeleted) {
    return {
      id: row.id,
      senderName,
      content: deletedReplyLabel(locale),
      messageType: (row.messageType || "text") as ChatMessageType,
      mediaUrl: null,
      isDeleted: true,
    };
  }
  if (row.isHidden) {
    return {
      id: row.id,
      senderName,
      content: hiddenReplyLabel(locale),
      messageType: (row.messageType || "text") as ChatMessageType,
      mediaUrl: null,
      isDeleted: true,
    };
  }
  return {
    id: row.id,
    senderName,
    content: row.content || "",
    messageType: (row.messageType || "text") as ChatMessageType,
    mediaUrl: row.mediaBlocked ? null : row.mediaUrl,
    isDeleted: false,
  };
}

export function rowToChatMessageDto(
  m: MessageRow,
  userId: number,
  viewerLastRead: Date | null | undefined,
  sender?: { name: string; role: string | null } | null,
  reply?: ReplyPreview | null,
  recipientLastRead?: Date | null | undefined
): ChatMessageDto {
  const messageType = (m.messageType || "text") as ChatMessageDto["messageType"];
  const isMine = m.senderId === userId;
  const isRead = isMine
    ? !!recipientLastRead && m.createdAt <= recipientLastRead
    : !!viewerLastRead && m.createdAt <= viewerLastRead;

  return {
    id: m.id,
    conversationId: m.conversationId,
    senderId: m.senderId,
    senderName: sender?.name ?? null,
    senderRole: sender?.role ?? null,
    content: m.isHidden ? "" : m.content || "",
    messageType,
    mediaUrl: m.mediaBlocked || m.isHidden ? null : m.mediaUrl,
    mediaBlocked: m.mediaBlocked ?? false,
    editedAt: m.editedAt?.toISOString() ?? null,
    reactions: parseReactions(m.reactions),
    replyTo: reply ?? null,
    pinnedAt: m.pinnedAt?.toISOString() ?? null,
    createdAt: m.createdAt.toISOString(),
    isMine,
    isRead,
    isHidden: m.isHidden ?? false,
  };
}

export function replyPreviewLabel(
  reply: ReplyPreview,
  locale: string,
  mediaLabelFn?: (content: string, url: string | null | undefined, type?: ChatMessageType) => string
): string {
  if (reply.isDeleted) return deletedReplyLabel(locale);
  if (reply.mediaUrl && reply.messageType && reply.messageType !== "text") {
    const label = mediaLabelFn
      ? mediaLabelFn(reply.content, reply.mediaUrl, reply.messageType)
      : defaultMediaLabel(reply.messageType, locale);
    return label;
  }
  const text = reply.content.trim();
  return text.length > 80 ? `${text.slice(0, 80)}…` : text;
}

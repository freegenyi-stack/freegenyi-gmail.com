import { NextRequest, NextResponse } from "next/server";
import {
  getConversationPartner,
  getMessages,
  getPinnedMessages,
  markConversationRead,
  requireMessagingUser,
  sendMessage,
  touchLastSeen,
  userIsMember,
} from "@/lib/messaging/conversations.server";
import {
  MESSAGING_ERROR,
  messagingAccessHttpStatus,
  messagingError,
} from "@/lib/messaging/messaging-errors";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) {
    const err = messagingError(MESSAGING_ERROR.UNAUTHORIZED);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) {
    const err = messagingError(MESSAGING_ERROR.INVALID_ID);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  if (!(await userIsMember(conversationId, user.id))) {
    const err = messagingError(MESSAGING_ERROR.ACCESS_DENIED);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  await touchLastSeen(user.id);

  const before = req.nextUrl.searchParams.get("before");
  const beforeId = before ? parseInt(before, 10) : undefined;
  const messages = await getMessages(conversationId, user.id, 50, beforeId);
  const pinned = await getPinnedMessages(conversationId, user.id);
  const partner = await getConversationPartner(conversationId, user.id);

  await markConversationRead(conversationId, user.id);

  return NextResponse.json({ messages, pinned, partner });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) {
    const err = messagingError(MESSAGING_ERROR.UNAUTHORIZED);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) {
    const err = messagingError(MESSAGING_ERROR.INVALID_ID);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  const body = await req.json().catch(() => ({}));
  const content = String(body.content || "");
  const locale = String(body.locale || "fr");
  const mediaUrl = body.mediaUrl ? String(body.mediaUrl) : undefined;
  const messageType = body.messageType ? String(body.messageType) : undefined;
  const fileName = body.fileName ? String(body.fileName) : undefined;
  const broadcast = body.broadcast === true;
  const replyToMessageId = body.replyToMessageId ? parseInt(String(body.replyToMessageId), 10) : undefined;

  const result = await sendMessage(conversationId, user, content, {
    locale,
    mediaUrl,
    messageType: messageType as "text" | "image" | "file" | undefined,
    fileName,
    broadcast,
    replyToMessageId: Number.isNaN(replyToMessageId) ? undefined : replyToMessageId,
  });
  if ("error" in result) {
    return NextResponse.json(result, { status: messagingAccessHttpStatus(result.code) });
  }

  await touchLastSeen(user.id);
  return NextResponse.json({ message: result.message });
}

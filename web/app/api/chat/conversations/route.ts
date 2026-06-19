import { NextRequest, NextResponse } from "next/server";
import {
  findOrCreateDirectConversation,
  listConversationsForUser,
  requireMessagingUser,
} from "@/lib/messaging/conversations.server";
import {
  MESSAGING_ERROR,
  messagingAccessHttpStatus,
  messagingError,
} from "@/lib/messaging/messaging-errors";

export async function GET() {
  const user = await requireMessagingUser();
  if (!user) {
    const err = messagingError(MESSAGING_ERROR.UNAUTHORIZED);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  const conversations = await listConversationsForUser(user.id);
  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) {
    const err = messagingError(MESSAGING_ERROR.UNAUTHORIZED);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  const body = await req.json().catch(() => ({}));
  const targetUserId = parseInt(String(body.targetUserId), 10);
  if (Number.isNaN(targetUserId)) {
    const err = messagingError(MESSAGING_ERROR.INVALID_USER);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  const result = await findOrCreateDirectConversation(user, targetUserId);
  if ("error" in result) {
    return NextResponse.json(result, { status: messagingAccessHttpStatus(result.code) });
  }

  return NextResponse.json({ conversationId: result.conversationId });
}

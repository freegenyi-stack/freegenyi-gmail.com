import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";
import { reportChatMessage } from "@/lib/messaging/chat-reports.server";
import {
  MESSAGING_ERROR,
  messagingAccessHttpStatus,
  messagingError,
} from "@/lib/messaging/messaging-errors";

type Ctx = { params: Promise<{ id: string; messageId: string }> };

export async function POST(_req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) {
    const err = messagingError(MESSAGING_ERROR.UNAUTHORIZED);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  const { messageId: rawId } = await ctx.params;
  const messageId = parseInt(rawId, 10);
  if (Number.isNaN(messageId)) {
    const err = messagingError(MESSAGING_ERROR.INVALID_ID);
    return NextResponse.json(err, { status: messagingAccessHttpStatus(err.code) });
  }

  const result = await reportChatMessage(messageId, user.id);
  if ("error" in result) {
    return NextResponse.json(result, { status: messagingAccessHttpStatus(result.code) });
  }

  return NextResponse.json(result);
}

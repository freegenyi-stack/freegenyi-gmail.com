import { NextRequest, NextResponse } from "next/server";
import { forwardMessage, requireMessagingUser } from "@/lib/messaging/conversations.server";
import { MESSAGING_ERROR } from "@/lib/messaging/messaging-errors";
import {
  messagingInvalidId,
  messagingJsonError,
  messagingResultError,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const { id } = await ctx.params;
  const sourceConversationId = parseInt(id, 10);
  if (Number.isNaN(sourceConversationId)) return messagingInvalidId();

  const body = await req.json().catch(() => ({}));
  const messageId = parseInt(String(body.messageId), 10);
  const targetConversationId = parseInt(String(body.targetConversationId), 10);
  const locale = String(body.locale || "fr");
  if (Number.isNaN(messageId) || Number.isNaN(targetConversationId)) {
    return messagingJsonError(MESSAGING_ERROR.INVALID_ID);
  }

  const result = await forwardMessage(messageId, targetConversationId, user, locale);
  if ("error" in result) return messagingResultError(result);

  return NextResponse.json({ message: result.message });
}

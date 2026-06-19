import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser, setConversationMuted } from "@/lib/messaging/conversations.server";
import {
  messagingInvalidId,
  messagingResultError,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) return messagingInvalidId();

  const body = await req.json().catch(() => ({}));
  const muted = body.muted === true;

  const result = await setConversationMuted(conversationId, user.id, muted);
  if ("error" in result) return messagingResultError(result);

  return NextResponse.json(result);
}

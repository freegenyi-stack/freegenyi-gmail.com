import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser, toggleMessageReaction } from "@/lib/messaging/conversations.server";
import {
  messagingInvalidId,
  messagingResultError,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

type Ctx = { params: Promise<{ id: string; messageId: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const { messageId } = await ctx.params;
  const mid = parseInt(messageId, 10);
  if (Number.isNaN(mid)) return messagingInvalidId();

  const body = await req.json().catch(() => ({}));
  const emoji = String(body.emoji || "");
  const result = await toggleMessageReaction(mid, user.id, emoji);
  if ("error" in result) return messagingResultError(result);

  return NextResponse.json(result);
}

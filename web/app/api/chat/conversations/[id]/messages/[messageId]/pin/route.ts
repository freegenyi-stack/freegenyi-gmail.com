import { NextRequest, NextResponse } from "next/server";
import { pinMessage, requireMessagingUser, unpinMessage } from "@/lib/messaging/conversations.server";
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
  const pin = body.pin !== false;

  const result = pin ? await pinMessage(mid, user.id) : await unpinMessage(mid, user.id);
  if ("error" in result) return messagingResultError(result);

  return NextResponse.json(result);
}

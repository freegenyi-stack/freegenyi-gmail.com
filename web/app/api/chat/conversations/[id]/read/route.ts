import { NextResponse } from "next/server";
import { markConversationRead, requireMessagingUser, userIsMember } from "@/lib/messaging/conversations.server";
import {
  messagingAccessDenied,
  messagingInvalidId,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(_req: Request, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) return messagingInvalidId();

  if (!(await userIsMember(conversationId, user.id))) {
    return messagingAccessDenied();
  }

  await markConversationRead(conversationId, user.id);
  return NextResponse.json({ ok: true });
}

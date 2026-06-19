import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser, userIsMember } from "@/lib/messaging/conversations.server";
import { displayName } from "@/lib/messaging/session";
import { setTyping } from "@/lib/messaging/typing.server";
import {
  messagingAccessDenied,
  messagingInvalidId,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) return messagingInvalidId();

  if (!(await userIsMember(conversationId, user.id))) {
    return messagingAccessDenied();
  }

  const body = await req.json().catch(() => ({}));
  const active = body.active !== false;

  await setTyping(conversationId, user.id, displayName(user), active);
  return NextResponse.json({ ok: true });
}

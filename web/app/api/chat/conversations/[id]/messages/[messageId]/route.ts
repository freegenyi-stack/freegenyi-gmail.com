import { NextRequest, NextResponse } from "next/server";
import { deleteMessage, editMessage, requireMessagingUser } from "@/lib/messaging/conversations.server";
import {
  messagingInvalidId,
  messagingResultError,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

type Ctx = { params: Promise<{ id: string; messageId: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const { messageId } = await ctx.params;
  const mid = parseInt(messageId, 10);
  if (Number.isNaN(mid)) return messagingInvalidId();

  const body = await req.json().catch(() => ({}));
  const content = String(body.content || "");

  const result = await editMessage(mid, user.id, content);
  if ("error" in result) return messagingResultError(result);

  return NextResponse.json({ message: result.message });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const { messageId } = await ctx.params;
  const mid = parseInt(messageId, 10);
  if (Number.isNaN(mid)) return messagingInvalidId();

  const result = await deleteMessage(mid, user.id);
  if ("error" in result) return messagingResultError(result);

  return NextResponse.json({ ok: true });
}

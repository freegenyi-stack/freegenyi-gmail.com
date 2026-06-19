import { NextRequest, NextResponse } from "next/server";
import {
  requireMessagingUser,
  searchConversationMessages,
  userIsMember,
} from "@/lib/messaging/conversations.server";
import {
  messagingAccessDenied,
  messagingInvalidId,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) return messagingInvalidId();

  if (!(await userIsMember(conversationId, user.id))) {
    return messagingAccessDenied();
  }

  const q = req.nextUrl.searchParams.get("q") || "";
  const results = await searchConversationMessages(conversationId, user.id, q);
  return NextResponse.json({ results });
}

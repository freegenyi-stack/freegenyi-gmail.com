import { NextResponse } from "next/server";
import { markConversationRead, requireMessagingUser, userIsMember } from "@/lib/messaging/conversations.server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(_req: Request, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  if (!(await userIsMember(conversationId, user.id))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  await markConversationRead(conversationId, user.id);
  return NextResponse.json({ ok: true });
}

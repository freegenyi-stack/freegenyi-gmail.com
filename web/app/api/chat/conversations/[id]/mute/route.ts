import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser, setConversationMuted } from "@/lib/messaging/conversations.server";

type Ctx = { params: Promise<{ id: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const muted = body.muted === true;

  const result = await setConversationMuted(conversationId, user.id, muted);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json(result);
}

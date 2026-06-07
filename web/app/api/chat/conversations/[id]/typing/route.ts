import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser, userIsMember } from "@/lib/messaging/conversations.server";
import { displayName } from "@/lib/messaging/session";
import { setTyping } from "@/lib/messaging/typing.server";

type Ctx = { params: Promise<{ id: string }> };

export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  if (!(await userIsMember(conversationId, user.id))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const body = await req.json().catch(() => ({}));
  const active = body.active !== false;

  setTyping(conversationId, user.id, displayName(user), active);
  return NextResponse.json({ ok: true });
}

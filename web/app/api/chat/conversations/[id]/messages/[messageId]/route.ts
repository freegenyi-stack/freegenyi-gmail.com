import { NextRequest, NextResponse } from "next/server";
import { deleteMessage, editMessage, requireMessagingUser } from "@/lib/messaging/conversations.server";

type Ctx = { params: Promise<{ id: string; messageId: string }> };

export async function PATCH(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { messageId } = await ctx.params;
  const mid = parseInt(messageId, 10);
  if (Number.isNaN(mid)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const content = String(body.content || "");

  const result = await editMessage(mid, user.id, content);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ message: result.message });
}

export async function DELETE(_req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { messageId } = await ctx.params;
  const mid = parseInt(messageId, 10);
  if (Number.isNaN(mid)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const result = await deleteMessage(mid, user.id);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ ok: true });
}

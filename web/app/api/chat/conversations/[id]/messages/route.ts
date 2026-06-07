import { NextRequest, NextResponse } from "next/server";
import {
  getConversationPartner,
  getMessages,
  markConversationRead,
  requireMessagingUser,
  sendMessage,
  userIsMember,
} from "@/lib/messaging/conversations.server";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  if (!(await userIsMember(conversationId, user.id))) {
    return NextResponse.json({ error: "Accès refusé" }, { status: 403 });
  }

  const before = req.nextUrl.searchParams.get("before");
  const beforeId = before ? parseInt(before, 10) : undefined;
  const messages = await getMessages(conversationId, user.id, 50, beforeId);
  const partner = await getConversationPartner(conversationId, user.id);

  await markConversationRead(conversationId, user.id);

  return NextResponse.json({ messages, partner });
}

export async function POST(req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const { id } = await ctx.params;
  const conversationId = parseInt(id, 10);
  if (Number.isNaN(conversationId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const body = await req.json().catch(() => ({}));
  const content = String(body.content || "");
  const locale = String(body.locale || "fr");
  const mediaUrl = body.mediaUrl ? String(body.mediaUrl) : undefined;
  const messageType = body.messageType ? String(body.messageType) : undefined;
  const fileName = body.fileName ? String(body.fileName) : undefined;
  const broadcast = body.broadcast === true;

  const result = await sendMessage(conversationId, user, content, {
    locale,
    mediaUrl,
    messageType: messageType as "text" | "image" | "file" | undefined,
    fileName,
    broadcast,
  });
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });

  return NextResponse.json({ message: result.message });
}

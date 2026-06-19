import { NextResponse } from "next/server";
import { getMobileMessagingUser } from "@/lib/mobile/messaging-auth";
import { getMessages, sendMessage } from "@/lib/messaging/conversations.server";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getMobileMessagingUser(request);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id: idStr } = await params;
  const conversationId = parseInt(idStr, 10);
  if (Number.isNaN(conversationId)) {
    return NextResponse.json({ error: "invalid_conversation" }, { status: 400 });
  }

  const before = new URL(request.url).searchParams.get("before");
  const beforeId = before ? parseInt(before, 10) : undefined;
  const messages = await getMessages(conversationId, user.id, 50, beforeId);
  return NextResponse.json({ messages: messages.reverse() });
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const user = await getMobileMessagingUser(request);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const { id: idStr } = await params;
  const conversationId = parseInt(idStr, 10);
  if (Number.isNaN(conversationId)) {
    return NextResponse.json({ error: "invalid_conversation" }, { status: 400 });
  }

  const body = (await request.json()) as { content?: string; locale?: "fr" | "ar" };
  const content = body.content?.trim() ?? "";
  if (!content) {
    return NextResponse.json({ error: "empty_message" }, { status: 400 });
  }

  const result = await sendMessage(conversationId, user, content, { locale: body.locale ?? "fr" });

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ message: result.message });
}

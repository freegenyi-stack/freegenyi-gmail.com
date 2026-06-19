import { NextResponse } from "next/server";
import { getMobileMessagingUser } from "@/lib/mobile/messaging-auth";
import {
  findOrCreateDirectConversation,
  listConversationsForUser,
} from "@/lib/messaging/conversations.server";

export async function GET(request: Request) {
  const user = await getMobileMessagingUser(request);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const conversations = await listConversationsForUser(user.id);
  return NextResponse.json({ conversations });
}

export async function POST(request: Request) {
  const user = await getMobileMessagingUser(request);
  if (!user) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = (await request.json()) as { targetUserId?: number };
  const targetUserId = parseInt(String(body.targetUserId), 10);
  if (Number.isNaN(targetUserId)) {
    return NextResponse.json({ error: "invalid_user" }, { status: 400 });
  }

  const result = await findOrCreateDirectConversation(user, targetUserId);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }

  return NextResponse.json({ conversationId: result.conversationId });
}

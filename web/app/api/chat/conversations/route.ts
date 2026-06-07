import { NextRequest, NextResponse } from "next/server";
import {
  findOrCreateDirectConversation,
  listConversationsForUser,
  requireMessagingUser,
} from "@/lib/messaging/conversations.server";

export async function GET() {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const conversations = await listConversationsForUser(user.id);
  return NextResponse.json({ conversations });
}

export async function POST(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const targetUserId = parseInt(String(body.targetUserId), 10);
  if (Number.isNaN(targetUserId)) {
    return NextResponse.json({ error: "Utilisateur invalide" }, { status: 400 });
  }

  const result = await findOrCreateDirectConversation(user, targetUserId);
  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 403 });

  return NextResponse.json({ conversationId: result.conversationId });
}

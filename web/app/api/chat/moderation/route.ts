import { NextRequest, NextResponse } from "next/server";
import {
  blockChatMedia,
  listMediaForSchoolModerator,
  unblockChatMedia,
} from "@/lib/messaging/media-moderation.server";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";

export async function GET() {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (user.role !== "ecole") return NextResponse.json({ error: "Accès refusé" }, { status: 403 });

  const items = await listMediaForSchoolModerator(user);
  return NextResponse.json({ items });
}

export async function PATCH(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const messageId = parseInt(String(body.messageId), 10);
  const action = String(body.action || "block");

  if (Number.isNaN(messageId)) return NextResponse.json({ error: "ID invalide" }, { status: 400 });

  const result =
    action === "unblock" ? await unblockChatMedia(messageId, user) : await blockChatMedia(messageId, user);

  if ("error" in result) return NextResponse.json({ error: result.error }, { status: 400 });
  return NextResponse.json(result);
}

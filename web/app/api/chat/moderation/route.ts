import { NextRequest, NextResponse } from "next/server";
import {
  blockChatMedia,
  listMediaForSchoolModerator,
  unblockChatMedia,
} from "@/lib/messaging/media-moderation.server";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";
import {
  messagingAccessDenied,
  messagingInvalidId,
  messagingResultError,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

export async function GET() {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();
  if (user.role !== "ecole") return messagingAccessDenied();

  const items = await listMediaForSchoolModerator(user);
  return NextResponse.json({ items });
}

export async function PATCH(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const body = await req.json().catch(() => ({}));
  const messageId = parseInt(String(body.messageId), 10);
  const action = String(body.action || "block");

  if (Number.isNaN(messageId)) return messagingInvalidId();

  const result =
    action === "unblock" ? await unblockChatMedia(messageId, user) : await blockChatMedia(messageId, user);

  if ("error" in result) return messagingResultError(result);
  return NextResponse.json(result);
}

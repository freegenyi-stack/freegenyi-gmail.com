import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";
import { sendContactInvite } from "@/lib/messaging/users.server";
import { MESSAGING_ERROR } from "@/lib/messaging/messaging-errors";
import {
  messagingJsonError,
  messagingResultError,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

export async function POST(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const body = await req.json().catch(() => ({}));
  const targetUserId = parseInt(String(body.targetUserId), 10);
  const locale = String(body.locale || "fr");
  if (Number.isNaN(targetUserId)) {
    return messagingJsonError(MESSAGING_ERROR.INVALID_USER);
  }

  const result = await sendContactInvite(user, targetUserId, locale);
  if ("error" in result) return messagingResultError(result);

  return NextResponse.json({ ok: true });
}

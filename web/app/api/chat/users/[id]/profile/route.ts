import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";
import { getMessagingUserProfile } from "@/lib/messaging/users.server";
import { MESSAGING_ERROR } from "@/lib/messaging/messaging-errors";
import {
  messagingInvalidId,
  messagingJsonError,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

type Ctx = { params: Promise<{ id: string }> };

export async function GET(_req: NextRequest, ctx: Ctx) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const { id } = await ctx.params;
  const targetId = parseInt(id, 10);
  if (Number.isNaN(targetId)) return messagingInvalidId();

  const profile = await getMessagingUserProfile(user, targetId);
  if (!profile) return messagingJsonError(MESSAGING_ERROR.USER_NOT_FOUND);

  return NextResponse.json({ profile });
}

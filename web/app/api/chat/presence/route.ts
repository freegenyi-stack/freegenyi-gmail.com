import { NextResponse } from "next/server";
import { requireMessagingUser, touchLastSeen } from "@/lib/messaging/conversations.server";
import { messagingUnauthorized } from "@/lib/messaging/api-response";

export async function POST() {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();
  await touchLastSeen(user.id);
  return NextResponse.json({ ok: true });
}

export async function GET() {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();
  await touchLastSeen(user.id);
  return NextResponse.json({ ok: true, lastSeenAt: new Date().toISOString() });
}

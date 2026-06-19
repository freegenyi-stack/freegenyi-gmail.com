import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";
import { searchMessagingUsers } from "@/lib/messaging/users.server";
import { messagingUnauthorized } from "@/lib/messaging/api-response";

export async function GET(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const q = req.nextUrl.searchParams.get("q") || "";
  const results = await searchMessagingUsers(user, q);
  return NextResponse.json({ results });
}

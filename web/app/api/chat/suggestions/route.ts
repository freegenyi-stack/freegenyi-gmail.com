import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";
import { dismissSuggestion, dismissSuggestionsForTarget, listSuggestions } from "@/lib/messaging/suggestions.server";
import {
  messagingInvalidId,
  messagingUnauthorized,
} from "@/lib/messaging/api-response";

export async function GET(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const locale = req.nextUrl.searchParams.get("locale") || "fr";
  const suggestions = await listSuggestions(user, locale);
  return NextResponse.json({ suggestions });
}

export async function POST(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  const body = await req.json().catch(() => ({}));
  const targetUserId = parseInt(String(body.targetUserId), 10);
  if (!Number.isNaN(targetUserId)) {
    await dismissSuggestionsForTarget(user.id, targetUserId);
    return NextResponse.json({ ok: true });
  }

  const suggestionId = parseInt(String(body.suggestionId), 10);
  if (Number.isNaN(suggestionId)) return messagingInvalidId();

  await dismissSuggestion(user.id, suggestionId);
  return NextResponse.json({ ok: true });
}

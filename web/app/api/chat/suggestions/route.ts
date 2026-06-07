import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";
import { dismissSuggestion, listSuggestions } from "@/lib/messaging/suggestions.server";

export async function GET(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const locale = req.nextUrl.searchParams.get("locale") || "fr";
  const suggestions = await listSuggestions(user, locale);
  return NextResponse.json({ suggestions });
}

export async function POST(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const body = await req.json().catch(() => ({}));
  const suggestionId = parseInt(String(body.suggestionId), 10);
  if (Number.isNaN(suggestionId)) {
    return NextResponse.json({ error: "ID invalide" }, { status: 400 });
  }

  await dismissSuggestion(user.id, suggestionId);
  return NextResponse.json({ ok: true });
}

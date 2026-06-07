import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";
import { saveChatMedia } from "@/lib/messaging/chat-media.server";

export async function POST(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return NextResponse.json({ error: "Fichier manquant." }, { status: 400 });

    const saved = await saveChatMedia(user.id, file);
    return NextResponse.json(saved);
  } catch (e) {
    const msg = e instanceof Error ? e.message : "Envoi impossible.";
    return NextResponse.json({ error: msg }, { status: 400 });
  }
}

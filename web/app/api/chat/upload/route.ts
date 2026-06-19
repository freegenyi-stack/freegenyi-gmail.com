import { NextRequest, NextResponse } from "next/server";
import { requireMessagingUser } from "@/lib/messaging/conversations.server";
import { saveChatMedia } from "@/lib/messaging/chat-media.server";
import { MESSAGING_ERROR } from "@/lib/messaging/messaging-errors";
import { messagingJsonError, messagingUnauthorized } from "@/lib/messaging/api-response";

export async function POST(req: NextRequest) {
  const user = await requireMessagingUser();
  if (!user) return messagingUnauthorized();

  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    if (!file) return messagingJsonError(MESSAGING_ERROR.FILE_REQUIRED);

    const voice = formData.get("voice") === "true";
    const saved = await saveChatMedia(user.id, file, { voice });
    return NextResponse.json(saved);
  } catch {
    return messagingJsonError(MESSAGING_ERROR.UPLOAD_FAILED);
  }
}

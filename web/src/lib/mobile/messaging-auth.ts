import { decodeMobileToken } from "@/lib/mobile/tokens";
import { getMessagingUserById } from "@/lib/messaging/session";
import { isMessagingRole } from "@/lib/messaging/messaging-policy";
import type { MessagingUser } from "@/lib/messaging/session";

export async function getMobileMessagingUser(request: Request): Promise<MessagingUser | null> {
  const payload = decodeMobileToken(request.headers.get("authorization"));
  if (!payload || payload.typ !== "parent") return null;

  const user = await getMessagingUserById(payload.userId);
  if (!user || !isMessagingRole(user.role)) return null;
  return user;
}

import { db } from "@/db";
import { notifications, pushSubscriptions } from "@/db/schema";
import { eq, and, sql } from "drizzle-orm";
import { buildAppBaseUrl } from "@/lib/email/send";
import { getVapidContactEmail, isPushConfigured } from "@/lib/messaging/push-config";

export type NotificationType = "message" | "family" | "achievement" | "system" | "alert" | "suggestion";

export type NotifyUserPayload = {
  recipientUserId: number;
  type: NotificationType;
  title: string;
  content: string;
  /** Chemin relatif avec locale, ex. /fr/dashboard/parent */
  link?: string;
  locale?: string;
  push?: boolean;
};

export type MessageNotificationPayload = {
  recipientUserId: number;
  title: string;
  content: string;
  link: string;
  roomId?: string;
  senderName?: string;
};

export function buildNotificationUrl(path: string, locale?: string): string {
  const base = buildAppBaseUrl();
  if (path.startsWith("http")) return path;
  const normalized = path.startsWith("/") ? path : `/${path}`;
  if (normalized.match(/^\/[a-z]{2}(-[a-z]{2})?\//i)) {
    return `${base}${normalized}`;
  }
  const prefix = locale ? `/${locale}` : "";
  return `${base}${prefix}${normalized}`;
}

/** Notification in-app + Web Push (si abonné et VAPID configuré). */
export async function notifyUser(payload: NotifyUserPayload): Promise<void> {
  const link = payload.link
    ? buildNotificationUrl(payload.link, payload.locale)
    : buildNotificationUrl("/dashboard/parent", payload.locale);

  await db.insert(notifications).values({
    userId: payload.recipientUserId,
    type: payload.type,
    title: payload.title,
    content: payload.content,
    link: payload.link || "/dashboard/parent",
    isRead: false,
  });

  if (payload.push !== false) {
    await sendWebPushToUser(payload.recipientUserId, {
      title: payload.title,
      body: payload.content,
      url: link,
    });
  }
}

/** @deprecated Préférer notifyUser */
export async function createMessageNotification(payload: MessageNotificationPayload): Promise<void> {
  await notifyUser({
    recipientUserId: payload.recipientUserId,
    type: "message",
    title: payload.title,
    content: payload.content,
    link: payload.link,
  });
}

export async function getUnreadNotificationCount(userId: number): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return row?.count ?? 0;
}

function isExpiredSubscriptionError(error: unknown): boolean {
  if (!error || typeof error !== "object") return false;
  const status = (error as { statusCode?: number }).statusCode;
  return status === 410 || status === 404;
}

/** Envoie une Web Push si l'utilisateur est abonné (VAPID configuré). */
export async function sendWebPushToUser(
  userId: number,
  payload: { title: string; body: string; url: string }
): Promise<{ sent: number; failed: number }> {
  if (!isPushConfigured()) return { sent: 0, failed: 0 };

  const publicKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
  const privateKey = process.env.VAPID_PRIVATE_KEY!;

  try {
    const webpush = await import("web-push");
    webpush.setVapidDetails(`mailto:${getVapidContactEmail()}`, publicKey, privateKey);

    const subs = await db.select().from(pushSubscriptions).where(eq(pushSubscriptions.userId, userId));
    if (subs.length === 0) return { sent: 0, failed: 0 };

    let sent = 0;
    let failed = 0;

    await Promise.all(
      subs.map(async (sub) => {
        try {
          await webpush.sendNotification(
            {
              endpoint: sub.endpoint,
              keys: { p256dh: sub.p256dh, auth: sub.auth },
            },
            JSON.stringify({
              title: payload.title,
              body: payload.body,
              url: payload.url,
              icon: "/assets/img/logo.png",
            })
          );
          sent++;
        } catch (e) {
          failed++;
          if (isExpiredSubscriptionError(e)) {
            await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
          } else {
            console.warn("Web push failed for user", userId, e);
          }
        }
      })
    );

    return { sent, failed };
  } catch (e) {
    console.warn("Web push module unavailable:", e);
    return { sent: 0, failed: 0 };
  }
}

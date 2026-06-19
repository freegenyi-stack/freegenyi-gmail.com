import { db } from "@/db";
import { notifications, pushSubscriptions, chatMessages, conversationMembers, users } from "@/db/schema";
import { eq, and, sql, ne, gt, or, isNull } from "drizzle-orm";
import { buildAppBaseUrl } from "@/lib/email/send";
import { getVapidContactEmail, isPushConfigured } from "@/lib/messaging/push-config";
import { teacherPushAllowed, type TeacherPushCategory } from "@/lib/teacher/profile-complete";
import { userNewsPushAllowed } from "@/lib/news/preferences";
import { parseParentPreferences } from "@/lib/parent/parent-settings";
import {
  formatMessageNotificationContent,
  parseMessageNotificationCount,
  MESSAGE_COUNT_MARKER,
} from "./notify-utils";

export type NotifyUserPayload = {
  recipientUserId: number;
  type: NotificationType;
  title: string;
  content: string;
  /** Chemin relatif avec locale, ex. /fr/dashboard/parent */
  link?: string;
  locale?: string;
  push?: boolean;
  /** Filtre push enseignant (mur, messages, …) */
  pushCategory?: TeacherPushCategory;
};

export type MessageNotificationPayload = {
  recipientUserId: number;
  title: string;
  content: string;
  link: string;
  roomId?: string;
  senderName?: string;
};

export type NotificationType = "message" | "family" | "achievement" | "system" | "alert" | "suggestion";

function pushCategoryForType(type: NotificationType): TeacherPushCategory {
  if (type === "message" || type === "suggestion") return "messages";
  if (type === "achievement") return "news";
  return "news";
}

async function shouldSendPushToUser(userId: number, category: TeacherPushCategory): Promise<boolean> {
  const [user] = await db
    .select({ role: users.role, metadata: users.metadata })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);
  if (!user) return false;
  if (user.role === "parent" || user.role === "coparent") {
    const prefs = parseParentPreferences(user.metadata);
    if (category === "digest") return prefs.weeklyReport || prefs.missionAlerts;
    if (category === "news") return userNewsPushAllowed(user.metadata, user.role, "news");
    return false;
  }
  if (category === "news" || category === "digest") {
    return userNewsPushAllowed(user.metadata, user.role, category);
  }
  return teacherPushAllowed(user.metadata, user.role, category);
}

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
    const category = payload.pushCategory ?? pushCategoryForType(payload.type);
    if (await shouldSendPushToUser(payload.recipientUserId, category)) {
      await sendWebPushToUser(payload.recipientUserId, {
        title: payload.title,
        body: payload.content,
        url: link,
      });
    }
  }
}

/**
 * Une seule notification non lue par fil de conversation.
 * Incrémente le compteur [fg:N] au lieu de créer N lignes.
 */
export async function upsertMessageNotification(payload: MessageNotificationPayload): Promise<void> {
  const link = payload.link;
  const preview = payload.content;

  const [existing] = await db
    .select()
    .from(notifications)
    .where(
      and(
        eq(notifications.userId, payload.recipientUserId),
        eq(notifications.type, "message"),
        eq(notifications.link, link),
        eq(notifications.isRead, false)
      )
    )
    .limit(1);

  if (existing) {
    const nextCount = parseMessageNotificationCount(existing.content) + 1;
    await db
      .update(notifications)
      .set({
        title: payload.title,
        content: formatMessageNotificationContent(nextCount, preview),
        createdAt: new Date(),
      })
      .where(eq(notifications.id, existing.id));

    if (await shouldSendPushToUser(payload.recipientUserId, "messages")) {
      await sendWebPushToUser(payload.recipientUserId, {
        title: payload.title,
        body: formatMessageNotificationContent(nextCount, preview),
        url: buildNotificationUrl(link),
      });
    }
    return;
  }

  await db.insert(notifications).values({
    userId: payload.recipientUserId,
    type: "message",
    title: payload.title,
    content: formatMessageNotificationContent(1, preview),
    link,
    isRead: false,
  });

  if (await shouldSendPushToUser(payload.recipientUserId, "messages")) {
    await sendWebPushToUser(payload.recipientUserId, {
      title: payload.title,
      body: preview,
      url: buildNotificationUrl(link),
    });
  }
}

/** Marque lues les notifications message liées à une conversation. */
export async function markMessageNotificationsRead(userId: number, conversationLink: string): Promise<void> {
  await db
    .update(notifications)
    .set({ isRead: true })
    .where(
      and(
        eq(notifications.userId, userId),
        eq(notifications.type, "message"),
        eq(notifications.link, conversationLink),
        eq(notifications.isRead, false)
      )
    );
}

/** @deprecated Préférer notifyUser */
export async function createMessageNotification(payload: MessageNotificationPayload): Promise<void> {
  await upsertMessageNotification(payload);
}

export async function getUnreadNotificationCount(userId: number): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(notifications)
    .where(and(eq(notifications.userId, userId), eq(notifications.isRead, false)));
  return row?.count ?? 0;
}

/** Messages non lus dans tous les fils (hors messages envoyés par l'utilisateur). */
export async function getTotalUnreadMessageCount(userId: number): Promise<number> {
  const [row] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(chatMessages)
    .innerJoin(conversationMembers, eq(conversationMembers.conversationId, chatMessages.conversationId))
    .where(
      and(
        eq(conversationMembers.userId, userId),
        ne(chatMessages.senderId, userId),
        or(
          isNull(conversationMembers.lastReadAt),
          gt(chatMessages.createdAt, conversationMembers.lastReadAt)
        )
      )
    );
  return row?.count ?? 0;
}

/** Badge header = messages non lus + autres notifications non lues (hors doublons message). */
export async function getNotificationBadgeCount(userId: number): Promise<number> {
  const [messagesUnread, otherUnread] = await Promise.all([
    getTotalUnreadMessageCount(userId),
    db
      .select({ count: sql<number>`count(*)::int` })
      .from(notifications)
      .where(
        and(
          eq(notifications.userId, userId),
          eq(notifications.isRead, false),
          ne(notifications.type, "message")
        )
      )
      .then(([r]) => r?.count ?? 0),
  ]);
  return messagesUnread + otherUnread;
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
              body: payload.body.replace(MESSAGE_COUNT_MARKER, ""),
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

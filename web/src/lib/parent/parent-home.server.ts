import { listConversationsForUser } from "@/lib/messaging/conversations.server";
import { getTotalUnreadMessageCount } from "@/lib/messaging/notify";
import { listNewsForUser } from "@/lib/news/articles.server";
import { getChildScreenTimeMinutes, getPendingWorksheetsForChild } from "@/lib/parent/parent-worksheets.server";
import type { ParentChildInsights } from "@/lib/parent/dashboard-insights.server";
import type {
  ParentHomeExtras,
  ParentHomeMessagePreview,
  ParentHomeNewsPreview,
  ParentHomeChildToday,
} from "@/lib/parent/parent-home.types";

export type {
  ParentHomeExtras,
  ParentHomeMessagePreview,
  ParentHomeNewsPreview,
  ParentHomeChildToday,
} from "@/lib/parent/parent-home.types";

function conversationPreview(
  conv: Awaited<ReturnType<typeof listConversationsForUser>>[number]
): string {
  const msg = conv.lastMessage;
  if (!msg?.content) return "—";
  const text = msg.content.trim();
  return text.length > 72 ? `${text.slice(0, 72)}…` : text;
}

export async function getParentHomeExtras(
  userId: number,
  childrenInsights: ParentChildInsights[]
): Promise<ParentHomeExtras> {
  const [conversations, totalUnreadMessages, newsRows, ...childExtras] = await Promise.all([
    listConversationsForUser(userId),
    getTotalUnreadMessageCount(userId),
    listNewsForUser(userId, { limit: 2 }),
    ...childrenInsights.map(async (child) => {
      const [genyRows, screenMinutesToday] = await Promise.all([
        getPendingWorksheetsForChild(child.childId, 10),
        getChildScreenTimeMinutes(child.childId),
      ]);
      return {
        childId: child.childId,
        pendingMissions: child.stats.pendingMissions,
        pendingGeny: genyRows.length,
        screenMinutesToday,
        dailyScreenLimit: child.dailyScreenMinutes,
        readingStreakDays: child.readingStats.readingStreakDays,
      } satisfies ParentHomeChildToday;
    }),
  ]);

  const messagePreviews: ParentHomeMessagePreview[] = conversations.slice(0, 3).map((c) => ({
    id: c.id,
    labelKey: c.channelMeta?.labelKey ?? null,
    otherUserName: c.otherUser?.fullName ?? null,
    preview: conversationPreview(c),
    unreadCount: c.unreadCount,
    updatedAt: c.updatedAt,
  }));

  const newsPreviews: ParentHomeNewsPreview[] = newsRows.map((n) => ({
    id: n.id,
    titleFr: n.titleFr,
    titleAr: n.titleAr,
    excerptFr: n.excerptFr,
    excerptAr: n.excerptAr,
    publishedAt: n.publishedAt,
    unread: n.unread,
  }));

  return {
    messagePreviews,
    totalUnreadMessages,
    newsPreviews,
    childrenToday: childExtras,
  };
}

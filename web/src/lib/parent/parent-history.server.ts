import { db } from "@/db";
import { activityLogs, authoringProgress, authoringResources, authoringAssignments, libraryReadingSessions } from "@/db/schema";
import { and, desc, eq, gt, inArray, sql } from "drizzle-orm";
import type { DailyActivityPoint } from "@/lib/parent/parent-progress.server";

export type UnifiedHistoryItem = {
  id: string;
  source: "child" | "account";
  type: "mission" | "reading" | "boost" | "auth" | "course" | "exercise" | "search" | "other";
  title: string;
  detail?: string;
  childName?: string;
  date: Date;
};

export async function getUnifiedParentHistory(
  parentUserId: number,
  childIds: number[],
  childNames: Record<number, string>,
  limit = 60
): Promise<UnifiedHistoryItem[]> {
  const items: UnifiedHistoryItem[] = [];

  const [accountLogs, missions, sessions, boosts] = await Promise.all([
    db
      .select()
      .from(activityLogs)
      .where(eq(activityLogs.userId, parentUserId))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit),
    childIds.length
      ? db
          .select({
            childId: authoringProgress.childId,
            status: authoringProgress.status,
            title: authoringResources.title,
            updatedAt: authoringProgress.updatedAt,
          })
          .from(authoringProgress)
          .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
          .innerJoin(authoringResources, eq(authoringAssignments.resourceId, authoringResources.id))
          .where(inArray(authoringProgress.childId, childIds))
          .orderBy(desc(authoringProgress.updatedAt))
          .limit(limit)
      : Promise.resolve([]),
    childIds.length
      ? db
          .select({
            childId: libraryReadingSessions.childId,
            pagesDelta: libraryReadingSessions.pagesDelta,
            startedAt: libraryReadingSessions.startedAt,
          })
          .from(libraryReadingSessions)
          .where(inArray(libraryReadingSessions.childId, childIds))
          .orderBy(desc(libraryReadingSessions.startedAt))
          .limit(limit)
      : Promise.resolve([]),
    db
      .select()
      .from(activityLogs)
      .where(and(eq(activityLogs.userId, parentUserId), eq(activityLogs.category, "boost")))
      .orderBy(desc(activityLogs.createdAt))
      .limit(limit),
  ]);

  for (const log of accountLogs) {
    if (log.category === "boost") continue;
    const type =
      log.category === "parent_worksheet"
        ? "exercise"
        : log.category === "auth"
          ? "auth"
          : log.category === "course"
            ? "course"
            : log.category === "exercise"
              ? "exercise"
              : log.category === "search"
                ? "search"
                : log.category === "child_session"
                  ? "other"
                  : "other";
    let detail: string | undefined;
    let childName: string | undefined;
    if (log.category === "parent_worksheet" && log.metadata) {
      try {
        const meta = JSON.parse(log.metadata) as { childName?: string; status?: string; sets?: unknown[] };
        childName = meta.childName;
        detail =
          meta.status === "done"
            ? "Geny · terminé"
            : `Geny · ${meta.sets?.length ?? 0} exercice(s)`;
      } catch {
        /* ignore */
      }
    }
    items.push({
      id: `log-${log.id}`,
      source: log.category === "parent_worksheet" ? "child" : "account",
      type,
      title: log.action,
      detail,
      childName,
      date: log.createdAt,
    });
  }

  for (const m of missions) {
    items.push({
      id: `mission-${m.childId}-${m.updatedAt.getTime()}`,
      source: "child",
      type: "mission",
      title: m.title,
      detail: m.status === "done" ? "Terminée" : m.status === "in_progress" ? "En cours" : "À faire",
      childName: childNames[m.childId],
      date: m.updatedAt,
    });
  }

  for (const s of sessions) {
    if (!s.childId) continue;
    items.push({
      id: `read-${s.childId}-${s.startedAt.getTime()}`,
      source: "child",
      type: "reading",
      title: `${s.pagesDelta} pages lues`,
      childName: childNames[s.childId],
      date: s.startedAt,
    });
  }

  for (const b of boosts) {
    let childId: number | undefined;
    let message = b.action;
    try {
      const meta = JSON.parse(b.metadata || "{}") as { childId?: number; message?: string };
      childId = meta.childId;
      if (meta.message) message = meta.message;
    } catch {
      /* ignore */
    }
    items.push({
      id: `boost-${b.id}`,
      source: "child",
      type: "boost",
      title: message,
      detail: "Boost émotionnel",
      childName: childId ? childNames[childId] : undefined,
      date: b.createdAt,
    });
  }

  return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}

export async function getFamilyDailyActivity(childIds: number[], days = 30): Promise<DailyActivityPoint[]> {
  if (childIds.length === 0) return [];

  const [readingRows, exerciseRows] = await Promise.all([
    db
      .select({
        day: sql<string>`date_trunc('day', ${libraryReadingSessions.startedAt})::date::text`,
        pages: sql<number>`coalesce(sum(${libraryReadingSessions.pagesDelta}), 0)::int`,
      })
      .from(libraryReadingSessions)
      .where(
        and(
          inArray(libraryReadingSessions.childId, childIds),
          gt(libraryReadingSessions.startedAt, sql`NOW() - (${days} || ' days')::interval`)
        )
      )
      .groupBy(sql`date_trunc('day', ${libraryReadingSessions.startedAt})`),
    db
      .select({
        day: sql<string>`date_trunc('day', ${authoringProgress.updatedAt})::date::text`,
        count: sql<number>`count(*)::int`,
      })
      .from(authoringProgress)
      .where(
        and(
          inArray(authoringProgress.childId, childIds),
          eq(authoringProgress.status, "done"),
          gt(authoringProgress.updatedAt, sql`NOW() - (${days} || ' days')::interval`)
        )
      )
      .groupBy(sql`date_trunc('day', ${authoringProgress.updatedAt})`),
  ]);

  const map = new Map<string, DailyActivityPoint>();
  for (const r of readingRows) {
    const existing = map.get(r.day) ?? { date: r.day, readingPages: 0, exercisesDone: 0 };
    existing.readingPages += r.pages;
    map.set(r.day, existing);
  }
  for (const r of exerciseRows) {
    const existing = map.get(r.day) ?? { date: r.day, readingPages: 0, exercisesDone: 0 };
    existing.exercisesDone += r.count;
    map.set(r.day, existing);
  }
  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}

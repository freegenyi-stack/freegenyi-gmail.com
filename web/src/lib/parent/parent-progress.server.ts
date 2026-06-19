import { db } from "@/db";
import { authoringProgress, libraryReadingSessions } from "@/db/schema";
import { and, eq, gt, sql } from "drizzle-orm";

export type DailyActivityPoint = {
  date: string;
  readingPages: number;
  exercisesDone: number;
};

export async function getChildDailyActivity(childId: number, days = 30): Promise<DailyActivityPoint[]> {
  const [readingRows, exerciseRows] = await Promise.all([
    db
      .select({
        day: sql<string>`date_trunc('day', ${libraryReadingSessions.startedAt})::date::text`,
        pages: sql<number>`coalesce(sum(${libraryReadingSessions.pagesDelta}), 0)::int`,
      })
      .from(libraryReadingSessions)
      .where(
        and(
          eq(libraryReadingSessions.childId, childId),
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
          eq(authoringProgress.childId, childId),
          eq(authoringProgress.status, "done"),
          gt(authoringProgress.updatedAt, sql`NOW() - (${days} || ' days')::interval`)
        )
      )
      .groupBy(sql`date_trunc('day', ${authoringProgress.updatedAt})`),
  ]);

  const map = new Map<string, DailyActivityPoint>();

  for (const r of readingRows) {
    const existing = map.get(r.day) ?? { date: r.day, readingPages: 0, exercisesDone: 0 };
    existing.readingPages = r.pages;
    map.set(r.day, existing);
  }

  for (const r of exerciseRows) {
    const existing = map.get(r.day) ?? { date: r.day, readingPages: 0, exercisesDone: 0 };
    existing.exercisesDone = r.count;
    map.set(r.day, existing);
  }

  return [...map.values()].sort((a, b) => a.date.localeCompare(b.date));
}

export type FamilyWeeklyMomentum = {
  readingPages: number;
  missionsDone: number;
  score: number;
};

export async function getFamilyWeeklyMomentum(childIds: number[]): Promise<FamilyWeeklyMomentum> {
  if (childIds.length === 0) return { readingPages: 0, missionsDone: 0, score: 0 };

  const dailyArrays = await Promise.all(childIds.map((id) => getChildDailyActivity(id, 7)));
  let readingPages = 0;
  let missionsDone = 0;

  for (const daily of dailyArrays) {
    for (const point of daily) {
      readingPages += point.readingPages;
      missionsDone += point.exercisesDone;
    }
  }

  return {
    readingPages,
    missionsDone,
    score: readingPages * 3 + missionsDone * 40,
  };
}

export type ParentActivityLog = {
  id: number;
  category: string;
  action: string;
  createdAt: Date;
};

export async function getChildRecentActivity(childId: number, limit = 20): Promise<
  { type: "mission" | "reading"; title: string; status?: string; date: Date }[]
> {
  const [missions, sessions] = await Promise.all([
    db
      .select({
        status: authoringProgress.status,
        updatedAt: authoringProgress.updatedAt,
      })
      .from(authoringProgress)
      .where(eq(authoringProgress.childId, childId))
      .orderBy(sql`${authoringProgress.updatedAt} DESC`)
      .limit(limit),
    db
      .select({
        pagesDelta: libraryReadingSessions.pagesDelta,
        startedAt: libraryReadingSessions.startedAt,
      })
      .from(libraryReadingSessions)
      .where(eq(libraryReadingSessions.childId, childId))
      .orderBy(sql`${libraryReadingSessions.startedAt} DESC`)
      .limit(limit),
  ]);

  const items: { type: "mission" | "reading"; title: string; status?: string; date: Date }[] = [
    ...missions.map((m) => ({
      type: "mission" as const,
      title: m.status === "done" ? "Mission terminée" : "Mission en cours",
      status: m.status,
      date: m.updatedAt,
    })),
    ...sessions.map((s) => ({
      type: "reading" as const,
      title: `${s.pagesDelta} pages lues`,
      date: s.startedAt,
    })),
  ];

  return items.sort((a, b) => b.date.getTime() - a.date.getTime()).slice(0, limit);
}

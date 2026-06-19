import { db } from "@/db";
import { libraryReadingBadges, libraryReadingProgress, libraryUserProgress } from "@/db/schema";
import type { UserReadingStats } from "@/lib/library/user-library.server";
import type { LibraryBadgeKey } from "@/lib/library/badge-labels";
import { and, eq, sql } from "drizzle-orm";
import { computeReadingStreakFromDayKeys, dayKeyFromDate } from "@/lib/library/reading-streak.server";

const BADGE_RULES: { key: LibraryBadgeKey; test: (s: UserReadingStats) => boolean }[] = [
  { key: "first_book", test: (s) => s.booksFinished >= 1 },
  { key: "reader_3", test: (s) => s.booksFinished >= 3 },
  { key: "reader_5", test: (s) => s.booksFinished >= 5 },
  { key: "pages_100", test: (s) => s.totalPagesRead >= 100 },
  { key: "pages_500", test: (s) => s.totalPagesRead >= 500 },
];

export async function listUserBadges(userId: number) {
  return db
    .select()
    .from(libraryReadingBadges)
    .where(eq(libraryReadingBadges.userId, userId))
    .orderBy(sql`${libraryReadingBadges.earnedAt} DESC`);
}

export async function listChildBadges(childId: number) {
  return db
    .select()
    .from(libraryReadingBadges)
    .where(eq(libraryReadingBadges.childId, childId))
    .orderBy(sql`${libraryReadingBadges.earnedAt} DESC`);
}

async function hasBadge(userId: number | null, childId: number | null, key: string) {
  const conditions = [eq(libraryReadingBadges.badgeKey, key)];
  if (userId) conditions.push(eq(libraryReadingBadges.userId, userId));
  if (childId) conditions.push(eq(libraryReadingBadges.childId, childId));
  const [row] = await db
    .select({ id: libraryReadingBadges.id })
    .from(libraryReadingBadges)
    .where(and(...conditions))
    .limit(1);
  return !!row;
}

export async function awardReadingBadges(input: {
  userId?: number | null;
  childId?: number | null;
  stats: UserReadingStats;
}) {
  const earned: { key: string; label: string }[] = [];
  for (const rule of BADGE_RULES) {
    if (!rule.test(input.stats)) continue;
    const exists = await hasBadge(input.userId ?? null, input.childId ?? null, rule.key);
    if (exists) continue;
    await db.insert(libraryReadingBadges).values({
      userId: input.userId ?? null,
      childId: input.childId ?? null,
      badgeKey: rule.key,
      label: rule.key,
    });
    earned.push({ key: rule.key, label: rule.key });
  }
  return earned;
}

export async function getChildReadingStats(childId: number): Promise<UserReadingStats> {
  const rows = await db
    .select({ percent: libraryReadingProgress.percent, updatedAt: libraryReadingProgress.updatedAt })
    .from(libraryReadingProgress)
    .where(eq(libraryReadingProgress.childId, childId));

  const booksFinished = rows.filter((r) => r.percent >= 100).length;
  const booksReading = rows.filter((r) => r.percent > 0 && r.percent < 100).length;
  const dayKeys = rows
    .filter((r) => r.percent > 0)
    .map((r) => dayKeyFromDate(r.updatedAt));

  return {
    booksFinished,
    booksReading,
    totalPagesRead: rows.reduce((s, r) => s + Math.round((r.percent / 100) * 80), 0),
    pagesThisMonth: 0,
    pagesToday: 0,
    readingStreakDays: computeReadingStreakFromDayKeys(dayKeys),
  };
}

export async function awardChildBadges(childId: number) {
  const stats = await getChildReadingStats(childId);
  return awardReadingBadges({ childId, stats });
}

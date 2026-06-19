import { db } from "@/db";
import { libraryOfflineDownloads } from "@/db/schema";
import { and, eq } from "drizzle-orm";

/** Lundi de la semaine courante (UTC date). */
export function currentWeekStart(): string {
  const d = new Date();
  const day = d.getUTCDay();
  const diff = day === 0 ? -6 : 1 - day;
  d.setUTCDate(d.getUTCDate() + diff);
  d.setUTCHours(0, 0, 0, 0);
  return d.toISOString().slice(0, 10);
}

function weekStartDate(): Date {
  return new Date(`${currentWeekStart()}T00:00:00.000Z`);
}

export async function getOfflineDownloadThisWeek(input: {
  userId?: number | null;
  childId?: number | null;
}) {
  const weekStart = weekStartDate();
  if (input.userId) {
    const [row] = await db
      .select()
      .from(libraryOfflineDownloads)
      .where(and(eq(libraryOfflineDownloads.userId, input.userId), eq(libraryOfflineDownloads.weekStart, weekStart)))
      .limit(1);
    return row ?? null;
  }
  if (input.childId) {
    const [row] = await db
      .select()
      .from(libraryOfflineDownloads)
      .where(and(eq(libraryOfflineDownloads.childId, input.childId), eq(libraryOfflineDownloads.weekStart, weekStart)))
      .limit(1);
    return row ?? null;
  }
  return null;
}

export async function registerOfflineDownload(input: {
  userId?: number | null;
  childId?: number | null;
  bookId: number;
}): Promise<{ ok: true } | { ok: false; error: string; bookId?: number }> {
  const weekStart = weekStartDate();
  const existing = await getOfflineDownloadThisWeek(input);

  if (existing) {
    if (existing.bookId === input.bookId) return { ok: true };
    return {
      ok: false,
      error: "offline_quota",
      bookId: existing.bookId,
    };
  }

  await db.insert(libraryOfflineDownloads).values({
    userId: input.userId ?? null,
    childId: input.childId ?? null,
    bookId: input.bookId,
    weekStart,
  });

  return { ok: true };
}

import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { and, desc, eq, sql } from "drizzle-orm";

export type ChildBoostRecord = {
  id: number;
  message: string;
  createdAt: Date;
  parentName?: string;
};

export async function getLatestChildBoost(childId: number, maxAgeDays = 7): Promise<ChildBoostRecord | null> {
  const since = new Date();
  since.setDate(since.getDate() - maxAgeDays);

  const rows = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      metadata: activityLogs.metadata,
      createdAt: activityLogs.createdAt,
    })
    .from(activityLogs)
    .where(and(eq(activityLogs.category, "boost"), sql`${activityLogs.createdAt} > ${since}`))
    .orderBy(desc(activityLogs.createdAt))
    .limit(50);

  for (const row of rows) {
    if (!row.metadata) continue;
    try {
      const meta = JSON.parse(row.metadata) as { childId?: number; message?: string };
      if (meta.childId === childId) {
        return {
          id: row.id,
          message: meta.message || row.action,
          createdAt: row.createdAt,
        };
      }
    } catch {
      /* skip */
    }
  }
  return null;
}

export async function listChildBoosts(childId: number, limit = 10): Promise<ChildBoostRecord[]> {
  const rows = await db
    .select({
      id: activityLogs.id,
      action: activityLogs.action,
      metadata: activityLogs.metadata,
      createdAt: activityLogs.createdAt,
    })
    .from(activityLogs)
    .where(eq(activityLogs.category, "boost"))
    .orderBy(desc(activityLogs.createdAt))
    .limit(100);

  const out: ChildBoostRecord[] = [];
  for (const row of rows) {
    if (!row.metadata) continue;
    try {
      const meta = JSON.parse(row.metadata) as { childId?: number; message?: string };
      if (meta.childId === childId) {
        out.push({
          id: row.id,
          message: meta.message || row.action,
          createdAt: row.createdAt,
        });
        if (out.length >= limit) break;
      }
    } catch {
      /* skip */
    }
  }
  return out;
}

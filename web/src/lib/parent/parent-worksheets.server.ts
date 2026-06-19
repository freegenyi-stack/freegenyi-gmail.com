import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import type { GenyExerciseSet } from "@/lib/parent/geny-exercise-generator.server";

export type ParentWorksheetRecord = {
  id: number;
  childId: number;
  childName: string;
  parentUserId: number;
  sets: GenyExerciseSet[];
  status: "pending" | "done" | "archived";
  assignedAt: Date;
  completedAt?: Date;
  note?: string;
};

type WorksheetMeta = {
  childId: number;
  childName: string;
  parentUserId: number;
  sets: GenyExerciseSet[];
  status: "pending" | "done" | "archived";
  assignedAt: string;
  completedAt?: string;
  note?: string;
};

function parseMeta(row: { id: number; metadata: string | null; createdAt: Date; action: string }): ParentWorksheetRecord | null {
  if (!row.metadata) return null;
  try {
    const meta = JSON.parse(row.metadata) as WorksheetMeta;
    return {
      id: row.id,
      childId: meta.childId,
      childName: meta.childName,
      parentUserId: meta.parentUserId,
      sets: meta.sets,
      status: meta.status,
      assignedAt: new Date(meta.assignedAt),
      completedAt: meta.completedAt ? new Date(meta.completedAt) : undefined,
      note: meta.note,
    };
  } catch {
    return null;
  }
}

export async function saveParentWorksheet(input: {
  parentUserId: number;
  childId: number;
  childName: string;
  sets: GenyExerciseSet[];
  note?: string;
}): Promise<ParentWorksheetRecord> {
  const meta: WorksheetMeta = {
    childId: input.childId,
    childName: input.childName,
    parentUserId: input.parentUserId,
    sets: input.sets,
    status: "pending",
    assignedAt: new Date().toISOString(),
    note: input.note,
  };

  const [row] = await db
    .insert(activityLogs)
    .values({
      userId: input.parentUserId,
      category: "parent_worksheet",
      action: `Geny · ${input.sets.map((s) => s.titleFr).join(" + ")}`,
      metadata: JSON.stringify(meta),
    })
    .returning();

  return parseMeta(row)!;
}

export async function listParentWorksheets(parentUserId: number, limit = 40): Promise<ParentWorksheetRecord[]> {
  const rows = await db
    .select()
    .from(activityLogs)
    .where(and(eq(activityLogs.userId, parentUserId), eq(activityLogs.category, "parent_worksheet")))
    .orderBy(desc(activityLogs.createdAt))
    .limit(limit);

  return rows.map(parseMeta).filter((r): r is ParentWorksheetRecord => !!r);
}

export async function getPendingWorksheetsForChild(childId: number, limit = 5): Promise<ParentWorksheetRecord[]> {
  const rows = await db
    .select()
    .from(activityLogs)
    .where(eq(activityLogs.category, "parent_worksheet"))
    .orderBy(desc(activityLogs.createdAt))
    .limit(80);

  const out: ParentWorksheetRecord[] = [];
  for (const row of rows) {
    const ws = parseMeta(row);
    if (ws && ws.childId === childId && ws.status === "pending") {
      out.push(ws);
      if (out.length >= limit) break;
    }
  }
  return out;
}

export async function markWorksheetDone(worksheetId: number, childId?: number): Promise<boolean> {
  const [row] = await db.select().from(activityLogs).where(eq(activityLogs.id, worksheetId)).limit(1);
  if (!row || row.category !== "parent_worksheet") return false;

  let meta: WorksheetMeta;
  try {
    meta = JSON.parse(row.metadata || "{}") as WorksheetMeta;
  } catch {
    return false;
  }

  if (childId !== undefined && meta.childId !== childId) return false;

  meta.status = "done";
  meta.completedAt = new Date().toISOString();

  await db
    .update(activityLogs)
    .set({ metadata: JSON.stringify(meta) })
    .where(eq(activityLogs.id, worksheetId));

  return true;
}

export async function getChildScreenTimeMinutes(childId: number): Promise<number> {
  const today = new Date().toISOString().slice(0, 10);
  const rows = await db
    .select({ metadata: activityLogs.metadata, action: activityLogs.action })
    .from(activityLogs)
    .where(and(eq(activityLogs.category, "child_session"), eq(activityLogs.action, "screen_time")))
    .orderBy(desc(activityLogs.createdAt))
    .limit(40);

  for (const row of rows) {
    if (!row.metadata) continue;
    try {
      const meta = JSON.parse(row.metadata) as { childId?: number; minutesToday?: number; date?: string };
      if (meta.childId === childId && meta.date === today) return meta.minutesToday ?? 0;
    } catch {
      /* skip */
    }
  }
  return 0;
}

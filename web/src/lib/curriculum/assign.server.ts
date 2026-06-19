import { db } from "@/db";
import { children, curriculumAssignments, curriculumSessions } from "@/db/schema";
import { and, desc, eq } from "drizzle-orm";
import { loadBundleFromFiles } from "./loader.server";
import { buildSessionPayload } from "./session-builder.server";
import {
  findActiveBundle,
  normalizeChildLevel,
  persistSession,
} from "./progress.server";
import { toCurriculumPlayPayload } from "./session-to-envelope.server";
import type { ChildSessionPayload, CurriculumSubject, SessionSource } from "./types";
import type { ProgramSectionDetail } from "./types";

export function pickCompetencyWithExercises(
  detail: ProgramSectionDetail,
  bundle: Awaited<ReturnType<typeof loadBundleFromFiles>>
): string | null {
  if (!bundle) return null;
  for (const node of detail.nodes) {
    const has = bundle.exercises.some((e) => e.competencyId === node.competencyId);
    if (has) return node.competencyId;
  }
  return null;
}

export async function assignCurriculumSession(input: {
  childId: number;
  country?: "DZ";
  level?: string;
  subject: CurriculumSubject;
  competencyId: string;
  source: SessionSource;
  itemsMin?: number;
  itemsMax?: number;
  assignedByUserId?: number;
  assignedByRole?: "parent" | "teacher";
  maqtaId?: string;
  note?: string;
}): Promise<{ error?: string; sessionKey?: string; payload?: ChildSessionPayload }> {
  const [child] = await db
    .select({ educationLevel: children.educationLevel })
    .from(children)
    .where(eq(children.id, input.childId))
    .limit(1);
  if (!child) return { error: "child_not_found" };

  const level = normalizeChildLevel(input.level ?? child.educationLevel);
  const country = input.country ?? "DZ";

  const bundle = await loadBundleFromFiles(country, level, input.subject);
  if (!bundle) return { error: "bundle_not_found" };

  const built = buildSessionPayload({
    bundle,
    competencyId: input.competencyId,
    source: input.source,
    itemsMin: input.itemsMin ?? 4,
    itemsMax: input.itemsMax ?? 6,
    meta: input.note ? { fromTeacherName: input.note } : undefined,
  });

  if ("error" in built) return { error: built.error };

  const dbBundle = await findActiveBundle(country, level, input.subject);
  await persistSession(input.childId, dbBundle?.id ?? null, built);

  if (input.assignedByUserId) {
    await db.insert(curriculumAssignments).values({
      sessionKey: built.sessionId,
      childId: input.childId,
      assignedByUserId: input.assignedByUserId,
      assignedByRole: input.assignedByRole ?? "parent",
      maqtaId: input.maqtaId,
      subjectCode: input.subject,
      competencyId: input.competencyId,
      status: "pending",
    });
  }

  return { sessionKey: built.sessionId, payload: built };
}

export async function listPendingCurriculumSessions(childId: number, limit = 20) {
  const rows = await db
    .select()
    .from(curriculumSessions)
    .where(and(eq(curriculumSessions.childId, childId), eq(curriculumSessions.status, "pending")))
    .orderBy(desc(curriculumSessions.createdAt))
    .limit(limit);

  return rows.map((r) => {
    const payload = r.payloadJson as ChildSessionPayload;
    return {
      sessionKey: r.sessionKey,
      source: r.source,
      competencyId: r.competencyId,
      titleFr: payload.titleFr,
      titleAr: payload.titleAr,
      subject: payload.subject,
      xpReward: payload.xpReward,
      itemCount: payload.items?.length ?? 0,
      createdAt: r.createdAt,
    };
  });
}

export async function getCurriculumPlayPayload(sessionKey: string, childId: number) {
  const [row] = await db
    .select()
    .from(curriculumSessions)
    .where(and(eq(curriculumSessions.sessionKey, sessionKey), eq(curriculumSessions.childId, childId)))
    .limit(1);

  if (!row) return null;
  const payload = row.payloadJson as ChildSessionPayload;
  return toCurriculumPlayPayload(payload);
}

export async function countPendingCurriculumSessions(childId: number) {
  const rows = await db
    .select({ id: curriculumSessions.id })
    .from(curriculumSessions)
    .where(and(eq(curriculumSessions.childId, childId), eq(curriculumSessions.status, "pending")));
  return rows.length;
}

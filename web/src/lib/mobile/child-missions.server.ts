import { db } from "@/db";
import { authoringProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  getChildMissionResource,
  listChildAtelierMissions,
} from "@/lib/child/gamification.server";
import { getAuthoringProgressContext } from "@/lib/authoring/assignments.server";
import { recordActivityAttempt } from "@/lib/authoring/attempts.server";
import {
  activityLangFromLocale,
  buildDefaultEnvelope,
  parseActivityEnvelope,
  resolveActivityType,
} from "@/lib/activities/content";
import { isActivityKind } from "@/lib/authoring/types";
import type { ActivityResult } from "@/types/activity";

export { listChildAtelierMissions, getChildMissionResource };

export async function getMobileMissionPayload(progressId: number, childId: number, locale = "fr") {
  const row = await getChildMissionResource(progressId, childId);
  if (!row) return null;

  const langue = activityLangFromLocale(locale);
  const activityType = resolveActivityType(
    parseActivityEnvelope(row.resource.contentJson)?.activityType,
    row.resource.h5pLibrary
  );

  const envelope =
    parseActivityEnvelope(row.resource.contentJson) ??
    buildDefaultEnvelope(activityType, row.resource.title, langue);

  return {
    progressId: row.progressId,
    status: row.status,
    resourceId: row.resource.id,
    resourceTitle: row.resource.title,
    resourceKind: row.resource.kind,
    isActivity: isActivityKind(row.resource.kind),
    activityType,
    envelope,
    langue,
  };
}

function toActivityResult(resourceId: number, result: ActivityResult): ActivityResult {
  const stars = Math.min(3, Math.max(1, result.nbEtoiles)) as 1 | 2 | 3;
  return {
    activityId: String(resourceId),
    score: result.score,
    xpGagne: result.xpGagne,
    nbEtoiles: stars,
    tempsSecondes: result.tempsSecondes ?? 0,
    erreurs: result.erreurs ?? 0,
    answers: result.answers,
  };
}

export async function updateMobileMissionProgress(input: {
  progressId: number;
  childId: number;
  status: "pending" | "in_progress" | "done";
  result?: ActivityResult;
}): Promise<{ ok: true } | { error: string; code?: string }> {
  const [row] = await db
    .select({ id: authoringProgress.id, childId: authoringProgress.childId })
    .from(authoringProgress)
    .where(eq(authoringProgress.id, input.progressId))
    .limit(1);

  if (!row || row.childId !== input.childId) return { error: "Mission introuvable.", code: "not_found" };

  await db
    .update(authoringProgress)
    .set({
      status: input.status,
      completedAt: input.status === "done" ? new Date() : null,
      ...(input.result
        ? {
            score: input.result.score,
            xpEarned: input.result.xpGagne,
            stars: input.result.nbEtoiles,
          }
        : {}),
      updatedAt: new Date(),
    })
    .where(eq(authoringProgress.id, input.progressId));

  if (input.status === "done" && input.result) {
    const ctx = await getAuthoringProgressContext(input.progressId);
    if (ctx) {
      await recordActivityAttempt({
        resourceId: ctx.resourceId,
        teacherUserId: ctx.teacherUserId,
        childId: ctx.childId,
        progressId: input.progressId,
        source: "assignment",
        result: toActivityResult(ctx.resourceId, input.result),
      });
    }
  }

  return { ok: true };
}

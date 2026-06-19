"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { authoringProgress } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getAuthoringProgressContext } from "@/lib/authoring/assignments.server";
import { recordActivityAttempt } from "@/lib/authoring/attempts.server";
import type { ActivityResult } from "@/types/activity";

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

export async function updateChildAtelierProgress(input: {
  progressId: number;
  childId: number;
  status: "pending" | "in_progress" | "done";
  score?: number;
  xpEarned?: number;
  stars?: number;
}): Promise<{ success: true } | { error: string }> {
  const [row] = await db
    .select({ id: authoringProgress.id, childId: authoringProgress.childId })
    .from(authoringProgress)
    .where(eq(authoringProgress.id, input.progressId))
    .limit(1);

  if (!row || row.childId !== input.childId) return { error: "not_found" };

  await db
    .update(authoringProgress)
    .set({
      status: input.status,
      completedAt: input.status === "done" ? new Date() : null,
      ...(input.score !== undefined ? { score: input.score } : {}),
      ...(input.xpEarned !== undefined ? { xpEarned: input.xpEarned } : {}),
      ...(input.stars !== undefined ? { stars: input.stars } : {}),
      updatedAt: new Date(),
    })
    .where(eq(authoringProgress.id, input.progressId));

  return { success: true };
}

export async function markChildAtelierProgressAction(
  progressId: number,
  childId: number,
  status: "pending" | "in_progress" | "done",
  result?: ActivityResult
) {
  const res = await updateChildAtelierProgress({
    progressId,
    childId,
    status,
    score: result?.score,
    xpEarned: result?.xpGagne,
    stars: result?.nbEtoiles,
  });
  if ("error" in res) return { error: res.error as "not_found" };

  if (status === "done" && result) {
    const ctx = await getAuthoringProgressContext(progressId);
    if (ctx) {
      await recordActivityAttempt({
        resourceId: ctx.resourceId,
        teacherUserId: ctx.teacherUserId,
        childId: ctx.childId,
        progressId,
        source: "assignment",
        result: toActivityResult(ctx.resourceId, result),
      });
    }
  }

  revalidatePath(`/lobby/${childId}`);
  revalidatePath(`/lobby/${childId}/missions`);
  revalidatePath("/dashboard/enseignant/atelier/classe");
  return { success: true as const };
}

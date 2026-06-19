"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { requireAuthoringUser } from "@/lib/authoring/session";
import {
  childBelongsToUser,
  getMurShareForPlay,
  recordActivityAttempt,
  resolveTeacherForResource,
} from "@/lib/authoring/attempts.server";
import { updateAuthoringProgressStatus } from "@/lib/authoring/assignments.server";
import { getFamilyChildren } from "@/lib/family/server";
import type { ActivityResult } from "@/types/activity";

export async function submitMurActivityAttemptAction(input: {
  shareId: number;
  childId: number;
  result: ActivityResult;
}) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };

  const share = await getMurShareForPlay(input.shareId);
  if (!share?.authoringResourceId) return { error: "not_found" as const };

  const [dbUser] = await db.select({ familyId: users.familyId }).from(users).where(eq(users.id, user.id)).limit(1);
  const ok = await childBelongsToUser(input.childId, user.id, dbUser?.familyId ?? null);
  if (!ok) return { error: "forbidden" as const };

  const teacherUserId = share.ownerUserId;
  await recordActivityAttempt({
    resourceId: share.authoringResourceId,
    teacherUserId,
    childId: input.childId,
    submittedByUserId: user.id,
    shareId: input.shareId,
    source: "mur",
    result: input.result,
  });

  revalidatePath("/dashboard/enseignant/atelier/classe");
  revalidatePath("/dashboard/enseignant/mur");
  revalidatePath("/dashboard/parent/mur");
  return { success: true as const };
}

export async function submitAtelierActivityAttemptAction(input: {
  resourceId: number;
  childId: number;
  result: ActivityResult;
  progressId?: number | null;
  source?: "assignment" | "atelier";
}) {
  const user = await requireAuthoringUser();
  if (!user) return { error: "unauthorized" as const };

  const [dbUser] = await db.select({ familyId: users.familyId }).from(users).where(eq(users.id, user.id)).limit(1);
  const children = await getFamilyChildren({ id: user.id, familyId: dbUser?.familyId ?? null });
  const childIds = children.map((c) => c.id);

  if (!childIds.includes(input.childId)) return { error: "forbidden" as const };

  const teacherUserId = await resolveTeacherForResource(input.resourceId);
  if (!teacherUserId) return { error: "not_found" as const };

  if (input.progressId) {
    await updateAuthoringProgressStatus({
      progressId: input.progressId,
      userId: user.id,
      childIds,
      status: "done",
      score: input.result.score,
      xpEarned: input.result.xpGagne,
      stars: input.result.nbEtoiles,
    });
  }

  await recordActivityAttempt({
    resourceId: input.resourceId,
    teacherUserId,
    childId: input.childId,
    submittedByUserId: user.id,
    progressId: input.progressId ?? null,
    source: input.source ?? (input.progressId ? "assignment" : "atelier"),
    result: input.result,
  });

  revalidatePath("/dashboard/enseignant/atelier/classe");
  revalidatePath("/dashboard/parent/atelier");
  return { success: true as const };
}

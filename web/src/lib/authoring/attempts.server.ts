import { db } from "@/db";
import {
  authoringActivityAttempts,
  authoringResources,
  children,
  pedagogyShares,
} from "@/db/schema";
import { and, desc, eq, inArray } from "drizzle-orm";
import type { ActivityContentEnvelope, ActivityResult } from "@/types/activity";
import { parseActivityEnvelope } from "@/lib/activities/content";
import type { ActivityAttemptAnswers } from "@/types/activity";

export type ActivityAttemptSource = "assignment" | "mur" | "atelier";

export type ActivityAttemptRow = {
  id: number;
  resourceId: number;
  resourceTitle: string;
  childId: number | null;
  childName: string | null;
  source: ActivityAttemptSource;
  score: number;
  stars: number | null;
  xpEarned: number | null;
  errors: number | null;
  durationSeconds: number | null;
  completedAt: Date;
};

export async function recordActivityAttempt(input: {
  resourceId: number;
  teacherUserId: number;
  childId?: number | null;
  submittedByUserId?: number | null;
  progressId?: number | null;
  shareId?: number | null;
  source: ActivityAttemptSource;
  result: ActivityResult;
}): Promise<{ id: number }> {
  const [row] = await db
    .insert(authoringActivityAttempts)
    .values({
      resourceId: input.resourceId,
      teacherUserId: input.teacherUserId,
      childId: input.childId ?? null,
      submittedByUserId: input.submittedByUserId ?? null,
      progressId: input.progressId ?? null,
      shareId: input.shareId ?? null,
      source: input.source,
      score: input.result.score,
      xpEarned: input.result.xpGagne,
      stars: input.result.nbEtoiles,
      errors: input.result.erreurs,
      durationSeconds: input.result.tempsSecondes,
      answersJson: input.result.answers ?? null,
    })
    .returning({ id: authoringActivityAttempts.id });

  return { id: row.id };
}

export async function getMurShareForPlay(shareId: number) {
  const [row] = await db
    .select({
      shareId: pedagogyShares.id,
      postType: pedagogyShares.postType,
      title: pedagogyShares.title,
      authoringResourceId: pedagogyShares.authoringResourceId,
      authorId: pedagogyShares.authorId,
      resourceKind: authoringResources.kind,
      resourceTitle: authoringResources.title,
      contentJson: authoringResources.contentJson,
      h5pLibrary: authoringResources.h5pLibrary,
      ownerUserId: authoringResources.ownerUserId,
    })
    .from(pedagogyShares)
    .innerJoin(authoringResources, eq(authoringResources.id, pedagogyShares.authoringResourceId))
    .where(and(eq(pedagogyShares.id, shareId), eq(pedagogyShares.isRemoved, false)))
    .limit(1);

  if (!row || row.postType !== "exercise" || !row.authoringResourceId) return null;
  return row;
}

export async function listTeacherActivityAttempts(
  teacherUserId: number,
  limit = 100
): Promise<ActivityAttemptRow[]> {
  const rows = await db
    .select({
      id: authoringActivityAttempts.id,
      resourceId: authoringActivityAttempts.resourceId,
      resourceTitle: authoringResources.title,
      childId: authoringActivityAttempts.childId,
      childName: children.fullName,
      source: authoringActivityAttempts.source,
      score: authoringActivityAttempts.score,
      stars: authoringActivityAttempts.stars,
      xpEarned: authoringActivityAttempts.xpEarned,
      errors: authoringActivityAttempts.errors,
      durationSeconds: authoringActivityAttempts.durationSeconds,
      completedAt: authoringActivityAttempts.completedAt,
    })
    .from(authoringActivityAttempts)
    .innerJoin(authoringResources, eq(authoringResources.id, authoringActivityAttempts.resourceId))
    .leftJoin(children, eq(children.id, authoringActivityAttempts.childId))
    .where(eq(authoringActivityAttempts.teacherUserId, teacherUserId))
    .orderBy(desc(authoringActivityAttempts.completedAt))
    .limit(limit);

  return rows.map((r) => ({
    ...r,
    source: r.source as ActivityAttemptSource,
    childName: r.childName ?? null,
  }));
}

export async function resolveTeacherForResource(resourceId: number): Promise<number | null> {
  const [row] = await db
    .select({ ownerUserId: authoringResources.ownerUserId, ownerRole: authoringResources.ownerRole })
    .from(authoringResources)
    .where(eq(authoringResources.id, resourceId))
    .limit(1);
  if (!row || row.ownerRole !== "enseignant") return null;
  return row.ownerUserId;
}

export type ActivityAttemptDetail = ActivityAttemptRow & {
  activityType: string | null;
  envelope: ActivityContentEnvelope | null;
  answers: ActivityAttemptAnswers | null;
};

export async function getAttemptDetailForTeacher(
  attemptId: number,
  teacherUserId: number
): Promise<ActivityAttemptDetail | null> {
  const [row] = await db
    .select({
      id: authoringActivityAttempts.id,
      resourceId: authoringActivityAttempts.resourceId,
      resourceTitle: authoringResources.title,
      childId: authoringActivityAttempts.childId,
      childName: children.fullName,
      source: authoringActivityAttempts.source,
      score: authoringActivityAttempts.score,
      stars: authoringActivityAttempts.stars,
      xpEarned: authoringActivityAttempts.xpEarned,
      errors: authoringActivityAttempts.errors,
      durationSeconds: authoringActivityAttempts.durationSeconds,
      completedAt: authoringActivityAttempts.completedAt,
      contentJson: authoringResources.contentJson,
      h5pLibrary: authoringResources.h5pLibrary,
      answersJson: authoringActivityAttempts.answersJson,
    })
    .from(authoringActivityAttempts)
    .innerJoin(authoringResources, eq(authoringResources.id, authoringActivityAttempts.resourceId))
    .leftJoin(children, eq(children.id, authoringActivityAttempts.childId))
    .where(
      and(
        eq(authoringActivityAttempts.id, attemptId),
        eq(authoringActivityAttempts.teacherUserId, teacherUserId)
      )
    )
    .limit(1);

  if (!row) return null;

  const answersRaw = row.answersJson as ActivityAttemptAnswers | null;
  const envelope = parseActivityEnvelope(row.contentJson);

  return {
    id: row.id,
    resourceId: row.resourceId,
    resourceTitle: row.resourceTitle,
    childId: row.childId,
    childName: row.childName ?? null,
    source: row.source as ActivityAttemptSource,
    score: row.score,
    stars: row.stars,
    xpEarned: row.xpEarned,
    errors: row.errors,
    durationSeconds: row.durationSeconds,
    completedAt: row.completedAt,
    activityType: envelope?.activityType ?? answersRaw?.activityType ?? row.h5pLibrary ?? null,
    envelope,
    answers: answersRaw?.activityType ? answersRaw : null,
  };
}

export async function childBelongsToUser(childId: number, _userId: number, familyId: string | null): Promise<boolean> {
  const [child] = await db
    .select({ id: children.id, familyId: children.familyId })
    .from(children)
    .where(eq(children.id, childId))
    .limit(1);
  if (!child) return false;
  if (familyId && child.familyId === familyId) return true;
  return false;
}

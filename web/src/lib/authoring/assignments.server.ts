import { db } from "@/db";
import {
  authoringAssignments,
  authoringProgress,
  authoringResources,
  children,
  users,
} from "@/db/schema";
import { and, desc, eq, inArray, or, ilike } from "drizzle-orm";
import {
  listTeacherSchoolChildren,
  teacherSchoolIdFromMetadata,
  type TeacherSchoolChild,
} from "@/lib/library/books.server";
import { getAuthoringResource } from "./resources.server";
import { notifyAuthoringAssignment } from "./assignment-notify.server";

export type AuthoringAssignmentRow = {
  id: number;
  resourceId: number;
  resourceTitle: string;
  resourceKind: string;
  childId: number | null;
  childName: string | null;
  note: string | null;
  dueAt: Date | null;
  createdAt: Date;
};

export type FamilyAuthoringAssignmentRow = {
  assignmentId: number;
  progressId: number;
  resourceId: number;
  resourceTitle: string;
  resourceKind: string;
  resourceType: string;
  childId: number;
  childName: string;
  teacherName: string | null;
  note: string | null;
  status: string;
  dueAt: Date | null;
  createdAt: Date;
};

export type ClasseProgressRow = {
  progressId: number;
  childId: number;
  childName: string;
  childLevel: string | null;
  assignmentId: number;
  resourceId: number;
  resourceTitle: string;
  resourceKind: string;
  resourceLevel: string | null;
  status: string;
  score: number | null;
  stars: number | null;
  xpEarned: number | null;
  dueAt: Date | null;
  updatedAt: Date;
};

export type ProgressAttemptContext = {
  progressId: number;
  childId: number;
  resourceId: number;
  teacherUserId: number;
};

async function resolveTargetChildren(
  teacherSchoolId: number,
  childId?: number | null,
  schoolLevel?: string | null
): Promise<TeacherSchoolChild[]> {
  const all = await listTeacherSchoolChildren(teacherSchoolId);
  if (childId) {
    const one = all.find((c) => c.id === childId);
    return one ? [one] : [];
  }
  if (schoolLevel?.trim()) {
    const rows = await db
      .select({
        id: children.id,
        fullName: children.fullName,
        schoolName: children.schoolName,
        educationLevel: children.educationLevel,
      })
      .from(children)
      .where(and(eq(children.schoolId, teacherSchoolId), eq(children.educationLevel, schoolLevel.trim())))
      .orderBy(children.fullName);
    return rows;
  }
  return all;
}

export async function createAuthoringAssignment(input: {
  teacherId: number;
  teacherMetadata: unknown;
  resourceId: number;
  childId?: number | null;
  assignLevel?: string | null;
  note?: string | null;
  dueAt?: Date | null;
  locale?: string;
}): Promise<{ success: true; assignmentId: number } | { error: string }> {
  const schoolId = teacherSchoolIdFromMetadata(input.teacherMetadata);
  if (!schoolId) return { error: "school_required" };

  const resource = await getAuthoringResource(input.resourceId, input.teacherId, "enseignant");
  if (!resource) return { error: "resource_not_found" };

  if (input.childId) {
    const targets = await resolveTargetChildren(schoolId, input.childId);
    if (targets.length === 0) return { error: "child_not_found" };
  }

  const levelFilter =
    input.childId ? null : (input.assignLevel?.trim() || resource.schoolLevel?.trim() || null);

  const targetChildren = await resolveTargetChildren(
    schoolId,
    input.childId ?? null,
    levelFilter
  );
  if (targetChildren.length === 0) return { error: "no_students" };

  const [assignment] = await db
    .insert(authoringAssignments)
    .values({
      resourceId: input.resourceId,
      assignedByUserId: input.teacherId,
      childId: input.childId ?? null,
      note: input.note?.trim() || null,
      targetType: input.childId ? "child" : "school",
      targetJson: JSON.stringify({
        schoolId,
        scope: input.childId ? "child" : levelFilter ? "level" : "school",
        level: levelFilter,
      }),
      dueAt: input.dueAt ?? null,
    })
    .returning();

  await db.insert(authoringProgress).values(
    targetChildren.map((c) => ({
      assignmentId: assignment.id,
      childId: c.id,
      status: "pending",
    }))
  );

  await notifyAuthoringAssignment({
    assignmentId: assignment.id,
    resourceTitle: resource.title,
    resourceKind: resource.kind,
    teacherId: input.teacherId,
    childIds: targetChildren.map((c) => c.id),
    note: input.note ?? null,
    locale: input.locale ?? "fr",
  });

  return { success: true, assignmentId: assignment.id };
}

export async function listTeacherAuthoringAssignments(
  teacherId: number,
  limit = 50
): Promise<AuthoringAssignmentRow[]> {
  const rows = await db
    .select({
      id: authoringAssignments.id,
      resourceId: authoringAssignments.resourceId,
      resourceTitle: authoringResources.title,
      resourceKind: authoringResources.kind,
      childId: authoringAssignments.childId,
      childName: children.fullName,
      note: authoringAssignments.note,
      dueAt: authoringAssignments.dueAt,
      createdAt: authoringAssignments.createdAt,
    })
    .from(authoringAssignments)
    .innerJoin(authoringResources, eq(authoringAssignments.resourceId, authoringResources.id))
    .leftJoin(children, eq(authoringAssignments.childId, children.id))
    .where(eq(authoringAssignments.assignedByUserId, teacherId))
    .orderBy(desc(authoringAssignments.createdAt))
    .limit(limit);

  return rows;
}

export async function listFamilyAuthoringAssignments(
  childIds: number[],
  limit = 80
): Promise<FamilyAuthoringAssignmentRow[]> {
  if (childIds.length === 0) return [];

  const rows = await db
    .select({
      assignmentId: authoringAssignments.id,
      progressId: authoringProgress.id,
      resourceId: authoringResources.id,
      resourceTitle: authoringResources.title,
      resourceKind: authoringResources.kind,
      resourceType: authoringResources.resourceType,
      childId: authoringProgress.childId,
      childName: children.fullName,
      teacherName: users.fullName,
      note: authoringAssignments.note,
      status: authoringProgress.status,
      dueAt: authoringAssignments.dueAt,
      createdAt: authoringAssignments.createdAt,
    })
    .from(authoringProgress)
    .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
    .innerJoin(authoringResources, eq(authoringAssignments.resourceId, authoringResources.id))
    .innerJoin(children, eq(authoringProgress.childId, children.id))
    .innerJoin(users, eq(authoringAssignments.assignedByUserId, users.id))
    .where(inArray(authoringProgress.childId, childIds))
    .orderBy(desc(authoringAssignments.createdAt))
    .limit(limit);

  return rows;
}

export async function listSchoolAtelierOverview(
  teacherId: number,
  teacherMetadata: unknown
): Promise<ClasseProgressRow[]> {
  const schoolId = teacherSchoolIdFromMetadata(teacherMetadata);
  if (!schoolId) return [];

  const rows = await db
    .select({
      progressId: authoringProgress.id,
      childId: authoringProgress.childId,
      childName: children.fullName,
      childLevel: children.educationLevel,
      assignmentId: authoringAssignments.id,
      resourceId: authoringResources.id,
      resourceTitle: authoringResources.title,
      resourceKind: authoringResources.kind,
      resourceLevel: authoringResources.schoolLevel,
      status: authoringProgress.status,
      score: authoringProgress.score,
      stars: authoringProgress.stars,
      xpEarned: authoringProgress.xpEarned,
      dueAt: authoringAssignments.dueAt,
      updatedAt: authoringProgress.updatedAt,
    })
    .from(authoringProgress)
    .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
    .innerJoin(authoringResources, eq(authoringAssignments.resourceId, authoringResources.id))
    .innerJoin(children, eq(authoringProgress.childId, children.id))
    .where(and(eq(authoringAssignments.assignedByUserId, teacherId), eq(children.schoolId, schoolId)))
    .orderBy(desc(authoringProgress.updatedAt))
    .limit(200);

  return rows;
}

export async function getAuthoringProgressContext(progressId: number): Promise<ProgressAttemptContext | null> {
  const [row] = await db
    .select({
      progressId: authoringProgress.id,
      childId: authoringProgress.childId,
      resourceId: authoringAssignments.resourceId,
      teacherUserId: authoringAssignments.assignedByUserId,
    })
    .from(authoringProgress)
    .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
    .where(eq(authoringProgress.id, progressId))
    .limit(1);

  return row ?? null;
}

export async function resolveFamilyProgressForAssignment(input: {
  assignmentId: number;
  childIds: number[];
  resourceId: number;
}): Promise<number | null> {
  if (input.childIds.length === 0) return null;

  const [row] = await db
    .select({ progressId: authoringProgress.id })
    .from(authoringProgress)
    .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
    .where(
      and(
        eq(authoringAssignments.id, input.assignmentId),
        eq(authoringAssignments.resourceId, input.resourceId),
        inArray(authoringProgress.childId, input.childIds)
      )
    )
    .limit(1);

  return row?.progressId ?? null;
}

/** Trouve la progression famille pour une ressource (avec ou sans assignment explicite). */
export async function resolveFamilyProgressForResource(input: {
  childIds: number[];
  resourceId: number;
  assignmentId?: number | null;
}): Promise<number | null> {
  if (input.childIds.length === 0) return null;

  const conditions = [
    eq(authoringAssignments.resourceId, input.resourceId),
    inArray(authoringProgress.childId, input.childIds),
  ];
  if (input.assignmentId != null) {
    conditions.push(eq(authoringAssignments.id, input.assignmentId));
  }

  const [row] = await db
    .select({ progressId: authoringProgress.id })
    .from(authoringProgress)
    .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
    .where(and(...conditions))
    .orderBy(desc(authoringProgress.updatedAt))
    .limit(1);

  return row?.progressId ?? null;
}

export async function updateAuthoringProgressStatus(input: {
  progressId: number;
  userId: number;
  childIds: number[];
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

  if (!row || !input.childIds.includes(row.childId)) return { error: "not_found" };

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

export async function updateTeacherProgressStatus(input: {
  progressId: number;
  teacherId: number;
  status: "pending" | "in_progress" | "done";
}): Promise<{ success: true } | { error: string }> {
  const [row] = await db
    .select({ id: authoringProgress.id })
    .from(authoringProgress)
    .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
    .where(
      and(eq(authoringProgress.id, input.progressId), eq(authoringAssignments.assignedByUserId, input.teacherId))
    )
    .limit(1);

  if (!row) return { error: "not_found" };

  await db
    .update(authoringProgress)
    .set({
      status: input.status,
      completedAt: input.status === "done" ? new Date() : null,
      updatedAt: new Date(),
    })
    .where(eq(authoringProgress.id, input.progressId));

  return { success: true };
}

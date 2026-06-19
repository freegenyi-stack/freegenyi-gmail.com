import { db } from "@/db";
import { authoringAssignments, authoringProgress, authoringResources, children, users } from "@/db/schema";
import { notifyUser } from "@/lib/messaging/notify";
import { isFamilyAdult } from "@/lib/family/constants";
import { eq, inArray, and, ne } from "drizzle-orm";

export async function notifyAuthoringAssignment(opts: {
  assignmentId: number;
  resourceTitle: string;
  resourceKind: string;
  teacherId: number;
  childIds: number[];
  note?: string | null;
  locale?: string;
}): Promise<void> {
  const { assignmentId, resourceTitle, resourceKind, teacherId, childIds, note, locale = "fr" } = opts;
  const isAr = locale.startsWith("ar");
  const kindLabel = isAr
    ? resourceKind === "h5p" || resourceKind === "activity"
      ? "نشاط"
      : "مستند"
    : resourceKind === "h5p" || resourceKind === "activity"
      ? "Activité"
      : "Document";

  const title = isAr ? "مهمة جديدة من الأستاذ" : "Nouvelle mission de classe";
  const body = isAr
    ? `${kindLabel} : ${resourceTitle}${note ? ` — ${note}` : ""}`
    : `${kindLabel} : ${resourceTitle}${note ? ` — ${note}` : ""}`;
  const link = `/dashboard/parent/atelier?assignment=${assignmentId}`;

  const childRows =
    childIds.length > 0
      ? await db
          .select({ parentId: children.parentId, familyId: children.familyId })
          .from(children)
          .where(inArray(children.id, childIds))
      : [];

  const parentIds = new Set<number>();
  const familyIds = new Set<string>();
  for (const c of childRows) {
    if (c.parentId) parentIds.add(c.parentId);
    if (c.familyId) familyIds.add(String(c.familyId));
  }

  const notified = new Set<number>();

  if (parentIds.size > 0) {
    const parents = await db
      .select({ id: users.id })
      .from(users)
      .where(and(inArray(users.id, [...parentIds]), ne(users.id, teacherId)));

    for (const p of parents) {
      await notifyUser({
        recipientUserId: p.id,
        type: "system",
        title,
        content: body,
        link,
        locale,
        push: true,
      });
      notified.add(p.id);
    }
  }

  if (familyIds.size > 0) {
    const coparents = await db
      .select({ id: users.id, familyId: users.familyId, role: users.role })
      .from(users)
      .where(and(eq(users.role, "coparent"), ne(users.id, teacherId)));

    for (const cp of coparents) {
      if (!cp.familyId || !familyIds.has(String(cp.familyId)) || notified.has(cp.id)) continue;
      if (!isFamilyAdult(cp.role)) continue;
      await notifyUser({
        recipientUserId: cp.id,
        type: "system",
        title,
        content: body,
        link,
        locale,
        push: true,
      });
    }
  }
}

export async function notifyAuthoringAssignmentReminder(opts: {
  progressId: number;
  teacherId: number;
  locale?: string;
}): Promise<{ success: true } | { error: string }> {
  const { progressId, teacherId, locale = "fr" } = opts;
  const isAr = locale.startsWith("ar");

  const [row] = await db
    .select({
      progressId: authoringProgress.id,
      status: authoringProgress.status,
      childId: authoringProgress.childId,
      childName: children.fullName,
      parentId: children.parentId,
      resourceTitle: authoringResources.title,
      resourceKind: authoringResources.kind,
      assignmentId: authoringAssignments.id,
      note: authoringAssignments.note,
    })
    .from(authoringProgress)
    .innerJoin(authoringAssignments, eq(authoringProgress.assignmentId, authoringAssignments.id))
    .innerJoin(authoringResources, eq(authoringAssignments.resourceId, authoringResources.id))
    .innerJoin(children, eq(authoringProgress.childId, children.id))
    .where(
      and(eq(authoringProgress.id, progressId), eq(authoringAssignments.assignedByUserId, teacherId))
    )
    .limit(1);

  if (!row) return { error: "not_found" };
  if (row.status === "done") return { error: "already_done" };

  const parentIds = new Set<number>();
  if (row.parentId) parentIds.add(row.parentId);

  if (parentIds.size === 0) {
    const [childRow] = await db
      .select({ familyId: children.familyId })
      .from(children)
      .where(eq(children.id, row.childId))
      .limit(1);
    if (childRow?.familyId) {
      const adults = await db
        .select({ id: users.id, role: users.role })
        .from(users)
        .where(eq(users.familyId, childRow.familyId));
      for (const u of adults) {
        if (isFamilyAdult(u.role) && u.id !== teacherId) parentIds.add(u.id);
      }
    }
  }

  if (parentIds.size === 0) return { error: "no_parent" };

  const kindLabel = isAr
    ? row.resourceKind === "h5p" || row.resourceKind === "activity"
      ? "نشاط"
      : "مستند"
    : row.resourceKind === "h5p" || row.resourceKind === "activity"
      ? "Activité"
      : "Document";

  const title = isAr ? "تذكير — مهمة لم تُنجَز بعد" : "Rappel — mission non terminée";
  const body = isAr
    ? `${kindLabel} « ${row.resourceTitle} » — ${row.childName}${row.note ? ` (${row.note})` : ""}`
    : `${kindLabel} « ${row.resourceTitle} » — ${row.childName}${row.note ? ` (${row.note})` : ""}`;
  const link = `/dashboard/parent/atelier?assignment=${row.assignmentId}`;

  for (const parentId of parentIds) {
    await notifyUser({
      recipientUserId: parentId,
      type: "system",
      title,
      content: body,
      link,
      locale,
      push: true,
    });
  }

  return { success: true };
}

import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq, ne, and } from "drizzle-orm";
import { isFamilyAdult } from "@/lib/family/constants";
import type { MessagingUser } from "./session";

function teacherSchoolId(meta: Record<string, unknown>): number | null {
  const raw = meta.teacherSchoolId ?? meta.schoolId;
  if (raw == null || raw === "") return null;
  const n = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  return Number.isNaN(n) ? null : n;
}

export async function getSchoolIdsForUser(user: MessagingUser): Promise<number[]> {
  const role = user.role || "parent";

  if (role === "enseignant" || role === "ecole") {
    const sid = teacherSchoolId(user.metadata);
    return sid ? [sid] : [];
  }

  if (isFamilyAdult(role)) {
    const familyChildren = user.familyId
      ? await db.select({ schoolId: children.schoolId }).from(children).where(eq(children.familyId, user.familyId))
      : await db.select({ schoolId: children.schoolId }).from(children).where(eq(children.parentId, user.id));

    const ids = familyChildren
      .map((c) => c.schoolId)
      .filter((id): id is number => id != null && !Number.isNaN(id));
    return [...new Set(ids)];
  }

  return [];
}

export async function canUsersMessage(
  a: MessagingUser,
  b: MessagingUser
): Promise<{ allowed: boolean; schoolId?: number }> {
  if (a.id === b.id) return { allowed: false };

  const roleA = a.role || "parent";
  const roleB = b.role || "parent";

  if (isFamilyAdult(roleA) && isFamilyAdult(roleB) && a.familyId && a.familyId === b.familyId) {
    return { allowed: true };
  }

  const schoolsA = await getSchoolIdsForUser(a);
  const schoolsB = await getSchoolIdsForUser(b);

  const isTeacherA = roleA === "enseignant" || roleA === "ecole";
  const isTeacherB = roleB === "enseignant" || roleB === "ecole";
  const isParentA = isFamilyAdult(roleA);
  const isParentB = isFamilyAdult(roleB);

  if (isTeacherA && isTeacherB) {
    const shared = schoolsA.find((id) => schoolsB.includes(id));
    if (shared) return { allowed: true, schoolId: shared };
  }

  if (isParentA && isTeacherB) {
    const shared = schoolsA.find((id) => schoolsB.includes(id));
    if (shared) return { allowed: true, schoolId: shared };
  }

  if (isTeacherA && isParentB) {
    const shared = schoolsB.find((id) => schoolsA.includes(id));
    if (shared) return { allowed: true, schoolId: shared };
  }

  return { allowed: false };
}

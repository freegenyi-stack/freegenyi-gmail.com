import { db } from "@/db";
import { users, children, invitations, organizationVerifications } from "@/db/schema";
import { eq, and, inArray, or } from "drizzle-orm";
import { randomBytes } from "crypto";
import { isFamilyAdult } from "./constants";

export function generateFamilyId(): string {
  return `fam_${randomBytes(12).toString("hex")}`;
}

export function generateInviteToken(): string {
  return randomBytes(24).toString("hex");
}

export function generatePairingCode(): string {
  return randomBytes(4).toString("hex").toUpperCase().slice(0, 8);
}

export function generateDeviceToken(): string {
  return randomBytes(32).toString("hex");
}

/** Assure un familyId pour un adulte (rétrocompatibilité). */
export async function ensureUserFamilyId(userId: number): Promise<string> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) throw new Error("USER_NOT_FOUND");
  if (user.familyId) return user.familyId;

  const familyId = generateFamilyId();
  await db
    .update(users)
    .set({ familyId, updatedAt: new Date() })
    .where(eq(users.id, userId));

  await db
    .update(children)
    .set({ familyId, updatedAt: new Date() })
    .where(eq(children.parentId, userId));

  return familyId;
}

export async function getFamilyMemberIds(familyId: string): Promise<number[]> {
  const members = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.familyId, familyId));
  return members.map((m) => m.id);
}

export async function getFamilyChildren(user: { id: number; familyId: string | null }) {
  if (user.familyId) {
    const byFamily = await db
      .select()
      .from(children)
      .where(eq(children.familyId, user.familyId));
    if (byFamily.length > 0) return byFamily;
  }
  return db.select().from(children).where(eq(children.parentId, user.id));
}

export async function userCanAccessChild(
  user: { id: number; familyId: string | null; role: string | null },
  child: { parentId: number; familyId: string | null }
): Promise<boolean> {
  if (!isFamilyAdult(user.role)) return false;
  if (child.parentId === user.id) return true;
  if (user.familyId && child.familyId && user.familyId === child.familyId) return true;
  if (user.familyId) {
    const memberIds = await getFamilyMemberIds(user.familyId);
    return memberIds.includes(child.parentId);
  }
  return false;
}

/** Parent titulaire : identité soumise à l'inscription. Coparent : doit compléter plus tard. */
export async function isAdultProfileComplete(userId: number, role: string | null): Promise<boolean> {
  if (role === "parent") return true;
  if (role === "coparent") {
    const [verification] = await db
      .select({ id: organizationVerifications.id })
      .from(organizationVerifications)
      .where(
        and(
          eq(organizationVerifications.userId, userId),
          or(
            eq(organizationVerifications.orgType, "coparent"),
            eq(organizationVerifications.orgType, "parent")
          )
        )
      )
      .limit(1);
    return !!verification;
  }
  return true;
}

export async function getInvitationByToken(token: string) {
  const [inv] = await db
    .select()
    .from(invitations)
    .where(and(eq(invitations.token, token), eq(invitations.status, "pending")))
    .limit(1);
  return inv ?? null;
}

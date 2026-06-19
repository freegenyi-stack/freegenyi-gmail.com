import { db } from "@/db";
import { users, children, childPairingCodes } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  generatePairingCode,
  userCanAccessChild,
  isAdultProfileComplete,
} from "@/lib/family/server";

function pairingExpiry() {
  return new Date(Date.now() + 1000 * 60 * 10);
}

export async function createChildPairingCodeForUser(
  userId: number,
  childId: number
): Promise<{ code: string; expiresAt: string } | { error: string; code?: string }> {
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return { error: "Non autorisé.", code: "unauthorized" };

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return { error: "Enfant introuvable.", code: "not_found" };

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) return { error: "Accès refusé.", code: "forbidden" };

  const profileOk = await isAdultProfileComplete(userId, user.role);
  if (!profileOk) return { error: "Complétez votre profil d'abord.", code: "profile_incomplete" };

  const code = generatePairingCode();
  const expiresAt = pairingExpiry();

  await db.insert(childPairingCodes).values({ childId, code, expiresAt });

  return { code, expiresAt: expiresAt.toISOString() };
}

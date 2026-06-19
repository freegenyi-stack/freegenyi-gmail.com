import { db } from "@/db";
import { children } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { userCanAccessChild, isAdultProfileComplete } from "@/lib/family/server";
import {
  parseChildLearningProfileJson,
  serializeChildLearningProfile,
  type ChildLearningProfile,
} from "@/lib/child/learning-profile";
import type { users } from "@/db/schema";

export async function setChildPinForUser(
  user: typeof users.$inferSelect,
  childId: number,
  pin: string
): Promise<{ ok: true } | { error: string; code: string }> {
  if (!/^\d{4}$/.test(pin)) {
    return { error: "Le code doit contenir 4 chiffres.", code: "invalid_pin_format" };
  }

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return { error: "Enfant introuvable.", code: "not_found" };

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) return { error: "Accès refusé.", code: "forbidden" };

  const profileOk = await isAdultProfileComplete(user.id, user.role);
  if (!profileOk) return { error: "Complétez votre profil.", code: "profile_incomplete" };

  const hash = await bcrypt.hash(pin, 10);
  await db
    .update(children)
    .set({ accessPinHash: hash, updatedAt: new Date() })
    .where(eq(children.id, childId));

  return { ok: true };
}

export async function updateChildLearningProfileForUser(
  user: typeof users.$inferSelect,
  childId: number,
  patch: Partial<Pick<ChildLearningProfile, "learningMode" | "dailyScreenMinutes">>
): Promise<{ ok: true; profile: ChildLearningProfile } | { error: string; code: string }> {
  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return { error: "Enfant introuvable.", code: "not_found" };

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) return { error: "Accès refusé.", code: "forbidden" };

  const current = parseChildLearningProfileJson(child.learningProfile);
  const next: ChildLearningProfile = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };

  await db
    .update(children)
    .set({
      learningProfile: serializeChildLearningProfile(next),
      updatedAt: new Date(),
    })
    .where(eq(children.id, childId));

  return { ok: true, profile: next };
}

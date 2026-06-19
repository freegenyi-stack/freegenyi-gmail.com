"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isFamilyAdult } from "@/lib/family/constants";
import type { ParentPreferences } from "@/lib/parent/parent-settings";

export async function updateParentPreferencesAction(prefs: ParentPreferences) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) return { error: "Non autorisé." };

  let meta: Record<string, unknown> = {};
  if (user.metadata?.trim()) {
    try {
      meta = JSON.parse(user.metadata) as Record<string, unknown>;
    } catch {
      meta = {};
    }
  }

  meta.parentPreferences = prefs;

  try {
    await db
      .update(users)
      .set({ metadata: JSON.stringify(meta), updatedAt: new Date() })
      .where(eq(users.id, userId));

    revalidatePath("/[locale]/dashboard/parent/reglages", "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating parent preferences:", error);
    return { error: "Erreur lors de la mise à jour." };
  }
}

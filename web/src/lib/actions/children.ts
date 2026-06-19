"use server";

import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq, and, or } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  ensureUserFamilyId,
  isAdultProfileComplete,
  userCanAccessChild,
} from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { regenerateSuggestionsForUser, refreshSchoolMessagingGraph } from "@/lib/messaging/suggestions.server";
import { getMessagingUserById } from "@/lib/messaging/session";
import {
  serializeChildLearningProfile,
  type ChildLearningProfile,
} from "@/lib/child/learning-profile";

export async function addChildAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) return { error: "Non autorisé." };

  const profileOk = await isAdultProfileComplete(userId, user.role);
  if (!profileOk) {
    return { error: "Complétez votre profil pour ajouter un enfant." };
  }

  const firstName = formData.get("prenom") as string;
  const lastName = formData.get("nom") as string;
  const birthDate = formData.get("naissance") as string;
  const gradeLevel = formData.get("niveau") as string;
  const schoolIdRaw = formData.get("schoolId") as string | null;
  const schoolName = (formData.get("schoolName") as string) || null;
  const schoolId = schoolIdRaw ? parseInt(schoolIdRaw, 10) : null;

  if (!firstName || !lastName || !birthDate || !gradeLevel) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  try {
    const familyId = await ensureUserFamilyId(userId);
    const defaultProfile = serializeChildLearningProfile({
      conditionIds: [],
      questionnaire: {},
      learningMode: "semi_guided",
      dailyScreenMinutes: 20,
      updatedAt: new Date().toISOString(),
    });

    await db.insert(children).values({
      parentId: userId,
      familyId,
      fullName: `${firstName} ${lastName}`,
      birthDate: birthDate,
      educationLevel: gradeLevel,
      schoolId: schoolId && !Number.isNaN(schoolId) ? schoolId : null,
      schoolName,
      learningProfile: defaultProfile,
    });

    try {
      const messagingUser = await getMessagingUserById(userId);
      if (messagingUser && schoolId && !Number.isNaN(schoolId)) {
        await refreshSchoolMessagingGraph(schoolId, "fr");
      } else if (messagingUser) {
        await regenerateSuggestionsForUser(messagingUser);
      }
    } catch (e) {
      console.warn("Suggestions messagerie (non bloquant):", e);
    }

    revalidatePath("/[locale]/dashboard/children", "page");
    revalidatePath("/[locale]/dashboard/parent", "page");
    return { success: true };
  } catch (error) {
    console.error("Error adding child:", error);
    return { error: "Erreur lors de la création du profil." };
  }
}

export async function deleteChildAction(childId: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) return { error: "Non autorisé." };

  const profileOk = await isAdultProfileComplete(userId, user.role);
  if (!profileOk) {
    return { error: "Complétez votre profil pour modifier les enfants." };
  }

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) return { error: "Accès refusé." };

  try {
    await db.delete(children).where(eq(children.id, childId));

    revalidatePath("/[locale]/dashboard/children", "page");
    revalidatePath("/[locale]/dashboard/parent", "page");
    return { success: true };
  } catch (error) {
    console.error("Error deleting child:", error);
    return { error: "Erreur lors de la suppression." };
  }
}

export async function updateChildLearningProfileAction(
  childId: number,
  profile: ChildLearningProfile
) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) return { error: "Non autorisé." };

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) return { error: "Accès refusé." };

  try {
    await db
      .update(children)
      .set({
        learningProfile: serializeChildLearningProfile(profile),
        updatedAt: new Date(),
      })
      .where(eq(children.id, childId));

    revalidatePath("/[locale]/dashboard/children", "page");
    revalidatePath("/[locale]/dashboard/parent", "page");
    revalidatePath("/[locale]/dashboard/parent/reglages", "page");
    return { success: true };
  } catch (error) {
    console.error("Error updating child learning profile:", error);
    return { error: "Erreur lors de la mise à jour." };
  }
}

export async function logChildScreenTimeAction(childId: number, minutesToday: number) {
  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };

  const { activityLogs } = await import("@/db/schema");
  await db.insert(activityLogs).values({
    userId: child.parentId,
    category: "child_session",
    action: "screen_time",
    metadata: JSON.stringify({ childId, minutesToday, date: new Date().toISOString().slice(0, 10) }),
  });

  return { success: true };
}

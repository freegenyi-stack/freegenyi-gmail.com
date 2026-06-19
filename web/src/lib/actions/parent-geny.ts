"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { userCanAccessChild } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import {
  generateGenyExerciseSet,
  type GenyExerciseSet,
} from "@/lib/parent/geny-exercise-generator.server";
import { analyzeChildWeaknesses } from "@/lib/parent/printable-workbook.server";
import {
  listParentWorksheets,
  markWorksheetDone,
  saveParentWorksheet,
} from "@/lib/parent/parent-worksheets.server";
import { notifyUser } from "@/lib/messaging/notify";
import { regenerateSuggestionsForUser, refreshSchoolMessagingGraph } from "@/lib/messaging/suggestions.server";
import { getMessagingUserById } from "@/lib/messaging/session";

export async function generateGenyExercisesAction(input: {
  childId: number;
  count?: number;
  subjectHint?: string;
}): Promise<{ error?: string; sets?: GenyExerciseSet[] }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) return { error: "Non autorisé." };

  const [child] = await db.select().from(children).where(eq(children.id, input.childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };
  if (!(await userCanAccessChild(user, child))) return { error: "Accès refusé." };

  const weaknesses = await analyzeChildWeaknesses(input.childId, 8);
  const sets = generateGenyExerciseSet({
    weaknesses,
    educationLevel: child.educationLevel,
    count: input.count ?? 3,
  });

  return { sets };
}

export async function assignGenyWorksheetAction(input: {
  childId: number;
  sets: GenyExerciseSet[];
  note?: string;
  locale?: string;
}): Promise<{ error?: string; worksheetId?: number }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) return { error: "Non autorisé." };

  const [child] = await db.select().from(children).where(eq(children.id, input.childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };
  if (!(await userCanAccessChild(user, child))) return { error: "Accès refusé." };
  if (!input.sets?.length) return { error: "Aucun exercice à assigner." };

  const record = await saveParentWorksheet({
    parentUserId: userId,
    childId: input.childId,
    childName: child.fullName,
    sets: input.sets,
    note: input.note,
  });

  const locale = input.locale || "fr";
  const title = locale.startsWith("ar") ? "تمرين جديد من الوالدين" : "Nouvel exercice de vos parents";
  const content = locale.startsWith("ar")
    ? `${input.sets.length} تمرين(ات) في انتظار ${child.fullName.split(" ")[0]}`
    : `${input.sets.length} exercice(s) pour ${child.fullName.split(" ")[0]} — ouvrez le lobby enfant.`;

  try {
    await notifyUser({
      recipientUserId: userId,
      type: "achievement",
      title,
      content,
      link: `/lobby/${input.childId}/geny`,
      locale,
      push: true,
      pushCategory: "news",
    });
  } catch (e) {
    console.warn("Notify worksheet (non bloquant):", e);
  }

  revalidatePath("/[locale]/dashboard/parent/atelier", "page");
  revalidatePath("/[locale]/lobby/[childId]", "page");
  return { worksheetId: record.id };
}

export async function completeGenyWorksheetAction(worksheetId: number, childId?: number): Promise<{ error?: string }> {
  const session = await auth();
  let allowedChildId: number | undefined;

  if (childId !== undefined) {
    const { getChildSessionFromCookies } = await import("@/lib/child-session");
    const childSession = await getChildSessionFromCookies();
    if (childSession?.childId === childId) allowedChildId = childId;
  }

  if (!allowedChildId && session?.user?.id) {
    const userId = parseInt(session.user.id, 10);
    const { db } = await import("@/db");
    const { activityLogs } = await import("@/db/schema");
    const { eq } = await import("drizzle-orm");
    const [row] = await db.select().from(activityLogs).where(eq(activityLogs.id, worksheetId)).limit(1);
    if (!row || row.userId !== userId) return { error: "Exercice introuvable." };
    const ok = await markWorksheetDone(worksheetId);
    if (!ok) return { error: "Exercice introuvable." };
    revalidatePath("/[locale]/dashboard/parent/historique", "page");
    revalidatePath("/[locale]/lobby/[childId]/geny", "page");
    return {};
  }

  if (allowedChildId) {
    const ok = await markWorksheetDone(worksheetId, allowedChildId);
    if (!ok) return { error: "Exercice introuvable." };
    revalidatePath("/[locale]/lobby/[childId]/geny", "page");
    return {};
  }

  return { error: "Non autorisé" };
}

export async function listGenyWorksheetsAction(): Promise<{ error?: string; worksheets?: Awaited<ReturnType<typeof listParentWorksheets>> }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const worksheets = await listParentWorksheets(userId);
  return { worksheets };
}

export async function updateChildSchoolAction(input: {
  childId: number;
  schoolId: number | null;
  schoolName: string | null;
  locale?: string;
}): Promise<{ error?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) return { error: "Non autorisé." };

  const [child] = await db.select().from(children).where(eq(children.id, input.childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };
  if (!(await userCanAccessChild(user, child))) return { error: "Accès refusé." };

  const prevSchoolId = child.schoolId;

  await db
    .update(children)
    .set({
      schoolId: input.schoolId,
      schoolName: input.schoolName,
      updatedAt: new Date(),
    })
    .where(eq(children.id, input.childId));

  try {
    const messagingUser = await getMessagingUserById(userId);
    const locale = input.locale || "fr";
    if (messagingUser) {
      if (input.schoolId) await refreshSchoolMessagingGraph(input.schoolId, locale);
      if (prevSchoolId && prevSchoolId !== input.schoolId) {
        await refreshSchoolMessagingGraph(prevSchoolId, locale);
      }
      await regenerateSuggestionsForUser(messagingUser);
    }
  } catch (e) {
    console.warn("Sync école messagerie (non bloquant):", e);
  }

  revalidatePath("/[locale]/dashboard/children", "page");
  revalidatePath("/[locale]/dashboard/parent", "page");
  revalidatePath("/[locale]/dashboard/messages", "page");
  revalidatePath("/[locale]/dashboard/parent/mur", "page");
  return {};
}

export async function getChildScreenTimeCloudAction(childId: number): Promise<{ minutesToday?: number; error?: string }> {
  const session = await auth();
  const { getChildScreenTimeMinutes } = await import("@/lib/parent/parent-worksheets.server");

  if (session?.user?.id) {
    const userId = parseInt(session.user.id, 10);
    const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
    const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
    if (user && child && (await userCanAccessChild(user, child))) {
      const minutesToday = await getChildScreenTimeMinutes(childId);
      return { minutesToday };
    }
  }

  const { getChildSessionFromCookies } = await import("@/lib/child-session");
  const childSession = await getChildSessionFromCookies();
  if (childSession?.childId === childId) {
    const minutesToday = await getChildScreenTimeMinutes(childId);
    return { minutesToday };
  }

  return { error: "Non autorisé" };
}

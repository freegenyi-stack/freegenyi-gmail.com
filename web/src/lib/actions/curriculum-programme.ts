"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userCanAccessChild } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { buildProgramSectionDetail } from "@/lib/curriculum/hub.server";
import {
  assignCurriculumSession,
  pickCompetencyWithExercises,
} from "@/lib/curriculum/assign.server";
import { loadBundleFromFiles } from "@/lib/curriculum/loader.server";
import { notifyUser } from "@/lib/messaging/notify";
import type { CurriculumSubject } from "@/lib/curriculum/types";

async function requireParent() {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" as const };
  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) return { error: "Non autorisé" as const };
  return { user, userId };
}

export async function sendSectionExercisesAction(input: {
  childId: number;
  maqtaId: string;
  subject: CurriculumSubject;
  competencyId?: string;
  itemsCount?: number;
  locale?: string;
}): Promise<{ error?: string; sessionKey?: string }> {
  const authResult = await requireParent();
  if ("error" in authResult) return authResult;

  const [child] = await db.select().from(children).where(eq(children.id, input.childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };
  if (!(await userCanAccessChild(authResult.user, child))) return { error: "Accès refusé." };

  const detail = await buildProgramSectionDetail("DZ", "1AP", input.subject, input.maqtaId);
  if (!detail) return { error: "Section introuvable." };

  const bundle = await loadBundleFromFiles("DZ", "1AP", input.subject);
  const competencyId =
    input.competencyId ?? pickCompetencyWithExercises(detail, bundle);
  if (!competencyId) return { error: "Aucun exercice disponible pour cette section (scan demain)." };

  const result = await assignCurriculumSession({
    childId: input.childId,
    subject: input.subject,
    competencyId,
    source: "parent_geny",
    maqtaId: input.maqtaId,
    assignedByUserId: authResult.userId,
    assignedByRole: "parent",
    itemsMin: Math.min(input.itemsCount ?? 4, 6),
    itemsMax: Math.min(input.itemsCount ?? 6, 8),
  });

  if (result.error) return { error: result.error };

  const locale = input.locale ?? "fr";
  try {
    await notifyUser({
      recipientUserId: authResult.userId,
      type: "achievement",
      title: locale.startsWith("ar") ? "تمرين جديد" : "Nouveaux exercices",
      content: locale.startsWith("ar")
        ? `تم إرسال تمارين إلى ${child.fullName.split(" ")[0]}`
        : `Exercices envoyés à ${child.fullName.split(" ")[0]} — parcours officiel.`,
      link: `/lobby/${input.childId}`,
      locale,
      push: true,
      pushCategory: "news",
    });
  } catch {
    /* non bloquant */
  }

  revalidatePath("/[locale]/dashboard/parent/programme", "page");
  return { sessionKey: result.sessionKey };
}

export async function teacherAssignSectionAction(input: {
  childId: number;
  maqtaId: string;
  subject: CurriculumSubject;
  competencyId?: string;
  itemsCount?: number;
}): Promise<{ error?: string; sessionKey?: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.role !== "teacher") return { error: "Réservé aux enseignants." };

  const [child] = await db.select().from(children).where(eq(children.id, input.childId)).limit(1);
  if (!child) return { error: "Élève introuvable." };

  const detail = await buildProgramSectionDetail("DZ", "1AP", input.subject, input.maqtaId);
  if (!detail) return { error: "Section introuvable." };

  const bundle = await loadBundleFromFiles("DZ", "1AP", input.subject);
  const competencyId =
    input.competencyId ?? pickCompetencyWithExercises(detail, bundle);
  if (!competencyId) return { error: "Aucun exercice pour cette section." };

  const result = await assignCurriculumSession({
    childId: input.childId,
    subject: input.subject,
    competencyId,
    source: "teacher_quick",
    maqtaId: input.maqtaId,
    assignedByUserId: userId,
    assignedByRole: "teacher",
    itemsMin: input.itemsCount ?? 5,
    itemsMax: Math.min((input.itemsCount ?? 5) + 2, 10),
  });

  if (result.error) return { error: result.error };
  revalidatePath("/[locale]/dashboard/enseignant/programme", "page");
  return { sessionKey: result.sessionKey };
}

export async function sendSectionLessonPlaceholderAction(input: {
  childId: number;
  maqtaId: string;
  locale?: string;
}): Promise<{ error?: string; message?: string }> {
  const authResult = await requireParent();
  if ("error" in authResult) return authResult;

  const [child] = await db.select().from(children).where(eq(children.id, input.childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };
  if (!(await userCanAccessChild(authResult.user, child))) return { error: "Accès refusé." };

  return {
    message:
      input.locale?.startsWith("ar")
        ? "الدرس التفاعلي سيُفعّل بعد المسح غداً."
        : "La leçon interactive sera disponible après le scan demain.",
  };
}

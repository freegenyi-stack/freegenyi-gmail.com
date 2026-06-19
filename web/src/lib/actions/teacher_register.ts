"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import {
  generateTrackingCode,
  saveVerificationDocument,
} from "@/lib/orgVerification.server";
import { upsertPendingVerification } from "@/lib/actions/org_verification";
import { regenerateSuggestionsForUser, refreshSchoolMessagingGraph } from "@/lib/messaging/suggestions.server";
import { getMessagingUserById } from "@/lib/messaging/session";
import { isPasswordStrong } from "@/lib/passwordPolicy";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import {
  MAX_NOTIFICATION_INTERESTS,
  parseNotificationInterestsFromForm,
} from "@/lib/onboarding/interest-topics";
import {
  buildTeacherMetadataFields,
  parseTeacherSubjectsLevelsFromForm,
} from "@/lib/teacher/form-fields";

export async function registerTeacherAction(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const devMode =
    process.env.FREEGENY_DEV_AUTO_APPROVE === "true" ||
    process.env.NODE_ENV === "development";

  const captcha = (formData.get("captcha") as string) || "";
  if (!devMode && captcha !== "1234" && !captcha.trim()) {
    return { error: "Le défi anti-robot est incorrect." };
  }

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const username = (formData.get("username") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const fullName = (formData.get("fullName") as string)?.trim();
  const phone = (formData.get("phone") as string) || "";

  const teacherSchoolId = (formData.get("teacher_school_id") as string) || "";
  const teacherSchoolName = (formData.get("teacher_school_name") as string) || "";
  const teacherBio = (formData.get("teacher_bio") as string) || "";
  const { subjects, levels } = parseTeacherSubjectsLevelsFromForm(formData);
  const notificationInterests = parseNotificationInterestsFromForm(formData);

  if (!email || !username || !password || !fullName) {
    return { error: "Veuillez remplir tous les champs." };
  }
  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }
  if (!isPasswordStrong(password)) {
    return {
      error:
        "Le mot de passe ne respecte pas les critères (8 caractères, majuscule, minuscule, chiffre, symbole).",
    };
  }
  if (!teacherSchoolName.trim()) {
    return { error: "Veuillez sélectionner votre établissement." };
  }
  if (subjects.length === 0) {
    return { error: "Choisissez au moins une matière." };
  }
  if (levels.length === 0) {
    return { error: "Choisissez au moins un niveau." };
  }
  if (notificationInterests.length !== MAX_NOTIFICATION_INTERESTS) {
    return { error: "Choisissez 3 centres d'intérêt pour personnaliser vos notifications." };
  }

  const identityFileCheck = formData.get("doc_identity") as File | null;
  if (!devMode && (!identityFileCheck || identityFileCheck.size === 0)) {
    return { error: "La pièce d'identité est obligatoire." };
  }

  try {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1);

    if (existing.length > 0) {
      return { error: "Cet email ou nom d'utilisateur est déjà utilisé." };
    }

    const trackingCode = generateTrackingCode();
    const metadata = buildTeacherMetadataFields(
      {
        verificationStatus: "pending",
        trackingCode,
      },
      {
        teacherSchoolId,
        teacherSchoolName,
        subjects,
        levels,
        bio: teacherBio,
        notificationInterests,
      }
    );

    const passwordHash = await bcrypt.hash(password, 12);

    const [newUser] = await db.insert(users).values({
      email,
      username,
      fullName,
      phone,
      role: "enseignant",
      passwordHash,
      onboardingStep: 3,
      metadata: JSON.stringify(metadata),
    }).returning({ id: users.id });

    const identityFile = formData.get("doc_identity") as File | null;
    const docs: Record<string, string> = devMode && (!identityFile || identityFile.size === 0)
      ? { devMode: "identity_skipped_for_local_test" }
      : {
          identity: await saveVerificationDocument(newUser.id, "identity", identityFile as File),
        };

    await upsertPendingVerification({
      userId: newUser.id,
      orgType: "enseignant",
      trackingCode,
      institutionSubtype: "identity",
      documents: docs,
    });

    const schoolIdNum = teacherSchoolId ? parseInt(teacherSchoolId, 10) : NaN;
    if (!Number.isNaN(schoolIdNum)) {
      try {
        const locale = (formData.get("locale") as string) || "fr";
        await refreshSchoolMessagingGraph(schoolIdNum, locale);
      } catch (e) {
        console.warn("Suggestions messagerie enseignant (non bloquant):", e);
      }
    }

    return { success: true };
  } catch (error) {
    console.error("registerTeacherAction error:", error);
    return { error: "Une erreur critique est survenue." };
  }
}

export async function completeTeacherOnboardingAction(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Non autorisé." };

  const teacherSchoolId = (formData.get("teacher_school_id") as string) || "";
  const teacherSchoolName = (formData.get("teacher_school_name") as string) || "";
  const teacherBio = (formData.get("teacher_bio") as string) || "";
  const { subjects, levels } = parseTeacherSubjectsLevelsFromForm(formData);
  const notificationInterests = parseNotificationInterestsFromForm(formData);

  if (!teacherSchoolName.trim()) {
    return { error: "Veuillez sélectionner votre établissement." };
  }
  if (subjects.length === 0) {
    return { error: "Choisissez au moins une matière." };
  }
  if (levels.length === 0) {
    return { error: "Choisissez au moins un niveau." };
  }
  if (notificationInterests.length !== MAX_NOTIFICATION_INTERESTS) {
    return { error: "Choisissez 3 centres d'intérêt pour personnaliser vos notifications." };
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user) return { error: "Utilisateur introuvable." };

  const prev = user.metadata ? JSON.parse(user.metadata) : {};

  await db
    .update(users)
    .set({
      role: "enseignant",
      onboardingStep: 4,
      metadata: JSON.stringify(
        buildTeacherMetadataFields(prev, {
          teacherSchoolId,
          teacherSchoolName,
          subjects,
          levels,
          bio: teacherBio,
          notificationInterests,
        })
      ),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  try {
    const schoolIdNum = teacherSchoolId ? parseInt(teacherSchoolId, 10) : NaN;
    if (!Number.isNaN(schoolIdNum)) {
      const locale = (formData.get("locale") as string) || "fr";
      await refreshSchoolMessagingGraph(schoolIdNum, locale);
    } else {
      const messagingUser = await getMessagingUserById(user.id);
      if (messagingUser) await regenerateSuggestionsForUser(messagingUser);
    }
  } catch (e) {
    console.warn("Suggestions enseignant (non bloquant):", e);
  }

  return { success: true };
}

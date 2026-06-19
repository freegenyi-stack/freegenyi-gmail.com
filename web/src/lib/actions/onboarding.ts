"use server";

import { db } from "@/db";
import { users, children } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";
import { auth } from "@/auth";
import {
  generateTrackingCode,
  saveVerificationDocument,
} from "@/lib/orgVerification.server";
import { upsertPendingVerification } from "@/lib/actions/org_verification";
import { generateFamilyId } from "@/lib/family/server";
import { inviteAllyAtRegistration } from "@/lib/family/invite";
import { refreshSchoolMessagingGraph } from "@/lib/messaging/suggestions.server";
import {
  MAX_NOTIFICATION_INTERESTS,
  parseNotificationInterestsFromForm,
} from "@/lib/onboarding/interest-topics";
import {
  parseChildLearningProfileFromForm,
  serializeChildLearningProfile,
} from "@/lib/child/learning-profile";
import {
  buildTeacherMetadataFields,
  parseTeacherSubjectsLevelsFromForm,
} from "@/lib/teacher/form-fields";

export async function submitOnboardingAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Non autorisé" };
    }

    const email = session.user.email;

    const [user] = await db.select().from(users).where(eq(users.email, email));
    if (!user) return { error: "Utilisateur introuvable" };

    const role = formData.get("parent_role") as string;
    const userType = formData.get("user_type") as string;
    const phone = formData.get("phone") as string;
    const fullName = formData.get("full_name") as string;
    const username = formData.get("username") as string;

    const spouseEmail = formData.get("spouse_email") as string;
    const childName = formData.get("child_name") as string;
    const childCountry = formData.get("child_country") as string;
    const childLevel = formData.get("child_level") as string;
    const childAgeStr = formData.get("child_age") as string;
    const childAge = childAgeStr ? parseInt(childAgeStr) : null;
    const childSchool = formData.get("child_school") as string;
    const childRegion = formData.get("child_region") as string;

    const prev = user.metadata ? JSON.parse(user.metadata) : {};
    const notificationInterests =
      userType === "parent" ? parseNotificationInterestsFromForm(formData) : [];

    if (userType === "parent" && notificationInterests.length !== MAX_NOTIFICATION_INTERESTS) {
      return { error: "Choisissez 3 centres d'intérêt pour personnaliser vos notifications." };
    }

    const metadata = JSON.stringify({
      ...prev,
      spouseEmail,
      childRegion,
      childSchool,
      institutionType: childRegion,
      institutionWebsite: childName,
      institutionManager: spouseEmail,
      ...(userType === "parent" ? { notificationInterests } : {}),
    });

    await db
      .update(users)
      .set({
        role: userType || user.role,
        fullName: fullName || user.fullName,
        username: username || user.username,
        phone: phone || null,
        onboardingStep: 4,
        metadata: metadata,
      })
      .where(eq(users.id, user.id));

    if (userType === "parent" && childName && childAge) {
      const birthYear = new Date().getFullYear() - childAge;
      const birthDate = `${birthYear}-01-01`;
      const learningProfile = serializeChildLearningProfile(parseChildLearningProfileFromForm(formData));

      await db.insert(children).values({
        parentId: user.id,
        fullName: childName,
        birthDate: birthDate,
        educationLevel: childLevel,
        learningProfile,
      });
    }

    if (userType === "parent") {
      if (spouseEmail && spouseEmail.includes("@")) {
        console.log(`[ALLIANCE ELITE] Création du lien d'invitation unique (Token) pour le conjoint...`);
        console.log(`[ALLIANCE ELITE] Envoi de l'e-mail d'invitation magique à : ${spouseEmail}`);
      } else {
        console.log(`[ALLIANCE ELITE] Aucun partenaire renseigné. Activation de la jauge d'incomplétude dans le Dashboard.`);
      }
    } else {
      console.log(`[ALLIANCE ELITE] Profil ${userType.toUpperCase()}. L'invitation de collaborateurs (professeurs/bénévoles) se fera directement depuis le Dashboard.`);
    }

    return { success: true };
  } catch (error: unknown) {
    console.error("❌ Onboarding Error:", error);
    return { error: "Erreur lors de la finalisation du profil Elite." };
  }
}

export async function completeGoogleOnboardingAction(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Non autorisé." };

  const devMode =
    process.env.FREEGENY_DEV_AUTO_APPROVE === "true" ||
    process.env.NODE_ENV === "development";

  const userType = (formData.get("user_type") as string) || "parent";
  const username = (formData.get("username") as string)?.toLowerCase().trim();
  const fullName = (formData.get("fullName") as string)?.trim();
  const phone = (formData.get("phone") as string) || "";

  const spouseFirstName = (formData.get("spouse_first_name") as string) || "";
  const spouseEmail = (formData.get("spouse_email") as string) || "";
  const childName = (formData.get("child_name") as string) || "";
  const childLevel = (formData.get("child_level") as string) || "";
  const childAgeStr = formData.get("child_age") as string;
  const childAge = childAgeStr ? parseInt(childAgeStr) : null;
  const childSchool = (formData.get("child_school") as string) || "";
  const childSchoolIdStr = formData.get("child_school_id") as string;
  const childSchoolId = childSchoolIdStr ? parseInt(childSchoolIdStr) : null;
  const childCountry = (formData.get("child_country") as string) || "DZ";
  const childRegion = (formData.get("child_region") as string) || "";

  const teacherSchoolId = (formData.get("teacher_school_id") as string) || "";
  const teacherSchoolName = (formData.get("teacher_school_name") as string) || "";
  const teacherBio = (formData.get("teacher_bio") as string) || "";
  const { subjects, levels } = parseTeacherSubjectsLevelsFromForm(formData);

  if (!username || !fullName) {
    return { error: "Veuillez remplir tous les champs." };
  }

  if (userType === "parent" && !childName.trim()) {
    return { error: "Veuillez remplir tous les champs." };
  }

  if (userType === "enseignant" && !teacherSchoolName.trim()) {
    return { error: "Veuillez sélectionner votre établissement." };
  }

  if (userType === "enseignant" && subjects.length === 0) {
    return { error: "Choisissez au moins une matière." };
  }

  if (userType === "enseignant" && levels.length === 0) {
    return { error: "Choisissez au moins un niveau." };
  }

  const identityFile = formData.get("doc_identity") as File | null;
  if (!devMode && (!identityFile || identityFile.size === 0)) {
    return { error: "La pièce d'identité est obligatoire." };
  }

  try {
    const email = session.user.email.toLowerCase();
    const [user] = await db.select().from(users).where(eq(users.email, email)).limit(1);
    if (!user) return { error: "Utilisateur introuvable." };

    if ((user.onboardingStep ?? 1) >= 4) {
      return { success: true };
    }

    const [usernameConflict] = await db
      .select({ id: users.id })
      .from(users)
      .where(and(eq(users.username, username), ne(users.id, user.id)))
      .limit(1);

    if (usernameConflict) {
      return { error: "Cet identifiant est déjà utilisé." };
    }

    const trackingCode = generateTrackingCode();

    const notificationInterests = parseNotificationInterestsFromForm(formData);

    if (userType === "parent") {
      if (notificationInterests.length !== MAX_NOTIFICATION_INTERESTS) {
        return { error: "Choisissez 3 centres d'intérêt pour personnaliser vos notifications." };
      }

      const familyId = user.familyId || generateFamilyId();
      const metadata = {
        spouseFirstName,
        spouseEmail,
        childCountry,
        childRegion,
        childLevel,
        verificationStatus: "pending",
        trackingCode,
        notificationInterests,
      };

      await db
        .update(users)
        .set({
          username,
          fullName,
          phone: phone || null,
          role: "parent",
          familyId,
          onboardingStep: 4,
          metadata: JSON.stringify(metadata),
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      const age = childAge && childAge > 0 ? childAge : 8;
      const birthYear = new Date().getFullYear() - age;
      const learningProfile = serializeChildLearningProfile(parseChildLearningProfileFromForm(formData));
      await db.insert(children).values({
        parentId: user.id,
        familyId,
        fullName: childName,
        birthDate: `${birthYear}-01-01`,
        educationLevel: childLevel,
        schoolId: childSchoolId,
        schoolName: childSchool,
        learningProfile,
      });

      const docs: Record<string, string> =
        devMode && (!identityFile || identityFile.size === 0)
          ? { devMode: "identity_skipped_for_local_test" }
          : {
              identity: await saveVerificationDocument(user.id, "identity", identityFile as File),
            };

      await upsertPendingVerification({
        userId: user.id,
        orgType: "parent",
        trackingCode,
        institutionSubtype: "identity",
        documents: docs,
      });

      if (spouseEmail && spouseEmail.includes("@")) {
        const locale = (formData.get("locale") as string) || undefined;
        await inviteAllyAtRegistration({
          parentId: user.id,
          familyId,
          spouseEmail,
          inviterName: fullName,
          locale,
        });
      }

      if (childSchoolId && !Number.isNaN(childSchoolId)) {
        try {
          const locale = (formData.get("locale") as string) || "fr";
          await refreshSchoolMessagingGraph(childSchoolId, locale);
        } catch (e) {
          console.warn("Suggestions messagerie onboarding parent (non bloquant):", e);
        }
      }
    } else {
      if (notificationInterests.length !== MAX_NOTIFICATION_INTERESTS) {
        return { error: "Choisissez 3 centres d'intérêt pour personnaliser vos notifications." };
      }

      const prev = user.metadata ? JSON.parse(user.metadata) : {};
      const metadata = buildTeacherMetadataFields(prev, {
        teacherSchoolId,
        teacherSchoolName,
        subjects,
        levels,
        bio: teacherBio,
        notificationInterests,
      });
      metadata.verificationStatus = "pending";
      metadata.trackingCode = trackingCode;

      await db
        .update(users)
        .set({
          username,
          fullName,
          phone: phone || null,
          role: "enseignant",
          onboardingStep: 4,
          metadata: JSON.stringify(metadata),
          updatedAt: new Date(),
        })
        .where(eq(users.id, user.id));

      const docs: Record<string, string> =
        devMode && (!identityFile || identityFile.size === 0)
          ? { devMode: "identity_skipped_for_local_test" }
          : {
              identity: await saveVerificationDocument(user.id, "identity", identityFile as File),
            };

      await upsertPendingVerification({
        userId: user.id,
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
          console.warn("Suggestions messagerie onboarding enseignant (non bloquant):", e);
        }
      }
    }

    return { success: true };
  } catch (error) {
    console.error("completeGoogleOnboardingAction error:", error);
    return { error: "Une erreur critique est survenue." };
  }
}

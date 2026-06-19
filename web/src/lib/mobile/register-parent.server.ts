import { db } from "@/db";
import { users, children, organizationVerifications } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { generateFamilyId } from "@/lib/family/server";
import { generateTrackingCode } from "@/lib/orgVerification.server";
import { inviteAllyAtRegistration } from "@/lib/family/invite";
import { refreshSchoolMessagingGraph } from "@/lib/messaging/suggestions.server";
import { isPasswordStrong } from "@/lib/passwordPolicy";
import { MAX_NOTIFICATION_INTERESTS } from "@/lib/onboarding/interest-topics";
import { serializeChildLearningProfile } from "@/lib/child/learning-profile";
import { encodeMobileParentToken } from "@/lib/mobile/tokens";
import type { MobileParentRegisterPayload, MobileRegisterResult } from "@/lib/mobile/types";

const devMode = () =>
  process.env.FREEGENY_DEV_AUTO_APPROVE === "true" || process.env.NODE_ENV === "development";

export async function registerParentMobile(
  payload: MobileParentRegisterPayload
): Promise<MobileRegisterResult> {
  const email = payload.email?.toLowerCase().trim();
  const username = payload.username?.toLowerCase().trim();
  const password = payload.password;
  const confirmPassword = payload.confirmPassword;
  const fullName = payload.fullName?.trim();
  const phone = payload.phone?.trim() || "";
  const spouseEmail = payload.spouseEmail?.trim() || "";
  const spouseFirstName = payload.spouseFirstName?.trim() || "";
  const childName = payload.childName?.trim();
  const childLevel = payload.childLevel?.trim() || "1AP";
  const childAge = payload.childAge > 0 ? payload.childAge : 8;
  const childSchool = payload.childSchool?.trim() || "";
  const childSchoolId = payload.childSchoolId ?? null;
  const childCountry = payload.childCountry?.trim() || "DZ";
  const childRegion = payload.childRegion?.trim() || "";
  const notificationInterests = payload.notificationInterests ?? [];

  if (!email || !username || !password || !fullName || !childName) {
    return { ok: false, error: "Champs obligatoires manquants.", code: "missing_fields" };
  }

  if (password !== confirmPassword) {
    return { ok: false, error: "Les mots de passe ne correspondent pas.", code: "password_mismatch" };
  }

  if (!isPasswordStrong(password)) {
    return {
      ok: false,
      error:
        "Mot de passe faible (8 car., majuscule, minuscule, chiffre, symbole).",
      code: "weak_password",
    };
  }

  if (notificationInterests.length !== MAX_NOTIFICATION_INTERESTS) {
    return {
      ok: false,
      error: `Choisissez ${MAX_NOTIFICATION_INTERESTS} centres d'intérêt.`,
      code: "interests_required",
    };
  }

  try {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1);

    if (existing.length > 0) {
      return { ok: false, error: "Email ou identifiant déjà utilisé.", code: "already_exists" };
    }

    const familyId = generateFamilyId();
    const metadata = {
      spouseFirstName,
      spouseEmail,
      childCountry,
      childRegion,
      childLevel,
      verificationStatus: "pending",
      notificationInterests,
    };

    const passwordHash = await bcrypt.hash(password, 12);
    const trackingCode = generateTrackingCode();

    const [newUser] = await db
      .insert(users)
      .values({
        email,
        username,
        fullName,
        phone: phone || null,
        role: "parent",
        passwordHash,
        familyId,
        onboardingStep: 4,
        metadata: JSON.stringify({ ...metadata, trackingCode }),
      })
      .returning({ id: users.id });

    const birthYear = new Date().getFullYear() - childAge;
    const learningProfile = serializeChildLearningProfile(payload.learningProfile);

    await db.insert(children).values({
      parentId: newUser.id,
      familyId,
      fullName: childName,
      birthDate: `${birthYear}-01-01`,
      educationLevel: childLevel,
      schoolId: childSchoolId,
      schoolName: childSchool,
      learningProfile,
    });

    const docs = devMode()
      ? { devMode: "identity_skipped_mobile_dev" }
      : { mobilePending: "identity_upload_on_web" };

    await db.insert(organizationVerifications).values({
      userId: newUser.id,
      orgType: "parent",
      trackingCode,
      institutionSubtype: "identity",
      status: devMode() ? "approved" : "pending",
      documents: JSON.stringify(docs),
      reviewedAt: devMode() ? new Date() : null,
      reviewedBy: devMode() ? "dev-auto-approve" : null,
    });

    if (spouseEmail.includes("@")) {
      await inviteAllyAtRegistration({
        parentId: newUser.id,
        familyId,
        spouseEmail,
        inviterName: fullName,
        locale: payload.locale,
      });
    }

    if (childSchoolId && !Number.isNaN(childSchoolId)) {
      try {
        await refreshSchoolMessagingGraph(childSchoolId, payload.locale || "fr");
      } catch (e) {
        console.warn("Suggestions messagerie (non bloquant):", e);
      }
    }

    const accessToken = encodeMobileParentToken(newUser.id);
    return { ok: true, userId: newUser.id, accessToken, trackingCode };
  } catch (e) {
    console.error("registerParentMobile:", e);
    return { ok: false, error: "Erreur lors de l'inscription.", code: "server_error" };
  }
}

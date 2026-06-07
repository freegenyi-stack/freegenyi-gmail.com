"use server";

import { db } from "@/db";
import { users, children, organizationVerifications } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";
import {
  getRequiredNgoDocs,
  getRequiredSchoolDocs,
} from "@/lib/orgVerification.shared";
import {
  generateTrackingCode,
  saveVerificationDocument,
} from "@/lib/orgVerification.server";
import { generateFamilyId } from "@/lib/family/server";
import { inviteAllyAtRegistration } from "@/lib/family/invite";
import { isPasswordStrong } from "@/lib/passwordPolicy";
import { refreshSchoolMessagingGraph } from "@/lib/messaging/suggestions.server";

/**
 * Check if an email or username is already taken
 */
export async function checkUserAvailability(field: "email" | "username", value: string) {
  const normalized = value?.trim().toLowerCase();
  if (!normalized) return { available: true };

  try {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(field === "email" ? users.email : users.username, normalized))
      .limit(1);
    
    return { available: existing.length === 0 };
  } catch (error) {
    return { error: "Erreur de vérification" };
  }
}

async function processOrgDocuments(
  userId: number,
  userType: "ecole" | "ong",
  formData: FormData,
  institutionType: string,
  privateDocType: string
): Promise<Record<string, string>> {
  const docs: Record<string, string> = {};

  if (userType === "ecole") {
    const required = getRequiredSchoolDocs(institutionType, privateDocType);
    for (const key of required) {
      const file = formData.get(`doc_${key}`) as File | null;
      if (!file || file.size === 0) {
        throw new Error(`DOCUMENT_MISSING:${key}`);
      }
      docs[key] = await saveVerificationDocument(userId, key, file);
    }
  } else {
    const required = getRequiredNgoDocs();
    for (const key of required) {
      const file = formData.get(`doc_${key}`) as File | null;
      if (!file || file.size === 0) {
        throw new Error(`DOCUMENT_MISSING:${key}`);
      }
      docs[key] = await saveVerificationDocument(userId, key, file);
    }
  }

  return docs;
}

/**
 * Register a new user with strict validations
 * Handles 3 user types: parent, ecole, ong
 */
export async function registerEliteAction(
  formData: FormData,
  captchaAnswer: number,
  expectedAnswer: number
): Promise<{ success: true; trackingCode?: string } | { success?: false; error: string }> {
  if (captchaAnswer !== expectedAnswer) {
    return { error: "Le défi anti-robot est incorrect." };
  }

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const username = (formData.get("username") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const fullName = formData.get("fullName") as string;
  const userType = (formData.get("user_type") as string) || "parent";
  const phone = formData.get("phone") as string;

  const spouseFirstName = (formData.get("spouse_first_name") as string) || "";
  const spouseEmail = (formData.get("spouse_email") as string) || "";
  const childName = (formData.get("child_name") as string) || "";
  const childLevel = (formData.get("child_level") as string) || "";
  const childAgeStr = formData.get("child_age") as string;
  const childAge = childAgeStr ? parseInt(childAgeStr) : null;
  const childSchool = (formData.get("child_school") as string) || "";
  const childSchoolIdStr = formData.get("child_school_id") as string;
  const childSchoolId = childSchoolIdStr ? parseInt(childSchoolIdStr) : null;
  const childCountry = (formData.get("child_country") as string) || "";
  const childRegion = (formData.get("child_region") as string) || "";

  const institutionType = (formData.get("institution_type") as string) || "";
  const institutionAddress = (formData.get("institution_address") as string) || "";
  const institutionManager = (formData.get("institution_manager") as string) || "";
  const institutionWebsite = (formData.get("institution_website") as string) || "";
  const classesCount = (formData.get("classes_count") as string) || "";
  const institutionSchoolId = (formData.get("institution_school_id") as string) || "";
  const institutionSchoolName = (formData.get("institution_school_name") as string) || "";
  const privateDocType = (formData.get("private_doc_type") as string) || "licence";

  const ngoDomain = (formData.get("ngo_domain") as string) || "";
  const ngoAddress = (formData.get("ngo_address") as string) || "";
  const ngoManager = (formData.get("ngo_manager") as string) || "";
  const ngoWebsite = (formData.get("ngo_website") as string) || "";
  const beneficiariesCount = (formData.get("beneficiaries_count") as string) || "";

  const devMode =
    process.env.FREEGENY_DEV_AUTO_APPROVE === "true" ||
    process.env.NODE_ENV === "development";
  const isOrg = userType === "ecole" || userType === "ong";

  if (!email || !username || !password || !fullName) {
    return { error: "Veuillez remplir tous les champs." };
  }

  if (!confirmPassword) {
    return { error: "Veuillez remplir tous les champs." };
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  if (!isPasswordStrong(password)) {
    return { error: "Le mot de passe ne respecte pas les critères (8 caractères, majuscule, minuscule, chiffre, symbole)." };
  }

  if (userType === "parent" && !devMode) {
    const identityFile = formData.get("doc_identity") as File | null;
    if (!identityFile || identityFile.size === 0) {
      return { error: "La pièce d'identité est obligatoire." };
    }
  }

  if (isOrg && !email) {
    return { error: "Téléphone et email obligatoires pour les établissements." };
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

    let metadata: Record<string, string> = {};

    if (userType === "parent") {
      metadata = {
        spouseFirstName,
        spouseEmail,
        childCountry,
        childRegion,
        childLevel,
        verificationStatus: "pending",
      };
    } else if (userType === "ecole") {
      metadata = {
        institutionType,
        institutionAddress,
        institutionManager,
        institutionWebsite,
        classesCount,
        institutionSchoolId,
        institutionSchoolName,
        privateDocType,
        verificationStatus: "pending",
      };
    } else if (userType === "ong") {
      metadata = {
        ngoDomain,
        ngoAddress,
        ngoManager,
        ngoWebsite,
        beneficiariesCount,
        verificationStatus: "pending",
      };
    }

    const passwordHash = await bcrypt.hash(password, 12);
    const trackingCode = isOrg ? generateTrackingCode() : undefined;
    const familyId = userType === "parent" ? generateFamilyId() : null;

    const [newUser] = await db.insert(users).values({
      email,
      username,
      fullName,
      phone,
      role: userType as "parent" | "ecole" | "ong",
      passwordHash,
      familyId: familyId ?? undefined,
      onboardingStep: isOrg ? 3 : 4,
      metadata: JSON.stringify(
        isOrg ? { ...metadata, trackingCode: trackingCode! } : metadata
      ),
    }).returning({ id: users.id });

    if (userType === "parent" && childName) {
      const age = childAge && childAge > 0 ? childAge : 8;
      const birthYear = new Date().getFullYear() - age;
      await db.insert(children).values({
        parentId: newUser.id,
        familyId: familyId!,
        fullName: childName,
        birthDate: `${birthYear}-01-01`,
        educationLevel: childLevel,
        schoolId: childSchoolId,
        schoolName: childSchool,
      });
    }

    if (userType === "parent") {
      const devModeLocal =
        process.env.FREEGENY_DEV_AUTO_APPROVE === "true" ||
        process.env.NODE_ENV === "development";
      const identityFile = formData.get("doc_identity") as File | null;
      const docs: Record<string, string> = devModeLocal && (!identityFile || identityFile.size === 0)
        ? { devMode: "identity_skipped_for_local_test" }
        : {
            identity: await saveVerificationDocument(
              newUser.id,
              "identity",
              identityFile as File
            ),
          };

      const tracking = generateTrackingCode();
      await db.insert(organizationVerifications).values({
        userId: newUser.id,
        orgType: "parent",
        trackingCode: tracking,
        institutionSubtype: "identity",
        status: "pending",
        documents: JSON.stringify(docs),
      });

      await db.update(users).set({
        metadata: JSON.stringify({ ...metadata, trackingCode: tracking }),
        updatedAt: new Date(),
      }).where(eq(users.id, newUser.id));
    }

    if (userType === "parent" && spouseEmail && spouseEmail.includes("@")) {
      const locale = (formData.get("locale") as string) || undefined;
      await inviteAllyAtRegistration({
        parentId: newUser.id,
        familyId: familyId!,
        spouseEmail,
        inviterName: fullName,
        locale,
      });
    }

    if (userType === "parent" && childSchoolId && !Number.isNaN(childSchoolId)) {
      try {
        const locale = (formData.get("locale") as string) || "fr";
        await refreshSchoolMessagingGraph(childSchoolId, locale);
      } catch (e) {
        console.warn("Suggestions messagerie parent (non bloquant):", e);
      }
    }

    if (isOrg) {
      const devMode =
    process.env.FREEGENY_DEV_AUTO_APPROVE === "true" ||
    process.env.NODE_ENV === "development";
      const docs = devMode
        ? { devMode: "documents_skipped_for_local_test" }
        : await processOrgDocuments(
            newUser.id,
            userType as "ecole" | "ong",
            formData,
            institutionType,
            privateDocType
          );

      const subtype =
        userType === "ecole"
          ? institutionType === "Privée"
            ? privateDocType
            : institutionType
          : "ong";

      const [verification] = await db.insert(organizationVerifications).values({
        userId: newUser.id,
        orgType: userType,
        trackingCode: trackingCode!,
        institutionSubtype: subtype,
        status: "pending",
        documents: JSON.stringify(docs),
      }).returning({ id: organizationVerifications.id });

      // Mode test local : approbation automatique
      if (
        process.env.FREEGENY_DEV_AUTO_APPROVE === "true" ||
        process.env.NODE_ENV === "development"
      ) {
        await db.update(organizationVerifications).set({
          status: "approved",
          reviewedAt: new Date(),
          reviewedBy: "dev-auto-approve",
          updatedAt: new Date(),
        }).where(eq(organizationVerifications.id, verification.id));

        await db.update(users).set({
          onboardingStep: 4,
          metadata: JSON.stringify({
            ...metadata,
            trackingCode: trackingCode!,
            verificationStatus: "approved",
          }),
          updatedAt: new Date(),
        }).where(eq(users.id, newUser.id));
      }
    }

    return { success: true, trackingCode };
  } catch (error) {
    console.error("Registration error:", error);
    if (error instanceof Error && error.message.startsWith("DOCUMENT_MISSING:")) {
      const key = error.message.split(":")[1];
      return { error: `Document obligatoire manquant (${key}).` };
    }
    if (error instanceof Error && error.message.includes("Fichier")) {
      return { error: error.message };
    }
    return { error: "Une erreur critique est survenue." };
  }
}

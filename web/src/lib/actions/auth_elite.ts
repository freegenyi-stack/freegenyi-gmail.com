"use server";

import { db } from "@/db";
import { users, children, invitations } from "@/db/schema";
import { eq, or } from "drizzle-orm";
import bcrypt from "bcryptjs";

/**
 * Check if an email or username is already taken
 */
export async function checkUserAvailability(field: "email" | "username", value: string) {
  if (!value) return { available: true };
  
  try {
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(field === "email" ? users.email : users.username, value.toLowerCase()))
      .limit(1);
    
    return { available: existing.length === 0 };
  } catch (error) {
    return { error: "Erreur de vérification" };
  }
}

/**
 * Enhanced Password Validation (Elite Requirements)
 * - 8+ chars
 * - At least one uppercase
 * - At least one number
 * - At least one special character
 */
function isPasswordElite(password: string): boolean {
  const eliteRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
  return eliteRegex.test(password);
}

/**
 * Register a new user with strict validations
 * Handles 3 user types: parent, ecole, ong
 */
export async function registerEliteAction(
  formData: FormData,
  captchaAnswer: number,
  expectedAnswer: number
): Promise<{ success: true } | { success?: false; error: string }> {
  // 1. Captcha Verification
  if (captchaAnswer !== expectedAnswer) {
    return { error: "Le défi anti-robot est incorrect." };
  }

  // ── Common fields ──────────────────────────────────────────────────────────
  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const username = (formData.get("username") as string)?.toLowerCase().trim();
  const password = formData.get("password") as string;
  const confirmPassword = formData.get("confirmPassword") as string;
  const fullName = formData.get("fullName") as string;
  const userType = (formData.get("user_type") as string) || "parent";
  const phone = formData.get("phone") as string;

  // ── Parent-specific fields ─────────────────────────────────────────────────
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

  // ── École-specific fields ──────────────────────────────────────────────────
  const institutionType = (formData.get("institution_type") as string) || "";       // "Privée" | "Publique"
  const institutionAddress = (formData.get("institution_address") as string) || ""; // Adresse complète
  const institutionManager = (formData.get("institution_manager") as string) || ""; // Nom du directeur
  const institutionWebsite = (formData.get("institution_website") as string) || ""; // Site web / réseaux
  const classesCount = (formData.get("classes_count") as string) || "";             // Nombre de classes

  // ── NGO-specific fields ────────────────────────────────────────────────────
  const ngoDomain = (formData.get("ngo_domain") as string) || "";                   // Domaine d'activité
  const ngoAddress = (formData.get("ngo_address") as string) || "";                 // Adresse du siège
  const ngoManager = (formData.get("ngo_manager") as string) || "";                 // Responsable ONG
  const ngoWebsite = (formData.get("ngo_website") as string) || "";                 // Site web / réseaux
  const beneficiariesCount = (formData.get("beneficiaries_count") as string) || ""; // Nb bénéficiaires

  // 2. Basic checks
  if (!email || !username || !password || !confirmPassword || !fullName) {
    return { error: "Veuillez remplir tous les champs." };
  }

  if (password !== confirmPassword) {
    return { error: "Les mots de passe ne correspondent pas." };
  }

  // 3. Password Strength Check
  if (!isPasswordElite(password)) {
    return { error: "Le mot de passe ne respecte pas les critères d'excellence (Majuscule, Chiffre, Symbole)." };
  }

  try {
    // 4. Double check availability in DB
    const existing = await db
      .select({ id: users.id })
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)))
      .limit(1);

    if (existing.length > 0) {
      return { error: "Cet email ou nom d'utilisateur est déjà utilisé." };
    }

    // 5. Build structured metadata per user type
    let metadata: Record<string, string> = {};

    if (userType === "parent") {
      metadata = {
        spouseFirstName,
        spouseEmail,
        childCountry,
        childRegion,
      };
    } else if (userType === "ecole") {
      metadata = {
        institutionType,      // "Privée" | "Publique"
        institutionAddress,   // Adresse complète
        institutionManager,   // Nom du directeur / responsable
        institutionWebsite,   // Site web ou réseaux sociaux
        classesCount,         // Nombre de classes
      };
    } else if (userType === "ong") {
      metadata = {
        ngoDomain,            // Domaine d'activité (Education, Social, Culture, Humanitaire)
        ngoAddress,           // Adresse du siège
        ngoManager,           // Responsable de l'organisation
        ngoWebsite,           // Site web ou réseaux sociaux
        beneficiariesCount,   // Nombre estimé de bénéficiaires
      };
    }

    // 6. Hash and Create User
    const passwordHash = await bcrypt.hash(password, 12);
    
    const [newUser] = await db.insert(users).values({
      email,
      username,
      fullName,
      phone,
      role: userType as any,
      passwordHash,
      onboardingStep: 4, // Fully onboarded
      metadata: JSON.stringify(metadata),
    }).returning({ id: users.id });

    // 7. Insert Child record (for parents only)
    if (userType === "parent" && childName && childAge) {
      const birthYear = new Date().getFullYear() - childAge;
      const birthDate = `${birthYear}-01-01`;

      await db.insert(children).values({
        parentId: newUser.id,
        fullName: childName,
        birthDate,
        educationLevel: childLevel,
        schoolId: childSchoolId,
        schoolName: childSchool,
      });
    }

    // 8. Create real invitation record for spouse / partner (parents only)
    if (userType === "parent" && spouseEmail && spouseEmail.includes("@")) {
      await db.insert(invitations).values({
        parentId: newUser.id,
        invitedEmail: spouseEmail.toLowerCase().trim(),
        role: "partenaire",
        status: "pending",
      });
      console.log(`[INVITATION] ✅ Invitation créée pour ${spouseEmail} (parentId: ${newUser.id})`);
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Une erreur critique est survenue." as string };
  }
}

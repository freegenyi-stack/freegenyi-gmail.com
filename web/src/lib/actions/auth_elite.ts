"use server";

import { db } from "@/db";
import { users, children } from "@/db/schema";
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
 */
export async function registerEliteAction(formData: FormData, captchaAnswer: number, expectedAnswer: number) {
  // 1. Captcha Verification
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
  const spouseEmail = formData.get("spouse_email") as string;
  const childName = formData.get("child_name") as string;
  const childLevel = formData.get("child_level") as string;
  const childAgeStr = formData.get("child_age") as string;
  const childAge = childAgeStr ? parseInt(childAgeStr) : null;
  const childSchool = formData.get("child_school") as string;
  const childSchoolIdStr = formData.get("child_school_id") as string;
  const childSchoolId = childSchoolIdStr ? parseInt(childSchoolIdStr) : null;
  const childRegion = formData.get("child_region") as string;

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

    // Prepare metadata
    const metadata = JSON.stringify({
      spouseEmail,
      childRegion,
      childSchool,
      institutionType: childRegion,
      institutionWebsite: childName,
      institutionManager: spouseEmail,
    });

    // 5. Hash and Create User
    const passwordHash = await bcrypt.hash(password, 12);
    
    const [newUser] = await db.insert(users).values({
      email,
      username,
      fullName,
      phone,
      role: userType as any,
      passwordHash,
      onboardingStep: 4, // Fully onboarded
      metadata,
    }).returning({ id: users.id });

    // 6. Insert Child (for parents)
    if (userType === 'parent' && childName && childAge) {
      const birthYear = new Date().getFullYear() - childAge;
      const birthDate = `${birthYear}-01-01`;

      await db.insert(children).values({
        parentId: newUser.id,
        fullName: childName,
        birthDate: birthDate,
        educationLevel: childLevel,
        schoolId: childSchoolId,
        schoolName: childSchool,
      });
    }

    // 7. Alliance Logic Simulation
    if (userType === 'parent') {
      if (spouseEmail && spouseEmail.includes('@')) {
        console.log(`[ALLIANCE ELITE] Création du lien d'invitation unique (Token) pour le conjoint...`);
        console.log(`[ALLIANCE ELITE] Envoi de l'e-mail d'invitation magique à : ${spouseEmail}`);
      } else {
        console.log(`[ALLIANCE ELITE] Aucun partenaire renseigné. Activation de la jauge d'incomplétude dans le Dashboard.`);
      }
    } else {
      console.log(`[ALLIANCE ELITE] Profil ${userType.toUpperCase()}. L'invitation de collaborateurs se fera depuis le Dashboard.`);
    }

    return { success: true };
  } catch (error) {
    console.error("Registration error:", error);
    return { error: "Une erreur critique est survenue." };
  }
}

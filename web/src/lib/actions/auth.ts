"use server";

import { signIn } from "@/auth";
import { AuthError } from "next-auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";

export async function loginAction(formData: FormData) {
  try {
    const email = formData.get("email");
    const password = formData.get("password");

    if (!email || !password) {
      return { error: "Veuillez remplir tous les champs." };
    }

    await signIn("credentials", {
      email,
      password,
      redirect: false, // On gère la redirection côté client pour plus de fluidité
    });

    // Fetch user to get onboardingStep
    const [user] = await db.select({ onboardingStep: users.onboardingStep }).from(users).where(eq(users.email, email as string));

    return { success: true, onboardingStep: user?.onboardingStep || 1 };
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case "CredentialsSignin":
          return { error: "Identifiants invalides." };
        default:
          return { error: "Une erreur est survenue lors de la connexion." };
      }
    }
    throw error;
  }
}

export async function registerAction(formData: FormData) {
  try {
    const firstName = formData.get("first_name") as string;
    const lastName = formData.get("last_name") as string;
    const email = (formData.get("email") as string)?.toLowerCase();
    const phone = (formData.get("phone") as string) || null;
    const password = formData.get("password") as string;
    const role = (formData.get("role") as string) || "parent";

    // Validation stricte
    if (!firstName || firstName.trim() === "") {
      return { error: "Le prénom est obligatoire." };
    }
    if (!lastName || lastName.trim() === "") {
      return { error: "Le nom est obligatoire." };
    }
    if (!email || !email.includes("@")) {
      return { error: "L'e-mail est invalide." };
    }
    if (!password || password.length < 8) {
      return { error: "Le mot de passe doit contenir au moins 8 caractères." };
    }

    // 1. Vérifier si l'utilisateur existe déjà
    const [existingUser] = await db
      .select()
      .from(users)
      .where(eq(users.email, email));

    if (existingUser) {
      return { error: "Cet e-mail est déjà utilisé." };
    }

    // 2. Crypter le mot de passe (10 rounds = rapide en dev, sécurisé en prod)
    const hashedPassword = await bcrypt.hash(password, 10);

    // 3. Insérer l'utilisateur en base de données
    const [newUser] = await db
      .insert(users)
      .values({
        email,
        passwordHash: hashedPassword,
        fullName: `${firstName.trim()} ${lastName.trim()}`,
        phone: phone || undefined,
        role: role as "parent" | "school" | "ngo" | "admin",
      })
      .returning();

    console.log("✅ Utilisateur créé en base:", newUser.email);

    return { success: true, email };

  } catch (error: any) {
    console.error("❌ Erreur Inscription:", error?.message || error);
    return { error: `Erreur serveur: ${error?.message || "inconnue"}` };
  }
}

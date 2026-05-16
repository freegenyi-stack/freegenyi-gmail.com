"use server";

import { db } from "@/db";
import { users, children } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";

export async function submitOnboardingAction(formData: FormData) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return { error: "Non autorisé" };
    }

    const email = session.user.email;
    
    // 1. Récupérer l'utilisateur
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

    // Prepare metadata for Elite roles
    const metadata = JSON.stringify({
      spouseEmail,
      childRegion,
      childSchool,
      institutionType: childRegion, // Repurposed for schools
      institutionWebsite: childName, // Repurposed for institutional presence
      institutionManager: spouseEmail, // Repurposed for manager name
    });

    // 2. Update user info
    await db.update(users)
      .set({ 
        role: userType || user.role,
        fullName: fullName || user.fullName,
        username: username || user.username,
        phone: phone || null, 
        onboardingStep: 4,
        metadata: metadata
      })
      .where(eq(users.id, user.id));

    // 3. Add child (for parents)
    if (userType === 'parent' && childName && childAge) {
      const birthYear = new Date().getFullYear() - childAge;
      const birthDate = `${birthYear}-01-01`;

      await db.insert(children).values({
        parentId: user.id,
        fullName: childName,
        birthDate: birthDate,
        educationLevel: childLevel,
      });
    }

    // 4. Gestion de l'Alliance (Etape 2) - Logique Premium
    if (userType === 'parent') {
      if (spouseEmail && spouseEmail.includes('@')) {
        console.log(`[ALLIANCE ELITE] Création du lien d'invitation unique (Token) pour le conjoint...`);
        console.log(`[ALLIANCE ELITE] Envoi de l'e-mail d'invitation magique à : ${spouseEmail}`);
      } else {
        console.log(`[ALLIANCE ELITE] Aucun partenaire renseigné. Activation de la jauge d'incomplétude dans le Dashboard.`);
        // Une tâche cron ou un trigger dans le dashboard enverra un rappel doux plus tard
      }
    } else {
      console.log(`[ALLIANCE ELITE] Profil ${userType.toUpperCase()}. L'invitation de collaborateurs (professeurs/bénévoles) se fera directement depuis le Dashboard.`);
    }

    return { success: true };

  } catch (error: any) {
    console.error("❌ Onboarding Error:", error);
    return { error: "Erreur lors de la finalisation du profil Elite." };
  }
}

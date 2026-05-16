"use server";

import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import bcrypt from "bcryptjs";

export async function updateProfileAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const fullName = formData.get("full_name") as string;
  const phone = formData.get("phone") as string;

  if (!fullName) return { error: "Le nom est requis." };

  try {
    await db.update(users)
      .set({ fullName, phone, updatedAt: new Date() })
      .where(eq(users.id, parseInt(session.user.id)));

    revalidatePath("/[locale]/dashboard/settings", "page");
    return { success: "Profil mis à jour avec succès." };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour." };
  }
}

export async function updatePreferencesAction(type: "theme" | "avatar", data: any) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  try {
    const updateData: any = { updatedAt: new Date() };
    if (type === "theme") {
      updateData.themeSettings = JSON.stringify(data);
    } else {
      updateData.avatarConfig = JSON.stringify(data);
    }

    await db.update(users)
      .set(updateData)
      .where(eq(users.id, parseInt(session.user.id)));

    revalidatePath("/[locale]/dashboard/settings", "page");
    return { success: true };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour." };
  }
}

export async function updatePasswordAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const oldPassword = formData.get("old_password") as string;
  const newPassword = formData.get("new_password") as string;
  const confirmPassword = formData.get("confirm_password") as string;

  if (newPassword !== confirmPassword) return { error: "Les mots de passe ne correspondent pas." };
  if (newPassword.length < 6) return { error: "Le mot de passe doit faire au moins 6 caractères." };

  try {
    const [user] = await db.select().from(users).where(eq(users.id, parseInt(session.user.id)));
    
    if (!user?.passwordHash) return { error: "Action non supportée pour ce compte (OAuth)." };

    const isValid = await bcrypt.compare(oldPassword, user.passwordHash);
    if (!isValid) return { error: "L'ancien mot de passe est incorrect." };

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.update(users)
      .set({ passwordHash: hashedPassword, updatedAt: new Date() })
      .where(eq(users.id, parseInt(session.user.id)));

    return { success: "Mot de passe mis à jour avec succès." };
  } catch (error) {
    return { error: "Erreur lors de la mise à jour." };
  }
}

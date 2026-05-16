"use server";

import { db } from "@/db";
import { children } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

export async function addChildAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const firstName = formData.get("prenom") as string;
  const lastName = formData.get("nom") as string;
  const birthDate = formData.get("naissance") as string;
  const gradeLevel = formData.get("niveau") as string;
  const avatarColor = (formData.get("avatar_color") as string) || "#7c3aed";

  if (!firstName || !lastName || !birthDate || !gradeLevel) {
    return { error: "Veuillez remplir tous les champs obligatoires." };
  }

  try {
    const pin = Math.floor(1000 + Math.random() * 9000).toString();
    const alias = firstName.toLowerCase().replace(/\s/g, "") + Math.floor(100 + Math.random() * 899);

    await db.insert(children).values({
      parentId: parseInt(session.user.id),
      fullName: `${firstName} ${lastName}`,
      birthDate: birthDate,
      educationLevel: gradeLevel,
      // Note: we can add gender/interests if needed, but sticking to PHP functional parity
    });

    revalidatePath("/[locale]/dashboard/children", "page");
    revalidatePath("/[locale]/dashboard/parent", "page");
    return { success: true };
  } catch (error) {
    console.error("Error adding child:", error);
    return { error: "Erreur lors de la création du profil." };
  }
}

export async function deleteChildAction(childId: number) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  try {
    await db.delete(children).where(
      and(
        eq(children.id, childId),
        eq(children.parentId, parseInt(session.user.id))
      )
    );

    revalidatePath("/[locale]/dashboard/children", "page");
    revalidatePath("/[locale]/dashboard/parent", "page");
    return { success: true };
  } catch (error) {
    console.error("Error deleting child:", error);
    return { error: "Erreur lors de la suppression." };
  }
}

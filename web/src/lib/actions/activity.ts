"use server";

import { db } from "@/db";
import { activityLogs, invitations } from "@/db/schema";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";

/**
 * Record a new activity log
 */
export async function logActivity(category: string, action: string, metadata?: any) {
  const session = await auth();
  if (!session?.user?.id) return;

  try {
    await db.insert(activityLogs).values({
      userId: parseInt(session.user.id),
      category,
      action,
      metadata: metadata ? JSON.stringify(metadata) : null,
    });
  } catch (error) {
    console.error("Failed to log activity:", error);
  }
}

/**
 * Send an invitation to a family member
 */
export async function sendInvitationAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const role = formData.get("role") as string;

  if (!email || !role) return { error: "Veuillez remplir tous les champs." };

  try {
    // 1. Record in DB
    await db.insert(invitations).values({
      parentId: parseInt(session.user.id),
      invitedEmail: email,
      role: role,
    });

    // 2. Log activity
    await logActivity("invite", "Invitation envoyée", { target: email, role });

    // 3. (Optional) Here we would integrate a mailer like Resend or Nodemailer
    // For now, we return success as in the original PHP flow before mail failures
    
    revalidatePath("/[locale]/dashboard/invite", "page");
    return { success: `L'invitation a été envoyée avec succès à ${email} !` };
  } catch (error) {
    console.error("Error sending invitation:", error);
    return { error: "Erreur lors de l'envoi de l'invitation." };
  }
}

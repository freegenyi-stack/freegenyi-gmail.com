"use server";

import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { auth } from "@/auth";
import { createFamilyInvitation } from "@/lib/actions/family";

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
 * Send an invitation to a family member (co-parent)
 */
export async function sendInvitationAction(formData: FormData) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const email = (formData.get("email") as string)?.toLowerCase().trim();
  const role = (formData.get("role") as string) || "coparent";
  const locale = (formData.get("locale") as string) || undefined;

  if (!email) return { error: "Veuillez remplir tous les champs." };

  const result = await createFamilyInvitation(email, role, locale);
  if ("error" in result) return result;

  await logActivity("invite", "Invitation envoyée", { target: email, role, url: result.inviteUrl });

  return {
    success: result.success,
    inviteUrl: result.inviteUrl,
    emailSent: result.emailSent,
  };
}

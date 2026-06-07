"use server";

import { db } from "@/db";
import { users, invitations } from "@/db/schema";
import { eq } from "drizzle-orm";
import { generateInviteToken, ensureUserFamilyId } from "@/lib/family/server";
import {
  buildFamilyInviteUrl,
  sendFamilyInvitationEmail,
} from "@/lib/email/family-invite";

function inviteExpiry() {
  return new Date(Date.now() + 1000 * 60 * 60 * 24 * 14);
}

export type CreateInviteResult =
  | { ok: true; inviteUrl: string; emailSent: boolean; emailProvider?: string }
  | { ok: false; error: string };

/** Crée une invitation en base et envoie l'e-mail (si configuré). */
export async function createAndNotifyFamilyInvitation(params: {
  parentId: number;
  familyId: string;
  invitedEmail: string;
  role?: string;
  inviterName: string;
  locale?: string;
}): Promise<CreateInviteResult> {
  const normalized = params.invitedEmail.toLowerCase().trim();
  if (!normalized.includes("@")) {
    return { ok: false, error: "E-mail invalide." };
  }

  const token = generateInviteToken();
  const inviteRole = params.role === "coparent" || !params.role ? "coparent" : params.role;

  await db.insert(invitations).values({
    parentId: params.parentId,
    familyId: params.familyId,
    invitedEmail: normalized,
    role: inviteRole,
    token,
    status: "pending",
    expiresAt: inviteExpiry(),
  });

  const inviteUrl = buildFamilyInviteUrl(token, params.locale);
  const mail = await sendFamilyInvitationEmail({
    to: normalized,
    inviterName: params.inviterName,
    token,
    locale: params.locale,
  });

  if (!mail.ok) {
    console.error("[invite] e-mail non envoyé:", mail.error);
    return {
      ok: true,
      inviteUrl,
      emailSent: false,
    };
  }

  return {
    ok: true,
    inviteUrl,
    emailSent: true,
    emailProvider: mail.provider,
  };
}

/** Invitation allié à l'inscription parent (sans session). */
export async function inviteAllyAtRegistration(params: {
  parentId: number;
  familyId: string;
  spouseEmail: string;
  inviterName: string;
  locale?: string;
}): Promise<void> {
  if (!params.spouseEmail.includes("@")) return;

  try {
    await createAndNotifyFamilyInvitation({
      parentId: params.parentId,
      familyId: params.familyId,
      invitedEmail: params.spouseEmail,
      role: "coparent",
      inviterName: params.inviterName,
      locale: params.locale,
    });
  } catch (error) {
    console.error("Invitation allié inscription (non bloquant):", error);
  }
}

/** Helper pour le dashboard — résout familyId automatiquement. */
export async function createFamilyInvitationWithEmail(
  email: string,
  inviteRole: string,
  locale?: string
): Promise<
  | { success: string; inviteUrl: string; emailSent: boolean }
  | { error: string }
> {
  const { auth } = await import("@/auth");
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const familyId = await ensureUserFamilyId(userId);

  const [inviter] = await db
    .select({ fullName: users.fullName })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const result = await createAndNotifyFamilyInvitation({
    parentId: userId,
    familyId,
    invitedEmail: email,
    role: inviteRole,
    inviterName: inviter?.fullName || session.user.name || "Un parent",
    locale,
  });

  if (!result.ok) return { error: result.error };

  const msg = result.emailSent
    ? `Invitation envoyée par e-mail à ${email.toLowerCase().trim()}.`
    : `Invitation créée. E-mail non envoyé — vérifiez FREEGENY_SMTP_LOCAL ou partagez le lien ci-dessous.`;

  return { success: msg, inviteUrl: result.inviteUrl, emailSent: result.emailSent };
}

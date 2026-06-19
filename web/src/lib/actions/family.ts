"use server";

import { db } from "@/db";
import {
  users,
  children,
  invitations,
  childDevicePairings,
  childPairingCodes,
  organizationVerifications,
} from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { auth } from "@/auth";
import { revalidatePath } from "next/cache";
import {
  ensureUserFamilyId,
  generateDeviceToken,
  generatePairingCode,
  getInvitationByToken,
  isAdultProfileComplete,
  userCanAccessChild,
} from "@/lib/family/server";
import { setChildSessionCookie } from "@/lib/child-session";
import {
  generateTrackingCode,
  saveVerificationDocument,
} from "@/lib/orgVerification.server";
import { checkUserAvailability } from "@/lib/actions/auth_elite";
import { createFamilyInvitationWithEmail } from "@/lib/family/invite";
import { notifyUser } from "@/lib/messaging/notify";

function pairingExpiry() {
  return new Date(Date.now() + 1000 * 60 * 10);
}

export async function createFamilyInvitation(
  email: string,
  inviteRole: string = "coparent",
  locale?: string
): Promise<{ success: string; inviteUrl: string; emailSent?: boolean } | { error: string }> {
  const result = await createFamilyInvitationWithEmail(email, inviteRole, locale);
  if ("error" in result) return { error: result.error };
  revalidatePath("/[locale]/dashboard/invite", "page");
  return { success: result.success, inviteUrl: result.inviteUrl, emailSent: result.emailSent };
}

export async function getInvitePreviewAction(token: string) {
  const inv = await getInvitationByToken(token);
  if (!inv) return { error: "Invitation invalide ou expirée." };
  if (inv.expiresAt && new Date(inv.expiresAt) < new Date()) {
    return { error: "Cette invitation a expiré." };
  }

  const [inviter] = await db
    .select({ fullName: users.fullName })
    .from(users)
    .where(eq(users.id, inv.parentId))
    .limit(1);

  return {
    email: inv.invitedEmail,
    inviterName: inviter?.fullName || "Un parent",
    familyId: inv.familyId,
  };
}

export async function completeCoparentOnboardingAction(
  formData: FormData,
  inviteToken: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Non autorisé." };

  const inv = await getInvitationByToken(inviteToken);
  if (!inv || !inv.familyId) return { error: "Invitation invalide." };
  if (inv.expiresAt && new Date(inv.expiresAt) < new Date()) {
    return { error: "Invitation expirée." };
  }

  const sessionEmail = session.user.email.toLowerCase();
  if (sessionEmail !== inv.invitedEmail.toLowerCase()) {
    return { error: "Connectez-vous avec l'e-mail invité." };
  }

  const username = (formData.get("username") as string)?.toLowerCase().trim();
  const fullName = (formData.get("fullName") as string)?.trim();
  const phone = (formData.get("phone") as string) || "";

  if (!username || !fullName) {
    return { error: "Veuillez remplir tous les champs." };
  }

  const availability = await checkUserAvailability("username", username);
  if (!availability.available) {
    return { error: "Cet identifiant est déjà utilisé." };
  }

  try {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, sessionEmail))
      .limit(1);
    if (!user) return { error: "Utilisateur introuvable." };

    await db
      .update(users)
      .set({
        username,
        fullName: fullName || user.fullName,
        phone: phone || user.phone,
        role: "coparent",
        familyId: inv.familyId,
        onboardingStep: 4,
        metadata: JSON.stringify({
          ...(user.metadata ? JSON.parse(user.metadata) : {}),
          profileComplete: false,
          invitedBy: inv.parentId,
        }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    await db
      .update(invitations)
      .set({ status: "accepted" })
      .where(eq(invitations.id, inv.id));

    try {
      await notifyUser({
        recipientUserId: inv.parentId,
        type: "family",
        title: `${fullName} a rejoint votre famille`,
        content: "Votre allié éducatif est connecté sur FreeGeny.",
        link: "/dashboard/parent",
      });
    } catch (e) {
      console.warn("Notification alliance (non bloquant):", e);
    }

    return { success: true };
  } catch (error) {
    console.error("completeCoparentOnboardingAction:", error);
    return { error: "Une erreur est survenue." };
  }
}

export async function completeCoparentProfileAction(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé." };

  const devMode =
    process.env.FREEGENY_DEV_AUTO_APPROVE === "true" ||
    process.env.NODE_ENV === "development";

  const identityFile = formData.get("doc_identity") as File | null;
  if (!devMode && (!identityFile || identityFile.size === 0)) {
    return { error: "La pièce d'identité est obligatoire." };
  }

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.role !== "coparent") return { error: "Non autorisé." };

  const trackingCode = generateTrackingCode();
  const docs: Record<string, string> =
    devMode && (!identityFile || identityFile.size === 0)
      ? { devMode: "identity_skipped_for_local_test" }
      : {
          identity: await saveVerificationDocument(userId, "identity", identityFile as File),
        };

  await db.insert(organizationVerifications).values({
    userId,
    orgType: "coparent",
    trackingCode,
    institutionSubtype: "identity",
    status: "pending",
    documents: JSON.stringify(docs),
  });

  const meta = user.metadata ? JSON.parse(user.metadata) : {};
  await db
    .update(users)
    .set({
      metadata: JSON.stringify({ ...meta, profileComplete: true }),
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/[locale]/dashboard/parent", "page");
  revalidatePath("/[locale]/dashboard/messages", "page");

  const invitedBy = meta.invitedBy as number | undefined;
  if (invitedBy) {
    try {
      await notifyUser({
        recipientUserId: invitedBy,
        type: "family",
        title: `${user.fullName || "Votre allié"} a complété son profil`,
        content: "Identité soumise — accès complet au cockpit familial.",
        link: "/dashboard/parent",
      });
    } catch (e) {
      console.warn("Notification profil allié (non bloquant):", e);
    }
  }

  return { success: true };
}

export async function getProfileCompletionStatusAction(): Promise<{
  complete: boolean;
  role: string;
}> {
  const session = await auth();
  if (!session?.user?.id) return { complete: true, role: "parent" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db
    .select({ role: users.role })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  const role = user?.role || "parent";
  const complete = await isAdultProfileComplete(userId, role);
  return { complete, role };
}

export async function setChildPinAction(
  childId: number,
  pin: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé." };

  if (!/^\d{4}$/.test(pin)) {
    return { error: "Le code doit contenir 4 chiffres." };
  }

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return { error: "Non autorisé." };

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) return { error: "Accès refusé." };

  const profileOk = await isAdultProfileComplete(userId, user.role);
  if (!profileOk) return { error: "Complétez votre profil pour gérer l'accès enfant." };

  const hash = await bcrypt.hash(pin, 10);
  await db
    .update(children)
    .set({ accessPinHash: hash, updatedAt: new Date() })
    .where(eq(children.id, childId));

  revalidatePath("/[locale]/dashboard/children", "page");
  return { success: true };
}

export async function createChildPairingCodeAction(
  childId: number
): Promise<{ code: string; expiresAt: string } | { error: string }> {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé." };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user) return { error: "Non autorisé." };

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) return { error: "Accès refusé." };

  const profileOk = await isAdultProfileComplete(userId, user.role);
  if (!profileOk) return { error: "Complétez votre profil d'abord." };

  const code = generatePairingCode();
  const expiresAt = pairingExpiry();

  await db.insert(childPairingCodes).values({
    childId,
    code,
    expiresAt,
  });

  return { code, expiresAt: expiresAt.toISOString() };
}

export async function pairChildDeviceAction(
  code: string,
  deviceLabel?: string
): Promise<{ success: true; childId: number } | { error: string }> {
  const normalized = code.trim().toUpperCase();
  if (!normalized) return { error: "Code invalide." };

  const [pairing] = await db
    .select()
    .from(childPairingCodes)
    .where(and(eq(childPairingCodes.code, normalized), gt(childPairingCodes.expiresAt, new Date())))
    .limit(1);

  if (!pairing) return { error: "Code expiré ou invalide." };

  const deviceToken = generateDeviceToken();
  await db.insert(childDevicePairings).values({
    childId: pairing.childId,
    deviceToken,
    deviceLabel: deviceLabel || "Tablette",
    lastUsedAt: new Date(),
  });

  await setChildSessionCookie(pairing.childId, deviceToken);

  return { success: true, childId: pairing.childId };
}

export async function verifyChildPinAction(
  pin: string
): Promise<{ success: true; childId: number } | { error: string }> {
  if (!/^\d{4}$/.test(pin)) return { error: "Code à 4 chiffres requis." };

  const { getChildSessionFromCookies } = await import("@/lib/child-session");
  const session = await getChildSessionFromCookies();
  if (!session) return { error: "Appareil non appairé. Scannez le QR du parent." };

  const [pairing] = await db
    .select()
    .from(childDevicePairings)
    .where(
      and(
        eq(childDevicePairings.childId, session.childId),
        eq(childDevicePairings.deviceToken, session.deviceToken)
      )
    )
    .limit(1);

  if (!pairing) return { error: "Appareil non reconnu. Réappairez la tablette." };

  const [child] = await db.select().from(children).where(eq(children.id, session.childId)).limit(1);
  if (!child?.accessPinHash) return { error: "Le parent n'a pas encore défini de code." };

  const ok = await bcrypt.compare(pin, child.accessPinHash);
  if (!ok) return { error: "Code incorrect." };

  await db
    .update(childDevicePairings)
    .set({ lastUsedAt: new Date() })
    .where(eq(childDevicePairings.id, pairing.id));

  return { success: true, childId: child.id };
}

export async function getChildSessionInfoAction() {
  const { getChildSessionFromCookies } = await import("@/lib/child-session");
  const session = await getChildSessionFromCookies();
  if (!session) return { paired: false as const };

  const [child] = await db
    .select({ id: children.id, fullName: children.fullName })
    .from(children)
    .where(eq(children.id, session.childId))
    .limit(1);

  if (!child) return { paired: false as const };
  return { paired: true as const, childId: child.id, childName: child.fullName };
}

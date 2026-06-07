"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { organizationVerifications, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import {
  getRequiredNgoDocs,
  getRequiredSchoolDocs,
} from "@/lib/orgVerification.shared";
import { processOrgDocuments } from "@/lib/orgVerification.server";
export async function getVerificationForUser(userId: number) {
  const [row] = await db
    .select()
    .from(organizationVerifications)
    .where(eq(organizationVerifications.userId, userId))
    .orderBy(desc(organizationVerifications.createdAt))
    .limit(1);
  return row ?? null;
}

export async function listPendingVerifications() {
  const rows = await db
    .select({
      verification: organizationVerifications,
      user: {
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        phone: users.phone,
      },
    })
    .from(organizationVerifications)
    .innerJoin(users, eq(organizationVerifications.userId, users.id))
    .where(eq(organizationVerifications.status, "pending"))
    .orderBy(desc(organizationVerifications.createdAt));

  return rows;
}

export async function reviewVerificationAction(
  verificationId: number,
  action: "approve" | "reject",
  rejectionReason?: string
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Non autorisé." };

  const admins = (process.env.FREEGENY_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  if (!admins.includes(session.user.email.toLowerCase())) {
    return { error: "Accès admin requis." };
  }

  const [verification] = await db
    .select()
    .from(organizationVerifications)
    .where(eq(organizationVerifications.id, verificationId))
    .limit(1);

  if (!verification) return { error: "Dossier introuvable." };

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, verification.userId))
    .limit(1);

  if (!user) return { error: "Utilisateur introuvable." };

  const metadata = user.metadata ? JSON.parse(user.metadata) : {};

  if (action === "reject") {
    await db
      .update(organizationVerifications)
      .set({
        status: "rejected",
        rejectionReason: rejectionReason || "Dossier incomplet.",
        reviewedAt: new Date(),
        reviewedBy: session.user.email,
        updatedAt: new Date(),
      })
      .where(eq(organizationVerifications.id, verificationId));

    await db
      .update(users)
      .set({
        metadata: JSON.stringify({ ...metadata, verificationStatus: "rejected" }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { success: true };
  }

  await db
    .update(organizationVerifications)
    .set({
      status: "approved",
      rejectionReason: null,
      reviewedAt: new Date(),
      reviewedBy: session.user.email,
      updatedAt: new Date(),
    })
    .where(eq(organizationVerifications.id, verificationId));

  await db
    .update(users)
    .set({
      onboardingStep: 4,
      metadata: JSON.stringify({
        ...metadata,
        verificationStatus: "approved",
      }),
      updatedAt: new Date(),
    })
    .where(eq(users.id, user.id));

  return { success: true };
}

export async function resubmitVerificationAction(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Non autorisé." };

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user || (user.role !== "ecole" && user.role !== "ong")) {
    return { error: "Compte établissement requis." };
  }

  const metadata = user.metadata ? JSON.parse(user.metadata) : {};
  const institutionType = (metadata.institutionType as string) || "Publique";
  const privateDocType = (formData.get("private_doc_type") as string) || "licence";

  try {
    const required =
      user.role === "ecole"
        ? getRequiredSchoolDocs(institutionType, privateDocType)
        : getRequiredNgoDocs();

    formData.set("institution_type", institutionType);
    formData.set("private_doc_type", privateDocType);
    const docs = await processOrgDocuments(
      user.id,
      user.role as "ecole" | "ong",
      formData,
      required
    );

    await db
      .update(organizationVerifications)
      .set({
        status: "pending",
        documents: JSON.stringify(docs),
        rejectionReason: null,
        updatedAt: new Date(),
      })
      .where(eq(organizationVerifications.userId, user.id));

    await db
      .update(users)
      .set({
        metadata: JSON.stringify({ ...metadata, verificationStatus: "pending" }),
        updatedAt: new Date(),
      })
      .where(eq(users.id, user.id));

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message.startsWith("DOCUMENT_MISSING:")) {
      const key = error.message.split(":")[1];
      return { error: `Document obligatoire manquant (${key}).` };
    }
    if (error instanceof Error) return { error: error.message };
    return { error: "Erreur lors du renvoi du dossier." };
  }
}

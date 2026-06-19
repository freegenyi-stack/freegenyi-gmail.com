"use server";

import { auth } from "@/auth";
import { db } from "@/db";
import { organizationVerifications, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import {
  getRequiredNgoDocs,
  getRequiredSchoolDocs,
} from "@/lib/orgVerification.shared";
import { processOrgDocuments, saveVerificationDocument } from "@/lib/orgVerification.server";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { getUserVerificationStatus } from "@/lib/orgVerification.guard";
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

  // Un seul dossier en attente par utilisateur (le plus récent)
  const seenUserIds = new Set<number>();
  return rows.filter((row) => {
    if (seenUserIds.has(row.user.id)) return false;
    seenUserIds.add(row.user.id);
    return true;
  });
}

export async function upsertPendingVerification(input: {
  userId: number;
  orgType: "enseignant" | "parent" | "ecole" | "ong";
  trackingCode: string;
  institutionSubtype: string;
  documents: Record<string, string>;
}): Promise<void> {
  const documentsJson = JSON.stringify(input.documents);
  const existing = await getVerificationForUser(input.userId);

  if (existing && existing.status === "pending") {
    await db
      .update(organizationVerifications)
      .set({
        orgType: input.orgType,
        trackingCode: input.trackingCode,
        institutionSubtype: input.institutionSubtype,
        documents: documentsJson,
        updatedAt: new Date(),
      })
      .where(eq(organizationVerifications.id, existing.id));
    return;
  }

  await db.insert(organizationVerifications).values({
    userId: input.userId,
    orgType: input.orgType,
    trackingCode: input.trackingCode,
    institutionSubtype: input.institutionSubtype,
    status: "pending",
    documents: documentsJson,
  });
}

export async function reviewVerificationAction(
  verificationId: number,
  action: "approve" | "reject",
  rejectionReason?: string
): Promise<{ success: true } | { error: string }> {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

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
        reviewedBy: admin.email,
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
      reviewedBy: admin.email,
      updatedAt: new Date(),
    })
    .where(
      and(
        eq(organizationVerifications.userId, user.id),
        eq(organizationVerifications.status, "pending")
      )
    );

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

export async function resubmitTeacherVerificationAction(
  formData: FormData
): Promise<{ success: true } | { error: string }> {
  const session = await auth();
  if (!session?.user?.email) return { error: "Non autorisé." };

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email))
    .limit(1);

  if (!user || user.role !== "enseignant") {
    return { error: "Compte enseignant requis." };
  }

  const status = await getUserVerificationStatus(user.id, user.metadata);
  if (status !== "rejected") {
    return { error: "Resoumission uniquement si votre dossier a été refusé." };
  }

  const devMode =
    process.env.FREEGENY_DEV_AUTO_APPROVE === "true" ||
    process.env.NODE_ENV === "development";

  const identityFile = formData.get("doc_identity") as File | null;
  if (!devMode && (!identityFile || identityFile.size === 0)) {
    return { error: "La pièce d'identité est obligatoire." };
  }

  try {
    const docs: Record<string, string> =
      devMode && (!identityFile || identityFile.size === 0)
        ? { devMode: "identity_skipped_for_local_test" }
        : {
            identity: await saveVerificationDocument(user.id, "identity", identityFile as File),
          };

    const metadata = user.metadata ? JSON.parse(user.metadata) : {};

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
    if (error instanceof Error) return { error: error.message };
    return { error: "Erreur lors du renvoi du dossier." };
  }
}

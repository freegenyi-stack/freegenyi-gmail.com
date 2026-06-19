import { db } from "@/db";
import { organizationVerifications } from "@/db/schema";
import { desc, eq } from "drizzle-orm";

export type VerificationStatus = "pending" | "approved" | "rejected";

export function isVerificationApproved(status: VerificationStatus): boolean {
  return status === "approved";
}

export async function getUserVerificationStatus(
  userId: number,
  metadataRaw?: string | null
): Promise<VerificationStatus> {
  const [row] = await db
    .select({ status: organizationVerifications.status })
    .from(organizationVerifications)
    .where(eq(organizationVerifications.userId, userId))
    .orderBy(desc(organizationVerifications.createdAt))
    .limit(1);

  if (row?.status === "approved" || row?.status === "rejected" || row?.status === "pending") {
    return row.status;
  }

  if (metadataRaw) {
    try {
      const meta = JSON.parse(metadataRaw) as { verificationStatus?: string };
      if (
        meta.verificationStatus === "approved" ||
        meta.verificationStatus === "rejected" ||
        meta.verificationStatus === "pending"
      ) {
        return meta.verificationStatus;
      }
    } catch {
      /* ignore */
    }
  }

  return "pending";
}

const BLOCK_MESSAGES: Record<Exclude<VerificationStatus, "approved">, string> = {
  pending: "Publication disponible après validation de votre dossier enseignant.",
  rejected: "Votre dossier n'est pas validé. Soumettez-le à nouveau depuis la bannière.",
};

export async function requireTeacherVerified(
  userId: number,
  metadataRaw?: string | null
): Promise<{ ok: true; status: VerificationStatus } | { ok: false; status: VerificationStatus; error: string }> {
  const status = await getUserVerificationStatus(userId, metadataRaw);
  if (isVerificationApproved(status)) {
    return { ok: true, status };
  }
  return { ok: false, status, error: BLOCK_MESSAGES[status as keyof typeof BLOCK_MESSAGES] ?? BLOCK_MESSAGES.pending };
}

export function contactBlockedMessage(status: VerificationStatus): string {
  if (status === "rejected") {
    return "Contact public indisponible — dossier non validé.";
  }
  return "Contact public disponible après validation de votre dossier enseignant.";
}

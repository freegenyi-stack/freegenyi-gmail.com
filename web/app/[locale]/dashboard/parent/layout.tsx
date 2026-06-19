import React from "react";
import ParentShell from "@/components/parent/ParentShell";
import ParentVerificationBanner from "@/components/parent/ParentVerificationBanner";
import { requireParentPage } from "@/lib/parent/requireParentPage";

function parseVerificationStatus(metadata: string | null): "pending" | "rejected" | "approved" | null {
  if (!metadata) return null;
  try {
    const meta = JSON.parse(metadata) as { verificationStatus?: string };
    if (meta.verificationStatus === "pending" || meta.verificationStatus === "rejected" || meta.verificationStatus === "approved") {
      return meta.verificationStatus;
    }
  } catch {
    /* ignore */
  }
  return null;
}

export default async function ParentDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user } = await requireParentPage(locale);
  const verificationStatus = parseVerificationStatus(user.metadata);

  return (
    <ParentShell>
      <ParentVerificationBanner status={verificationStatus} />
      {children}
    </ParentShell>
  );
}

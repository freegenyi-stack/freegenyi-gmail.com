import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { listPendingVerifications } from "@/lib/actions/org_verification";
import AdminVerificationsClient from "./AdminVerificationsClient";

function isAdminEmail(email: string): boolean {
  const admins = (process.env.FREEGENY_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.length > 0 && admins.includes(email.toLowerCase());
}

export default async function AdminVerificationsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.email || !isAdminEmail(session.user.email)) {
    redirect(`/${locale}/dashboard/parent`);
  }

  const rows = await listPendingVerifications();

  return (
    <div className="bg-slate-50 min-h-screen p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-black text-slate-900 mb-2 uppercase">Admin — Vérifications</h1>
        <p className="text-slate-500 mb-8 text-sm">Écoles et ONG en attente de validation</p>
        <AdminVerificationsClient rows={rows.map((r) => ({
          id: r.verification.id,
          trackingCode: r.verification.trackingCode,
          status: r.verification.status,
          orgType: r.verification.orgType,
          institutionSubtype: r.verification.institutionSubtype,
          documents: r.verification.documents,
          rejectionReason: r.verification.rejectionReason,
          userName: r.user.fullName,
          userEmail: r.user.email,
          userPhone: r.user.phone,
          createdAt: r.verification.createdAt?.toISOString() ?? "",
        }))} />
      </div>
    </div>
  );
}

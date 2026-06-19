import React from "react";
import { listPendingVerifications } from "@/lib/actions/org_verification";
import AdminVerificationsClient from "./AdminVerificationsClient";

export default async function AdminVerificationsPage() {
  const rows = await listPendingVerifications();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Vérifications</h1>
        <p className="text-sm text-slate-500">Écoles, ONG et enseignants en attente</p>
      </div>
      <AdminVerificationsClient
        rows={rows.map((r) => ({
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
        }))}
      />
    </div>
  );
}

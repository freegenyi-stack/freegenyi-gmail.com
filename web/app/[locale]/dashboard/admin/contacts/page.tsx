import React from "react";
import { listContactSubmissions } from "@/lib/admin/modules.server";
import AdminContactsClient from "./AdminContactsClient";

export default async function AdminContactsPage() {
  const rows = await listContactSubmissions();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Contacts support</h1>
        <p className="text-sm text-slate-500">{rows.length} demandes</p>
      </div>
      <AdminContactsClient rows={rows} />
    </div>
  );
}

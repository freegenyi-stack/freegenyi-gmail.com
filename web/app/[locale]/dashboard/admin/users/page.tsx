import React from "react";
import { listAdminUsers } from "@/lib/admin/stats.server";
import AdminUsersClient from "./AdminUsersClient";

export default async function AdminUsersPage() {
  const users = await listAdminUsers();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Utilisateurs</h1>
        <p className="mt-1 text-sm text-slate-500">{users.length} comptes enregistrés</p>
      </div>
      <AdminUsersClient users={users} />
    </div>
  );
}

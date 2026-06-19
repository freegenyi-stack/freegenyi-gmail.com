import React from "react";
import { countPushSubscriptions, getExtendedStats } from "@/lib/admin/modules.server";
import { getAdminDashboardStats } from "@/lib/admin/stats.server";
import AdminNotificationsClient from "./AdminNotificationsClient";

export default async function AdminNotificationsPage() {
  const pushCount = await countPushSubscriptions();
  const stats = await getExtendedStats();
  const dash = await getAdminDashboardStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Notifications</h1>
        <p className="text-sm text-slate-500">Rédigez et envoyez des alertes in-app (et push) aux utilisateurs</p>
      </div>
      <AdminNotificationsClient
        pushCount={pushCount}
        pendingContacts={stats.pendingContacts}
        roleCounts={stats.roles}
        totalUsers={dash.usersTotal}
      />
    </div>
  );
}

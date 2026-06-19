import React from "react";
import { getAdminDashboardStats } from "@/lib/admin/stats.server";
import { getExtendedStats } from "@/lib/admin/modules.server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function AdminStatsPage() {
  const base = await getAdminDashboardStats();
  const ext = await getExtendedStats();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">Statistiques</h1>
        <p className="text-sm text-slate-500">Vue détaillée de la plateforme</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Utilisateurs", value: base.usersTotal },
          { label: "Actifs 7 jours", value: ext.activeLast7Days },
          { label: "Vérifs pending", value: base.pendingVerifications },
          { label: "Livres publiés", value: base.publishedBooks },
          { label: "Push abonnés", value: ext.pushSubscriptions },
          { label: "Contacts pending", value: ext.pendingContacts },
        ].map(({ label, value }) => (
          <Card key={label}>
            <CardHeader className="pb-2">
              <CardTitle className="text-xs font-black uppercase text-slate-500">{label}</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-black">{value}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Répartition par rôle</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-2">
          {Object.entries(ext.roles).map(([role, count]) => (
            <span key={role} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold">
              {role}: {count}
            </span>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}

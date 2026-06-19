import React from "react";
import { Link } from "@/i18n/routing";
import { getAdminDashboardStats } from "@/lib/admin/stats.server";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Users, ShieldCheck, BookOpen, Newspaper } from "lucide-react";

export default async function AdminHubPage() {
  const stats = await getAdminDashboardStats();

  const cards = [
    { label: "Utilisateurs", value: stats.usersTotal, icon: Users, href: "/dashboard/admin/users" },
    { label: "Vérifications en attente", value: stats.pendingVerifications, icon: ShieldCheck, href: "/dashboard/admin/verifications" },
    { label: "Livres publiés", value: stats.publishedBooks, icon: BookOpen, href: "/dashboard/admin/library" },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">Vue d&apos;ensemble</h1>
        <p className="mt-1 text-sm text-slate-500">Console de gestion FreeGeny</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        {cards.map(({ label, value, icon: Icon, href }) => (
          <Link key={href} href={href}>
            <Card className="transition hover:border-orange-200 hover:shadow-md">
              <CardHeader className="pb-2">
                <Icon className="h-5 w-5 text-slate-600" />
                <CardTitle className="text-sm font-black uppercase tracking-wide text-slate-500">{label}</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-4xl font-black text-slate-900">{value}</p>
              </CardContent>
            </Card>
          </Link>
        ))}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Répartition par rôle</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {Object.entries(stats.usersByRole).map(([role, count]) => (
              <span key={role} className="rounded-xl bg-slate-100 px-3 py-2 text-xs font-bold text-slate-700">
                {role}: {count}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <Link
        href="/dashboard/admin/teacher-news"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-700 shadow-sm hover:bg-slate-50"
      >
        <Newspaper className="h-4 w-4" />
        Gérer les actualités enseignant
      </Link>
    </div>
  );
}

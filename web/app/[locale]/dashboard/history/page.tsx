import { Link } from "@/i18n/routing";
import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { activityLogs, users } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { History as HistoryIcon, Shield, BookOpen, PenTool, Search, Lock, ArrowLeft } from "lucide-react";
import { isFamilyAdult } from "@/lib/family/constants";

export default async function HistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`);
  }

  const userId = parseInt(session.user.id, 10);

  const [user] = await db.select({ role: users.role }).from(users).where(eq(users.id, userId)).limit(1);
  if (user && isFamilyAdult(user.role)) {
    redirect(`/${locale}/dashboard/parent/historique`);
  }

  const logs = await db
    .select()
    .from(activityLogs)
    .where(eq(activityLogs.userId, userId))
    .orderBy(desc(activityLogs.createdAt))
    .limit(50);

  const stats = {
    course: logs.filter((l) => l.category === "course").length,
    exercise: logs.filter((l) => l.category === "exercise").length,
    search: logs.filter((l) => l.category === "search").length,
    auth: logs.filter((l) => l.category === "auth").length,
  };

  const getIcon = (category: string) => {
    switch (category) {
      case "auth":
        return <Lock className="w-4 h-4" />;
      case "course":
        return <BookOpen className="w-4 h-4" />;
      case "exercise":
        return <PenTool className="w-4 h-4" />;
      case "search":
        return <Search className="w-4 h-4" />;
      default:
        return <Shield className="w-4 h-4" />;
    }
  };

  const getBgColor = (category: string) => {
    switch (category) {
      case "auth":
        return "bg-blue-50 text-blue-500";
      case "course":
        return "bg-orange-50 text-orange-500";
      case "exercise":
        return "bg-green-50 text-green-500";
      case "search":
        return "bg-purple-50 text-purple-500";
      default:
        return "bg-slate-50 text-slate-500";
    }
  };

  return (
    <div className="min-h-full bg-slate-50 pb-24 font-dm-sans">
      <div className="mx-auto max-w-4xl px-6 py-12 md:px-12">
        <div className="mb-12 flex flex-col items-start justify-between gap-6 md:flex-row md:items-center">
          <div>
            <h1 className="font-jakarta text-4xl font-black tracking-tight text-slate-900">Mon Historique</h1>
            <p className="mt-2 font-medium text-slate-500">Retrouvez toutes vos activités sur FreeGeny.</p>
          </div>
          <Link
            href="/dashboard/parent"
            className="flex items-center gap-3 rounded-2xl border-2 border-slate-100 bg-white px-6 py-3 text-[11px] font-black uppercase tracking-widest text-slate-700 shadow-sm transition-all hover:border-slate-900"
          >
            <ArrowLeft className="h-4 w-4" />
            Dashboard
          </Link>
        </div>

        <div className="mb-12 grid grid-cols-2 gap-4 md:grid-cols-4">
          {[
            { label: "Cours vus", value: stats.course, color: "text-orange-600" },
            { label: "Exercices", value: stats.exercise, color: "text-green-600" },
            { label: "Recherches", value: stats.search, color: "text-purple-600" },
            { label: "Connexions", value: stats.auth, color: "text-blue-600" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-[2rem] border border-slate-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
            >
              <p className="mb-2 text-[10px] font-black uppercase tracking-widest text-slate-400">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-[3rem] border border-slate-100 bg-white shadow-[0_32px_80px_rgba(0,0,0,0.03)]">
          <div className="flex items-center justify-between border-b border-slate-50 bg-slate-50/30 p-8">
            <h2 className="text-[11px] font-black uppercase tracking-[0.2em] text-slate-900">Journal d&apos;activité</h2>
          </div>
          <div className="divide-y divide-slate-50">
            {logs.length === 0 ? (
              <div className="py-24 text-center">
                <HistoryIcon className="mx-auto mb-6 h-8 w-8 text-slate-200" />
                <p className="font-bold italic text-slate-400">Aucune activité enregistrée pour le moment.</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="group flex items-start gap-6 p-6 transition-colors hover:bg-slate-50/50 md:p-8">
                  <div
                    className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl shadow-sm ${getBgColor(log.category)}`}
                  >
                    {getIcon(log.category)}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col items-start justify-between gap-2 md:flex-row">
                      <h3 className="text-base font-black leading-tight text-slate-900">{log.action}</h3>
                      <span className="whitespace-nowrap text-[10px] font-black uppercase tracking-widest text-slate-400">
                        {new Date(log.createdAt).toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

import { Link } from "@/i18n/routing";
import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { activityLogs } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import { History as HistoryIcon, Shield, BookOpen, PenTool, Search, Lock, ArrowLeft } from "lucide-react";


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

  const logs = await db
    .select()
    .from(activityLogs)
    .where(eq(activityLogs.userId, parseInt(session.user.id)))
    .orderBy(desc(activityLogs.createdAt))
    .limit(50);

  const stats = {
    course: logs.filter(l => l.category === 'course').length,
    exercise: logs.filter(l => l.category === 'exercise').length,
    search: logs.filter(l => l.category === 'search').length,
    auth: logs.filter(l => l.category === 'auth').length,
  };

  const getIcon = (category: string) => {
    switch (category) {
      case 'auth': return <Lock className="w-4 h-4" />;
      case 'course': return <BookOpen className="w-4 h-4" />;
      case 'exercise': return <PenTool className="w-4 h-4" />;
      case 'search': return <Search className="w-4 h-4" />;
      default: return <Shield className="w-4 h-4" />;
    }
  };

  const getBgColor = (category: string) => {
    switch (category) {
      case 'auth': return 'bg-blue-50 text-blue-500';
      case 'course': return 'bg-orange-50 text-orange-500';
      case 'exercise': return 'bg-green-50 text-green-500';
      case 'search': return 'bg-purple-50 text-purple-500';
      default: return 'bg-slate-50 text-slate-500';
    }
  };

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] pb-24 font-dm-sans">
      <div className="max-w-4xl mx-auto px-6 md:px-12 py-12">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-12">
          <div>
            <h1 className="text-4xl font-black text-slate-900 tracking-tight font-jakarta">Mon Historique 💎</h1>
            <p className="text-slate-500 font-medium mt-2">Retrouvez toutes vos activités et celles de vos enfants sur FreeGeny.</p>
          </div>
          <Link 
            href="/dashboard/parent"
            className="bg-white border-2 border-slate-100 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest text-slate-700 hover:border-slate-900 transition-all flex items-center gap-3 shadow-sm"
          >
            <ArrowLeft className="w-4 h-4" />
            Dashboard
          </Link>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
          {[
            { label: 'Cours vus', value: stats.course, color: 'text-orange-600' },
            { label: 'Exercices', value: stats.exercise, color: 'text-green-600' },
            { label: 'Recherches', value: stats.search, color: 'text-purple-600' },
            { label: 'Connexions', value: stats.auth, color: 'text-blue-600' },
          ].map((stat) => (
            <div key={stat.label} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-shadow">
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest mb-2">{stat.label}</p>
              <p className={`text-3xl font-black ${stat.color}`}>{stat.value}</p>
            </div>
          ))}
        </div>

        {/* Timeline */}
        <div className="bg-white rounded-[3rem] border border-slate-100 shadow-[0_32px_80px_rgba(0,0,0,0.03)] overflow-hidden">
          <div className="p-8 border-b border-slate-50 flex justify-between items-center bg-slate-50/30">
            <h2 className="font-black text-slate-900 uppercase text-[11px] tracking-[0.2em]">Journal d'excellence</h2>
            <span className="text-[10px] bg-green-50 text-green-600 px-3 py-1 rounded-full font-black uppercase tracking-widest border border-green-100 animate-pulse">Live</span>
          </div>

          <div className="divide-y divide-slate-50">
            {logs.length === 0 ? (
              <div className="py-24 text-center">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-6 text-slate-200">
                  <HistoryIcon className="w-8 h-8" />
                </div>
                <p className="text-slate-400 font-bold italic">Aucune activité enregistrée pour le moment.</p>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-6 md:p-8 flex items-start gap-6 hover:bg-slate-50/50 transition-colors group">
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-sm transition-transform group-hover:scale-110 ${getBgColor(log.category)}`}>
                    {getIcon(log.category)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col md:flex-row justify-between items-start gap-2">
                      <h3 className="text-base font-black text-slate-900 leading-tight">{log.action}</h3>
                      <span className="text-[10px] text-slate-400 font-black uppercase tracking-widest whitespace-nowrap">
                        {new Date(log.createdAt).toLocaleDateString(locale, { day: 'numeric', month: 'short', hour: '2-digit', minute: '2-digit' })}
                      </span>
                    </div>
                    {log.metadata && (
                      <div className="mt-3 flex flex-wrap gap-2">
                        {Object.entries(JSON.parse(log.metadata)).map(([k, v]) => (
                          <span key={k} className="px-3 py-1 bg-slate-100 text-[10px] text-slate-500 rounded-lg font-bold border border-slate-200/50 capitalize">
                            {k}: {v as string}
                          </span>
                        ))}
                      </div>
                    )}
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

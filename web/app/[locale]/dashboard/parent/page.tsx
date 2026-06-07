import { Link } from "@/i18n/routing";
import React from "react";
import Image from "next/image";

import ChatOpener from "@/components/ChatOpener";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, children as childrenTable } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getTranslations } from "next-intl/server";
import { getFamilyChildren, isAdultProfileComplete } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import ProfileCompleteBanner from "@/components/family/ProfileCompleteBanner";
import ChildAccessPanel from "@/components/family/ChildAccessPanel";

export default async function ParentDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  // 1. Fetch current user
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email));

  if (!user || user.onboardingStep! < 4) {
    redirect(`/${locale}/dashboard/onboarding`);
  }

  if (!isFamilyAdult(user.role)) {
    redirect(`/${locale}/dashboard/${user.role === "enseignant" ? "enseignant" : "parent"}`);
  }

  const profileComplete = await isAdultProfileComplete(user.id, user.role);

  // 2. Fetch family children
  const childrenData = await getFamilyChildren(user);


  let partner = null;
  if (user.familyId) {
    const [partnerData] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(
        and(
          eq(users.familyId, user.familyId),
          // Not the current user
          // Note: Drizzle ORM requires explicit notEq or manual string condition
        )
      );
      
    // Simple filter in memory since family size is max 2-3 usually
    const allFamilyMembers = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(eq(users.familyId, user.familyId));
      
    partner = allFamilyMembers.find((m) => m.id !== user.id) || null;
  }

  const isOnline = (lastLogin: Date | null) => {
    if (!lastLogin) return false;
    const diff = new Date().getTime() - new Date(lastLogin).getTime();
    return diff < 1000 * 60 * 5; // 5 minutes
  };

  return (
    <div className="bg-slate-50 min-h-full pb-24 font-dm-sans selection:bg-orange-600 selection:text-white">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        
        {/* Header du Dashboard */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16 relative">
          <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none"></div>
          
          <div className="relative z-10">
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-jakarta">
              Cockpit Parent
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-lg">
              Gérez et suivez l'évolution de vos petits génies.
            </p>
          </div>
          <div className="flex gap-4 w-full md:w-auto relative z-10">
            <Link 
              href="/child"
              className="flex-1 md:flex-none text-center bg-orange-500 text-white px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg"
            >
              Mode enfant
            </Link>
            <Link 
              href="/dashboard/children"
              className="flex-1 md:flex-none text-center bg-white border-2 border-slate-100 px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:border-slate-300 hover:shadow-xl transition-all duration-300 text-slate-700"
            >
              + Gestion des enfants
            </Link>
          </div>
        </div>

        {/* Navigation Rapide du Dashboard */}
        <div className="flex overflow-x-auto gap-3 pb-4 mb-12 relative z-10 hide-scrollbar">
          <Link href="/dashboard/parent" className="shrink-0 bg-slate-900 text-white px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest shadow-lg">
            Cockpit
          </Link>
          <Link href="/dashboard/messages" className="shrink-0 bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">
            Messages & IA
          </Link>
          <Link href="/dashboard/children" className="shrink-0 bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">
            Enfants
          </Link>
          <Link href="/dashboard/history" className="shrink-0 bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">
            Historique
          </Link>
          <Link href="/dashboard/settings" className="shrink-0 bg-white border border-slate-200 text-slate-600 hover:text-orange-600 hover:border-orange-200 px-6 py-3 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all shadow-sm">
            Réglages
          </Link>
        </div>

        <ProfileCompleteBanner locale={locale} role={user.role || "parent"} complete={profileComplete} />

        <div className="grid lg:grid-cols-3 gap-12 relative z-10">
          
          {/* Colonne Principale : Enfants */}
          <div className="lg:col-span-2 space-y-12">
            {childrenData.length === 0 ? (
              <div className="bg-white rounded-[3rem] p-12 shadow-xl border border-slate-50 text-center">
                <div className="w-20 h-20 bg-orange-50 rounded-3xl flex items-center justify-center mx-auto mb-6 text-4xl">🦊</div>
                <h2 className="text-2xl font-black text-slate-900 mb-3 font-jakarta">Ajoutez votre premier génie !</h2>
                <p className="text-slate-500 text-sm font-bold mb-8 max-w-sm mx-auto">Votre profil Elite est activé. Ajoutez maintenant le profil de votre enfant pour commencer le suivi.</p>
                <Link href="/dashboard/children" className="inline-block bg-slate-950 text-white px-10 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">
                  + Ajouter un enfant
                </Link>
              </div>
            ) : childrenData.map((child) => (
              <div key={child.id} className="bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-slate-50 relative overflow-hidden group hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-500">
                <div className="absolute -top-24 -right-24 w-64 h-64 bg-orange-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700"></div>

                <div className="relative z-10">
                  <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12">
                    <div className="flex items-center gap-6">
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] flex items-center justify-center text-3xl shadow-2xl relative">
                        🦊
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full border-4 border-white flex items-center justify-center text-[10px] font-black text-white">
                          ✓
                        </div>
                      </div>
                      <div>
                        <h2 className="text-3xl font-black text-slate-900 tracking-tight font-jakarta">
                          {child.fullName}
                        </h2>
                        <div className="flex items-center gap-2 mt-2">
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">
                            Niveau : {child.educationLevel || "N/A"}
                          </span>
                          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full"></span>
                          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
                            Premium Plus
                          </span>
                        </div>
                      </div>
                    </div>
                    <Link 
                      href={`/lobby/${child.id}`}
                      className="w-full md:w-auto bg-slate-950 text-white px-8 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 shadow-xl hover:shadow-orange-600/20 text-center"
                    >
                      Mode Apprenant
                    </Link>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300 relative overflow-hidden group">
                      <div className="absolute top-0 right-0 w-16 h-16 bg-orange-500/10 rounded-bl-full transition-transform group-hover:scale-110"></div>
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">🔥 Streak</p>
                      <p className="text-3xl font-black text-orange-600">3<span className="text-base text-slate-400">j</span></p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Progrès</p>
                      <p className="text-3xl font-black text-slate-900">82<span className="text-base text-slate-400">%</span></p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Passion</p>
                      <p className="text-xl font-black text-slate-900 truncate mt-1">Exploration</p>
                    </div>
                    <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100 text-center hover:bg-white hover:shadow-lg transition-all duration-300">
                      <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-2">Statut</p>
                      <p className="text-xl font-black text-emerald-500 mt-1">Élite</p>
                    </div>
                  </div>

                  {/* Emotional Boost */}
                  <div className="bg-gradient-to-r from-orange-50 to-amber-50/50 p-8 rounded-[2.5rem] border border-orange-100/50 flex flex-col md:flex-row justify-between items-center gap-6">
                    <div className="flex items-center gap-5">
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-600">
                        <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24"><path d="M12 18.254l-5.233 2.75 1-5.827L3.535 11.05l5.85-.85L12 4.873l2.615 5.327 5.85.85-4.232 4.127 1 5.827L12 18.254z"/></svg>
                      </div>
                      <div className="text-center md:text-left">
                        <h4 className="text-sm font-black text-orange-950 uppercase tracking-tight">Boost émotionnel</h4>
                        <p className="text-xs text-orange-600 font-bold mt-1">Encouragez {child.fullName.split(" ")[0]} maintenant.</p>
                      </div>
                    </div>
                    <button className="bg-white text-orange-600 px-8 py-4 rounded-2xl text-[10px] font-black uppercase tracking-widest shadow-sm hover:shadow-xl hover:bg-orange-600 hover:text-white transition-all duration-300">
                      Enregistrer
                    </button>
                  </div>

                  {profileComplete && (
                    <ChildAccessPanel
                      childId={child.id}
                      childName={child.fullName}
                      hasPin={!!child.accessPinHash}
                    />
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Colonne Latérale : Outils */}
          <div className="space-y-12">
            
            {/* ALLIANCE PARENTALE */}
            <div className="bg-white rounded-[3rem] p-10 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight font-jakarta">Alliance Parentale</h3>
              </div>
              
              {partner ? (
                <>
                  <div className="flex items-center gap-4 mb-8 p-5 bg-slate-50 rounded-[2rem] border border-slate-100">
                    <div className="w-14 h-14 rounded-full bg-gradient-to-br from-slate-200 to-slate-300 border-4 border-white overflow-hidden shrink-0 flex items-center justify-center font-black text-slate-500 text-xl shadow-inner">
                      {partner.fullName ? partner.fullName.substring(0, 1).toUpperCase() : "P"}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-base font-black text-slate-900 truncate">{partner.fullName}</p>
                      <div className="flex items-center gap-2 mt-1">
                        <span className={`w-2 h-2 rounded-full ${isOnline(partner.lastLoginAt) ? 'bg-green-500 animate-pulse' : 'bg-slate-300'}`}></span>
                        <p className="text-[10px] font-black text-orange-600 uppercase tracking-widest">
                          Co-Parent {isOnline(partner.lastLoginAt) ? '· En ligne' : ''}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <ChatOpener 
                      userId={partner.id} 
                      className="text-center bg-slate-950 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl"
                    >
                      Message
                    </ChatOpener>
                    <ChatOpener 
                      userId={partner.id} 
                      className="flex items-center justify-center gap-2 text-center bg-white border-2 border-slate-100 text-slate-700 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all"
                    >
                      <svg className="w-3.5 h-3.5 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z"></path></svg>
                      Vocal
                    </ChatOpener>
                  </div>
                </>
              ) : (
                <>
                  <p className="text-xs text-slate-500 font-medium leading-relaxed mb-6">
                    Aucun partenaire associé pour le moment. L'éducation est un sport d'équipe !
                  </p>
                  <Link 
                    href="/dashboard/invite"
                    className="block text-center border-2 border-dashed border-slate-200 py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest text-slate-400 hover:border-orange-400 hover:text-orange-600 hover:bg-orange-50 transition-all duration-300"
                  >
                    Inviter l'autre parent
                  </Link>
                </>
              )}
            </div>

            {/* PRINTABLE FACTORY */}
            <div className="bg-white rounded-[3rem] p-10 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-slate-50 hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-500">
              <div className="flex items-center gap-4 mb-8">
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center">
                  <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24"><path d="M16 14h.01M16 10h.01M16 6h.01M2 17h20a2 2 0 002-2V7a2 2 0 00-2-2H2a2 2 0 00-2 2v8a2 2 0 002 2zm16-12v11l-5-5-5 5V5h10z"/></svg>
                </div>
                <h3 className="text-2xl font-black text-slate-900 leading-tight font-jakarta">Printable Factory</h3>
              </div>
              <p className="text-sm text-slate-500 font-medium leading-relaxed mb-8">
                Générez des cahiers de révision ultra-personnalisés basés sur les points faibles de vos enfants.
              </p>
              <button className="w-full bg-slate-950 text-white py-5 rounded-2xl text-[10px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all duration-300 shadow-xl hover:shadow-blue-600/20">
                Générer le dossier
              </button>
            </div>

            {/* LE PONT SUGGERE */}
            <div className="bg-[#0d1117] rounded-[3rem] p-10 text-white relative overflow-hidden shadow-2xl">
              <div className="absolute -top-20 -right-20 w-64 h-64 bg-orange-600 blur-[100px] opacity-30"></div>
              <div className="relative z-10">
                <span className="inline-block px-4 py-2 bg-orange-600/10 text-orange-500 rounded-lg text-[10px] font-black uppercase tracking-[0.2em] mb-8 border border-orange-500/20">
                  Le Pont suggère
                </span>
                <p className="text-2xl font-bold leading-snug mb-10 font-jakarta">
                  "{childrenData[0]?.fullName?.split(" ")[0] || 'Votre enfant'} a excellé en Maths. Geny a préparé une activité spéciale pour ce week-end !"
                </p>
                <div className="flex gap-4">
                  <ChatOpener 
                    type="ai" 
                    name="Geny l'Expert" 
                    className="flex-1 bg-orange-600 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-orange-500 transition-all shadow-lg shadow-orange-600/20 text-center"
                  >
                    Discuter avec Geny
                  </ChatOpener>
                  <button className="flex-1 bg-white/5 border border-white/10 text-white py-4 rounded-xl text-[10px] font-black uppercase tracking-widest hover:bg-white/10 transition-all backdrop-blur-sm">
                    Plus tard
                  </button>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}

import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { Heart, MapPin, Globe, Users, ArrowRight, ShieldCheck } from "lucide-react";

export default async function OngDashboardPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.email, session.user.email));

  if (!user || user.onboardingStep! < 4) {
    redirect(`/${locale}/dashboard/onboarding`);
  }

  const metadata = user.metadata ? JSON.parse(user.metadata) : {};

  return (
    <div className="bg-slate-50 min-h-screen pb-24 font-dm-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16">
          <div>
            <h1 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight font-jakarta uppercase">
              Cockpit <span className="text-amber-500">Humanitaire</span>
            </h1>
            <p className="text-slate-500 font-medium mt-2 text-lg italic">
              Supervisez vos missions et votre impact social.
            </p>
          </div>
          <div className="bg-white border-2 border-amber-100 p-4 rounded-2xl shadow-sm flex items-center gap-4">
            <div className="w-12 h-12 bg-amber-50 rounded-xl flex items-center justify-center text-amber-600">
              <Heart className="w-6 h-6" />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Organisation</p>
              <p className="text-sm font-black text-slate-900">{user.fullName}</p>
            </div>
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 bg-white rounded-[3rem] p-12 shadow-xl border border-slate-50 relative overflow-hidden">
             <div className="relative z-10">
                <h2 className="text-2xl font-black text-slate-900 mb-6 uppercase tracking-tighter">Impact Solidaire</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                        <Users className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-slate-900 mb-1">Familles Aidées</h3>
                        <p className="text-3xl font-black text-amber-600">0</p>
                    </div>
                    <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100 text-center">
                        <ShieldCheck className="w-8 h-8 text-amber-600 mx-auto mb-4" />
                        <h3 className="text-lg font-black text-slate-900 mb-1">Missions Actives</h3>
                        <p className="text-3xl font-black text-amber-600">0</p>
                    </div>
                </div>
                
                <div className="mt-12 p-8 bg-slate-950 rounded-[2.5rem] text-white relative overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-amber-500 blur-3xl opacity-10"></div>
                    <h3 className="text-xl font-black mb-4 uppercase">Centre de contrôle</h3>
                    <p className="text-slate-400 text-sm mb-6">Prêt à lancer votre première campagne de soutien scolaire ?</p>
                    <button className="flex items-center gap-3 bg-amber-500 text-white px-6 py-3 rounded-xl font-black text-xs uppercase tracking-widest hover:bg-amber-600 transition-all">
                        Lancer une mission <ArrowRight className="w-4 h-4" />
                    </button>
                </div>
             </div>
          </div>

          <div className="space-y-8">
             <div className="bg-white rounded-[2.5rem] p-8 shadow-lg border border-slate-50">
                <h3 className="text-sm font-black uppercase text-slate-900 mb-6 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-amber-500" /> Siège Social
                </h3>
                <p className="text-xs text-slate-500 font-bold leading-relaxed">
                    {metadata.childSchool || "Adresse non renseignée"}
                </p>
             </div>
             
             <div className="bg-amber-500 rounded-[2.5rem] p-8 text-white shadow-lg shadow-amber-200">
                <h3 className="text-sm font-black uppercase mb-4 tracking-widest">Certification ONG</h3>
                <p className="text-xl font-black mb-2 italic">Elite Partner</p>
                <div className="mt-4 p-3 bg-white/10 rounded-xl border border-white/20 flex items-center justify-center">
                    <Globe className="w-10 h-10 opacity-40" />
                </div>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}

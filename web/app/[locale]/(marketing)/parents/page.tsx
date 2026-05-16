"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";
import Link from "next/link";

export default function ParentsPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="Pour les Parents"
        title="Reprenez le contrôle."
        subtitle="Le Cockpit Parental vous donne une vue rayon-X sur les progrès, les passions et les besoins de votre enfant."
        gradient="from-orange-50 to-white"
      />
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Ne soyez plus spectateur.</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          Rejoignez l'Alliance Parentale, collaborez avec l'IA Geny et transformez le temps d'écran en temps d'excellence.
        </p>
        <Link href="/auth/register" className="inline-block bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">
          Créer un compte gratuit
        </Link>
      </section>
    </main>
  );
}

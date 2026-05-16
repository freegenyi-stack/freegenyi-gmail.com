"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function InvestorsPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="Investisseurs"
        title="Rejoignez la Révolution."
        subtitle="Devenez partenaire d'un projet qui transforme l'avenir de millions d'enfants."
        gradient="from-blue-50 to-white"
      />
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Investissez dans l'humain.</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          Nous recherchons des partenaires visionnaires pour étendre notre infrastructure d'IA et notre portée mondiale.
        </p>
        <button className="bg-slate-900 text-white px-8 py-4 rounded-xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">
          Contacter notre équipe
        </button>
      </section>
    </main>
  );
}

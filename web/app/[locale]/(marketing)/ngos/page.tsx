"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function NGOsPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="Pour les ONG"
        title="Éduquer le monde."
        subtitle="Déployez notre plateforme gratuitement dans les zones les plus défavorisées."
        gradient="from-emerald-50 to-white"
      />
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-6">L'éducation n'a pas de frontières.</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          Nous fournissons des portails spécifiques pour le déploiement hors-ligne et à grande échelle.
        </p>
      </section>
    </main>
  );
}

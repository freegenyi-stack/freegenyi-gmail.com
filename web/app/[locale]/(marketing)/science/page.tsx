"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function SciencePage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="Recherche & Données"
        title="La science de l'apprentissage."
        subtitle="Nos algorithmes d'IA s'appuient sur des décennies de recherche en sciences cognitives pour optimiser la rétention et l'engagement."
        gradient="from-indigo-50 to-white"
      />
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <div className="bg-slate-50 p-12 rounded-[3rem] border border-slate-100">
          <div className="text-6xl mb-6">🔬</div>
          <h2 className="text-2xl font-black text-slate-900 mb-4">L'Algorithme FreeGeny</h2>
          <p className="text-slate-600 leading-relaxed">
            Grâce à l'analyse en temps réel, notre système identifie le moment exact où un concept est acquis et ajuste la difficulté pour maintenir l'enfant dans un état de "Flow" cognitif continu.
          </p>
        </div>
      </section>
    </main>
  );
}

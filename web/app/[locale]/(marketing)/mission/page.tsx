"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function MissionPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="Notre Mission"
        title="Démocratiser l'excellence."
        subtitle="Nous croyons fermement qu'aucun talent ne doit être gâché à cause des inégalités du système éducatif traditionnel."
        gradient="from-amber-50 to-white"
      />
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Élever chaque enfant.</h2>
        <p className="text-lg text-slate-600 leading-relaxed">
          FreeGeny n'est pas juste une plateforme, c'est un mouvement global visant à fournir une éducation de niveau "Élite" à tous, gratuitement, partout dans le monde.
        </p>
      </section>
    </main>
  );
}

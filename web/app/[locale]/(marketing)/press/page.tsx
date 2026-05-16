"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function PressPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="Presse"
        title="Ils parlent de nous."
        subtitle="Découvrez les mentions et communiqués de presse sur FreeGeny."
        gradient="from-slate-50 to-white"
      />
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <div className="text-6xl mb-6">📰</div>
        <h2 className="text-2xl font-black text-slate-900">Espace Presse</h2>
        <p className="text-slate-500 mt-4">Contactez press@freegeny.com pour toute demande d'interview.</p>
      </section>
    </main>
  );
}

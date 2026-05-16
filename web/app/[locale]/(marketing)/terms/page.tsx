"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function TermsPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        title="Conditions d'Utilisation."
        subtitle="Les règles du jeu pour utiliser FreeGeny en toute sérénité."
        gradient="from-slate-50 to-white"
      />
      <section className="py-24 px-6 max-w-3xl mx-auto prose prose-slate">
        <h2>Utilisation du Service</h2>
        <p>L'utilisation de la plateforme implique l'acceptation de nos conditions. FreeGeny s'engage à maintenir une plateforme éducative sûre et bienveillante.</p>
      </section>
    </main>
  );
}

"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function PrivacyPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        title="Politique de Confidentialité."
        subtitle="Vos données vous appartiennent. Nous les protégeons avec les plus hauts standards de sécurité."
        gradient="from-slate-50 to-white"
      />
      <section className="py-24 px-6 max-w-3xl mx-auto prose prose-slate">
        <h2>Protection des données</h2>
        <p>Chez FreeGeny, nous prenons la vie privée de vos enfants très au sérieux. Les données sont chiffrées et ne sont jamais vendues à des tiers.</p>
      </section>
    </main>
  );
}

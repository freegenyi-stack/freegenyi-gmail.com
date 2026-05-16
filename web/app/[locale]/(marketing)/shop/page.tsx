"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function ShopPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="Boutique"
        title="La Boutique FreeGeny."
        subtitle="Soutenez notre mission en achetant des produits éducatifs et dérivés."
        gradient="from-orange-50 to-white"
      />
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <div className="text-6xl mb-6">🛍️</div>
        <h2 className="text-2xl font-black text-slate-900">Boutique en construction</h2>
        <p className="text-slate-500 mt-4">Revenez bientôt pour découvrir nos articles exclusifs.</p>
      </section>
    </main>
  );
}

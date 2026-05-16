"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function FAQPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        title="Foire Aux Questions."
        subtitle="Tout ce que vous devez savoir sur FreeGeny."
        gradient="from-slate-50 to-white"
      />
      <section className="py-24 px-6 max-w-3xl mx-auto">
        <div className="space-y-6">
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-2">FreeGeny est-il vraiment gratuit ?</h3>
            <p className="text-slate-600 font-medium">Oui, notre mission est de démocratiser l'éducation. Toutes les fonctionnalités essentielles et "Élite" sont gratuites.</p>
          </div>
          <div className="bg-slate-50 p-6 rounded-3xl border border-slate-100">
            <h3 className="text-lg font-black text-slate-900 mb-2">Comment l'IA fonctionne-t-elle ?</h3>
            <p className="text-slate-600 font-medium">Geny, notre IA, agit comme un mentor. Elle ne donne pas les réponses, mais aide l'enfant à réfléchir.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function BlogPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        title="Le Blog FreeGeny."
        subtitle="Actualités, conseils en parentalité et découvertes en neurosciences."
        gradient="from-slate-50 to-white"
      />
      <section className="py-24 px-6 max-w-5xl mx-auto text-center">
        <div className="text-6xl mb-6">📝</div>
        <h2 className="text-2xl font-black text-slate-900">Bientôt disponible</h2>
        <p className="text-slate-500 mt-4">Nos rédacteurs préparent des articles incroyables.</p>
      </section>
    </main>
  );
}

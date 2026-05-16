"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function GoalsPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="Nos Objectifs"
        title="Vision 2030."
        subtitle="Découvrez nos ambitions pour la prochaine décennie de l'éducation mondiale."
        gradient="from-emerald-50 to-white"
      />
      <section className="py-24 px-6 max-w-4xl mx-auto">
        <div className="grid md:grid-cols-2 gap-8">
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-4">1 Million d'enfants</h3>
            <p className="text-slate-600">Accompagner gratuitement un million d'enfants d'ici 2030, indépendamment de leur origine.</p>
          </div>
          <div className="bg-slate-50 p-8 rounded-3xl border border-slate-100">
            <h3 className="text-2xl font-black text-slate-900 mb-4">Empreinte carbone zéro</h3>
            <p className="text-slate-600">Une infrastructure verte pour propulser notre IA éducative sans nuire à la planète.</p>
          </div>
        </div>
      </section>
    </main>
  );
}

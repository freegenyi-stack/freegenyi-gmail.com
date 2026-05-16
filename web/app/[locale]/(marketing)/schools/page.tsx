"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function SchoolsPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="Pour les Écoles"
        title="La classe du futur, aujourd'hui."
        subtitle="Un tableau de bord complet pour les enseignants. Suivez le progrès de votre classe en un coup d'œil et personnalisez l'apprentissage."
        gradient="from-blue-50 to-white"
      />
      <section className="py-24 px-6 max-w-4xl mx-auto text-center">
        <h2 className="text-3xl font-black text-slate-900 mb-6">Devenez une école Élite.</h2>
        <p className="text-lg text-slate-600 leading-relaxed mb-10">
          Intégrez FreeGeny dans votre cursus et donnez à vos professeurs les outils de l'IA pour révolutionner la réussite scolaire.
        </p>
      </section>
    </main>
  );
}

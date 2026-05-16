"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function LegalPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        title="Mentions Légales."
        subtitle="Informations légales concernant FreeGeny."
        gradient="from-slate-50 to-white"
      />
      <section className="py-24 px-6 max-w-3xl mx-auto prose prose-slate">
        <h2>Éditeur du site</h2>
        <p>FreeGeny est édité par l'organisation éponyme, dédiée à l'éducation ouverte et accessible.</p>
      </section>
    </main>
  );
}

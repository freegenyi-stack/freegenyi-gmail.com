"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function DataProtectionPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        title="Protection des Données."
        subtitle="Conformité RGPD et sécurité infantile."
        gradient="from-slate-50 to-white"
      />
      <section className="py-24 px-6 max-w-3xl mx-auto prose prose-slate">
        <h2>Notre engagement</h2>
        <p>Conforme au RGPD et aux normes de protection de l'enfance, vos données et celles de vos enfants sont stockées de façon sécurisée (chiffrement AES-256).</p>
      </section>
    </main>
  );
}

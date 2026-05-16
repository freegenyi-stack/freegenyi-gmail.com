"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";
import { motion } from "framer-motion";

export default function AboutPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="Notre Histoire"
        title="Révéler le génie de chaque enfant."
        subtitle="FreeGeny est né d'une conviction simple : l'éducation de classe mondiale ne devrait pas être un luxe, mais un droit universel."
        gradient="from-blue-50 to-white"
      />

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-2 gap-16 items-center">
          <motion.div initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl font-black text-slate-900 mb-6">L'éducation réinventée.</h2>
            <p className="text-slate-600 leading-relaxed mb-6">
              Nous avons combiné les dernières avancées en neurosciences, en psychologie cognitive et en intelligence artificielle pour créer une plateforme qui s'adapte à la vitesse de pensée de votre enfant.
            </p>
            <p className="text-slate-600 leading-relaxed">
              Il ne s'agit pas seulement d'apprendre, mais d'apprendre à apprendre. De découvrir sa propre voix. De forger la confiance qui transformera le monde de demain.
            </p>
          </motion.div>
          <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative">
            <div className="aspect-square rounded-[3rem] bg-gradient-to-tr from-slate-100 to-slate-50 overflow-hidden border border-slate-100 shadow-2xl flex items-center justify-center text-6xl">
              🌍
            </div>
            <div className="absolute -bottom-8 -left-8 bg-white p-6 rounded-3xl shadow-xl border border-slate-50">
              <p className="text-3xl font-black text-orange-600">100%</p>
              <p className="text-xs font-bold text-slate-500 uppercase tracking-widest mt-1">Gratuit pour toujours</p>
            </div>
          </motion.div>
        </div>
      </section>
    </main>
  );
}

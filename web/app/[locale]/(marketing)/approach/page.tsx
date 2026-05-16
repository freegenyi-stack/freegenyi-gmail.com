"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";
import { motion } from "framer-motion";

export default function ApproachPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        badge="La Méthode"
        title="Apprendre par l'exploration."
        subtitle="Oubliez la mémorisation mécanique. Notre méthode transforme chaque concept complexe en une aventure interactive."
        gradient="from-emerald-50 to-white"
      />

      <section className="py-24 px-6 max-w-7xl mx-auto">
        <div className="grid md:grid-cols-3 gap-8">
          {[
            { icon: "🧠", title: "Neurosciences", desc: "Adaptation dynamique au rythme d'assimilation." },
            { icon: "🎮", title: "Gamification", desc: "Le jeu comme vecteur principal de l'engagement cognitif." },
            { icon: "🤝", title: "Alliance Parentale", desc: "Impliquer la famille pour un renforcement positif." }
          ].map((item, i) => (
            <motion.div key={i} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }}
              className="bg-slate-50 rounded-[2rem] p-10 border border-slate-100 hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
              <div className="text-4xl mb-6">{item.icon}</div>
              <h3 className="text-xl font-black text-slate-900 mb-3">{item.title}</h3>
              <p className="text-sm font-medium text-slate-500">{item.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </main>
  );
}

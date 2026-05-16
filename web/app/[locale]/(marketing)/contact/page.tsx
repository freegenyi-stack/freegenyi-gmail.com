"use client";
import React from "react";
import MarketingHero from "@/components/MarketingHero";

export default function ContactPage() {
  return (
    <main className="bg-white min-h-screen">
      <MarketingHero 
        title="Contactez-nous."
        subtitle="Nous sommes là pour vous aider à changer le monde."
        gradient="from-slate-50 to-white"
      />
      <section className="py-24 px-6 max-w-2xl mx-auto">
        <form className="space-y-6">
          <input type="text" placeholder="Votre nom" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-orange-500" />
          <input type="email" placeholder="Votre email" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-orange-500" />
          <textarea rows={6} placeholder="Votre message" className="w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-4 px-6 font-bold outline-none focus:border-orange-500 resize-none"></textarea>
          <button type="submit" className="w-full bg-slate-900 text-white py-4 rounded-xl font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl">
            Envoyer le message
          </button>
        </form>
      </section>
    </main>
  );
}

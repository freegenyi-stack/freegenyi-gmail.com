"use client";

import { Link } from "@/i18n/routing";
import React from "react";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

export default function PortalClient({ 
  portal, 
  locale 
}: { 
  portal: any, 
  locale: string 
}) {
  return (
    <>
      {/* Background Glow */}
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <motion.div 
          animate={{ scale: [1, 1.2, 1], opacity: [0.2, 0.3, 0.2] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
          className="absolute inset-0 rounded-full blur-[200px]"
          style={{ backgroundColor: portal.themeColor }}
        />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="relative z-10 text-center max-w-2xl bg-white/5 backdrop-blur-3xl border border-white/10 p-12 md:p-16 rounded-[4rem] shadow-3xl mx-4"
      >
        <motion.div 
          initial={{ rotate: -10, scale: 0.8 }}
          animate={{ rotate: 0, scale: 1 }}
          transition={{ type: "spring", stiffness: 100, delay: 0.2 }}
          className={`w-32 h-32 ${portal.color} rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl`}
          style={{ boxShadow: `0 20px 50px ${portal.glowColor}` }}
        >
          {portal.icon}
        </motion.div>

        <h1 className="text-4xl md:text-5xl font-black mb-6 font-jakarta tracking-tighter">
          {portal.title}
        </h1>
        
        <p className="text-lg md:text-xl text-white/60 font-light mb-12 leading-relaxed">
          {portal.description}
        </p>

        <div className="flex flex-col gap-6">
          <button className={`${portal.color} hover:brightness-110 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl active:scale-95`}>
            {portal.buttonLabel}
          </button>
          
          <Link 
            href="/dashboard/parent" // In a real app, we'd need to know which child's lobby to return to
            className="inline-flex items-center justify-center gap-2 text-white/40 font-bold uppercase tracking-widest text-[10px] hover:text-white transition-colors group"
          >
            <ArrowLeft className="w-3 h-3 transition-transform group-hover:-translate-x-1" />
            Retour au Lobby
          </Link>
        </div>
      </motion.div>
    </>
  );
}

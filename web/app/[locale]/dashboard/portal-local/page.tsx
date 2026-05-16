"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { GraduationCap, ChevronLeft, ChevronRight, BookOpen, Star, Trophy } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function PortalLocalPage() {
  const t = useTranslations("ChildLobby.Portals.School");
  const locale = useLocale();
  const isRTL = locale === "ar";

  return (
    <div className="min-h-screen flex items-center justify-center p-8 text-white relative overflow-hidden bg-slate-950" dir={isRTL ? "rtl" : "ltr"}>
      <div className="fixed inset-0 opacity-20 pointer-events-none">
        <div className="absolute inset-0 bg-blue-600 blur-[200px] rounded-full" />
      </div>
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 text-center max-w-2xl bg-white/5 backdrop-blur-3xl border border-white/10 p-12 md:p-20 rounded-[4rem] shadow-3xl"
      >
        <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 shadow-2xl group-hover:rotate-6 transition-transform">
          <GraduationCap className="w-16 h-16 text-white" />
        </div>
        <h1 className={cn("text-5xl font-black mb-6 tracking-tighter font-title", isRTL && "font-amiri text-6xl")}>{t("Title")}</h1>
        <p className={cn("text-xl text-blue-200/60 font-light mb-12", isRTL && "font-lateef text-3xl")}>{t("Desc")}</p>
        
        <div className="grid grid-cols-1 gap-4">
          <button className={cn("bg-blue-600 hover:bg-blue-700 text-white px-10 py-5 rounded-3xl font-black uppercase tracking-widest text-sm transition-all shadow-xl hover:shadow-blue-900/40", isRTL && "font-amiri text-2xl tracking-normal")}>
            {t("CTA")}
          </button>
          <Link href="/dashboard/child-lobby" className={cn("inline-flex items-center justify-center gap-2 text-blue-400 font-bold uppercase tracking-widest text-xs hover:text-white transition-colors mt-4", isRTL && "flex-row-reverse font-amiri text-xl tracking-normal")}>
            {isRTL ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            {isRTL ? "العودة إلى اللوبي" : "Retour au Lobby"}
          </Link>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import { Link } from "@/i18n/routing";
import React from "react";

import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { 
  ArrowRight, 
  Globe, 
  GraduationCap, 
  Zap, 
  ChevronLeft,
  ChevronRight
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export default function ChildLobbyPage() {
  const t = useTranslations("ChildLobby");
  const locale = useLocale();
  const isRTL = (locale === "ar" || locale.endsWith("-ar"));
  
  // Mock data for now
  const childName = "Amine";
  const xp = 1250;

  return (
    <div className="min-h-screen text-white flex flex-col items-center justify-center p-8 relative overflow-hidden bg-slate-950" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ 
            y: [0, -20, 0],
          }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 3 }}
          className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-orange-600/20 blur-[150px] rounded-full"
        />
      </div>

      {/* Top Bar */}
      <div className={cn("fixed top-0 left-0 right-0 p-8 flex justify-between items-center z-50", isRTL && "flex-row-reverse")}>
        <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
          <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🦊</span>
          </div>
          <div className={isRTL ? "text-right" : "text-left"}>
            <h1 className={cn("text-2xl font-black tracking-tight font-title", isRTL && "font-amiri text-3xl")}>
              {t("Greeting", { name: childName })}
            </h1>
            <div className={cn("flex items-center gap-3 mt-1", isRTL && "flex-row-reverse")}>
              <span className={cn("text-[10px] font-black uppercase tracking-widest text-orange-500", isRTL && "font-amiri text-sm tracking-normal")}>
                {xp.toLocaleString()} XP
              </span>
              <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: "66%" }}
                  className="h-full bg-orange-600 shadow-[0_0_10px_#ea580c]"
                />
              </div>
            </div>
          </div>
        </div>
        <Link href="/dashboard" className={cn("bg-white/5 backdrop-blur-xl px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all", isRTL && "font-amiri text-lg tracking-normal")}>
          {t("ParentDashboard")}
        </Link>
      </div>

      {/* Portals Grid */}
      <div className="max-w-7xl w-full grid grid-cols-1 md:grid-cols-3 gap-10 relative z-10 py-20">
        
        {/* Portal: Local */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-blue-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-32 h-32 bg-blue-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-[0_20px_50px_rgba(37,99,235,0.3)] group-hover:rotate-6">
            <GraduationCap className="w-16 h-16 text-white" />
          </div>
          <h2 className={cn("text-3xl font-black mb-4 tracking-tighter font-title", isRTL && "font-amiri text-4xl")}>{t("Portals.School.Title")}</h2>
          <p className={cn("text-blue-300/60 font-light text-sm leading-relaxed mb-8", isRTL && "font-lateef text-xl")}>{t("Portals.School.Desc")}</p>
          <Link href="/dashboard/portal-local" className={cn("inline-flex items-center gap-2 text-blue-400 font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all", isRTL && "flex-row-reverse font-amiri text-lg tracking-normal")}>
            <span>{t("Portals.School.CTA")}</span>
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Link>
        </motion.div>

        {/* Portal: World */}
        <motion.div
          whileHover={{ y: -10, scale: 1.05 }}
          initial={{ scale: 1.05 }}
          className="group relative bg-white/5 backdrop-blur-2xl border border-white/20 rounded-[4rem] p-12 text-center overflow-hidden shadow-3xl z-20"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-orange-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-40 h-40 bg-orange-600 rounded-[3rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-[0_25px_60px_rgba(234,88,12,0.4)] group-hover:-rotate-6">
            <Globe className="w-20 h-20 text-white" />
          </div>
          <h2 className={cn("text-4xl font-black mb-4 tracking-tighter font-title text-orange-400", isRTL && "font-amiri text-5xl")}>{t("Portals.World.Title")}</h2>
          <p className={cn("text-orange-200/60 font-light text-sm leading-relaxed mb-8", isRTL && "font-lateef text-xl")}>{t("Portals.World.Desc")}</p>
          <Link href="/dashboard/portal-world" className={cn("inline-flex items-center gap-2 text-orange-500 font-black uppercase tracking-widest text-[11px] group-hover:gap-4 transition-all", isRTL && "flex-row-reverse font-amiri text-xl tracking-normal")}>
            <span>{t("Portals.World.CTA")}</span>
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Link>
        </motion.div>

        {/* Portal: Magic */}
        <motion.div
          whileHover={{ y: -10, scale: 1.02 }}
          className="group relative bg-white/5 backdrop-blur-2xl border border-white/10 rounded-[4rem] p-12 text-center overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-b from-teal-600/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
          <div className="w-32 h-32 bg-teal-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-10 transition-all duration-500 shadow-[0_20px_50px_rgba(13,148,136,0.3)] group-hover:rotate-12">
            <Zap className="w-16 h-16 text-white" />
          </div>
          <h2 className={cn("text-3xl font-black mb-4 tracking-tighter font-title", isRTL && "font-amiri text-4xl")}>{t("Portals.Arena.Title")}</h2>
          <p className={cn("text-teal-300/60 font-light text-sm leading-relaxed mb-8", isRTL && "font-lateef text-xl")}>{t("Portals.Arena.Desc")}</p>
          <Link href="/dashboard/portal-magic" className={cn("inline-flex items-center gap-2 text-teal-400 font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all", isRTL && "flex-row-reverse font-amiri text-lg tracking-normal")}>
            <span>{t("Portals.Arena.CTA")}</span>
            {isRTL ? <ChevronLeft className="w-4 h-4" /> : <ChevronRight className="w-4 h-4" />}
          </Link>
        </motion.div>
      </div>

      {/* Mascot Message */}
      <motion.div 
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn("fixed bottom-10 max-w-2xl bg-white/5 backdrop-blur-xl p-8 rounded-[3rem] border border-white/10 flex items-center gap-8 shadow-3xl", isRTL && "flex-row-reverse")}
      >
        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0">
          <span className="text-4xl">🦊</span>
        </div>
        <div className={isRTL ? "text-right" : "text-left"}>
          <p className={cn("text-slate-300 font-light leading-relaxed italic", isRTL && "font-lateef text-2xl")}>
            {(() => {
              const rawMsg = t.raw("Mascot.Message") as string;
              const parts = rawMsg.split(/({name}|{boost})/);
              return parts.map((part, idx) => {
                if (part === "{name}") {
                  return <span className="text-orange-600 font-black" key={`name-${idx}`}>{childName}</span>;
                }
                if (part === "{boost}") {
                  return <span className="bg-orange-600/20 px-2 rounded text-orange-500 font-bold mx-1" key={`boost-${idx}`}>{t("Mascot.BoostTag")}</span>;
                }
                return part;
              });
            })()}
          </p>
        </div>
      </motion.div>

    </div>
  );
}

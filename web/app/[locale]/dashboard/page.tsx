"use client";

import React from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { 
  Plus, 
  Settings, 
  MessageSquare, 
  Heart, 
  Printer, 
  Zap, 
  Trophy, 
  TrendingUp, 
  Target, 
  Check, 
  ArrowRight,
  Mic,
  Camera,
  LogOut,
  Palette
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslations, useLocale } from "next-intl";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const childrenData = [
  {
    id: 1,
    name: "Amine",
    grade: "1AP",
    xp: 15420,
    progress: 78,
    interest: "Astronomie",
    status: "Élite",
    subjects: [
      { name: "Arabe", score: 85, color: "bg-orange-500" },
      { name: "Maths", score: 92, color: "bg-blue-500" },
      { name: "Science", score: 88, color: "bg-teal-500" },
    ],
  },
];

export default function DashboardPage() {
  const t = useTranslations("Dashboard");
  const locale = useLocale();
  const isRTL = (locale === "ar" || locale.endsWith("-ar"));

  return (
    <div className="min-h-screen bg-slate-50/50 pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        
        {/* Header Section */}
        <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-16", isRTL && "md:flex-row-reverse")}>
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 20 : -20 }}
            animate={{ opacity: 1, x: 0 }}
            className={isRTL ? "text-right" : "text-left"}
          >
            <h1 className={cn("text-4xl font-extrabold text-slate-900 tracking-tight", isRTL && "font-amiri text-5xl")}>{t("Title")}</h1>
            <p className={cn("text-slate-500 font-normal mt-1", isRTL && "font-lateef text-2xl")}>{t("Subtitle")}</p>
          </motion.div>
          <motion.button
            initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className={cn("flex items-center gap-3 bg-white border border-slate-200 px-8 py-4 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:shadow-xl transition-all shadow-sm", isRTL && "flex-row-reverse font-amiri text-lg tracking-normal")}
          >
            <Plus className="w-4 h-4 text-orange-600" />
            {t("AddChild")}
          </motion.button>
        </div>

        <div className="grid lg:grid-cols-3 gap-12">
          
          {/* Main Column: Children Cards */}
          <div className="lg:col-span-2 space-y-12">
            {childrenData.map((child, idx) => (
              <motion.div
                key={child.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
                className={cn("bg-white rounded-[3rem] p-8 md:p-12 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white/50 relative overflow-hidden group", isRTL && "text-right")}
              >
                {/* Background Decor */}
                <div className={cn("absolute -top-24 w-64 h-64 bg-orange-50 rounded-full blur-[100px] opacity-0 group-hover:opacity-100 transition-opacity duration-700", isRTL ? "-left-24" : "-right-24")} />

                <div className="relative z-10">
                  <div className={cn("flex flex-col md:flex-row justify-between items-start md:items-center gap-8 mb-12", isRTL && "md:flex-row-reverse")}>
                    <div className={cn("flex items-center gap-6", isRTL && "flex-row-reverse")}>
                      <div className="w-24 h-24 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl flex items-center justify-center text-4xl shadow-2xl relative">
                        🦊
                        <div className={cn("absolute -bottom-2 w-8 h-8 bg-orange-600 rounded-full border-4 border-white flex items-center justify-center shadow-md", isRTL ? "-left-2" : "-right-2")}>
                          <Check className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <h2 className={cn("text-3xl font-extrabold text-slate-900 tracking-tight", isRTL && "font-amiri text-4xl")}>{child.name}</h2>
                        <div className={cn("flex items-center gap-2 mt-1", isRTL && "flex-row-reverse")}>
                          <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400", isRTL && "font-amiri text-base tracking-normal")}>{t("ChildCard.Level")} : {child.grade}</span>
                          <span className="w-1.5 h-1.5 bg-slate-200 rounded-full" />
                          <span className={cn("text-[10px] font-bold uppercase tracking-[0.2em] text-orange-600", isRTL && "font-amiri text-base tracking-normal")}>{t("ChildCard.Premium")}</span>
                        </div>
                      </div>
                    </div>
                    <button className={cn("w-full md:w-auto bg-slate-950 text-white px-10 py-5 rounded-2xl text-[11px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl hover:shadow-orange-200/50", isRTL && "font-amiri text-xl tracking-normal")}>
                      {t("ChildCard.ModeLearner")}
                    </button>
                  </div>

                  {/* Stats Grid */}
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
                    {[
                      { label: t("ChildCard.XP"), value: child.xp.toLocaleString(), icon: <Zap className="w-4 h-4" /> },
                      { label: t("ChildCard.Progress"), value: `${child.progress}%`, icon: <TrendingUp className="w-4 h-4" /> },
                      { label: t("ChildCard.Interest"), value: child.interest, icon: <Target className="w-4 h-4" /> },
                      { label: t("ChildCard.Status"), value: child.status, icon: <Trophy className="w-4 h-4" />, highlight: true },
                    ].map((stat) => (
                      <div key={stat.label} className="bg-slate-50/50 p-6 rounded-3xl border border-slate-100/50 flex flex-col items-center justify-center text-center group/stat hover:bg-white hover:shadow-md transition-all">
                        <div className="mb-2 opacity-30 group-hover/stat:opacity-100 group-hover/stat:text-orange-600 transition-all">
                          {stat.icon}
                        </div>
                        <p className={cn("text-[9px] font-bold text-slate-400 uppercase tracking-widest mb-1", isRTL && "font-amiri text-sm tracking-normal")}>{stat.label}</p>
                        <p className={cn(
                          "text-xl font-semibold truncate w-full",
                          stat.highlight ? "text-orange-600" : "text-slate-900",
                          isRTL && "font-amiri text-2xl"
                        )}>
                          {stat.value}
                        </p>
                      </div>
                    ))}
                  </div>

                  {/* Emotional Boost Banner */}
                  <motion.div 
                    whileHover={{ scale: 1.01 }}
                    className={cn("bg-gradient-to-r from-orange-50 to-amber-50 p-8 rounded-[2.5rem] border border-orange-100/50 flex flex-col md:flex-row justify-between items-center gap-6", isRTL && "md:flex-row-reverse")}
                  >
                    <div className={cn("flex items-center gap-5", isRTL && "flex-row-reverse")}>
                      <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center shadow-sm text-orange-600">
                        <Heart className="w-8 h-8 fill-current" />
                      </div>
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <h4 className={cn("text-sm font-bold text-orange-950 uppercase tracking-tight", isRTL && "font-amiri text-lg")}>{t("ChildCard.EmotionalBoost.Title")}</h4>
                        <p className={cn("text-xs text-orange-600 font-semibold italic", isRTL && "font-lateef text-xl")}>{t("ChildCard.EmotionalBoost.Desc", { name: child.name })}</p>
                      </div>
                    </div>
                    <button className={cn("bg-white text-orange-600 px-8 py-3.5 rounded-2xl text-[10px] font-bold uppercase tracking-widest shadow-sm hover:shadow-xl transition-all border border-orange-100", isRTL && "font-amiri text-lg tracking-normal")}>
                      {t("ChildCard.EmotionalBoost.Record")}
                    </button>
                  </motion.div>
                </div>
              </motion.div>
            ))}
          </div>

          {/* Sidebar: Tools */}
          <div className="space-y-12">
            
            {/* Alliance Parentale */}
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              className={cn("bg-white rounded-[2.5rem] p-10 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white/50", isRTL && "text-right")}
            >
              <div className={cn("flex items-center gap-4 mb-8", isRTL && "flex-row-reverse")}>
                <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Heart className="w-6 h-6" />
                </div>
                <h3 className={cn("text-xl font-semibold text-slate-900 leading-tight", isRTL && "font-amiri text-2xl")}>{t("Alliance.Title")}</h3>
              </div>
              
              <div className={cn("flex items-center gap-4 mb-8 p-4 bg-slate-50/50 rounded-2xl border border-slate-100", isRTL && "flex-row-reverse")}>
                <div className="w-12 h-12 rounded-full bg-slate-900 border-2 border-white overflow-hidden shrink-0 flex items-center justify-center font-bold text-white shadow-sm">
                  JD
                </div>
                <div className={cn("min-w-0 flex-1", isRTL && "text-right")}>
                  <p className="text-sm font-bold text-slate-900 truncate">Jane Doe</p>
                  <div className={cn("flex items-center gap-1.5 mt-0.5", isRTL && "flex-row-reverse")}>
                    <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                    <p className={cn("text-[9px] font-bold text-orange-600 uppercase tracking-widest", isRTL && "font-amiri text-sm tracking-normal")}>{t("Alliance.CoParent")} · {t("Alliance.Online")}</p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <button className={cn("flex items-center justify-center gap-2 bg-slate-950 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-lg shadow-slate-900/10", isRTL && "font-amiri text-lg tracking-normal")}>
                  <MessageSquare className="w-3 h-3" /> {t("Alliance.Message")}
                </button>
                <button className={cn("flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-slate-50 transition-all shadow-sm", isRTL && "font-amiri text-lg tracking-normal")}>
                  <Camera className="w-3 h-3" /> {t("Alliance.Photo")}
                </button>
              </div>
            </motion.div>

            {/* Printable Factory */}
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className={cn("bg-white rounded-[2.5rem] p-10 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white/50", isRTL && "text-right")}
            >
              <div className={cn("flex items-center gap-4 mb-8", isRTL && "flex-row-reverse")}>
                <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shadow-sm">
                  <Printer className="w-6 h-6" />
                </div>
                <h3 className={cn("text-xl font-semibold text-slate-900 leading-tight", isRTL && "font-amiri text-2xl")}>{t("Printable.Title")}</h3>
              </div>
              <p className={cn("text-sm text-slate-500 font-normal leading-relaxed mb-8", isRTL && "font-lateef text-xl")}>
                {t("Printable.Desc")}
              </p>
              <button className={cn("w-full bg-slate-950 text-white py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest hover:bg-blue-600 transition-all shadow-xl shadow-slate-900/10", isRTL && "font-amiri text-xl tracking-normal")}>
                {t("Printable.CTA")}
              </button>
            </motion.div>

            {/* AI Suggestion (Le Pont suggère) */}
            <motion.div 
              initial={{ opacity: 0, x: isRTL ? -20 : 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className={cn("bg-slate-950 rounded-[2.5rem] p-10 text-white relative overflow-hidden group", isRTL && "text-right")}
            >
              <div className={cn("absolute -top-10 w-40 h-40 bg-orange-600 blur-[80px] opacity-20 group-hover:opacity-40 transition-opacity duration-1000", isRTL ? "-left-10" : "-right-10")} />
              <div className="relative z-10">
                <span className={cn("text-[10px] font-bold uppercase tracking-widest text-orange-500 mb-6 block", isRTL && "font-amiri text-base")}>{t("Bridge.Tag")}</span>
                <p className={cn("text-xl font-semibold leading-relaxed mb-10", isRTL && "font-amiri text-2xl leading-snug")}>
                  "{childrenData[0].name} a excellé en Maths. Offrez-lui une partie de foot au parc ce samedi ?"
                </p>
                <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
                  <button className={cn("flex-1 bg-orange-600 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-orange-700 transition-all shadow-lg shadow-orange-600/20", isRTL && "font-amiri text-xl tracking-normal")}>
                    {t("Bridge.Validate")}
                  </button>
                  <button className={cn("flex-1 bg-white/10 text-white py-4 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:bg-white/20 transition-all", isRTL && "font-amiri text-xl tracking-normal")}>
                    {t("Bridge.Ignore")}
                  </button>
                </div>
              </div>
            </motion.div>

          </div>
        </div>
      </div>
    </div>
  );
}

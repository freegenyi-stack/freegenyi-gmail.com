"use client";

import { Link } from "@/i18n/routing";
import React, { useState, useEffect } from "react";

import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useRegion } from "@/context/RegionContext";
import { getVariant } from "@/constants/variants";
import { 
  ArrowRight, 
  Play, 
  Star, 
  Shield, 
  Zap, 
  Globe, 
  Mic, 
  GraduationCap, 
  Heart,
  ChevronRight,
  Sparkles,
  BookOpen,
  LayoutDashboard,
  Rocket,
  ShoppingCart
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTranslations, useLocale } from "next-intl";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const ImpactCounter = ({ target, label, prefix = "", suffix = "" }: { target: number, label: string, prefix?: string, suffix?: string }) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 2000;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(Math.floor(start));
      }
    }, 16);
    return () => clearInterval(timer);
  }, [target]);

  return (
    <div className="flex items-baseline gap-1.5">
      <span className="text-xl font-black leading-none text-orange-600">{prefix}{count}{suffix}</span>
      <span className="text-[10px] font-bold uppercase tracking-tighter text-slate-400">{label}</span>
    </div>
  );
};

export default function HomePage() {
  const t = useTranslations("Hero");
  const tNav = useTranslations("Nav");
  const ti = useTranslations("Impact");
  const tp = useTranslations("Portals");
  const te = useTranslations("Ecosystem");
  const tb = useTranslations("EmotionBoost");
  const tin = useTranslations("Innovation");
  const tf = useTranslations("Footer");
  
  const locale = useLocale();
  const { selectedCountry } = useRegion();
  const variant = getVariant(selectedCountry, locale);
  console.log(`[HomePage] Country: ${selectedCountry}, Locale: ${locale}, Image: ${variant.heroImage}`);
  const isRTL = (locale === "ar" || locale.endsWith("-ar"));

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      
      {/* Hero Section */}
      <section className="relative bg-gradient-to-b from-white to-slate-50/40 pt-10 pb-20 md:pt-12 md:pb-28 overflow-hidden">
        <div className="w-[74%] mx-auto relative z-10">
          <div className={cn("flex flex-col lg:flex-row items-center gap-8 lg:gap-12", isRTL ? "lg:flex-row-reverse items-end lg:items-center" : "")}>
            
            <div className={cn("w-full lg:w-1/2", isRTL ? "text-right order-1 lg:order-2" : "text-center lg:text-left")}>
              <div className={cn("inline-flex items-center gap-2 bg-orange-50/80 backdrop-blur-sm border border-orange-100 px-4 py-2 rounded-full mb-8", isRTL && "flex-row-reverse")}>
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-orange-600 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-orange-600"></span>
                </span>
                <span className={cn("text-[11px] font-black uppercase tracking-wider text-orange-600", isRTL && "font-amiri text-sm tracking-normal")}>
                  {t("status")}
                </span>
              </div>

              <h1 className={cn("text-3xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.05] tracking-tighter mb-8 font-reem", isRTL && "text-4xl md:text-6xl lg:text-7xl tracking-normal")}>
                {t.rich("title", {
                  orange: (chunks) => <span className="text-orange-500">{chunks}</span>
                })}
              </h1>

              <p className={cn("text-lg md:text-xl text-slate-500 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-12 font-light", isRTL && "font-lateef text-3xl leading-snug ml-auto mr-0")}>
                {t("subtitle")}
              </p>

              <div className={cn("flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12", isRTL && "justify-end sm:flex-row-reverse")}>
                <Link href="/auth/register" className={cn("inline-flex items-center justify-center gap-2 bg-slate-900 text-white px-10 py-5 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-orange-600 transition-all shadow-2xl hover:shadow-orange-200 hover:-translate-y-1", isRTL && "font-amiri text-xl tracking-normal")}>
                  {t("cta")}
                  <ArrowRight className={cn("w-5 h-5", isRTL && "rotate-180")} />
                </Link>

                <Link href="/dashboard/guest" className={cn("inline-flex items-center justify-center gap-2 bg-orange-50/80 border border-orange-200 text-orange-600 hover:bg-orange-100/50 px-8 py-5 rounded-2xl text-sm font-bold uppercase tracking-widest transition-all shadow-md hover:-translate-y-1", isRTL && "font-amiri text-xl tracking-normal")}>
                  🧭 {tNav("FreeExplore")}
                </Link>

                <Link href="/approach" className={cn("inline-flex items-center justify-center gap-2 bg-white border border-slate-200 text-slate-700 px-8 py-5 rounded-2xl text-sm font-bold uppercase tracking-widest hover:bg-slate-50 hover:border-slate-300 transition-all", isRTL && "font-amiri text-xl tracking-normal")}>
                  {t("approach")}
                </Link>
              </div>

              <div className={cn("flex flex-nowrap items-center justify-center lg:justify-start gap-x-4 md:gap-x-6 text-orange-600 overflow-x-visible whitespace-nowrap", isRTL && "justify-end lg:justify-end lg:flex-row-reverse")}>
                <ImpactCounter target={15} label={ti("Geniuses")} suffix="K+" />
                <ImpactCounter target={60} label={ti("Countries")} suffix="+" />
                <ImpactCounter target={300} label={ti("Schools")} suffix="+" />
                <ImpactCounter target={16} label={ti("Languages")} suffix="+" />
                <ImpactCounter target={55} label={ti("Courses")} suffix="K+" />
              </div>
            </div>

            <div className={cn("w-full lg:w-1/2 relative", isRTL && "order-2 lg:order-1")}>
              <div className="absolute -top-20 -right-20 w-80 h-80 bg-orange-200 rounded-full blur-[120px] opacity-40"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-blue-200 rounded-full blur-[120px] opacity-30"></div>
              <motion.div 
                initial={{ scale: 0.95, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 1 }}
                className="relative z-10 transition-transform duration-1000 hover:scale-[1.02]"
              >
                <motion.div 
                  initial={{ opacity: 0, y: 30, rotate: 0 }}
                  whileInView={{ opacity: 1, y: 0, rotate: -2 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.5, duration: 0.8 }}
                  className={cn(
                    "absolute -bottom-32 -right-8 w-[90%] md:w-[400px] z-30 p-10 backdrop-blur-2xl bg-white/40 border border-white/50 rounded-[2.5rem] shadow-[0_50px_100px_rgba(0,0,0,0.1)]",
                    isRTL && "text-right -left-8 -right-auto"
                  )}
                >
                  <span className={cn("absolute -top-6 -left-6 text-[12rem] text-orange-700/80 font-serif leading-none select-none", isRTL && "-right-2 -left-auto")}>{isRTL ? "\u201d" : "\u201c"}</span>
                  <span className={cn("absolute -bottom-16 -right-6 text-[12rem] text-orange-700/80 font-serif leading-none select-none", isRTL && "-left-2 -right-auto")}>{isRTL ? "\u201c" : "\u201d"}</span>
                  <div className="relative z-10">
                    <p className={cn("text-base md:text-lg font-playfair italic text-slate-900 leading-relaxed", isRTL && "font-amiri text-3xl not-italic")}>
                      {variant.heroQuote}
                    </p>
                    <div className="w-12 h-1 bg-orange-500 mt-6 rounded-full opacity-50"></div>
                  </div>
                </motion.div>
                <Image src={variant.heroImage} alt="FreeGeny Spirit" width={600} height={600} priority={true} className="w-full max-w-xl mx-auto rounded-[3rem] shadow-[0_50px_100px_rgba(0,0,0,0.15)] border-8 border-white ring-1 ring-slate-100 object-cover aspect-square" />
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="w-[74%] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className={cn("text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-5 py-2.5 rounded-full", isRTL && "font-amiri text-base")}>
              {tp("Tag")}
            </span>
            <h2 className={cn("text-4xl md:text-6xl font-black text-slate-900 mt-8 mb-6 tracking-tight font-title", isRTL && "font-amiri text-5xl md:text-7xl")}>
              {tp("Title")}
            </h2>
            <p className={cn("text-slate-500 text-lg md:text-xl leading-relaxed font-light", isRTL && "font-lateef text-3xl")}>
              {tp("Subtitle")}
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-10">
            {/* Local Portal */}
            <div className={cn("group bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500", isRTL && "text-right")}>
              <div className={cn("w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-blue-600 transition-colors duration-300 text-blue-600 group-hover:text-white", isRTL && "mr-0 ml-auto")}>
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className={cn("text-2xl font-black text-slate-900 mb-4 tracking-tight", isRTL && "font-amiri text-3xl")}>{tp("Local.Title")}</h3>
              <p className={cn("text-slate-500 leading-relaxed font-light mb-8", isRTL && "font-lateef text-2xl")}>{tp("Local.Desc")}</p>
              <Link href="/portal-local" className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-blue-600 transition-colors">{tp("Local.CTA")}</Link>
            </div>

            {/* World Portal */}
            <div className={cn("group bg-slate-900 text-white rounded-[2.5rem] p-10 hover:shadow-3xl hover:-translate-y-2 transition-all duration-500 border border-slate-800 shadow-2xl", isRTL && "text-right")}>
              <div className={cn("w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-orange-600 transition-colors duration-300 text-orange-500", isRTL && "mr-0 ml-auto")}>
                <Globe className="w-8 h-8" />
              </div>
              <h3 className={cn("text-2xl font-black mb-4 tracking-tight", isRTL && "font-amiri text-3xl")}>{tp("World.Title")}</h3>
              <p className={cn("text-slate-300 leading-relaxed font-light mb-8", isRTL && "font-lateef text-2xl")}>{tp("World.Desc")}</p>
              <Link href="/portal-world" className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-orange-500 transition-colors">{tp("World.CTA")}</Link>
            </div>

            {/* Magic Arena */}
            <div className={cn("group bg-white border border-slate-100 rounded-[2.5rem] p-10 hover:shadow-2xl hover:-translate-y-2 transition-all duration-500", isRTL && "text-right")}>
              <div className={cn("w-16 h-16 bg-teal-50 rounded-2xl flex items-center justify-center mb-10 group-hover:bg-teal-600 transition-colors duration-300 text-teal-600 group-hover:text-white", isRTL && "mr-0 ml-auto")}>
                <Zap className="w-8 h-8" />
              </div>
              <h3 className={cn("text-2xl font-black text-slate-900 mb-4 tracking-tight", isRTL && "font-amiri text-3xl")}>{tp("Magic.Title")}</h3>
              <p className={cn("text-slate-500 leading-relaxed font-light mb-8", isRTL && "font-lateef text-2xl")}>{tp("Magic.Desc")}</p>
              <Link href="/portal-magic" className="text-sm font-black uppercase tracking-widest text-slate-400 group-hover:text-teal-600 transition-colors">{tp("Magic.CTA")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem Section */}
      <section className="py-24 md:py-32 bg-slate-50/50">
        <div className="w-[74%] mx-auto">
          <div className="text-center max-w-3xl mx-auto mb-20">
            <span className={cn("text-[11px] font-black uppercase tracking-[0.2em] text-blue-600 bg-blue-50 px-5 py-2.5 rounded-full", isRTL && "font-amiri text-base")}>{te("Tag")}</span>
            <h2 className={cn("text-4xl md:text-6xl font-black text-slate-900 mt-8 mb-6 tracking-tight font-title", isRTL && "font-amiri text-5xl md:text-7xl")}>{te("Title")}</h2>
            <p className={cn("text-slate-500 text-lg leading-relaxed font-light", isRTL && "font-lateef text-3xl")}>{te("Subtitle")}</p>
          </div>

          <div className="grid lg:grid-cols-2 gap-10">
            {/* Parents Space */}
            <div className={cn("bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 hover:shadow-2xl transition-all duration-500 group", isRTL && "text-right")}>
              <div className={cn("flex items-center gap-6 mb-8", isRTL && "flex-row-reverse")}>
                <div className="w-14 h-14 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center shrink-0">
                  <Heart className="w-7 h-7" />
                </div>
                <h3 className={cn("text-3xl font-black text-slate-900 tracking-tight", isRTL && "font-amiri")}>{te("Parents.Title")}</h3>
              </div>
              <p className={cn("text-slate-500 leading-relaxed font-light text-lg mb-10", isRTL && "font-lateef text-2xl")}>{te("Parents.Desc")}</p>
              <Link href="/parents" className={cn("inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all", isRTL && "font-amiri text-lg tracking-normal")}>{te("Parents.CTA")}</Link>
            </div>

            {/* Schools Space */}
            <div className={cn("bg-white rounded-[3rem] p-10 md:p-12 border border-slate-100 hover:shadow-2xl transition-all duration-500 group", isRTL && "text-right")}>
              <div className={cn("flex items-center gap-6 mb-8", isRTL && "flex-row-reverse")}>
                <div className="w-14 h-14 bg-blue-50 text-blue-600 rounded-2xl flex items-center justify-center shrink-0">
                  <GraduationCap className="w-7 h-7" />
                </div>
                <h3 className={cn("text-3xl font-black text-slate-900 tracking-tight", isRTL && "font-amiri")}>{te("Schools.Title")}</h3>
              </div>
              <p className={cn("text-slate-500 leading-relaxed font-light text-lg mb-10", isRTL && "font-lateef text-2xl")}>{te("Schools.Desc")}</p>
              <Link href="/schools" className={cn("inline-flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-blue-600 transition-all", isRTL && "font-amiri text-lg tracking-normal")}>{te("Schools.CTA")}</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Innovation Section */}
      <section className="py-24 md:py-32 bg-white">
        <div className="w-[74%] mx-auto">
          <div className={cn("flex flex-col lg:flex-row gap-20 items-center", isRTL && "lg:flex-row-reverse")}>
            <div className="flex-1 relative">
              <div className={cn("bg-white rounded-[2.5rem] shadow-3xl p-8 border border-slate-100 relative z-10 hover:rotate-2 transition-transform duration-500", isRTL && "text-right")}>
                <div className={cn("flex items-center gap-5 mb-8", isRTL && "flex-row-reverse")}>
                  <div className="w-14 h-14 bg-orange-50 rounded-2xl flex items-center justify-center">
                    <Mic className="w-7 h-7 text-orange-600" />
                  </div>
                  <div>
                    <p className={cn("text-[10px] font-black uppercase text-slate-400 tracking-widest leading-none mb-1", isRTL && "font-amiri text-sm tracking-normal")}>{tb("Tag")}</p>
                    <p className={cn("text-sm font-bold text-slate-900 leading-none", isRTL && "font-amiri text-lg")}>{tb("MomVoice")}</p>
                  </div>
                </div>
                <div className="h-3 w-full bg-slate-100 rounded-full mb-6 relative overflow-hidden">
                  <div className={cn("absolute inset-y-0 bg-orange-600 w-3/4 animate-pulse", isRTL && "right-0")}></div>
                </div>
                <div className={cn("flex justify-between items-center text-[11px] font-bold text-slate-500 uppercase tracking-tighter", isRTL && "flex-row-reverse")}>
                  <span className={isRTL ? "font-amiri text-base" : ""}>{tb("Congratulation")}</span>
                  <span className="text-orange-600">+50 XP</span>
                </div>
              </div>

              <div className="absolute -bottom-12 -right-12 w-64 h-64 bg-white/40 backdrop-blur-xl rounded-[3rem] border border-white/50 shadow-2xl p-8 z-20">
                <div className="w-12 h-12 bg-blue-50 rounded-2xl flex items-center justify-center mb-6">
                  <GraduationCap className="w-6 h-6 text-blue-600" />
                </div>
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest leading-none mb-1">Printable</p>
                <p className="text-xs font-bold text-slate-800">كراس 1AP مولد</p>
              </div>

              <motion.div initial={{ opacity: 0, scale: 0.8, rotate: 0 }} whileInView={{ opacity: 1, scale: 1, rotate: 3 }} viewport={{ once: true }} className={cn("absolute -top-10 -left-10 w-64 p-6 bg-white/95 backdrop-blur-2xl border border-white rounded-[2rem] shadow-2xl z-30", isRTL && "-right-10 -left-auto text-right")}>
                <span className={cn("absolute -top-6 -left-4 text-6xl text-orange-500/20 font-serif leading-none select-none", isRTL && "-right-4 -left-auto")}>{isRTL ? "\u201d" : "\u201c"}</span>
                <p className={cn("text-sm font-serif font-light text-slate-800 italic relative z-10", isRTL && "font-amiri text-lg")}>{variant.scienceQuote}</p>
              </motion.div>
            </div>

            <div className={cn("flex-1", isRTL && "text-right")}>
              <span className={cn("text-[11px] font-black uppercase tracking-[0.2em] text-orange-600 bg-orange-50 px-5 py-2.5 rounded-full", isRTL && "font-amiri text-base")}>{tin("Tag")}</span>
              <h2 className={cn("text-4xl md:text-5xl font-black text-orange-600 mt-8 mb-10 tracking-tight leading-[1.1] font-title", isRTL && "font-amiri text-5xl md:text-7xl")}>{tin("Title")}</h2>
              
              <div className="space-y-10">
                <div className={cn("group flex gap-6", isRTL && "flex-row-reverse")}>
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-orange-600 group-hover:text-white transition-colors duration-300">
                    <Mic className="w-7 h-7" />
                  </div>
                  <div className={cn("text-left", isRTL && "text-right")}>
                    <h4 className={cn("text-xl font-bold text-slate-900 mb-2", isRTL && "font-amiri text-2xl")}>{tin("Boost.Title")}</h4>
                    <p className={cn("text-slate-500 font-light leading-relaxed", isRTL && "font-lateef text-2xl")}>{tin("Boost.Desc")}</p>
                  </div>
                </div>

                <div className={cn("group flex gap-6", isRTL && "flex-row-reverse")}>
                  <div className="w-14 h-14 bg-slate-100 rounded-2xl flex items-center justify-center shrink-0 group-hover:bg-blue-600 group-hover:text-white transition-colors duration-300">
                    <Zap className="w-7 h-7" />
                  </div>
                  <div className={cn("text-left", isRTL && "text-right")}>
                    <h4 className={cn("text-xl font-bold text-slate-900 mb-2", isRTL && "font-amiri text-2xl")}>{tin("AI.Title")}</h4>
                    <p className={cn("text-slate-500 font-light leading-relaxed", isRTL && "font-lateef text-2xl")}>{tin("AI.Desc")}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer CTA Section */}
      <section className="py-24 bg-slate-900 text-white rounded-t-[4rem]">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <h2 className={cn("text-4xl md:text-6xl font-black mb-8 tracking-tighter font-title", isRTL && "font-amiri text-6xl md:text-8xl")}>{tf("Title")}</h2>
          <div className={cn("flex flex-col sm:flex-row gap-5 justify-center", isRTL && "flex-row-reverse")}>
            <Link href="/auth/register" className={cn("bg-orange-600 px-12 py-5 rounded-2xl font-bold uppercase tracking-widest hover:bg-orange-700 transition shadow-2xl shadow-orange-900/40", isRTL && "font-amiri text-2xl tracking-normal")}>{tf("CTA")}</Link>
          </div>
        </div>
      </section>

    </div>
  );
}

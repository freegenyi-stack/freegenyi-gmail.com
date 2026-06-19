"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion, useScroll, useTransform } from "framer-motion";
import dynamic from "next/dynamic";
import {
  School,
  Heart,
  CheckCircle2,
  Users,
  BarChart3,
  MessageCircle,
  Shield,
  Sparkles,
  GraduationCap,
  Building2,
  Zap,
  BookOpen,
} from "lucide-react";
import schoolHeroAnim from "@/../public/assets/animations/school_hero.json";
import OrgPrimaryCta from "@/components/org/OrgPrimaryCta";

const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

type Variant = "schools" | "ngos";

const config = {
  schools: {
    ns: "OrgSchools" as const,
    icon: School,
    registerType: "ecole",
    faqHref: "/schools/faq",
    trainingHref: "/schools/formation",
    primary: "indigo",
    gradient: "from-indigo-600 via-violet-600 to-indigo-800",
    light: "from-indigo-50 via-violet-50/80 to-white",
    blob: "bg-indigo-400/30",
    blob2: "bg-violet-400/20",
  },
  ngos: {
    ns: "OrgNgos" as const,
    icon: Heart,
    registerType: "ong",
    faqHref: "/ngos/faq",
    trainingHref: "/ngos/formation",
    primary: "amber",
    gradient: "from-amber-500 via-orange-500 to-amber-600",
    light: "from-amber-50 via-orange-50/80 to-white",
    blob: "bg-amber-400/30",
    blob2: "bg-orange-400/20",
  },
};

const benefitIcons = [Users, GraduationCap, MessageCircle, BarChart3];

function ImpactCounter({ target, suffix = "" }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 60;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 30);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <span>
      {count}
      {suffix}
    </span>
  );
}

export default function OrgLanding({ variant }: { variant: Variant }) {
  const c = config[variant];
  const t = useTranslations(c.ns);
  const Icon = c.icon;
  const steps = ["s1", "s2", "s3"] as const;
  const benefits = ["b1", "b2", "b3", "b4"] as const;
  const isSchool = variant === "schools";

  const { scrollY } = useScroll();
  const heroY = useTransform(scrollY, [0, 400], [0, 80]);
  const heroOpacity = useTransform(scrollY, [0, 300], [1, 0.6]);

  const accentBtn = isSchool
    ? "bg-indigo-600 hover:bg-indigo-500 shadow-indigo-300/50"
    : "bg-amber-500 hover:bg-amber-400 shadow-amber-300/50";
  const accentText = isSchool ? "text-indigo-600" : "text-amber-600";
  const accentBg = isSchool ? "bg-indigo-50" : "bg-amber-50";
  const accentRing = isSchool ? "ring-indigo-100" : "ring-amber-100";

  return (
    <main className={`min-h-screen font-ui-ar overflow-hidden bg-gradient-to-b ${c.light}`}>
      {/* Hero */}
      <section className="relative pt-8 pb-16 lg:pt-12 lg:pb-24">
        <div className={`absolute inset-0 bg-gradient-to-br ${c.gradient} opacity-[0.07]`} />
        <motion.div
          style={{ y: heroY, opacity: heroOpacity }}
          className={`absolute -top-20 ${isSchool ? "right-0" : "left-0"} w-[500px] h-[500px] ${c.blob} rounded-full blur-[120px] pointer-events-none`}
        />
        <motion.div
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className={`absolute bottom-10 ${isSchool ? "left-10" : "right-10"} w-72 h-72 ${c.blob2} rounded-full blur-[100px] pointer-events-none`}
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-left"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border ${accentRing} border-2 mb-6 shadow-lg`}
              >
                <Sparkles className={`w-4 h-4 ${accentText}`} />
                <span className={`text-[10px] font-black uppercase tracking-[0.2em] ${accentText}`}>
                  {t("badge")}
                </span>
              </motion.div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight font-reem mb-6 leading-[1.05]">
                {t("title")}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                {t("subtitle")}
              </p>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className={`inline-block px-5 py-2.5 rounded-2xl border-2 ${isSchool ? "border-indigo-200 bg-indigo-50/80" : "border-amber-200 bg-amber-50/80"} mb-8`}
              >
                <p className={`text-sm font-black ${accentText}`}>{t("freeBanner")}</p>
              </motion.div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <OrgPrimaryCta
                  variant={variant}
                  className={`inline-flex items-center justify-center gap-2 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl transition-all hover:-translate-y-0.5 ${accentBtn}`}
                />
                <Link
                  href={c.faqHref}
                  className="px-6 py-4 rounded-2xl bg-white/90 border-2 border-slate-200 font-black uppercase tracking-widest text-[11px] text-slate-700 hover:border-slate-400 hover:shadow-lg transition-all"
                >
                  {t("ctaFaq")}
                </Link>
                <Link
                  href={c.trainingHref}
                  className="px-6 py-4 rounded-2xl bg-white/90 border-2 border-slate-200 font-black uppercase tracking-widest text-[11px] text-slate-700 hover:border-slate-400 hover:shadow-lg transition-all"
                >
                  {t("ctaTraining")}
                </Link>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.85 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="flex-1 relative w-full max-w-md lg:max-w-lg"
            >
              <div className={`absolute inset-0 ${accentBg} rounded-[3rem] rotate-3 scale-95 opacity-60`} />
              <div className="relative bg-white/90 backdrop-blur-xl rounded-[3rem] p-8 shadow-2xl border border-white/50">
                <div className="w-full aspect-square max-w-[280px] mx-auto">
                  <Lottie animationData={schoolHeroAnim} loop className="w-full h-full" />
                </div>
                <div className="grid grid-cols-3 gap-3 mt-6">
                  {[
                    { icon: Building2, val: 58, label: isSchool ? "Wilayas" : "Régions" },
                    { icon: BookOpen, val: 100, suffix: "%", label: "Gratuit" },
                    { icon: Zap, val: 48, suffix: "h", label: "Activation" },
                  ].map((stat, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.5 + i * 0.1 }}
                      className={`text-center p-3 rounded-2xl ${accentBg}`}
                    >
                      <stat.icon className={`w-4 h-4 mx-auto mb-1 ${accentText}`} />
                      <p className={`text-lg font-black ${accentText}`}>
                        <ImpactCounter target={stat.val} suffix={stat.suffix} />
                      </p>
                      <p className="text-[8px] font-bold uppercase text-slate-500">{stat.label}</p>
                    </motion.div>
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Steps */}
      <section className="py-20 px-6 relative">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-14"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-reem mb-3">
              {t("stepsTitle")}
            </h2>
            <p className="text-slate-600 text-lg">{t("stepsSubtitle")}</p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-6 relative">
            <div className={`hidden md:block absolute top-1/2 left-[16%] right-[16%] h-0.5 ${isSchool ? "bg-indigo-200" : "bg-amber-200"} -translate-y-1/2`} />
            {steps.map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.15 }}
                whileHover={{ y: -6 }}
                className="relative bg-white rounded-3xl p-8 border-2 border-slate-100 shadow-xl text-center z-10"
              >
                <div
                  className={`w-14 h-14 rounded-2xl ${isSchool ? "bg-gradient-to-br from-indigo-500 to-violet-600" : "bg-gradient-to-br from-amber-400 to-orange-500"} flex items-center justify-center mx-auto mb-5 shadow-lg`}
                >
                  <span className="text-xl font-black text-white">{i + 1}</span>
                </div>
                <h3 className="font-black text-slate-900 text-lg mb-2">{t(`steps.${key}.title`)}</h3>
                <p className="text-sm text-slate-600 leading-relaxed">{t(`steps.${key}.desc`)}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className={`py-20 px-6 ${isSchool ? "bg-indigo-600/5" : "bg-amber-500/5"}`}>
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-black text-slate-900 text-center font-reem mb-14">
            {t("benefitsTitle")}
          </h2>
          <div className="grid sm:grid-cols-2 gap-5">
            {benefits.map((key, i) => {
              const BIcon = benefitIcons[i] || Icon;
              return (
                <motion.div
                  key={key}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  whileHover={{ scale: 1.02 }}
                  className="flex gap-5 p-6 rounded-3xl bg-white border-2 border-slate-100 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <div
                    className={`w-12 h-12 rounded-2xl ${isSchool ? "bg-indigo-100" : "bg-amber-100"} flex items-center justify-center shrink-0`}
                  >
                    <BIcon className={`w-6 h-6 ${accentText}`} />
                  </div>
                  <div>
                    <h3 className="font-black text-slate-900 text-base mb-1">
                      {t(`benefits.${key}.title`)}
                    </h3>
                    <p className="text-sm text-slate-600 leading-relaxed">{t(`benefits.${key}.desc`)}</p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust */}
      <section className="py-16 px-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto flex flex-col md:flex-row gap-6 items-center p-10 rounded-[2.5rem] bg-white border-2 border-slate-100 shadow-xl"
        >
          <div className={`w-16 h-16 rounded-2xl ${accentBg} flex items-center justify-center shrink-0`}>
            <Shield className={`w-8 h-8 ${accentText}`} />
          </div>
          <div className="text-center md:text-left">
            <h3 className="font-black text-slate-900 text-xl mb-2">{t("trustTitle")}</h3>
            <p className="text-slate-600 leading-relaxed">{t("trustDesc")}</p>
          </div>
        </motion.div>
      </section>

      {/* Final CTA */}
      <section className={`py-24 px-6 bg-gradient-to-br ${c.gradient} relative overflow-hidden`}>
        <div className="absolute inset-0 bg-[url('/assets/img/grid-pattern.svg')] opacity-10" />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl mx-auto text-center text-white relative z-10"
        >
          <CheckCircle2 className="w-14 h-14 mx-auto mb-6 opacity-90" />
          <h2 className="text-3xl md:text-4xl font-black font-reem mb-4">{t("finalTitle")}</h2>
          <p className="text-white/90 text-lg mb-10 leading-relaxed">{t("finalDesc")}</p>
          <OrgPrimaryCta
            variant={variant}
            className="inline-flex items-center gap-2 bg-white text-slate-900 px-10 py-5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-slate-100 transition-all shadow-2xl hover:-translate-y-1"
          />
        </motion.div>
      </section>
    </main>
  );
}

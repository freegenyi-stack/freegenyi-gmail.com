"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  Sparkles,
  Palette,
  FileText,
  Download,
  GraduationCap,
  Bot,
  Laptop,
  Users,
  BookOpen,
  MessageCircle,
  Library,
  ArrowRight,
  PenLine,
  Wand2,
  Clock,
  Star,
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

const featureKeys = ["creative", "training", "classroom", "library", "community"] as const;
const featureIcons = {
  creative: Palette,
  training: GraduationCap,
  classroom: Users,
  library: Library,
  community: MessageCircle,
};
const trainingKeys = ["t1", "t2", "t3", "t4"] as const;
const creativeKeys = ["c1", "c2", "c3", "c4"] as const;

export default function TeacherLanding() {
  const t = useTranslations("Teachers");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";

  return (
    <main
      dir={isRTL ? "rtl" : "ltr"}
      className="min-h-screen font-cairo overflow-hidden bg-gradient-to-b from-teal-50/80 via-white to-emerald-50/50"
    >
      {/* Hero */}
      <section className="relative pt-8 pb-20 lg:pt-12 lg:pb-28">
        <div className="absolute inset-0 bg-gradient-to-br from-teal-600 via-emerald-600 to-cyan-700 opacity-[0.06]" />
        <motion.div
          animate={{ y: [0, -18, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-20 end-0 w-[420px] h-[420px] bg-teal-400/25 rounded-full blur-[120px] pointer-events-none"
        />
        <motion.div
          animate={{ y: [0, 14, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          className="absolute bottom-0 start-10 w-80 h-80 bg-emerald-400/20 rounded-full blur-[100px] pointer-events-none"
        />

        <div className="max-w-7xl mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-12 lg:gap-16">
            <motion.div
              initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.7 }}
              className="flex-1 text-center lg:text-start"
            >
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/80 backdrop-blur border-2 border-teal-100 mb-6 shadow-lg">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span className="text-[10px] font-black uppercase tracking-[0.2em] text-teal-600">
                  {t("badge")}
                </span>
              </div>

              <h1 className="text-4xl md:text-6xl lg:text-7xl font-black text-slate-900 tracking-tight font-reem mb-6 leading-[1.05]">
                {t("title")}
              </h1>
              <p className="text-lg md:text-xl text-slate-600 max-w-xl mx-auto lg:mx-0 leading-relaxed mb-8">
                {t("subtitle")}
              </p>

              <div className="inline-block px-5 py-2.5 rounded-2xl border-2 border-teal-200 bg-teal-50/80 mb-8">
                <p className="text-sm font-black text-teal-700">{t("freeBanner")}</p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 justify-center lg:justify-start">
                <Link
                  href="/auth/register/teacher"
                  className="inline-flex items-center justify-center gap-2 bg-teal-600 hover:bg-teal-500 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-2xl shadow-teal-300/40 transition-all hover:-translate-y-0.5"
                >
                  {t("ctaPrimary")} <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                </Link>
                <a
                  href="#creative"
                  className="px-6 py-4 rounded-2xl bg-white/90 border-2 border-slate-200 font-black uppercase tracking-widest text-[11px] text-slate-700 hover:border-teal-300 hover:shadow-lg transition-all text-center"
                >
                  {t("ctaCreative")}
                </a>
                <a
                  href="#training"
                  className="px-6 py-4 rounded-2xl bg-white/90 border-2 border-slate-200 font-black uppercase tracking-widest text-[11px] text-slate-700 hover:border-teal-300 hover:shadow-lg transition-all text-center"
                >
                  {t("ctaTraining")}
                </a>
              </div>
            </motion.div>

            {/* Profile card with Avatar */}
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15 }}
              className="flex-1 w-full max-w-md lg:max-w-lg"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-teal-100 rounded-[3rem] rotate-3 scale-95 opacity-60" />
                <div className="relative bg-white/95 backdrop-blur-xl rounded-[3rem] p-8 shadow-2xl border border-white/60">
                  <div className="flex flex-col items-center text-center">
                    <div className="relative mb-5">
                      <Avatar className="h-28 w-28 border-4 border-white shadow-xl ring-4 ring-teal-100">
                        <AvatarImage src="https://i.pravatar.cc/300?img=12" alt={t("profile.name")} />
                        <AvatarFallback className="bg-teal-100 text-teal-700 text-2xl">YB</AvatarFallback>
                      </Avatar>
                      <span className="absolute bottom-1 end-1 w-5 h-5 bg-emerald-500 border-2 border-white rounded-full" />
                    </div>
                    <h2 className="text-xl font-black text-slate-900">{t("profile.name")}</h2>
                    <p className="text-sm text-teal-600 font-bold mt-1">{t("profile.role")}</p>
                    <p className="text-xs text-slate-500 mt-2 max-w-[240px]">{t("profile.bio")}</p>

                    <div className="grid grid-cols-3 gap-3 w-full mt-6">
                      {[
                        { label: t("profile.statLessons"), value: "24" },
                        { label: t("profile.statStudents"), value: "32" },
                        { label: t("profile.statCourses"), value: "5" },
                      ].map((stat) => (
                        <div key={stat.label} className="bg-teal-50 rounded-2xl p-3">
                          <p className="text-lg font-black text-teal-700">{stat.value}</p>
                          <p className="text-[8px] font-bold uppercase text-slate-500 leading-tight">{stat.label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Feature cards */}
      <section className="py-16 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-reem mb-3">
              {t("featuresTitle")}
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">{t("featuresSubtitle")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {featureKeys.map((key, i) => {
              const Icon = featureIcons[key];
              const isHighlight = key === "creative" || key === "training";
              return (
                <motion.div
                  key={key}
                  id={key === "creative" ? "creative" : key === "training" ? "training" : undefined}
                  initial={{ opacity: 0, y: 24 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -6 }}
                  className={cn(
                    "bg-white rounded-3xl p-8 border-2 shadow-xl transition-all",
                    isHighlight
                      ? "border-teal-200 ring-2 ring-teal-50 lg:col-span-1"
                      : "border-slate-100"
                  )}
                >
                  <div
                    className={cn(
                      "w-14 h-14 rounded-2xl flex items-center justify-center mb-5",
                      isHighlight ? "bg-teal-600 text-white" : "bg-slate-100 text-teal-600"
                    )}
                  >
                    <Icon className="w-7 h-7" />
                  </div>
                  <h3 className="text-xl font-black text-slate-900 mb-2">
                    {t(`features.${key}.title`)}
                  </h3>
                  <p className="text-slate-600 text-sm leading-relaxed mb-4">
                    {t(`features.${key}.desc`)}
                  </p>
                  {key === "creative" && (
                    <div className="flex flex-wrap gap-2">
                      {[PenLine, FileText, Download].map((MiniIcon, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-teal-50 text-[9px] font-bold uppercase text-teal-700"
                        >
                          <MiniIcon className="w-3 h-3" />
                          {t(`features.creative.tags.${j}`)}
                        </span>
                      ))}
                    </div>
                  )}
                  {key === "training" && (
                    <div className="flex flex-wrap gap-2">
                      {[Bot, Laptop, Wand2].map((MiniIcon, j) => (
                        <span
                          key={j}
                          className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-50 text-[9px] font-bold uppercase text-emerald-700"
                        >
                          <MiniIcon className="w-3 h-3" />
                          {t(`features.training.tags.${j}`)}
                        </span>
                      ))}
                    </div>
                  )}
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Espace créatif — preview */}
      <section className="py-16 px-6 bg-gradient-to-r from-teal-600/5 to-emerald-600/5">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: isRTL ? 30 : -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-teal-600">
              {t("creative.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-reem mt-2 mb-4">
              {t("creative.title")}
            </h2>
            <p className="text-slate-600 leading-relaxed mb-6">{t("creative.desc")}</p>
            <ul className="space-y-3">
              {creativeKeys.map((key) => (
                <li key={key} className="flex items-start gap-3">
                  <span className="mt-1 w-6 h-6 rounded-lg bg-teal-600 text-white flex items-center justify-center shrink-0">
                    <Star className="w-3.5 h-3.5" />
                  </span>
                  <div>
                    <p className="font-black text-slate-900 text-sm">{t(`creative.items.${key}.title`)}</p>
                    <p className="text-xs text-slate-500">{t(`creative.items.${key}.desc`)}</p>
                  </div>
                </li>
              ))}
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="bg-white rounded-[2rem] border-2 border-slate-100 shadow-2xl overflow-hidden"
          >
            <div className="bg-slate-900 px-5 py-3 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400" />
                <span className="w-3 h-3 rounded-full bg-amber-400" />
                <span className="w-3 h-3 rounded-full bg-emerald-400" />
              </div>
              <span className="text-[10px] text-slate-400 font-mono ms-2">{t("creative.previewTitle")}</span>
            </div>
            <div className="p-6 space-y-4">
              <div className="flex items-center gap-3 pb-4 border-b border-slate-100">
                <Palette className="w-5 h-5 text-teal-600" />
                <div>
                  <p className="text-sm font-black text-slate-900">{t("creative.previewLesson")}</p>
                  <p className="text-[10px] text-slate-400">{t("creative.previewMeta")}</p>
                </div>
              </div>
              <div className="h-24 rounded-xl bg-gradient-to-br from-teal-50 to-emerald-50 border border-dashed border-teal-200 flex items-center justify-center">
                <p className="text-xs text-teal-600 font-bold">{t("creative.previewCanvas")}</p>
              </div>
              <div className="flex gap-2">
                <button type="button" className="flex-1 py-2.5 rounded-xl bg-teal-600 text-white text-[10px] font-black uppercase">
                  {t("creative.previewSave")}
                </button>
                <button type="button" className="flex items-center justify-center gap-1.5 px-4 py-2.5 rounded-xl border-2 border-slate-200 text-[10px] font-black uppercase text-slate-600">
                  <Download className="w-3.5 h-3.5" /> PDF
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Mes formations */}
      <section id="training" className="py-20 px-6">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <span className="text-[10px] font-black uppercase tracking-widest text-emerald-600">
              {t("training.badge")}
            </span>
            <h2 className="text-3xl md:text-4xl font-black text-slate-900 font-reem mt-2 mb-3">
              {t("training.title")}
            </h2>
            <p className="text-slate-600 text-lg max-w-2xl mx-auto">{t("training.subtitle")}</p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-5">
            {trainingKeys.map((key, i) => (
              <motion.div
                key={key}
                initial={{ opacity: 0, y: 16 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-5 bg-white rounded-2xl p-6 border-2 border-slate-100 shadow-lg hover:border-teal-200 hover:shadow-xl transition-all"
              >
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-start justify-between gap-2 mb-1">
                    <h3 className="font-black text-slate-900">{t(`training.courses.${key}.title`)}</h3>
                    <span className="shrink-0 inline-flex items-center gap-1 text-[9px] font-bold uppercase text-slate-400 bg-slate-50 px-2 py-1 rounded-lg">
                      <Clock className="w-3 h-3" />
                      {t(`training.courses.${key}.duration`)}
                    </span>
                  </div>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {t(`training.courses.${key}.desc`)}
                  </p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA final */}
      <section className="py-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center bg-gradient-to-br from-teal-600 to-emerald-700 rounded-[3rem] p-12 md:p-16 text-white shadow-2xl shadow-teal-300/30"
        >
          <BookOpen className="w-12 h-12 mx-auto mb-6 opacity-80" />
          <h2 className="text-3xl md:text-4xl font-black font-reem mb-4">{t("finalTitle")}</h2>
          <p className="text-teal-50 text-lg mb-8 max-w-xl mx-auto leading-relaxed">{t("finalDesc")}</p>
          <Link
            href="/auth/register/teacher"
            className="inline-flex items-center gap-2 bg-white text-teal-700 px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-teal-50 transition-all shadow-xl"
          >
            {t("ctaPrimary")} <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
          </Link>
        </motion.div>
      </section>
    </main>
  );
}

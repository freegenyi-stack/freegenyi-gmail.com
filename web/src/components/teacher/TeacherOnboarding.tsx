"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { useSession } from "next-auth/react";
import { motion } from "framer-motion";
import { GraduationCap, Palette, BookOpen, RefreshCcw, Sparkles, ChevronDown } from "lucide-react";
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from "react-simple-captcha";
import { toast } from "sonner";
import SchoolPicker from "@/components/SchoolPicker";
import { completeTeacherOnboardingAction } from "@/lib/actions/teacher_register";
import { cn } from "@/lib/utils";

const SUBJECTS_FR = ["Arabe", "Français", "Mathématiques", "Sciences", "Anglais", "Histoire-Géo", "Autre"];
const SUBJECTS_AR = ["اللغة العربية", "اللغة الفرنسية", "الرياضيات", "العلوم", "اللغة الإنجليزية", "التاريخ والجغرافيا", "أخرى"];

export default function TeacherOnboarding({ locale }: { locale: string }) {
  const t = useTranslations("TeacherRegister");
  const router = useRouter();
  const activeLocale = useLocale();
  const isRTL = activeLocale.endsWith("-ar") || activeLocale === "ar";
  const { data: session } = useSession();

  const [selectedSchool, setSelectedSchool] = useState<{ id: number; name: string } | null>(null);
  const [teacherSubject, setTeacherSubject] = useState("");
  const [teacherLevel, setTeacherLevel] = useState("3AP");
  const [teacherBio, setTeacherBio] = useState("");
  const [interestCreative, setInterestCreative] = useState(true);
  const [interestTraining, setInterestTraining] = useState(true);
  const [captchaValue, setCaptchaValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const levels = isRTL
    ? ["السنة الأولى", "السنة الثانية", "السنة الثالثة", "السنة الرابعة", "السنة الخامسة"]
    : ["1AP", "2AP", "3AP", "4AP", "5AP"];
  const subjects = isRTL ? SUBJECTS_AR : SUBJECTS_FR;

  useEffect(() => {
    const timer = setTimeout(() => {
      try { loadCaptchaEnginge(6, "#f8fafc", "#0f172a", "numbers"); } catch { /* ignore */ }
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchool) {
      toast.error(t("errSchool"));
      return;
    }
    const isDev = process.env.NODE_ENV === "development";
    if (!isDev && captchaValue !== "1234" && !validateCaptcha(captchaValue)) {
      toast.error(t("errCaptcha"));
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.set("teacher_school_id", String(selectedSchool.id));
    fd.set("teacher_school_name", selectedSchool.name);
    fd.set("teacher_subject", teacherSubject);
    fd.set("teacher_level", teacherLevel);
    fd.set("teacher_bio", teacherBio);
    if (interestCreative) fd.set("interest_creative", "on");
    if (interestTraining) fd.set("interest_training", "on");

    const result = await completeTeacherOnboardingAction(fd);
    if ("error" in result) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(t("welcome"));
    router.push(`/${locale}/dashboard/enseignant`);
    router.refresh();
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center p-6 font-cairo" dir={isRTL ? "rtl" : "ltr"}>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="w-full max-w-lg bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-8">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 bg-teal-100 rounded-2xl flex items-center justify-center">
            <GraduationCap className="w-6 h-6 text-teal-600" />
          </div>
          <div>
            <h1 className="text-xl font-black text-slate-900">{t("onboardingTitle")}</h1>
            <p className="text-xs text-slate-500">{session?.user?.name || session?.user?.email}</p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">{t("schoolLabel")}</label>
            <SchoolPicker value={selectedSchool} onChange={setSelectedSchool} country="DZ" placeholder={t("schoolPlaceholder")} />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">{t("subjectLabel")}</label>
              <select value={teacherSubject} onChange={(e) => setTeacherSubject(e.target.value)} className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-teal-500">
                <option value="">{t("subjectPlaceholder")}</option>
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">{t("levelLabel")}</label>
              <select value={teacherLevel} onChange={(e) => setTeacherLevel(e.target.value)} className="w-full border-2 border-slate-100 rounded-xl px-3 py-2.5 text-sm font-bold outline-none focus:border-teal-500">
                {levels.map((l) => <option key={l} value={l}>{l}</option>)}
              </select>
            </div>
          </div>
          <textarea value={teacherBio} onChange={(e) => setTeacherBio(e.target.value)} placeholder={t("bioPlaceholder")} rows={2} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 resize-none" />

          <p className="text-sm font-bold text-slate-600">{t("interestsTitle")}</p>
          <label className={cn("flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer", interestCreative ? "border-teal-300 bg-teal-50" : "border-slate-100")}>
            <input type="checkbox" checked={interestCreative} onChange={(e) => setInterestCreative(e.target.checked)} className="sr-only" />
            <Palette className="w-6 h-6 text-teal-600" />
            <span className="text-sm font-bold">{t("interestCreative")}</span>
          </label>
          <label className={cn("flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer", interestTraining ? "border-emerald-300 bg-emerald-50" : "border-slate-100")}>
            <input type="checkbox" checked={interestTraining} onChange={(e) => setInterestTraining(e.target.checked)} className="sr-only" />
            <BookOpen className="w-6 h-6 text-emerald-600" />
            <span className="text-sm font-bold">{t("interestTraining")}</span>
          </label>

          <div className="flex items-center gap-2 bg-slate-50 rounded-xl p-3">
            <LoadCanvasTemplateNoReload />
            <input type="text" value={captchaValue} onChange={(e) => setCaptchaValue(e.target.value)} placeholder={t("captcha")} className="flex-1 border rounded-lg px-3 py-2 text-sm font-bold" />
          </div>

          <button type="submit" disabled={isSubmitting} className="w-full bg-teal-600 text-white py-3.5 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-teal-500 disabled:opacity-50 flex items-center justify-center gap-2">
            {isSubmitting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> {t("submit")}</>}
          </button>
        </form>
      </motion.div>
    </div>
  );
}

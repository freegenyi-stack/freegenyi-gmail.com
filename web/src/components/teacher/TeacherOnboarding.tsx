"use client";



import React, { useEffect, useState } from "react";

import { useRouter } from "next/navigation";

import { useLocale, useTranslations } from "next-intl";

import { useSession } from "next-auth/react";

import { motion, AnimatePresence } from "framer-motion";

import { GraduationCap, RefreshCcw, Sparkles, UserSearch } from "lucide-react";

import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from "react-simple-captcha";

import { toast } from "sonner";

import SchoolPicker from "@/components/SchoolPicker";

import InterestPicker from "@/components/onboarding/InterestPicker";

import TeacherSubjectLevelPicker from "@/components/teacher/TeacherSubjectLevelPicker";

import { completeTeacherOnboardingAction } from "@/lib/actions/teacher_register";

import { appendNotificationInterests, MAX_NOTIFICATION_INTERESTS } from "@/lib/onboarding/interest-topics";

import { appendTeacherSubjectsLevels } from "@/lib/teacher/form-fields";



export default function TeacherOnboarding({ locale }: { locale: string }) {

  const t = useTranslations("TeacherRegister");

  const tInterest = useTranslations("InterestTopics");

  const router = useRouter();

  const activeLocale = useLocale();

  const isRTL = activeLocale.endsWith("-ar") || activeLocale === "ar";

  const { data: session } = useSession();



  const [selectedSchool, setSelectedSchool] = useState<{ id: number; name: string } | null>(null);

  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);

  const [selectedLevels, setSelectedLevels] = useState<string[]>(["3AP"]);

  const [teacherBio, setTeacherBio] = useState("");

  const [notificationInterests, setNotificationInterests] = useState<string[]>([]);

  const [captchaValue, setCaptchaValue] = useState("");

  const [isSubmitting, setIsSubmitting] = useState(false);



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

    if (selectedSubjects.length === 0) {

      toast.error(t("errSubjects"));

      return;

    }

    if (selectedLevels.length === 0) {

      toast.error(t("errLevels"));

      return;

    }

    if (notificationInterests.length !== MAX_NOTIFICATION_INTERESTS) {

      toast.error(tInterest("errPickThree"));

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

    appendTeacherSubjectsLevels(fd, selectedSubjects, selectedLevels);

    fd.set("teacher_bio", teacherBio);

    fd.set("locale", locale);

    appendNotificationInterests(fd, notificationInterests);



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

    <div className="min-h-screen bg-gradient-to-b from-teal-50 to-white flex items-center justify-center p-6 font-ui-ar" dir={isRTL ? "rtl" : "ltr"}>

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

            <AnimatePresence>

              {selectedSchool && (

                <motion.div

                  initial={{ opacity: 0, height: 0 }}

                  animate={{ opacity: 1, height: "auto" }}

                  exit={{ opacity: 0, height: 0 }}

                  className="mt-3 overflow-hidden"

                >

                  <div className="flex gap-3 rounded-2xl border-2 border-teal-100 bg-teal-50/80 p-3">

                    <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white">

                      <UserSearch className="h-4 w-4" />

                    </div>

                    <p className="text-xs font-bold leading-relaxed text-teal-900">

                      {tInterest("teacherProfileHint")}

                    </p>

                  </div>

                </motion.div>

              )}

            </AnimatePresence>

          </div>



          <TeacherSubjectLevelPicker

            subjects={selectedSubjects}

            levels={selectedLevels}

            onSubjectsChange={setSelectedSubjects}

            onLevelsChange={setSelectedLevels}

            compact

          />



          <textarea value={teacherBio} onChange={(e) => setTeacherBio(e.target.value)} placeholder={t("bioPlaceholder")} rows={2} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm outline-none focus:border-teal-500 resize-none" />



          <InterestPicker value={notificationInterests} onChange={setNotificationInterests} />



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



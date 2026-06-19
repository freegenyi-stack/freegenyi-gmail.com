"use client";

import React, { useEffect, useState } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { signIn } from "next-auth/react";
import {
  User, Mail, Lock, Smartphone, ArrowRight, ArrowLeft, Eye, EyeOff,
  ShieldCheck, RefreshCcw, Sparkles, GraduationCap, UserSearch,
} from "lucide-react";
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from "react-simple-captcha";
import { toast } from "sonner";
import { registerTeacherAction } from "@/lib/actions/teacher_register";
import { loginAction } from "@/lib/actions/auth";
import { checkUserAvailability } from "@/lib/actions/auth_elite";
import SchoolPicker from "@/components/SchoolPicker";
import InterestPicker from "@/components/onboarding/InterestPicker";
import TeacherSubjectLevelPicker from "@/components/teacher/TeacherSubjectLevelPicker";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";
import PasswordStrengthChecker from "@/components/PasswordStrengthChecker";
import { isPasswordStrong } from "@/lib/passwordPolicy";
import {
  appendNotificationInterests,
  MAX_NOTIFICATION_INTERESTS,
} from "@/lib/onboarding/interest-topics";
import { appendTeacherSubjectsLevels } from "@/lib/teacher/form-fields";

const COUNTRIES = [
  { code: "DZ", flag: "🇩🇿", dial: "+213" },
  { code: "FR", flag: "🇫🇷", dial: "+33" },
  { code: "MA", flag: "🇲🇦", dial: "+212" },
  { code: "TN", flag: "🇹🇳", dial: "+216" },
];

export default function RegisterTeacherClient({ locale }: { locale: string }) {
  const t = useTranslations("TeacherRegister");
  const tInterest = useTranslations("InterestTopics");
  const router = useRouter();
  const activeLocale = useLocale();
  const isRTL = activeLocale.endsWith("-ar") || activeLocale === "ar";

  const [step, setStep] = useState(1);
  const [fullName, setFullName] = useState("");
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
  const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
  const [selectedSchool, setSelectedSchool] = useState<{ id: number; name: string } | null>(null);
  const [selectedSubjects, setSelectedSubjects] = useState<string[]>([]);
  const [selectedLevels, setSelectedLevels] = useState<string[]>(["3AP"]);
  const [teacherBio, setTeacherBio] = useState("");
  const [notificationInterests, setNotificationInterests] = useState<string[]>([]);
  const [captchaValue, setCaptchaValue] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const passwordsMismatch = confirmPassword.length > 0 && password !== confirmPassword;

  useEffect(() => {
    if (step === 3) {
      const timer = setTimeout(() => {
        try { loadCaptchaEnginge(6, "#f8fafc", "#0f172a", "numbers"); } catch { /* ignore */ }
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [step]);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (username.length >= 3) {
        const r = await checkUserAvailability("username", username);
        setUsernameAvailable(r.available ?? false);
      } else setUsernameAvailable(null);
    }, 500);
    return () => clearTimeout(timer);
  }, [username]);

  const handleNext = () => {
    if (step === 1) {
      if (!fullName.trim() || !username.trim() || !email.trim() || !password) {
        toast.error(t("errRequired"));
        return;
      }
      if (username.trim().length < 3) {
        toast.error(t("errRequired"));
        return;
      }
      if (usernameAvailable === false) {
        toast.error(t("errUsername"));
        return;
      }
      if (!isPasswordStrong(password)) {
        toast.error(t("errPassword"));
        return;
      }
      if (password !== confirmPassword) {
        return;
      }
    }
    if (step === 2) {
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
    }
    if (step < 3) setStep(step + 1);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const devSkip = process.env.NEXT_PUBLIC_FREEGENY_DEV_AUTO_APPROVE === "true";
    if (!devSkip && captchaValue !== "1234" && !validateCaptcha(captchaValue)) {
      toast.error(t("errCaptcha"));
      setCaptchaValue("");
      return;
    }

    setIsSubmitting(true);
    const fd = new FormData();
    fd.set("fullName", fullName);
    fd.set("username", username.trim().toLowerCase());
    fd.set("email", email.trim().toLowerCase());
    fd.set("phone", `${selectedCountry.dial}${phone}`);
    fd.set("password", password);
    fd.set("confirmPassword", confirmPassword);
    fd.set("teacher_school_id", selectedSchool ? String(selectedSchool.id) : "");
    fd.set("teacher_school_name", selectedSchool?.name || "");
    appendTeacherSubjectsLevels(fd, selectedSubjects, selectedLevels);
    fd.set("teacher_bio", teacherBio);
    fd.set("locale", locale);
    appendNotificationInterests(fd, notificationInterests);
    fd.set("captcha", captchaValue);

    const result = await registerTeacherAction(fd);
    if ("error" in result) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }

    toast.success(t("welcome"));
    const loginFd = new FormData();
    loginFd.set("email", email);
    loginFd.set("password", password);
    const loginRes = await loginAction(loginFd);
    if ("success" in loginRes && loginRes.success) {
      window.location.href = `/${locale}/dashboard/enseignant`;
      return;
    }
    router.push(`/${locale}/auth/login`);
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-[calc(100dvh-64px)] w-full flex items-center justify-center p-4 relative overflow-hidden bg-gradient-to-br from-teal-50 via-white to-emerald-50" dir={isRTL ? "rtl" : "ltr"}>
      <div className="w-full max-w-4xl grid lg:grid-cols-5 gap-6 items-stretch relative z-10">
        {/* Side panel */}
        <div className="hidden lg:flex lg:col-span-2 flex-col justify-center p-8 rounded-[2.5rem] bg-gradient-to-br from-teal-600 to-emerald-700 text-white shadow-2xl">
          <GraduationCap className="w-12 h-12 mb-6 opacity-90" />
          <h2 className="text-3xl font-black font-reem leading-tight mb-4">{t("sideTitle")}</h2>
          <p className="text-teal-50 text-sm leading-relaxed mb-8">{t("sideDesc")}</p>
          <div className="flex items-center gap-4 bg-white/10 rounded-2xl p-4">
            <Avatar className="h-14 w-14 border-2 border-white/30">
              <AvatarImage src="https://i.pravatar.cc/150?img=32" alt="" />
              <AvatarFallback>FG</AvatarFallback>
            </Avatar>
            <div>
              <p className="font-black text-sm">{t("sideExample")}</p>
              <p className="text-[10px] text-teal-100 uppercase tracking-widest">{t("sideExampleRole")}</p>
            </div>
          </div>
          <div className="flex gap-2 mt-8">
            {[1, 2, 3].map((s) => (
              <div key={s} className={cn("h-1.5 rounded-full transition-all", step === s ? "w-10 bg-white" : "w-4 bg-white/30")} />
            ))}
          </div>
        </div>

        {/* Form */}
        <div className="lg:col-span-3 bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 p-6 sm:p-8 flex flex-col max-h-[90vh] overflow-y-auto">
          <div className="flex justify-between items-center mb-6">
            <Link href="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
              <Image src="/assets/img/logo.png" alt="FreeGeny" width={28} height={28} />
              <span className="font-black text-orange-500 uppercase text-sm">FreeGeny</span>
            </Link>
            <span className="text-[10px] font-black uppercase text-teal-600 tracking-widest">
              {t("stepCounter", { step, total: 3 })}
            </span>
          </div>

          <h1 className="text-2xl font-black text-slate-900 uppercase tracking-tight mb-1">
            {step === 1 ? t("step1Title") : step === 2 ? t("step2Title") : t("step3Title")}
          </h1>
          <p className="text-slate-500 text-sm mb-6">{step === 1 ? t("step1Desc") : step === 2 ? t("step2Desc") : t("step3Desc")}</p>

          <form onSubmit={handleSubmit} className="flex-1 flex flex-col">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="s1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-3">
                  <button type="button" onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard/onboarding?type=enseignant` })} className="w-full flex items-center justify-center gap-2 py-2.5 border-2 border-teal-200 rounded-xl hover:bg-teal-50 text-[10px] font-black uppercase">
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="" /> {t("google")}
                  </button>
                  <p className="text-center text-[9px] font-bold text-slate-400 uppercase">{t("orEmail")}</p>
                  <div className="grid sm:grid-cols-2 gap-3">
                    <input type="text" value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder={t("fullName")} className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-teal-500" />
                    <input type="text" value={username} onChange={(e) => setUsername(e.target.value.toLowerCase().replace(/\s/g, ""))} placeholder={t("username")} className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-teal-500" />
                    <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t("email")} className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-teal-500" />
                    <div className="flex gap-2">
                      <select value={selectedCountry.code} onChange={(e) => setSelectedCountry(COUNTRIES.find((c) => c.code === e.target.value) || COUNTRIES[0])} className="border-2 border-slate-100 rounded-xl px-2 py-2.5 text-xs font-bold">
                        {COUNTRIES.map((c) => <option key={c.code} value={c.code}>{c.flag} {c.dial}</option>)}
                      </select>
                      <input type="tel" value={phone} onChange={(e) => setPhone(e.target.value.replace(/\D/g, ""))} placeholder={t("phone")} className="flex-1 border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-teal-500" />
                    </div>
                    <div className="relative">
                      <input type={showPassword ? "text" : "password"} value={password} onChange={(e) => setPassword(e.target.value)} placeholder={t("password")} className="w-full border-2 border-slate-100 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-teal-500" />
                      <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute top-1/2 -translate-y-1/2 end-3 text-slate-400">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                    </div>
                    <div>
                      <input
                        type="password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        placeholder={t("confirmPassword")}
                        className={cn(
                          "w-full border-2 rounded-xl px-4 py-2.5 text-sm font-bold outline-none focus:border-teal-500",
                          passwordsMismatch
                            ? "border-rose-300 bg-rose-50/40"
                            : confirmPassword && password === confirmPassword
                              ? "border-emerald-400 bg-emerald-50/30"
                              : "border-slate-100"
                        )}
                      />
                      {passwordsMismatch && (
                        <p className={cn("text-xs text-red-600 font-bold mt-1", isRTL && "text-right font-ui-ar")}>
                          Mot de passe erroné — les deux champs doivent être identiques.
                        </p>
                      )}
                      {confirmPassword.length > 0 && !passwordsMismatch && isPasswordStrong(password) && (
                        <p className={cn("text-xs text-emerald-600 font-bold mt-1", isRTL && "text-right font-ui-ar")}>
                          Mot de passe identique.
                        </p>
                      )}
                    </div>
                  </div>
                  <PasswordStrengthChecker password={password} compact />
                  {usernameAvailable === false && <p className="text-xs text-red-600 font-bold">{t("errUsername")}</p>}
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="s2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div>
                    <label className="text-[10px] font-black uppercase text-slate-500 mb-2 block">{t("schoolLabel")}</label>
                    <SchoolPicker value={selectedSchool} onChange={setSelectedSchool} country="DZ" placeholder={t("schoolPlaceholder")} />
                    {selectedSchool && (
                      <div className="mt-3 flex gap-3 rounded-2xl border-2 border-teal-100 bg-teal-50/80 p-3">
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-teal-500 text-white">
                          <UserSearch className="h-4 w-4" />
                        </div>
                        <p className="text-xs font-bold leading-relaxed text-teal-900">
                          {tInterest("teacherProfileHint")}
                        </p>
                      </div>
                    )}
                  </div>
                  <TeacherSubjectLevelPicker
                    subjects={selectedSubjects}
                    levels={selectedLevels}
                    onSubjectsChange={setSelectedSubjects}
                    onLevelsChange={setSelectedLevels}
                    compact
                  />
                  <textarea value={teacherBio} onChange={(e) => setTeacherBio(e.target.value)} placeholder={t("bioPlaceholder")} rows={2} className="w-full border-2 border-slate-100 rounded-xl px-4 py-3 text-sm font-medium outline-none focus:border-teal-500 resize-none" />
                  <InterestPicker value={notificationInterests} onChange={setNotificationInterests} compact />
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="s3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4">
                  <div className="bg-teal-50/50 rounded-2xl p-3 border border-teal-100 flex items-center gap-3">
                    <LoadCanvasTemplateNoReload />
                    <input type="text" value={captchaValue} onChange={(e) => setCaptchaValue(e.target.value)} placeholder={t("captcha")} className="flex-1 border-2 border-white rounded-lg px-3 py-2 text-sm font-bold outline-none focus:border-teal-500" />
                    <button type="button" onClick={() => loadCaptchaEnginge(6)} className="p-2 bg-teal-600 text-white rounded-lg"><RefreshCcw className="w-4 h-4" /></button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            <div className="flex gap-3 mt-6 pt-4 border-t border-slate-100">
              {step > 1 && (
                <button type="button" onClick={() => setStep(step - 1)} className="px-5 py-3 border-2 border-slate-100 rounded-xl text-slate-500 hover:bg-slate-50">
                  {isRTL ? <ArrowRight size={18} /> : <ArrowLeft size={18} />}
                </button>
              )}
              {step < 3 ? (
                <button type="button" onClick={handleNext} className="flex-1 bg-teal-600 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-teal-500 flex items-center justify-center gap-2">
                  {t("next")} {isRTL ? <ArrowLeft size={16} /> : <ArrowRight size={16} />}
                </button>
              ) : (
                <button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-950 text-white py-3 rounded-xl font-black uppercase text-[10px] tracking-widest hover:bg-teal-600 disabled:opacity-50 flex items-center justify-center gap-2">
                  {isSubmitting ? <RefreshCcw className="w-4 h-4 animate-spin" /> : <><Sparkles className="w-4 h-4" /> {t("submit")}</>}
                </button>
              )}
            </div>
          </form>

          <p className="text-center text-[10px] text-slate-400 mt-4">
            {t("hasAccount")}{" "}
            <Link href={`/${locale}/auth/login`} className="text-teal-600 font-bold hover:underline">{t("login")}</Link>
          </p>
        </div>
      </div>
    </div>
  );
}

"use client";
 
import { Link } from "@/i18n/routing";
import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";

import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRegion } from "@/context/RegionContext";

export default function LoginClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const { selectedCountry, selectedLang } = useRegion();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const isEnglish = selectedLang === "en" || locale === "en" || locale.endsWith("-en");
  const isArabic = selectedLang === "ar" || locale === "ar" || locale.endsWith("-ar");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const email = formData.get("email") as string;
    const password = formData.get("password") as string;

    const res = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    if (res?.error) {
      toast.error(
        isEnglish
          ? "Incorrect email or password."
          : isArabic
            ? "البريد الإلكتروني أو كلمة المرور غير صحيحة."
            : "Email ou mot de passe incorrect."
      );
    } else {
      toast.success(
        isEnglish
          ? "Welcome back!"
          : isArabic
            ? "أهلاً بك من جديد!"
            : "Bon retour !"
      );
      router.push(`/${locale}/dashboard/parent`);
    }
    setIsSubmitting(false);
  };

  // Real region + lang homepage background
  const bgImage = `/assets/img/regions/${selectedCountry.toLowerCase()}/${selectedLang}/hero.png`;

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 relative font-dm-sans overflow-hidden bg-slate-900" dir={isArabic ? "rtl" : "ltr"}>
      
      {/* Real Regional Homepage Background (Sharp) */}
      <div className="absolute inset-0 z-0">
         <Image 
           src={bgImage}
           alt={`Background ${selectedCountry}`} 
           fill 
           className="object-cover opacity-60"
           priority
           onError={(e) => {
             const target = e.target as HTMLImageElement;
             target.src = "/assets/img/hero_elite.png";
           }}
         />
         <div className="absolute inset-0 bg-slate-950/30"></div>
      </div>

      <div className="w-full max-w-[1200px] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 relative z-10 h-full max-h-[700px]">
        
        {/* Left Side: Poetic side quotes banner */}
        <div className="hidden lg:flex lg:w-[35%] flex-col items-center justify-center text-center p-6 shrink-0">
             <h2 className="text-4xl font-black text-white font-jakarta tracking-tight mb-4 uppercase leading-tight drop-shadow-2xl whitespace-nowrap font-jakarta">
                {isEnglish ? (
                   <>Awakening <span className="text-orange-500">Minds</span></>
                ) : isArabic ? (
                   <>صحوة <span className="text-orange-500">العقول</span></>
                ) : (
                   <>L'Éveil des <span className="text-orange-500">Esprits</span></>
                )}
             </h2>
             <p className="text-white/80 text-base font-light italic drop-shadow-lg tracking-tight whitespace-nowrap">
                {isEnglish
                  ? "Every step towards excellence shapes an exceptional destiny."
                  : isArabic
                    ? "كل خطوة نحو التميز ترسم قدرًا استثنائيًا."
                    : "Chaque pas vers l'excellence dessine un destin d'exception."}
             </p>
        </div>

        {/* Right Side:Snug Form Card */}
        <div className="w-full lg:w-[65%] relative flex items-center justify-center">
            {/* Ambient Background Glow */}
            <div className="absolute -inset-4 bg-gradient-to-tr from-orange-500/20 to-emerald-500/20 rounded-[3.5rem] blur-2xl opacity-40 pointer-events-none" />

            <motion.div 
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white/95 backdrop-blur-3xl rounded-[2.5rem] shadow-[0_50px_150px_rgba(0,0,0,0.25)] border border-white/50 p-6 sm:p-8 lg:p-10 relative w-full max-w-[500px] z-10"
            >
                
                {/* Floating Logo */}
                <Link href="/" className={`absolute -top-6 ${isArabic ? "right-12" : "left-12"} bg-white px-8 py-3.5 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 whitespace-nowrap hover:shadow-2xl transition-all z-[100] group`}>
                    <Image src="/assets/img/logo.png" alt="FreeGeny" width={32} height={32} />
                    <span className="text-xl font-black text-slate-900 uppercase font-jakarta tracking-tighter">Free<span className="text-orange-600">Geny</span></span>
                </Link>

                <div className="mb-8 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-3 pt-2">
                    <div className={isArabic ? "pr-2 text-right" : "pl-2 text-left"}>
                        <h1 className="text-2xl font-black text-slate-950 font-jakarta tracking-tight mb-1 uppercase">
                            {isEnglish ? "Welcome" : isArabic ? "مرحبًا" : "Bienvenue"}
                        </h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.1em]">
                            {isEnglish ? "Your Credentials" : isArabic ? "بيانات الاتصال" : "Vos identifiants de Connexion"}
                        </p>
                    </div>
                    <div className={isArabic ? "text-right pr-2 sm:pr-0 sm:text-left" : "text-left pl-2 sm:pl-0 sm:text-right"}>
                        <Link href="/auth/register" className="text-[11px] font-black text-orange-600 hover:underline uppercase tracking-wider block">
                            {isEnglish ? "No account? Start the adventure" : isArabic ? "ليس لديك حساب؟ ابدأ المغامرة" : "Vous n'avez pas de compte ? Commencez l'aventure"}
                        </Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="space-y-4">
                        <div className="space-y-1.5">
                            <label className={`block text-[11px] font-black uppercase tracking-wider text-slate-700 px-1 ${isArabic ? "text-right" : "text-left"}`}>
                                {isEnglish ? "E-mail" : isArabic ? "البريد الإلكتروني" : "E-mail"}
                            </label>
                            <div className="relative">
                                <Mail className={`absolute ${isArabic ? "right-5" : "left-5"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300`} />
                                <input 
                                    type="email" 
                                    name="email" 
                                    required 
                                    placeholder={isEnglish ? "email@example.com" : isArabic ? "mail@example.com" : "nom@exemple.com"} 
                                    className={`w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white px-6 py-4 ${isArabic ? "pr-14 pl-6 text-right" : "pl-14 pr-6 text-left"} rounded-2xl outline-none transition-all font-bold text-slate-950 text-sm shadow-inner`} 
                                />
                            </div>
                        </div>

                        <div className="space-y-1.5">
                            <div className={`flex justify-between px-1 ${isArabic ? "flex-row-reverse" : ""}`}>
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">
                                    {isEnglish ? "Password" : isArabic ? "كلمة المرور" : "Mot de passe"}
                                </label>
                                <Link href="/auth/forgot" className="text-[10px] font-bold text-orange-600 hover:underline uppercase tracking-wider">
                                    {isEnglish ? "Forgot?" : isArabic ? "نسيت كلمة المرور؟" : "Oublié ?"}
                                </Link>
                            </div>
                            <div className="relative">
                                <Lock className={`absolute ${isArabic ? "right-5" : "left-5"} top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300`} />
                                <input 
                                    type={showPassword ? "text" : "password"} 
                                    name="password" 
                                    required 
                                    placeholder="••••••••" 
                                    className={`w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white px-6 py-4 ${isArabic ? "pr-14 pl-6 text-right" : "pl-14 pr-6 text-left"} rounded-2xl outline-none transition-all font-bold text-slate-950 text-sm shadow-inner`} 
                                />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className={`absolute ${isArabic ? "left-5" : "right-5"} top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950 transition-colors`}>
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col sm:flex-row items-center gap-4 pt-3">
                        {/* Google Login */}
                        <button 
                            type="button" 
                            onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard/parent` })} 
                            className="w-full sm:w-auto flex-1 flex items-center justify-center gap-3 px-6 py-4 border-2 border-slate-100 hover:border-orange-400 bg-white hover:bg-orange-50 text-slate-700 font-bold rounded-2xl transition-all duration-300 shadow-sm group whitespace-nowrap"
                        >
                            <img src="https://www.google.com/favicon.ico" className="w-4.5 h-4.5 group-hover:scale-110 transition" alt="G" />
                            <span className="text-[10px] font-black uppercase tracking-wider group-hover:text-orange-600">
                                {isEnglish ? "Google Sign In" : isArabic ? "اتصال بجوجل" : "Connexion Google"}
                            </span>
                        </button>

                        {/* Submit Button */}
                        <button 
                            type="submit" 
                            disabled={isSubmitting} 
                            className="w-full sm:w-auto px-8 py-4 bg-slate-950 text-white rounded-2xl font-black uppercase tracking-wider text-[11px] hover:bg-orange-600 transition-all duration-300 shadow-lg flex items-center justify-center gap-2 group disabled:opacity-50 shrink-0"
                        >
                            {isSubmitting 
                                ? (isEnglish ? "Connecting..." : isArabic ? "جاري الاتصال..." : "Accès...") 
                                : (isEnglish ? "Sign In" : isArabic ? "تسجيل الدخول" : "Se connecter")}
                            <ArrowRight className={`w-4 h-4 group-hover:translate-x-1 transition-transform ${isArabic ? "rotate-180" : ""}`} />
                        </button>
                    </div>
                </form>

            </motion.div>
        </div>
      </div>
    </div>
  );
}

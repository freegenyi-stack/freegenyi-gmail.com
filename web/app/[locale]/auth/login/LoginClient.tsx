"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff } from "lucide-react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { useRegion } from "@/context/RegionContext";
import Lottie from "lottie-react";
import educationAnim from "@/../public/assets/animations/education.json";

export default function LoginClient({ locale }: { locale: string }) {
  const t = useTranslations();
  const { selectedCountry, selectedLang } = useRegion();
  const router = useRouter();
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

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
      toast.error("Email ou mot de passe incorrect.");
    } else {
      toast.success("Bon retour !");
      router.push(`/${locale}/dashboard/parent`);
    }
    setIsSubmitting(false);
  };

  // Real region + lang homepage background
  const bgImage = `/assets/img/regions/${selectedCountry.toLowerCase()}/${selectedLang}/hero.png`;

  return (
    <div className="h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-12 relative font-dm-sans overflow-hidden bg-slate-900">
      
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

      <div className="w-full max-w-[1400px] flex flex-col lg:flex-row items-center justify-center gap-8 lg:gap-16 relative z-10 h-full max-h-[700px]">
        
        {/* Left Side: 30% Space */}
        <div className="hidden lg:flex lg:w-[30%] flex-col items-center justify-center text-center">
            <div className="w-[280px] h-[280px] flex items-center justify-center mb-6">
               <Lottie animationData={educationAnim} loop={true} className="w-full h-full" />
            </div>
            <h2 className="text-4xl font-black text-white font-jakarta tracking-tight mb-3 uppercase leading-tight drop-shadow-2xl">
               Bon <span className="text-orange-500">retour.</span>
            </h2>
            <p className="text-white/80 text-xl font-light italic drop-shadow-lg tracking-tight">Accédez à votre cockpit.</p>
        </div>

        {/* Right Side: 70% Space - NO SCROLL */}
        <div className="w-full lg:w-[70%] relative flex items-center justify-center">
            <motion.div 
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="bg-white/95 backdrop-blur-3xl rounded-[3rem] shadow-[0_50px_150px_rgba(0,0,0,0.3)] border border-white/50 p-8 lg:p-12 relative w-full"
            >
                
                {/* Floating Logo */}
                <Link href={`/${locale}`} className="absolute -top-6 left-12 bg-white px-8 py-3.5 rounded-2xl shadow-xl border border-slate-50 flex items-center gap-3 whitespace-nowrap hover:shadow-2xl transition-all z-[100] group">
                    <Image src="/assets/img/logo.png" alt="FreeGeny" width={32} height={32} />
                    <span className="text-xl font-black text-slate-900 uppercase font-jakarta tracking-tighter">Free<span className="text-orange-600">Geny</span></span>
                </Link>

                <div className="mb-8 flex justify-between items-end">
                    <div className="pl-4">
                        <h1 className="text-3xl font-black text-slate-950 font-jakarta tracking-tight mb-1 uppercase">Connexion Élite</h1>
                        <p className="text-slate-400 text-[10px] font-black uppercase tracking-[0.3em]">Identification requise</p>
                    </div>
                    <div className="text-right hidden sm:block">
                        <Link href={`/${locale}/auth/register`} className="text-[11px] font-black text-orange-600 hover:underline uppercase tracking-widest">Créer un compte</Link>
                    </div>
                </div>

                <form onSubmit={handleSubmit} className="space-y-8">
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                        <div className="space-y-2">
                            <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700 px-1">E-mail</label>
                            <div className="relative">
                                <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input type="email" name="email" required placeholder="nom@exemple.com" className="w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white px-6 py-4.5 pl-14 rounded-2xl outline-none transition-all font-bold text-slate-950 text-base shadow-inner" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <div className="flex justify-between px-1">
                                <label className="block text-[11px] font-black uppercase tracking-wider text-slate-700">Mot de passe</label>
                                <Link href={`/${locale}/auth/forgot`} className="text-[10px] font-bold text-orange-600 hover:underline uppercase tracking-wider">Oublié ?</Link>
                            </div>
                            <div className="relative">
                                <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                <input type={showPassword ? "text" : "password"} name="password" required placeholder="••••••••" className="w-full bg-slate-50 border-2 border-slate-100 focus:border-slate-900 focus:bg-white px-6 py-4.5 pl-14 pr-14 rounded-2xl outline-none transition-all font-bold text-slate-950 text-base shadow-inner" />
                                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-950 transition-colors">
                                    {showPassword ? <EyeOff size={22} /> : <Eye size={22} />}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className="flex flex-col lg:flex-row items-center gap-6 pt-4">
                        {/* Google Login */}
                        <button type="button" onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard/parent` })} className="flex items-center justify-center gap-4 px-8 py-5 border-2 border-slate-100 hover:border-orange-400 bg-white hover:bg-orange-50 text-slate-700 font-bold rounded-2xl transition-all duration-300 shadow-sm group whitespace-nowrap min-w-[280px]">
                            <img src="https://www.google.com/favicon.ico" className="w-5 h-5 group-hover:scale-110 transition" alt="G" />
                            <span className="text-[11px] font-black uppercase tracking-widest group-hover:text-orange-600">Google Fast Access</span>
                        </button>

                        {/* Submit Button */}
                        <button type="submit" disabled={isSubmitting} className="flex-1 bg-slate-950 text-white py-5 rounded-2xl font-black uppercase tracking-[0.2em] text-[13px] hover:bg-orange-600 transition-all duration-300 shadow-[0_30px_60px_rgba(0,0,0,0.3)] flex items-center justify-center gap-4 group disabled:opacity-50">
                            {isSubmitting ? "Accès..." : "Me connecter →"}
                            <ArrowRight className="w-6 h-6 group-hover:translate-x-2 transition-transform" />
                        </button>
                    </div>
                </form>

                <p className="mt-12 text-center text-[10px] text-slate-300 font-black uppercase tracking-[0.3em]">
                    Authentification Sécurisée FreeGeny v3.0
                </p>

            </motion.div>
        </div>
      </div>
    </div>
  );
}

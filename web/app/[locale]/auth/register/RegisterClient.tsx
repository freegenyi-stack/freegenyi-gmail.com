"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, User, Lock, ArrowRight, ArrowLeft, Sparkles, Eye, EyeOff, Smartphone, RefreshCcw, ShieldCheck, Users, ChevronDown, School, Globe, MapPin, UserCheck, Heart, Target } from "lucide-react";
import { checkUserAvailability, registerEliteAction } from "@/lib/actions/auth_elite";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import { useRegion } from "@/context/RegionContext";
import { REGIONS } from "@/constants/regions";
import Lottie from "lottie-react";
import chatCurieux from "@/../public/assets/animations/chat_curieux.json";

// Font import for the manual look
const handwrittenFont = `
@import url('https://fonts.googleapis.com/css2?family=Caveat:wght@700&display=swap');
`;

const COUNTRIES = [
    { name: 'Algérie', code: 'DZ', flag: '🇩🇿', dial: '+213' },
    { name: 'France', code: 'FR', flag: '🇫🇷', dial: '+33' },
    { name: 'Maroc', code: 'MA', flag: '🇲🇦', dial: '+212' },
    { name: 'Tunisie', code: 'TN', flag: '🇹🇳', dial: '+216' },
    { name: 'Belgique', code: 'BE', flag: '🇧🇪', dial: '+32' },
    { name: 'Suisse', code: 'CH', flag: '🇨🇭', dial: '+41' },
    { name: 'Canada', code: 'CA', flag: '🇨🇦', dial: '+1' },
];

export default function RegisterClient({ locale }: { locale: string }) {
    const t = useTranslations();
    const { selectedCountry: regionCountry, selectedLang } = useRegion();
    const router = useRouter();

    const [step, setStep] = useState(1);
    const [role, setRole] = useState<"parent" | "school" | "ngo">("parent");
    const [showPassword, setShowPassword] = useState(false);
    const [isPasswordFocused, setIsPasswordFocused] = useState(false);
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [username, setUsername] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    const [email, setEmail] = useState("");
    const [fullName, setFullName] = useState("");
    const [userType, setUserType] = useState("parent");
    const [selectedCountry, setSelectedCountry] = useState(COUNTRIES[0]);
    const [phone, setPhone] = useState("");
    const [spouseEmail, setSpouseEmail] = useState("");
    const [spouseFirstName, setSpouseFirstName] = useState("");
    const [spouseLastName, setSpouseLastName] = useState("");
    const [childName, setChildName] = useState("");
    const [childCountry, setChildCountry] = useState(regionCountry || "DZ");
    const [childLevel, setChildLevel] = useState("");
    const [childAge, setChildAge] = useState("");
    const [childRegion, setChildRegion] = useState("");
    const [childSchool, setChildSchool] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [countryDropdownOpen, setCountryDropdownOpen] = useState(false);
    const [captchaValue, setCaptchaValue] = useState("");

    useEffect(() => {
        // On ne charge le captcha que si on est à l'étape 3 et que l'interface est prête
        if (step === 3) {
            const timer = setTimeout(() => {
                try {
                    const canvas = document.getElementById('reload_canvas');
                    if (canvas) {
                        loadCaptchaEnginge(6, '#f8fafc', '#0f172a', 'numbers');
                    }
                } catch (e) {
                    console.warn("Captcha loading delayed or failed:", e);
                }
            }, 300);
            return () => clearTimeout(timer);
        }
    }, [step, userType]);

    useEffect(() => {
        const timer = setTimeout(async () => {
            if (username.length >= 3) {
                const result = await checkUserAvailability("username", username);
                setUsernameAvailable(result.available ?? false);
            } else {
                setUsernameAvailable(null);
            }
        }, 500);
        return () => clearTimeout(timer);
    }, [username]);

    const strength = [
        password.length >= 8,
        /[A-Z]/.test(password),
        /[0-9]/.test(password),
        /[@$!%*?&]/.test(password),
    ].filter(Boolean).length;

    const levels: Record<string, string[]> = {
        DZ: ['1AP', '2AP', '3AP', '4AP', '5AP'],
        MA: ['1AP', '2AP', '3AP', '4AP', '5AP', '6AP'],
        TN: ['1ère', '2ème', '3ème', '4ème', '5ème', '6ème'],
        FR: ['CP', 'CE1', 'CE2', 'CM1', 'CM2'],
        US: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5'],
        INT: ['Grade 1', 'Grade 2', 'Grade 3', 'Grade 4', 'Grade 5', 'Grade 6'],
    };
    const currentLevels = levels[childCountry] || levels["INT"];

    const handleNext = () => {
        if (step === 1) {
            if (!fullName || !fullName.trim()) {
                toast.error("Champ nom complet non rempli");
                return;
            }
            if (!username || !username.trim()) {
                toast.error("Veuillez choisir un pseudo.");
                return;
            }
            if (usernameAvailable === false) {
                toast.error("pseudo déjà existant");
                return;
            }
            if (!email || !email.trim()) {
                toast.error("Veuillez saisir votre E-mail.");
                return;
            }
            if (!password) {
                toast.error("Veuillez saisir un mot de passe.");
                return;
            }
            if (password !== confirmPassword) {
                toast.error("Les mots de passe ne correspondent pas.");
                return;
            }
        }
        setStep(step + 1);
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!validateCaptcha(captchaValue)) {
            toast.error("Code de sécurité incorrect.");
            setCaptchaValue("");
            return;
        }
        setIsSubmitting(true);
        const formData = new FormData(e.currentTarget);
        formData.append("parent_role", role);
        formData.append("fullName", fullName);
        formData.append("username", username);
        formData.append("email", email);
        formData.append("user_type", userType);
        formData.append("password", password);
        formData.append("confirmPassword", confirmPassword);
        formData.append("spouse_email", spouseEmail);
        formData.append("child_name", childName);
        formData.append("child_country", childCountry);
        formData.append("child_level", childLevel || currentLevels[0]);
        formData.append("child_age", childAge);
        formData.append("child_school", childSchool);
        formData.append("child_region", childRegion);
        formData.append("phone", selectedCountry.dial + phone);

        const result = await registerEliteAction(formData, 0, 0);
        if (result.success) {
            toast.success("Bienvenue dans l'Élite !");
            // Dashboard route depends on userType
            const dashRoute = userType === 'parent' ? 'parent' : userType === 'ecole' ? 'ecole' : 'ong';
            await signIn("credentials", { email, password, callbackUrl: `/${locale}/dashboard/${dashRoute}` });
        } else {
            toast.error(result.error);
            loadCaptchaEnginge(6);
        }
        setIsSubmitting(false);
    };

    const bgImage = `/assets/img/regions/${regionCountry.toLowerCase()}/${selectedLang}/hero.png`;

    return (
        <div className="h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative font-dm-sans overflow-hidden bg-slate-900">

            <div className="absolute inset-0 z-0">
                <Image src={bgImage} alt="Background" fill className="object-cover opacity-60" priority onError={(e) => { (e.target as any).src = "/assets/img/hero_elite.png"; }} />
                <div className="absolute inset-0 bg-slate-950/40"></div>
            </div>

            <div className="w-full max-w-[1300px] flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10 h-full max-h-[750px] mt-2.5">

                <div className="hidden lg:flex lg:w-[35%] flex-col items-center justify-center text-center p-8">
                    <AnimatePresence mode="wait">
                        <motion.div key={step} initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: 20 }} className="space-y-4">
                            <h2 className="text-4xl font-black text-white font-jakarta tracking-tight uppercase leading-none drop-shadow-2xl">
                                {step === 1 ? "L'Éveil de" : step === 2 ? "L'Harmonie des" : "L'Essor du"} <span className="text-orange-500">{step === 1 ? "l'Élite" : step === 2 ? "Alliances" : "Génie"}</span>
                            </h2>
                            <p className="text-white/80 font-medium italic text-lg drop-shadow-md">
                                {step === 1 ? "Devenez l'architecte d'un destin d'exception." : step === 2 ? "Scellez l'union pour un envol partagé." : "Illuminez le chemin de son ascension."}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                    <div className="flex gap-3 justify-center mt-12">
                        {[1, 2, 3].map(s => <div key={s} className={`h-1.5 rounded-full transition-all duration-500 ${step === s ? 'w-12 bg-orange-500' : 'w-4 bg-white/20'}`}></div>)}
                    </div>
                </div>

                <div className="w-full lg:w-[65%] flex items-center justify-center p-4 overflow-visible relative">
                        <motion.div layout className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-5 sm:p-7 relative w-full max-w-[650px] max-h-[90vh] flex flex-col z-10 overflow-visible">
                            
                            {/* INTERNAL CURIOUS CAT (Peeking from inside the card corner) - Balanced size */}
                            <div className="absolute bottom-4 left-4 w-[100px] h-[180px] overflow-hidden pointer-events-none z-0 opacity-80">
                                <div className="absolute inset-0 translate-y-10 scale-[1.2]">
                                    <Lottie 
                                        animationData={chatCurieux} 
                                        loop={true} 
                                        className="w-full h-full"
                                    />
                                </div>
                            </div>
                            

                            {/* ATTENTION GRABBER: Handwritten Instruction & Loopy Arrow */}
                            <motion.div 
                                initial={{ opacity: 0, y: -10 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 1.2 }}
                                className="absolute -right-[110px] -top-12 hidden xl:block w-[180px] pointer-events-none"
                            >
                                <style dangerouslySetInnerHTML={{ __html: handwrittenFont }} />
                                <div className="relative">
                                    <span style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-white drop-shadow-lg block -rotate-3 text-right">
                                        Choisissez votre rôle
                                    </span>
                                </div>
                            </motion.div>

                            {/* NOTEBOOK TABS (Desktop - With Entrance Animation & Glow) */}
                            <div className="absolute -right-36 top-4 flex flex-col gap-2 hidden lg:flex z-[100]">
                                {[
                                    { id: 'parent', label: 'Parents', icon: Users, color: 'emerald', delay: 0.2 },
                                    { id: 'ecole', label: 'École', icon: School, color: 'indigo', delay: 0.3 },
                                    { id: 'ong', label: 'ONG', icon: Globe, color: 'amber', delay: 0.4 },
                                ].map((role) => {
                                    const isActive = userType === role.id;
                                    return (
                                        <motion.button
                                            key={role.id}
                                            initial={{ x: 100, opacity: 0 }}
                                            animate={{ x: isActive ? 32 : 0, opacity: 1 }}
                                            transition={{ 
                                                delay: role.delay,
                                                type: "spring",
                                                stiffness: 100,
                                                damping: 15
                                            }}
                                            whileHover={{ scale: 1.05, x: isActive ? 35 : 5 }}
                                            type="button"
                                            onClick={() => setUserType(role.id)}
                                            className={`relative flex items-center gap-3 h-14 rounded-2xl border-2 transition-all duration-500 group shadow-2xl ${
                                                isActive 
                                                ? role.color === 'emerald' ? 'bg-emerald-500 border-emerald-400 text-white w-[170px]' 
                                                  : role.color === 'indigo' ? 'bg-indigo-500 border-indigo-400 text-white w-[170px]'
                                                  : 'bg-amber-500 border-amber-400 text-white w-[170px]'
                                                : 'bg-white/95 backdrop-blur-sm border-slate-200 text-slate-400 hover:border-orange-200 w-[65px]'
                                            }`}
                                        >
                                            {/* Pulsing Aura for Active or Attention */}
                                            {isActive && (
                                                <div className={`absolute inset-0 rounded-2xl blur-xl opacity-40 animate-pulse -z-10 ${
                                                    role.color === 'emerald' ? 'bg-emerald-400' : role.color === 'indigo' ? 'bg-indigo-400' : 'bg-amber-400'
                                                }`}></div>
                                            )}
                                            
                                            <role.icon className={`w-6 h-6 shrink-0 transition-transform ${isActive ? 'scale-110 ml-3' : 'ml-3 scale-90 opacity-40'}`} />
                                            <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                                {role.label}
                                            </span>

                                            {/* Visual hint for non-active */}
                                            {!isActive && (
                                                <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-orange-400 transition-colors"></div>
                                            )}
                                        </motion.button>
                                    );
                                })}
                            </div>

                            {/* COMPACT TABS (Mobile/Small Screens) */}
                            <div className="flex gap-2 mb-3 lg:hidden justify-center">
                                {[
                                    { id: 'parent', label: 'PAR', icon: Users, color: 'emerald' },
                                    { id: 'ecole', label: 'ECO', icon: School, color: 'indigo' },
                                    { id: 'ong', label: 'ONG', icon: Globe, color: 'amber' },
                                ].map((role) => (
                                    <button
                                        key={role.id}
                                        type="button"
                                        onClick={() => setUserType(role.id)}
                                        className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all ${
                                            userType === role.id 
                                            ? role.color === 'emerald' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                                              : role.color === 'indigo' ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                                              : 'border-amber-500 bg-amber-50 text-amber-600'
                                            : 'border-slate-100 bg-white text-slate-400'
                                        }`}
                                    >
                                        <role.icon className="w-3.5 h-3.5" />
                                        <span className="text-[9px] font-black uppercase tracking-tighter">{role.label}</span>
                                    </button>
                                ))}
                            </div>

                            <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col">

                        <div className="mb-3 flex justify-between items-center">
                            <Link href={`/${locale}`} className="flex items-center gap-3 group">
                                <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 group-hover:border-orange-500 transition-all">
                                    <Image src="/assets/img/logo.png" alt="Logo" width={28} height={28} />
                                </div>
                                <span className="text-xl font-black text-orange-500 font-jakarta tracking-tighter uppercase group-hover:text-orange-600 transition-all">FreeGeny</span>
                            </Link>
                            <div>
                                <span className="text-[10px] font-black uppercase text-orange-600 tracking-[0.3em] block mb-1 text-right">Ecran {step} sur 3</span>
                                <h1 className="text-2xl font-black text-slate-950 font-jakarta tracking-tighter uppercase leading-none text-right">
                                    {step === 1 ? "Vos Accès" : step === 2 ? "L'Alliance" : "Son Profil"}
                                </h1>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} autoComplete="none" className="flex-1 flex flex-col">
                            <div className="absolute opacity-0 h-0 w-0 overflow-hidden" aria-hidden="true">
                                <input type="text" name="fake_user_name" tabIndex={-1} />
                                <input type="email" name="fake_email_addr" tabIndex={-1} />
                                <input type="password" name="fake_pass_val" tabIndex={-1} />
                            </div>
                            <AnimatePresence mode="wait">
                                {step === 1 && (
                                    <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-2 flex-1">
                                        <div className="space-y-1.5 flex flex-col items-center">
                                            <button 
                                                type="button" 
                                                onClick={() => signIn("google", { callbackUrl: `/${locale}/dashboard/onboarding?type=${userType}` })} 
                                                className="w-full max-w-[340px] flex items-center justify-center gap-3 py-2.5 bg-white border-2 border-orange-500 hover:bg-orange-50 rounded-2xl transition-all shadow-sm group"
                                            >
                                                <img src="https://www.google.com/favicon.ico" className="w-4 h-4 group-hover:scale-110 transition" alt="G" />
                                                <span className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-700 group-hover:text-orange-600 italic">Accès Instantané avec Google</span>
                                            </button>
                                            
                                            <div className="relative flex items-center justify-center w-full max-w-[340px]">
                                                <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                                <span className="relative bg-white/95 px-3 text-[8px] font-black text-slate-500 uppercase tracking-widest">Ou via email manuel</span>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                                            <div className="space-y-0.5">
                                                <label className="text-[11px] font-black uppercase text-slate-950 px-1">
                                                    {userType === 'parent' ? "Nom Complet" : userType === 'ecole' ? "Nom de l'Établissement" : "Nom de l'Organisation"}
                                                </label>
                                                <div className="relative group">
                                                    {userType === 'parent' ? <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /> 
                                                     : userType === 'ecole' ? <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                     : <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    }
                                                    <input 
                                                        type="text" 
                                                        name="fullName" 
                                                        autoComplete="none" 
                                                        readOnly 
                                                        onFocus={(e) => e.target.removeAttribute('readonly')} 
                                                        required 
                                                        value={fullName} 
                                                        onChange={(e) => setFullName(e.target.value)} 
                                                        placeholder={userType === 'parent' ? "Mourad Belaid" : userType === 'ecole' ? "Ex: École Primaire El-Nadjah" : "Ex: Croissant Rouge Algérien"} 
                                                        className={`w-full bg-white border-2 px-4 py-2 pl-12 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300 transition-all ${
                                                            userType === 'parent' ? 'border-slate-100 focus:border-emerald-500' 
                                                            : userType === 'ecole' ? 'border-slate-100 focus:border-indigo-500'
                                                            : 'border-slate-100 focus:border-amber-500'
                                                        }`} 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-0.5"><label className="text-[11px] font-black uppercase text-slate-950 px-1 flex justify-between">Pseudo {username.length >= 3 && <span className={usernameAvailable ? 'text-green-600' : 'text-red-600'}>{usernameAvailable ? '✓' : '✗'}</span>}</label>
                                                <div className="relative group"><Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="text" name="username" autoComplete="none" readOnly onFocus={(e) => e.target.removeAttribute('readonly')} required value={username} onChange={(e) => setUsername(e.target.value)} placeholder="mourad_213" className={`w-full bg-white border-2 p-2 pl-12 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300 ${usernameAvailable === false ? 'border-red-100' : 'border-slate-100 focus:border-slate-950'}`} /></div>
                                            </div>
                                            <div className="space-y-0.5"><label className="text-[11px] font-black uppercase text-slate-950 px-1">E-mail</label>
                                                <div className="relative group"><Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type="email" name="email" autoComplete="none" readOnly onFocus={(e) => e.target.removeAttribute('readonly')} required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="mourad@gmail.com" className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-4 py-2 pl-12 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300" /></div>
                                            </div>
                                            <div className="space-y-0.5">
                                            <label className="text-[11px] font-black uppercase text-slate-950 px-1">Téléphone</label>
                                            <div className="flex gap-2">
                                                <div className="relative group min-w-[90px]">
                                                    <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                                                        <span className="text-base">{selectedCountry.flag}</span>
                                                    </div>
                                                    <select 
                                                        value={selectedCountry.code}
                                                        onChange={(e) => {
                                                            const c = COUNTRIES.find(curr => curr.code === e.target.value);
                                                            if(c) setSelectedCountry(c);
                                                        }}
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 py-2 pl-8 pr-1 rounded-xl outline-none font-bold text-slate-950 text-[10px] appearance-none cursor-pointer"
                                                    >
                                                        {COUNTRIES.map(c => (
                                                            <option key={c.code} value={c.code}>{c.dial}</option>
                                                        ))}
                                                    </select>
                                                    <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                                </div>
                                                <div className="relative group flex-1">
                                                    <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input 
                                                        type="tel" 
                                                        name="phone" 
                                                        autoComplete="none" 
                                                        readOnly 
                                                        onFocus={(e) => e.target.removeAttribute('readonly')} 
                                                        value={phone} 
                                                        onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                                                        placeholder="550 12 34 56" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-4 py-2 pl-12 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                            <div className="space-y-1"><label className="text-[11px] font-black uppercase text-slate-950 px-1">Mot de passe</label>
                                                <div className="relative group"><Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /><input type={showPassword ? "text" : "password"} name="password" autoComplete="new-password" required value={password} onFocus={() => setIsPasswordFocused(true)} onBlur={() => setIsPasswordFocused(false)} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-4 py-2 pl-12 pr-12 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300" /><button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button></div>
                                                <AnimatePresence>
                                                    {(isPasswordFocused || password.length > 0) && (
                                                        <motion.div initial={{ height: 0, opacity: 0, y: -10 }} animate={{ height: 'auto', opacity: 1, y: 0 }} exit={{ height: 0, opacity: 0, y: -10 }} className="overflow-hidden">
                                                            <div className="px-3 py-1.5 mt-1 bg-slate-50 border border-slate-100 rounded-2xl space-y-1.5">
                                                                <div className="flex gap-1 h-1 mb-0.5">
                                                                    {[1, 2, 3, 4].map((i) => (
                                                                        <div key={i} className={`flex-1 rounded-full transition-all duration-500 ${strength >= i ? (strength <= 2 ? 'bg-red-500' : strength === 3 ? 'bg-orange-500' : 'bg-green-500') : 'bg-slate-200'}`} />
                                                                    ))}
                                                                </div>
                                                                <div className="grid grid-cols-2 gap-y-1 gap-x-3">
                                                                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase transition-all duration-300 ${password.length >= 8 ? 'text-indigo-600' : 'text-slate-500'}`}>
                                                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${password.length >= 8 ? 'bg-indigo-600 border-indigo-600 text-white shadow-md' : 'bg-white border-slate-200'}`}>
                                                                            {password.length >= 8 ? <span className="text-[6px]">✓</span> : <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />}
                                                                        </div> 
                                                                        8 Caract.
                                                                    </div>
                                                                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase transition-all duration-300 ${/[A-Z]/.test(password) ? 'text-emerald-600' : 'text-slate-500'}`}>
                                                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${/[A-Z]/.test(password) ? 'bg-emerald-600 border-emerald-600 text-white shadow-md' : 'bg-white border-slate-200'}`}>
                                                                            {/[A-Z]/.test(password) ? <span className="text-[6px]">✓</span> : <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />}
                                                                        </div> 
                                                                        Majuscule
                                                                    </div>
                                                                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase transition-all duration-300 ${/[0-9]/.test(password) ? 'text-amber-600' : 'text-slate-500'}`}>
                                                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${/[0-9]/.test(password) ? 'bg-amber-600 border-amber-600 text-white shadow-md' : 'bg-white border-slate-200'}`}>
                                                                            {/[0-9]/.test(password) ? <span className="text-[6px]">✓</span> : <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />}
                                                                        </div> 
                                                                        Chiffre
                                                                    </div>
                                                                    <div className={`flex items-center gap-2 text-[9px] font-black uppercase transition-all duration-300 ${/[@$!%*?&#]/.test(password) ? 'text-rose-600' : 'text-slate-500'}`}>
                                                                        <div className={`w-3 h-3 rounded-full border flex items-center justify-center transition-all ${/[@$!%*?&#]/.test(password) ? 'bg-rose-600 border-rose-600 text-white shadow-md' : 'bg-white border-slate-200'}`}>
                                                                            {/[@$!%*?&#]/.test(password) ? <span className="text-[6px]">✓</span> : <span className="w-0.5 h-0.5 bg-slate-200 rounded-full" />}
                                                                        </div> 
                                                                        Spécial
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                            <div className="space-y-0.5">
                                                <label className="text-[11px] font-black uppercase text-slate-950 px-1">Confirmation</label>
                                                <div className="relative group">
                                                    <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input 
                                                        type={showPassword ? "text" : "password"} 
                                                        name="confirmPassword" 
                                                        autoComplete="new-password" 
                                                        required 
                                                        value={confirmPassword} 
                                                        onChange={(e) => setConfirmPassword(e.target.value)} 
                                                        placeholder="••••••••" 
                                                        className={`w-full bg-white border-2 p-2 pl-12 pr-12 rounded-xl outline-none font-bold text-slate-950 text-xs placeholder:text-slate-300 transition-all ${confirmPassword ? (password === confirmPassword ? 'border-emerald-500 bg-emerald-50/30' : 'border-rose-300 bg-rose-50/30') : 'border-slate-100 focus:border-slate-950'}`} 
                                                    />
                                                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-900 transition-colors">{showPassword ? <EyeOff size={16} /> : <Eye size={16} />}</button>
                                                </div>
                                                
                                                <AnimatePresence>
                                                    {confirmPassword && (
                                                        <motion.div 
                                                            initial={{ opacity: 0, y: -5 }} 
                                                            animate={{ opacity: 1, y: 0 }} 
                                                            exit={{ opacity: 0, y: -5 }}
                                                            className={`text-[10px] font-black uppercase px-2 mt-1 flex items-center gap-1.5 ${password === confirmPassword ? 'text-emerald-600' : 'text-rose-600'}`}
                                                        >
                                                            {password === confirmPassword ? (
                                                                <><div className="w-1.5 h-1.5 bg-emerald-600 rounded-full animate-pulse" /> Correspondance parfaite</>
                                                            ) : (
                                                                <><div className="w-1.5 h-1.5 bg-rose-600 rounded-full" /> Mots de passe différents</>
                                                            )}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                        <div className="pt-2 flex justify-end">
                                            <button type="button" onClick={handleNext} className="w-full sm:w-auto px-10 bg-slate-950 text-white py-2.5 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                                Suivant <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && userType === 'parent' && (
                                    <motion.div key="step2-parent" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex-1 flex flex-col justify-center">
                                        <div className="bg-slate-50/50 border-2 border-slate-50 rounded-[2.5rem] p-8 space-y-5 text-center">
                                            <div className="w-16 h-16 bg-orange-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                                <Users className="text-orange-600 w-8 h-8" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter">Votre Allié Éducatif</h3>
                                                <p className="text-slate-500 font-bold text-sm leading-relaxed max-w-[400px] mx-auto italic">
                                                    L'éducation est un sport d'équipe. Invitez la personne qui vous épaule (conjoint, aîné, oncle...) pour synchroniser vos efforts.
                                                </p>
                                            </div>
                                            
                                            <div className="space-y-3 max-w-sm mx-auto">
                                                <div className="relative group">
                                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                                    <input 
                                                        type="text" 
                                                        value={spouseFirstName} 
                                                        onChange={(e) => setSpouseFirstName(e.target.value)} 
                                                        placeholder="Ex: Mourad ou Nadia" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-orange-500 px-4 py-3 pl-11 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-orange-500 transition-colors" />
                                                    <input 
                                                        type="email" 
                                                        value={spouseEmail} 
                                                        onChange={(e) => setSpouseEmail(e.target.value)} 
                                                        placeholder="Email de votre allié (Optionnel)" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-orange-500 px-4 py-3 pl-11 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-center pt-2">
                                            <button type="button" onClick={() => setStep(1)} className="p-3 border-2 border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm"><ArrowLeft size={18} /></button>
                                            <button type="button" onClick={handleNext} className="px-12 bg-slate-950 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                                Etape Suivante <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && userType === 'ecole' && (
                                    <motion.div key="step2-ecole" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 flex-1 flex flex-col justify-center">
                                        <div className="bg-slate-50/50 border-2 border-slate-50 rounded-[2.5rem] p-8 space-y-5 text-center">
                                            <div className="w-16 h-16 bg-indigo-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                                <School className="text-indigo-600 w-8 h-8" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter font-jakarta">Identité de l'Établissement</h3>
                                                <p className="text-slate-500 font-bold text-xs leading-relaxed max-w-[400px] mx-auto italic">
                                                    Configurez les informations officielles de votre école primaire pour sceller notre partenariat éducatif.
                                                </p>
                                            </div>
                                            
                                            <div className="space-y-3 max-w-sm mx-auto">
                                                <div className="grid grid-cols-2 gap-3">
                                                    <button type="button" onClick={() => setChildRegion('Privée')} className={`py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${childRegion === 'Privée' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400'}`}>École Privée</button>
                                                    <button type="button" onClick={() => setChildRegion('Publique')} className={`py-3 rounded-xl border-2 font-black text-[10px] uppercase transition-all ${childRegion === 'Publique' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg scale-105' : 'bg-white border-slate-100 text-slate-400'}`}>École Publique</button>
                                                </div>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                                    <input 
                                                        type="text" 
                                                        value={childSchool} 
                                                        onChange={(e) => setChildSchool(e.target.value)} 
                                                        placeholder="Adresse complète du siège" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 px-4 py-3 pl-11 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-indigo-500 transition-colors" />
                                                    <input 
                                                        type="text" 
                                                        value={spouseFirstName} 
                                                        onChange={(e) => setSpouseFirstName(e.target.value)} 
                                                        placeholder="Nom du Responsable / Directeur" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 px-4 py-3 pl-11 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-center pt-2">
                                            <button type="button" onClick={() => setStep(1)} className="p-3 border-2 border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm"><ArrowLeft size={18} /></button>
                                            <button type="button" onClick={handleNext} className="px-12 bg-slate-950 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-indigo-600 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                                Etape Suivante <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 2 && userType === 'ong' && (
                                    <motion.div key="step2-ong" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-5 flex-1 flex flex-col justify-center">
                                        <div className="bg-amber-50/30 border-2 border-amber-50 rounded-[2.5rem] p-8 space-y-5 text-center">
                                            <div className="w-16 h-16 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto shadow-sm">
                                                <Heart className="text-amber-600 w-8 h-8" />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter font-jakarta">Engagement Solidaire</h3>
                                                <p className="text-slate-500 font-bold text-xs leading-relaxed max-w-[400px] mx-auto italic">
                                                    Définissez le périmètre de votre mission humanitaire pour une synergie parfaite.
                                                </p>
                                            </div>
                                            
                                            <div className="space-y-3 max-w-sm mx-auto">
                                                <div className="relative group">
                                                    <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                                    <select 
                                                        value={childLevel} 
                                                        onChange={(e) => setChildLevel(e.target.value)}
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-amber-500 px-4 py-3 pl-11 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all appearance-none cursor-pointer"
                                                    >
                                                        <option value="" disabled>Domaine d'Action</option>
                                                        <option value="Education">Éducation & Soutien</option>
                                                        <option value="Social">Inclusion Sociale</option>
                                                        <option value="Culture">Culture & Éveil</option>
                                                        <option value="Humanitaire">Humanitaire Global</option>
                                                    </select>
                                                </div>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                                    <input 
                                                        type="text" 
                                                        value={childSchool} 
                                                        onChange={(e) => setChildSchool(e.target.value)} 
                                                        placeholder="Adresse du Siège Social" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-amber-500 px-4 py-3 pl-11 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                                <div className="relative group">
                                                    <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300 group-focus-within:text-amber-500 transition-colors" />
                                                    <input 
                                                        type="text" 
                                                        value={spouseFirstName} 
                                                        onChange={(e) => setSpouseFirstName(e.target.value)} 
                                                        placeholder="Responsable de l'ONG" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-amber-500 px-4 py-3 pl-11 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="flex gap-3 justify-center pt-2">
                                            <button type="button" onClick={() => setStep(1)} className="p-3 border-2 border-slate-100 rounded-xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm"><ArrowLeft size={18} /></button>
                                            <button type="button" onClick={handleNext} className="px-12 bg-slate-950 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[9px] hover:bg-amber-600 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                                Etape Suivante <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && userType === 'parent' && (
                                    <motion.div key="step3-parent" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 flex-1">
                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">Prénom de l'enfant</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                                        <User className="w-4 h-4" />
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        value={childName} 
                                                        onChange={(e) => setChildName(e.target.value)} 
                                                        placeholder="Ex: Yasmine ou Adam" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-emerald-500 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all placeholder:text-slate-300" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">Âge</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                                        <Smartphone className="w-4 h-4" />
                                                    </div>
                                                    <input 
                                                        type="number" 
                                                        min="3" 
                                                        max="15" 
                                                        value={childAge} 
                                                        onChange={(e) => setChildAge(e.target.value)} 
                                                        placeholder="Ex: 8" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-emerald-500 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all placeholder:text-slate-300" 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-4">
                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">Niveau</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                                        <Sparkles className="w-4 h-4" />
                                                    </div>
                                                    <select 
                                                        value={childLevel} 
                                                        onChange={(e) => setChildLevel(e.target.value)}
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-emerald-500 px-4 py-3 pl-12 rounded-2xl outline-none font-black text-slate-950 text-xs shadow-sm transition-all appearance-none cursor-pointer font-jakarta uppercase tracking-tighter"
                                                    >
                                                        {currentLevels.map(lvl => <option key={lvl} value={lvl}>{lvl}</option>)}
                                                    </select>
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">Établissement</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-500 transition-colors">
                                                        <School className="w-4 h-4" />
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        value={childSchool} 
                                                        onChange={(e) => setChildSchool(e.target.value)} 
                                                        placeholder="Ex: École El-Nadjah" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-emerald-500 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all placeholder:text-slate-300" 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* CRYSTAL SECURITY VAULT (Captcha) */}
                                        <div className="relative mt-1">
                                            <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1 mb-2 block">Vérification de Sécurité</label>
                                            <div className="bg-emerald-50/40 rounded-[2rem] p-5 border-2 border-emerald-100/50 shadow-inner relative overflow-hidden group">
                                                <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                                                    <div className="relative">
                                                        <div className="bg-white p-3 rounded-2xl border border-emerald-200 shadow-sm flex items-center justify-center min-w-[140px]">
                                                            <div className="scale-90 contrast-125 rounded-lg overflow-hidden">
                                                                <LoadCanvasTemplateNoReload />
                                                            </div>
                                                        </div>
                                                        <button 
                                                            type="button" 
                                                            onClick={() => loadCaptchaEnginge(6)} 
                                                            className="absolute -right-2 -top-2 bg-emerald-600 text-white p-1.5 rounded-full shadow-lg hover:bg-emerald-500 transition-all hover:rotate-180 duration-500"
                                                        >
                                                            <RefreshCcw className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    
                                                    <div className="flex-1 w-full space-y-2">
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-emerald-600 transition-colors">
                                                                <ShieldCheck className="w-4 h-4" />
                                                            </div>
                                                            <input 
                                                                type="text" 
                                                                placeholder="Entrez le code" 
                                                                value={captchaValue} 
                                                                onChange={(e) => setCaptchaValue(e.target.value)}
                                                                className="w-full bg-white border-2 border-emerald-100 focus:border-emerald-500 px-4 py-3 pl-11 rounded-xl outline-none font-black text-slate-950 text-sm transition-all tracking-[0.3em] placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-400 shadow-sm" 
                                                            />
                                                        </div>
                                                        <p className="text-[9px] font-bold text-emerald-600 uppercase tracking-tighter px-1 flex items-center gap-1.5">
                                                            <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> Système Anti-Robot Sécurisé
                                                        </p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-center pt-3">
                                            <button type="button" onClick={() => setStep(2)} className="px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
                                                <ArrowLeft size={20} />
                                            </button>
                                            <button type="submit" disabled={isSubmitting} className="px-12 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-emerald-600 transition-all shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-50 relative overflow-hidden">
                                                {isSubmitting ? (
                                                    <RefreshCcw className="w-4 h-4 animate-spin text-emerald-400" />
                                                ) : (
                                                    <>
                                                        Finaliser l'Inscription
                                                        <Sparkles className="w-4 h-4 text-emerald-400 group-hover:scale-125 transition-transform" />
                                                    </>
                                                )}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && userType === 'ecole' && (
                                    <motion.div key="step3-ecole" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 flex-1">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">Présence Digitale</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        value={childName} 
                                                        onChange={(e) => setChildName(e.target.value)} 
                                                        placeholder="Site Web ou Page Facebook (Ex: fb.com/ecole...)" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">Dimension de l'École</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-500 transition-colors">
                                                        <Sparkles className="w-4 h-4" />
                                                    </div>
                                                    <input 
                                                        type="number" 
                                                        value={childAge} 
                                                        onChange={(e) => setChildAge(e.target.value)} 
                                                        placeholder="Nombre de classes primaires" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-indigo-500 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* CRYSTAL SECURITY VAULT (Indigo Version) */}
                                        <div className="relative mt-1">
                                            <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1 mb-2 block">Vérification Institutionnelle</label>
                                            <div className="bg-indigo-50/40 rounded-[2rem] p-5 border-2 border-indigo-100/50 shadow-inner relative overflow-hidden">
                                                <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                                                    <div className="relative">
                                                        <div className="bg-white p-3 rounded-2xl border border-indigo-200 shadow-sm flex items-center justify-center min-w-[140px]">
                                                            <div className="scale-90 contrast-125 rounded-lg overflow-hidden">
                                                                <LoadCanvasTemplateNoReload />
                                                            </div>
                                                        </div>
                                                        <button type="button" onClick={() => loadCaptchaEnginge(6)} className="absolute -right-2 -top-2 bg-indigo-600 text-white p-1.5 rounded-full shadow-lg hover:bg-indigo-500 transition-all hover:rotate-180 duration-500"><RefreshCcw className="w-3 h-3" /></button>
                                                    </div>
                                                    <div className="flex-1 w-full space-y-2">
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-indigo-600 transition-colors"><ShieldCheck className="w-4 h-4" /></div>
                                                            <input type="text" placeholder="Entrez le code" value={captchaValue} onChange={(e) => setCaptchaValue(e.target.value)} className="w-full bg-white border-2 border-indigo-100 focus:border-indigo-500 px-4 py-3 pl-11 rounded-xl outline-none font-black text-slate-950 text-sm transition-all tracking-[0.3em] placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-400 shadow-sm" />
                                                        </div>
                                                        <p className="text-[9px] font-bold text-indigo-600 uppercase tracking-tighter px-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-indigo-500 rounded-full animate-pulse" /> Accès Institutionnel Sécurisé</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-center pt-3">
                                            <button type="button" onClick={() => setStep(2)} className="px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center"><ArrowLeft size={20} /></button>
                                            <button type="submit" disabled={isSubmitting} className="px-12 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-indigo-600 transition-all shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-50">
                                                {isSubmitting ? <RefreshCcw className="w-4 h-4 animate-spin text-indigo-400" /> : "Enregistrer l'Établissement"}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}

                                {step === 3 && userType === 'ong' && (
                                    <motion.div key="step3-ong" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 flex-1">
                                        <div className="grid grid-cols-1 gap-3">
                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">Rayonnement & Impact</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                                                        <Globe className="w-4 h-4" />
                                                    </div>
                                                    <input 
                                                        type="text" 
                                                        value={childName} 
                                                        onChange={(e) => setChildName(e.target.value)} 
                                                        placeholder="Site Web ou Profil Social" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-amber-500 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">Nombre de Bénéficiaires</label>
                                                <div className="relative group">
                                                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-500 transition-colors">
                                                        <Users className="w-4 h-4" />
                                                    </div>
                                                    <input 
                                                        type="number" 
                                                        value={childAge} 
                                                        onChange={(e) => setChildAge(e.target.value)} 
                                                        placeholder="Estimation des enfants soutenus" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-amber-500 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        {/* CRYSTAL SECURITY VAULT (Amber Version) */}
                                        <div className="relative mt-1">
                                            <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1 mb-2 block">Vérification de l'Organisation</label>
                                            <div className="bg-amber-50/40 rounded-[2rem] p-5 border-2 border-amber-100/50 shadow-inner relative overflow-hidden">
                                                <div className="flex flex-col sm:flex-row items-center gap-5 relative z-10">
                                                    <div className="relative">
                                                        <div className="bg-white p-3 rounded-2xl border border-amber-200 shadow-sm flex items-center justify-center min-w-[140px]">
                                                            <div className="scale-90 contrast-125 rounded-lg overflow-hidden">
                                                                <LoadCanvasTemplateNoReload />
                                                            </div>
                                                        </div>
                                                        <button type="button" onClick={() => loadCaptchaEnginge(6)} className="absolute -right-2 -top-2 bg-amber-600 text-white p-1.5 rounded-full shadow-lg hover:bg-amber-500 transition-all hover:rotate-180 duration-500"><RefreshCcw className="w-3 h-3" /></button>
                                                    </div>
                                                    <div className="flex-1 w-full space-y-2">
                                                        <div className="relative group">
                                                            <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none text-slate-400 group-focus-within:text-amber-600 transition-colors"><ShieldCheck className="w-4 h-4" /></div>
                                                            <input type="text" placeholder="Entrez le code" value={captchaValue} onChange={(e) => setCaptchaValue(e.target.value)} className="w-full bg-white border-2 border-amber-100 focus:border-amber-500 px-4 py-3 pl-11 rounded-xl outline-none font-black text-slate-950 text-sm transition-all tracking-[0.3em] placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-400 shadow-sm" />
                                                        </div>
                                                        <p className="text-[9px] font-bold text-amber-600 uppercase tracking-tighter px-1 flex items-center gap-1.5"><span className="w-1.5 h-1.5 bg-amber-500 rounded-full animate-pulse" /> Protection Humanitaire Activée</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>

                                        <div className="flex gap-3 justify-center pt-3">
                                            <button type="button" onClick={() => setStep(2)} className="px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center"><ArrowLeft size={20} /></button>
                                            <button type="submit" disabled={isSubmitting} className="px-12 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-amber-600 transition-all shadow-2xl flex items-center justify-center gap-3 group disabled:opacity-50">
                                                {isSubmitting ? <RefreshCcw className="w-4 h-4 animate-spin text-amber-400" /> : "Enregistrer l'Organisation"}
                                            </button>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="mt-2 text-center space-y-1">
                                <p className="text-[10px] font-bold text-slate-500 leading-tight px-12">
                                    En continuant, vous acceptez nos <Link href={`/${locale}/terms`} className="text-orange-600 hover:underline">conditions</Link> et notre <Link href={`/${locale}/privacy`} className="text-teal-600 hover:underline font-bold">politique</Link>.
                                </p>
                                <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">
                                    {t('Auth.AlreadyHaveAccount')} <Link href={`/${locale}/auth/login`} className="text-orange-600 hover:underline font-black">{t('Auth.Login')}</Link>
                                </p>
                            </div>
                        </form>
                    </div>
                </motion.div>
                </div>
            </div>
        </div>
    );
}

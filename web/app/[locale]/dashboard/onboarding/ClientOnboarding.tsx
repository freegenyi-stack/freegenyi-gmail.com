"use client";

import { Link } from "@/i18n/routing";
import React, { useState, useEffect, Suspense } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
    User, Smartphone, Mail, ArrowRight, ArrowLeft, 
    Sparkles, RefreshCcw, ShieldCheck, Users, 
    School, Globe, MapPin, UserCheck, Heart, Target,
    ChevronDown, Lock, Eye, EyeOff
} from "lucide-react";
import { useSession } from "next-auth/react";
import { useRegion } from "@/context/RegionContext";
import { useRouter, useSearchParams } from "next/navigation";
import { submitOnboardingAction } from "@/lib/actions/onboarding";
import { checkUserAvailability } from "@/lib/actions/auth_elite";
import { REGIONS } from "@/constants/regions";
import Image from "next/image";

import Lottie from "lottie-react";
import chatCurieux from "@/../public/assets/animations/chat_curieux.json";
import { cn, getLocalizedLevel } from "@/lib/utils";
import { loadCaptchaEnginge, LoadCanvasTemplateNoReload, validateCaptcha } from 'react-simple-captcha';
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import SchoolPicker from "@/components/SchoolPicker";

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
    { name: 'Sénégal', code: 'SN', flag: '🇸🇳', dial: '+221' },
    { name: 'Côte d\'Ivoire', code: 'CI', flag: '🇨🇮', dial: '+225' },
    { name: 'Mali', code: 'ML', flag: '🇲🇱', dial: '+223' },
    { name: 'Autre', code: 'INT', flag: '🌍', dial: '+' }
];

function OnboardingContent({ locale }: { locale: string }) {
    const t = useTranslations();
    const { data: session, status } = useSession();
    const { selectedCountry: regionCountry, selectedLang } = useRegion();
    const router = useRouter();
    const searchParams = useSearchParams();
    
    const initialStep = parseInt(searchParams.get('step') || '1');
    const initialType = searchParams.get('type') || "parent";

    const [step, setStep] = useState(initialStep);
    const [userType, setUserType] = useState(initialType);
    const [role, setRole] = useState("Parent"); 
    
    // Nouveaux champs pour l'étape 1 (Google Onboarding)
    const [fullName, setFullName] = useState("");
    const [username, setUsername] = useState("");
    const [email, setEmail] = useState("");
    const [usernameAvailable, setUsernameAvailable] = useState<boolean | null>(null);
    
    const [phone, setPhone] = useState("");
    const [spouseEmail, setSpouseEmail] = useState("");
    const [spouseFirstName, setSpouseFirstName] = useState("");
    
    const [childName, setChildName] = useState("");
    const [childCountry, setChildCountry] = useState(regionCountry || "DZ");
    const [childLevel, setChildLevel] = useState("");
    const [childAge, setChildAge] = useState("");
    const [childRegion, setChildRegion] = useState("");
    const [childSchool, setChildSchool] = useState("");
    const [selectedSchool, setSelectedSchool] = useState<{ id: number; name: string } | null>(null);

    const [selectedCountryCode, setSelectedCountryCode] = useState(COUNTRIES.find(c => c.code === (regionCountry || 'DZ')) || COUNTRIES[0]);

    const [isSubmitting, setIsSubmitting] = useState(false);
    const [captchaValue, setCaptchaValue] = useState("");

    const firstName = session?.user?.name?.split(" ")[0] || "Elite";

    // Pré-remplissage avec les données de Google
    useEffect(() => {
        if (session?.user) {
            if (!fullName && session.user.name) setFullName(session.user.name);
            if (!email && session.user.email) setEmail(session.user.email);
            if (!username && session.user.email) setUsername(session.user.email.split("@")[0] + Math.floor(Math.random() * 1000));
        }
    }, [session]);

    useEffect(() => {
        if (step === 3) {
            const timer = setTimeout(() => {
                try {
                    loadCaptchaEnginge(6, '#f8fafc', '#0f172a', 'numbers');
                } catch (e) {
                    console.warn("Captcha loading delayed");
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
        // Skip all validation in development mode
        const isDev = process.env.NODE_ENV === 'development';
        if (isDev && step === 1) {
            const randomId = Math.floor(Math.random() * 10000);
            if (!fullName || !fullName.trim()) setFullName("Testeur FreeGeny");
            if (!username || !username.trim()) setUsername(`testeur_${randomId}`);
        } else if (!isDev && step === 1) {
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
        }
        setStep(step + 1);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        // Skip captcha in dev mode for easier testing
        const isDev = process.env.NODE_ENV === 'development';
        if (!isDev && !validateCaptcha(captchaValue)) {
            toast.error("Code de sécurité incorrect.");
            setCaptchaValue("");
            return;
        }

        setIsSubmitting(true);
        const formData = new FormData();
        formData.append("user_type", userType);
        formData.append("parent_role", role);
        formData.append("full_name", fullName || "Testeur FreeGeny");
        formData.append("username", username || `testeur_${Math.floor(Math.random() * 10000)}`);
        formData.append("phone", phone);
        formData.append("spouse_email", spouseEmail || spouseFirstName); 
        formData.append("child_name", childName || "Yasmine");
        formData.append("child_country", childCountry);
        formData.append("child_level", childLevel || currentLevels[0]);
        formData.append("child_age", childAge || "8");
        formData.append("child_school", selectedSchool?.name || childSchool);
        if (selectedSchool) formData.append("child_school_id", String(selectedSchool.id));
        formData.append("child_region", childRegion);

        const result = await submitOnboardingAction(formData);
        if (result.success) {
            toast.success("Profil Elite activé !");
            router.push(`/${locale}/dashboard/${userType}`);
        } else {
            toast.error(result.error);
            setIsSubmitting(false);
        }
    };

    const bgImage = `/assets/img/regions/${regionCountry.toLowerCase()}/${selectedLang}/hero.png`;

    if (status === "loading") return <div className="h-screen bg-slate-950 flex items-center justify-center text-white font-black uppercase tracking-widest italic animate-pulse">Initialisation Elite...</div>;

    return (
        <div className="h-[100dvh] w-full flex items-center justify-center p-4 sm:p-6 lg:p-8 relative font-dm-sans overflow-hidden bg-slate-900">
            
            <div className="absolute inset-0 z-0">
                <Image src={bgImage} alt="Background" fill className="object-cover opacity-60" priority onError={(e) => { (e.target as any).src = "/assets/img/hero_elite.png"; }} />
                <div className="absolute inset-0 bg-slate-950/40"></div>
            </div>

            <div className="w-full max-w-[1300px] flex flex-col lg:flex-row items-center justify-center gap-12 relative z-10 h-full max-h-[750px] mt-2.5">
                
                {/* Left Side: Inspiration */}
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

                {/* Right Side: Form Cockpit */}
                <div className="w-full lg:w-[65%] flex items-center justify-center p-4 overflow-visible relative">
                    <motion.div layout className="bg-white rounded-[2.5rem] shadow-2xl border border-slate-200 p-5 sm:p-7 relative w-full max-w-[650px] max-h-[90vh] flex flex-col z-10 overflow-visible">
                        
                        {/* INTERNAL CURIOUS CAT */}
                        <div className="absolute bottom-4 left-4 w-[100px] h-[180px] overflow-hidden pointer-events-none z-0 opacity-80">
                            <div className="absolute inset-0 translate-y-10 scale-[1.2]">
                                <Lottie animationData={chatCurieux} loop={true} className="w-full h-full" />
                            </div>
                        </div>

                        {/* ATTENTION GRABBER */}
                        {step === 1 && (
                            <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2 }} className="absolute -right-[110px] -top-12 hidden xl:block w-[180px] pointer-events-none z-50">
                                <style dangerouslySetInnerHTML={{ __html: handwrittenFont }} />
                                <div className="relative">
                                    <span style={{ fontFamily: "'Caveat', cursive" }} className="text-2xl text-white drop-shadow-lg block -rotate-3 text-right">
                                        Choisissez votre rôle
                                    </span>
                                </div>
                            </motion.div>
                        )}

                        {/* NOTEBOOK TABS */}
                        <div className="absolute -right-36 top-4 flex flex-col gap-2 hidden lg:flex z-[100]">
                            {[
                                { id: 'parent', label: 'Parents', icon: Users, color: 'emerald', delay: 0.2 },
                                { id: 'ecole', label: 'École', icon: School, color: 'indigo', delay: 0.3 },
                                { id: 'ong', label: 'ONG', icon: Globe, color: 'amber', delay: 0.4 },
                            ].map((r) => {
                                const isActive = userType === r.id;
                                return (
                                    <motion.button
                                        key={r.id}
                                        initial={{ x: 100, opacity: 0 }} animate={{ x: isActive ? 32 : 0, opacity: 1 }}
                                        transition={{ delay: r.delay, type: "spring", stiffness: 100, damping: 15 }}
                                        whileHover={{ scale: 1.05, x: isActive ? 35 : 5 }}
                                        type="button"
                                        onClick={() => setUserType(r.id)}
                                        className={`relative flex items-center gap-3 h-14 rounded-2xl border-2 transition-all duration-500 group shadow-2xl ${
                                            isActive 
                                            ? r.color === 'emerald' ? 'bg-emerald-500 border-emerald-400 text-white w-[170px]' 
                                              : r.color === 'indigo' ? 'bg-indigo-500 border-indigo-400 text-white w-[170px]'
                                              : 'bg-amber-500 border-amber-400 text-white w-[170px]'
                                            : 'bg-white/95 backdrop-blur-sm border-slate-200 text-slate-400 hover:border-orange-200 w-[65px]'
                                        }`}
                                    >
                                        {isActive && (
                                            <div className={`absolute inset-0 rounded-2xl blur-xl opacity-40 animate-pulse -z-10 ${
                                                r.color === 'emerald' ? 'bg-emerald-400' : r.color === 'indigo' ? 'bg-indigo-400' : 'bg-amber-400'
                                            }`}></div>
                                        )}
                                        <r.icon className={`w-6 h-6 shrink-0 transition-transform ${isActive ? 'scale-110 ml-3' : 'ml-3 scale-90 opacity-40'}`} />
                                        <span className={`text-[11px] font-black uppercase tracking-widest whitespace-nowrap transition-all duration-500 ${isActive ? 'opacity-100' : 'opacity-0'}`}>
                                            {r.label}
                                        </span>
                                        {!isActive && <div className="absolute right-2 w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-orange-400 transition-colors"></div>}
                                    </motion.button>
                                );
                            })}
                        </div>

                        {/* COMPACT TABS */}
                        <div className="flex gap-2 mb-3 lg:hidden justify-center relative z-20">
                            {[
                                { id: 'parent', label: 'PAR', icon: Users, color: 'emerald' },
                                { id: 'ecole', label: 'ECO', icon: School, color: 'indigo' },
                                { id: 'ong', label: 'ONG', icon: Globe, color: 'amber' },
                            ].map((r) => (
                                <button
                                    key={r.id} type="button" onClick={() => setUserType(r.id)}
                                    className={`flex items-center gap-2 px-3 py-1.5 rounded-full border-2 transition-all ${
                                        userType === r.id 
                                        ? r.color === 'emerald' ? 'border-emerald-500 bg-emerald-50 text-emerald-600' 
                                          : r.color === 'indigo' ? 'border-indigo-500 bg-indigo-50 text-indigo-600'
                                          : 'border-amber-500 bg-amber-50 text-amber-600'
                                        : 'border-slate-100 bg-white text-slate-400'
                                    }`}
                                >
                                    <r.icon className="w-3.5 h-3.5" />
                                    <span className="text-[9px] font-black uppercase tracking-tighter">{r.label}</span>
                                </button>
                            ))}
                        </div>

                        <div className="flex-1 overflow-y-auto scrollbar-hide flex flex-col relative z-20">
                            <div className="mb-3 flex justify-between items-center">
                                <Link href="/" className="flex items-center gap-3 group">
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

                            <form onSubmit={handleSubmit} className="flex-1 flex flex-col relative">
                                <AnimatePresence mode="wait">
                                    {step === 1 && (
                                        <motion.div key="step1" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 flex-1 flex flex-col justify-center max-w-[500px] mx-auto w-full">
                                            
                                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-950 px-1">
                                                        {userType === 'parent' ? "Nom Complet" : userType === 'ecole' ? "Nom de l'Établissement" : "Nom de l'Organisation"}
                                                    </label>
                                                    <div className="relative group">
                                                        {userType === 'parent' ? <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /> 
                                                         : userType === 'ecole' ? <School className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                         : <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                                                        <input 
                                                            type="text" 
                                                            required 
                                                            value={fullName} 
                                                            onChange={(e) => setFullName(e.target.value)} 
                                                            className={`w-full bg-white border-2 px-3 py-2.5 pl-10 rounded-xl outline-none font-bold text-slate-950 text-xs transition-all ${
                                                                userType === 'parent' ? 'border-slate-100 focus:border-emerald-500' 
                                                                : userType === 'ecole' ? 'border-slate-100 focus:border-indigo-500'
                                                                : 'border-slate-100 focus:border-amber-500'
                                                            }`} 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-950 px-1 flex justify-between">
                                                        Pseudo {username.length >= 3 && <span className={usernameAvailable ? 'text-green-600' : 'text-red-600'}>{usernameAvailable ? '✓' : '✗'}</span>}
                                                    </label>
                                                    <div className="relative group">
                                                        <Sparkles className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input 
                                                            type="text" 
                                                            required 
                                                            value={username} 
                                                            onChange={(e) => setUsername(e.target.value)} 
                                                            className={`w-full bg-white border-2 px-3 py-2.5 pl-10 rounded-xl outline-none font-bold text-slate-950 text-xs transition-all ${usernameAvailable === false ? 'border-red-100' : 'border-slate-100 focus:border-slate-950'}`} 
                                                        />
                                                    </div>
                                                </div>
                                                
                                                {/* LOCKED FIELDS FROM GOOGLE */}
                                                <div className="space-y-1 sm:col-span-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-500 px-1 flex justify-between items-center">
                                                        E-mail <Lock className="w-3 h-3 text-orange-500" />
                                                    </label>
                                                    <div className="relative group">
                                                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input 
                                                            type="email" 
                                                            disabled
                                                            value={email} 
                                                            className="w-full bg-slate-50 border-2 border-slate-100 px-3 py-2.5 pl-10 rounded-xl outline-none font-bold text-slate-400 text-xs cursor-not-allowed" 
                                                        />
                                                    </div>
                                                </div>
                                                
                                                <div className="space-y-1 sm:col-span-2">
                                                    <label className="text-[10px] font-black uppercase text-slate-950 px-1">Téléphone Principal</label>
                                                    <div className="flex gap-2">
                                                        <div className="relative group min-w-[90px]">
                                                            <div className="absolute left-2.5 top-1/2 -translate-y-1/2 flex items-center gap-1 pointer-events-none">
                                                                <span className="text-sm">{selectedCountryCode.flag}</span>
                                                            </div>
                                                            <select 
                                                                value={selectedCountryCode.code}
                                                                onChange={(e) => {
                                                                    const c = COUNTRIES.find(curr => curr.code === e.target.value);
                                                                    if(c) setSelectedCountryCode(c);
                                                                }}
                                                                className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 py-2.5 pl-8 pr-1 rounded-xl outline-none font-bold text-slate-950 text-[10px] appearance-none cursor-pointer"
                                                            >
                                                                {COUNTRIES.map(c => (
                                                                    <option key={c.code} value={c.code}>{c.dial}</option>
                                                                ))}
                                                            </select>
                                                            <ChevronDown className="absolute right-1.5 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-400 pointer-events-none" />
                                                        </div>
                                                        <div className="relative group flex-1">
                                                            <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                            <input 
                                                                type="tel" 
                                                                value={phone} 
                                                                onChange={(e) => setPhone(e.target.value.replace(/\D/g, ''))} 
                                                                placeholder="550 12 34 56" 
                                                                className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-3 py-2.5 pl-10 rounded-xl outline-none font-bold text-slate-950 text-xs transition-all" 
                                                            />
                                                        </div>
                                                    </div>
                                                </div>

                                                {/* LOCKED PASSWORD FIELDS */}
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-500 px-1 flex justify-between items-center">
                                                        Mot de passe <Lock className="w-3 h-3 text-slate-300" />
                                                    </label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                        <input 
                                                            type="password" 
                                                            disabled
                                                            value="••••••••" 
                                                            className="w-full bg-slate-50 border-2 border-slate-100 px-3 py-2.5 pl-10 rounded-xl outline-none font-bold text-slate-400 text-xs cursor-not-allowed" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <label className="text-[10px] font-black uppercase text-slate-500 px-1 flex justify-between items-center">
                                                        Confirmation <Lock className="w-3 h-3 text-slate-300" />
                                                    </label>
                                                    <div className="relative group">
                                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                                                        <input 
                                                            type="password" 
                                                            disabled
                                                            value="••••••••" 
                                                            className="w-full bg-slate-50 border-2 border-slate-100 px-3 py-2.5 pl-10 rounded-xl outline-none font-bold text-slate-400 text-xs cursor-not-allowed" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="pt-4 flex justify-center w-full mt-auto">
                                                <button type="button" onClick={handleNext} className="w-full max-w-xs px-12 bg-slate-950 text-white py-3.5 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                                    Suivant <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 2 && (
                                        <motion.div key="step2" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-6 flex-1 flex flex-col justify-center">
                                            <div className={cn(
                                                "border-2 rounded-[2.5rem] p-8 space-y-5 text-center transition-all duration-500",
                                                userType === 'parent' ? "bg-emerald-50/30 border-emerald-50" : userType === 'ecole' ? "bg-indigo-50/30 border-indigo-50" : "bg-amber-50/30 border-amber-50"
                                            )}>
                                                <div className={cn(
                                                    "w-16 h-16 rounded-2xl flex items-center justify-center mx-auto shadow-sm",
                                                    userType === 'parent' ? "bg-emerald-100" : userType === 'ecole' ? "bg-indigo-100" : "bg-amber-100"
                                                )}>
                                                    {userType === 'parent' ? <Users className="text-emerald-600 w-8 h-8" /> : userType === 'ecole' ? <School className="text-indigo-600 w-8 h-8" /> : <Heart className="text-amber-600 w-8 h-8" />}
                                                </div>
                                                <div className="space-y-2">
                                                    <h3 className="text-xl font-black text-slate-950 uppercase tracking-tighter">
                                                        {userType === 'parent' ? "Alliance Parentale" : userType === 'ecole' ? "Identité Scolaire" : "Engagement Solidaire"}
                                                    </h3>
                                                    <p className="text-slate-500 font-bold text-xs leading-relaxed max-w-[400px] mx-auto italic">
                                                        {userType === 'parent' ? "Invitez votre allié pour synchroniser l'éducation." : userType === 'ecole' ? "Précisez le statut et l'emplacement de votre école." : "Définissez le périmètre de votre mission solidaire."}
                                                    </p>
                                                </div>
                                                
                                                <div className="space-y-3 max-w-sm mx-auto">
                                                    <div className="relative group">
                                                        {userType === 'parent' ? <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /> : <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />}
                                                        <input 
                                                            type="text" 
                                                            value={userType === 'parent' ? spouseFirstName : childSchool} 
                                                            onChange={(e) => userType === 'parent' ? setSpouseFirstName(e.target.value) : setChildSchool(e.target.value)} 
                                                            placeholder={userType === 'parent' ? "Prénom de l'allié" : "Adresse du Siège"} 
                                                            className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-4 py-3.5 pl-12 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                        />
                                                    </div>
                                                    <div className="relative group">
                                                        {userType === 'parent' ? <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" /> : <UserCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />}
                                                        <input 
                                                            type={userType === 'parent' ? "email" : "text"} 
                                                            value={userType === 'parent' ? spouseEmail : spouseFirstName} 
                                                            onChange={(e) => userType === 'parent' ? setSpouseEmail(e.target.value) : setSpouseFirstName(e.target.value)} 
                                                            placeholder={userType === 'parent' ? "Email de l'allié" : "Nom du Responsable"} 
                                                            className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-4 py-3.5 pl-12 rounded-xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="flex gap-3 justify-center pt-2 mt-auto">
                                                <button type="button" onClick={() => setStep(1)} className="px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center"><ArrowLeft size={20} /></button>
                                                <button type="button" onClick={handleNext} className="px-12 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-3 group">
                                                    Continuer <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}

                                    {step === 3 && (
                                        <motion.div key="step3" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} className="space-y-4 flex-1 flex flex-col justify-center">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div className="space-y-1.5">
                                                    <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">
                                                        {userType === 'parent' ? "Prénom enfant" : "Présence Web"}
                                                    </label>
                                                    <div className="relative group">
                                                        {userType === 'parent' ? <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" /> : <Globe className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />}
                                                        <input 
                                                            type="text" 
                                                            value={childName} 
                                                            onChange={(e) => setChildName(e.target.value)} 
                                                            placeholder={userType === 'parent' ? "Ex: Yasmine" : "URL ou Réseaux"} 
                                                            className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                        />
                                                    </div>
                                                </div>
                                                <div className="space-y-1.5">
                                                    <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">
                                                        {userType === 'parent' ? "Âge" : "Impact"}
                                                    </label>
                                                    <div className="relative group">
                                                        <Target className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                        <input 
                                                            type="number" 
                                                            value={childAge} 
                                                            onChange={(e) => setChildAge(e.target.value)} 
                                                            placeholder={userType === 'parent' ? "Ex: 8" : "Bénéficiaires"} 
                                                            className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                        />
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="space-y-1.5">
                                                <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">
                                                    {userType === 'parent' ? "Région de résidence" : "Région / Siège social"}
                                                </label>
                                                <div className="relative group">
                                                    <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                    <input 
                                                        type="text" 
                                                        value={childRegion} 
                                                        onChange={(e) => setChildRegion(e.target.value)} 
                                                        placeholder="Wilaya / Ville / Quartier" 
                                                        className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm transition-all" 
                                                    />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-4">
                                                {userType === 'parent' ? (
                                                    <>
                                                        <div className="space-y-1.5">
                                                            <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">Niveau</label>
                                                            <div className="relative group">
                                                                <Sparkles className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                <select 
                                                                    value={childLevel} 
                                                                    onChange={(e) => setChildLevel(e.target.value)} 
                                                                    className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-4 py-3 pl-12 rounded-2xl outline-none font-black text-slate-950 text-xs shadow-sm appearance-none cursor-pointer font-jakarta uppercase tracking-tighter"
                                                                >
                                                                    {currentLevels.map(lvl => (
                                                                        <option key={lvl} value={lvl}>
                                                                            {getLocalizedLevel(lvl, childCountry, (locale === "ar" || locale.endsWith("-ar")))}
                                                                        </option>
                                                                    ))}
                                                                </select>
                                                            </div>
                                                        </div>
                                                        <div className="col-span-2 space-y-1.5">
                                                            <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">École 🏫</label>
                                                            <SchoolPicker
                                                                value={selectedSchool}
                                                                onChange={setSelectedSchool}
                                                                country={childCountry || "DZ"}
                                                            />
                                                        </div>
                                                    </>
                                                ) : (
                                                    <>
                                                        <div className="space-y-1.5 col-span-2">
                                                            <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1">Établissement / Structure</label>
                                                            <div className="relative group">
                                                                <School className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                                                                <input 
                                                                    type="text" 
                                                                    value={childSchool} 
                                                                    onChange={(e) => setChildSchool(e.target.value)} 
                                                                    placeholder="Nom exact de la structure" 
                                                                    className="w-full bg-white border-2 border-slate-100 focus:border-slate-950 px-4 py-3 pl-12 rounded-2xl outline-none font-bold text-slate-950 text-xs shadow-sm" 
                                                                />
                                                            </div>
                                                        </div>
                                                    </>
                                                )}
                                            </div>

                                            {/* CRYSTAL SECURITY VAULT */}
                                            <div className="relative mt-1">
                                                <label className="text-[12px] font-black uppercase text-slate-950 tracking-widest ml-1 mb-1.5 block">Vérification de Sécurité</label>
                                                <div className="bg-slate-50/50 rounded-xl p-3 border-2 border-slate-100/50 shadow-inner relative overflow-hidden">
                                                    <div className="flex flex-col sm:flex-row items-center gap-3 relative z-10">
                                                        <div className="relative">
                                                            <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-sm flex items-center justify-center min-w-[120px]">
                                                                <div className="scale-75 origin-center contrast-125 rounded-lg overflow-hidden h-[50px] flex items-center justify-center">
                                                                    <LoadCanvasTemplateNoReload />
                                                                </div>
                                                            </div>
                                                            <button type="button" onClick={() => loadCaptchaEnginge(6)} className="absolute -right-1.5 -top-1.5 bg-slate-950 text-white p-1 rounded-full shadow-lg hover:bg-orange-600 transition-all hover:rotate-180 duration-500"><RefreshCcw className="w-2.5 h-2.5" /></button>
                                                        </div>
                                                        
                                                        <div className="flex-1 w-full space-y-1.5">
                                                            <div className="relative group">
                                                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-slate-950 transition-colors">
                                                                    <ShieldCheck className="w-3.5 h-3.5" />
                                                                </div>
                                                                <input 
                                                                    type="text" 
                                                                    placeholder="Entrez le code" 
                                                                    value={captchaValue} 
                                                                    onChange={(e) => setCaptchaValue(e.target.value)}
                                                                    className="w-full bg-white border-2 border-slate-200 focus:border-slate-950 px-3 py-2 pl-9 rounded-xl outline-none font-black text-slate-950 text-xs transition-all tracking-[0.3em] placeholder:tracking-normal placeholder:font-bold placeholder:text-slate-400 shadow-sm" 
                                                                />
                                                            </div>
                                                            <p className="text-[8px] font-bold text-slate-500 uppercase tracking-tighter px-1 flex items-center gap-1"><span className="w-1 h-1 bg-green-500 rounded-full animate-pulse" /> Protection Elite Active</p>
                                                        </div>
                                                    </div>
                                                </div>
                                            </div>

                                            <div className="flex gap-3 justify-center pt-2 mt-auto">
                                                <button type="button" onClick={() => setStep(2)} className="px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all flex items-center justify-center"><ArrowLeft size={20} /></button>
                                                <button type="submit" disabled={isSubmitting} className="px-12 bg-slate-950 text-white py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] hover:bg-orange-600 transition-all shadow-xl flex items-center justify-center gap-3 group disabled:opacity-50">
                                                    {isSubmitting ? <RefreshCcw className="w-5 h-5 animate-spin" /> : "Activer mon Compte Elite"}
                                                </button>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>

                                <div className="mt-2 text-center space-y-1">
                                    <p className="text-[10px] font-bold text-slate-500 leading-tight px-12">
                                        En continuant, vous acceptez nos <Link href="/terms" className="text-orange-600 hover:underline">conditions</Link> et notre <Link href="/privacy" className="text-teal-600 hover:underline font-bold">politique</Link>.
                                    </p>
                                    <p className="text-[10px] text-slate-500 font-black uppercase tracking-[0.1em]">
                                        {t('Auth.AlreadyHaveAccount')} <Link href="/auth/login" className="text-orange-600 hover:underline font-black">{t('Auth.Login')}</Link>
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

export default function ClientOnboarding({ locale }: { locale: string }) {
    return (
        <Suspense fallback={<div className="h-screen bg-slate-950 flex items-center justify-center text-white">Elite...</div>}>
            <OnboardingContent locale={locale} />
        </Suspense>
    );
}

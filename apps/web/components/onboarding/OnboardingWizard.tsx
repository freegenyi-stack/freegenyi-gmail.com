"use client";

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    Globe2, GraduationCap, User, ArrowRight, ArrowLeft,
    Check, Stars, BookOpen, Sparkles, Target, Zap,
    ShieldCheck, Heart, Mail, Lock, Loader2, PartyPopper
} from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { signIn, useSession } from 'next-auth/react';
import { useChild } from '@/lib/context/ChildContext';
import { LayoutDashboard } from 'lucide-react';

const COUNTRIES = [
    { code: 'dz', label: 'Algérie', flag: '🇩🇿', levels: ['1ap', '2ap', '3ap', '4ap', '5ap'] },
    { code: 'ma', label: 'Maroc', flag: '🇲🇦', levels: ['1ap', '2ap', '3ap', '4ap', '5ap', '6ap'] },
    { code: 'tn', label: 'Tunisie', flag: '🇹🇳', levels: ['1ap', '2ap', '3ap', '4ap', '5ap', '6ap'] },
    { code: 'fr', label: 'France', flag: '🇫🇷', levels: ['cp', 'ce1', 'ce2', 'cm1', 'cm2'] },
];

const LEVEL_LABELS: Record<string, string> = {
    '1ap': '1ère Année Primaire',
    '2ap': '2ème Année Primaire',
    '3ap': '3ème Année Primaire',
    '4ap': '4ème Année Primaire',
    '5ap': '5ème Année Primaire',
    '1am': '1ère Année Moyenne',
    '2am': '2ème Année Moyenne',
    '3am': '3ème Année Moyenne',
    '4am': '4ème Année Moyenne',
    'cp': 'CP (Cours Préparatoire)',
    'ce1': 'CE1',
    'ce2': 'CE2',
    'cm1': 'CM1',
    'cm2': 'CM2',
};

const MOTIVATIONS = [
    { id: 'success', label: 'Réussite aux examens', icon: Target, color: 'text-blue-500', bg: 'bg-blue-50' },
    { id: 'support', label: 'Soutien scolaire quotidien', icon: Zap, color: 'text-amber-500', bg: 'bg-amber-50' },
    { id: 'curiosity', label: 'Éveil et curiosité', icon: Stars, color: 'text-purple-500', bg: 'bg-purple-50' },
    { id: 'autonomy', label: 'Autonomie de l\'enfant', icon: ShieldCheck, color: 'text-emerald-500', bg: 'bg-emerald-50' },
];

const TIME_COMMITMENTS = [
    { id: 'easy', label: '5 min / jour', sub: 'Léger & constant', icon: Heart },
    { id: 'normal', label: '15 min / jour', sub: 'Recommandé', icon: Stars },
    { id: 'intensive', label: '30 min / jour', sub: 'Progression rapide', icon: Zap },
];

export function OnboardingWizard() {
    const router = useRouter();
    const { data: session } = useSession();
    const { setActiveChild } = useChild();
    const [step, setStep] = useState(0);
    const [country, setCountry] = useState('');
    const [level, setLevel] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [motivation, setMotivation] = useState('');
    const [timeCommitment, setTimeCommitment] = useState('');

    // Auth state
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [authMode, setAuthMode] = useState<'signup' | 'social'>('social');

    const nextStep = () => {
        if (step === 2 && session) {
            // If already logged in, skip Phase 4 (Conversion) and go straight to Phase 5 (Wow)
            setActiveChild({
                name,
                age: parseInt(age),
                level,
                country
            });
            setStep(4);
        } else {
            setStep(s => s + 1);
        }
    };
    const prevStep = () => setStep(s => s - 1);

    const selectedCountry = COUNTRIES.find(c => c.code === country);
    const availableLevels = selectedCountry?.levels || [];

    const handleSocialLogin = async (provider: string) => {
        setIsLoading(true);
        try {
            // Save current setup to localStorage so it can be picked up after login
            localStorage.setItem('pendingOnboarding', JSON.stringify({
                country, level, name, age, motivation, timeCommitment
            }));
            await signIn(provider, { callbackUrl: `/[locale]/parent` });
        } catch (error) {
            console.error(error);
            setIsLoading(false);
        }
    };

    const handleEmailSignup = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        try {
            const response = await fetch('/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email,
                    password,
                    name: `Parent of ${name}`,
                    role: 'PARENT',
                    onboardingData: { country, level, childName: name, childAge: age, motivation, timeCommitment }
                }),
            });

            if (response.ok) {
                // Set active child in context immediately
                setActiveChild({
                    name,
                    age: parseInt(age),
                    level,
                    country
                });
                // Success! Move to Wow step
                nextStep();
            } else {
                const err = await response.json();
                alert(err.error || "Signup failed");
            }
        } catch (error) {
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-slate-50 font-sans selection:bg-blue-100 selection:text-blue-900 overflow-x-hidden">
            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1.5 bg-slate-200 z-[100]">
                <motion.div
                    className="h-full bg-blue-600 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                    initial={{ width: '0%' }}
                    animate={{ width: `${(step / 4) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                />
            </div>

            <div className="max-w-6xl mx-auto px-4 h-full flex flex-col pt-12 text-slate-900">
                {/* Header */}
                <div className="flex items-center justify-between mb-12">
                    <motion.div
                        initial={{ opacity: 0, y: -20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="flex items-center gap-2"
                    >
                        <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-200 border border-blue-500/20">
                            <GraduationCap className="text-white w-6 h-6" />
                        </div>
                        <span className="font-heading font-black text-2xl tracking-tight text-slate-900">
                            FreeGeny
                        </span>
                    </motion.div>
                </div>

                <main className="flex-1 flex flex-col pb-20">
                    <AnimatePresence mode="wait">
                        {/* Phase 1: The Hook (Discovery) */}
                        {step === 0 && (
                            <motion.div
                                key="step0"
                                initial={{ opacity: 0, x: 20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: -20 }}
                                className="grid lg:grid-cols-2 gap-12 items-center"
                            >
                                <div className="space-y-8">
                                    <div className="space-y-4">
                                        <div className="inline-flex items-center gap-2 bg-blue-100/50 text-blue-700 rounded-full px-4 py-1.5 text-[10px] font-black uppercase tracking-widest border border-blue-200/50 backdrop-blur-sm">
                                            <Sparkles className="w-3 h-3 text-blue-600" />
                                            L'aventure commence ici
                                        </div>
                                        <h1 className="text-5xl lg:text-6xl font-black text-slate-900 leading-[1.05] tracking-tight">
                                            L'école devient <br />
                                            <span className="text-blue-600 relative inline-block">
                                                un terrain de jeu
                                                <svg className="absolute -bottom-2 left-0 w-full" viewBox="0 0 200 12" fill="none"><path d="M2 8.5C50 2 150 2 198 8.5" stroke="currentColor" strokeWidth="3" strokeLinecap="round" className="text-blue-200" /></svg>
                                            </span>
                                        </h1>
                                        <p className="text-xl text-slate-500 font-medium max-w-md leading-relaxed">
                                            Choisissez votre pays pour découvrir comment nous transformons les leçons officielles en défis épiques.
                                        </p>
                                    </div>

                                    <div className="grid grid-cols-2 gap-4">
                                        {COUNTRIES.map(c => (
                                            <button
                                                key={c.code}
                                                onClick={() => { setCountry(c.code); setLevel(''); }}
                                                className={cn(
                                                    "relative group p-4 rounded-[2rem] border-3 text-left transition-all duration-300",
                                                    country === c.code
                                                        ? "border-blue-600 bg-white shadow-2xl shadow-blue-100 -translate-y-1"
                                                        : "border-slate-100 bg-white/50 hover:border-slate-200 hover:bg-white hover:shadow-lg"
                                                )}
                                            >
                                                <div className="flex items-center gap-3">
                                                    <span className="text-4xl group-hover:scale-125 transition-transform duration-500 drop-shadow-sm">{c.flag}</span>
                                                    <div>
                                                        <span className={cn(
                                                            "block font-black text-lg leading-tight",
                                                            country === c.code ? "text-blue-900" : "text-slate-700"
                                                        )}>
                                                            {c.label}
                                                        </span>
                                                        <span className="text-[10px] font-bold text-slate-400 font-mono uppercase tracking-tighter">
                                                            Pgm National
                                                        </span>
                                                    </div>
                                                </div>
                                                {country === c.code && (
                                                    <motion.div
                                                        initial={{ scale: 0 }} animate={{ scale: 1 }}
                                                        className="absolute -top-3 -right-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg border-4 border-white"
                                                    >
                                                        <Check className="w-4 h-4" />
                                                    </motion.div>
                                                )}
                                            </button>
                                        ))}
                                    </div>

                                    {country && (
                                        <motion.div
                                            initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }}
                                            className="space-y-4"
                                        >
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] font-mono">Niveau scolaire</label>
                                            <div className="flex flex-wrap gap-2">
                                                {availableLevels.map(lv => (
                                                    <button
                                                        key={lv}
                                                        onClick={() => setLevel(lv)}
                                                        className={cn(
                                                            "px-6 py-3 rounded-2xl border-2 font-black transition-all text-sm",
                                                            level === lv
                                                                ? "bg-slate-900 border-slate-900 text-white shadow-xl scale-105"
                                                                : "bg-white border-slate-100 text-slate-500 hover:border-slate-300 hover:text-slate-900"
                                                        )}
                                                    >
                                                        {LEVEL_LABELS[lv] || lv.toUpperCase()}
                                                    </button>
                                                ))}
                                            </div>
                                        </motion.div>
                                    )}

                                    <Button
                                        className="w-full lg:w-auto h-18 px-12 rounded-[2rem] font-black text-xl gap-3 bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-30 disabled:grayscale"
                                        disabled={!country || !level}
                                        onClick={nextStep}
                                    >
                                        Générer mon parcours <ArrowRight className="w-7 h-7" />
                                    </Button>
                                </div>

                                <div className="hidden lg:block relative">
                                    <div className="absolute inset-0 bg-gradient-to-tr from-blue-600/10 to-indigo-600/10 rounded-[4rem] blur-[100px] -z-10" />
                                    <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.1)] p-10 border border-slate-100 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-6">
                                            <div className="w-14 h-14 bg-amber-50 rounded-2xl flex items-center justify-center shadow-inner group-hover:rotate-12 transition-transform duration-500">
                                                <Zap className="text-amber-500 w-7 h-7" />
                                            </div>
                                        </div>

                                        <div className="space-y-8">
                                            <div className="flex items-center gap-5">
                                                <div className="w-20 h-20 bg-blue-100 rounded-3xl flex items-center justify-center overflow-hidden relative shadow-inner">
                                                    <Image src="/images/hero-kids-learning.jpg" alt="Child" fill className="object-cover" />
                                                </div>
                                                <div>
                                                    <div className="h-4 w-24 bg-slate-100 rounded-full mb-3" />
                                                    <div className="h-7 w-48 bg-slate-200 rounded-full" />
                                                </div>
                                            </div>

                                            <div className="grid grid-cols-2 gap-5">
                                                {[1, 2, 3, 4].map(i => (
                                                    <div key={i} className="flex items-center gap-4 p-4 bg-slate-50/50 rounded-3xl border border-slate-100">
                                                        <div className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center">
                                                            <div className="w-4 h-4 bg-slate-100 rounded-full" />
                                                        </div>
                                                        <div className="space-y-2">
                                                            <div className="h-2 w-16 bg-slate-200 rounded-full" />
                                                            <div className="h-2 w-10 bg-slate-100 rounded-full" />
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>

                                            <div className="h-40 bg-gradient-to-b from-slate-50 to-white rounded-[2.5rem] border border-dashed border-slate-200 flex flex-col items-center justify-center gap-3 p-8 text-center group-hover:border-blue-300 transition-colors">
                                                <div className="relative">
                                                    <LayoutDashboard className="w-10 h-10 text-slate-200" />
                                                    <motion.div
                                                        animate={{ scale: [1, 1.2, 1] }}
                                                        transition={{ repeat: Infinity, duration: 2 }}
                                                        className="absolute -top-1 -right-1 w-4 h-4 bg-blue-500 rounded-full blur-[2px] opacity-50"
                                                    />
                                                </div>
                                                <p className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] font-mono leading-tight">
                                                    Aperçu du Dashboard <br /> {selectedCountry?.label || 'votre pays'}
                                                </p>
                                            </div>
                                        </div>

                                        <motion.div
                                            animate={{ y: [0, -12, 0], rotate: [2, 0, 2] }}
                                            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                            className="absolute -right-6 bottom-16 bg-emerald-500 text-white px-8 py-4 rounded-[1.5rem] shadow-2xl font-black text-base rotate-3 border-4 border-white flex items-center gap-2"
                                        >
                                            <Stars className="w-5 h-5 text-yellow-300" />
                                            +15K Exercices ✨
                                        </motion.div>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Phase 2: Profile (Premium UI) */}
                        {step === 1 && (
                            <motion.div
                                key="step1"
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.1 }}
                                className="max-w-2xl mx-auto w-full"
                            >
                                <div className="text-center space-y-6 mb-12">
                                    <motion.div
                                        initial={{ rotateY: 180 }} animate={{ rotateY: 0 }}
                                        className="inline-flex items-center justify-center w-24 h-24 bg-emerald-100 text-emerald-600 rounded-[2.5rem] mb-4 relative shadow-inner"
                                    >
                                        <User className="w-12 h-12" />
                                        <motion.div
                                            initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ delay: 0.3 }}
                                            className="absolute -bottom-2 -right-2 w-12 h-12 bg-white rounded-2xl shadow-2xl flex items-center justify-center text-4xl overflow-hidden border-4 border-white"
                                        >
                                            {selectedCountry?.flag}
                                        </motion.div>
                                    </motion.div>
                                    <div className="space-y-2">
                                        <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tight">
                                            Parlons de votre enfant
                                        </h2>
                                        <p className="text-slate-400 font-bold text-lg">
                                            Ces informations rendent l'aventure unique.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[3rem] shadow-[0_32px_64px_-16px_rgba(0,0,0,0.08)] p-12 space-y-10 border border-slate-50 relative">
                                    <div className="space-y-4">
                                        <label className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Son joli prénom</label>
                                        <div className="relative group">
                                            <Input
                                                autoFocus
                                                value={name}
                                                onChange={e => setName(e.target.value)}
                                                placeholder="Ex: Amine, Fatima, Sarah..."
                                                className="h-20 rounded-[1.5rem] text-2xl font-black border-3 border-slate-50 bg-slate-50/30 focus:bg-white focus:border-blue-600 focus:shadow-xl transition-all pl-16 outline-none"
                                            />
                                            <User className="absolute left-6 top-7 w-7 h-7 text-slate-300 group-focus-within:text-blue-600 transition-colors" />
                                        </div>
                                    </div>

                                    <div className="space-y-4">
                                        <div className="flex justify-between items-end">
                                            <label className="text-xs font-black text-slate-400 uppercase tracking-widest font-mono">Son âge</label>
                                            <span className="text-blue-600 font-black text-xl">{age ? `${age} ans` : ''}</span>
                                        </div>
                                        <div className="flex gap-3 overflow-x-auto pb-6 scrollbar-none snap-x">
                                            {[5, 6, 7, 8, 9, 10, 11, 12].map(a => (
                                                <button
                                                    key={a}
                                                    type="button"
                                                    onClick={() => setAge(a.toString())}
                                                    className={cn(
                                                        "flex-shrink-0 w-18 h-18 rounded-2xl border-3 flex items-center justify-center text-2xl font-black transition-all snap-center",
                                                        age === a.toString()
                                                            ? "bg-blue-600 border-blue-600 text-white shadow-2xl shadow-blue-200 scale-110 -translate-y-2"
                                                            : "bg-white border-slate-50 text-slate-300 hover:border-slate-200 hover:text-slate-600"
                                                    )}
                                                >
                                                    {a}
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-5 pt-4">
                                        <Button
                                            variant="ghost"
                                            className="h-18 flex-1 rounded-[1.5rem] font-black text-slate-400 hover:text-slate-900 border-2 border-transparent hover:border-slate-100"
                                            onClick={prevStep}
                                        >
                                            <ArrowLeft className="w-6 h-6 mr-2" />
                                        </Button>
                                        <Button
                                            className="h-18 flex-[3] rounded-[1.5rem] font-black text-xl gap-3 bg-slate-900 hover:bg-black shadow-2xl shadow-slate-200 transition-all disabled:opacity-30"
                                            disabled={!name || !age}
                                            onClick={nextStep}
                                        >
                                            Continuer <ArrowRight className="w-6 h-6" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Phase 3: Psychology (Motivation) */}
                        {step === 2 && (
                            <motion.div
                                key="step2"
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -30 }}
                                className="max-w-4xl mx-auto w-full"
                            >
                                <div className="text-center space-y-6 mb-12">
                                    <div className="inline-flex items-center justify-center w-24 h-24 bg-blue-100 text-blue-600 rounded-[2.5rem] mb-4 shadow-inner">
                                        <Target className="w-12 h-12" />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-5xl font-black text-slate-900 leading-[1.1] tracking-tight">
                                            Quel objectif pour <br />
                                            <span className="text-blue-600">{name}</span> ?
                                        </h2>
                                        <p className="text-slate-500 font-bold text-lg max-w-md mx-auto">
                                            Chaque enfant est différent. Dites-nous ce qui compte le plus pour vous.
                                        </p>
                                    </div>
                                </div>

                                <div className="grid md:grid-cols-2 gap-6 snap-y">
                                    {MOTIVATIONS.map(m => (
                                        <button
                                            key={m.id}
                                            onClick={() => setMotivation(m.id)}
                                            className={cn(
                                                "group flex flex-col items-start gap-6 p-10 rounded-[3rem] border-3 text-left transition-all duration-500 snap-center",
                                                motivation === m.id
                                                    ? "bg-white border-blue-600 shadow-[0_32px_64px_-16px_rgba(37,99,235,0.15)] -translate-y-2"
                                                    : "bg-white border-slate-50 hover:border-slate-200 hover:shadow-xl"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center transition-all duration-500",
                                                motivation === m.id ? "bg-blue-600 shadow-xl rotate-6" : m.bg
                                            )}>
                                                <m.icon className={cn(
                                                    "w-8 h-8 transition-colors duration-500",
                                                    motivation === m.id ? "text-white" : m.color
                                                )} />
                                            </div>
                                            <div className="space-y-2">
                                                <h3 className={cn(
                                                    "text-2xl font-black transition-colors mb-2",
                                                    motivation === m.id ? "text-blue-600" : "text-slate-900"
                                                )}>
                                                    {m.label}
                                                </h3>
                                                <p className="text-base text-slate-400 font-medium leading-relaxed">
                                                    Nous adapterons les exercices et les rappels pour maximiser cet aspect.
                                                </p>
                                            </div>
                                        </button>
                                    ))}
                                </div>

                                <div className="mt-16 space-y-8">
                                    <div className="text-center">
                                        <h3 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">
                                            Combien de temps par jour ?
                                        </h3>
                                        <div className="flex flex-col sm:flex-row justify-center gap-5">
                                            {TIME_COMMITMENTS.map(tc => (
                                                <button
                                                    key={tc.id}
                                                    onClick={() => setTimeCommitment(tc.id)}
                                                    className={cn(
                                                        "flex-1 flex items-center gap-5 p-6 rounded-[2rem] border-3 text-left transition-all duration-300",
                                                        timeCommitment === tc.id
                                                            ? "bg-slate-900 border-slate-900 text-white shadow-2xl scale-105"
                                                            : "bg-white border-slate-50 text-slate-600 hover:border-slate-200 shadow-sm"
                                                    )}
                                                >
                                                    <div className={cn(
                                                        "w-12 h-12 rounded-[1rem] flex items-center justify-center transition-colors",
                                                        timeCommitment === tc.id ? "bg-white/10" : "bg-slate-50"
                                                    )}>
                                                        <tc.icon className={cn("w-6 h-6", timeCommitment === tc.id ? "text-white" : "text-slate-300")} />
                                                    </div>
                                                    <div>
                                                        <p className="font-black text-lg leading-tight">{tc.label}</p>
                                                        <p className={cn(
                                                            "text-xs font-black uppercase tracking-widest font-mono opacity-60",
                                                            timeCommitment === tc.id ? "text-white" : "text-slate-400"
                                                        )}>
                                                            {tc.sub}
                                                        </p>
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="flex gap-5 pt-12">
                                        <Button
                                            variant="ghost"
                                            className="h-20 flex-1 rounded-[2rem] font-black text-slate-400 hover:text-slate-900"
                                            onClick={prevStep}
                                        >
                                            <ArrowLeft className="w-7 h-7" />
                                        </Button>
                                        <Button
                                            className="h-20 flex-[3] rounded-[2rem] font-black text-2xl gap-4 bg-blue-600 hover:bg-blue-700 shadow-2xl shadow-blue-200 transition-all disabled:opacity-30 disabled:grayscale"
                                            disabled={!motivation || !timeCommitment}
                                            onClick={nextStep}
                                        >
                                            Finaliser l'aventure <ArrowRight className="w-8 h-8" />
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}

                        {/* Phase 4: Conversion (Zéro-Friction) */}
                        {step === 3 && (
                            <motion.div
                                key="step3"
                                initial={{ opacity: 0, scale: 0.95 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 1.05 }}
                                className="max-w-xl mx-auto w-full"
                            >
                                <div className="text-center space-y-6 mb-12">
                                    <div className="inline-flex items-center justify-center w-24 h-24 bg-amber-100 text-amber-600 rounded-[2.5rem] mb-4 shadow-inner relative">
                                        <Lock className="w-12 h-12" />
                                        <motion.div
                                            animate={{ scale: [1, 1.2, 1] }} transition={{ repeat: Infinity, duration: 2 }}
                                            className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 rounded-full border-4 border-white"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <h2 className="text-5xl font-black text-slate-900 leading-tight tracking-tight">
                                            Ne perdez pas <br />
                                            <span className="text-blue-600">vos progrès</span>
                                        </h2>
                                        <p className="text-slate-500 font-bold text-lg max-w-sm mx-auto">
                                            Créez votre compte en un clic pour sauvegarder l'aventure de {name}.
                                        </p>
                                    </div>
                                </div>

                                <div className="bg-white rounded-[3rem] shadow-[0_48px_96px_-24px_rgba(0,0,0,0.12)] p-12 border border-slate-50 relative overflow-hidden">
                                    {/* Animated background element */}
                                    <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-400 via-indigo-500 to-purple-500" />

                                    <div className="space-y-6">
                                        {/* Social Logins */}
                                        <div className="grid gap-4">
                                            <Button
                                                variant="outline"
                                                className="h-18 rounded-2xl border-2 font-black text-lg gap-4 hover:bg-slate-50 transition-all border-slate-100"
                                                onClick={() => handleSocialLogin('google')}
                                                disabled={isLoading}
                                            >
                                                <svg className="w-6 h-6" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" /><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" /><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" /><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" /></svg>
                                                Continuer avec Google
                                            </Button>
                                            <Button
                                                variant="outline"
                                                className="h-18 rounded-2xl border-2 font-black text-lg gap-4 hover:bg-slate-50 transition-all border-slate-100"
                                                onClick={() => handleSocialLogin('apple')}
                                                disabled={isLoading}
                                            >
                                                <svg className="w-6 h-6 fill-black" viewBox="0 0 24 24"><path d="M17.05 20.28c-.96.95-2.05 1.78-3.32 1.78s-1.68-.78-2.95-.78-1.84.78-3.08.78c-1.2 0-2.45-1.02-3.41-1.98C2.33 18.15 1 15.08 1 12.16c0-4.64 3.28-7.1 6.27-7.1 1.57 0 2.8.98 3.73.98s2.05-.98 3.82-.98c1.32 0 3 .65 4.12 2.12-.13.08-2.44 1.42-2.44 4.22s2.5 3.73 2.5 3.73-.08.28-.42.75l-1.53 2.4zM12.03 5.07c.05-2.58 2.14-4.57 4.61-4.63-.03 2.58-2.2 4.67-4.61 4.63z" /></svg>
                                                Continuer avec Apple
                                            </Button>
                                        </div>

                                        <div className="relative py-4">
                                            <div className="absolute inset-0 flex items-center"><div className="w-full border-t border-slate-100"></div></div>
                                            <div className="relative flex justify-center text-xs uppercase font-black tracking-[0.3em] text-slate-300">
                                                <span className="bg-white px-4">Ou par email</span>
                                            </div>
                                        </div>

                                        {authMode === 'social' ? (
                                            <Button
                                                variant="ghost"
                                                className="w-full h-14 rounded-xl font-bold text-slate-400 hover:text-blue-600 transition-colors"
                                                onClick={() => setAuthMode('signup')}
                                            >
                                                Utiliser mon adresse email
                                            </Button>
                                        ) : (
                                            <form onSubmit={handleEmailSignup} className="space-y-4">
                                                <div className="relative group">
                                                    <Input
                                                        type="email"
                                                        placeholder="Votre email"
                                                        value={email}
                                                        onChange={e => setEmail(e.target.value)}
                                                        className="h-16 rounded-[1rem] border-2 border-slate-50 bg-slate-50/50 pl-14 font-bold text-lg focus:bg-white transition-all shadow-inner"
                                                        required
                                                    />
                                                    <Mail className="absolute left-5 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                                </div>
                                                <div className="relative group">
                                                    <Input
                                                        type="password"
                                                        placeholder="Mot de passe"
                                                        value={password}
                                                        onChange={e => setPassword(e.target.value)}
                                                        className="h-16 rounded-[1rem] border-2 border-slate-50 bg-slate-50/50 pl-14 font-bold text-lg focus:bg-white transition-all shadow-inner"
                                                        required
                                                    />
                                                    <Lock className="absolute left-5 top-5 text-slate-300 group-focus-within:text-blue-500 transition-colors" />
                                                </div>
                                                <Button
                                                    type="submit"
                                                    className="w-full h-18 rounded-[1.2rem] bg-blue-600 hover:bg-blue-700 text-white font-black text-xl shadow-2xl shadow-blue-100 transition-all disabled:opacity-50"
                                                    disabled={isLoading || !email || !password}
                                                >
                                                    {isLoading ? <Loader2 className="w-8 h-8 animate-spin" /> : "Terminer mon inscription"}
                                                </Button>
                                                <button
                                                    type="button"
                                                    className="w-full text-xs font-black text-slate-400 uppercase tracking-widest pt-2 hover:text-slate-600"
                                                    onClick={() => setAuthMode('social')}
                                                >
                                                    Retour aux options sociales
                                                </button>
                                            </form>
                                        )}
                                    </div>

                                    <p className="mt-8 text-center text-[10px] text-slate-300 font-bold uppercase tracking-widest leading-relaxed">
                                        En continuant, vous acceptez nos <br />
                                        <a href="#" className="underline">Conditions</a> & <a href="#" className="underline">Confidentialité</a>
                                    </p>
                                </div>
                            </motion.div>
                        )}

                        {/* Phase 5: The Wow (Success!) */}
                        {step === 4 && (
                            <motion.div
                                key="step4"
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="max-w-3xl mx-auto w-full text-center"
                            >
                                <div className="space-y-12 py-20">
                                    <motion.div
                                        initial={{ scale: 0 }} animate={{ scale: 1 }} transition={{ type: 'spring', delay: 0.5 }}
                                        className="inline-flex items-center justify-center w-40 h-40 bg-blue-600 rounded-[3rem] shadow-[0_40px_80px_-20px_rgba(37,99,235,0.4)] relative mx-auto"
                                    >
                                        <PartyPopper className="w-20 h-20 text-white" />
                                        {/* Particle simulation simplified with framer motion dots */}
                                        {[...Array(8)].map((_, i) => (
                                            <motion.div
                                                key={i}
                                                className="absolute w-3 h-3 bg-yellow-400 rounded-full"
                                                animate={{
                                                    x: [0, (i % 2 === 0 ? 100 : -100) * Math.random()],
                                                    y: [0, (i % 3 === 0 ? 100 : -100) * Math.random()],
                                                    opacity: [1, 0],
                                                    scale: [1, 0.5, 0]
                                                }}
                                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.1 }}
                                            />
                                        ))}
                                    </motion.div>

                                    <div className="space-y-4">
                                        <h2 className="text-6xl font-black text-slate-900 leading-tight tracking-tight">
                                            Parfait, <span className="text-blue-600">c'est prêt !</span>
                                        </h2>
                                        <p className="text-2xl text-slate-500 font-bold max-w-lg mx-auto leading-relaxed">
                                            Bienvenue dans l'aventure FreeGeny. <br />
                                            Le plan de réussite de <span className="text-slate-900">{name}</span> pour l'{selectedCountry?.label} a été généré avec succès.
                                        </p>
                                    </div>

                                    <div className="bg-white rounded-[3rem] p-10 shadow-2xl border border-slate-50 inline-block">
                                        <div className="flex items-center gap-12">
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Curriculum</p>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-3xl">{selectedCountry?.flag}</span>
                                                    <span className="text-xl font-black text-slate-900">{LEVEL_LABELS[level]}</span>
                                                </div>
                                            </div>
                                            <div className="w-px h-12 bg-slate-100" />
                                            <div className="text-center">
                                                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Objectif</p>
                                                <span className="text-xl font-black text-blue-600">
                                                    {MOTIVATIONS.find(m => m.id === motivation)?.label}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pt-8">
                                        <Button
                                            className="h-20 px-16 rounded-[2.5rem] bg-slate-900 hover:bg-black text-white font-black text-2xl gap-4 shadow-[0_24px_48px_-12px_rgba(0,0,0,0.3)] transition-all hover:scale-[1.05] active:scale-[0.98]"
                                            onClick={() => router.push(`/${selectedCountry?.code || 'dz'}/parent`)}
                                        >
                                            <Zap className="w-8 h-8 text-amber-400 fill-amber-400" /> Accéder à mon Dashboard
                                        </Button>
                                    </div>
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </main>

                {/* Footer Stats / Safety */}
                <footer className="fixed bottom-0 left-0 w-full py-6 flex justify-center items-center gap-10 bg-slate-50/80 backdrop-blur-md border-t border-slate-100/50 z-20">
                    <div className="flex items-center gap-2 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                        <ShieldCheck className="w-4 h-4 text-emerald-500" />
                        Données Sécurisées
                    </div>
                    <div className="flex items-center gap-2 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                        <Heart className="w-4 h-4 text-red-400" />
                        Conçu pour les familles
                    </div>
                    <div className="flex items-center gap-2 font-bold text-[10px] text-slate-400 uppercase tracking-widest">
                        <GraduationCap className="w-4 h-4 text-blue-500" />
                        Pédagogie d'Expert
                    </div>
                </footer>
            </div>
        </div>
    );
}

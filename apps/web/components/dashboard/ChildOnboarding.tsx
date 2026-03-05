"use client";

import React, { useState, useEffect } from 'react';
import { useChild } from '@/lib/context/ChildContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import {
    Globe2, GraduationCap, User, ArrowRight, ArrowLeft,
    Check, Stars, BookOpen, Sparkles
} from 'lucide-react';

const COUNTRIES = [
    { code: 'dz', label: 'Algérie', flag: '🇩🇿', levels: ['1ap', '2ap', '3ap', '4ap', '5ap', '1am', '2am', '3am', '4am'] },
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

const STEPS = ['Pays', 'Niveau', 'Profil'];

export function ChildOnboarding() {
    const { setActiveChild, isLoading } = useChild();
    const [step, setStep] = useState(0);
    const [country, setCountry] = useState('');
    const [level, setLevel] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState('');
    const [entering, setEntering] = useState(true);

    useEffect(() => {
        const t = setTimeout(() => setEntering(false), 50);
        return () => clearTimeout(t);
    }, [step]);

    if (isLoading) return null;

    const selectedCountry = COUNTRIES.find(c => c.code === country);

    const handleNext = () => {
        setEntering(true);
        setTimeout(() => setStep(s => s + 1), 50);
    };
    const handleBack = () => {
        setEntering(true);
        setTimeout(() => setStep(s => s - 1), 50);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (name && age && level && country) {
            setActiveChild({ name, age: parseInt(age), level, country });
        }
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 p-4">
            {/* Background decorative blobs */}
            <div className="absolute top-0 left-0 w-96 h-96 bg-blue-600/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

            <div className="relative w-full max-w-lg">
                {/* Header */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-md text-white rounded-full px-4 py-2 text-sm font-semibold mb-4 border border-white/20">
                        <Sparkles className="w-4 h-4 text-yellow-300" />
                        FreeGeny — Expérience personnalisée
                    </div>
                    <h1 className="text-3xl font-extrabold text-white tracking-tight">
                        Configurons le profil<br />
                        <span className="text-blue-300">de votre enfant</span>
                    </h1>

                    {/* Step indicators */}
                    <div className="flex items-center justify-center gap-2 mt-6">
                        {STEPS.map((s, i) => (
                            <React.Fragment key={s}>
                                <div className={cn(
                                    "flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-bold transition-all duration-300",
                                    i < step ? "bg-emerald-500 text-white" :
                                        i === step ? "bg-white text-slate-900" :
                                            "bg-white/10 text-white/40"
                                )}>
                                    {i < step ? <Check className="w-3 h-3" /> : (
                                        <span>{i + 1}</span>
                                    )}
                                    {s}
                                </div>
                                {i < STEPS.length - 1 && (
                                    <div className={cn("h-px w-6 transition-all", i < step ? "bg-emerald-400" : "bg-white/20")} />
                                )}
                            </React.Fragment>
                        ))}
                    </div>
                </div>

                {/* Card */}
                <div className={cn(
                    "bg-white rounded-3xl shadow-2xl overflow-hidden transition-all duration-300",
                    entering ? "opacity-0 translate-y-4" : "opacity-100 translate-y-0"
                )}>
                    {/* Step 0: Country */}
                    {step === 0 && (
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-3 text-slate-800">
                                <div className="p-2 bg-blue-100 rounded-xl"><Globe2 className="w-5 h-5 text-blue-600" /></div>
                                <div>
                                    <h2 className="text-xl font-extrabold">Pays du curriculum</h2>
                                    <p className="text-slate-500 text-sm">Choisissez le pays dont votre enfant suit le programme</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3">
                                {COUNTRIES.map(c => (
                                    <button
                                        key={c.code}
                                        onClick={() => { setCountry(c.code); setLevel(''); }}
                                        className={cn(
                                            "flex items-center gap-3 p-4 rounded-2xl border-2 text-left transition-all font-semibold",
                                            country === c.code
                                                ? "border-blue-500 bg-blue-50 text-blue-700"
                                                : "border-slate-200 hover:border-slate-300 text-slate-700"
                                        )}
                                    >
                                        <span className="text-2xl">{c.flag}</span>
                                        <span>{c.label}</span>
                                        {country === c.code && <Check className="w-4 h-4 ml-auto text-blue-500" />}
                                    </button>
                                ))}
                            </div>
                            <Button
                                className="w-full h-12 rounded-2xl font-bold gap-2 bg-blue-600 hover:bg-blue-700"
                                disabled={!country}
                                onClick={handleNext}
                            >
                                Continuer <ArrowRight className="w-4 h-4" />
                            </Button>
                        </div>
                    )}

                    {/* Step 1: Level */}
                    {step === 1 && (
                        <div className="p-8 space-y-6">
                            <div className="flex items-center gap-3 text-slate-800">
                                <div className="p-2 bg-indigo-100 rounded-xl"><GraduationCap className="w-5 h-5 text-indigo-600" /></div>
                                <div>
                                    <h2 className="text-xl font-extrabold">Niveau scolaire</h2>
                                    <p className="text-slate-500 text-sm">Programme {selectedCountry?.flag} {selectedCountry?.label}</p>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-3 max-h-64 overflow-y-auto pr-1">
                                {(selectedCountry?.levels || []).map(lv => (
                                    <button
                                        key={lv}
                                        onClick={() => setLevel(lv)}
                                        className={cn(
                                            "p-3 rounded-2xl border-2 text-left transition-all text-sm",
                                            level === lv
                                                ? "border-indigo-500 bg-indigo-50 text-indigo-700 font-bold"
                                                : "border-slate-200 hover:border-slate-300 text-slate-600 font-medium"
                                        )}
                                    >
                                        {LEVEL_LABELS[lv] || lv.toUpperCase()}
                                        {level === lv && <span className="float-right">✓</span>}
                                    </button>
                                ))}
                            </div>
                            <div className="flex gap-3">
                                <Button variant="outline" className="flex-1 h-12 rounded-2xl" onClick={handleBack}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                                </Button>
                                <Button
                                    className="flex-1 h-12 rounded-2xl font-bold gap-2 bg-indigo-600 hover:bg-indigo-700"
                                    disabled={!level}
                                    onClick={handleNext}
                                >
                                    Continuer <ArrowRight className="w-4 h-4" />
                                </Button>
                            </div>
                        </div>
                    )}

                    {/* Step 2: Profile */}
                    {step === 2 && (
                        <form onSubmit={handleSubmit} className="p-8 space-y-6">
                            <div className="flex items-center gap-3 text-slate-800">
                                <div className="p-2 bg-emerald-100 rounded-xl"><User className="w-5 h-5 text-emerald-600" /></div>
                                <div>
                                    <h2 className="text-xl font-extrabold">Profil de l'enfant</h2>
                                    <p className="text-slate-500 text-sm">{LEVEL_LABELS[level]} — {selectedCountry?.flag} {selectedCountry?.label}</p>
                                </div>
                            </div>

                            <div className="space-y-4">
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Prénom de votre enfant</label>
                                    <Input
                                        value={name}
                                        onChange={e => setName(e.target.value)}
                                        placeholder="Ex: Amine, Fatima..."
                                        className="h-12 rounded-xl text-base font-medium"
                                        required
                                    />
                                </div>
                                <div className="space-y-1.5">
                                    <label className="text-xs font-bold uppercase tracking-widest text-slate-400">Âge</label>
                                    <Input
                                        type="number"
                                        value={age}
                                        onChange={e => setAge(e.target.value)}
                                        placeholder="Ex: 6"
                                        min={3}
                                        max={18}
                                        className="h-12 rounded-xl text-base font-medium"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="bg-blue-50 rounded-2xl p-4 flex items-start gap-3">
                                <BookOpen className="w-5 h-5 text-blue-500 mt-0.5 shrink-0" />
                                <p className="text-sm text-blue-700 font-medium">
                                    FreeGeny chargera automatiquement le programme officiel <strong>{selectedCountry?.flag} {LEVEL_LABELS[level]}</strong> pour votre enfant.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <Button type="button" variant="outline" className="flex-1 h-12 rounded-2xl" onClick={handleBack}>
                                    <ArrowLeft className="w-4 h-4 mr-2" /> Retour
                                </Button>
                                <Button type="submit" className="flex-1 h-12 rounded-2xl font-bold gap-2 bg-emerald-600 hover:bg-emerald-700" disabled={!name || !age}>
                                    <Stars className="w-4 h-4" /> Accéder au dashboard
                                </Button>
                            </div>
                        </form>
                    )}
                </div>

                <p className="text-center text-white/40 text-xs mt-4 font-medium">
                    Programme officiel · Conforme au curriculum national · Données sécurisées
                </p>
            </div>
        </div>
    );
}

"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { ArrowRight, GraduationCap, Palette, Music, FlaskConical, Book, Puzzle, Trophy, Loader2, Sparkles } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useChild } from '@/lib/context/ChildContext';
import { useSession } from 'next-auth/react';

const PASSIONS = [
    { id: 'art', label: 'Dessin & Art', icon: Palette, color: 'text-pink-500', bg: 'bg-pink-50', border: 'border-pink-200' },
    { id: 'music', label: 'Musique', icon: Music, color: 'text-purple-500', bg: 'bg-purple-50', border: 'border-purple-200' },
    { id: 'science', label: 'Sciences', icon: FlaskConical, color: 'text-blue-500', bg: 'bg-blue-50', border: 'border-blue-200' },
    { id: 'reading', label: 'Histoires', icon: Book, color: 'text-amber-500', bg: 'bg-amber-50', border: 'border-amber-200' },
    { id: 'logic', label: 'Puzzles', icon: Puzzle, color: 'text-emerald-500', bg: 'bg-emerald-50', border: 'border-emerald-200' },
    { id: 'sports', label: 'Sports', icon: Trophy, color: 'text-orange-500', bg: 'bg-orange-50', border: 'border-orange-200' },
];

const AGES = [5, 6, 7, 8, 9, 10, 11, 12];

export function OnboardingWizard() {
    const router = useRouter();
    const { data: session } = useSession();
    const { setActiveChild } = useChild();
    const [step, setStep] = useState(0);
    const [age, setAge] = useState<number | null>(null);
    const [selectedPassions, setSelectedPassions] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);

    const togglePassion = (id: string) => {
        setSelectedPassions(prev =>
            prev.includes(id)
                ? prev.filter(p => p !== id)
                : prev.length < 3 ? [...prev, id] : prev // Max 3 passions
        );
    };

    const handleComplete = async () => {
        setIsSaving(true);
        // Save to context
        setActiveChild({
            name: "Mon enfant", // A demander plus tard si besoin
            age: age || 6,
            level: 'CP', // Default or derived from age
            country: 'FR',
            passions: selectedPassions
        });

        // Simuler appel API
        setTimeout(() => {
            setIsSaving(false);
            router.push('/fr/parent');
        }, 1500);
    };

    const getChildName = () => {
        // En conditions réelles, récupéré du contexte ou session
        return "votre enfant";
    };

    return (
        <div className="min-h-screen bg-background font-sans selection:bg-primary/20 flex flex-col items-center justify-center p-6 relative overflow-hidden">
            {/* Background elements */}
            <div className="absolute top-0 right-0 w-[40rem] h-[40rem] bg-primary/5 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-0 left-0 w-[40rem] h-[40rem] bg-secondary/5 rounded-full blur-3xl pointer-events-none" />

            {/* Progress Bar */}
            <div className="fixed top-0 left-0 w-full h-1.5 bg-muted z-[100]">
                <motion.div
                    className="h-full bg-primary"
                    initial={{ width: '0%' }}
                    animate={{ width: `${((step + 1) / 2) * 100}%` }}
                    transition={{ type: 'spring', stiffness: 100 }}
                />
            </div>

            <div className="max-w-2xl w-full z-10">
                <AnimatePresence mode="wait">
                    {/* Step 1: Age */}
                    {step === 0 && (
                        <motion.div
                            key="step0"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -20, scale: 0.95 }}
                            className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl border border-border text-center space-y-10"
                        >
                            <div className="space-y-4">
                                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mb-6">
                                    <Sparkles className="w-8 h-8 text-primary" />
                                </div>
                                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading">
                                    Bienvenue dans l{"'"}aventure !
                                </h1>
                                <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto">
                                    Quel est l{"'"}âge de {getChildName()} ?
                                </p>
                            </div>

                            <div className="grid grid-cols-4 gap-3 md:gap-4">
                                {AGES.map(a => (
                                    <button
                                        key={a}
                                        onClick={() => setAge(a)}
                                        className={cn(
                                            "aspect-square rounded-2xl flex flex-col items-center justify-center text-2xl md:text-3xl font-black transition-all border-2",
                                            age === a
                                                ? "bg-primary border-primary text-primary-foreground shadow-lg scale-105"
                                                : "bg-background border-border text-foreground hover:border-primary/50 hover:bg-muted"
                                        )}
                                    >
                                        {a}
                                        <span className={cn(
                                            "text-xs font-medium uppercase tracking-widest mt-1",
                                            age === a ? "text-primary-foreground/80" : "text-muted-foreground"
                                        )}>ans</span>
                                    </button>
                                ))}
                            </div>

                            <Button
                                className="w-full h-16 rounded-2xl font-bold text-xl gap-2 shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                                disabled={!age}
                                onClick={() => setStep(1)}
                            >
                                Continuer <ArrowRight className="w-6 h-6" />
                            </Button>
                        </motion.div>
                    )}

                    {/* Step 2: Passions */}
                    {step === 1 && (
                        <motion.div
                            key="step1"
                            initial={{ opacity: 0, y: 20, scale: 0.95 }}
                            animate={{ opacity: 1, y: 0, scale: 1 }}
                            className="bg-card rounded-3xl p-8 md:p-12 shadow-2xl border border-border text-center space-y-10"
                        >
                            <div className="space-y-4">
                                <h1 className="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight font-heading">
                                    Qu{"'"}est-ce qui le passionne ?
                                </h1>
                                <p className="text-xl text-muted-foreground font-medium max-w-md mx-auto">
                                    Choisissez jusqu{"'"}à 3 centres d{"'"}intérêt pour personnaliser ses activités.
                                </p>
                            </div>

                            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                                {PASSIONS.map(passion => {
                                    const isSelected = selectedPassions.includes(passion.id);
                                    return (
                                        <button
                                            key={passion.id}
                                            onClick={() => togglePassion(passion.id)}
                                            className={cn(
                                                "p-6 rounded-2xl border-2 flex flex-col items-center gap-4 transition-all duration-300",
                                                isSelected
                                                    ? `${passion.border} bg-background ring-2 ring-primary ring-offset-2 ring-offset-background scale-105 shadow-xl`
                                                    : "border-border bg-muted/30 hover:bg-muted hover:border-primary/30"
                                            )}
                                        >
                                            <div className={cn(
                                                "w-16 h-16 rounded-2xl flex items-center justify-center transition-colors shadow-sm",
                                                isSelected ? passion.bg : "bg-background"
                                            )}>
                                                <passion.icon className={cn(
                                                    "w-8 h-8 transition-colors",
                                                    isSelected ? passion.color : "text-muted-foreground"
                                                )} />
                                            </div>
                                            <span className={cn(
                                                "font-bold text-sm md:text-base",
                                                isSelected ? passion.color : "text-foreground"
                                            )}>
                                                {passion.label}
                                            </span>
                                        </button>
                                    );
                                })}
                            </div>

                            <Button
                                className="w-full h-16 rounded-2xl font-bold text-xl gap-2 shadow-xl shadow-primary/20 transition-all active:scale-[0.98] disabled:opacity-50"
                                disabled={selectedPassions.length === 0 || isSaving}
                                onClick={handleComplete}
                            >
                                {isSaving ? (
                                    <Loader2 className="w-6 h-6 animate-spin" />
                                ) : (
                                    <>Découvrir ses premières activités <ArrowRight className="w-6 h-6" /></>
                                )}
                            </Button>
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    );
}

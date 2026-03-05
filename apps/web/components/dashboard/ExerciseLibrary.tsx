"use client";

import { useEffect, useState } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Star, ChevronRight, Filter, Sparkles, Brain, Target, Lightbulb } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface Exercise {
    id: string;
    type: string;
    difficulty: number;
    points: number;
    statement: string;
    options?: (string | { id: string; text: string })[];
    correct?: string;
    parent_help?: string;
}

interface Lesson {
    lesson_id: string;
    title: string;
    title_fr: string;
    theme: string;
    letters: string[];
    semester: number;
    exercises: Exercise[];
}

interface Props {
    childId: string;
    filters?: { subject?: string; country?: string; level?: string };
}

const TYPE_LABELS: Record<string, { fr: string; ar: string; color: string }> = {
    fill_blank: { fr: "Compléter", ar: "إكمال الفراغ", color: "bg-blue-100 text-blue-700" },
    multiple_choice: { fr: "QCM", ar: "اختيار من متعدد", color: "bg-purple-100 text-purple-700" },
    letter_recognition: { fr: "Lettres", ar: "التعرف على الحروف", color: "bg-orange-100 text-orange-700" },
    matching: { fr: "Association", ar: "التوصيل", color: "bg-emerald-100 text-emerald-700" },
    true_false: { fr: "Vrai/Faux", ar: "صحيح/خطأ", color: "bg-red-100 text-red-700" },
    ordering: { fr: "Ordonner", ar: "الترتيب", color: "bg-yellow-100 text-yellow-700" },
    open_ended: { fr: "Rédaction", ar: "تعبير كتابي", color: "bg-pink-100 text-pink-700" },
    islamic_recitation: { fr: "Islamique", ar: "تربية إسلامية", color: "bg-teal-100 text-teal-700" },
};

export function ExerciseLibrary({ childId, filters }: Props) {
    const [lessons, setLessons] = useState<Lesson[]>([]);
    const [loading, setLoading] = useState(true);
    const [openLesson, setOpenLesson] = useState<string | null>(null);
    const [typeFilter, setTypeFilter] = useState<string>('all');

    const country = filters?.country || 'dz';
    const level = filters?.level || '1ap';
    const subject = filters?.subject || 'ar';

    useEffect(() => {
        setLoading(true);
        fetch(`/api/curriculum/${country}/${level}/${subject}?dataType=exercises`)
            .then(r => r.json())
            .then(data => {
                setLessons(data.lessons || []);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [country, level, subject]);

    if (loading) return (
        <div className="space-y-3">
            {[1, 2, 3].map(i => <Skeleton key={i} className="h-20 rounded-2xl" />)}
        </div>
    );

    const totalExercises = lessons.reduce((sum, l) => sum + l.exercises.length, 0);
    const allTypes = Array.from(new Set(lessons.flatMap(l => l.exercises.map(e => e.type))));

    return (
        <div className="space-y-6">
            {/* Header */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 shadow-xl shadow-slate-200/40 p-8 md:p-10"
            >
                <div className="flex flex-col lg:flex-row justify-between gap-8 items-start lg:items-center">
                    <div className="flex items-center gap-5">
                        <div className="w-14 h-14 bg-orange-100 rounded-2xl flex items-center justify-center text-orange-600 shadow-inner">
                            <Brain className="h-7 w-7" />
                        </div>
                        <div>
                            <h2 className="text-3xl font-black text-slate-900 tracking-tighter">✏️ Exercices Pratiques</h2>
                            <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1">
                                <span className="text-orange-600">{totalExercises}</span> défis disponibles pour progreser
                            </p>
                        </div>
                    </div>
                    <div className="flex gap-2 flex-wrap bg-slate-50 p-2 rounded-2xl border border-slate-100">
                        <Button
                            size="sm"
                            variant={typeFilter === 'all' ? 'default' : 'ghost'}
                            className="rounded-xl text-xs font-bold px-4"
                            onClick={() => setTypeFilter('all')}
                        >
                            {country === 'dz' ? "الكل" : "Tous les types"}
                        </Button>
                        {allTypes.slice(0, 5).map(t => (
                            <Button
                                key={t}
                                size="sm"
                                variant={typeFilter === t ? 'default' : 'ghost'}
                                className="rounded-xl text-xs font-bold px-4"
                                onClick={() => setTypeFilter(t)}
                            >
                                {country === 'dz' ? TYPE_LABELS[t]?.ar : TYPE_LABELS[t]?.fr || t}
                            </Button>
                        ))}
                    </div>
                </div>
            </motion.div>

            {/* Lessons list */}
            <div className="space-y-4">
                {lessons.map((lesson, idx) => {
                    const filtered = typeFilter === 'all' ? lesson.exercises : lesson.exercises.filter(e => e.type === typeFilter);
                    if (filtered.length === 0) return null;
                    const isOpen = openLesson === lesson.lesson_id;
                    return (
                        <motion.div
                            key={lesson.lesson_id}
                            layout
                            className="bg-white rounded-[2.5rem] border border-slate-100 shadow-sm overflow-hidden hover:border-blue-100 transition-colors"
                        >
                            <button
                                className="w-full flex items-center gap-6 p-6 md:p-8 text-left hover:bg-slate-50/50 transition-colors group"
                                onClick={() => setOpenLesson(isOpen ? null : lesson.lesson_id)}
                            >
                                <div className="w-14 h-14 rounded-2xl bg-white border border-slate-100 shadow-md flex items-center justify-center shrink-0 font-black text-xl text-blue-600 group-hover:scale-110 transition-transform">
                                    {idx + 1}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-center gap-3 flex-wrap">
                                        <span className="font-black text-slate-900 text-2xl tracking-tight" dir="rtl">{lesson.title}</span>
                                        <span className="w-2 h-2 rounded-full bg-slate-200" />
                                        {country === 'dz' && (
                                            <span className="text-slate-300 text-sm font-bold italic tracking-tight">{lesson.title_fr}</span>
                                        )}
                                        {country !== 'dz' && (
                                            <span className="text-slate-500 text-lg font-bold italic tracking-tight">{lesson.title_fr}</span>
                                        )}
                                    </div>
                                    <div className="flex items-center gap-3 mt-3 flex-wrap">
                                        <div className="px-3 py-1 bg-blue-50 rounded-full text-blue-700 text-[10px] font-black uppercase tracking-widest border border-blue-100">
                                            {filtered.length} {country === 'dz' ? 'تمارين' : 'exercices'}
                                        </div>
                                        <div className="flex items-center gap-1.5">
                                            {lesson.letters.map((l, li) => (
                                                <span key={li} className="w-8 h-8 flex items-center justify-center bg-slate-50 rounded-lg text-lg font-black text-blue-500 border border-slate-100 uppercase">
                                                    {l}
                                                </span>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                                <div className={cn(
                                    "w-10 h-10 rounded-full bg-slate-50 flex items-center justify-center text-slate-400 transition-all duration-300 group-hover:bg-blue-600 group-hover:text-white",
                                    isOpen && "rotate-90 bg-blue-600 text-white"
                                )}>
                                    <ChevronRight className="w-6 h-6" />
                                </div>
                            </button>

                            <AnimatePresence>
                                {isOpen && (
                                    <motion.div
                                        initial={{ height: 0, opacity: 0 }}
                                        animate={{ height: "auto", opacity: 1 }}
                                        exit={{ height: 0, opacity: 0 }}
                                        className="overflow-hidden"
                                    >
                                        <div className="border-t border-slate-100 p-6 md:p-8 space-y-4 bg-slate-50/30">
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                                {filtered.map((ex, ei) => (
                                                    <motion.div
                                                        key={ex.id}
                                                        initial={{ opacity: 0, scale: 0.95 }}
                                                        animate={{ opacity: 1, scale: 1 }}
                                                        transition={{ delay: ei * 0.05 }}
                                                        className="bg-white rounded-[2rem] border border-slate-100 p-6 space-y-4 hover:border-orange-200 hover:shadow-xl hover:shadow-orange-500/5 transition-all group/card relative"
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <div className={cn(
                                                                "px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-widest",
                                                                TYPE_LABELS[ex.type]?.color || 'bg-slate-100 text-slate-600'
                                                            )}>
                                                                {TYPE_LABELS[ex.type]?.fr || ex.type}
                                                            </div>
                                                            <div className="flex gap-0.5">
                                                                {Array.from({ length: 3 }).map((_, i) => (
                                                                    <Star key={i} className={cn(
                                                                        "w-3.5 h-3.5",
                                                                        i < ex.difficulty ? "fill-yellow-400 text-yellow-400" : "fill-slate-100 text-slate-100"
                                                                    )} />
                                                                ))}
                                                            </div>
                                                        </div>

                                                        <p className={cn(
                                                            "font-black text-slate-900 text-xl leading-tight",
                                                            country === 'dz' ? "text-right pl-2 border-l-4" : "text-left pr-2 border-r-4",
                                                            "border-orange-100"
                                                        )} dir={country === 'dz' ? "rtl" : "ltr"}>
                                                            {ex.statement}
                                                        </p>

                                                        {ex.options && ex.options.length > 0 && (
                                                            <div className="flex gap-2 flex-wrap mt-4">
                                                                {ex.options.map((opt, oIdx) => {
                                                                    const label = typeof opt === 'string' ? opt : opt.text;
                                                                    const key = typeof opt === 'string' ? opt : opt.id || `opt-${oIdx}`;
                                                                    return (
                                                                        <span key={key} className="px-4 py-2 bg-slate-50 text-slate-700 rounded-xl text-sm font-bold border border-slate-100" dir="rtl">
                                                                            {label}
                                                                        </span>
                                                                    );
                                                                })}
                                                            </div>
                                                        )}

                                                        {ex.parent_help && (
                                                            <div className="bg-amber-50/50 p-4 rounded-xl border border-amber-100/50 flex gap-3">
                                                                <Lightbulb className="w-5 h-5 text-amber-500 shrink-0" />
                                                                <p className="text-xs text-amber-800 font-semibold italic leading-relaxed">
                                                                    {ex.parent_help}
                                                                </p>
                                                            </div>
                                                        )}

                                                        <div className="flex justify-between items-center pt-2">
                                                            <div className="flex items-center gap-2 bg-emerald-50 px-3 py-1 rounded-full border border-emerald-100 shadow-sm">
                                                                <Target className="w-3.5 h-3.5 text-emerald-600" />
                                                                <span className="text-[10px] font-black text-emerald-700 uppercase">{ex.points} Points</span>
                                                            </div>
                                                            <Button size="sm" className="rounded-xl h-8 text-[10px] font-black uppercase px-4 bg-slate-900 hover:bg-black transition-all group-hover/card:scale-105">
                                                                Pratiquer
                                                            </Button>
                                                        </div>
                                                    </motion.div>
                                                ))}
                                            </div>
                                        </div>
                                    </motion.div>
                                )}
                            </AnimatePresence>
                        </motion.div>
                    );
                })}
            </div>
        </div>
    );
}

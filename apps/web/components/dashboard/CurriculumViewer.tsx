"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { useState, useEffect } from "react";
import { fetchCurriculum, Curriculum } from "@/lib/services/curriculum";
import { Badge } from "@/components/ui/badge";
import { useChild } from "@/lib/context/ChildContext";
import { Sparkles, BookOpen, Clock, Target, Info, ChevronRight, Star, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

interface CurriculumViewerProps {
    country: string;
    level: string;
    subject: string;
    onSelectLesson?: (lessonId: string) => void;
}

type Domaine = 'arabe' | 'islamique' | 'civique';

const DOMAIN_DEF = {
    'arabe': {
        id: 'arabe',
        icon: BookOpen,
        ar: "اللغة العربية",
        fr: "Langue Arabe",
        color: "blue",
        themeGradient: "from-blue-600 to-indigo-700",
        bgLight: "bg-blue-50/50",
        borderDark: "border-blue-200"
    },
    'islamique': {
        id: 'islamique',
        icon: Star,
        ar: "التربية الإسلامية",
        fr: "Sciences Islamiques",
        color: "emerald",
        themeGradient: "from-emerald-500 to-teal-600",
        bgLight: "bg-emerald-50/50",
        borderDark: "border-emerald-200"
    },
    'civique': {
        id: 'civique',
        icon: Landmark,
        ar: "التربية المدنية",
        fr: "Éducation Civique",
        color: "purple",
        themeGradient: "from-purple-500 to-fuchsia-600",
        bgLight: "bg-purple-50/50",
        borderDark: "border-purple-200"
    }
};

export function CurriculumViewer({ country, level, subject, onSelectLesson }: CurriculumViewerProps) {
    const { activeChild } = useChild();
    const [activeDomaine, setActiveDomaine] = useState<Domaine>('arabe');
    const [curriculum, setCurriculum] = useState<Curriculum | null>(null);
    const [loading, setLoading] = useState(true);

    const isArabic = country === 'dz';
    const activeDomainConfig = DOMAIN_DEF[activeDomaine];

    useEffect(() => {
        setLoading(true);
        // Using the updated fetch URL within fetchCurriculum or doing it directly:
        // Adjusting to direct fetch to inject ?domaine= easily if fetchCurriculum doesn't support it
        fetch(`/api/curriculum/${country}/${level}/${subject}?dataType=curriculum&domaine=${activeDomaine}`)
            .then(res => res.json())
            .then(data => {
                setCurriculum(data);
                setLoading(false);
            })
            .catch(() => setLoading(false));
    }, [country, level, subject, activeDomaine]);

    return (
        <div className="space-y-10" dir={isArabic ? "rtl" : "ltr"}>

            {/* ── Sub-Subject Switcher (Tabs) ───────────────────────── */}
            <div className="flex bg-slate-100/80 p-1.5 rounded-2xl w-full max-w-2xl mx-auto shadow-inner relative z-20">
                {(Object.keys(DOMAIN_DEF) as Domaine[]).map((d) => {
                    const cfg = DOMAIN_DEF[d];
                    const isActive = activeDomaine === d;
                    const Icon = cfg.icon;
                    return (
                        <button
                            key={d}
                            onClick={() => setActiveDomaine(d)}
                            className={cn(
                                "flex-1 relative flex items-center justify-center gap-2 py-3 px-4 outline-none transition-all duration-300 rounded-xl font-black font-cairo z-10",
                                isActive
                                    ? `text-${cfg.color}-700 bg-white shadow-md shadow-slate-200 ring-1 ring-slate-200/50 scale-105`
                                    : "text-slate-400 hover:text-slate-600 hover:bg-slate-200/50"
                            )}
                        >
                            <Icon className={cn("w-5 h-5", isActive && `text-${cfg.color}-500`)} />
                            <span>{isArabic ? cfg.ar : cfg.fr}</span>
                            {isActive && (
                                <motion.div
                                    layoutId="activeTabBadgeCurriculum"
                                    className={cn(`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-${cfg.color}-500`)}
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            {/* Personalized Parent Intro */}
            <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn("relative overflow-hidden rounded-[2.5rem] p-1 border shadow-2xl transition-colors duration-500",
                    activeDomaine === 'arabe' ? 'border-blue-100 shadow-blue-500/10' :
                        activeDomaine === 'islamique' ? 'border-emerald-100 shadow-emerald-500/10' :
                            'border-purple-100 shadow-purple-500/10'
                )}
            >
                <div className={cn("absolute inset-0 bg-gradient-to-br transition-colors duration-500",
                    activeDomaine === 'arabe' ? 'from-white via-white to-blue-50' :
                        activeDomaine === 'islamique' ? 'from-white via-white to-emerald-50' :
                            'from-white via-white to-purple-50'
                )} />
                <div className="relative z-10 p-8 flex flex-col md:flex-row gap-8 items-start lg:items-center">
                    <div className={cn("w-20 h-20 rounded-[1.5rem] flex items-center justify-center shrink-0 shadow-lg transition-colors duration-500",
                        activeDomaine === 'arabe' ? 'bg-blue-600 shadow-blue-200' :
                            activeDomaine === 'islamique' ? 'bg-emerald-600 shadow-emerald-200' :
                                'bg-purple-600 shadow-purple-200'
                    )}>
                        <Info className="w-10 h-10 text-white" />
                    </div>
                    <div className="space-y-3">
                        <h3 className="text-3xl font-black text-slate-900 tracking-tight font-cairo">
                            {isArabic ? (
                                <><span className={cn(activeDomaine === 'arabe' ? 'text-blue-600' : activeDomaine === 'islamique' ? 'text-emerald-600' : 'text-purple-600')}>{activeChild?.name}</span> مسار</>
                            ) : (
                                <>Le parcours de <span className={cn(activeDomaine === 'arabe' ? 'text-blue-600' : activeDomaine === 'islamique' ? 'text-emerald-600' : 'text-purple-600')}>{activeChild?.name}</span></>
                            )}
                        </h3>
                        <p className="text-slate-600 leading-relaxed font-semibold text-lg max-w-3xl font-tajawal">
                            {isArabic ? (
                                <>رافق طفلك في مرحلة أساسية من البرنامج الرسمي الجزائري. هذه السنة مهيكلة حول مقاطع أساسية لإتقان مادة {activeDomainConfig.ar}.</>
                            ) : (
                                <>Accompagnez votre enfant dans une étape clé du programme officiel {country === 'dz' ? 'algérien' : ''}. Nous avons structuré ce programme pour maximiser ses chances de réussite en {activeDomainConfig.fr}.</>
                            )}
                        </p>
                    </div>
                </div>
            </motion.div>

            {loading ? (
                <div className="space-y-6">
                    <Card className="animate-pulse border-none shadow-sm rounded-[2rem]">
                        <div className="h-40 w-full bg-slate-100 rounded-[2rem]"></div>
                    </Card>
                    <div className="space-y-4">
                        {[1, 2, 3].map(i => <div key={i} className="h-20 bg-slate-50 rounded-2xl animate-pulse border" />)}
                    </div>
                </div>
            ) : !curriculum || curriculum.themes.length === 0 ? (
                <div className="p-10 text-center bg-slate-50 rounded-[2rem] border-2 border-dashed font-tajawal text-slate-500 font-bold">
                    {isArabic ? "البرنامج غير متوفر حالياً لهذه المادة." : "Programme non disponible pour cette sélection."}
                </div>
            ) : (
                <motion.div
                    key={activeDomaine}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="rounded-[3rem] border border-slate-100 shadow-2xl shadow-slate-200/50 bg-white overflow-hidden"
                >
                    <div className={cn("bg-slate-50/50 backdrop-blur-sm border-b p-8 md:p-10 transition-colors duration-500",
                        activeDomaine === 'arabe' ? 'border-blue-100' : activeDomaine === 'islamique' ? 'border-emerald-100' : 'border-purple-100'
                    )}>
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                            <div className="flex items-center gap-5">
                                <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner transition-colors duration-500",
                                    activeDomaine === 'arabe' ? 'bg-blue-100 text-blue-600' :
                                        activeDomaine === 'islamique' ? 'bg-emerald-100 text-emerald-600' :
                                            'bg-purple-100 text-purple-600'
                                )}>
                                    <activeDomainConfig.icon className="h-7 w-7" />
                                </div>
                                <div>
                                    <h2 className="text-3xl font-black text-slate-900 tracking-tighter font-cairo">
                                        {isArabic ? activeDomainConfig.ar : activeDomainConfig.fr}
                                    </h2>
                                    <p className="text-slate-500 font-bold uppercase tracking-widest text-[10px] mt-1 font-tajawal">
                                        {isArabic ? `البرنامج الرسمي • ${level}` : `Programme Officiel • ${level}`}
                                    </p>
                                </div>
                            </div>
                            <div className={cn("px-6 py-2 rounded-full font-black text-xs uppercase tracking-widest border transition-colors duration-500 block font-tajawal shrink-0 text-center",
                                activeDomaine === 'arabe' ? 'bg-blue-50 text-blue-700 border-blue-100' :
                                    activeDomaine === 'islamique' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' :
                                        'bg-purple-50 text-purple-700 border-purple-100'
                            )}>
                                {curriculum.themes.length} {isArabic ? "مقاطع" : "Séquences"}
                            </div>
                        </div>
                    </div>

                    <div className="p-4 md:p-8">
                        <Accordion type="multiple" className="space-y-4">
                            {curriculum.themes.map((theme, idx) => (
                                <AccordionItem
                                    key={idx}
                                    value={`theme-${idx}`}
                                    className={cn("border border-slate-100 rounded-[2rem] px-4 md:px-8 py-2 transition-all data-[state=open]:bg-slate-50/80",
                                        activeDomaine === 'arabe' ? 'hover:bg-blue-50/30 data-[state=open]:border-blue-100' :
                                            activeDomaine === 'islamique' ? 'hover:bg-emerald-50/30 data-[state=open]:border-emerald-100' :
                                                'hover:bg-purple-50/30 data-[state=open]:border-purple-100'
                                    )}
                                >
                                    <AccordionTrigger className="hover:no-underline py-6 group">
                                        <div className="flex flex-col items-start text-left">
                                            <div className="flex items-center gap-5">
                                                <div className={cn("w-12 h-12 bg-white rounded-2xl shadow-md border border-slate-100 flex items-center justify-center font-black text-lg group-hover:scale-110 transition-transform",
                                                    activeDomaine === 'arabe' ? 'text-blue-600' : activeDomaine === 'islamique' ? 'text-emerald-600' : 'text-purple-600'
                                                )}>
                                                    {idx + 1}
                                                </div>
                                                <span className={cn("font-extrabold text-2xl text-slate-800 transition-colors tracking-tight font-cairo",
                                                    activeDomaine === 'arabe' ? 'group-hover:text-blue-600' :
                                                        activeDomaine === 'islamique' ? 'group-hover:text-emerald-600' :
                                                            'group-hover:text-purple-600'
                                                )}>{theme.title}</span>
                                            </div>
                                            {theme.introduction && (
                                                <span className="text-sm text-slate-500 font-bold mt-3 ml-16 max-w-2xl leading-relaxed font-tajawal">{theme.introduction}</span>
                                            )}
                                        </div>
                                    </AccordionTrigger>
                                    <AccordionContent className="pb-10 pt-4 ml-0 md:ml-16">
                                        <div className="grid gap-6">
                                            {theme.lessons.map((lesson, lIdx) => (
                                                <motion.div
                                                    key={lesson.id}
                                                    whileHover={{ y: -5 }}
                                                    className={cn("group p-6 rounded-[2rem] border border-slate-100 bg-white transition-all duration-500 cursor-pointer relative overflow-hidden",
                                                        activeDomaine === 'arabe' ? 'hover:border-blue-200 hover:shadow-2xl hover:shadow-blue-500/10' :
                                                            activeDomaine === 'islamique' ? 'hover:border-emerald-200 hover:shadow-2xl hover:shadow-emerald-500/10' :
                                                                'hover:border-purple-200 hover:shadow-2xl hover:shadow-purple-500/10'
                                                    )}
                                                    onClick={() => onSelectLesson?.(lesson.id)}
                                                >
                                                    <div className="flex justify-between items-start mb-4">
                                                        <div className="space-y-1">
                                                            <h4 className={cn("font-black text-xl text-slate-900 transition-colors tracking-tight font-cairo",
                                                                activeDomaine === 'arabe' ? 'group-hover:text-blue-600' :
                                                                    activeDomaine === 'islamique' ? 'group-hover:text-emerald-600' :
                                                                        'group-hover:text-purple-600'
                                                            )}>
                                                                {isArabic ? lesson.title : lesson.title_fr}
                                                            </h4>
                                                            <div className="flex items-center gap-2">
                                                                <p className="text-sm font-bold text-slate-400 uppercase tracking-widest text-[9px] font-tajawal">
                                                                    {isArabic ? `الوحدة ${lIdx + 1}` : `Unité ${lIdx + 1}`}
                                                                </p>
                                                                {isArabic && (
                                                                    <span className="text-[10px] font-bold text-slate-300 italic">{lesson.title_fr}</span>
                                                                )}
                                                            </div>
                                                        </div>
                                                        {lesson.duration && (
                                                            <div className={cn("flex items-center gap-2 text-[10px] font-black uppercase px-3 py-1.5 rounded-full border shadow-sm font-tajawal",
                                                                activeDomaine === 'arabe' ? 'text-blue-600 bg-blue-50 border-blue-100' :
                                                                    activeDomaine === 'islamique' ? 'text-emerald-600 bg-emerald-50 border-emerald-100' :
                                                                        'text-purple-600 bg-purple-50 border-purple-100'
                                                            )}>
                                                                <Clock className="h-3 w-3" />
                                                                {lesson.duration}
                                                            </div>
                                                        )}
                                                    </div>

                                                    <p className="text-slate-600 mb-6 font-semibold leading-relaxed text-sm italic font-tajawal">{lesson.description}</p>

                                                    <div className="flex flex-wrap gap-2">
                                                        {lesson.objectives && lesson.objectives.map((obj: string, i: number) => (
                                                            <div key={i} className={cn("flex items-center gap-3 text-[11px] px-4 py-2 rounded-2xl border font-bold font-tajawal",
                                                                activeDomaine === 'arabe' ? 'bg-blue-50/50 border-blue-100/50 text-blue-700' :
                                                                    activeDomaine === 'islamique' ? 'bg-emerald-50/50 border-emerald-100/50 text-emerald-700' :
                                                                        'bg-purple-50/50 border-purple-100/50 text-purple-700'
                                                            )}>
                                                                <Sparkles className={cn("w-3.5 h-3.5",
                                                                    activeDomaine === 'arabe' ? 'text-blue-500' : activeDomaine === 'islamique' ? 'text-emerald-500' : 'text-purple-500'
                                                                )} />
                                                                {obj}
                                                            </div>
                                                        ))}
                                                    </div>

                                                    <div className="absolute bottom-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity">
                                                        <ChevronRight className={cn("w-6 h-6",
                                                            activeDomaine === 'arabe' ? 'text-blue-600' : activeDomaine === 'islamique' ? 'text-emerald-600' : 'text-purple-600'
                                                        )} />
                                                    </div>
                                                </motion.div>
                                            ))}
                                        </div>
                                    </AccordionContent>
                                </AccordionItem>
                            ))}
                        </Accordion>
                    </div>
                </motion.div>
            )}
        </div>
    );
}

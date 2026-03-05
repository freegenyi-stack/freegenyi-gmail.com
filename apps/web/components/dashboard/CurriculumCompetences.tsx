"use client";

import { useChild } from "@/lib/context/ChildContext";
import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { ShieldCheck, Crosshair, BarChart3, ChevronRight, Sparkles, Target, Lightbulb, CheckCircle2, LayoutGrid, Info, BookOpen, Star, Landmark } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion";

interface Competence {
    id: string;
    name: string;
    name_fr: string;
    description: string;
    description_fr: string;
    outcomes?: string;
    difficulty?: number;
    bloom?: string;
    indicators: {
        id: string;
        text: string;
        text_fr: string;
        bloom: string;
    }[];
}

interface SkillTheme {
    id: number;
    title: string;
    title_fr: string;
    icon: string;
    color: string;
    skills: Competence[];
}

interface BloomSummary {
    [key: string]: {
        percentage: string;
        count: number;
        typical_skills: string[];
    };
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

export function CurriculumCompetences({ country, level, subject }: { country: string, level: string, subject: string }) {
    const { activeChild } = useChild();
    const [activeDomaine, setActiveDomaine] = useState<Domaine>('arabe');
    const [data, setData] = useState<{ globalSkills: Competence[], bloomSummary: BloomSummary, skillsByTheme: SkillTheme[] } | null>(null);
    const [loading, setLoading] = useState(true);
    const [activeTheme, setActiveTheme] = useState<string | null>(null);

    const isArabic = country === 'dz';

    useEffect(() => {
        setLoading(true);
        // ANNOTATION: Fetching dynamically based on the selected domaine tab
        fetch(`/api/curriculum/${country}/${level}/${subject}?dataType=competences&domaine=${activeDomaine}`)
            .then(res => res.json())
            .then(data => {
                setData(data);
                setLoading(false);
                if (data.skillsByTheme?.[0]) {
                    setActiveTheme(`theme-${data.skillsByTheme[0].id}`);
                }
            })
            .catch(() => setLoading(false));
    }, [country, level, subject, activeDomaine]);

    const activeDomainConfig = DOMAIN_DEF[activeDomaine];

    const bloomLabels: Record<string, { label: string, color: string, bg: string }> = {
        'level_1_remember': { label: 'Mémoriser', color: 'text-blue-600', bg: 'bg-blue-50' },
        'level_2_understand': { label: 'Comprendre', color: 'text-emerald-600', bg: 'bg-emerald-50' },
        'level_3_apply': { label: 'Appliquer', color: 'text-orange-600', bg: 'bg-orange-50' },
        'level_4_analyze': { label: 'Analyser', color: 'text-purple-600', bg: 'bg-purple-50' },
    };

    const bloomLabelsAr: Record<string, string> = {
        'level_1_remember': 'تذكر',
        'level_2_understand': 'فهم',
        'level_3_apply': 'تطبيق',
        'level_4_analyze': 'تحليل',
    };

    return (
        <div className={cn("space-y-8 pb-10", isArabic && "font-arabic")} dir={isArabic ? "rtl" : "ltr"}>

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
                                    layoutId="activeTabBadge"
                                    className={cn(`absolute -bottom-1 left-1/2 -translate-x-1/2 w-1.5 h-1.5 rounded-full bg-${cfg.color}-500`)}
                                />
                            )}
                        </button>
                    )
                })}
            </div>

            {loading ? (
                <div className="space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {[1, 2, 3].map(i => <Skeleton key={i} className="h-32 rounded-[2rem]" />)}
                    </div>
                    <Skeleton className="h-96 rounded-[2.5rem]" />
                </div>
            ) : !data ? null : (
                <motion.div
                    key={activeDomaine}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-8"
                >
                    {/* ── Intro & Skill Map Summary ─────────────────────────────── */}
                    <div className={cn("rounded-[2.5rem] border shadow-xl p-10 relative overflow-hidden transition-colors duration-500",
                        activeDomaine === 'arabe' ? 'bg-white border-blue-100 shadow-blue-500/5' :
                            activeDomaine === 'islamique' ? 'bg-white border-emerald-100 shadow-emerald-500/5' :
                                'bg-white border-purple-100 shadow-purple-500/5'
                    )}>
                        <div className={cn("absolute top-0 right-0 w-64 h-64 rounded-full blur-3xl -mr-32 -mt-32 opacity-20 transition-colors duration-500",
                            activeDomaine === 'arabe' ? 'bg-blue-500' :
                                activeDomaine === 'islamique' ? 'bg-emerald-500' : 'bg-purple-500'
                        )} />

                        <div className="relative z-10 flex flex-col md:flex-row justify-between gap-10 items-start">
                            <div className="space-y-4 max-w-xl text-right">
                                <div className="relative mb-6 group">
                                    <div className={cn("absolute inset-0 blur-xl rounded-full opacity-0 group-hover:opacity-100 transition-opacity",
                                        activeDomaine === 'arabe' ? 'bg-blue-500/20' : activeDomaine === 'islamique' ? 'bg-emerald-500/20' : 'bg-purple-500/20'
                                    )} />
                                    <div className={cn("relative w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-xl transform rotate-3 hover:rotate-0 transition-all duration-500 bg-gradient-to-br", activeDomainConfig.themeGradient)}>
                                        <activeDomainConfig.icon className="w-8 h-8 drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
                                    </div>
                                </div>
                                <h2 className="text-4xl md:text-5xl font-black tracking-tight leading-tight text-slate-900 font-cairo">
                                    {isArabic ? "خارطة كفاءات " + activeDomainConfig.ar : "Compétences de " + activeDomainConfig.fr}
                                </h2>
                                <p className="text-slate-500 text-lg font-medium leading-relaxed font-tajawal">
                                    {isArabic
                                        ? `تابع تقدم طفلك في المهارات الخاصة بـ ${activeDomainConfig.ar}. هذه اللوحة توضح أهداف التعلم المحددة بوضوح.`
                                        : `Suivez la progression de votre enfant en ${activeDomainConfig.fr}. Cette section détaille les objectifs.`
                                    }
                                </p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 w-full md:w-auto shrink-0">
                                {Object.entries(data.bloomSummary || {}).map(([key, value], i) => (
                                    <motion.div
                                        key={key}
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        transition={{ delay: i * 0.1 }}
                                        className={cn("border p-5 rounded-[2rem] flex flex-col items-center text-center group hover:bg-white hover:shadow-xl transition-all",
                                            activeDomaine === 'arabe' ? 'bg-blue-50/30 border-blue-100/50 hover:border-blue-200' :
                                                activeDomaine === 'islamique' ? 'bg-emerald-50/30 border-emerald-100/50 hover:border-emerald-200' :
                                                    'bg-purple-50/30 border-purple-100/50 hover:border-purple-200'
                                        )}
                                    >
                                        <span className={cn("text-3xl font-black mb-1", bloomLabels[key]?.color)}>
                                            {value.percentage}
                                        </span>
                                        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
                                            {isArabic ? bloomLabelsAr[key] : bloomLabels[key]?.label}
                                        </span>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Main Competencies Explorer ─────────────────────────────── */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4 px-2">
                            <div className="relative">
                                <div className={cn("absolute inset-0 blur-lg rounded-full opacity-30",
                                    activeDomaine === 'arabe' ? 'bg-blue-500' : activeDomaine === 'islamique' ? 'bg-emerald-500' : 'bg-purple-500'
                                )} />
                                <div className={cn("relative w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", activeDomainConfig.themeGradient)}>
                                    <LayoutGrid className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <h3 className={cn("text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r font-cairo", activeDomainConfig.themeGradient)}>
                                    {isArabic ? "استكشاف المهارات حسب المحور" : "Exploration par Thème"}
                                </h3>
                                <p className="text-slate-400 font-bold text-xs uppercase tracking-widest mt-0.5 font-tajawal">
                                    {isArabic ? `${data.skillsByTheme.length} محاور تعليمية` : `${data.skillsByTheme.length} thèmes abordés`}
                                </p>
                            </div>
                        </div>

                        {data.skillsByTheme.length === 0 ? (
                            <div className="p-10 text-center bg-slate-50 border border-slate-100 rounded-[2.5rem]">
                                <p className="text-slate-500 font-bold font-tajawal">{isArabic ? "لا توجد كفاءات مسجلة لهذا القسم حالياً." : "Aucune compétence enregistrée pour ce domaine."}</p>
                            </div>
                        ) : (
                            <Accordion
                                type="single"
                                collapsible
                                value={activeTheme || ""}
                                onValueChange={setActiveTheme}
                                className="space-y-4"
                            >
                                {(data.skillsByTheme || []).map((theme) => (
                                    <AccordionItem
                                        key={theme.id}
                                        value={`theme-${theme.id}`}
                                        className={cn("bg-white rounded-[2.5rem] border shadow-sm overflow-hidden px-8 py-2 data-[state=open]:shadow-xl transition-all border-none",
                                            activeDomaine === 'arabe' ? 'data-[state=open]:shadow-blue-500/10 data-[state=open]:border-blue-100' :
                                                activeDomaine === 'islamique' ? 'data-[state=open]:shadow-emerald-500/10 data-[state=open]:border-emerald-100' :
                                                    'data-[state=open]:shadow-purple-500/10 data-[state=open]:border-purple-100'
                                        )}
                                    >
                                        <AccordionTrigger className="hover:no-underline py-6">
                                            <div className="flex items-center gap-6 text-right">
                                                <div className="relative group">
                                                    <div className="absolute inset-0 bg-slate-200 blur-lg rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                                                    <div className="relative w-16 h-16 rounded-[1.5rem] flex items-center justify-center text-3xl shadow-inner bg-slate-50 group-hover:scale-110 group-hover:rotate-6 transition-all duration-500">
                                                        {theme.icon || "📚"}
                                                    </div>
                                                </div>
                                                <div className="space-y-1">
                                                    <h4 className={cn("text-2xl font-black tracking-tight leading-none transition-colors font-cairo",
                                                        activeDomaine === 'arabe' ? 'group-data-[state=open]:text-blue-600' :
                                                            activeDomaine === 'islamique' ? 'group-data-[state=open]:text-emerald-600' :
                                                                'group-data-[state=open]:text-purple-600'
                                                    )}>
                                                        {isArabic ? theme.title : theme.title_fr}
                                                    </h4>
                                                    <p className="text-slate-400 font-bold uppercase tracking-widest text-[10px] font-tajawal">
                                                        {theme.skills.length} {isArabic ? "كفاءة مستهدفة" : "compétences"}
                                                    </p>
                                                </div>
                                            </div>
                                        </AccordionTrigger>
                                        <AccordionContent className="pb-8 pt-4">
                                            {theme.skills.length === 0 ? (
                                                <p className="text-slate-400 font-bold text-sm text-center font-tajawal">
                                                    {isArabic ? "لا توجد مهارات مفصلة هنا." : "Pas de compétences détaillées ici."}
                                                </p>
                                            ) : (
                                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                                                    {theme.skills.map((skill, si) => (
                                                        <motion.div
                                                            key={skill.id}
                                                            initial={{ opacity: 0, scale: 0.95 }}
                                                            animate={{ opacity: 1, scale: 1 }}
                                                            transition={{ delay: si * 0.05 }}
                                                            className={cn("bg-slate-50/50 border p-6 rounded-[2.5rem] space-y-4 group hover:bg-white hover:shadow-xl transition-all relative",
                                                                activeDomaine === 'arabe' ? 'border-slate-100 hover:border-blue-100 hover:shadow-blue-500/5' :
                                                                    activeDomaine === 'islamique' ? 'border-slate-100 hover:border-emerald-100 hover:shadow-emerald-500/5' :
                                                                        'border-slate-100 hover:border-purple-100 hover:shadow-purple-500/5'
                                                            )}
                                                        >
                                                            <div className="flex justify-between items-start">
                                                                <div className="flex flex-col gap-2">
                                                                    <Badge className={cn("bg-white shadow-sm font-black px-2 py-0.5 text-[10px] w-fit border",
                                                                        activeDomaine === 'arabe' ? 'text-blue-600 border-blue-100' :
                                                                            activeDomaine === 'islamique' ? 'text-emerald-600 border-emerald-100' :
                                                                                'text-purple-600 border-purple-100'
                                                                    )}>
                                                                        {skill.id}
                                                                    </Badge>
                                                                    <h5 className={cn("text-lg sm:text-xl font-black text-slate-900 leading-tight transition-colors font-cairo",
                                                                        activeDomaine === 'arabe' ? 'group-hover:text-blue-600' :
                                                                            activeDomaine === 'islamique' ? 'group-hover:text-emerald-600' :
                                                                                'group-hover:text-purple-600'
                                                                    )}>
                                                                        {isArabic ? skill.name : skill.name_fr}
                                                                    </h5>
                                                                </div>
                                                                <div className={cn(
                                                                    "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest shrink-0 ml-2",
                                                                    skill.bloom ? bloomLabels[skill.bloom]?.bg || 'bg-slate-100' : 'bg-slate-100',
                                                                    skill.bloom ? bloomLabels[skill.bloom]?.color || 'text-slate-600' : 'text-slate-600'
                                                                )}>
                                                                    {isArabic ? bloomLabelsAr[skill.bloom || ''] : bloomLabels[skill.bloom || '']?.label}
                                                                </div>
                                                            </div>

                                                            {/* Only render outcome box if there is description or outcomes */}
                                                            {(skill.outcomes || skill.description_fr || skill.name_fr) && (
                                                                <div className="bg-white p-5 rounded-[1.5rem] border border-slate-100/50 shadow-sm">
                                                                    <p className="text-slate-700 text-sm font-bold leading-relaxed font-tajawal">
                                                                        {isArabic ? skill.outcomes || skill.name : skill.name_fr}
                                                                    </p>
                                                                    {!isArabic && skill.description_fr && (
                                                                        <p className="text-xs text-slate-400 mt-2 italic font-tajawal">{skill.description_fr}</p>
                                                                    )}
                                                                </div>
                                                            )}

                                                            <div className="space-y-3">
                                                                <div className="flex items-center gap-2 text-slate-400">
                                                                    <CheckCircle2 className={cn("w-4 h-4",
                                                                        activeDomaine === 'arabe' ? 'text-blue-500' :
                                                                            activeDomaine === 'islamique' ? 'text-emerald-500' :
                                                                                'text-purple-500'
                                                                    )} />
                                                                    <span className={cn("text-[10px] font-black uppercase tracking-widest",
                                                                        activeDomaine === 'arabe' ? 'text-blue-600/70' :
                                                                            activeDomaine === 'islamique' ? 'text-emerald-600/70' :
                                                                                'text-purple-600/70'
                                                                    )}>{isArabic ? "مؤشرات النجاح" : "Indicateurs"}</span>
                                                                </div>
                                                                <div className="space-y-2">
                                                                    {skill.indicators && skill.indicators.length > 0 ? skill.indicators.map((ind, ii) => (
                                                                        <div key={ii} className="flex gap-3 text-right">
                                                                            <div className={cn("w-1.5 h-1.5 rounded-full mt-2 shrink-0",
                                                                                activeDomaine === 'arabe' ? 'bg-blue-400' :
                                                                                    activeDomaine === 'islamique' ? 'bg-emerald-400' :
                                                                                        'bg-purple-400'
                                                                            )} />
                                                                            <p className="text-xs font-bold text-slate-600 leading-snug font-tajawal">
                                                                                {isArabic ? ind.text : ind.text_fr}
                                                                            </p>
                                                                        </div>
                                                                    )) : (
                                                                        <p className="text-xs text-slate-400 italic">No indicators defined.</p>
                                                                    )}
                                                                </div>
                                                            </div>

                                                            {/* Coaching Tip */}
                                                            <div className="pt-2">
                                                                <div className="bg-amber-50 rounded-2xl p-4 border border-amber-100/50 flex gap-4 items-center">
                                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-amber-500 shadow-sm shrink-0">
                                                                        <Lightbulb className="w-5 h-5" />
                                                                    </div>
                                                                    <p className="text-[11px] text-amber-900 font-bold italic leading-tight">
                                                                        {isArabic
                                                                            ? `نصيحة للمراجعة: ركزوا على هذه المهارة عبر أنشطة يومية بسيطة.`
                                                                            : `Astuce Coach : Encouragez l'acquisition de cette compétence au quotidien.`
                                                                        }
                                                                    </p>
                                                                </div>
                                                            </div>
                                                        </motion.div>
                                                    ))}
                                                </div>
                                            )}
                                        </AccordionContent>
                                    </AccordionItem>
                                ))}
                            </Accordion>
                        )}
                    </div>

                    {/* ── Global Skills Final Section ───────────────────────────── */}
                    <div className="space-y-6 pt-6">
                        <div className="flex items-center gap-4 px-2">
                            <div className="relative">
                                <div className={cn("absolute inset-0 blur-lg rounded-full opacity-30",
                                    activeDomaine === 'arabe' ? 'bg-blue-500' : activeDomaine === 'islamique' ? 'bg-emerald-500' : 'bg-purple-500'
                                )} />
                                <div className={cn("relative w-12 h-12 rounded-xl flex items-center justify-center text-white shadow-lg bg-gradient-to-br", activeDomainConfig.themeGradient)}>
                                    <ShieldCheck className="w-6 h-6" />
                                </div>
                            </div>
                            <div>
                                <h3 className={cn("text-2xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-r font-cairo", activeDomainConfig.themeGradient)}>
                                    {isArabic ? "الكفاءات العرضية الشاملة" : "Compétences Transversales"}
                                </h3>
                            </div>
                        </div>

                        {data.globalSkills.length === 0 ? (
                            <div className="p-6 text-center text-slate-500 font-tajawal bg-slate-50 border rounded-[2rem]">
                                {isArabic ? "لا توجد كفاءات شاملة محددة." : "Aucune compétence transversale définie."}
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                                {(data.globalSkills || []).map((skill) => (
                                    <div key={skill.id} className="bg-white p-6 rounded-[2rem] border border-slate-100 shadow-sm flex flex-col items-center text-center gap-4 hover:shadow-lg transition-all">
                                        <div className={cn("w-12 h-12 bg-slate-50 rounded-xl flex items-center justify-center",
                                            activeDomaine === 'arabe' ? 'text-blue-500' : activeDomaine === 'islamique' ? 'text-emerald-500' : 'text-purple-500'
                                        )}>
                                            <Sparkles className="w-6 h-6" />
                                        </div>
                                        <div>
                                            <h4 className="font-black text-slate-900 leading-tight">
                                                {isArabic ? skill.name : skill.name_fr}
                                            </h4>
                                            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-2">{skill.id}</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            )}
        </div>
    );
}

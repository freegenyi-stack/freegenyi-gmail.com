"use client"

import { useState, useEffect } from "react"
import dynamic from "next/dynamic"
import { useChild } from "@/lib/context/ChildContext"
import { redirect } from "next/navigation"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"
import {
    LayoutDashboard, BookOpen, PenLine, FlaskConical,
    ScrollText, FileText, Target, LogOut, RefreshCw, Bell,
    Sparkles, Award, Clock, Settings, BarChart3, Globe,
    TrendingUp, Lightbulb, MessageSquare, CheckCircle2, Calendar, User
} from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { cn } from "@/lib/utils"
import { BulletinItem } from "@/components/dashboard/parent/ParentBulletin"

// ── Dynamic imports (code-split, client-only) ─────────────────────────────────
const CurriculumViewer = dynamic(() => import("@/components/dashboard/CurriculumViewer").then(m => m.CurriculumViewer), { ssr: false })
const CurriculumCompetences = dynamic(() => import("@/components/dashboard/CurriculumCompetences").then(m => m.CurriculumCompetences), { ssr: false })
const ExerciseLibrary = dynamic(() => import("@/components/dashboard/ExerciseLibrary").then(m => m.ExerciseLibrary), { ssr: false })
const RevisionSheetList = dynamic(() => import("@/components/dashboard/RevisionSheetList").then(m => m.RevisionSheetList), { ssr: false })
const ExamBank = dynamic(() => import("@/components/dashboard/ExamBank").then(m => m.ExamBank), { ssr: false })
const UnifiedChart = dynamic(() => import("@/components/dashboard/charts/UnifiedChart").then(m => m.UnifiedChart), { ssr: false })
const SubjectProgressList = dynamic(() => import("@/components/dashboard/SubjectProgressList").then(m => m.SubjectProgressList), { ssr: false })
const ParentCoachAI = dynamic(() => import("@/components/dashboard/advanced/ParentCoachAI").then(m => m.ParentCoachAI), { ssr: false })
const NotificationsPanel = dynamic(() => import("@/components/dashboard/communication/NotificationsPanel").then(m => m.NotificationsPanel), { ssr: false })
const QuickActions = dynamic(() => import("@/components/dashboard/QuickActions").then(m => m.QuickActions), { ssr: false })
const LearningAreaCards = dynamic(() => import("@/components/dashboard/parent/LearningAreaCards").then(m => m.LearningAreaCards), { ssr: false })
const CurriculumDiscovery = dynamic(() => import("@/components/dashboard/parent/CurriculumDiscovery").then(m => m.CurriculumDiscovery), { ssr: false })
const DashboardGuidance = dynamic(() => import("@/components/dashboard/parent/DashboardGuidance").then(m => m.DashboardGuidance), { ssr: false })
const SubjectFocusView = dynamic(() => import("@/components/dashboard/parent/SubjectFocusView").then(m => m.SubjectFocusView), { ssr: false })
const ParentBulletin = dynamic(() => import("@/components/dashboard/parent/ParentBulletin").then(mod => mod.ParentBulletin), { ssr: false })
const LuxuryAnimation = dynamic(() => import("@/components/dashboard/parent/LuxuryAnimation").then(m => m.LuxuryAnimation), { ssr: false })
const DashboardTour = dynamic(() => import("@/components/dashboard/parent/DashboardTour").then(m => m.DashboardTour), { ssr: false })
const ChildSwitcher = dynamic(() => import("@/components/dashboard/ChildSwitcher").then(m => m.ChildSwitcher), { ssr: false })
const UserMenu = dynamic(() => import("@/components/layout/UserMenu").then(m => m.UserMenu), { ssr: false })

import { INSPIRATIONAL_QUOTES } from "@/lib/constants/quotes"

// ── Tab Configuration ─────────────────────────────────────────────────────────
const TABS_EN = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
    { id: 'coach', label: 'استشارة الذكاء الاصطناعي', icon: Sparkles },
    { id: 'discovery', label: 'اكتشاف العالم', icon: Globe },
]

const TABS_AR = [
    { id: 'overview', label: 'نظرة عامة', icon: LayoutDashboard },
    { id: 'analytics', label: 'التحليلات', icon: BarChart3 },
    { id: 'coach', label: 'المدرب الذكي', icon: Sparkles },
    { id: 'discovery', label: 'اكتشاف البرامج', icon: Globe },
]

// ── Quotes moved to @/lib/constants/quotes ───────────────────────────────────

function DashboardSkeleton() {
    return (
        <div className="space-y-4">
            <Skeleton className="h-36 rounded-2xl" />
            <div className="grid grid-cols-3 gap-4">
                {[1, 2, 3].map(i => <Skeleton key={i} className="h-24 rounded-2xl" />)}
            </div>
        </div>
    )
}

export default function ParentDashboardPage() {
    const { activeChild, isRegistered, isLoading, resetChild } = useChild()
    const [tab, setTab] = useState('overview')
    const [activeSubjectId, setActiveSubjectId] = useState<string | null>(null)
    const [curriculumView, setCurriculumView] = useState<'sequences' | 'competences'>('sequences')
    const [mounted, setMounted] = useState(false)
    const [quote, setQuote] = useState(INSPIRATIONAL_QUOTES[0])

    useEffect(() => {
        setMounted(true);
        setQuote(INSPIRATIONAL_QUOTES[Math.floor(Math.random() * INSPIRATIONAL_QUOTES.length)]);
    }, [])

    if (!mounted || isLoading) return <DashboardSkeleton />
    if (!isRegistered || !activeChild) {
        redirect("./onboarding")
    }

    const country = activeChild.country || 'dz'
    const level = activeChild.level || '1ap'
    const subject = 'ar'
    const isArabicLayout = country === 'dz'

    const levelLabel: Record<string, string> = {
        '1ap': isArabicLayout ? 'السنة الأولى ابتدائي' : '1ère Année Primaire',
        '2ap': isArabicLayout ? 'السنة الثانية ابتدائي' : '2ème Année Primaire',
        '3ap': '3ème AP', '1am': '1ère Année Moyenne', 'cp': 'CP'
    }
    const countryEmoji: Record<string, string> = { dz: '🇩🇿', ma: '🇲🇦', tn: '🇹🇳', fr: '🇫🇷' }
    const motivationLabels: Record<string, string> = {
        exams: 'Réussite aux examens',
        support: 'Soutien scolaire',
        culture: 'Curiosité culturelle',
        daily: 'Aide aux devoirs'
    }

    const currentTabs = isArabicLayout ? TABS_AR : TABS_EN

    return (
        <div className={cn("min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/20 to-indigo-50/10", isArabicLayout && "font-arabic")} dir={isArabicLayout ? "rtl" : "ltr"}>
            {/* ── Main Content ────────────────────────────────────────────── */}
            <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4 pb-8">

                {/* Repérage / Guidance System */}
                {!isArabicLayout && (
                    <DashboardGuidance
                        activeChildName={activeChild.name}
                        level={levelLabel[level]}
                        breadcrumb={[
                            { label: currentTabs.find(t => t.id === tab)?.label || 'Overview', active: !activeSubjectId },
                            ...(activeSubjectId ? [{ label: activeSubjectId === 'ar' ? 'Arabic' : activeSubjectId === 'math' ? 'Mathematics' : activeSubjectId.toUpperCase(), active: true }] : [])
                        ]}
                    />
                )}

                {/* Welcome Banner */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="relative overflow-hidden rounded-[1.5rem] p-4 md:p-5 mb-5 tour-welcome-banner"
                >
                    {/* Dynamic Animated Background */}
                    <div className="absolute inset-0 bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800" />
                    <div className="absolute inset-0">
                        <motion.div
                            animate={{
                                scale: [1, 1.2, 1],
                                rotate: [0, 90, 0],
                            }}
                            transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
                            className="absolute -top-1/2 -right-1/4 w-full h-full bg-blue-400/20 blur-[120px] rounded-full"
                        />
                        <motion.div
                            animate={{
                                scale: [1, 1.3, 1],
                                rotate: [0, -45, 0],
                            }}
                            transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                            className="absolute -bottom-1/2 -left-1/4 w-full h-full bg-indigo-500/20 blur-[120px] rounded-full"
                        />

                        {/* Luxury Canvas Animation Background */}
                        <LuxuryAnimation />
                    </div>

                    {/* Floating Particles Overlay */}
                    <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4wNCI+PHBhdGggZD0iTTM2IDM0djZoNnYtNmgtNnptMCAwdi02aC02djZoNnptNiA2djZoNnYtNmgtNnptLTYgMHY2aDZ2LTZoLTZ6Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-20 mix-blend-overlay" />

                    {/* Top Left: Navigation Group */}
                    <div className="absolute top-4 left-4 z-30 flex items-center gap-3">
                        <div className="tour-user-menu text-white scale-90 md:scale-95 origin-left">
                            <UserMenu />
                        </div>
                        <div className="tour-child-switcher scale-90 md:scale-95 origin-left">
                            <ChildSwitcher
                                profiles={[{
                                    id: 'active',
                                    name: activeChild.name,
                                    initials: activeChild.name.substring(0, 2).toUpperCase(),
                                    age: activeChild.age || 0
                                }]}
                                activeChildId="active"
                                onSwitch={() => { }}
                                onAddChild={() => { }}
                            />
                        </div>
                    </div>

                    {/* Top Right: Status Badges (Remis à sa place à droite) */}
                    <div className="absolute top-4 right-4 z-30 flex items-center gap-2">
                        <div className="px-2 py-0.5 bg-emerald-500/20 backdrop-blur-md border border-emerald-500/30 rounded-lg text-emerald-100 text-[8px] font-black tracking-widest flex items-center gap-1.5 font-tajawal shadow-sm">
                            <Sparkles className="w-2.5 h-2.5 text-emerald-300" />
                            {isArabicLayout
                                ? (isRegistered ? "حساب مفعل" : "قيد الإعداد")
                                : (isRegistered ? "PROFIL ACTIF" : "ONBOARDING")
                            }
                        </div>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-white text-[8px] font-black tracking-widest shadow-sm">
                            <span className="text-xs">🇩🇿</span>
                            {isArabicLayout ? "الجزائر" : "ALGERIE"}
                        </div>
                        <Badge className="bg-blue-500/20 text-blue-100 border-blue-500/30 px-2 py-0.5 rounded-lg text-[8px] font-black tracking-widest font-tajawal uppercase shadow-sm">
                            {levelLabel[level]}
                        </Badge>
                        <div className="flex items-center gap-1.5 px-2 py-0.5 bg-white/10 backdrop-blur-md border border-white/10 rounded-lg text-white text-[8px] font-black tracking-widest uppercase shadow-sm">
                            <User className="w-2.5 h-2.5 text-blue-300" />
                            {activeChild?.age || "?"} {isArabicLayout ? "سنوات" : "ANS"}
                        </div>
                    </div>

                    <div className="relative z-10 flex flex-col gap-8 mt-12 md:mt-14">
                        {/* Middle Content: Greeting & Stats Row */}
                        <div className="w-full flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 px-1">
                            {/* Left Side: Welcome Greeting */}
                            <div className="text-left flex items-baseline justify-start gap-3 flex-wrap flex-1">
                                <h1 className="text-xl md:text-3xl font-bold text-white tracking-normal font-scheherazade">
                                    {isArabicLayout ? `مرحباً بك، ولي الأمر !` : `Bienvenue, cher parent !`}
                                </h1>
                                <span className="text-lg md:text-xl font-medium text-blue-100/90 font-lateef leading-relaxed">
                                    {isArabicLayout
                                        ? `إليك لوحة التحكم لرحلة ${activeChild?.name || 'طفلك'} التعليمية.`
                                        : `Voici votre suivi pour ${activeChild?.name || 'votre enfant'}.`
                                    }
                                </span>
                            </div>

                            {/* Right Side: Quick Stats Row (Premium Design) */}
                            <div className="flex flex-wrap items-center gap-3 md:gap-5 bg-white/10 backdrop-blur-2xl px-6 py-3 rounded-[1.8rem] border border-white/20 shadow-2xl transition-all hover:bg-white/20">
                                <div className="flex flex-col min-w-[50px]">
                                    <span className="text-blue-50 text-[7px] font-black uppercase tracking-tight opacity-70">وقت التعلم</span>
                                    <span className="text-white font-black text-lg tracking-tighter leading-none">3.5h</span>
                                </div>
                                <div className="w-px h-8 bg-white/10 hidden md:block" />
                                <div className="flex flex-col min-w-[50px]">
                                    <span className="text-blue-50 text-[7px] font-black uppercase tracking-tight opacity-70">التقدم</span>
                                    <span className="text-emerald-400 font-black text-lg tracking-tighter leading-none">+12%</span>
                                </div>
                                <div className="w-px h-8 bg-white/10 hidden md:block" />
                                <div className="flex flex-col min-w-[55px]">
                                    <span className="text-blue-50 text-[7px] font-black uppercase tracking-tight opacity-70">تمارين</span>
                                    <span className="text-blue-100 font-black text-lg tracking-tighter leading-none">14</span>
                                </div>
                                <div className="w-px h-8 bg-white/10 hidden md:block" />
                                <div className="flex flex-col min-w-[55px]">
                                    <span className="text-blue-50 text-[7px] font-black uppercase tracking-tight opacity-70">الدرجة</span>
                                    <span className="text-yellow-300 font-black text-lg tracking-tighter leading-none">88%</span>
                                </div>
                            </div>
                        </div>

                        {/* Banner Footer: Quote (Left) & RSS Ticker (Right) */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pt-5 mt-2 border-t border-white/10">
                            {/* Left Side: Single Line Quote (Arabic Only + Larger Size) */}
                            <div className="flex-1 flex items-center gap-4 overflow-hidden">
                                <Award className="w-4 h-4 text-yellow-300 shrink-0" />
                                <p className="text-white text-[15px] md:text-lg font-medium font-arefruqaa italic max-w-2xl truncate leading-relaxed">
                                    " {isArabicLayout
                                        ? (quote.text.includes('[') ? quote.text.split('[')[1].replace(']', '').trim() : quote.text)
                                        : (quote.text.includes('[') ? quote.text.split('[')[0].trim() : quote.text)
                                    } "
                                    <span className="text-xs opacity-60 ml-3 not-italic font-sans">
                                        — {quote.author}
                                    </span>
                                </p>
                            </div>

                            {/* Right Side: RSS Ticker (Absolute right, pure white) */}
                            <div className="w-full md:w-[500px] lg:w-[600px] flex justify-end md:pr-0">
                                <div className="w-full text-[11px] text-white opacity-100 scale-95 origin-right">
                                    {(() => {
                                        const bulletinItems: BulletinItem[] = [
                                            {
                                                id: 'news-1',
                                                type: 'update',
                                                title: isArabicLayout ? 'جديد المنصة' : 'Platform Update',
                                                titleAr: 'جديد المنصة',
                                                content: isArabicLayout
                                                    ? 'تم إضافة وحدات جديدة لمادة التربية العلمية للمستوى الأول.'
                                                    : 'Nouveaux modules de sciences ajoutés pour le niveau 1AP.',
                                                contentAr: 'تم إضافة وحدات جديدة لمادة التربية العلمية للمستوى الأول.',
                                                icon: Sparkles,
                                                color: 'bg-blue-500'
                                            },
                                            {
                                                id: 'achievement-1',
                                                type: 'achievement',
                                                title: isArabicLayout ? 'إنجاز رائع' : 'Great Achievement',
                                                titleAr: 'إنجاز رائع',
                                                content: isArabicLayout
                                                    ? `${activeChild.name} أكمل اليوم جميع تمارين مراجعة الوحدة الأولى!`
                                                    : `${activeChild.name} a terminé tous les exercices de révision aujourd'hui !`,
                                                contentAr: `${activeChild.name} أكمل اليوم جميع تمارين مراجعة الوحدة الأولى!`,
                                                icon: TrendingUp,
                                                color: 'bg-emerald-500'
                                            },
                                            {
                                                id: 'tip-1',
                                                type: 'tip',
                                                title: isArabicLayout ? 'نصيحة تربوية' : 'Educational Tip',
                                                titleAr: 'نصيحة تربوية',
                                                content: isArabicLayout
                                                    ? 'التعيلم باللعب يرسخ المعلومة بنسبة 70% أكثر عند الطفل.'
                                                    : "L'apprentissage par le jeu augmente la rétention de 70% chez l'enfant.",
                                                contentAr: 'التعيلم باللعب يرسخ المعلومة بنسبة 70% أكثر عند الطفل.',
                                                icon: Lightbulb,
                                                color: 'bg-amber-500'
                                            },
                                            {
                                                id: 'event-1',
                                                type: 'reminder',
                                                title: isArabicLayout ? 'حدث قادم' : 'Upcoming Event',
                                                titleAr: 'حدث قادم',
                                                content: isArabicLayout
                                                    ? 'تحدي الرياضيات الوطني يبدأ يوم الأحد القادم.'
                                                    : 'Le défi national de mathématiques commence dimanche prochain.',
                                                contentAr: 'تحدي الرياضيات الوطني يبدأ يوم الأحد القادم.',
                                                icon: Calendar,
                                                color: 'bg-purple-500'
                                            }
                                        ];

                                        return (
                                            <ParentBulletin
                                                items={bulletinItems}
                                                isArabic={isArabicLayout}
                                                compact={true}
                                                className="bg-transparent border-none shadow-none h-8 overflow-hidden w-full transition-all"
                                            />
                                        );
                                    })()}
                                </div>
                            </div>
                        </div>
                    </div>



                </motion.div>

                {/* ── Tab Navigation ─────────────────────────────────────── */}
                <Tabs value={tab} onValueChange={setTab} className="space-y-8" dir={isArabicLayout ? "rtl" : "ltr"}>
                    <div className="sticky top-4 z-50 bg-white/80 backdrop-blur-2xl rounded-[1.8rem] border border-slate-200/60 p-1.5 overflow-x-auto shadow-2xl shadow-slate-200/50 no-scrollbar tour-tabs-list">
                        <TabsList className="flex gap-1.5 bg-transparent h-auto p-0 w-max">
                            {currentTabs.map(t => {
                                const Icon = t.icon
                                const isActive = tab === t.id
                                const tabStyles: Record<string, string> = {
                                    overview: 'text-blue-600',
                                    competences: 'text-emerald-600',
                                    curriculum: 'text-indigo-600',
                                    courses: 'text-amber-600',
                                    exercises: 'text-orange-600',
                                    revisions: 'text-rose-600',
                                    exams: 'text-red-600',
                                }
                                const textColor = tabStyles[t.id] || 'text-slate-600'

                                return (
                                    <TabsTrigger
                                        key={t.id}
                                        value={t.id}
                                        className={cn(
                                            "flex items-center gap-2.5 px-4 py-2.5 rounded-[1.3rem] transition-all duration-500 relative group shrink-0",
                                            "data-[state=active]:bg-white data-[state=active]:shadow-xl data-[state=active]:shadow-slate-200/60",
                                            "hover:bg-slate-50/80"
                                        )}
                                    >
                                        {isActive && (
                                            <motion.div
                                                layoutId="activeTab"
                                                className="absolute inset-0 bg-white rounded-[1.2rem] shadow-sm -z-10"
                                                transition={{ type: "spring", bounce: 0.2, duration: 0.6 }}
                                            />
                                        )}
                                        <div className={cn(
                                            "w-10 h-10 rounded-xl flex items-center justify-center transition-all duration-500 relative overflow-hidden",
                                            isActive ? "scale-110 rotate-3" : "bg-white",
                                            "group-hover:scale-105"
                                        )}>
                                            {isActive && (
                                                <div className={cn("absolute inset-0 bg-current opacity-10 blur-md", textColor)} />
                                            )}
                                            <div className={cn(
                                                "relative z-10 w-full h-full flex items-center justify-center rounded-xl",
                                                isActive ? cn("bg-gradient-to-br from-white to-slate-100 shadow-inner p-2", textColor) : "p-2"
                                            )}>
                                                <Icon className={cn("w-5 h-5", isActive ? textColor : "text-slate-400")} />
                                            </div>
                                        </div>
                                        <span className={cn(
                                            "font-black text-sm tracking-tight transition-colors duration-300",
                                            isActive ? "text-slate-900" : "text-slate-500"
                                        )}>
                                            {t.label}
                                        </span>
                                    </TabsTrigger>
                                )
                            })}
                        </TabsList>
                    </div>

                    <AnimatePresence mode="wait">
                        <motion.div
                            key={tab}
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={{ opacity: 0, x: -20 }}
                            transition={{ duration: 0.3 }}
                        >
                            {/* ── Overview Tab ─────────────────────────────────────── */}
                            <TabsContent value="overview" className="space-y-6 outline-none m-0">
                                <AnimatePresence mode="wait">
                                    {activeSubjectId ? (
                                        <motion.div
                                            key="subject-focus"
                                            initial={{ opacity: 0, scale: 0.98 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            exit={{ opacity: 0, scale: 0.98 }}
                                        >
                                            <SubjectFocusView
                                                subjectId={activeSubjectId}
                                                subjectName={activeSubjectId === 'ar' ? (isArabicLayout ? 'اللغة العربية' : 'Arabic Language') : activeSubjectId === 'isl' ? (isArabicLayout ? 'التربية الإسلامية' : 'Islamic Education') : activeSubjectId === 'civ' ? (isArabicLayout ? 'التربية المدنية' : 'Civic Education') : activeSubjectId === 'math' ? (isArabicLayout ? 'الرياضيات' : 'Mathematics') : (isArabicLayout ? 'التربية العلمية' : 'Science Education')}
                                                icon={activeSubjectId === 'ar' ? '📚' : activeSubjectId === 'isl' ? '☪️' : activeSubjectId === 'civ' ? '🏛️' : activeSubjectId === 'math' ? '🔢' : '🧪'}
                                                progress={45}
                                                onBack={() => setActiveSubjectId(null)}
                                                country={country}
                                                level={level}
                                                isArabic={isArabicLayout}
                                                onSwitchSubject={setActiveSubjectId}
                                                allSubjects={[
                                                    { id: 'ar', name: isArabicLayout ? 'العربية' : 'Arabic', icon: '📚', color: 'text-blue-500' },
                                                    { id: 'isl', name: isArabicLayout ? 'الإسلامية' : 'Islamic', icon: '☪️', color: 'text-emerald-500' },
                                                    { id: 'math', name: isArabicLayout ? 'الرياضيات' : 'Maths', icon: '🔢', color: 'text-indigo-500' }
                                                ]}
                                            />
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            key="overview-grid"
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="grid grid-cols-1 lg:grid-cols-3 gap-6"
                                        >
                                            <div className="lg:col-span-2 space-y-6">
                                                <div className="bg-white/70 backdrop-blur-sm rounded-3xl border border-slate-200/60 p-8 shadow-sm tour-learning-hubs">
                                                    <div className="flex items-center gap-4 mb-8">
                                                        <div className="w-1 h-8 rounded-full bg-gradient-to-b from-blue-500 to-indigo-600" />
                                                        <div>
                                                            <h2 className="text-xl font-black text-slate-900 font-outfit leading-none">مراكز التعلم (Learning Hubs)</h2>
                                                            <p className="text-xs text-slate-400 font-semibold mt-0.5 tracking-wide">انقر على مادة للاستكشاف</p>
                                                        </div>
                                                    </div>
                                                    <LearningAreaCards onSelectSubject={setActiveSubjectId} />
                                                </div>

                                                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                                    <CurriculumDiscovery />
                                                </div>

                                                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm tour-analytics">
                                                    <div className="flex items-center justify-between mb-6">
                                                        <div>
                                                            <h2 className="text-xl font-bold text-slate-900 font-outfit">النشاط الأسبوعي</h2>
                                                            <p className="text-slate-500 text-sm">وقت التعلم والنتيجة العامة</p>
                                                        </div>
                                                        <div className="flex items-center gap-2 bg-blue-50 px-3 py-1 rounded-full text-blue-600 font-bold text-[10px]">
                                                            <Sparkles className="w-3 h-3" />
                                                            تحديث فوري
                                                        </div>
                                                    </div>
                                                    <UnifiedChart childId="default" />
                                                </div>

                                                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm tour-progress-details">
                                                    <h2 className="text-xl font-bold text-slate-900 mb-6 font-outfit">تفاصيل التقدم</h2>
                                                    <SubjectProgressList subjects={[
                                                        { id: 's1', name: 'اللغة العربية', progress: 35, color: 'bg-blue-500', target: 100, icon: '📚' },
                                                        { id: 's2', name: 'التربية الإسلامية', progress: 20, color: 'bg-emerald-500', target: 100, icon: '☪️' },
                                                        { id: 's3', name: 'التربية المدنية', progress: 15, color: 'bg-purple-500', target: 100, icon: '🏛️' },
                                                    ]} />
                                                </div>
                                            </div>
                                            <div className="space-y-6">
                                                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                                    <QuickActions childName={activeChild.name} />
                                                </div>
                                                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm overflow-hidden relative group tour-ai-coach">
                                                    <div className="absolute top-0 right-0 w-32 h-32 bg-blue-500/5 rounded-full blur-3xl -mr-16 -mt-16 group-hover:bg-blue-500/10 transition-all" />
                                                    <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2 font-outfit">
                                                        <Sparkles className="w-5 h-5 text-blue-500" />
                                                        استشارة الذكاء الاصطناعي
                                                    </h2>
                                                    <ParentCoachAI childName={activeChild.name} />
                                                </div>
                                            </div>
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </TabsContent>

                            {/* ── Analytics Tab ─────────────────────────────────────── */}
                            <TabsContent value="analytics" className="space-y-6 outline-none m-0">
                                <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                    <div className="flex items-center justify-between mb-8">
                                        <div>
                                            <h2 className="text-2xl font-black text-slate-900 font-outfit">تحليلات التعلم</h2>
                                            <p className="text-slate-500 text-sm font-medium">رؤى عميقة حول رحلة طفلك التعليمية</p>
                                        </div>
                                        <div className="flex items-center gap-2 bg-blue-50 px-4 py-2 rounded-full text-blue-600 font-bold text-xs">
                                            <BarChart3 className="w-4 h-4" />
                                            تقرير كامل
                                        </div>
                                    </div>
                                    <UnifiedChart childId="default" />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                        <h3 className="text-lg font-bold text-slate-900 mb-6 font-outfit">التقدم حسب المادة</h3>
                                        <SubjectProgressList subjects={[
                                            { id: 's1', name: 'اللغة العربية', progress: 35, color: 'bg-blue-500', target: 100, icon: '📚' },
                                            { id: 's2', name: 'التربية الإسلامية', progress: 20, color: 'bg-emerald-500', target: 100, icon: '☪️' },
                                            { id: 's3', name: 'التربية المدنية', progress: 15, color: 'bg-purple-500', target: 100, icon: '🏛️' },
                                        ]} />
                                    </div>
                                    <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm">
                                        <h3 className="text-lg font-bold text-slate-900 mb-6 font-outfit">الخطوات القادمة</h3>
                                        <div className="space-y-4">
                                            {[1, 2].map(i => (
                                                <div key={i} className="flex items-center gap-4 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                                    <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-primary shadow-sm font-bold text-xs italic">
                                                        M{i}
                                                    </div>
                                                    <div>
                                                        <p className="text-xs font-bold text-slate-900">تقييم الفصل {i}</p>
                                                        <p className="text-[10px] text-slate-500 font-medium">قادم خلال أسبوعين</p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </TabsContent>

                            {/* ── AI Coach Tab ─────────────────────────────────────── */}
                            <TabsContent value="coach" className="outline-none m-0">
                                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                                    <div className="lg:col-span-2 space-y-6">
                                        <div className="bg-white rounded-3xl border border-slate-100 p-8 shadow-sm min-h-[500px]">
                                            <div className="flex items-center gap-3 mb-8">
                                                <div className="w-12 h-12 bg-primary/10 rounded-2xl flex items-center justify-center text-primary">
                                                    <Sparkles className="w-6 h-6" />
                                                </div>
                                                <div>
                                                    <h2 className="text-2xl font-black text-slate-900 font-outfit">استشارة الذكاء الاصطناعي</h2>
                                                    <p className="text-slate-500 text-sm font-medium">إرشادات مخصصة لنجاح طفلك</p>
                                                </div>
                                            </div>
                                            <ParentCoachAI childName={activeChild.name} />
                                        </div>
                                    </div>
                                    <div className="space-y-6">
                                        <div className="bg-primary rounded-3xl p-8 text-white shadow-xl shadow-primary/20">
                                            <Sparkles className="w-8 h-8 text-yellow-300 mb-4" />
                                            <h3 className="text-xl font-bold mb-2 font-outfit tracking-tight">دعم استباقي</h3>
                                            <p className="text-sm font-medium opacity-90 leading-relaxed mb-6">
                                                بناءً على نشاط {activeChild.name} الأخير، يقترح المدرب التركيز على التربية الإسلامية هذا الظهيرة.
                                            </p>
                                            <Button className="w-full bg-white text-primary hover:bg-slate-50 font-bold rounded-xl">
                                                إنشاء خطة جلسة
                                            </Button>
                                        </div>
                                        <QuickActions childName={activeChild.name} />
                                    </div>
                                </div>
                            </TabsContent>

                            {/* ── Curriculum Discovery Tab ──────────────────────────── */}
                            <TabsContent value="discovery" className="outline-none m-0 pb-12">
                                <CurriculumDiscovery />
                            </TabsContent>
                        </motion.div>
                    </AnimatePresence>

                </Tabs>
            </main >

            <DashboardTour isArabic={isArabicLayout} />
        </div >
    )
}

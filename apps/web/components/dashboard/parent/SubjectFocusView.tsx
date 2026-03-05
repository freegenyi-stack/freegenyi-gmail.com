"use client"

import { useState } from "react"
import { motion } from "framer-motion"
import {
    BookOpen,
    PenLine,
    FlaskConical,
    FileText,
    Target,
    ChevronLeft,
    ChevronRight,
    Star,
    Award,
    Clock,
    Sparkles,
    ArrowLeft
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Progress } from "@/components/ui/progress"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import dynamic from "next/dynamic"

const CurriculumViewer = dynamic(() => import("@/components/dashboard/CurriculumViewer").then(m => m.CurriculumViewer), { ssr: false })
const ExerciseLibrary = dynamic(() => import("@/components/dashboard/ExerciseLibrary").then(m => m.ExerciseLibrary), { ssr: false })
const RevisionSheetList = dynamic(() => import("@/components/dashboard/RevisionSheetList").then(m => m.RevisionSheetList), { ssr: false })
const ExamBank = dynamic(() => import("@/components/dashboard/ExamBank").then(m => m.ExamBank), { ssr: false })
const CurriculumCompetences = dynamic(() => import("@/components/dashboard/CurriculumCompetences").then(m => m.CurriculumCompetences), { ssr: false })

interface SubjectFocusViewProps {
    subjectId: string
    subjectName: string
    icon: string
    progress: number
    onBack: () => void
    allSubjects: { id: string, name: string, icon: string, color: string }[]
    onSwitchSubject: (id: string) => void
    country: string
    level: string
    isArabic?: boolean
}

export function SubjectFocusView({
    subjectId,
    subjectName,
    icon,
    progress,
    onBack,
    allSubjects,
    onSwitchSubject,
    country,
    level,
    isArabic = false
}: SubjectFocusViewProps) {
    const [activeTab, setActiveTab] = useState<'lessons' | 'skills' | 'exercises' | 'revisions' | 'exams'>('lessons')

    const tabs = isArabic ? [
        { id: 'skills', label: 'الكفاءات', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'lessons', label: 'الدروس', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'exercises', label: 'التمارين', icon: PenLine, color: 'text-purple-600', bg: 'bg-purple-50' },
        { id: 'revisions', label: 'المراجعة', icon: FlaskConical, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 'exams', label: 'الامتحانات', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
    ] : [
        { id: 'skills', label: 'Skills', icon: Target, color: 'text-emerald-600', bg: 'bg-emerald-50' },
        { id: 'lessons', label: 'Lessons', icon: BookOpen, color: 'text-blue-600', bg: 'bg-blue-50' },
        { id: 'exercises', label: 'Exercises', icon: PenLine, color: 'text-purple-600', bg: 'bg-purple-50' },
        { id: 'revisions', label: 'Revision', icon: FlaskConical, color: 'text-amber-600', bg: 'bg-amber-50' },
        { id: 'exams', label: 'Exams', icon: FileText, color: 'text-rose-600', bg: 'bg-rose-50' },
    ]

    return (
        <div className={cn("space-y-6", isArabic && "font-arabic")} dir={isArabic ? "rtl" : "ltr"}>
            {/* Subject Strip - Keeping an eye on other subjects */}
            <div className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-slate-100 shadow-sm overflow-x-auto no-scrollbar">
                <button
                    onClick={onBack}
                    className="flex items-center justify-center w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:bg-primary/10 hover:text-primary transition-all shrink-0"
                >
                    <ArrowLeft className="w-5 h-5" />
                </button>
                <div className="h-6 w-[1px] bg-slate-100 shrink-0" />
                <div className="flex gap-2">
                    {allSubjects.map((s) => (
                        <button
                            key={s.id}
                            onClick={() => onSwitchSubject(s.id)}
                            className={cn(
                                "flex items-center gap-2 px-3 py-2 rounded-xl border transition-all shrink-0 font-bold text-xs",
                                s.id === subjectId
                                    ? "bg-primary border-primary text-white shadow-lg shadow-primary/20 scale-105"
                                    : "bg-white border-slate-100 text-slate-500 hover:border-primary/20"
                            )}
                        >
                            <span className="text-base">{s.icon}</span>
                            <span>{s.name}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Subject Header Card */}
            <div className="relative overflow-hidden rounded-[2.5rem] bg-white border border-slate-100 p-8 shadow-sm group">
                <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 rounded-full -mr-32 -mt-32 blur-3xl opacity-50 group-hover:opacity-100 transition-opacity" />

                <div className="relative flex flex-col md:flex-row justify-between gap-6">
                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-3xl bg-slate-50 border border-slate-100 flex items-center justify-center text-4xl shadow-sm">
                            {icon}
                        </div>
                        <div className="space-y-1">
                            <h2 className="text-3xl font-black text-slate-900 tracking-tight">{subjectName}</h2>
                            <div className="flex items-center gap-3">
                                <Badge className="bg-emerald-50 text-emerald-600 hover:bg-emerald-50 border-emerald-100/50 text-[10px] font-bold px-3">
                                    Active Learning
                                </Badge>
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">
                                    Standard Track
                                </span>
                            </div>
                        </div>
                    </div>

                    <div className="flex items-end gap-6 md:border-l md:border-slate-100 md:pl-8">
                        <div className="space-y-2 w-full md:w-48">
                            <div className="flex justify-between items-end">
                                <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">Total Mastered</span>
                                <span className="text-2xl font-black text-slate-900">{progress}%</span>
                            </div>
                            <Progress value={progress} className="h-2.5 bg-slate-100" />
                        </div>
                    </div>
                </div>
            </div>

            {/* Sub-navigation for Subject Deep Dive */}
            <div className="bg-white rounded-3xl border border-slate-100 p-1.5 flex gap-1 shadow-sm overflow-x-auto no-scrollbar">
                {tabs.map((t) => (
                    <button
                        key={t.id}
                        onClick={() => setActiveTab(t.id as any)}
                        className={cn(
                            "flex items-center gap-2.5 px-6 py-3 rounded-2xl transition-all duration-300 shrink-0 font-bold text-sm",
                            activeTab === t.id
                                ? cn("bg-white shadow-xl shadow-slate-200 border-slate-100", t.color)
                                : "text-slate-400 hover:text-slate-600 hover:bg-slate-50/50"
                        )}
                    >
                        <t.icon className={cn("w-4 h-4", activeTab === t.id ? t.color : "text-slate-300")} />
                        {t.label}
                    </button>
                ))}
            </div>

            {/* Content Area scoped to Subject */}
            <motion.div
                key={activeTab + subjectId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-[2.5rem] border border-slate-100 p-8 shadow-sm"
            >
                {activeTab === 'lessons' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 font-outfit">
                                {isArabic ? 'المنهج والدروس' : 'Curriculum & Lessons'}
                            </h3>
                            <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs h-9">
                                {isArabic ? 'مسار التعلم' : 'View Learning Path'}
                            </Button>
                        </div>
                        <CurriculumViewer country={country} level={level} subject={subjectId} onSelectLesson={(id) => { }} />
                    </div>
                )}

                {activeTab === 'skills' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 font-outfit">
                                {isArabic ? 'الكفاءات المستهدفة' : 'Target Competencies'}
                            </h3>
                        </div>
                        <CurriculumCompetences country={country} level={level} subject={subjectId} />
                    </div>
                )}

                {activeTab === 'exercises' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900 font-outfit">
                                {isArabic ? 'التدريب والتمارين' : 'Practice & Training'}
                            </h3>
                            <Button variant="outline" size="sm" className="rounded-xl font-bold text-xs h-9">
                                {isArabic ? 'التحدي اليومي' : 'Daily Challenge'}
                            </Button>
                        </div>
                        <ExerciseLibrary childId="default" filters={{ subject: subjectId, country, level }} />
                    </div>
                )}

                {activeTab === 'revisions' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900">
                                {isArabic ? 'أوراق المراجعة' : 'Revision Sheets'}
                            </h3>
                        </div>
                        <RevisionSheetList childId="default" />
                    </div>
                )}

                {activeTab === 'exams' && (
                    <div className="space-y-6">
                        <div className="flex items-center justify-between">
                            <h3 className="text-xl font-bold text-slate-900">
                                {isArabic ? 'التقييمات والامتحانات' : 'Evaluations & Exams'}
                            </h3>
                        </div>
                        <ExamBank childId="default" />
                    </div>
                )}
            </motion.div>
        </div>
    )
}

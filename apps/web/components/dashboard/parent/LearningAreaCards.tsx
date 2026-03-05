"use client"

import { motion } from "framer-motion"
import {
    ArrowUpRight,
    Sparkles,
    Languages,
    Microscope,
    Palette,
    Lock
} from "lucide-react"
import { cn } from "@/lib/utils"

interface Subject {
    id: string
    name: string
    progress: number
    icon?: string | React.ReactNode
    isSoon?: boolean
}

interface LearningHub {
    id: string
    title: string
    titleAr: string
    description: string
    icon: React.ElementType
    subjects: Subject[]
    color: string
    textColor: string
    bgFrom: string
    bgTo: string
    borderColor: string
    glowColor: string
    barGradient: string
    accentDark: string
}

const DEFAULT_HUBS: LearningHub[] = [
    {
        id: "linguistic",
        title: "Linguistic & Values",
        titleAr: "اللغات والقيم",
        description: "أساسيات التواصل والتعبير، الهوية والتفكير الأخلاقي.",
        icon: Languages,
        color: "bg-blue-600",
        textColor: "text-blue-700",
        bgFrom: "from-blue-500/10",
        bgTo: "to-indigo-600/10",
        borderColor: "border-blue-200/80",
        glowColor: "rgba(99,102,241,0.18)",
        barGradient: "from-blue-500 to-indigo-500",
        accentDark: "bg-blue-600",
        subjects: [
            { id: "ar", name: "اللغة العربية", progress: 35, icon: "📚" },
            { id: "isl", name: "التربية الإسلامية", progress: 20, icon: "☪️" },
            { id: "civ", name: "التربية المدنية", progress: 15, icon: "🏛️" }
        ]
    },
    {
        id: "scientific",
        title: "STEM & Logic",
        titleAr: "العلوم والمنطق",
        description: "تطوير التفكير التحليلي، الرياضيات والاستكشاف العلمي.",
        icon: Microscope,
        color: "bg-emerald-600",
        textColor: "text-emerald-700",
        bgFrom: "from-emerald-500/10",
        bgTo: "to-teal-600/10",
        borderColor: "border-emerald-200/80",
        glowColor: "rgba(16,185,129,0.18)",
        barGradient: "from-emerald-500 to-teal-500",
        accentDark: "bg-emerald-600",
        subjects: [
            { id: "math", name: "الرياضيات", progress: 45, icon: "🔢" },
            { id: "sci", name: "التربية العلمية", progress: 10, icon: "🧪" }
        ]
    },
    {
        id: "artistic",
        title: "Arts & Life",
        titleAr: "الفنون والحياة",
        description: "التعبير الإبداعي، الموسيقى والتنمية الشخصية.",
        icon: Palette,
        color: "bg-rose-500",
        textColor: "text-rose-600",
        bgFrom: "from-rose-500/10",
        bgTo: "to-pink-600/10",
        borderColor: "border-rose-200/80",
        glowColor: "rgba(244,63,94,0.18)",
        barGradient: "from-rose-500 to-pink-500",
        accentDark: "bg-rose-500",
        subjects: [
            { id: "art", name: "التربية الفنية", progress: 0, isSoon: true, icon: "🎨" },
            { id: "mus", name: "التربية الموسيقية", progress: 0, isSoon: true, icon: "🎵" }
        ]
    }
]

function CircularProgress({ value, gradient, size = 56 }: { value: number; gradient: string; size?: number }) {
    const radius = (size - 8) / 2
    const circumference = 2 * Math.PI * radius
    const offset = circumference - (value / 100) * circumference

    return (
        <svg width={size} height={size} className="rotate-[-90deg]">
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="rgba(0,0,0,0.06)"
                strokeWidth={5}
            />
            <circle
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke="url(#grad)"
                strokeWidth={5}
                strokeLinecap="round"
                strokeDasharray={circumference}
                strokeDashoffset={offset}
                className="transition-all duration-1000"
            />
            <defs>
                <linearGradient id="grad" x1="0%" y1="0%" x2="100%" y2="0%">
                    <stop offset="0%" stopColor={gradient.split(' ')[0]} />
                    <stop offset="100%" stopColor={gradient.split(' ')[1] ?? gradient.split(' ')[0]} />
                </linearGradient>
            </defs>
        </svg>
    )
}

export function LearningAreaCards({
    hubs = DEFAULT_HUBS,
    onSelectSubject
}: {
    hubs?: LearningHub[],
    onSelectSubject?: (subjectId: string) => void
}) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {hubs.map((hub, index) => {
                const activeSubjects = hub.subjects.filter(s => !s.isSoon)
                const totalProgress = activeSubjects.length > 0
                    ? Math.round(activeSubjects.reduce((a, s) => a + s.progress, 0) / activeSubjects.length)
                    : 0
                const Icon = hub.icon

                return (
                    <motion.div
                        key={hub.id}
                        initial={{ opacity: 0, y: 24 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.12, type: "spring", stiffness: 200, damping: 20 }}
                        className={cn(
                            "group relative overflow-hidden rounded-3xl border p-6",
                            "bg-gradient-to-br",
                            hub.bgFrom, hub.bgTo,
                            hub.borderColor,
                            "shadow-md hover:shadow-2xl hover:-translate-y-2",
                            "transition-all duration-500 cursor-pointer",
                            "backdrop-blur-sm"
                        )}
                        style={{
                            boxShadow: `0 4px 24px 0 ${hub.glowColor}, 0 1px 3px rgba(0,0,0,0.07)`
                        }}
                    >
                        {/* ── Glow blob ── */}
                        <div
                            className="absolute -top-12 -right-12 w-40 h-40 rounded-full blur-3xl opacity-30 group-hover:opacity-50 transition-opacity duration-500"
                            style={{ background: hub.glowColor.replace('0.18', '1') }}
                        />

                        {/* ── Top row: icon + circular progress ── */}
                        <div className="flex items-start justify-between mb-5 relative z-10">
                            {/* Icon container */}
                            <div className={cn(
                                "w-12 h-12 rounded-2xl flex items-center justify-center shadow-lg",
                                hub.color
                            )}>
                                <Icon className="w-6 h-6 text-white" />
                            </div>

                            {/* Circular progress with percentage */}
                            <div className="relative flex items-center justify-center">
                                <svg width={56} height={56} className="-rotate-90">
                                    <circle cx={28} cy={28} r={22} fill="none" stroke="rgba(0,0,0,0.08)" strokeWidth={5} />
                                    <motion.circle
                                        cx={28} cy={28} r={22}
                                        fill="none"
                                        strokeWidth={5}
                                        strokeLinecap="round"
                                        stroke={hub.color.replace('bg-', '').includes('blue') ? '#6366f1' : hub.color.replace('bg-', '').includes('emerald') ? '#10b981' : '#f43f5e'}
                                        strokeDasharray={138.2}
                                        initial={{ strokeDashoffset: 138.2 }}
                                        animate={{ strokeDashoffset: 138.2 - (totalProgress / 100) * 138.2 }}
                                        transition={{ duration: 1.2, delay: index * 0.15, ease: "easeOut" }}
                                    />
                                </svg>
                                <span className={cn("absolute text-sm font-black", hub.textColor)}>
                                    {totalProgress}%
                                </span>
                            </div>
                        </div>

                        {/* ── Title block ── */}
                        <div className="relative z-10 mb-3">
                            <div className="flex items-center gap-2">
                                <h3 className="text-base font-black text-slate-900 tracking-tight leading-tight">
                                    {hub.title}
                                </h3>
                                <ArrowUpRight className={cn(
                                    "w-4 h-4 opacity-0 group-hover:opacity-100 transition-all -translate-y-1 group-hover:translate-y-0 duration-300",
                                    hub.textColor
                                )} />
                            </div>
                            <p className="text-base font-arabic font-semibold text-slate-500 mt-0.5" dir="rtl">
                                {hub.titleAr}
                            </p>
                        </div>

                        <p className="relative z-10 text-xs text-slate-500 font-medium leading-relaxed mb-5 line-clamp-2">
                            {hub.description}
                        </p>

                        {/* ── Progress bar ── */}
                        <div className="relative z-10 mb-5">
                            <div className="flex justify-between items-center mb-1.5">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">التقدم الإجمالي</span>
                            </div>
                            <div className="h-2 w-full bg-black/5 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    animate={{ width: `${totalProgress}%` }}
                                    transition={{ duration: 1.2, delay: 0.3 + index * 0.1, ease: "easeOut" }}
                                    className={cn("h-full rounded-full bg-gradient-to-r", hub.barGradient)}
                                />
                            </div>
                        </div>

                        {/* ── Subject chips ── */}
                        <div className="relative z-10 border-t border-black/5 pt-4 flex flex-wrap gap-2">
                            {hub.subjects.map((subject) => (
                                <button
                                    key={subject.id}
                                    onClick={(e) => {
                                        e.stopPropagation()
                                        if (!subject.isSoon && onSelectSubject) onSelectSubject(subject.id)
                                    }}
                                    disabled={subject.isSoon}
                                    className={cn(
                                        "flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all duration-200",
                                        subject.isSoon
                                            ? "bg-black/5 text-slate-400 cursor-not-allowed opacity-60"
                                            : cn(
                                                "bg-white/70 text-slate-800 border border-black/8 shadow-sm",
                                                "hover:bg-white hover:shadow-md hover:scale-105 active:scale-95"
                                            )
                                    )}
                                >
                                    <span className="text-base leading-none">{subject.icon as string}</span>
                                    <span className="truncate max-w-[90px]">{subject.name}</span>
                                    {subject.isSoon && (
                                        <Lock className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                                    )}
                                    {!subject.isSoon && (
                                        <span className={cn("text-[9px] font-black opacity-70", hub.textColor)}>
                                            {subject.progress}%
                                        </span>
                                    )}
                                </button>
                            ))}
                        </div>

                        {/* ── Bottom sparkle ── */}
                        <div className="absolute bottom-3 right-4 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-10">
                            <Sparkles className="w-3.5 h-3.5 text-yellow-500 animate-pulse" />
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}

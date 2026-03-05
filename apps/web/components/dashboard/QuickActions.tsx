"use client"

import { motion } from "framer-motion"
import { Play, Flame, Lightbulb, ArrowRight, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface Action {
    id: string
    title: string
    description: string
    icon: React.ElementType
    color: string
    bgColor: string
    tag?: string
}

const ACTIONS_FR: Action[] = [
    {
        id: "continue",
        title: "Continuer l'aventure",
        description: "Séquence 1 : Ma Famille (Unité 2)",
        icon: Play,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        tag: "EN COURS"
    },
    {
        id: "daily",
        title: "Défi du jour",
        description: "5 minutes d'écoute active",
        icon: Flame,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        tag: "OBJECTIF"
    },
    {
        id: "tip",
        title: "Conseil du Coach",
        description: "Encouragez l'effort, pas que le résultat.",
        icon: Lightbulb,
        color: "text-amber-600",
        bgColor: "bg-amber-100"
    }
]

const ACTIONS_AR: Action[] = [
    {
        id: "continue",
        title: "مواصلة المغامرة",
        description: "المقطع 1: عائلتي (الوحدة 2)",
        icon: Play,
        color: "text-blue-600",
        bgColor: "bg-blue-100",
        tag: "قيد الإنجاز"
    },
    {
        id: "daily",
        title: "تحدي اليوم",
        description: "5 دقائق من الاستماع النشط",
        icon: Flame,
        color: "text-orange-600",
        bgColor: "bg-orange-100",
        tag: "الهدف"
    },
    {
        id: "tip",
        title: "نصيحة المدرب",
        description: "شجع المجهود، وليس النتيجة فقط.",
        icon: Lightbulb,
        color: "text-amber-600",
        bgColor: "bg-amber-100"
    }
]

import { useChild } from "@/lib/context/ChildContext"

export function QuickActions({ childName }: { childName: string }) {
    const { activeChild } = useChild()
    const country = activeChild?.country || 'dz'
    const isArabic = country === 'dz'
    const actions = isArabic ? ACTIONS_AR : ACTIONS_FR

    return (
        <div className={cn("space-y-4", isArabic && "font-arabic")} dir={isArabic ? "rtl" : "ltr"}>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest px-1">
                {isArabic ? "الإجراءات الموصى بها" : "Actions recommandées"}
            </h3>
            <div className="space-y-3">
                {actions.map((action, idx) => {
                    const Icon = action.icon
                    return (
                        <motion.button
                            key={action.id}
                            initial={{ opacity: 0, x: -10 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ delay: idx * 0.1 }}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full flex items-center gap-4 p-4 bg-slate-50 border border-slate-100 rounded-3xl hover:bg-white hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300 group"
                        >
                            <div className={cn("w-12 h-12 rounded-2xl flex items-center justify-center transition-all duration-300", action.bgColor)}>
                                <Icon className={cn("w-6 h-6", action.color)} />
                            </div>
                            <div className={cn("flex-1", isArabic ? "text-right" : "text-left")}>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-slate-900">{action.title}</span>
                                    {action.tag && (
                                        <span className="text-[10px] bg-white border border-slate-200 px-2 py-0.5 rounded-full font-black text-slate-500 tracking-tighter">
                                            {action.tag}
                                        </span>
                                    )}
                                </div>
                                <p className="text-slate-500 text-sm font-medium line-clamp-1">{action.description}</p>
                            </div>
                            <div className="w-8 h-8 rounded-full bg-white border border-slate-100 flex items-center justify-center group-hover:bg-slate-900 group-hover:text-white transition-all duration-300">
                                <ArrowRight className="w-4 h-4" />
                            </div>
                        </motion.button>
                    )
                })}
            </div>

            <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.5 }}
                className="mt-6 p-6 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2rem] text-white relative overflow-hidden group"
            >
                <div className="absolute top-0 right-0 w-24 h-24 bg-blue-500/20 rounded-full blur-2xl -mr-12 -mt-12 group-hover:bg-blue-500/40 transition-all cursor-default" />
                <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-3">
                        <Zap className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                        <span className="text-xs font-black uppercase tracking-widest text-slate-400">
                            {isArabic ? "دفعة أسبوعية" : "Boost Hebdo"}
                        </span>
                    </div>
                    <p className="text-sm font-bold text-slate-200 leading-relaxed italic">
                        {isArabic
                            ? "\"الأطفال الذين يدرسون لمدة 15 دقيقة في الصباح يحتفظون بالمفاهيم الأساسية بنسبة 30٪ أفضل.\""
                            : "\"Les enfants qui étudient 15 min le matin retiennent 30% mieux les concepts clés.\""
                        }
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

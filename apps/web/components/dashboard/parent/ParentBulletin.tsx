"use client"

import { useState, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
    Bell,
    TrendingUp,
    Lightbulb,
    MessageSquare,
    CheckCircle2,
    Calendar,
    Sparkles,
    ChevronRight,
    ChevronLeft
} from "lucide-react"
import { cn } from "@/lib/utils"

export type BulletinType = 'achievement' | 'reminder' | 'tip' | 'custom' | 'update'

export interface BulletinItem {
    id: string
    type: BulletinType
    title: string
    titleAr: string
    content: string
    contentAr: string
    date?: string
    icon?: React.ElementType
    color: string
}

interface ParentBulletinProps {
    items: BulletinItem[]
    className?: string
    isArabic?: boolean
}

export function ParentBulletin({ items, className, isArabic }: ParentBulletinProps) {
    const [index, setIndex] = useState(0)
    const [direction, setDirection] = useState(0)

    useEffect(() => {
        if (items.length <= 1) return
        const timer = setInterval(() => {
            setDirection(1)
            setIndex((prev) => (prev + 1) % items.length)
        }, 8000)
        return () => clearInterval(timer)
    }, [items.length])

    const activeItem = items[index]
    if (!activeItem) return null

    const Icon = activeItem.icon || Bell

    return (
        <div className={cn(
            "relative group overflow-hidden rounded-[2rem] border border-white/10 bg-white/5 backdrop-blur-3xl p-6 transition-all duration-500",
            className
        )}>
            <div className="relative z-10 flex gap-4 items-center h-full">
                <div className={cn(
                    "w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 shadow-lg",
                    activeItem.color
                )}>
                    <Icon className="w-6 h-6 text-white" />
                </div>

                <div className="flex-1 min-w-0 relative h-16 overflow-hidden">
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={activeItem.id}
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -40 }}
                            transition={{
                                type: "spring",
                                stiffness: 100,
                                damping: 20,
                                opacity: { duration: 0.3 }
                            }}
                            className="absolute inset-0 flex flex-col justify-center"
                        >
                            <div className="flex items-center gap-2 mb-1">
                                <span className="text-[10px] font-black text-white/40 uppercase tracking-widest font-tajawal">
                                    {isArabic ? activeItem.type : activeItem.type}
                                </span>
                                <div className="h-1 w-1 rounded-full bg-white/20" />
                                <h3 className="text-white/90 text-[11px] font-bold truncate">
                                    {isArabic ? activeItem.titleAr : activeItem.title}
                                </h3>
                            </div>
                            <p className="text-white text-lg md:text-xl font-bold leading-tight font-scheherazade truncate">
                                {isArabic ? activeItem.contentAr : activeItem.content}
                            </p>
                        </motion.div>
                    </AnimatePresence>
                </div>
            </div>

            {/* Subtle Ticker Indicator */}
            <div className="absolute bottom-3 right-6 flex gap-1">
                {items.map((_, i) => (
                    <motion.div
                        key={i}
                        animate={{
                            scale: i === index ? 1.2 : 1,
                            opacity: i === index ? 1 : 0.3
                        }}
                        className={cn(
                            "w-1 h-1 rounded-full bg-white transition-all duration-300"
                        )}
                    />
                ))}
            </div>
        </div>
    )
}

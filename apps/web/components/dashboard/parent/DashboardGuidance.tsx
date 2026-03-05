"use client"

import { motion } from "framer-motion"
import {
    Home,
    Target,
    BarChart3,
    ChevronRight,
    Sparkles,
    MapPin,
    ArrowRight
} from "lucide-react"
import { cn } from "@/lib/utils"

interface BreadcrumbItem {
    label: string
    active?: boolean
}

interface DashboardGuidanceProps {
    breadcrumb: BreadcrumbItem[]
    activeChildName: string
    level: string
}

export function DashboardGuidance({ breadcrumb, activeChildName, level }: DashboardGuidanceProps) {
    return (
        <div className="mb-8 space-y-4">
            {/* Breadcrumb / Location System */}
            <nav className="flex items-center gap-2 text-[10px] font-bold tracking-widest uppercase text-slate-400">
                <div className="flex items-center gap-1.5 hover:text-primary transition-colors cursor-pointer">
                    <Home className="w-3 h-3" />
                    <span>Dashboard</span>
                </div>
                {breadcrumb.map((item, idx) => (
                    <div key={item.label} className="flex items-center gap-2">
                        <ChevronRight className="w-3 h-3" />
                        <span className={cn(
                            "transition-colors cursor-pointer",
                            item.active ? "text-primary font-black" : "hover:text-slate-600"
                        )}>
                            {item.label}
                        </span>
                    </div>
                ))}
            </nav>

            {/* Context Banner - Repérage */}
            <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4 p-5 rounded-[2rem] bg-white border border-slate-100 shadow-sm overflow-hidden group">
                {/* Background decorative element */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 blur-2xl group-hover:bg-primary/10 transition-colors" />

                <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary to-indigo-600 flex items-center justify-center text-white shadow-lg shadow-primary/20">
                        <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                        <h1 className="text-lg font-bold text-slate-900 tracking-tight flex items-center gap-2">
                            Current Focus: <span className="text-primary">{breadcrumb[breadcrumb.length - 1]?.label || "Overview"}</span>
                        </h1>
                        <p className="text-[11px] font-medium text-slate-500 flex items-center gap-1.5">
                            <Sparkles className="w-3 h-3 text-yellow-500" />
                            Tracking progress for <span className="font-bold text-slate-700">{activeChildName}</span> ({level})
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <div className="hidden md:flex flex-col items-end px-4 border-r border-slate-100">
                        <span className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Engagement level</span>
                        <div className="flex items-center gap-1">
                            <div className="w-1 h-3 rounded-full bg-emerald-500" />
                            <div className="w-1 h-4 rounded-full bg-emerald-500" />
                            <div className="w-1 h-2 rounded-full bg-emerald-500" />
                            <span className="text-xs font-bold text-slate-900 ml-1">High</span>
                        </div>
                    </div>

                    <button className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-50 hover:bg-primary hover:text-white text-slate-600 text-[10px] font-bold transition-all group/btn shadow-sm">
                        Change Student
                        <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-1 transition-transform" />
                    </button>
                </div>
            </div>
        </div>
    )
}

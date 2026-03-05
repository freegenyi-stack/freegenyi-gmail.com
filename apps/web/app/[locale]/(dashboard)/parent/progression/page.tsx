"use client";

import { useTranslations } from 'next-intl';
import {
    TrendingUp,
    Award,
    Target,
    Zap,
    ChevronRight
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function ParentProgressionPage() {
    const t = useTranslations('dashboard.parent');

    return (
        <div className="animate-in slide-in-from-bottom-4 duration-500 space-y-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">Suivi détaillé</h1>
                <p className="text-muted-foreground">Analysez les performances scolaires de vos enfants par matière.</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { label: "Badges obtenus", value: "8", icon: Award, color: "text-yellow-600", bg: "bg-yellow-50" },
                    { label: "Objectifs atteints", value: "15/20", icon: Target, color: "text-blue-600", bg: "bg-blue-50" },
                    { label: "Série actuelle", value: "5 jours", icon: Zap, color: "text-orange-600", bg: "bg-orange-50" }
                ].map((item, i) => (
                    <div key={i} className="rounded-2xl border bg-white p-6 flex items-center gap-4">
                        <div className={cn("p-3 rounded-xl", item.bg)}>
                            <item.icon className={cn("h-6 w-6", item.color)} />
                        </div>
                        <div>
                            <p className="text-sm font-medium text-muted-foreground">{item.label}</p>
                            <p className="text-2xl font-bold">{item.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="space-y-6">
                <h3 className="text-xl font-bold">Progression par matière</h3>
                <div className="grid gap-6 md:grid-cols-2">
                    {['Mathématiques', 'Français', 'Anglais', 'Sciences'].map((subject, i) => (
                        <div key={i} className="rounded-2xl border bg-white p-6 space-y-4">
                            <div className="flex justify-between items-center">
                                <h4 className="font-bold">{subject}</h4>
                                <span className="text-sm font-bold text-primary">85%</span>
                            </div>
                            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                                <div
                                    className="h-full bg-primary transition-all duration-1000"
                                    style={{ width: `${85 - i * 5}%` }}
                                />
                            </div>
                            <div className="flex justify-between text-xs text-muted-foreground">
                                <span>Niveau 4</span>
                                <span>Prochain niveau : 1500 XP</span>
                            </div>
                            <button className="w-full flex items-center justify-center gap-2 py-2 text-sm font-medium border rounded-lg hover:bg-slate-50 transition-colors">
                                Voir les détails <ChevronRight className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

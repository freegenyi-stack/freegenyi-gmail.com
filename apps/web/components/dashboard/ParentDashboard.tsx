"use client";

import { useAuthStore } from '@/store/useAuthStore';
import { useTranslations } from 'next-intl';
import {
    Users,
    GraduationCap,
    BarChart3,
    TrendingUp,
    Clock
} from 'lucide-react';
import { cn } from '@/lib/utils';

export function ParentDashboardContent() {
    const t = useTranslations('dashboard.parent');
    const { user } = useAuthStore();

    const stats = [
        { title: t('stats.activeStudents'), value: "2", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
        { title: t('stats.completedExercises'), value: "12", icon: GraduationCap, color: "text-green-600", bg: "bg-green-50" },
        { title: t('stats.averageScore'), value: "16.5/20", icon: BarChart3, color: "text-purple-600", bg: "bg-purple-50" },
        { title: t('stats.studyTime'), value: "4h 20m", icon: Clock, color: "text-orange-600", bg: "bg-orange-50" }
    ];

    return (
        <div className="animate-in fade-in duration-500 space-y-8 p-4 md:p-8">
            <div className="flex flex-col gap-2">
                <h1 className="text-3xl font-bold tracking-tight">
                    {t('welcome', { name: user?.name || 'Parent' })}
                </h1>
                <p className="text-muted-foreground">{t('overview')}</p>
            </div>

            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat, i) => (
                    <div key={i} className="group rounded-2xl border bg-white p-6 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                        <div className="flex items-center justify-between">
                            <div className={cn("p-2 rounded-xl", stat.bg)}>
                                <stat.icon className={cn("h-6 w-6", stat.color)} />
                            </div>
                            <div className="flex items-center gap-1 text-xs font-medium text-green-600 bg-green-50 px-2 py-1 rounded-full">
                                <TrendingUp className="h-3 w-3" />
                                +12%
                            </div>
                        </div>
                        <div className="mt-4">
                            <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                            <p className="text-3xl font-bold mt-1">{stat.value}</p>
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border bg-white p-8 shadow-sm">
                    <div className="flex items-center justify-between mb-8">
                        <h3 className="font-bold text-xl">{t('progressBySubject')}</h3>
                    </div>
                    <div className="flex flex-col items-center justify-center h-64 bg-slate-50/50 rounded-2xl border-2 border-dashed border-slate-200">
                        <BarChart3 className="h-12 w-12 text-slate-300 mb-4" />
                        <p className="text-sm font-medium text-slate-400">Graphique Dynamique</p>
                    </div>
                </div>

                <div className="rounded-2xl border bg-white p-8 shadow-sm">
                    <h3 className="font-bold text-xl mb-8">{t('recentActivity')}</h3>
                    <div className="space-y-6">
                        {[
                            { student: "Amine", subject: "Mathématiques", score: "18/20", time: "2h" },
                            { student: "Amia", subject: "Français", score: "16/20", time: "5h" }
                        ].map((activity, i) => (
                            <div key={i} className="flex items-start gap-4">
                                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center shrink-0 text-xs font-bold">
                                    {activity.student[0]}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-bold truncate">{activity.subject}</p>
                                    <p className="text-xs text-muted-foreground">{activity.student} • {activity.time}</p>
                                </div>
                                <div className="text-sm font-black text-primary">{activity.score}</div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

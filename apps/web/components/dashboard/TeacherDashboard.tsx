"use client";

import { useTranslations } from 'next-intl';
import {
    Users,
    BookOpen,
    MessageCircle,
    Plus,
    ArrowRight
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function TeacherDashboardContent() {
    return (
        <div className="animate-in fade-in duration-500 space-y-8 p-4 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Espace Enseignant 🏫</h1>
                    <p className="text-muted-foreground">Gérez vos classes et créez vos supports pédagogiques.</p>
                </div>
                <Button className="gap-2">
                    <Plus className="h-4 w-4" /> Nouvelle classe
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
                {[
                    { title: "Total Élèves", value: "124", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { title: "Cours Actifs", value: "8", icon: BookOpen, color: "text-purple-600", bg: "bg-purple-50" },
                    { title: "Messages parents", value: "12", icon: MessageCircle, color: "text-green-600", bg: "bg-green-50" }
                ].map((stat, i) => (
                    <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
                        <div className={cn("inline-flex p-2 rounded-xl mb-4", stat.bg)}>
                            <stat.icon className={cn("h-6 w-6", stat.color)} />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                        <p className="text-3xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-2">
                <div className="rounded-2xl border bg-white p-8">
                    <h3 className="font-bold text-xl mb-6">Mes Classes</h3>
                    <div className="space-y-4">
                        {['6ème A', '5ème B', 'Terminale S'].map((className, i) => (
                            <div key={i} className="group flex items-center justify-between p-4 rounded-xl border hover:border-primary hover:bg-primary/5 transition-all cursor-pointer">
                                <div className="flex items-center gap-4">
                                    <div className="h-10 w-10 rounded-lg bg-slate-100 flex items-center justify-center font-bold text-slate-500">
                                        {className[0]}
                                    </div>
                                    <div>
                                        <p className="font-bold">{className}</p>
                                        <p className="text-xs text-muted-foreground">32 élèves • Mathématiques</p>
                                    </div>
                                </div>
                                <ArrowRight className="h-5 w-5 text-slate-300 group-hover:text-primary transition-colors" />
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

"use client";

import { useTranslations } from 'next-intl';
import {
    ShieldCheck,
    BarChart4,
    Settings,
    Users,
    Activity,
    AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function AdminDashboardContent() {
    return (
        <div className="animate-in fade-in duration-500 space-y-8 p-4 md:p-8">
            <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                    <ShieldCheck className="h-6 w-6" />
                </div>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Administration 🏛️</h1>
                    <p className="text-muted-foreground">Supervision des politiques éducatives.</p>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Utilisateurs", value: "1.2M", icon: Users, status: "Normal" },
                    { title: "Serveur", value: "99.9%", icon: Activity, status: "OK" },
                    { title: "Alertes", value: "3", icon: AlertTriangle, status: "Warning", color: "text-red-600" },
                    { title: "Rapports", value: "4,500", icon: BarChart4, status: "Mensuel" }
                ].map((stat, i) => (
                    <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm border-l-4 border-l-slate-900">
                        <div className="flex items-center justify-between mb-2 text-slate-400">
                            <stat.icon className={cn("h-5 w-5", stat.color)} />
                            <span className="text-[10px] font-black uppercase tracking-wider">{stat.status}</span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                        <p className="text-3xl font-black mt-1 tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

"use client";

import { useTranslations } from 'next-intl';
import {
    BarChart3,
    Map as MapIcon,
    Users,
    Globe,
    TrendingUp,
    FileDown
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export function NgoDashboardContent() {
    return (
        <div className="animate-in fade-in duration-500 space-y-8 p-4 md:p-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Espace ONG 🤝</h1>
                    <p className="text-muted-foreground">Mesurez l'impact de vos projets éducatifs à travers le monde.</p>
                </div>
                <Button variant="outline" className="gap-2">
                    <FileDown className="h-4 w-4" /> Exporter Rapport
                </Button>
            </div>

            <div className="grid gap-6 md:grid-cols-4">
                {[
                    { title: "Bénéficiaires", value: "12,450", icon: Users, color: "text-blue-600", bg: "bg-blue-50" },
                    { title: "Écoles", value: "45", icon: Globe, color: "text-green-600", bg: "bg-green-50" },
                    { title: "Impact", value: "88/100", icon: TrendingUp, color: "text-purple-600", bg: "bg-purple-50" },
                    { title: "Budget", value: "250k €", icon: BarChart3, color: "text-orange-600", bg: "bg-orange-50" }
                ].map((stat, i) => (
                    <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm">
                        <div className={cn("inline-flex p-2 rounded-xl mb-4", stat.bg)}>
                            <stat.icon className={cn("h-6 w-6", stat.color)} />
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                        <p className="text-2xl font-bold">{stat.value}</p>
                    </div>
                ))}
            </div>
        </div>
    );
}

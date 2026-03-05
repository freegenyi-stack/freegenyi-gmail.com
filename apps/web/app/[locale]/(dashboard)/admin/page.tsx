"use client";

export const dynamic = 'force-dynamic';


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

export default function AdminDashboard() {
    return (
        <div className="animate-in fade-in duration-500 space-y-8 text-slate-900">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <div className="h-12 w-12 rounded-2xl bg-slate-900 flex items-center justify-center text-white shadow-lg">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <h1 className="text-3xl font-bold tracking-tight">Portail National Administration 🏛️</h1>
                        <p className="text-muted-foreground">Supervision des politiques éducatives et conformité.</p>
                    </div>
                </div>
                <div className="flex gap-3">
                    <Button variant="ghost" className="gap-2"><Settings className="h-4 w-4" /> Paramètres système</Button>
                    <Button className="bg-slate-900 hover:bg-black gap-2"><Activity className="h-4 w-4" /> Logs en direct</Button>
                </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
                {[
                    { title: "Utilisateurs totaux", value: "1.2M", icon: Users, status: "Normal" },
                    { title: "Statut Serveur", value: "99.9%", icon: Activity, status: "Excellent" },
                    { title: "Alertes Critiques", value: "3", icon: AlertTriangle, status: "À surveiller", color: "text-red-600" },
                    { title: "Rapports générés", value: "4,500", icon: BarChart4, status: "Mensuel" }
                ].map((stat, i) => (
                    <div key={i} className="rounded-2xl border bg-white p-6 shadow-sm border-l-4 border-l-slate-900">
                        <div className="flex items-center justify-between mb-2">
                            <stat.icon className={cn("h-5 w-5 text-slate-400", stat.color)} />
                            <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider font-mono">{stat.status}</span>
                        </div>
                        <h3 className="text-sm font-medium text-muted-foreground">{stat.title}</h3>
                        <p className="text-3xl font-black mt-1 tracking-tight">{stat.value}</p>
                    </div>
                ))}
            </div>

            <div className="grid gap-8 lg:grid-cols-3">
                <div className="lg:col-span-2 rounded-2xl border bg-white shadow-xl overflow-hidden">
                    <div className="bg-slate-50 px-6 py-4 border-b flex justify-between items-center">
                        <h3 className="font-black text-sm uppercase tracking-widest text-slate-500">Tendances Nationales d'Éducation</h3>
                        <div className="flex gap-2">
                            <div className="h-2 w-2 rounded-full bg-slate-900" />
                            <div className="h-2 w-2 rounded-full bg-slate-400" />
                        </div>
                    </div>
                    <div className="p-8 flex flex-col items-center justify-center h-[350px]">
                        <div className="w-full flex justify-between items-end gap-2 h-48 mb-6">
                            {[40, 70, 45, 90, 65, 80, 55].map((h, i) => (
                                <div key={i} className="flex-1 bg-slate-900/10 rounded-t-lg relative group h-full">
                                    <div
                                        className="absolute bottom-0 w-full bg-slate-900 rounded-t-lg transition-all duration-500 group-hover:bg-primary"
                                        style={{ height: `${h}%` }}
                                    />
                                </div>
                            ))}
                        </div>
                        <p className="text-sm text-muted-foreground italic">Visualisation D3.js des données régionales consolidées</p>
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="rounded-2xl border bg-slate-900 p-8 text-white shadow-2xl">
                        <h3 className="font-bold text-xl mb-4">Conformité RGPD</h3>
                        <p className="text-sm text-slate-400 mb-6 underline decoration-slate-600 underline-offset-4">Audit de sécurité effectué le 05/02/2026</p>
                        <div className="h-1 bg-slate-800 w-full rounded-full mb-2">
                            <div className="h-full bg-green-500 w-[100%] rounded-full" />
                        </div>
                        <p className="text-xs text-green-400 font-bold">100% Conforme</p>
                    </div>
                    <div className="rounded-2xl border bg-white p-8">
                        <h3 className="font-bold text-lg mb-4 text-slate-900">Actions Rapides</h3>
                        <div className="space-y-3">
                            <button className="w-full text-left py-3 px-4 rounded-xl border hover:bg-slate-50 transition-all font-medium text-sm">Générer rapport ministériel</button>
                            <button className="w-full text-left py-3 px-4 rounded-xl border hover:bg-slate-50 transition-all font-medium text-sm">Gérer les permissions</button>
                            <button className="w-full text-left py-3 px-4 rounded-xl border hover:bg-slate-50 transition-all font-medium text-sm">Auditer les accès</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

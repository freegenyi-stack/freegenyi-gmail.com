"use client";

import { useState } from 'react';
import LandingPage from '@/components/landing/LandingPage';
import { ParentDashboardContent } from './ParentDashboard';
import { TeacherDashboardContent } from './TeacherDashboard';
import { NgoDashboardContent } from './NgoDashboard';
import { AdminDashboardContent } from './AdminDashboard';
import { Button } from '@/components/ui/button';
import {
    Users,
    GraduationCap,
    HeartHandshake,
    ShieldCheck,
    LayoutDashboard,
    ArrowLeft
} from 'lucide-react';
import { cn } from '@/lib/utils';

import { useAuthStore } from '@/store/useAuthStore';

type ViewMode = 'landing' | 'parent' | 'teacher' | 'ngo' | 'admin';

export default function DashboardManager() {
    const [view, setView] = useState<ViewMode>('landing');
    const { user } = useAuthStore();

    const userInitials = user?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() || 'U';

    if (view === 'landing') {
        return (
            <div className="relative">
                <div className="fixed bottom-8 right-8 z-50 animate-bounce">
                    <Button
                        onClick={() => setView('parent')}
                        className="rounded-full shadow-2xl gap-2 h-14 px-6 bg-primary text-primary-foreground text-lg font-bold"
                    >
                        <LayoutDashboard className="h-6 w-6" /> Accéder aux Dashboards (Demo)
                    </Button>
                </div>
                <LandingPage />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-slate-50/50 flex flex-col">
            {/* Dynamic Header for Dashboards */}
            <header className="sticky top-0 z-40 w-full border-b bg-white/80 backdrop-blur-md px-6 py-4">
                <div className="flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-6">
                        <Button variant="ghost" onClick={() => setView('landing')} className="gap-2">
                            <ArrowLeft className="h-4 w-4" /> Retour Accueil
                        </Button>
                        <div className="h-6 w-px bg-slate-200" />
                        <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
                            {[
                                { id: 'parent', icon: Users, label: 'Parent' },
                                { id: 'teacher', icon: GraduationCap, label: 'Enseignant' },
                                { id: 'ngo', icon: HeartHandshake, label: 'ONG' },
                                { id: 'admin', icon: ShieldCheck, label: 'Admin' }
                            ].map((role) => (
                                <Button
                                    key={role.id}
                                    variant={view === role.id ? 'default' : 'ghost'}
                                    size="sm"
                                    onClick={() => setView(role.id as ViewMode)}
                                    className="gap-2 text-xs"
                                >
                                    <role.icon className="h-3.5 w-3.5" />
                                    {role.label}
                                </Button>
                            ))}
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="h-8 w-8 rounded-full bg-primary flex items-center justify-center text-white text-xs font-bold shadow-sm">
                            {userInitials}
                        </div>
                    </div>
                </div>
            </header>

            <main className="flex-1 max-w-7xl mx-auto w-full">
                {view === 'parent' && <ParentDashboardContent />}
                {view === 'teacher' && <TeacherDashboardContent />}
                {view === 'ngo' && <NgoDashboardContent />}
                {view === 'admin' && <AdminDashboardContent />}
            </main>
        </div>
    );
}

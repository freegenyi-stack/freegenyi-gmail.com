"use client";

import { ReactNode } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useRealtime } from '@/hooks/useRealtime';
import { cn } from '@/lib/utils';
import { DashboardSidebar } from '@/components/dashboard/Sidebar';
import { AppNavbar } from '@/components/layout/AppNavbar';
import { Toaster } from '@/components/ui/toaster';
import { AuthStoreSync } from '@/components/Providers/AuthStoreSync';
import { useState } from 'react';
import { useLocale } from 'next-intl';
import { rtlLocales } from '@/lib/i18n/config';

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

function DashboardLayoutContent({ children }: { children: ReactNode }) {
    const { isOpen } = useSidebarStore();
    const { user } = useAuthStore();
    const locale = useLocale();
    const isRTL = rtlLocales.includes(locale as any);

    // Initialize real-time notifications
    useRealtime(user?.id || null);

    return (
        <div className="flex min-h-screen bg-slate-50/50">
            <DashboardSidebar />

            <div className="flex flex-1 flex-col relative">
                <AppNavbar />
                <div className={cn(
                    "flex-1 transition-all duration-300",
                    isRTL ? "lg:pr-20" : "lg:pl-20",
                    isOpen && (isRTL ? "lg:pr-64" : "lg:pl-64")
                )}>
                    <main className="px-6 pb-6 pt-0">
                        {children}
                    </main>
                </div>
            </div>

            <Toaster />
        </div>
    );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
    return (
        <QueryClientProvider client={queryClient}>
            <AuthStoreSync>
                <DashboardLayoutContent>{children}</DashboardLayoutContent>
            </AuthStoreSync>
        </QueryClientProvider>
    );
}


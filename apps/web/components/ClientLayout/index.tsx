'use client';

import { ReactNode } from 'react';
import { AppBar } from '@/components/layout/AppBar';
import { Footer } from '@/components/layout/Footer';
import FreeGenyCookieBanner from '@/components/ui/FreeGenyCookieBanner';

interface ClientLayoutProps {
    children: ReactNode;
    isRTL: boolean;
}

import { usePathname } from 'next/navigation';

export default function ClientLayout({ children, isRTL }: ClientLayoutProps) {
    const pathname = usePathname();
    const isAuthPage = pathname?.includes('/auth');
    const dashboardRoutes = ['/parent', '/teacher', '/ngo', '/ong', '/admin', '/school', '/dashboard'];
    const isDashboard = dashboardRoutes.some(route => pathname?.includes(route));

    return (
        <div dir={isRTL ? 'rtl' : 'ltr'} className={`min-h-screen flex flex-col ${isRTL ? 'rtl' : 'ltr'}`}>
            {!isAuthPage && !isDashboard && <AppBar />}
            <main className="flex-grow language-transition">
                {children}
            </main>
            {!isAuthPage && !isDashboard && <Footer />}
            <FreeGenyCookieBanner />
        </div>
    );
}

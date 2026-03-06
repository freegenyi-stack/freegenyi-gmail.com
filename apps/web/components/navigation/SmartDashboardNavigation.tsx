'use client';

import { useEffect } from 'react';
import { useAuthStore } from '@/store/useAuthStore';
import { useRouter, usePathname } from 'next/navigation';

export function SmartDashboardNavigation() {
    const { user } = useAuthStore();
    const router = useRouter();
    const pathname = usePathname();

    useEffect(() => {
        // Redirection logic can be re-enabled here using 'user' instead of 'session'
        if (user) {
            // ...
        }
    }, [user, router, pathname]);

    useEffect(() => {
        // AUTO-REDIRECT DISABLED: Users want to access the home page
        // The redirection will now be handled via the "My Dashboard" button in the Navbar

        /*
        // Only redirect if user is authenticated and on the home page
        const locale = pathname?.split('/')[1] || 'fr';
        const isHomePage = pathname === `/${locale}` || pathname === '/';

        if (status === 'authenticated' && session?.user?.role && isHomePage) {
            const role = session.user.role as string;

            // Map roles to dashboard URLs
            const dashboardMap: Record<string, string> = {
                'PARENT': `/${locale}/parent`,
                'TEACHER': `/${locale}/ecole/dashboard`,
                'NGO': `/${locale}/ngo`,
                'ORGANIZATION': `/${locale}/organization`,
                'SCHOOL_ADMIN': `/${locale}/organization`,
            };

            const targetDashboard = dashboardMap[role];
            if (targetDashboard) {
                router.push(targetDashboard);
            }
        }
        */
    }, [router, pathname]);

    return null; // This component doesn't render anything
}

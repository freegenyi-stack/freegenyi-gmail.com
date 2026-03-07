'use client';

import * as React from 'react';

import { Link } from '@/lib/i18n/navigation';
import { usePathname } from 'next/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { DashboardSwitcher } from './DashboardSwitcher';
import { UserMenu } from './UserMenu';
import { NotificationBell } from '@/components/shared/NotificationBell';
import { GlobalSearch } from '@/components/shared/GlobalSearch';
import { ThemeToggle } from '@/components/theme-toggle';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import { Logo } from '@/components/icons/Logo';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { User, Settings, LogOut, HelpCircle, Trophy } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { useLocale, useTranslations } from 'next-intl';
import { rtlLocales } from '@/lib/i18n/config';
import { cn } from '@/lib/utils';

export function AppNavbar() {
    const t = useTranslations('navbar');
    const pathname = usePathname();
    const { user, logout, activeRole } = useAuthStore();
    const supabase = createClient();
    const locale = useLocale();
    const isRTL = rtlLocales.includes(locale as any);
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    // Only show dashboard switcher on dashboard routes
    const dashboardRoutes = ['/parent', '/teacher', '/ngo', '/admin', '/school', '/ecole'];
    const isDashboardRoute = dashboardRoutes.some(route => pathname?.includes(route));

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        window.location.href = '/';
    };

    const userInitials = user?.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() || '?';

    return (
        <header className="sticky top-0 z-50 w-full border-b bg-white/80 backdrop-blur-md">
            <div className="flex h-16 items-center px-6 gap-4">
                {/* Logo */}
                <div className={isRTL ? "ml-4" : "mr-4"}>
                    <Logo variant="full" />
                </div>

                {/* Dashboard Switcher - Only on dashboard routes */}
                {isDashboardRoute && <DashboardSwitcher />}

                {/* Global Search */}
                <div className="flex-1 max-w-md hidden lg:block">
                    <GlobalSearch />
                </div>

                {/* Right Side Actions */}
                <div className={cn("flex items-center gap-2", isRTL ? "mr-auto" : "ml-auto")}>
                    {/* Language Switcher */}
                    <LanguageSwitcher />

                    {/* Theme Toggle */}
                    <ThemeToggle />

                    {/* Notifications */}
                    <NotificationBell />

                    {/* Help */}
                    <Button variant="ghost" size="icon" asChild>
                        <Link href="/faq">
                            <HelpCircle className="h-5 w-5" />
                        </Link>
                    </Button>

                    {/* User Menu */}
                    {mounted ? <UserMenu /> : <div className="w-10 h-10 rounded-full bg-slate-100 animate-pulse" />}
                </div>
            </div>
        </header>
    );
}

"use client";

import { Link } from '@/lib/i18n/navigation';
import { usePathname } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { useSidebarStore } from '@/store/useSidebarStore';
import { useAuthStore } from '@/store/useAuthStore';
import { useLocale } from 'next-intl';
import { rtlLocales } from '@/lib/i18n/config';
import { getNavigationForRole } from '@/lib/navigation-config';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    Menu,
    X,
    Home,
    School,
    Users,
    RefreshCw
} from 'lucide-react';
import { Logo } from '@/components/icons/Logo';
import { useState } from 'react';
import { ChildSwitcher } from './ChildSwitcher';
import { UserMenu } from '@/components/layout/UserMenu';
import { NotificationsPanel } from './communication/NotificationsPanel';
import { GlobalSearch } from '@/components/shared/GlobalSearch';
import { useChild } from '@/lib/context/ChildContext';
import { Search, Settings, HelpCircle, LogOut } from 'lucide-react';
import { LanguageSwitcher } from '@/components/LanguageSwitcher/LanguageSwitcher';
import { ThemeToggle } from '@/components/theme-toggle';

export function DashboardSidebar() {
    const t = useTranslations();
    const pathname = usePathname();
    const { isOpen, isMobileOpen, toggle, toggleMobile } = useSidebarStore();
    const { activeRole, user } = useAuthStore();
    const locale = useLocale();
    const isRTL = rtlLocales.includes(locale as any);
    const { activeChild, resetChild } = useChild();
    const [expandedItems, setExpandedItems] = useState<string[]>([]);

    const navItems = getNavigationForRole(activeRole).filter(item => item.label !== 'dashboard.nav.settings');

    const toggleExpanded = (href: string) => {
        setExpandedItems(prev =>
            prev.includes(href)
                ? prev.filter(item => item !== href)
                : [...prev, href]
        );
    };

    const isActive = (href: string) => {
        return pathname === href || pathname.startsWith(href + '/');
    };

    const getIconStyle = (label: string, active: boolean) => {
        const styles: Record<string, { bg: string, text: string, color: string }> = {
            'dashboard.nav.home': { bg: 'bg-blue-100', text: 'text-blue-600', color: '#2563eb' },
            'dashboard.nav.progression': { bg: 'bg-emerald-100', text: 'text-emerald-600', color: '#059669' },
            'dashboard.nav.exercises': { bg: 'bg-orange-100', text: 'text-orange-600', color: '#ea580c' },
            'dashboard.nav.library': { bg: 'bg-purple-100', text: 'text-purple-600', color: '#9333ea' },
            'dashboard.nav.messages': { bg: 'bg-pink-100', text: 'text-pink-600', color: '#db2777' },
            'dashboard.nav.calendar': { bg: 'bg-amber-100', text: 'text-amber-600', color: '#d97706' },
            'dashboard.nav.achievements': { bg: 'bg-yellow-100', text: 'text-yellow-600', color: '#ca8a04' },
            'dashboard.nav.settings': { bg: 'bg-slate-100', text: 'text-slate-600', color: '#475569' },
            'dashboard.nav.classes': { bg: 'bg-indigo-100', text: 'text-indigo-600', color: '#4f46e5' },
            'dashboard.nav.grading': { bg: 'bg-rose-100', text: 'text-rose-600', color: '#e11d48' },
            'dashboard.nav.planning': { bg: 'bg-cyan-100', text: 'text-cyan-600', color: '#0891b2' },
            'dashboard.nav.analytics': { bg: 'bg-violet-100', text: 'text-violet-600', color: '#7c3aed' },
        };
        const style = styles[label] || styles['dashboard.nav.settings'];
        return active ? { bg: 'bg-white shadow-inner', text: style.text } : style;
    };

    const SidebarContent = () => (
        <div className="flex h-full flex-col p-3">
            {/* ── Top Section: Logo & Child Identity ────────────────────── */}
            <div className="space-y-4 mb-4 mt-2">
                <div className="flex items-center justify-between px-2">
                    <div className="flex items-center gap-2">
                        <Logo variant={isOpen ? "full" : "short"} className="h-8" />
                    </div>
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={toggle}
                        className="h-8 w-8 hidden lg:flex hover:bg-slate-100 rounded-lg"
                    >
                        {isOpen ? (
                            <div className="rtl:rotate-180">
                                <ChevronLeft className="h-4 w-4" />
                            </div>
                        ) : (
                            <div className="rtl:rotate-180">
                                <ChevronRight className="h-4 w-4" />
                            </div>
                        )}
                    </Button>
                </div>

                {/* Child Switcher / Profile */}
                <div className={cn(
                    "transition-all duration-300",
                    isOpen ? "px-2" : "flex justify-center"
                )}>
                    {activeChild ? (
                        <div className={cn(
                            "flex items-center gap-3 p-2 bg-slate-50 border border-slate-100 rounded-2xl group cursor-pointer hover:bg-slate-100 transition-all",
                            !isOpen && "p-1 rounded-xl"
                        )}>
                            <div className={cn(
                                "w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white font-extrabold text-lg shadow-sm shrink-0",
                                !isOpen && "w-8 h-8 text-sm"
                            )}>
                                {activeChild?.name?.charAt(0).toUpperCase() || "C"}
                            </div>
                            {isOpen && (
                                <>
                                    <div className="flex-1 min-w-0">
                                        <div className="font-bold text-slate-900 leading-tight truncate">{activeChild.name}</div>
                                        <div className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                                            {t("dashboard.childSwitcher.slogan")}
                                        </div>
                                    </div>
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={resetChild}
                                        className="h-8 w-8 text-slate-400 hover:text-primary hover:bg-primary/5"
                                    >
                                        <RefreshCw className="h-4 w-4" />
                                    </Button>
                                </>
                            )}
                        </div>
                    ) : (
                        <div className="text-center p-2 text-xs text-muted-foreground italic">
                            {isOpen && "Aucun profil enfant"}
                        </div>
                    )}
                </div>
            </div>

            {/* Navigation */}
            <nav className="flex-1 space-y-0.5 overflow-y-auto overflow-x-hidden [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:display-none mt-2">
                {navItems.map((item) => {
                    const hasChildren = item.children && item.children.length > 0;
                    const isExpanded = expandedItems.includes(item.href);
                    const active = isActive(item.href);

                    return (
                        <div key={item.href}>
                            {hasChildren ? (
                                <>
                                    <button
                                        onClick={() => toggleExpanded(item.href)}
                                        className={cn(
                                            "flex w-full items-center gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 group selection-none",
                                            active
                                                ? "bg-slate-50 shadow-sm border border-slate-100"
                                                : "text-slate-600 hover:bg-slate-50 hover:translate-x-1"
                                        )}
                                    >
                                        <div className={cn(
                                            "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                                            getIconStyle(item.label, active).bg,
                                            "group-hover:scale-110 group-active:scale-95"
                                        )}>
                                            <item.icon className={cn("h-4.5 w-4.5 shrink-0", getIconStyle(item.label, active).text)} />
                                        </div>
                                        {isOpen && (
                                            <>
                                                <span className={cn(
                                                    "text-sm font-bold flex-1 text-start",
                                                    active ? "text-slate-900" : "text-slate-600"
                                                )}>
                                                    {t(item.label)}
                                                </span>
                                                <ChevronDown
                                                    className={cn(
                                                        "h-4 w-4 transition-transform text-slate-400",
                                                        isExpanded && "rotate-180"
                                                    )}
                                                />
                                            </>
                                        )}
                                        {item.badge && isOpen && (
                                            <span className="ms-auto flex h-5 w-5 items-center justify-center rounded-lg bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                                {item.badge}
                                            </span>
                                        )}
                                    </button>
                                    {isExpanded && isOpen && (
                                        <div className="ms-8 mt-1 space-y-1">
                                            {item.children?.map((child) => (
                                                <Link
                                                    key={child.href}
                                                    href={child.href}
                                                    className={cn(
                                                        "flex items-center gap-3 rounded-lg px-3 py-2 transition-colors text-sm",
                                                        isActive(child.href)
                                                            ? "bg-primary/10 text-primary font-medium"
                                                            : "text-muted-foreground hover:bg-slate-100"
                                                    )}
                                                >
                                                    <child.icon className="h-4 w-4 shrink-0" />
                                                    <span>{t(child.label)}</span>
                                                </Link>
                                            ))}
                                        </div>
                                    )}
                                </>
                            ) : (
                                <Link
                                    href={item.href}
                                    className={cn(
                                        "flex items-center gap-3 rounded-xl px-2 py-1.5 transition-all duration-300 group",
                                        active
                                            ? "bg-slate-50 shadow-sm border border-slate-100"
                                            : "text-slate-600 hover:bg-slate-50 ltr:hover:translate-x-1 rtl:hover:-translate-x-1"
                                    )}
                                >
                                    <div className={cn(
                                        "w-8 h-8 rounded-xl flex items-center justify-center transition-all duration-300 shadow-sm",
                                        getIconStyle(item.label, active).bg,
                                        "group-hover:scale-110 group-active:scale-95",
                                        "relative overflow-hidden before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent"
                                    )}>
                                        <item.icon className={cn("h-4.5 w-4.5 shrink-0", getIconStyle(item.label, active).text)} />
                                    </div>
                                    {isOpen && (
                                        <span className={cn(
                                            "text-sm font-bold",
                                            active ? "text-slate-900" : "text-slate-600"
                                        )}>
                                            {t(item.label)}
                                        </span>
                                    )}
                                    {item.badge && isOpen && (
                                        <span className="ms-auto flex h-5 w-5 items-center justify-center rounded-lg bg-red-500 text-[10px] font-bold text-white shadow-sm ring-2 ring-white">
                                            {item.badge}
                                        </span>
                                    )}
                                </Link>
                            )}
                        </div>
                    );
                })}
            </nav>

            {/* ── Footer Section: Global Actions ───────────────────────── */}
            <div className="mt-auto border-t border-slate-100 pt-2 space-y-1">
                {/* Search Toggle (Compact) or Global Search (Expanded) */}
                <div className="px-2">
                    {isOpen ? (
                        <GlobalSearch />
                    ) : (
                        <div className="flex justify-center">
                            <Button variant="ghost" size="icon"
                                className="group relative h-8 w-8 rounded-xl p-0 overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm border border-slate-100 bg-slate-50 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent">
                                <Search className="h-4 w-4 text-slate-500" />
                            </Button>
                        </div>
                    )}
                </div>

                {/* Notifications, Language & Settings Row */}
                <div className={cn(
                    "flex px-2 items-center justify-between",
                    !isOpen && "flex-col gap-2"
                )}>
                    <div className={cn(
                        "flex items-center gap-2",
                        !isOpen && "flex-col"
                    )}>
                        <NotificationsPanel variant="light" />
                        <LanguageSwitcher />
                    </div>

                    <Link href="/parent/settings">
                        <Button variant="ghost" size="icon"
                            className="group relative h-8 w-8 rounded-xl p-0 overflow-hidden transition-all duration-300 hover:scale-110 active:scale-95 shadow-sm border border-slate-100 bg-slate-50 before:absolute before:inset-0 before:bg-gradient-to-br before:from-white/40 before:to-transparent">
                            <Settings className="h-4 w-4 text-slate-500 group-hover:rotate-45 transition-transform" />
                        </Button>
                    </Link>
                </div>

                {/* User Profile */}
                <div className="px-1">
                    {isOpen ? (
                        <div className="flex items-center gap-3 p-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer">
                            <UserMenu />
                            <div className="flex-1 min-w-0">
                                <p className="text-xs font-bold text-slate-900 truncate">{user?.name || "Parent"}</p>
                                <p className="text-[9px] text-slate-500 truncate">{user?.email}</p>
                            </div>
                        </div>
                    ) : (
                        <div className="flex justify-center py-1">
                            <UserMenu />
                        </div>
                    )}
                </div>
            </div>
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <aside
                className={cn(
                    "hidden lg:block fixed inset-y-0 z-40 h-screen transition-all duration-300 bg-white border-slate-100 shadow-sm",
                    isRTL ? "right-0 border-l" : "left-0 border-r",
                    isOpen ? "w-64" : "w-20"
                )}
            >
                <SidebarContent />
            </aside>

            {/* Mobile Sidebar */}
            {isMobileOpen && (
                <>
                    <div
                        className="fixed inset-0 z-40 bg-black/50 lg:hidden"
                        onClick={toggleMobile}
                    />
                    <aside className={cn(
                        "fixed top-0 z-50 h-screen w-64 bg-white lg:hidden",
                        isRTL ? "right-0" : "left-0"
                    )}>
                        <SidebarContent />
                    </aside>
                </>
            )}

            {/* Mobile Menu Button */}
            <Button
                variant="ghost"
                size="icon"
                onClick={toggleMobile}
                className="fixed bottom-4 ltr:right-4 rtl:left-4 z-40 h-12 w-12 rounded-full shadow-lg lg:hidden"
            >
                <Menu className="h-6 w-6" />
            </Button>
        </>
    );
}


import {
    LayoutDashboard,
    GraduationCap,
    FileText,
    Library,
    MessageSquare,
    Calendar,
    Settings,
    Users,
    BookOpen,
    BarChart3,
    ClipboardCheck,
    Share2,
    Map,
    TrendingUp,
    Shield,
    Database,
    HelpCircle,
    Award,
    Target,
    Heart,
    Wallet,
    CalendarHeart,
    Globe
} from 'lucide-react';
import type { NavItem } from '@/store/useSidebarStore';
import type { UserRole } from '@/store/useAuthStore';

export const navigationConfig: Record<UserRole, NavItem[]> = {
    PARENT: [
        {
            icon: LayoutDashboard,
            label: 'dashboard.nav.home',
            href: '/parent'
        },
        {
            icon: GraduationCap,
            label: 'dashboard.nav.progression',
            href: '/parent/progression'
        },
        {
            icon: FileText,
            label: 'dashboard.nav.exercises',
            href: '/parent/exercises'
        },
        {
            icon: Library,
            label: 'dashboard.nav.library',
            href: '/parent/library'
        },
        {
            icon: MessageSquare,
            label: 'dashboard.nav.messages',
            href: '/parent/messages'
        },
        {
            icon: Calendar,
            label: 'dashboard.nav.calendar',
            href: '/parent/calendar'
        },
        {
            icon: Award,
            label: 'dashboard.nav.achievements',
            href: '/parent/achievements'
        },
        {
            icon: Settings,
            label: 'dashboard.nav.settings',
            href: '/parent/settings'
        }
    ],

    TEACHER: [
        {
            icon: LayoutDashboard,
            label: 'dashboard.nav.home',
            href: '/ecole/dashboard'
        },
        {
            icon: Users,
            label: 'dashboard.nav.classes',
            href: '/ecole/students'
        },
        {
            icon: BookOpen,
            label: 'dashboard.nav.exercises',
            href: '/ecole/assignments'
        },
        {
            icon: GraduationCap,
            label: 'dashboard.nav.grading',
            href: '/ecole/grades'
        },
        {
            icon: Calendar,
            label: 'dashboard.nav.calendar',
            href: '/ecole/attendance'
        },
        {
            icon: MessageSquare,
            label: 'dashboard.nav.messages',
            href: '/ecole/communication'
        },
        {
            icon: ClipboardCheck,
            label: 'dashboard.nav.planning',
            href: '/ecole/curriculum'
        },
        {
            icon: BarChart3,
            label: 'dashboard.nav.analytics',
            href: '/ecole/analytics'
        },
        {
            icon: Settings,
            label: 'dashboard.nav.settings',
            href: '/ecole/settings'
        }
    ],

    NGO: [
        {
            icon: LayoutDashboard,
            label: 'dashboard.nav.home',
            href: '/ong'
        },
        {
            icon: Target,
            label: 'dashboard.nav.programs',
            href: '/ong/programmes'
        },
        {
            icon: Heart,
            label: 'dashboard.nav.donors',
            href: '/ong/donateurs'
        },
        {
            icon: Users,
            label: 'dashboard.nav.beneficiaries',
            href: '/ong/beneficiaires'
        },
        {
            icon: Wallet,
            label: 'dashboard.nav.finances',
            href: '/ong/finances'
        },
        {
            icon: CalendarHeart,
            label: 'dashboard.nav.volunteers',
            href: '/ong/benevoles'
        },
        {
            icon: Globe,
            label: 'dashboard.nav.impact',
            href: '/ong/impact'
        },
        {
            icon: BarChart3,
            label: 'dashboard.nav.analytics',
            href: '/ong/analytics'
        },
        {
            icon: MessageSquare,
            label: 'dashboard.nav.communication',
            href: '/ong/communication'
        },
        {
            icon: Settings,
            label: 'dashboard.nav.settings',
            href: '/ong/settings'
        }
    ],
    ORGANIZATION: [
        {
            icon: LayoutDashboard,
            label: 'dashboard.nav.home',
            href: '/admin'
        },
        {
            icon: Users,
            label: 'dashboard.nav.users',
            href: '/admin/users'
        },
        {
            icon: BarChart3,
            label: 'dashboard.nav.analytics',
            href: '/admin/analytics'
        },
        {
            icon: Shield,
            label: 'dashboard.nav.compliance',
            href: '/admin/compliance'
        },
        {
            icon: Database,
            label: 'dashboard.nav.api',
            href: '/admin/api'
        },
        {
            icon: FileText,
            label: 'dashboard.nav.reports',
            href: '/admin/reports'
        },
        {
            icon: HelpCircle,
            label: 'dashboard.nav.support',
            href: '/admin/support'
        },
        {
            icon: Settings,
            label: 'dashboard.nav.settings',
            href: '/admin/settings'
        }
    ]
};

export function getNavigationForRole(role: UserRole | null): NavItem[] {
    if (!role) return [];
    return navigationConfig[role] || [];
}

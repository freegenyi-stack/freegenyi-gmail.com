'use client';

import { Link } from '@/lib/i18n/navigation';
import { useAuthStore } from '@/store/useAuthStore';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
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
import { User, Settings, LogOut, Trophy } from 'lucide-react';

export function UserMenu() {
    const t = useTranslations('navbar');
    const { user, logout, activeRole } = useAuthStore();
    const supabase = createClient();

    if (!user) return null;

    const handleLogout = async () => {
        await supabase.auth.signOut();
        logout();
        window.location.href = '/';
    };

    const userInitials = user.name
        ?.split(' ')
        .map(n => n[0])
        .join('')
        .toUpperCase() || '?';

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-10 w-10 rounded-full tour-user-menu">
                    <Avatar className="h-10 w-10">
                        <AvatarImage src={user.image || undefined} alt={user.name || ''} />
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                            {userInitials}
                        </AvatarFallback>
                    </Avatar>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">{user.name}</p>
                        <p className="text-xs leading-none text-muted-foreground">
                            {user.email}
                        </p>
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />

                {/* Dynamic Dashboard Link */}
                <DropdownMenuItem asChild>
                    <Link
                        href={
                            activeRole === 'TEACHER' ? "/ecole/dashboard" :
                                activeRole === 'NGO' || activeRole === 'ORGANIZATION' ? "/ngo" :
                                    "/parent"
                        }
                        className="cursor-pointer font-bold text-primary"
                    >
                        <Trophy className="me-2 h-4 w-4" />
                        <span>Mon Tableau de bord</span>
                    </Link>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem asChild>
                    <Link href="/parent/settings" className="cursor-pointer">
                        <User className="me-2 h-4 w-4" />
                        <span>{t('profile')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                    <Link href="/parent/settings" className="cursor-pointer">
                        <Settings className="me-2 h-4 w-4" />
                        <span>{t('settings')}</span>
                    </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="cursor-pointer text-red-600">
                    <LogOut className="me-2 h-4 w-4" />
                    <span>{t('logout')}</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

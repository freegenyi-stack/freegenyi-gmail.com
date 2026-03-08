'use client';

import * as React from 'react';
import { Link, useRouter } from '@/lib/i18n/navigation';
import { createClient } from '@/lib/supabase/client';
import { useTranslations } from 'next-intl';
import { useState, useEffect, useMemo } from 'react';
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

interface User {
    id: string;
    email: string;
    name: string | null;
    image: string | null;
}

export function UserMenu() {
    const t = useTranslations('navbar');
    const router = useRouter();
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);
    const supabase = createClient();

    useEffect(() => {
        // Get initial session
        const getUser = async () => {
            const { data: { session } } = await supabase.auth.getSession();
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || null,
                    image: session.user.user_metadata?.avatar_url || null
                });
            }
            setLoading(false);
        };

        getUser();

        // Listen for auth changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            if (session?.user) {
                setUser({
                    id: session.user.id,
                    email: session.user.email || '',
                    name: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || null,
                    image: session.user.user_metadata?.avatar_url || null
                });
            } else {
                setUser(null);
            }
            setLoading(false);
        });

        return () => subscription.unsubscribe();
    }, []);

    const handleLogout = async () => {
        await supabase.auth.signOut();
        router.push('/');
    };

    const userInitials = useMemo(() => {
        if (!user?.name) return '?';
        
        const getInitials = (displayName: string) => {
            const parts = displayName.trim().split(/\s+/);
            if (parts.length >= 2) {
                return (parts[0][0] + parts[1][0]).toUpperCase();
            }
            return displayName.slice(0, 2).toUpperCase();
        };
        
        return getInitials(user.name);
    }, [user?.name]);

    // Always render the component, but show loading state or nothing when not authenticated
    if (loading || !user) {
        return <div className="w-10 h-10" />; // Placeholder to maintain consistent hook usage
    }

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
                        href="/dashboard"
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

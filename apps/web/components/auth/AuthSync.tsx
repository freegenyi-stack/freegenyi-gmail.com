'use client';

import { useSession } from 'next-auth/react';
import { useEffect } from 'react';
import { useAuthStore, UserRole } from '@/store/useAuthStore';

export function AuthSync() {
    const { data: session, status } = useSession();
    const { setUser, logout } = useAuthStore();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            setUser({
                id: session.user.id,
                email: session.user.email!,
                name: session.user.name || null,
                image: session.user.image || null,
                roles: [session.user.role as UserRole],
            });
        } else if (status === 'unauthenticated') {
            logout();
        }
    }, [session, status, setUser, logout]);

    return null;
}

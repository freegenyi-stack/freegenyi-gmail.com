'use client';

import { useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useAuthStore, type UserRole } from '@/store/useAuthStore';

export function AuthStoreSync({ children }: { children: React.ReactNode }) {
    const { data: session, status } = useSession();
    const { setUser, user } = useAuthStore();

    useEffect(() => {
        if (status === 'authenticated' && session?.user) {
            // Only update if user has changed
            if (!user || user.email !== session.user.email) {
                setUser({
                    id: session.user.id || '',
                    email: session.user.email || '',
                    name: session.user.name || null,
                    image: session.user.image || null,
                    roles: [session.user.role as UserRole] // Convert single role to array
                });
            }
        } else if (status === 'unauthenticated' && user) {
            setUser(null);
        }
    }, [session, status, setUser, user]);

    return <>{children}</>;
}

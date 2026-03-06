'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, type UserRole } from '@/store/useAuthStore';

export function AuthStoreSync({ children }: { children: React.ReactNode }) {
    const { setUser, user } = useAuthStore();
    const supabase = createClient();

    useEffect(() => {
        const { data: { subscription } } = supabase.auth.onAuthStateChange(
            async (event, session) => {
                if (session?.user) {
                    if (!user || user.id !== session.user.id) {
                        setUser({
                            id: session.user.id,
                            email: session.user.email || '',
                            name: session.user.user_metadata?.full_name || session.user.user_metadata?.firstName || null,
                            image: session.user.user_metadata?.avatar_url || null,
                            roles: [session.user.user_metadata?.role || 'PARENT']
                        });
                    }
                } else {
                    if (user) setUser(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [setUser, user, supabase]);

    return <>{children}</>;
}

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
                    const metadata = session.user.user_metadata;
                    const detectedName = metadata?.full_name ||
                        metadata?.name ||
                        metadata?.firstName ||
                        session.user.email?.split('@')[0] ||
                        'Utilisateur';

                    setUser({
                        id: session.user.id,
                        email: session.user.email || '',
                        name: detectedName,
                        image: metadata?.avatar_url || null,
                        roles: [metadata?.role || 'PARENT']
                    });
                } else {
                    if (user) setUser(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [setUser, user, supabase]);

    return <>{children}</>;
}

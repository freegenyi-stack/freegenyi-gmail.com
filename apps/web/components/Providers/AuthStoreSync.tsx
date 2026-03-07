'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore, type UserRole } from '@/store/useAuthStore';

export function AuthStoreSync({ children }: { children: React.ReactNode }) {
    const { setUser, user } = useAuthStore();
    const supabase = createClient();

    useEffect(() => {
        // 1. Check current session immediately on mount
        const checkSession = async () => {
            const { data: { session } } = await supabase.auth.getSession();
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
            }
        };

        checkSession();

        // 2. Listen for changes
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
                } else if (event === 'SIGNED_OUT') {
                    setUser(null);
                }
            }
        );

        return () => subscription.unsubscribe();
    }, [supabase, setUser]);

    return <>{children}</>;
}

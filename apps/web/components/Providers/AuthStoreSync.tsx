'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

function buildUser(supabaseUser: any) {
    const metadata = supabaseUser.user_metadata || {};
    const detectedName =
        metadata.full_name ||
        metadata.name ||
        metadata.firstName ||
        supabaseUser.email?.split('@')[0] ||
        'Utilisateur';

    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: detectedName,
        image: metadata.avatar_url || null,
        roles: [metadata.role || 'PARENT'],
    };
}

export function AuthStoreSync({ children }: { children: React.ReactNode }) {
    const { setUser } = useAuthStore();
    const supabase = createClient();

    useEffect(() => {
        // Check session on mount using getUser() — recommended for security
        supabase.auth.getUser().then(({ data: { user } }) => {
            if (user) {
                setUser(buildUser(user));
            }
        });

        // Listen to auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(buildUser(session.user));
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, []); // eslint-disable-line react-hooks/exhaustive-deps

    return <>{children}</>;
}

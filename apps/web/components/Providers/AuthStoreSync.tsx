'use client';

import { useEffect } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAuthStore } from '@/store/useAuthStore';

function buildUser(supabaseUser: any) {
    const metadata = supabaseUser.user_metadata || {};
    const appMetadata = supabaseUser.app_metadata || {};

    // Try multiple sources for the name
    const detectedName =
        metadata.full_name ||
        metadata.name ||
        metadata.userName ||
        appMetadata.user_name ||
        appMetadata.name ||
        supabaseUser.user_metadata?.name ||
        supabaseUser.email?.split('@')[0] ||
        'Utilisateur';

    // Try multiple sources for the image
    const detectedImage =
        metadata.avatar_url ||
        metadata.picture ||
        metadata.image ||
        appMetadata.avatar_url ||
        supabaseUser.user_metadata?.picture ||
        null;

    // Get role from metadata or default to PARENT
    const detectedRole = metadata.role || appMetadata.role || 'PARENT';

    return {
        id: supabaseUser.id,
        email: supabaseUser.email || '',
        name: detectedName,
        image: detectedImage,
        roles: [detectedRole],
    };
}

export function AuthStoreSync({ children }: { children: React.ReactNode }) {
    const { setUser, user } = useAuthStore();
    const supabase = createClient();

    useEffect(() => {
        // Only fetch if we don't already have a trusted user state
        if (!user) {
            supabase.auth.getUser().then(({ data: { user: supabaseUser } }) => {
                if (supabaseUser) {
                    setUser(buildUser(supabaseUser));
                }
            }).catch(console.error);
        }

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

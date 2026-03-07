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
    const { setUser } = useAuthStore();
    const supabase = createClient();

    useEffect(() => {
        // Force sync on mount
        const syncSession = async () => {
            try {
                // getSession reads the local cookie/storage immediately without an active network request
                const { data: { session } } = await supabase.auth.getSession();
                if (session?.user) {
                    setUser(buildUser(session.user));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("Auth sync error:", error);
            }
        };

        syncSession();

        // Listen for all future auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
            if (session?.user) {
                setUser(buildUser(session.user));
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            }
        });

        return () => subscription.unsubscribe();
    }, [setUser, supabase]);

    return <>{children}</>;
}

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

    console.log("👤 Building user:", {
        email: supabaseUser.email,
        name: detectedName,
        image: detectedImage,
        role: detectedRole,
        metadata
    });

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
        // Initial auth check
        const initializeAuth = async () => {
            try {
                const { data: { user: supabaseUser } } = await supabase.auth.getUser();
                if (supabaseUser) {
                    console.log("🔄 Setting user from initial auth check:", supabaseUser.email);
                    setUser(buildUser(supabaseUser));
                } else {
                    setUser(null);
                }
            } catch (error) {
                console.error("❌ Error checking initial auth:", error);
                setUser(null);
            }
        };

        initializeAuth();

        // Listen to auth state changes (login, logout, token refresh)
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log("🔔 Auth state change:", event, session?.user?.email);
            
            if (event === 'SIGNED_IN' && session?.user) {
                setUser(buildUser(session.user));
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            } else if (event === 'TOKEN_REFRESHED' && session?.user) {
                // Update user data on token refresh
                setUser(buildUser(session.user));
            }
        });

        return () => subscription.unsubscribe();
    }, [setUser]); // Include setUser in dependencies

    return <>{children}</>;
}

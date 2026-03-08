import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    try {
        if (code) {
            const supabase = await createClient()
            console.log("🛠 Exchanging code for session...");
            const { data, error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error("❌ Supabase exchange error:", error.message);
                // Redirect directly to the error page so we don't proceed
                const errorUrl = new URL(`/fr/auth/error?error=OAuthCallbackError`, origin)
                return NextResponse.redirect(errorUrl)
            }

            const user = data?.user;

            if (user) {
                console.log("✅ User authenticated:", user.email);
                console.log("📋 User metadata:", user.user_metadata);
                console.log("📋 App metadata:", user.app_metadata);

                // Sync user to Prisma with better error handling
                try {
                    const { syncUserToPrisma } = await import('@/lib/auth/sync')
                    const syncedUser = await syncUserToPrisma(user)
                    console.log("🔄 User synced to Prisma:", syncedUser?.email);
                } catch (syncError) {
                    console.error('❌ Prisma sync error:', syncError)
                    // Continue anyway - auth is still valid
                }

                // Determine redirect path based on role
                let targetPath = next;
                if (targetPath === '/') {
                    // Try multiple sources for role
                    const role = user.user_metadata?.role ||
                        user.app_metadata?.role ||
                        'PARENT';

                    console.log("🎭 Determining redirect for role:", role);

                    if (role === 'TEACHER') targetPath = '/ecole/dashboard';
                    else if (role === 'NGO' || role === 'ORGANIZATION') targetPath = '/ngo';
                    else targetPath = '/parent';
                }

                // Ensure locale prefix (standardize to /fr/ if missing or use the one from targetPath)
                if (!targetPath.match(/^\/([a-z]{2,3})(\/|$)/)) {
                    targetPath = `/fr${targetPath.startsWith('/') ? '' : '/'}${targetPath}`;
                }

                // Robust redirect back to current origin
                const finalUrl = new URL(targetPath, origin)
                console.log("📍 Redirecting to:", finalUrl.toString());
                return NextResponse.redirect(finalUrl)
            }
        }
    } catch (err: any) {
        console.error("🔥 Callback crash:", err.message);
    }

    // Fallback: redirect to a localized auth error page
    const errorUrl = new URL('/fr/auth/error?error=OAuthCallbackError', origin)
    return NextResponse.redirect(errorUrl)
}

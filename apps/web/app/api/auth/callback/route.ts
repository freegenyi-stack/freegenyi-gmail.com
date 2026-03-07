import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    const next = searchParams.get('next') ?? '/'

    try {
        if (code) {
            const supabase = await createClient()
            console.log("🛠 Exchanging code for session...");
            const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error("❌ Supabase exchange error:", error.message);
                throw error;
            }

            if (user) {
                console.log("✅ User authenticated:", user.email);

                // Sync user to Prisma
                try {
                    const { syncUserToPrisma } = await import('@/lib/auth/sync')
                    await syncUserToPrisma(user)
                } catch (syncError) {
                    console.error('❌ Prisma sync error:', syncError)
                }

                // Determine redirect path
                let targetPath = next;
                if (targetPath === '/') {
                    const role = user.user_metadata?.role;
                    if (role === 'TEACHER') targetPath = '/ecole/dashboard';
                    else if (role === 'NGO' || role === 'ORGANIZATION') targetPath = '/ngo';
                    else targetPath = '/parent';
                }

                // Ensure locale prefix
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

    return NextResponse.redirect(`${origin}/auth/error?error=OAuthCallbackError`)
}

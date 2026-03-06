import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    if (code) {
        console.log("🔑 Code reçu, échange en cours...");
        const supabase = await createClient()
        console.log("🛠 Exchanging code for session...");
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error("❌ Erreur d'échange de code Supabase:", error.message);
        }

        if (user) {
            console.log("✅ User found after exchange:", user.id, "Email:", user.email);
            // Sync user to Prisma
            try {
                const { syncUserToPrisma } = await import('@/lib/auth/sync')
                await syncUserToPrisma(user)
            } catch (syncError) {
                console.error('❌ Erreur de synchronisation Prisma:', syncError)
            }

            const isLocalEnv = process.env.NODE_ENV === 'development'
            const forwardedHost = request.headers.get('x-forwarded-host')

            // Determine redirect target path
            let targetPath = next;
            if (targetPath === '/') {
                // Determine routing based on user role defaulting to PARENT
                const role = user.user_metadata?.role;
                if (role === 'TEACHER') targetPath = '/ecole/dashboard';
                else if (role === 'NGO' || role === 'ORGANIZATION') targetPath = '/ngo';
                else targetPath = '/parent';
            }

            // Add locale prefix if missing (default to 'fr' for FreeGeny)
            const localeMatch = targetPath.match(/^\/([a-z]{2,3})(\/|$)/);
            if (!localeMatch) {
                targetPath = `/fr${targetPath.startsWith('/') ? '' : '/'}${targetPath}`;
            }

            console.log("➡️ Redirecting to target path:", targetPath);

            // Prefer canonical SITE_URL for redirects in production to avoid domain/cookie mismatch
            const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;
            let baseUrl = origin;

            if (!isLocalEnv && siteUrl && siteUrl.startsWith('http')) {
                baseUrl = siteUrl.endsWith('/') ? siteUrl.slice(0, -1) : siteUrl;
                console.log("🌐 Using canonical site URL for base:", baseUrl);
            } else if (!isLocalEnv && forwardedHost) {
                baseUrl = `https://${forwardedHost}`;
            }

            const redirectUrl = `${baseUrl}${targetPath}`;

            console.log("📍 Final redirect URL:", redirectUrl);
            return NextResponse.redirect(redirectUrl)
        } else {
            console.warn("⚠️ No user returned from exchangeCodeForSession");
        }
    } else {
        console.warn("⚠️ No code found in searchParams");
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/error?error=OAuthCallbackError`)
}

import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: Request) {
    const { searchParams, origin } = new URL(request.url)
    const code = searchParams.get('code')
    // if "next" is in search params, use it as the redirect URL
    const next = searchParams.get('next') ?? '/'

    try {
        if (code) {
            const host = request.headers.get('host');
            console.log(`🔑 Code reçu sur Host: ${host}, échange en cours...`);
            const supabase = await createClient()

            // Log cookies for debugging
            const cookieStore = await import('next/headers').then(m => m.cookies())
            const allCookies = (await cookieStore).getAll()
            console.log(`🍪 Cookies reçus dans le callback: ${allCookies.map(c => c.name).join(', ')}`)

            console.log("🛠 Exchanging code for session...");
            const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

            if (error) {
                console.error("❌ Erreur d'échange de code Supabase:", error.message);
                throw error;
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

                console.log("➡️ Target path after logic:", targetPath);

                // 🛠️ ROBUST REDIRECT LOGIC
                const isLocalEnv = process.env.NODE_ENV === 'development'
                const canonicalDomain = 'www.freegeny.com'
                const siteUrl = process.env.NEXT_PUBLIC_SITE_URL
                const host = request.headers.get('host');

                let baseUrl = origin
                // If we are in production but NOT on the canonical domain yet (e.g., Vercel preview),
                // use the current origin instead of forcing the redirect to the broken domain.
                if (!isLocalEnv && host === canonicalDomain && siteUrl) {
                    let formattedUrl = siteUrl;
                    if (!formattedUrl.startsWith('http')) {
                        formattedUrl = `https://${formattedUrl}`;
                    }
                    baseUrl = formattedUrl.endsWith('/') ? formattedUrl.slice(0, -1) : formattedUrl;
                    console.log("🌐 Production: Using Canonical NEXT_PUBLIC_SITE_URL:", baseUrl)
                } else if (!isLocalEnv) {
                    // Stay on the current Vercel preview URL
                    const forwardedHost = request.headers.get('x-forwarded-host')
                    baseUrl = `https://${forwardedHost || host}`
                    console.log("🌐 Production (Preview/Other): Staying on current host:", baseUrl)
                }

                const finalUrlString = `${baseUrl}${targetPath.startsWith('/') ? '' : '/'}${targetPath}`;
                console.log("📍 Final redirecting to:", finalUrlString);


                return NextResponse.redirect(new URL(finalUrlString))
            } else {
                console.warn("⚠️ No user returned from exchangeCodeForSession");
            }
        } else {
            console.warn("⚠️ No code found in searchParams");
        }
    } catch (err: any) {
        console.error("🔥 Crash dans le callback route:", err.message);
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/error?error=OAuthCallbackError`)
}

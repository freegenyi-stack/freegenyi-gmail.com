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
        const { data: { user }, error } = await supabase.auth.exchangeCodeForSession(code)

        if (error) {
            console.error("❌ Erreur d'échange de code Supabase:", error.message);
        }

        if (user) {
            // Sync user to Prisma
            try {
                const { syncUserToPrisma } = await import('@/lib/auth/sync')
                await syncUserToPrisma(user)
            } catch (syncError) {
                console.error('❌ Erreur de synchronisation Prisma:', syncError)
            }

            const isLocalEnv = process.env.NODE_ENV === 'development'
            const forwardedHost = request.headers.get('x-forwarded-host')

            let redirectUrl: string;
            if (isLocalEnv) {
                redirectUrl = `${origin}${next}`;
            } else if (forwardedHost) {
                redirectUrl = `https://${forwardedHost}${next}`;
            } else {
                redirectUrl = `${origin}${next}`;
            }

            return NextResponse.redirect(redirectUrl)
        }
    }

    // return the user to an error page with instructions
    return NextResponse.redirect(`${origin}/auth/error?error=OAuthCallbackError`)
}

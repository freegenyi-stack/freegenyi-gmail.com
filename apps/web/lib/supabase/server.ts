import { createServerClient } from '@supabase/ssr'
import { cookies, headers } from 'next/headers'

export async function createClient() {
    const cookieStore = await cookies()
    const headerStack = await headers()
    const host = headerStack.get('host') || ''

    return createServerClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
        {
            cookies: {
                getAll() {
                    return cookieStore.getAll()
                },
                setAll(cookiesToSet) {
                    try {
                        cookiesToSet.forEach(({ name, value, options }) =>
                            cookieStore.set(name, value, {
                                ...options,
                                domain: options.domain,
                            })
                        )
                    } catch {
                        // setAll called from Server Component
                    }
                },
            },
            cookieOptions: {
                domain: host.includes('freegeny.com') ? '.freegeny.com' : undefined,
                path: '/',
            }
        }
    )
}

import { createClient } from '@supabase/supabase-js'

// Admin client uses service_role key — NEVER expose to browser
// Only use in server-side code: API routes, Server Actions, Route Handlers
export const supabaseAdmin = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
        auth: {
            autoRefreshToken: false,
            persistSession: false,
        },
    }
)

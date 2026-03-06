import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { syncUserToPrisma } from '@/lib/auth/sync'

export async function POST(req: NextRequest) {
    try {
        const supabase = await createClient()
        const { data: { user }, error } = await supabase.auth.getUser()

        if (error || !user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const prismaUser = await syncUserToPrisma(user)

        return NextResponse.json({ success: true, user: prismaUser })
    } catch (error: any) {
        console.error('Manual sync error:', error)
        return NextResponse.json({ error: error.message }, { status: 500 })
    }
}

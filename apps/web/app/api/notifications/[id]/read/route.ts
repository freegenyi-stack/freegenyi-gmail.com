import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import { prisma } from '@/lib/db'

// POST /api/notifications/[id]/read - Marquer une notification comme lue
export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { id } = params

    // Vérifier que la notification appartient à l'utilisateur
    const notification = await prisma.notification.findFirst({
      where: {
        id,
        userId: user.id,
      },
    })

    if (!notification) {
      return NextResponse.json(
        { error: 'Notification non trouvée' },
        { status: 404 }
      )
    }

    const updated = await prisma.notification.update({
      where: { id },
      data: { isRead: true },
    })

    return NextResponse.json({ notification: updated })
  } catch (error) {
    console.error('Erreur lors du marquage de la notification:', error)
    return NextResponse.json(
      { error: 'Erreur lors du marquage de la notification' },
      { status: 500 }
    )
  }
}

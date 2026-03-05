import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { prisma } from '@/lib/db'
import { authOptions } from '@/lib/auth/config'

// GET /api/notifications - Récupérer les notifications de l'utilisateur
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const { searchParams } = new URL(request.url)
    const limit = parseInt(searchParams.get('limit') || '50')
    const unreadOnly = searchParams.get('unread') === 'true'

    const notifications = await prisma.notification.findMany({
      where: {
        userId: session.user.id,
        ...(unreadOnly ? { isRead: false } : {}),
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: limit,
    })

    const unreadCount = await prisma.notification.count({
      where: {
        userId: session.user.id,
        isRead: false,
      },
    })

    return NextResponse.json({ notifications, unreadCount })
  } catch (error) {
    console.error('Erreur lors de la récupération des notifications:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des notifications' },
      { status: 500 }
    )
  }
}

// POST /api/notifications - Créer une notification
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)

    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Non authentifié' }, { status: 401 })
    }

    const body = await request.json()
    const { userId, type, title, message, data, actionUrl } = body

    // Vérifier les permissions (admin peut envoyer à n'importe qui)
    if (userId !== session.user.id && session.user.role !== 'ORGANIZATION') {
      return NextResponse.json({ error: 'Permission refusée' }, { status: 403 })
    }

    const notification = await prisma.notification.create({
      data: {
        userId,
        type,
        title,
        message,
        data,
        actionUrl,
        isRead: false,
      },
    })

    // Envoyer notification push si l'utilisateur est abonné
    await sendPushNotification(userId, { title, message, actionUrl })

    return NextResponse.json({ notification }, { status: 201 })
  } catch (error) {
    console.error('Erreur lors de la création de la notification:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la création de la notification' },
      { status: 500 }
    )
  }
}

// Fonction pour envoyer une notification push
async function sendPushNotification(userId: string, payload: { title: string; message: string; actionUrl?: string }) {
  try {
    // Récupérer les subscriptions push de l'utilisateur
    // Note: Dans une implémentation réelle, stocker les subscriptions dans la DB
    // et utiliser web-push pour envoyer les notifications

    // const subscriptions = await prisma.pushSubscription.findMany({
    //   where: { userId }
    // })

    // for (const sub of subscriptions) {
    //   await webPush.sendNotification(sub, JSON.stringify(payload))
    // }

    console.log('Push notification envoyée à', userId, payload)
  } catch (error) {
    console.error('Erreur lors de l\'envoi de la notification push:', error)
  }
}

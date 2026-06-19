import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";
import { getNotificationBadgeCount, getTotalUnreadMessageCount } from "@/lib/messaging/notify";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email));
    if (!user) return NextResponse.json({ notifications: [], unreadCount: 0, unreadMessages: 0 });

    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(30);

    const [unreadCount, unreadMessages] = await Promise.all([
      getNotificationBadgeCount(user.id),
      getTotalUnreadMessageCount(user.id),
    ]);

    return NextResponse.json({
      unreadCount,
      unreadMessages,
      notifications: rows.map((n) => ({
        id: n.id,
        type: n.type,
        title: n.title,
        content: n.content,
        link: n.link,
        isRead: n.isRead,
        createdAt: n.createdAt?.toISOString(),
      })),
    });
  } catch (error) {
    console.error("notifications GET:", error);
    return NextResponse.json({ error: "Erreur serveur", notifications: [], unreadCount: 0, unreadMessages: 0 }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, all, link } = await req.json();
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email));
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    if (all) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, user.id));
    } else if (link) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(
          and(
            eq(notifications.userId, user.id),
            eq(notifications.link, link),
            eq(notifications.type, "message")
          )
        );
    } else if (id) {
      const [row] = await db
        .select({ link: notifications.link, type: notifications.type })
        .from(notifications)
        .where(and(eq(notifications.userId, user.id), eq(notifications.id, id)))
        .limit(1);

      if (row?.type === "message" && row.link) {
        await db
          .update(notifications)
          .set({ isRead: true })
          .where(
            and(
              eq(notifications.userId, user.id),
              eq(notifications.link, row.link),
              eq(notifications.type, "message")
            )
          );
      } else {
        await db
          .update(notifications)
          .set({ isRead: true })
          .where(and(eq(notifications.userId, user.id), eq(notifications.id, id)));
      }
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

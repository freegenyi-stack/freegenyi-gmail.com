import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { notifications, users } from "@/db/schema";
import { eq, desc, and } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email));
    if (!user) return NextResponse.json({ notifications: [] });

    const rows = await db
      .select()
      .from(notifications)
      .where(eq(notifications.userId, user.id))
      .orderBy(desc(notifications.createdAt))
      .limit(30);

    return NextResponse.json({
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
    return NextResponse.json({ error: "Erreur serveur", notifications: [] }, { status: 500 });
  }
}

export async function PATCH(req: Request) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const { id, all } = await req.json();
    const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, session.user.email));
    if (!user) return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });

    if (all) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(eq(notifications.userId, user.id));
    } else if (id) {
      await db
        .update(notifications)
        .set({ isRead: true })
        .where(and(eq(notifications.userId, user.id), eq(notifications.id, id)));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

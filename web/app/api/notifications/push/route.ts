import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { pushSubscriptions, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isPushConfigured } from "@/lib/messaging/push-config";

async function resolveUser(email: string) {
  const [user] = await db.select({ id: users.id }).from(users).where(eq(users.email, email.toLowerCase()));
  return user ?? null;
}

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!isPushConfigured()) {
      return NextResponse.json({ configured: false, subscribed: false, count: 0 });
    }

    const user = await resolveUser(session.user.email);
    if (!user) {
      return NextResponse.json({ configured: true, subscribed: false, count: 0 });
    }

    const subs = await db
      .select({ id: pushSubscriptions.id })
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.userId, user.id));

    return NextResponse.json({
      configured: true,
      subscribed: subs.length > 0,
      count: subs.length,
    });
  } catch (error) {
    console.error("Push status error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!isPushConfigured()) {
      return NextResponse.json({ error: "PUSH_NOT_CONFIGURED" }, { status: 503 });
    }

    const body = await req.json();
    const subscription = body.subscription;
    if (!subscription?.endpoint || !subscription?.keys?.p256dh || !subscription?.keys?.auth) {
      return NextResponse.json({ error: "Abonnement invalide" }, { status: 400 });
    }

    const user = await resolveUser(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const ua = req.headers.get("user-agent") || undefined;

    const existing = await db
      .select({ id: pushSubscriptions.id })
      .from(pushSubscriptions)
      .where(eq(pushSubscriptions.endpoint, subscription.endpoint));

    if (existing.length > 0) {
      await db
        .update(pushSubscriptions)
        .set({
          userId: user.id,
          p256dh: subscription.keys.p256dh,
          auth: subscription.keys.auth,
          userAgent: ua,
        })
        .where(eq(pushSubscriptions.endpoint, subscription.endpoint));
    } else {
      await db.insert(pushSubscriptions).values({
        userId: user.id,
        endpoint: subscription.endpoint,
        p256dh: subscription.keys.p256dh,
        auth: subscription.keys.auth,
        userAgent: ua,
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Push subscribe error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const user = await resolveUser(session.user.email);
    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const body = await req.json().catch(() => ({}));
    const endpoint = body.endpoint as string | undefined;

    if (endpoint) {
      await db
        .delete(pushSubscriptions)
        .where(eq(pushSubscriptions.endpoint, endpoint));
    } else {
      await db.delete(pushSubscriptions).where(eq(pushSubscriptions.userId, user.id));
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Push unsubscribe error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

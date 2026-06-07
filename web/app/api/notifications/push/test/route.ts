import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isPushConfigured } from "@/lib/messaging/push-config";
import { sendWebPushToUser, buildNotificationUrl } from "@/lib/messaging/notify";

/** Envoie une notification push test à l'utilisateur connecté. */
export async function POST() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    if (!isPushConfigured()) {
      return NextResponse.json({ error: "PUSH_NOT_CONFIGURED" }, { status: 503 });
    }

    const [user] = await db
      .select({ id: users.id })
      .from(users)
      .where(eq(users.email, session.user.email.toLowerCase()));

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    const url = buildNotificationUrl("/dashboard/parent");
    const result = await sendWebPushToUser(user.id, {
      title: "FreeGeny — test",
      body: "Les notifications push fonctionnent. Bienvenue dans votre cockpit !",
      url,
    });

    if (result.sent === 0) {
      return NextResponse.json(
        {
          error: "NO_SUBSCRIPTION",
          message: "Aucun appareil abonné. Activez les notifications depuis le menu.",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({ ok: true, sent: result.sent });
  } catch (error) {
    console.error("Push test error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

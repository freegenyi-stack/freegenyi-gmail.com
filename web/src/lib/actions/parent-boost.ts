"use server";

import { revalidatePath } from "next/cache";
import { auth } from "@/auth";
import { db } from "@/db";
import { activityLogs, children, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userCanAccessChild } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { notifyUser } from "@/lib/messaging/notify";

const DEFAULT_MESSAGES = [
  "Tu es formidable, continue comme ça !",
  "Je suis fier(e) de toi — chaque effort compte.",
  "Bravo pour ton travail, on avance ensemble !",
];

export async function sendEmotionalBoostAction(childId: number, message?: string) {
  const session = await auth();
  if (!session?.user?.id) return { error: "Non autorisé" };

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) return { error: "Non autorisé." };

  const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
  if (!child) return { error: "Enfant introuvable." };

  const allowed = await userCanAccessChild(user, child);
  if (!allowed) return { error: "Accès refusé." };

  const text =
    message?.trim() ||
    DEFAULT_MESSAGES[Math.floor(Math.random() * DEFAULT_MESSAGES.length)];
  const firstName = child.fullName.split(" ")[0];

  try {
    await db.insert(activityLogs).values({
      userId: user.id,
      category: "boost",
      action: `Boost pour ${child.fullName}`,
      metadata: JSON.stringify({ childId, message: text, childName: child.fullName }),
    });

    if (child.parentId !== user.id) {
      await notifyUser({
        recipientUserId: child.parentId,
        type: "family",
        title: "Boost envoyé",
        content: `${user.fullName?.split(" ")[0] ?? "Un parent"} a encouragé ${firstName}.`,
        link: "/dashboard/parent",
        push: false,
      });
    }

    revalidatePath("/[locale]/dashboard/parent", "page");
    revalidatePath("/[locale]/lobby/[childId]", "page");
    return { success: true, message: text };
  } catch (error) {
    console.error("sendEmotionalBoostAction:", error);
    return { error: "Impossible d'envoyer le boost." };
  }
}

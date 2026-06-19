"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/db";
import { contactSubmissions, newsArticleComments, pedagogyShareComments, users, chatMessages, notifications } from "@/db/schema";
import { eq, inArray } from "drizzle-orm";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import {
  listNotificationRecipients,
  resolveEmailsForNotificationTarget,
  resolveContactFormEmails,
  resolveUserIdsForNotificationTarget,
  countNotificationRecipients,
  type AdminEmailTarget,
  type AdminNotificationTarget,
} from "@/lib/admin/mailing.server";
import { sendEmail } from "@/lib/email/send";
import { FREEGENY_EMAILS } from "@/lib/site-emails";
import { buildNotificationUrl, sendWebPushToUser } from "@/lib/messaging/notify";

export async function updateContactStatusAction(id: number, status: string, adminNote?: string) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await db
    .update(contactSubmissions)
    .set({ status, adminNote: adminNote ?? null, updatedAt: new Date() })
    .where(eq(contactSubmissions.id, id));

  revalidatePath("/dashboard/admin/contacts");
  return { success: true };
}

export async function hideCommentAction(commentId: number, hidden: boolean) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await db
    .update(newsArticleComments)
    .set({ isHidden: hidden })
    .where(eq(newsArticleComments.id, commentId));

  revalidatePath("/dashboard/admin/messages");
  return { success: true };
}

export async function hideMurCommentAction(commentId: number, hidden: boolean) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await db
    .update(pedagogyShareComments)
    .set({ isHidden: hidden })
    .where(eq(pedagogyShareComments.id, commentId));

  revalidatePath("/dashboard/admin/messages");
  revalidatePath("/dashboard/enseignant/mur");
  revalidatePath("/dashboard/parent/mur");
  return { success: true };
}

export async function setUserRoleAction(userId: number, role: string) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await db.update(users).set({ role, updatedAt: new Date() }).where(eq(users.id, userId));
  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function setUserBannedAction(userId: number, banned: boolean) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await db
    .update(users)
    .set({
      lockedUntil: banned ? new Date("2099-12-31") : null,
      updatedAt: new Date(),
    })
    .where(eq(users.id, userId));

  revalidatePath("/dashboard/admin/users");
  return { success: true };
}

export async function blockChatMediaAction(messageId: number, blocked: boolean) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await db
    .update(chatMessages)
    .set({
      mediaBlocked: blocked,
      moderatedAt: new Date(),
    })
    .where(eq(chatMessages.id, messageId));

  revalidatePath("/dashboard/admin/messages");
  return { success: true };
}

export async function hideChatMessageAction(messageId: number, hidden: boolean) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  await db
    .update(chatMessages)
    .set({
      isHidden: hidden,
      moderatedAt: new Date(),
    })
    .where(eq(chatMessages.id, messageId));

  revalidatePath("/dashboard/admin/messages");
  return { success: true };
}

const MAX_BROADCAST = 500;

export async function listNotificationRecipientsAction(
  target: AdminNotificationTarget,
  search?: string
) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const users = await listNotificationRecipients(target, { search, limit: MAX_BROADCAST });
  const total = await countNotificationRecipients(target);
  return { users, total };
}

export async function sendAdminNotificationAction(payload: {
  title: string;
  content: string;
  link?: string;
  target: AdminNotificationTarget;
  sendPush?: boolean;
  userIds?: number[];
  selectionMode?: "all" | "custom";
}) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const title = payload.title.trim();
  const content = payload.content.trim();
  if (!title || !content) return { error: "Titre et message obligatoires." };

  if (payload.selectionMode === "custom" && (!payload.userIds || payload.userIds.length === 0)) {
    return { error: "Sélectionnez au moins une personne dans le groupe." };
  }

  const userIds =
    payload.selectionMode === "custom"
      ? await resolveUserIdsForNotificationTarget(payload.target, payload.userIds)
      : await resolveUserIdsForNotificationTarget(payload.target);

  if (userIds.length === 0) return { error: "Aucun destinataire pour ce groupe." };
  if (userIds.length > MAX_BROADCAST) {
    return { error: `Trop de destinataires (${userIds.length}). Limite : ${MAX_BROADCAST}.` };
  }

  const link = payload.link?.trim() || "/dashboard/parent";
  const pushUrl = buildNotificationUrl(link, "fr");

  try {
    const CHUNK = 100;
    for (let i = 0; i < userIds.length; i += CHUNK) {
      const chunk = userIds.slice(i, i + CHUNK);
      await db.insert(notifications).values(
        chunk.map((userId) => ({
          userId,
          type: "alert",
          title,
          content,
          link,
          isRead: false,
        }))
      );
    }

    if (payload.sendPush !== false) {
      await Promise.allSettled(
        userIds.map((userId) =>
          sendWebPushToUser(userId, { title, body: content, url: pushUrl })
        )
      );
    }

    revalidatePath("/dashboard/admin/notifications");
    return { success: true, sent: userIds.length };
  } catch (error) {
    console.error("[admin] sendAdminNotificationAction:", error);
    return {
      error: error instanceof Error ? error.message : "Envoi impossible. Vérifiez la base de données.",
    };
  }
}

export async function sendAdminEmailAction(payload: {
  fromKey: keyof typeof FREEGENY_EMAILS;
  subject: string;
  body: string;
  target: AdminEmailTarget;
  selectionMode?: "all" | "custom";
  userIds?: number[];
  contactIds?: number[];
  manualEmails?: string;
}) {
  const admin = await requireAdminSession();
  if ("error" in admin) return admin;

  const subject = payload.subject.trim();
  const body = payload.body.trim();
  if (!subject || !body) return { error: "Objet et message obligatoires." };

  const from = FREEGENY_EMAILS[payload.fromKey];
  if (!from) return { error: "Boîte expéditeur invalide." };

  let recipients: string[] = [];

  if (payload.target === "manual") {
    recipients = (payload.manualEmails ?? "")
      .split(/[,;\n]+/)
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"));
  } else if (payload.target === "contact_form") {
    if (payload.selectionMode === "custom" && (!payload.contactIds || payload.contactIds.length === 0)) {
      return { error: "Sélectionnez au moins un contact." };
    }
    recipients = await resolveContactFormEmails(
      payload.selectionMode === "custom" ? payload.contactIds : undefined
    );
  } else {
    if (payload.selectionMode === "custom" && (!payload.userIds || payload.userIds.length === 0)) {
      return { error: "Sélectionnez au moins une personne dans le groupe." };
    }
    recipients = await resolveEmailsForNotificationTarget(
      payload.target,
      payload.selectionMode === "custom" ? payload.userIds : undefined
    );
  }

  if (recipients.length === 0) return { error: "Aucun destinataire sélectionné." };
  if (recipients.length > MAX_BROADCAST) {
    return { error: `Trop de destinataires (${recipients.length}). Limite : ${MAX_BROADCAST}.` };
  }

  const html = body.replace(/\n/g, "<br />");
  let sent = 0;
  const errors: string[] = [];

  try {
    for (const to of recipients) {
      const res = await sendEmail({ to, subject, html, text: body, from });
      if (res.ok) sent += 1;
      else errors.push(`${to}: ${res.error}`);
    }
  } catch (error) {
    console.error("[admin] sendAdminEmailAction:", error);
    return { error: error instanceof Error ? error.message : "Envoi impossible." };
  }

  revalidatePath("/dashboard/admin/emails");
  if (sent === 0) return { error: errors[0] || "Envoi impossible." };
  return { success: true, sent, failed: errors.length };
}

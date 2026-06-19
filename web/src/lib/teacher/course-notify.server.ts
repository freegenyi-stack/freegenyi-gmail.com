import { notifyUser } from "@/lib/messaging/notify";

export async function notifyCourseEpisodeReady(opts: {
  userId: number;
  courseSlug: string;
  courseTitleFr: string;
  courseTitleAr: string;
  nextEpisode: number;
  totalEpisodes: number;
  locale?: string;
}): Promise<void> {
  const { userId, courseSlug, courseTitleFr, courseTitleAr, nextEpisode, totalEpisodes, locale = "fr" } = opts;
  const isAr = locale.startsWith("ar");
  const title = isAr ? "حلقة جديدة متاحة" : "Nouvel épisode disponible";
  const courseTitle = isAr ? courseTitleAr : courseTitleFr;
  const body = isAr
    ? `${courseTitle} — الحلقة ${nextEpisode}/${totalEpisodes} جاهزة للمتابعة.`
    : `${courseTitle} — l'épisode ${nextEpisode}/${totalEpisodes} est prêt à suivre.`;

  await notifyUser({
    recipientUserId: userId,
    type: "achievement",
    title,
    content: body,
    link: `/dashboard/enseignant/formation/${courseSlug}`,
    locale,
    push: true,
    pushCategory: "news",
  });
}

export async function notifyCourseCompleted(opts: {
  userId: number;
  courseSlug: string;
  courseTitleFr: string;
  courseTitleAr: string;
  certificateCode: string;
  locale?: string;
}): Promise<void> {
  const { userId, courseSlug, courseTitleFr, courseTitleAr, certificateCode, locale = "fr" } = opts;
  const isAr = locale.startsWith("ar");
  const title = isAr ? "تكوين مكتمل!" : "Formation terminée !";
  const courseTitle = isAr ? courseTitleAr : courseTitleFr;
  const body = isAr
    ? `أحسنت! أكملت « ${courseTitle} ». شهادتك جاهزة (${certificateCode}).`
    : `Bravo ! Vous avez terminé « ${courseTitle} ». Votre certificat est prêt (${certificateCode}).`;

  await notifyUser({
    recipientUserId: userId,
    type: "achievement",
    title,
    content: body,
    link: `/dashboard/enseignant/formation/${courseSlug}`,
    locale,
    push: true,
    pushCategory: "news",
  });
}

import { db } from "@/db";
import { users } from "@/db/schema";
import { inArray, eq } from "drizzle-orm";
import { getFamilyChildren } from "@/lib/family/server";
import { parseParentPreferences } from "@/lib/parent/parent-settings";
import { getParentDashboardInsights } from "@/lib/parent/dashboard-insights.server";
import { sendEmail, buildAppBaseUrl } from "@/lib/email/send";
import { buildEliteEmailBody, escapeHtml } from "@/lib/email/template";
import { notifyUser } from "@/lib/messaging/notify";

type DigestResult = {
  sent: number;
  skipped: number;
  errors: number;
  pushed?: number;
  reason?: string;
};

function weekKey(): string {
  const d = new Date();
  const onejan = new Date(d.getFullYear(), 0, 1);
  const week = Math.ceil(((d.getTime() - onejan.getTime()) / 86400000 + onejan.getDay() + 1) / 7);
  return `${d.getFullYear()}-W${week}`;
}

function dayKey(): string {
  return new Date().toISOString().slice(0, 10);
}

function parseMeta(raw: string | null): Record<string, unknown> {
  if (!raw?.trim()) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

function pendingSignature(children: { childId: number; pendingMissions: number }[]): string {
  return children.map((c) => `${c.childId}:${c.pendingMissions}`).sort().join("|");
}

function buildReportHtml(input: {
  parentName: string;
  locale: string;
  children: {
    name: string;
    streak: number;
    level: number;
    booksRead: number;
    pendingMissions: number;
    totalXp: number;
  }[];
  baseUrl: string;
  missionAlerts: boolean;
  readingDigest: boolean;
}): { subject: string; html: string; text: string } {
  const isAr = input.locale.startsWith("ar");
  const subject = isAr ? "ملخص FreeGeny الأسبوعي" : "Votre résumé FreeGeny — semaine en cours";

  const childBlocks = input.children
    .map((c) => {
      const alert =
        input.missionAlerts && c.pendingMissions > 0
          ? isAr
            ? `<p style="color:#ea580c;font-weight:bold;">⚠ ${c.pendingMissions} مهمة(ات) معلقة</p>`
            : `<p style="color:#ea580c;font-weight:bold;">⚠ ${c.pendingMissions} mission(s) en attente</p>`
          : "";
      const streakPart = input.readingDigest
        ? isAr
          ? `سلسلة القراءة: ${c.streak} ي · `
          : `Série lecture : ${c.streak} j · `
        : "";
      const statsLine = isAr
        ? `${streakPart}المستوى ${c.level} · ${c.booksRead} كتاب · ${c.totalXp} XP`
        : `${streakPart}Niveau ${c.level} · ${c.booksRead} livre(s) · ${c.totalXp} XP`;
      return `
        <div style="margin:16px 0;padding:16px;border:1px solid #e2e8f0;border-radius:12px;">
          <h3 style="margin:0 0 8px;color:#0f172a;">${escapeHtml(c.name)}</h3>
          ${alert}
          <p style="margin:0;color:#475569;font-size:14px;">${statsLine}</p>
        </div>`;
    })
    .join("");

  const cta = isAr ? "فتح لوحة الأولياء" : "Ouvrir mon espace parent";
  const intro = isAr
    ? `مرحباً ${escapeHtml(input.parentName.split(" ")[0])}، إليك ملخص أسبوع أطفالك على FreeGeny.`
    : `Bonjour ${escapeHtml(input.parentName.split(" ")[0])}, voici le résumé hebdomadaire de vos enfants sur FreeGeny.`;

  const inner = `
    <p>${intro}</p>
    ${childBlocks}
    <p style="margin-top:24px;text-align:center;">
      <a href="${input.baseUrl}/dashboard/parent/progres" style="display:inline-block;background:#0d9488;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">${cta}</a>
    </p>
  `;

  const html = buildEliteEmailBody(inner, { dir: isAr ? "rtl" : "ltr" });

  const text = input.children
    .map(
      (c) =>
        `${c.name}: niveau ${c.level}, ${c.booksRead} livres, ${c.pendingMissions} missions en attente, ${c.totalXp} XP`
    )
    .join("\n");

  return { subject, html, text: `${intro.replace(/<[^>]+>/g, "")}\n\n${text}` };
}

export async function sendParentWeeklyDigest(opts?: {
  locale?: string;
  dryRun?: boolean;
}): Promise<DigestResult> {
  const locale = opts?.locale ?? "fr";
  const currentWeek = weekKey();
  const baseUrl = buildAppBaseUrl();
  const isAr = locale.startsWith("ar");

  const adults = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      familyId: users.familyId,
      metadata: users.metadata,
    })
    .from(users)
    .where(inArray(users.role, ["parent", "coparent"]));

  if (adults.length === 0) {
    return { sent: 0, skipped: 0, errors: 0, pushed: 0, reason: "no_parents" };
  }

  let sent = 0;
  let skipped = 0;
  let errors = 0;
  let pushed = 0;

  for (const adult of adults) {
    const prefs = parseParentPreferences(adult.metadata);
    if (!prefs.weeklyReport) {
      skipped++;
      continue;
    }

    const meta = parseMeta(adult.metadata);
    if (meta.lastParentReportWeek === currentWeek && !opts?.dryRun) {
      skipped++;
      continue;
    }

    const childrenRows = await getFamilyChildren(adult);
    if (childrenRows.length === 0) {
      skipped++;
      continue;
    }

    const insights = await getParentDashboardInsights(childrenRows);
    const summaries = insights.children.map((c) => ({
      name: c.fullName,
      streak: c.readingStats.readingStreakDays,
      level: c.stats.level,
      booksRead: c.stats.booksRead,
      pendingMissions: c.stats.pendingMissions,
      totalXp: c.stats.totalXp,
    }));

    const { subject, html, text } = buildReportHtml({
      parentName: adult.fullName || "Parent",
      locale,
      children: summaries,
      baseUrl,
      missionAlerts: prefs.missionAlerts,
      readingDigest: prefs.readingDigest,
    });

    const pushTitle = isAr ? "ملخص الأسبوع" : "Résumé de la semaine";
    const pushContent = summaries.map((c) => `${c.name}: niv. ${c.level}, ${c.totalXp} XP`).join(" · ");

    if (opts?.dryRun) {
      sent++;
      pushed++;
      continue;
    }

    if (adult.email) {
      const emailResult = await sendEmail({
        to: adult.email,
        subject,
        html,
        text,
        rawHtml: true,
        dir: isAr ? "rtl" : "ltr",
      });

      if (!emailResult.ok) {
        errors++;
        continue;
      }
      sent++;
    } else {
      skipped++;
    }

    await notifyUser({
      recipientUserId: adult.id,
      type: "system",
      title: pushTitle,
      content: pushContent.slice(0, 180),
      link: "/dashboard/parent/progres",
      locale,
      push: true,
      pushCategory: "digest",
    });
    pushed++;

    meta.lastParentReportWeek = currentWeek;
    await db
      .update(users)
      .set({ metadata: JSON.stringify(meta), updatedAt: new Date() })
      .where(eq(users.id, adult.id));
  }

  return { sent, skipped, errors, pushed };
}

/** Alertes missions — max 1×/semaine par parent, resync si le nombre de missions change. */
export async function sendParentMissionAlerts(opts?: { dryRun?: boolean }): Promise<DigestResult> {
  const baseUrl = buildAppBaseUrl();
  const currentWeek = weekKey();
  const today = dayKey();

  const adults = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      familyId: users.familyId,
      metadata: users.metadata,
    })
    .from(users)
    .where(inArray(users.role, ["parent", "coparent"]));

  let sent = 0;
  let skipped = 0;
  let errors = 0;
  let pushed = 0;

  for (const adult of adults) {
    const prefs = parseParentPreferences(adult.metadata);
    if (!prefs.missionAlerts) {
      skipped++;
      continue;
    }

    const childrenRows = await getFamilyChildren(adult);
    if (childrenRows.length === 0) {
      skipped++;
      continue;
    }

    const insights = await getParentDashboardInsights(childrenRows);
    const pending = insights.children.filter((c) => c.stats.pendingMissions > 0);
    if (pending.length === 0) {
      skipped++;
      continue;
    }

    const signature = pendingSignature(
      pending.map((c) => ({ childId: c.childId, pendingMissions: c.stats.pendingMissions }))
    );

    const meta = parseMeta(adult.metadata);
    const lastAlert = meta.lastParentMissionAlert as
      | { week?: string; day?: string; signature?: string }
      | undefined;

    if (
      lastAlert?.week === currentWeek &&
      lastAlert?.signature === signature &&
      lastAlert?.day === today
    ) {
      skipped++;
      continue;
    }

    if (lastAlert?.week === currentWeek && lastAlert?.signature === signature) {
      skipped++;
      continue;
    }

    const names = pending.map((c) => `${c.fullName} (${c.stats.pendingMissions})`).join(", ");
    const subject = "FreeGeny — missions en attente";
    const inner = `
      <p>Bonjour ${escapeHtml(adult.fullName?.split(" ")[0] ?? "")},</p>
      <p>Des missions sont en attente pour : <strong>${escapeHtml(names)}</strong>.</p>
      <p style="margin-top:20px;text-align:center;">
        <a href="${baseUrl}/dashboard/parent/atelier" style="display:inline-block;background:#ea580c;color:#fff;padding:12px 20px;border-radius:8px;text-decoration:none;font-weight:bold;">Voir l'atelier</a>
      </p>
    `;
    const html = buildEliteEmailBody(inner);

    if (opts?.dryRun) {
      sent++;
      pushed++;
      continue;
    }

    if (adult.email) {
      const res = await sendEmail({
        to: adult.email,
        subject,
        html,
        text: `Missions en attente: ${names}`,
        rawHtml: true,
      });
      if (!res.ok) {
        errors++;
        continue;
      }
      sent++;
    }

    await notifyUser({
      recipientUserId: adult.id,
      type: "alert",
      title: "Missions en attente",
      content: names.slice(0, 160),
      link: "/dashboard/parent/atelier",
      push: true,
      pushCategory: "digest",
    });
    pushed++;

    meta.lastParentMissionAlert = { week: currentWeek, day: today, signature };
    await db
      .update(users)
      .set({ metadata: JSON.stringify(meta), updatedAt: new Date() })
      .where(eq(users.id, adult.id));
  }

  return { sent, skipped, errors, pushed };
}

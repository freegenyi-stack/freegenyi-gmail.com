import { sendEmail, buildAppBaseUrl, type SendEmailResult } from "@/lib/email/send";
import { escapeHtml } from "@/lib/email/template";

type FamilyInviteEmailParams = {
  to: string;
  inviterName: string;
  token: string;
  locale?: string;
};

export function buildFamilyInviteUrl(token: string, locale?: string): string {
  const base = buildAppBaseUrl();
  const prefix = locale ? `/${locale}` : "";
  return `${base}${prefix}/auth/invite?token=${encodeURIComponent(token)}`;
}

export async function sendFamilyInvitationEmail(
  params: FamilyInviteEmailParams
): Promise<SendEmailResult> {
  const inviteUrl = buildFamilyInviteUrl(params.token, params.locale);
  const inviter = params.inviterName.trim() || "Un parent";
  const isAr = params.locale?.endsWith("-ar") || params.locale === "ar";

  const subject = isAr
    ? "دعوة : انضموا إلى مساحة عائلتكم على FreeGeny"
    : "Invitation : Rejoignez votre espace familial FreeGeny";

  const innerHtml = isAr
    ? familyInviteInnerAr({ inviter, inviteUrl })
    : familyInviteInnerFr({ inviter, inviteUrl });

  const text = isAr
    ? `${inviter} يدعوك للانضمام إلى عائلته على FreeGeny.\n\n${inviteUrl}`
    : `${inviter} vous invite à rejoindre son espace familial sur FreeGeny.\n\n${inviteUrl}`;

  return sendEmail({
    to: params.to,
    subject,
    html: innerHtml,
    text,
    dir: isAr ? "rtl" : "ltr",
  });
}

/** Corps interne — équivalent sendInviteParent() PHP */
function familyInviteInnerFr(params: { inviter: string; inviteUrl: string }) {
  return `
    <h1 style="color:#0f172a;font-size:24px;text-align:center;">Une invitation pour vous</h1>
    <p>Bonjour,</p>
    <p><strong>${escapeHtml(params.inviter)}</strong> vous invite à rejoindre son espace familial sur <strong>FreeGeny</strong>.</p>
    <div style="margin-top:40px;text-align:center;">
      <a href="${params.inviteUrl}" style="display:inline-block;background:#ea580c;color:white;padding:18px 36px;border-radius:12px;text-decoration:none;font-weight:bold;">
        Rejoindre ma famille
      </a>
    </div>
    <p style="margin-top:24px;font-size:13px;color:#64748b;text-align:center;">
      Lien valable 14 jours.<br/>
      <a href="${params.inviteUrl}" style="color:#ea580c;word-break:break-all;">${params.inviteUrl}</a>
    </p>`;
}

function familyInviteInnerAr(params: { inviter: string; inviteUrl: string }) {
  return `
    <div dir="rtl" style="text-align:right;">
      <h1 style="color:#0f172a;font-size:24px;text-align:center;">دعوة لكم</h1>
      <p>مرحباً،</p>
      <p>يدعوكم <strong>${escapeHtml(params.inviter)}</strong> للانضمام إلى مساحته العائلية على <strong>FreeGeny</strong>.</p>
      <div style="margin-top:40px;text-align:center;">
        <a href="${params.inviteUrl}" style="display:inline-block;background:#ea580c;color:white;padding:18px 36px;border-radius:12px;text-decoration:none;font-weight:bold;">
          الانضمام إلى عائلتي
        </a>
      </div>
      <p style="margin-top:24px;font-size:13px;color:#64748b;text-align:center;">
        <a href="${params.inviteUrl}" style="color:#ea580c;word-break:break-all;">${params.inviteUrl}</a>
      </p>
    </div>`;
}

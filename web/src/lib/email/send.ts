import { buildEliteEmailBody } from "@/lib/email/template";

type SendEmailParams = {
  to: string;
  subject: string;
  /** Contenu HTML interne (sans enveloppe Elite) ou HTML complet si rawHtml=true */
  html: string;
  text?: string;
  /** Si true, html est envoyé tel quel (déjà enveloppé). */
  rawHtml?: boolean;
  dir?: "rtl" | "ltr";
};

export type SendEmailResult =
  | { ok: true; provider: "resend" | "smtp" | "dev" }
  | { ok: false; error: string };

function getFromAddress(): string {
  return (
    process.env.EMAIL_FROM ||
    process.env.RESEND_FROM ||
    "FreeGeny Elite <contact@freegeny.com>"
  );
}

function useAyradeLocalSmtp(): boolean {
  return (
    process.env.FREEGENY_SMTP_LOCAL === "true" ||
    process.env.SMTP_HOST === "localhost"
  );
}

function getSmtpConfig() {
  const ayrade = useAyradeLocalSmtp();
  const host = process.env.SMTP_HOST || (ayrade ? "localhost" : "");
  const port = parseInt(process.env.SMTP_PORT || (ayrade ? "25" : "587"), 10);
  const authDisabled =
    process.env.SMTP_AUTH === "false" ||
    (ayrade && process.env.SMTP_AUTH !== "true");
  const user = process.env.SMTP_USER || "contact@freegeny.com";
  const pass = process.env.SMTP_PASS || "";
  const secure =
    process.env.SMTP_SECURE === "true" || (!authDisabled && port === 465);

  return { host, port, authDisabled, user, pass, secure };
}

function wrapHtml(params: SendEmailParams): string {
  if (params.rawHtml) return params.html;
  return buildEliteEmailBody(params.html, { dir: params.dir });
}

async function sendViaResend(params: SendEmailParams): Promise<SendEmailResult> {
  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) return { ok: false, error: "RESEND_API_KEY manquant" };

  const html = wrapHtml(params);
  const res = await fetch("https://api.resend.com/emails", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      from: getFromAddress(),
      to: [params.to],
      subject: params.subject,
      html,
      text: params.text,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => "");
    return { ok: false, error: `Resend ${res.status}: ${body.slice(0, 200)}` };
  }

  return { ok: true, provider: "resend" };
}

async function sendViaSmtp(params: SendEmailParams): Promise<SendEmailResult> {
  const { host, port, authDisabled, user, pass, secure } = getSmtpConfig();
  if (!host) return { ok: false, error: "SMTP_HOST manquant" };
  if (!authDisabled && (!user || !pass)) {
    return { ok: false, error: "SMTP_USER / SMTP_PASS requis" };
  }

  try {
    const nodemailer = await import("nodemailer");
    const transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      ...(authDisabled
        ? { ignoreTLS: port === 25, tls: { rejectUnauthorized: false } }
        : { auth: { user, pass } }),
    });

    await transporter.sendMail({
      from: getFromAddress(),
      to: params.to,
      subject: params.subject,
      html: wrapHtml(params),
      text: params.text,
      envelope: authDisabled ? { from: user, to: params.to } : undefined,
    });

    return { ok: true, provider: "smtp" };
  } catch (error) {
    const message = error instanceof Error ? error.message : "Erreur SMTP";
    return { ok: false, error: message };
  }
}

function smtpConfigured(): boolean {
  const { host, authDisabled, user, pass } = getSmtpConfig();
  if (!host) return false;
  if (authDisabled) return true;
  return Boolean(user && pass);
}

/**
 * Envoi transactionnel — calqué sur MailManager.php :
 * 1. SMTP local Ayrade (localhost:25, sans auth) si configuré
 * 2. Resend (cloud)
 * 3. log console en dev local
 */
export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  const to = params.to.toLowerCase().trim();
  if (!to.includes("@")) return { ok: false, error: "Destinataire invalide" };

  if (smtpConfigured()) {
    const smtp = await sendViaSmtp({ ...params, to });
    if (smtp.ok) return smtp;
    console.warn("[email] SMTP failed:", smtp.error);
  }

  if (process.env.RESEND_API_KEY) {
    const res = await sendViaResend({ ...params, to });
    if (res.ok) return res;
    console.warn("[email] Resend failed:", res.error);
  }

  const devLog =
    process.env.NODE_ENV === "development" ||
    process.env.FREEGENY_DEV_AUTO_APPROVE === "true";

  if (devLog) {
    console.log("[email:dev]", {
      to,
      subject: params.subject,
      from: getFromAddress(),
      text: params.text,
    });
    return { ok: true, provider: "dev" };
  }

  return {
    ok: false,
    error:
      "Aucun service e-mail configuré. Ajoutez FREEGENY_SMTP_LOCAL=true (Ayrade) ou RESEND_API_KEY.",
  };
}

export function buildAppBaseUrl(): string {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXTAUTH_URL ||
    "http://localhost:3000"
  ).replace(/\/$/, "");
}

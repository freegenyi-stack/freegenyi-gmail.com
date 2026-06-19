/**
 * Boîtes mail et domaine officiels FreeGeny (freegeny.com).
 * Les env vars peuvent surcharger pour staging ; ces valeurs servent de défaut prod.
 */
export const FREEGENY_SITE = {
  domain: "freegeny.com",
  url: process.env.NEXT_PUBLIC_APP_URL || "https://freegeny.com",
} as const;

export const FREEGENY_EMAILS = {
  /** Dashboard admin — doit correspondre à FREEGENY_ADMIN_EMAILS */
  admin: "admin@freegeny.com",
  /** SMTP / invitations / e-mails transactionnels */
  contact: "contact@freegeny.com",
  /** Support utilisateurs (pages aide, contact) */
  support: "support@freegeny.com",
  /** Presse — créer la boîte ou alias → contact@ */
  press: "press@freegeny.com",
  /** Web Push VAPID (mailto) — contact@ suffit si pas de boîte dédiée */
  notifications: "contact@freegeny.com",
} as const;

export function freegenyFromAddress(label = "FreeGeny"): string {
  return `${label} <${FREEGENY_EMAILS.contact}>`;
}

/** Liste CSV pour FREEGENY_ADMIN_EMAILS (un ou plusieurs admins) */
export function defaultAdminEmailsCsv(): string {
  return FREEGENY_EMAILS.admin;
}

/** Configuration Web Push (VAPID) — serveur uniquement. */

import { FREEGENY_EMAILS } from "@/lib/site-emails";

export function isPushConfigured(): boolean {
  return Boolean(
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY && process.env.VAPID_PRIVATE_KEY
  );
}

export function getVapidContactEmail(): string {
  return process.env.VAPID_CONTACT_EMAIL || FREEGENY_EMAILS.notifications;
}

export function getVapidPublicKey(): string | undefined {
  return process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
}

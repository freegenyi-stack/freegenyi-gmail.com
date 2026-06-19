/**
 * Périmètre messagerie FreeGeny — décisions produit / infra (clôture MVP).
 *
 * Infra volontairement simple (mono-instance, déploiement actuel) :
 * - Temps réel : SSE + getMessagesSince (poll 2 s), pas de WebSocket/broker
 * - Médias : public/uploads/chat/ + ACL API /api/chat/media, pas de S3
 * - Push : Web Push VAPID (PWA), pas de FCM/APNs natif
 * - Rate-limit : Map en mémoire (conversations.server), pas Redis/cluster
 * - Fuseau horaires parents : FREEGENY_MESSAGING_TZ ou Africa/Algiers (global)
 * - Visio / appels live : stand-by UI (FeatureSoonModal), pas de WebRTC
 *
 * Hors scope actuel (non implémenté volontairement) :
 * - Groupes privés ad hoc, recherche globale multi-fils, chiffrement E2E,
 *   brouillons persistants / offline, export & rétention légale
 * - Messagerie comptes enfants : pas de compte utilisateur enfant (profils liés au parent)
 */

import type { MessagingRole } from "./types";

export const MESSAGING_REALTIME_MODE = "sse" as const;
export const MESSAGING_SSE_POLL_MS = 2000;
export const MESSAGING_MEDIA_STORAGE = "local-public-uploads" as const;
export const MESSAGING_PUSH_MODE = "web-push-vapid" as const;
export const MESSAGING_RATE_LIMIT_MODE = "in-memory" as const;

export const MESSAGING_DEFAULT_TIMEZONE =
  process.env.FREEGENY_MESSAGING_TZ || "Africa/Algiers";

export const MESSAGING_ALLOWED_ROLES: readonly MessagingRole[] = [
  "parent",
  "coparent",
  "enseignant",
  "ecole",
  "ong",
];

export function isMessagingRole(role: string | null | undefined): role is MessagingRole {
  return MESSAGING_ALLOWED_ROLES.includes(role as MessagingRole);
}

/** Comptes enfants : entités `children`, pas d'utilisateur messagerie. */
export function childAccountsHaveMessaging(): false {
  return false;
}

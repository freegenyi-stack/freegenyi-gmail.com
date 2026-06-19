/** Chemin public du serveur interactif (proxy Next.js → conteneur). */
export const INTERACTIVE_BASE_PATH = "/ix";

/** Segment d'URL atelier pour les activités (sans jargon technique). */
export const ATELIER_ACTIVITY_PATH = "activite";

export function getH5pServerUrl(): string | null {
  const url = process.env.H5P_SERVER_URL?.replace(/\/$/, "");
  if (!url) return null;
  // Évite les échecs fetch IPv6 (::1) sous Windows quand le conteneur écoute en IPv4.
  return url.replace(/^http:\/\/localhost(?=[:/]|$)/i, "http://127.0.0.1");
}

/** URL publique des iframes — même origine via rewrite Next.js par défaut. */
export function getH5pPublicUrl(): string | null {
  if (process.env.INTERACTIVE_SAME_ORIGIN === "0") {
    const url =
      process.env.NEXT_PUBLIC_H5P_URL?.replace(/\/$/, "") ||
      process.env.H5P_SERVER_URL?.replace(/\/$/, "");
    return url || null;
  }
  return "";
}

export function isH5pConfigured(): boolean {
  return Boolean(getH5pServerUrl());
}

export function h5pEditorPath(contentId: string): string {
  return `${INTERACTIVE_BASE_PATH}/${contentId}/edit`;
}

export function h5pPlayerPath(contentId: string): string {
  return `${INTERACTIVE_BASE_PATH}/${contentId}/play`;
}

export function atelierActivityPath(resourceId: number | string, basePath: string): string {
  return `${basePath}/${ATELIER_ACTIVITY_PATH}/${resourceId}`;
}

/** Langue interface éditeur / lecteur H5P selon locale Next.js. */
export function h5pLanguageFromLocale(locale: string): string {
  if (locale === "ar" || locale.endsWith("-ar")) return "ar";
  return "fr";
}

export function appendH5pLanguage(path: string, locale?: string): string {
  if (!locale) return path;
  const lang = h5pLanguageFromLocale(locale);
  const sep = path.includes("?") ? "&" : "?";
  return `${path}${sep}language=${lang}`;
}

import type { LibraryErrorCode } from "@/lib/library/library-errors";

export function translateLibraryError(
  t: (key: string) => string,
  code?: string | null
): string {
  if (code && /^[a-z_]+$/.test(code)) {
    return t(`errors.${code as LibraryErrorCode}`);
  }
  return t("errors.upload_failed");
}

export function translateBadgeLabel(
  t: (key: string) => string,
  badgeKey: string,
  fallback?: string
): string {
  try {
    return t(`badges.${badgeKey}`);
  } catch {
    return fallback ?? badgeKey;
  }
}

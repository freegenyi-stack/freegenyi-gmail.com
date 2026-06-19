/** Clés de badges — libellés via Library.badges.{key} */
export const LIBRARY_BADGE_KEYS = [
  "first_book",
  "reader_3",
  "reader_5",
  "pages_100",
  "pages_500",
] as const;

export type LibraryBadgeKey = (typeof LIBRARY_BADGE_KEYS)[number];

export function isLibraryBadgeKey(key: string): key is LibraryBadgeKey {
  return (LIBRARY_BADGE_KEYS as readonly string[]).includes(key);
}

import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = [
  'ar', 'fr', 'en', 'nl', 'de', 'it', 'es', 'pt', 'tr', 'ru', 'be', 'uk', 'pl', 'ro', 'el', 'hu', 'cs', 'da', 'no', 'sv', 'fi', 'ga', 'af', 'zu', 'xh', 'zh', 'ms', 'ta', 'ja', 'ko', 'hi', 'mi', 'th', 'vi', 'id', 'ku',
  'DZ-ar', 'DZ-fr', 'DZ-en', 'DZ-pt',
  'FR-ar', 'FR-fr', 'FR-en', 'FR-pt',
  'MA-ar', 'MA-fr', 'MA-en',
  'TN-ar', 'TN-fr', 'TN-en',
  'BE-ar', 'BE-fr', 'BE-nl', 'BE-en',
  'CH-ar', 'CH-fr', 'CH-de', 'CH-en',
  'CA-ar', 'CA-fr', 'CA-en',
  'AU-ar', 'AU-fr', 'AU-en',
  'AO-ar', 'AO-fr', 'AO-pt', 'AO-en',
  'US-ar', 'US-fr', 'US-en',
  'GB-ar', 'GB-fr', 'GB-en'
] as const;

export const routing = defineRouting({
  locales: locales,
  defaultLocale: "fr",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

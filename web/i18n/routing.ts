import { defineRouting } from "next-intl/routing";
import { createNavigation } from "next-intl/navigation";

export const locales = ['ar', 'fr', 'en', 'nl', 'de', 'it', 'es', 'pt', 'tr', 'ru', 'be', 'uk', 'pl', 'ro', 'el', 'hu', 'cs', 'da', 'no', 'sv', 'fi', 'ga', 'af', 'zu', 'xh', 'zh', 'ms', 'ta', 'ja', 'ko', 'hi', 'mi', 'th', 'vi', 'id', 'ku'] as const;

export const routing = defineRouting({
  locales: locales,
  defaultLocale: "fr",
  localePrefix: "always",
});

export const { Link, redirect, usePathname, useRouter } = createNavigation(routing);

import type { MarketingPageContent, MarketingPageSlug } from "./types";
import { MARKETING_PAGES_FR } from "./fr";
import { MARKETING_PAGES_AR } from "./ar";

export type { MarketingPageContent, MarketingPageSlug };

export function isArabicLocale(locale: string): boolean {
  return locale === "ar" || locale.endsWith("-ar");
}

export function getMarketingPage(slug: MarketingPageSlug, locale: string): MarketingPageContent {
  const pack = isArabicLocale(locale) ? MARKETING_PAGES_AR : MARKETING_PAGES_FR;
  return pack[slug];
}

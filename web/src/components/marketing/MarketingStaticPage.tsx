"use client";

import { useLocale } from "next-intl";
import { getMarketingPage, type MarketingPageSlug } from "@/content/marketing";
import MarketingPageShell from "@/components/marketing/MarketingPageShell";

export default function MarketingStaticPage({ slug }: { slug: MarketingPageSlug }) {
  const locale = useLocale();
  const page = getMarketingPage(slug, locale);
  return <MarketingPageShell page={page} />;
}

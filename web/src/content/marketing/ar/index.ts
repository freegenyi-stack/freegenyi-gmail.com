import { legalPagesAr } from "./legal";
import { companyPagesAr } from "./pages";
import type { MarketingPageSlug, MarketingPageContent } from "../types";

export const MARKETING_PAGES_AR: Record<MarketingPageSlug, MarketingPageContent> = {
  ...legalPagesAr,
  ...companyPagesAr,
};

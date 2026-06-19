import { legalPagesFr } from "./legal";
import { companyPagesFr } from "./pages";
import type { MarketingPageSlug, MarketingPageContent } from "../types";

export const MARKETING_PAGES_FR: Record<MarketingPageSlug, MarketingPageContent> = {
  ...legalPagesFr,
  ...companyPagesFr,
};

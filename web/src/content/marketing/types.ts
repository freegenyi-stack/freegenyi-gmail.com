export type MarketingSection = {
  title: string;
  paragraphs?: string[];
  bullets?: string[];
};

export type MarketingCard = {
  icon: string;
  title: string;
  description: string;
};

export type MarketingFaqItem = {
  question: string;
  answer: string;
};

export type MarketingArticle = {
  id: string;
  title: string;
  date: string;
  category: string;
  excerpt: string;
  paragraphs: string[];
};

export type MarketingPageContent = {
  hero: {
    badge?: string;
    title: string;
    subtitle: string;
    gradient?: string;
  };
  lastUpdated?: string;
  sections: MarketingSection[];
  cards?: MarketingCard[];
  faq?: MarketingFaqItem[];
  articles?: MarketingArticle[];
  cta?: { label: string; href: string };
  footerNote?: string;
  wide?: boolean;
};

export type MarketingPageSlug =
  | "privacy"
  | "terms"
  | "legal"
  | "dataProtection"
  | "cookies"
  | "childSafety"
  | "about"
  | "approach"
  | "mission"
  | "science"
  | "faq"
  | "press"
  | "blog"
  | "parents";

/** Liens réseaux sociaux footer — définir dans .env (NEXT_PUBLIC_SOCIAL_*). */
const SOCIAL_FALLBACK = "/contact";

export const FOOTER_SOCIAL_LINKS = {
  linkedin: process.env.NEXT_PUBLIC_SOCIAL_LINKEDIN?.trim() || SOCIAL_FALLBACK,
  facebook: process.env.NEXT_PUBLIC_SOCIAL_FACEBOOK?.trim() || SOCIAL_FALLBACK,
  instagram: process.env.NEXT_PUBLIC_SOCIAL_INSTAGRAM?.trim() || SOCIAL_FALLBACK,
  youtube: process.env.NEXT_PUBLIC_SOCIAL_YOUTUBE?.trim() || SOCIAL_FALLBACK,
} as const;

export type FooterSocialKey = keyof typeof FOOTER_SOCIAL_LINKS;

/** FreeGeny mobile — ludique premium (Duolingo × luxe crème/orange) */
import { FgFonts } from "./fonts";

export { FgFonts, fgFontFamily } from "./fonts";

/** Styles texte UI — IBM Plex Sans Arabic */
export const FgType = {
  regular: { fontFamily: FgFonts.regular },
  medium: { fontFamily: FgFonts.medium },
  semiBold: { fontFamily: FgFonts.semiBold },
  bold: { fontFamily: FgFonts.bold },
} as const;

export const Fg = {
  cream: "#FFFBF7",
  creamWarm: "#FFF7ED",
  creamDeep: "#FFEDD5",
  orange: "#F97316",
  orangeDark: "#C2410C",
  orangeMid: "#EA580C",
  orangeSoft: "#FDBA74",
  ink: "#0F172A",
  inkSoft: "#1E293B",
  muted: "#64748B",
  mutedLight: "#94A3B8",
  border: "#E7E5E4",
  borderWarm: "#FED7AA",
  white: "#FFFFFF",
  success: "#059669",
  rose: "#E11D48",
  violet: "#7C3AED",
  childBg: "#0B1220",
  childBgGlow: "#1a2744",
  radius: {
    sm: 14,
    md: 20,
    lg: 24,
    xl: 28,
    pill: 999,
  },
  shadow: {
    /** Effet « bouton Duolingo » */
    chunky: {
      borderBottomWidth: 5,
      borderBottomColor: "#C2410C",
    },
    card: {
      borderBottomWidth: 4,
      borderBottomColor: "#D6D3D1",
    },
  },
} as const;

export type FgHubAccent = "orange" | "emerald" | "violet" | "rose" | "blue" | "teal";

export const hubAccents: Record<FgHubAccent, { bg: string; bottom: string; icon: string }> = {
  orange: { bg: "#FFF7ED", bottom: "#FDBA74", icon: "#F97316" },
  emerald: { bg: "#ECFDF5", bottom: "#6EE7B7", icon: "#059669" },
  violet: { bg: "#F5F3FF", bottom: "#C4B5FD", icon: "#7C3AED" },
  rose: { bg: "#FFF1F2", bottom: "#FDA4AF", icon: "#E11D48" },
  blue: { bg: "#EFF6FF", bottom: "#93C5FD", icon: "#2563EB" },
  teal: { bg: "#F0FDFA", bottom: "#5EEAD4", icon: "#0D9488" },
};

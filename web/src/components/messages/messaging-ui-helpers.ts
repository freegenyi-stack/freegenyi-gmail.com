import type { ChannelSection } from "@/lib/messaging/channel-catalog";

/** Ordre d'affichage des salons (accès rapide en 1–2 clics) */
export const CHANNEL_SECTION_PRIORITY: Record<ChannelSection, number> = {
  announcements: 1,
  class: 2,
  school: 3,
  staff: 4,
  documents: 5,
  community: 6,
  external: 7,
  direct: 8,
};

export type MessageListTab = "salons" | "private" | "suggestions";

/** Identité visuelle par mode de messagerie */
export const TAB_THEMES: Record<
  MessageListTab,
  {
    accent: string;
    accentSoft: string;
    accentText: string;
    badge: string;
    badgeText: string;
    border: string;
    emptyIcon: string;
    listHover: string;
    activeRow: string;
  }
> = {
  private: {
    accent: "bg-violet-600",
    accentSoft: "bg-violet-50",
    accentText: "text-violet-700",
    badge: "bg-violet-100",
    badgeText: "text-violet-700",
    border: "border-violet-500",
    emptyIcon: "from-violet-500 to-purple-600",
    listHover: "hover:bg-violet-50/70",
    activeRow: "border-s-[3px] border-s-violet-600 bg-violet-50/40",
  },
  salons: {
    accent: "bg-teal-600",
    accentSoft: "bg-teal-50",
    accentText: "text-teal-700",
    badge: "bg-teal-100",
    badgeText: "text-teal-800",
    border: "border-teal-600",
    emptyIcon: "from-teal-500 to-emerald-600",
    listHover: "hover:bg-teal-50/70",
    activeRow: "border-s-[3px] border-s-teal-600 bg-teal-50/40",
  },
  suggestions: {
    accent: "bg-amber-500",
    accentSoft: "bg-amber-50",
    accentText: "text-amber-800",
    badge: "bg-amber-100",
    badgeText: "text-amber-900",
    border: "border-amber-500",
    emptyIcon: "from-amber-400 to-orange-500",
    listHover: "hover:bg-amber-50/70",
    activeRow: "border-s-[3px] border-s-amber-500 bg-amber-50/40",
  },
};

export type TabTheme = (typeof TAB_THEMES)[MessageListTab];

const PARENT_SALONS_THEME: TabTheme = {
  accent: "bg-orange-600",
  accentSoft: "bg-orange-50",
  accentText: "text-orange-700",
  badge: "bg-orange-100",
  badgeText: "text-orange-800",
  border: "border-orange-600",
  emptyIcon: "from-orange-500 to-amber-600",
  listHover: "hover:bg-orange-50/70",
  activeRow: "border-s-[3px] border-s-orange-600 bg-orange-50/40",
};

/** Thèmes d'onglets selon le rôle — salons orange pour les parents */
export function getTabThemes(role: string): typeof TAB_THEMES {
  if (role === "parent" || role === "coparent") {
    return { ...TAB_THEMES, salons: PARENT_SALONS_THEME };
  }
  return TAB_THEMES;
}

/** Traduction sûre — évite les crashs si une clé salon manque */
export function safeMessageKey(t: (key: string) => string, key: string, fallback: string): string {
  try {
    const v = t(key);
    if (!v || v === key || v.startsWith("Messages.")) return fallback;
    return v;
  } catch {
    return fallback;
  }
}

export function sectionShortKey(section: ChannelSection): string {
  const map: Record<ChannelSection, string> = {
    announcements: "sectionShortAnnouncements",
    school: "sectionShortSchool",
    class: "sectionShortClass",
    staff: "sectionShortStaff",
    external: "sectionShortExternal",
    documents: "sectionShortDocuments",
    community: "sectionShortCommunity",
    direct: "sectionShortDirect",
  };
  return map[section] || "sectionShortDirect";
}

export function channelDescKey(labelKey: string): string {
  return `${labelKey}Desc`;
}

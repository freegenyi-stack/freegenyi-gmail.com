import {
  BarChart3,
  Blocks,
  BookOpen,
  History,
  Home,
  Library,
  MessageCircle,
  Newspaper,
  Settings,
  Share2,
  Target,
  UserCircle,
} from "lucide-react";

export const PARENT_NAV = [
  { href: "/dashboard/parent", icon: Home, key: "home", exact: true },
  { href: "/dashboard/children", icon: UserCircle, key: "children" },
  { href: "/dashboard/parent/programme", icon: BookOpen, key: "programme" },
  { href: "/dashboard/parent/progres", icon: BarChart3, key: "progress" },
  { href: "/dashboard/parent/atelier", icon: Blocks, key: "workshop" },
  { href: "/dashboard/parent/historique", icon: History, key: "history" },
  { href: "/dashboard/parent/bibliotheque", icon: Library, key: "library" },
  { href: "/dashboard/parent/mur", icon: Share2, key: "wall" },
  { href: "/dashboard/parent/actualites", icon: Newspaper, key: "news" },
] as const;

export const PARENT_NAV_EXTRA = [
  { href: "/dashboard/parent/besoins", icon: UserCircle, key: "needs" as const },
  { href: "/dashboard/parent/objectifs", icon: Target, key: "goals" as const },
  { href: "/dashboard/messages", icon: MessageCircle, key: "messages" as const },
  { href: "/dashboard/parent/reglages", icon: Settings, key: "settings" as const },
] as const;

export const PARENT_MOBILE_PRIMARY_KEYS = new Set(["home", "progress", "workshop", "library"]);
export const PARENT_MOBILE_MORE_KEYS = new Set(["children", "wall", "news", "history"]);

import {
  Home,
  Newspaper,
  GraduationCap,
  Wand2,
  Library,
  MessageCircle,
  Settings,
  Share2,
  UserCircle,
  Users,
  BookOpen,
} from "lucide-react";

export const TEACHER_NAV = [
  { href: "/dashboard/enseignant", icon: Home, key: "home", exact: true },
  { href: "/dashboard/enseignant/programme", icon: BookOpen, key: "programme" },
  { href: "/dashboard/enseignant/classe", icon: Users, key: "classroom" },
  { href: "/dashboard/enseignant/atelier", icon: Wand2, key: "workshop" },
  { href: "/dashboard/enseignant/mur", icon: Share2, key: "wall" },
  { href: "/dashboard/enseignant/profil", icon: UserCircle, key: "profile" },
  { href: "/dashboard/enseignant/actualites", icon: Newspaper, key: "news" },
  { href: "/dashboard/enseignant/formation", icon: GraduationCap, key: "training" },
  { href: "/dashboard/enseignant/bibliotheque", icon: Library, key: "library" },
] as const;

export const TEACHER_NAV_EXTRA = [
  { href: "/dashboard/messages", icon: MessageCircle, key: "messages" as const },
  { href: "/dashboard/settings", icon: Settings, key: "settings" as const },
] as const;

export const TEACHER_MOBILE_PRIMARY_KEYS = new Set(["home", "workshop", "wall", "training"]);
export const TEACHER_MOBILE_MORE_KEYS = new Set(["classroom", "profile", "news", "library"]);

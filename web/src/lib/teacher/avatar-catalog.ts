import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Crown,
  Feather,
  FlaskConical,
  Gem,
  Globe2,
  GraduationCap,
  Heart,
  Landmark,
  Leaf,
  Lightbulb,
  Music2,
  Palette,
  PenTool,
  Rocket,
  Scale,
  Sparkles,
  Star,
  Sun,
  Telescope,
  Trophy,
  Waves,
} from "lucide-react";

export type LuxuryAvatar = {
  id: string;
  icon: LucideIcon;
  gradient: string;
  ring: string;
  labelFr: string;
  labelAr: string;
};

/** Bibliothèque avatars illustrés — 24 variantes pédagogiques FreeGeny */
export const LUXURY_AVATARS: LuxuryAvatar[] = [
  { id: "sage-teal", icon: GraduationCap, gradient: "from-teal-500 to-emerald-700", ring: "ring-teal-200", labelFr: "Sage", labelAr: "حكيم" },
  { id: "gold-crown", icon: Crown, gradient: "from-amber-400 to-yellow-600", ring: "ring-amber-200", labelFr: "Or royal", labelAr: "ذهبي" },
  { id: "emerald-leaf", icon: Leaf, gradient: "from-lime-500 to-green-700", ring: "ring-lime-200", labelFr: "Nature", labelAr: "طبيعة" },
  { id: "sapphire-globe", icon: Globe2, gradient: "from-blue-500 to-indigo-700", ring: "ring-blue-200", labelFr: "Monde", labelAr: "عالم" },
  { id: "ruby-heart", icon: Heart, gradient: "from-rose-500 to-pink-700", ring: "ring-rose-200", labelFr: "Cœur", labelAr: "قلب" },
  { id: "platinum-star", icon: Star, gradient: "from-slate-400 to-slate-700", ring: "ring-slate-200", labelFr: "Étoile", labelAr: "نجمة" },
  { id: "science-lab", icon: FlaskConical, gradient: "from-cyan-500 to-teal-700", ring: "ring-cyan-200", labelFr: "Science", labelAr: "علوم" },
  { id: "literature", icon: Feather, gradient: "from-violet-500 to-purple-700", ring: "ring-violet-200", labelFr: "Plume", labelAr: "ريشة" },
  { id: "artist", icon: Palette, gradient: "from-fuchsia-500 to-pink-600", ring: "ring-fuchsia-200", labelFr: "Artiste", labelAr: "فنان" },
  { id: "math-genius", icon: Lightbulb, gradient: "from-orange-400 to-amber-600", ring: "ring-orange-200", labelFr: "Génie", labelAr: "عبقري" },
  { id: "explorer", icon: Rocket, gradient: "from-indigo-500 to-violet-700", ring: "ring-indigo-200", labelFr: "Explorateur", labelAr: "مستكشف" },
  { id: "history", icon: Landmark, gradient: "from-stone-500 to-amber-800", ring: "ring-stone-200", labelFr: "Histoire", labelAr: "تاريخ" },
  { id: "music", icon: Music2, gradient: "from-purple-500 to-indigo-600", ring: "ring-purple-200", labelFr: "Musique", labelAr: "موسيقى" },
  { id: "reader", icon: BookOpen, gradient: "from-emerald-500 to-teal-600", ring: "ring-emerald-200", labelFr: "Lecteur", labelAr: "قارئ" },
  { id: "writer", icon: PenTool, gradient: "from-sky-500 to-blue-700", ring: "ring-sky-200", labelFr: "Écrivain", labelAr: "كاتب" },
  { id: "champion", icon: Trophy, gradient: "from-yellow-500 to-orange-600", ring: "ring-yellow-200", labelFr: "Champion", labelAr: "بطل" },
  { id: "diamond", icon: Gem, gradient: "from-cyan-400 to-blue-600", ring: "ring-cyan-200", labelFr: "Diamant", labelAr: "الماس" },
  { id: "sunrise", icon: Sun, gradient: "from-orange-500 to-red-500", ring: "ring-orange-200", labelFr: "Aurore", labelAr: "شروق" },
  { id: "ocean", icon: Waves, gradient: "from-blue-400 to-cyan-600", ring: "ring-blue-200", labelFr: "Océan", labelAr: "محيط" },
  { id: "justice", icon: Scale, gradient: "from-neutral-600 to-neutral-900", ring: "ring-neutral-300", labelFr: "Équité", labelAr: "عدالة" },
  { id: "cosmos", icon: Telescope, gradient: "from-indigo-600 to-purple-900", ring: "ring-indigo-200", labelFr: "Cosmos", labelAr: "كون" },
  { id: "spark", icon: Sparkles, gradient: "from-pink-500 to-rose-600", ring: "ring-pink-200", labelFr: "Éclat", labelAr: "بريق" },
  { id: "mentor", icon: GraduationCap, gradient: "from-teal-600 to-cyan-800", ring: "ring-teal-300", labelFr: "Mentor", labelAr: "مرشد" },
  { id: "elite", icon: Crown, gradient: "from-slate-800 via-teal-700 to-emerald-600", ring: "ring-teal-300", labelFr: "Élite", labelAr: "نخبة" },
];

export function getLuxuryAvatar(id: string | undefined | null): LuxuryAvatar | undefined {
  return LUXURY_AVATARS.find((a) => a.id === id);
}

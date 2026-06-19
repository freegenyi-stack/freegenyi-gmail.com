import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  Cpu,
  FlaskConical,
  Gamepad2,
  Globe,
  GraduationCap,
  Heart,
  Leaf,
  Music,
  Newspaper,
  Palette,
  Trophy,
} from "lucide-react";

export const MAX_NOTIFICATION_INTERESTS = 3;

export type NotificationInterestId =
  | "news"
  | "sports"
  | "music"
  | "reading"
  | "science"
  | "arts"
  | "technology"
  | "education"
  | "games"
  | "health"
  | "culture"
  | "nature";

export type NotificationInterestTopic = {
  id: NotificationInterestId;
  icon: LucideIcon;
  /** Tailwind classes when selected */
  active: string;
  /** Tailwind classes when idle */
  idle: string;
};

export const NOTIFICATION_INTEREST_TOPICS: NotificationInterestTopic[] = [
  { id: "news", icon: Newspaper, idle: "border-sky-200 bg-sky-50 text-sky-800", active: "border-sky-500 bg-sky-500 text-white shadow-lg shadow-sky-200" },
  { id: "sports", icon: Trophy, idle: "border-emerald-200 bg-emerald-50 text-emerald-800", active: "border-emerald-500 bg-emerald-500 text-white shadow-lg shadow-emerald-200" },
  { id: "music", icon: Music, idle: "border-violet-200 bg-violet-50 text-violet-800", active: "border-violet-500 bg-violet-500 text-white shadow-lg shadow-violet-200" },
  { id: "reading", icon: BookOpen, idle: "border-amber-200 bg-amber-50 text-amber-900", active: "border-amber-500 bg-amber-500 text-white shadow-lg shadow-amber-200" },
  { id: "science", icon: FlaskConical, idle: "border-cyan-200 bg-cyan-50 text-cyan-900", active: "border-cyan-500 bg-cyan-500 text-white shadow-lg shadow-cyan-200" },
  { id: "arts", icon: Palette, idle: "border-pink-200 bg-pink-50 text-pink-800", active: "border-pink-500 bg-pink-500 text-white shadow-lg shadow-pink-200" },
  { id: "technology", icon: Cpu, idle: "border-indigo-200 bg-indigo-50 text-indigo-800", active: "border-indigo-500 bg-indigo-500 text-white shadow-lg shadow-indigo-200" },
  { id: "education", icon: GraduationCap, idle: "border-teal-200 bg-teal-50 text-teal-800", active: "border-teal-500 bg-teal-500 text-white shadow-lg shadow-teal-200" },
  { id: "games", icon: Gamepad2, idle: "border-orange-200 bg-orange-50 text-orange-800", active: "border-orange-500 bg-orange-500 text-white shadow-lg shadow-orange-200" },
  { id: "health", icon: Heart, idle: "border-rose-200 bg-rose-50 text-rose-800", active: "border-rose-500 bg-rose-500 text-white shadow-lg shadow-rose-200" },
  { id: "culture", icon: Globe, idle: "border-yellow-200 bg-yellow-50 text-yellow-900", active: "border-yellow-500 bg-yellow-500 text-white shadow-lg shadow-yellow-200" },
  { id: "nature", icon: Leaf, idle: "border-lime-200 bg-lime-50 text-lime-900", active: "border-lime-500 bg-lime-500 text-white shadow-lg shadow-lime-200" },
];

const VALID_IDS = new Set<string>(NOTIFICATION_INTEREST_TOPICS.map((t) => t.id));

export function parseNotificationInterestsFromForm(formData: FormData): NotificationInterestId[] {
  const raw = formData.get("notification_interests");
  if (!raw || typeof raw !== "string") return [];
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((id): id is NotificationInterestId => typeof id === "string" && VALID_IDS.has(id));
  } catch {
    return [];
  }
}

export function appendNotificationInterests(formData: FormData, interests: string[]) {
  formData.set("notification_interests", JSON.stringify(interests.slice(0, MAX_NOTIFICATION_INTERESTS)));
}

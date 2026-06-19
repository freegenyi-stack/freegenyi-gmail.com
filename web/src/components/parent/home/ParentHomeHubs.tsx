"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  BarChart3,
  Blocks,
  Library,
  MessageCircle,
  Newspaper,
  Share2,
  UserCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { BlurFade } from "@/components/magicui/blur-fade";

const HUBS = [
  { href: "/dashboard/children", icon: UserCircle, key: "children", color: "from-orange-500 to-amber-600" },
  { href: "/dashboard/parent/progres", icon: BarChart3, key: "progress", color: "from-orange-500 to-amber-600" },
  { href: "/dashboard/parent/bibliotheque", icon: Library, key: "library", color: "from-sky-500 to-blue-600" },
  { href: "/dashboard/parent/atelier", icon: Blocks, key: "workshop", color: "from-violet-500 to-purple-600" },
  { href: "/dashboard/parent/mur", icon: Share2, key: "wall", color: "from-pink-500 to-rose-600" },
  { href: "/dashboard/parent/actualites", icon: Newspaper, key: "news", color: "from-indigo-500 to-blue-600" },
  { href: "/dashboard/messages", icon: MessageCircle, key: "messages", color: "from-amber-500 to-orange-600" },
  { href: "/dashboard/parent/besoins", icon: UserCircle, key: "needs", color: "from-emerald-500 to-green-600" },
] as const;

type Props = {
  unreadMessages?: number;
};

export default function ParentHomeHubs({ unreadMessages = 0 }: Props) {
  const t = useTranslations("ParentSpace");
  const tNav = useTranslations("ParentSpace.nav");

  return (
    <div className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
      {HUBS.map((hub, i) => {
        const Icon = hub.icon;
        const showBadge = hub.key === "messages" && unreadMessages > 0;
        return (
          <BlurFade key={hub.href} delay={i * 0.04}>
            <Link
              href={hub.href}
              className="group relative flex items-center gap-4 rounded-2xl border border-slate-200/80 bg-white p-4 shadow-sm transition hover:-translate-y-0.5 hover:border-orange-200 hover:shadow-md"
            >
              <div
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br text-white shadow-md transition group-hover:scale-105",
                  hub.color
                )}
              >
                <Icon className="h-5 w-5" />
              </div>
              <div className="min-w-0">
                <p className="flex items-center gap-2 text-sm font-black text-slate-900">
                  {tNav(hub.key)}
                  {showBadge && (
                    <span className="rounded-full bg-orange-500 px-2 py-0.5 text-[10px] font-black text-white">
                      {unreadMessages > 99 ? "99+" : unreadMessages}
                    </span>
                  )}
                </p>
                <p className="text-xs text-slate-500">{t(`home.hubs.${hub.key}`)}</p>
              </div>
            </Link>
          </BlurFade>
        );
      })}
    </div>
  );
}

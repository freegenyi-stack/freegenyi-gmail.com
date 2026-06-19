"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { motion } from "framer-motion";
import {
  ArrowRight,
  BellRing,
  Blocks,
  BookMarked,
  BookOpen,
  BookOpenCheck,
  CircleUser,
  GraduationCap,
  Megaphone,
  MessageCircle,
  School,
  Sparkles,
  Users,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeacherHubCounts } from "@/lib/teacher/hub-counts.server";
import type { TeacherDashboardInsights } from "@/lib/teacher/dashboard-insights.server";
import HubCountBadge from "./HubCountBadge";
import TeacherAvatarDisplay from "./TeacherAvatarDisplay";
import TeacherProfileCompleteBanner from "./TeacherProfileCompleteBanner";

type Props = {
  user: {
    fullName: string;
    email: string;
    image?: string | null;
    avatarConfig?: string | null;
  };
  profile: {
    schoolName: string;
    subjects: string[];
    levels: string[];
    bio: string;
    avatarMode: "photo" | "catalog";
    profileComplete: boolean;
  };
  hubCounts?: TeacherHubCounts;
  insights?: TeacherDashboardInsights;
};

export default function TeacherHomeClient({ user, profile, hubCounts, insights }: Props) {
  const locale = useLocale();
  const t = useTranslations("TeacherSpace");
  const tMsg = useTranslations("Messages");
  const isRTL = locale.endsWith("-ar") || locale === "ar";

  let avatarConfig: { id: string; style?: string } | null = null;
  try {
    avatarConfig = user.avatarConfig ? JSON.parse(user.avatarConfig) : null;
  } catch {
    avatarConfig = null;
  }

  const hubs = [
    { href: "/dashboard/enseignant/classe", icon: Users, key: "classroom", color: "from-indigo-500 to-blue-600", count: hubCounts?.classroom ?? 0 },
    { href: "/dashboard/enseignant/profil", icon: CircleUser, key: "profile", color: "from-teal-500 to-emerald-600", count: 0 },
    { href: "/dashboard/enseignant/mur", icon: Megaphone, key: "wall", color: "from-rose-500 to-pink-600", count: hubCounts?.wall ?? 0 },
    { href: "/dashboard/enseignant/actualites", icon: BellRing, key: "news", color: "from-sky-500 to-blue-600", count: hubCounts?.news ?? 0 },
    { href: "/dashboard/enseignant/formation", icon: BookOpenCheck, key: "training", color: "from-emerald-500 to-teal-600", count: hubCounts?.training ?? 0 },
    { href: "/dashboard/enseignant/atelier", icon: Blocks, key: "workshop", color: "from-violet-500 to-purple-600", count: hubCounts?.workshop ?? 0 },
    { href: "/dashboard/enseignant/bibliotheque", icon: BookMarked, key: "library", color: "from-amber-500 to-orange-600", count: hubCounts?.library ?? 0 },
  ] as const;

  return (
    <div>
      <TeacherProfileCompleteBanner complete={profile.profileComplete} />

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8 flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <div className="flex items-center gap-4">
          <TeacherAvatarDisplay
            fullName={user.fullName}
            image={user.image}
            avatarConfig={avatarConfig}
            avatarMode={profile.avatarMode}
            size="lg"
            className="ring-4 ring-white shadow-lg ring-teal-100"
          />
          <div>
            <h1 className="text-2xl md:text-3xl font-black text-slate-900 font-reem tracking-tight">
              {t("home.greeting", { name: user.fullName.split(" ")[0] || user.fullName })}
            </h1>
            <p className="mt-1 text-sm md:text-base text-slate-500 font-medium">{t("home.subtitle")}</p>
          </div>
        </div>
      </motion.div>

      {insights && (insights.pendingAssignments > 0 || insights.draftResources > 0) && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4"
        >
          {insights.pendingAssignments > 0 && (
            <Link
              href="/dashboard/enseignant/classe"
              className="rounded-2xl border border-amber-100 bg-amber-50 p-4 transition hover:shadow-md"
            >
              <p className="text-[10px] font-black uppercase text-amber-800">{t("home.shortcutPending")}</p>
              <p className="text-2xl font-black text-amber-950">{insights.pendingAssignments}</p>
            </Link>
          )}
          {insights.inProgressAssignments > 0 && (
            <Link
              href="/dashboard/enseignant/classe"
              className="rounded-2xl border border-violet-100 bg-violet-50 p-4 transition hover:shadow-md"
            >
              <p className="text-[10px] font-black uppercase text-violet-800">{t("home.shortcutInProgress")}</p>
              <p className="text-2xl font-black text-violet-950">{insights.inProgressAssignments}</p>
            </Link>
          )}
          {insights.draftResources > 0 && (
            <Link
              href="/dashboard/enseignant/atelier"
              className="rounded-2xl border border-slate-200 bg-slate-50 p-4 transition hover:shadow-md"
            >
              <p className="text-[10px] font-black uppercase text-slate-600">{t("home.shortcutDrafts")}</p>
              <p className="text-2xl font-black text-slate-900">{insights.draftResources}</p>
            </Link>
          )}
          {insights.avgScore7d != null && (
            <Link
              href="/dashboard/enseignant/classe"
              className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 transition hover:shadow-md"
            >
              <p className="text-[10px] font-black uppercase text-emerald-800">{t("home.shortcutScores")}</p>
              <p className="text-2xl font-black text-emerald-950">{insights.avgScore7d}%</p>
            </Link>
          )}
        </motion.div>
      )}

      <div className="mb-8 grid gap-3 sm:grid-cols-3">
        {[
          { icon: School, label: t("home.school"), value: profile.schoolName || "—" },
          { icon: BookOpen, label: t("home.subjects"), value: profile.subjects.length ? profile.subjects.join(" · ") : "—" },
          { icon: GraduationCap, label: t("home.levels"), value: profile.levels.length ? profile.levels.join(" · ") : "—" },
        ].map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="rounded-2xl border border-slate-100 bg-white p-4 shadow-sm"
          >
            <item.icon className="mb-2 h-4 w-4 text-teal-600" />
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
            <p className="mt-1 font-black text-slate-900">{item.value}</p>
          </motion.div>
        ))}
      </div>

        <Link
        href="/dashboard/messages"
        className="mb-8 block rounded-2xl bg-gradient-to-r from-teal-600 to-emerald-600 p-5 text-white shadow-lg transition-shadow hover:shadow-xl relative"
      >
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="relative flex h-11 w-11 items-center justify-center rounded-xl bg-white/20">
              <MessageCircle className="h-5 w-5" />
              <HubCountBadge count={hubCounts?.messages ?? 0} />
            </div>
            <div>
              <p className="font-black">{tMsg("title")}</p>
              <p className="text-sm font-medium text-teal-50">{tMsg("subtitleTeacher")}</p>
            </div>
          </div>
          <ArrowRight className={cn("h-5 w-5 opacity-80", isRTL && "rotate-180")} />
        </div>
      </Link>

      <p className="mb-4 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("home.explore")}</p>
      <div className="grid gap-4 sm:grid-cols-2">
        {hubs.map((hub, i) => (
          <motion.div key={hub.key} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}>
            <Link
              href={hub.href}
              className="group flex h-full flex-col rounded-[1.5rem] border border-slate-100 bg-white p-6 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative mb-4 w-fit">
                <div className={cn("flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg", hub.color)}>
                  <hub.icon className="h-7 w-7" strokeWidth={2.25} />
                </div>
                <HubCountBadge count={hub.count} />
              </div>
              <h2 className="font-black text-slate-900">{t(`home.hubs.${hub.key}.title`)}</h2>
              <p className="mt-2 flex-1 text-sm leading-relaxed text-slate-500">{t(`home.hubs.${hub.key}.desc`)}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-[10px] font-black uppercase tracking-widest text-teal-600 group-hover:gap-2 transition-all">
                {t("home.open")} <ArrowRight className={cn("h-3 w-3", isRTL && "rotate-180")} />
              </span>
            </Link>
          </motion.div>
        ))}
      </div>

      {profile.bio && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.35 }} className="mt-8 rounded-2xl border border-slate-100 bg-white/80 p-5">
          <p className="mb-2 flex items-center gap-2 text-[10px] font-black uppercase text-slate-400">
            <Sparkles className="h-3 w-3" /> {t("home.bio")}
          </p>
          <p className="text-sm italic text-slate-600">{profile.bio}</p>
        </motion.div>
      )}
    </div>
  );
}

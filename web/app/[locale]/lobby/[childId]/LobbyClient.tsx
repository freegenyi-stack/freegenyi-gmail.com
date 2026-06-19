"use client";

import { Link } from "@/i18n/routing";
import React from "react";

import { motion } from "framer-motion";
import { Globe, BookOpen, Zap, ArrowRight, Home, Library, Gamepad2, Sparkles } from "lucide-react";
import { useTranslations } from "next-intl";
import type { LearningMode } from "@/lib/child/learning-profile";
import {
  filterPortalsByLearningMode,
  ScreenTimeBanner,
  useChildScreenTime,
} from "@/components/child/ScreenTimeGuard";

interface Child {
  id: number;
  fullName: string;
}

interface Stats {
  xp: number;
  level: number;
  progress: number;
  breakdown?: {
    reading: number;
    exercises: number;
    badges: number;
    quizzes: number;
  };
  pendingMissions?: number;
  booksRead?: number;
  exercisesDone?: number;
}

export default function LobbyClient({ 
  child, 
  locale, 
  stats,
  latestBoost = null,
  isChildMode = false,
  learningMode = "semi_guided",
  dailyScreenMinutes = 20,
  pendingParentWorksheets = 0,
}: { 
  child: Child, 
  locale: string, 
  stats: Stats,
  latestBoost?: { message: string; createdAt: Date | string } | null,
  isChildMode?: boolean,
  learningMode?: LearningMode,
  dailyScreenMinutes?: number,
  pendingParentWorksheets?: number,
}) {
  const t = useTranslations("ChildLobby");
  const childFirstName = child.fullName.split(" ")[0];
  const { remaining, limitReached, dailyLimitMinutes } = useChildScreenTime(child.id, dailyScreenMinutes);

  const portals = [
    {
      id: "geny",
      title: t("Portals.Geny.Title"),
      description: pendingParentWorksheets
        ? t("Portals.Geny.DescPending", { count: pendingParentWorksheets })
        : t("Portals.Geny.DescEmpty"),
      icon: <Sparkles className="w-16 h-16" />,
      color: "bg-emerald-600",
      textColor: "text-emerald-400",
      descColor: "text-emerald-300/60",
      shadow: "shadow-[0_20px_50px_rgba(5,150,105,0.35)]",
      gradient: "from-emerald-600/10",
      href: `/lobby/${child.id}/geny`,
      hoverRotate: "group-hover:rotate-3",
      badge: pendingParentWorksheets,
      cta: t("Portals.Geny.CTA"),
    },
    {
      id: "missions",
      title: t("Portals.Missions.Title"),
      description: stats.pendingMissions
        ? t("Portals.Missions.DescPending", { count: stats.pendingMissions })
        : t("Portals.Missions.DescEmpty"),
      icon: <Gamepad2 className="w-16 h-16" />,
      color: "bg-rose-600",
      textColor: "text-rose-400",
      descColor: "text-rose-300/60",
      shadow: "shadow-[0_20px_50px_rgba(225,29,72,0.35)]",
      gradient: "from-rose-600/10",
      href: `/lobby/${child.id}/missions`,
      hoverRotate: "group-hover:rotate-3",
      badge: stats.pendingMissions ?? 0,
      cta: t("Portals.Missions.CTA"),
    },
    {
      id: "library",
      title: t("Portals.Library.Title"),
      description: t("Portals.Library.Desc"),
      icon: <Library className="w-16 h-16" />,
      color: "bg-violet-600",
      textColor: "text-violet-400",
      descColor: "text-violet-300/60",
      shadow: "shadow-[0_20px_50px_rgba(124,58,237,0.35)]",
      gradient: "from-violet-600/10",
      href: `/lobby/${child.id}/bibliotheque`,
      hoverRotate: "group-hover:rotate-3",
      cta: t("Portals.Library.CTA"),
    },
    {
      id: "school",
      title: t("Portals.School.Title"),
      description: t("Portals.School.Desc"),
      icon: <BookOpen className="w-16 h-16" />,
      color: "bg-blue-600",
      textColor: "text-blue-400",
      descColor: "text-blue-300/60",
      shadow: "shadow-[0_20px_50px_rgba(37,99,235,0.3)]",
      gradient: "from-blue-600/10",
      href: "/portal/local",
      hoverRotate: "group-hover:rotate-6",
      cta: t("Portals.School.CTA"),
    },
    {
      id: "world",
      title: t("Portals.World.Title"),
      description: t("Portals.World.Desc"),
      icon: <Globe className="w-20 h-20" />,
      color: "bg-orange-600",
      textColor: "text-orange-500",
      descColor: "text-orange-200/60",
      shadow: "shadow-[0_25px_60px_rgba(234,88,12,0.4)]",
      gradient: "from-orange-600/10",
      href: "/portal/world",
      scale: "md:scale-110",
      isFeatured: true,
      hoverRotate: "group-hover:-rotate-6",
      cta: t("Portals.World.CTA"),
    },
    {
      id: "arena",
      title: t("Portals.Arena.Title"),
      description: t("Portals.Arena.Desc"),
      icon: <Zap className="w-16 h-16" />,
      color: "bg-teal-600",
      textColor: "text-teal-400",
      descColor: "text-teal-300/60",
      shadow: "shadow-[0_20px_50px_rgba(13,148,136,0.3)]",
      gradient: "from-teal-600/10",
      href: "/portal/magic",
      hoverRotate: "group-hover:rotate-12",
      cta: t("Portals.Arena.CTA"),
    }
  ];

  const visiblePortals = filterPortalsByLearningMode(portals, learningMode, limitReached);

  return (
    <div className="mx-auto flex min-h-[calc(100dvh-64px)] w-full max-w-6xl flex-col p-4 sm:p-6 md:p-8 relative selection:bg-orange-600 selection:text-white">
      
      {/* Nebula Background Elements */}
      <div className="fixed inset-0 pointer-events-none opacity-30 overflow-hidden">
        <motion.div 
          animate={{ y: [0, -20, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-10 left-10 w-[500px] h-[500px] bg-blue-600/20 blur-[150px] rounded-full"
        />
        <motion.div 
          animate={{ y: [0, -30, 0] }}
          transition={{ duration: 8, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-10 right-10 w-[600px] h-[600px] bg-orange-600/20 blur-[150px] rounded-full"
        />
      </div>

      {/* Top Bar */}
      <header className="w-full flex justify-between items-center z-10 mb-8">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="flex items-center gap-6"
        >
          <div className="w-16 h-16 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 flex items-center justify-center shadow-2xl">
            <span className="text-3xl">🦊</span>
          </div>
          <div>
            <h1 className="text-2xl font-black tracking-tight font-jakarta">{t("Greeting", { name: childFirstName })}</h1>
            <div className="flex items-center gap-3 mt-1">
              <span className="text-[10px] font-black uppercase tracking-widest text-orange-500">
                {t("levelXp", { level: stats.level, xp: stats.xp.toLocaleString() })}
              </span>
              <div className="h-1 w-24 bg-white/10 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${stats.progress}%` }}
                  transition={{ duration: 1, delay: 0.5 }}
                  className="h-full bg-orange-600 shadow-[0_0_10px_#ea580c]"
                />
              </div>
            </div>
            {stats.breakdown && (
              <p className="mt-2 flex flex-wrap gap-2 text-[9px] font-bold text-slate-500">
                <span>📚 {stats.breakdown.reading} XP</span>
                <span>🎮 {stats.breakdown.exercises} XP</span>
                <span>🏅 {stats.breakdown.badges} XP</span>
                <span>✏️ {stats.breakdown.quizzes} XP</span>
              </p>
            )}
          </div>
        </motion.div>

        {!isChildMode && (
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <Link 
            href="/dashboard/parent"
            className="bg-white/5 backdrop-blur-xl px-10 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] border border-white/10 hover:bg-white/10 hover:border-white/20 transition-all flex items-center gap-3"
          >
            <Home className="w-4 h-4" />
            {t("ParentDashboard")}
          </Link>
        </motion.div>
        )}
      </header>

      {/* Portal Grid */}
      <div className="flex-1 flex flex-col items-center justify-center w-full">
      <ScreenTimeBanner
        remaining={remaining}
        dailyLimitMinutes={dailyLimitMinutes}
        limitReached={limitReached}
      />
      {visiblePortals.length === 0 ? (
        <p className="text-center text-lg font-bold text-slate-300 max-w-md px-4">
          {t("screenTimeLimit")}
        </p>
      ) : (
      <div className="max-w-7xl w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-10 relative z-10">
        {visiblePortals.map((portal, index) => (
          <motion.div
            key={portal.id}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 + index * 0.1 }}
          >
            <Link 
              href={portal.href}
              className={`group relative block h-full bg-white/5 backdrop-blur-2xl border ${portal.isFeatured ? 'border-white/20' : 'border-white/10'} rounded-[2.5rem] md:rounded-[4rem] p-8 md:p-12 text-center overflow-hidden transition-all duration-500 hover:-translate-y-4 hover:scale-[1.02] min-h-[220px] md:min-h-[280px] ${portal.scale || ''} ${portal.isFeatured ? 'shadow-3xl' : 'shadow-2xl'}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-b ${portal.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
              
              <div className={`w-32 h-32 md:w-auto md:h-auto md:aspect-square flex items-center justify-center mx-auto mb-10 transition-all duration-700 relative ${portal.color} ${portal.isFeatured ? 'rounded-[3rem] p-10' : 'rounded-[2.5rem] p-8'} ${portal.shadow} ${portal.hoverRotate}`}>
                {"badge" in portal && (portal.badge ?? 0) > 0 && (
                  <span className="absolute -end-1 -top-1 flex h-7 min-w-7 items-center justify-center rounded-full bg-red-500 px-1.5 text-[10px] font-black text-white ring-2 ring-[#020617]">
                    {(portal.badge ?? 0) > 99 ? "99+" : portal.badge}
                  </span>
                )}
                {portal.icon}
              </div>

              <h2 className={`text-3xl font-black mb-4 tracking-tighter font-jakarta ${portal.isFeatured ? 'text-4xl text-orange-400' : ''}`}>
                {portal.title}
              </h2>
              
              <p className={`${portal.descColor} font-light text-sm leading-relaxed mb-8 max-w-[200px] mx-auto`}>
                {portal.description}
              </p>

              <div className={`inline-flex items-center gap-2 ${portal.textColor} font-black uppercase tracking-widest text-[10px] group-hover:gap-4 transition-all`}>
                <span>{portal.cta}</span>
                <ArrowRight className="w-4 h-4 stroke-[3px]" />
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      )}
      </div>

      {/* Mascot Message Box */}
      <motion.div 
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.8 }}
        className="fixed bottom-6 md:bottom-10 start-4 end-4 md:start-auto md:end-auto md:max-w-2xl bg-white/5 backdrop-blur-2xl p-6 md:p-8 rounded-[2rem] md:rounded-[3rem] border border-white/10 flex items-center gap-6 md:gap-8 shadow-3xl mx-auto"
      >
        <div className="w-20 h-20 bg-white/10 rounded-2xl flex items-center justify-center shrink-0 shadow-inner">
          <span className="text-4xl">🦊</span>
        </div>
        <div>
          <p className="text-slate-300 font-light leading-relaxed italic">
            {latestBoost ? (
              <>
                &quot;{latestBoost.message}&quot; —{" "}
                <span className="text-orange-500 font-bold not-italic">{t("boostFromParents")}</span>
              </>
            ) : (
              t.rich("Mascot.Message", {
                highlight: () => (
                  <span className="text-orange-600 font-black">{childFirstName}</span>
                ),
                boost: () => (
                  <span className="bg-orange-600/20 px-2 py-1 rounded text-orange-500 font-bold not-italic">
                    {t("Mascot.BoostTag")}
                  </span>
                ),
              })
            )}
          </p>
        </div>
      </motion.div>
    </div>
  );
}

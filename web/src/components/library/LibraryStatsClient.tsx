"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { DailyReadingPoint, UserReadingStats } from "@/lib/library/user-library.server";

type Badge = { badgeKey: string; label: string; earnedAt: Date | string };

type Props = {
  stats: UserReadingStats;
  daily: DailyReadingPoint[];
  badges: Badge[];
  statsHref: string;
  backHref: string;
  variant?: "parent" | "teacher";
};

export default function LibraryStatsClient({
  stats,
  daily,
  badges,
  backHref,
  variant = "parent",
}: Props) {
  const t = useTranslations("Library.stats");
  const maxPages = Math.max(1, ...daily.map((d) => d.pages));
  const title = variant === "teacher" ? t("titleTeacher") : t("title");
  const accent = variant === "parent" ? "orange" : "violet";

  return (
    <div className={cn("font-dm-sans", variant === "parent" ? "space-y-8" : "min-h-screen bg-slate-50 p-6 sm:p-8")}>
      <div className={cn(variant === "parent" ? "" : "mx-auto max-w-4xl space-y-8")}>
        {variant !== "parent" ? (
          <div className="flex items-center justify-between gap-4">
            <div>
              <h1 className="text-2xl font-black text-slate-900">{title}</h1>
              <p className="mt-1 text-sm text-slate-600">{t("last30Days")}</p>
            </div>
            <Link
              href={backHref}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase text-slate-700 hover:border-violet-300"
            >
              {t("backToLibrary")}
            </Link>
          </div>
        ) : (
          <div className="flex justify-end">
            <Link
              href={backHref}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black uppercase text-slate-700 hover:border-orange-300"
            >
              {t("backToLibrary")}
            </Link>
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {[
            { label: t("finished"), value: stats.booksFinished },
            { label: t("reading"), value: stats.booksReading },
            { label: t("totalPages"), value: stats.totalPagesRead },
            { label: t("pagesThisMonth"), value: stats.pagesThisMonth },
          ].map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06 }}
              className="fg-stat-pill text-start"
            >
              <p className={cn("text-[10px] font-black uppercase", accent === "orange" ? "text-orange-600" : "text-violet-600")}>
                {s.label}
              </p>
              <p className="text-3xl font-black tabular-nums text-slate-900">{s.value}</p>
            </motion.div>
          ))}
        </div>

        <section className="overflow-hidden rounded-3xl border border-white/80 bg-white/90 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="mb-6 text-lg font-black text-slate-900">{t("dailyChart")}</h2>
          {daily.length === 0 ? (
            <p className="text-sm text-slate-500">{t("chartEmpty")}</p>
          ) : (
            <div className="flex h-44 items-end gap-1.5 rounded-2xl bg-gradient-to-t from-slate-50 to-white p-4 ring-1 ring-slate-100">
              {daily.map((d, i) => (
                <div key={d.date} className="group flex flex-1 flex-col items-center justify-end">
                  <motion.div
                    initial={{ height: 4 }}
                    animate={{ height: `${Math.max(6, (d.pages / maxPages) * 100)}%` }}
                    transition={{ delay: i * 0.02, duration: 0.5, ease: "easeOut" }}
                    className="w-full min-h-[4px] rounded-t-lg bg-gradient-to-t from-orange-600 via-orange-400 to-amber-400 shadow-sm transition group-hover:brightness-110"
                    title={t("chartTooltip", { date: d.date, pages: d.pages })}
                  />
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-3xl border border-amber-200/80 bg-gradient-to-br from-amber-50 via-orange-50/50 to-white p-6 shadow-sm">
          <h2 className="mb-4 text-lg font-black text-slate-900">{t("badgesTitle")}</h2>
          {badges.length === 0 ? (
            <p className="text-sm text-amber-900/70">{t("badgesEmpty")}</p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {badges.map((b) => (
                <span
                  key={`${b.badgeKey}-${String(b.earnedAt)}`}
                  className="rounded-full border border-amber-300/80 bg-white/90 px-3 py-1.5 text-xs font-black text-amber-900 shadow-sm backdrop-blur-sm"
                >
                  🏅 {t(`badges.${b.badgeKey}` as "badges.first_book", { defaultMessage: b.label })}
                </span>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

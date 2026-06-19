"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Clock, Flame, Sparkles, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { isParentRtl, parentTitleFont } from "@/lib/parent/parent-rtl";
import { BlurFade } from "@/components/magicui/blur-fade";
import { NumberTicker } from "@/components/magicui/number-ticker";
import type { ParentHomeChildToday } from "@/lib/parent/parent-home.types";

type Props = {
  today: ParentHomeChildToday | null;
  childName: string | null;
};

function screenTimeStatus(minutes: number, limit: number): "ok" | "warn" | "over" {
  if (limit <= 0) return "ok";
  const ratio = minutes / limit;
  if (ratio >= 1) return "over";
  if (ratio >= 0.75) return "warn";
  return "ok";
}

export default function ParentHomeToday({ today, childName }: Props) {
  const t = useTranslations("ParentSpace.home");
  const locale = useLocale();
  const isRtl = isParentRtl(locale);

  if (!today || !childName) return null;

  const screenStatus = screenTimeStatus(today.screenMinutesToday, today.dailyScreenLimit);
  const screenPct =
    today.dailyScreenLimit > 0
      ? Math.min(100, Math.round((today.screenMinutesToday / today.dailyScreenLimit) * 100))
      : 0;

  const items = [
    {
      key: "missions",
      icon: Target,
      value: today.pendingMissions,
      label: t("todayPendingMissions"),
      href: "/dashboard/parent/atelier",
      accent: "text-rose-600 bg-rose-50 border-rose-100",
    },
    {
      key: "geny",
      icon: Sparkles,
      value: today.pendingGeny,
      label: t("todayPendingGeny"),
      href: "/dashboard/parent/atelier",
      accent: "text-violet-600 bg-violet-50 border-violet-100",
    },
    {
      key: "streak",
      icon: Flame,
      value: today.readingStreakDays,
      label: t("todayStreak"),
      href: "/dashboard/parent/bibliotheque",
      accent: "text-orange-600 bg-orange-50 border-orange-100",
      suffix: t("todayStreakDays"),
    },
  ] as const;

  return (
    <BlurFade delay={0.05} className="mb-8">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-5 shadow-sm md:p-6">
        <div className="mb-4 flex flex-wrap items-end justify-between gap-2">
          <div>
            <p className="text-[10px] font-black uppercase tracking-widest text-orange-500">{t("todayTitle")}</p>
            <h2 className={cn(parentTitleFont(isRtl), "text-lg font-black text-slate-900")}>
              {t("todayForChild", { name: childName.split(" ")[0] })}
            </h2>
          </div>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.key}
                href={item.href}
                className={cn(
                  "rounded-2xl border p-4 transition hover:shadow-md",
                  item.accent
                )}
              >
                <p className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-80">
                  <Icon className="h-3.5 w-3.5" />
                  {item.label}
                </p>
                <p className="text-2xl font-black">
                  <NumberTicker value={item.value} />
                  {"suffix" in item && item.suffix ? (
                    <span className="ms-1 text-sm font-bold opacity-60">{item.suffix}</span>
                  ) : null}
                </p>
              </Link>
            );
          })}

          <div
            className={cn(
              "rounded-2xl border p-4",
              screenStatus === "over"
                ? "border-red-200 bg-red-50 text-red-700"
                : screenStatus === "warn"
                  ? "border-amber-200 bg-amber-50 text-amber-800"
                  : "border-orange-100 bg-orange-50 text-orange-800"
            )}
          >
            <p className="mb-2 flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest opacity-80">
              <Clock className="h-3.5 w-3.5" />
              {t("screenTime")}
            </p>
            <p className="text-2xl font-black">
              <NumberTicker value={today.screenMinutesToday} />
              <span className="text-sm font-bold opacity-60">
                {" / "}
                {today.dailyScreenLimit > 0 ? today.dailyScreenLimit : "—"} {t("screenTimeMin")}
              </span>
            </p>
            {today.dailyScreenLimit > 0 && (
              <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-white/60">
                <div
                  className={cn(
                    "h-full rounded-full transition-all",
                    screenStatus === "over" ? "bg-red-500" : screenStatus === "warn" ? "bg-amber-500" : "bg-orange-500"
                  )}
                  style={{ width: `${screenPct}%` }}
                />
              </div>
            )}
          </div>
        </div>
      </div>
    </BlurFade>
  );
}

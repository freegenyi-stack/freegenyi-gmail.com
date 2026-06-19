"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Crown, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { isParentRtl, parentSubtitleFont, parentTitleFont, RTL_ARROW_FLIP } from "@/lib/parent/parent-rtl";
import { Spotlight } from "@/components/aceternity/spotlight";
import ParentChildSwitcher from "@/components/parent/ParentChildSwitcher";
import { BlurFade } from "@/components/magicui/blur-fade";

type Props = {
  firstName: string;
  selectedChildId: number | null;
};

export default function ParentHomeHero({ firstName, selectedChildId }: Props) {
  const t = useTranslations("ParentSpace");
  const tNav = useTranslations("ParentSpace.nav");
  const locale = useLocale();
  const isRtl = isParentRtl(locale);

  return (
    <BlurFade>
      <div className="relative mb-8 overflow-hidden rounded-[2rem] border border-orange-100/80 bg-[#FFFBF7] p-6 shadow-lg shadow-orange-100/40 md:p-8">
        <Spotlight className="-top-40 start-0 md:-top-20 md:start-80" />
        <div className="pointer-events-none absolute -end-12 -top-12 h-40 w-40 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 start-8 h-32 w-32 rounded-full bg-amber-100/50 blur-3xl" />

        <div className="relative z-10 flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <span className="mb-3 inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.2em] text-orange-600">
              <Crown className="h-3 w-3" /> {t("home.premiumBadge")}
            </span>
            <h1
              className={cn(
                parentTitleFont(isRtl),
                "text-2xl font-black tracking-tight text-slate-900 md:text-4xl"
              )}
            >
              {t("home.greeting", { name: firstName })}
            </h1>
            <p
              className={cn(
                "mt-2 max-w-xl text-sm font-medium text-slate-600 md:text-base",
                parentSubtitleFont(isRtl)
              )}
            >
              {t("home.subtitlePremium")}
            </p>
            <div className="mt-4">
              <ParentChildSwitcher inline />
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {selectedChildId && (
              <Link
                href={`/lobby/${selectedChildId}`}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-400"
              >
                {t("home.childMode")}
                <ArrowRight className={cn("h-3.5 w-3.5", RTL_ARROW_FLIP)} />
              </Link>
            )}
            <Link
              href="/dashboard/parent/objectifs"
              className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-white px-5 py-3 text-xs font-black uppercase tracking-widest text-slate-700 transition hover:border-orange-300 hover:bg-orange-50"
            >
              <Trophy className="h-3.5 w-3.5 text-orange-500" />
              {tNav("goals")}
            </Link>
          </div>
        </div>
      </div>
    </BlurFade>
  );
}

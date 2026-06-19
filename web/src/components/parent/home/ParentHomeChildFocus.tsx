"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ChevronDown, ChevronUp, Flame } from "lucide-react";
import { cn } from "@/lib/utils";
import ChildAccessPanel from "@/components/family/ChildAccessPanel";
import ParentEmotionalBoostButton from "@/components/parent/ParentEmotionalBoostButton";
import { learningModeLabel } from "@/components/parent/home/learning-mode-label";
import { BlurFade } from "@/components/magicui/blur-fade";
import type { ParentChildInsights } from "@/lib/parent/dashboard-insights.server";

type Partner = { id: number; fullName: string | null } | null;

type Props = {
  locale: string;
  children: ParentChildInsights[];
  selectedChildId: number | null;
  profileComplete: boolean;
  childrenPins: { id: number; hasPin: boolean }[];
  partner: Partner;
};

export default function ParentHomeChildFocus({
  locale,
  children,
  selectedChildId,
  profileComplete,
  childrenPins,
  partner,
}: Props) {
  const t = useTranslations("ParentSpace.home");
  const isAr = locale.endsWith("-ar") || locale === "ar";
  const [expandedOthers, setExpandedOthers] = useState(false);

  if (children.length === 0) {
    return (
      <div className="rounded-3xl border border-dashed border-orange-200 bg-orange-50/40 p-10 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-white text-3xl shadow-sm">
          🦊
        </div>
        <h2 className="text-xl font-black text-slate-900">{t("emptyTitle")}</h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-slate-600">{t("emptyDesc")}</p>
        <Link
          href="/dashboard/children"
          className="mt-6 inline-block rounded-xl bg-orange-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-orange-400"
        >
          {t("emptyCta")}
        </Link>
      </div>
    );
  }

  const selected =
    children.find((c) => c.childId === selectedChildId) ?? children[0];
  const others = children.filter((c) => c.childId !== selected.childId);

  return (
    <div className="space-y-4">
      <ChildCard
        child={selected}
        isSelected
        isAr={isAr}
        profileComplete={profileComplete}
        pin={childrenPins.find((p) => p.id === selected.childId)}
        partner={partner}
        t={t}
      />

      {others.length > 0 && (
        <BlurFade delay={0.08}>
          <div className="rounded-2xl border border-orange-100 bg-[#FFFBF7] p-4">
            <button
              type="button"
              onClick={() => setExpandedOthers((v) => !v)}
              className="flex w-full items-center justify-between gap-2 text-start"
            >
              <span className="text-sm font-black text-slate-700">
                {t("otherChildren", { count: others.length })}
              </span>
              {expandedOthers ? (
                <ChevronUp className="h-4 w-4 text-slate-400" />
              ) : (
                <ChevronDown className="h-4 w-4 text-slate-400" />
              )}
            </button>

            {!expandedOthers && (
              <div className="mt-3 flex flex-wrap gap-2">
                {others.map((c) => (
                  <Link
                    key={c.childId}
                    href={`/dashboard/children`}
                    className="inline-flex items-center gap-2 rounded-xl border border-white bg-white px-3 py-2 text-xs font-bold text-slate-600 shadow-sm hover:border-orange-200"
                  >
                    <span>🦊</span>
                    {c.fullName.split(" ")[0]}
                    <span className="text-slate-400">· {t("level")} {c.stats.level}</span>
                  </Link>
                ))}
              </div>
            )}

            {expandedOthers && (
              <div className="mt-4 space-y-4">
                {others.map((child) => (
                  <ChildCard
                    key={child.childId}
                    child={child}
                    isSelected={false}
                    isAr={isAr}
                    profileComplete={profileComplete}
                    pin={childrenPins.find((p) => p.id === child.childId)}
                    partner={partner}
                    t={t}
                    compact
                  />
                ))}
              </div>
            )}
          </div>
        </BlurFade>
      )}
    </div>
  );
}

function ChildCard({
  child,
  isSelected,
  isAr,
  profileComplete,
  pin,
  partner,
  t,
  compact = false,
}: {
  child: ParentChildInsights;
  isSelected: boolean;
  isAr: boolean;
  profileComplete: boolean;
  pin?: { id: number; hasPin: boolean };
  partner: Partner;
  t: ReturnType<typeof useTranslations<"ParentSpace.home">>;
  compact?: boolean;
}) {
  const modeLabel = learningModeLabel(child.learningMode, isAr);

  return (
    <BlurFade>
      <div
        className={cn(
          "overflow-hidden rounded-3xl border bg-white shadow-sm transition",
          isSelected ? "border-orange-200 ring-2 ring-orange-100" : "border-slate-200"
        )}
      >
        <div className="border-b border-slate-100 bg-gradient-to-r from-[#FFFBF7] to-white px-6 py-5 sm:px-8">
          <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-4">
              <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-500 text-2xl text-white shadow-lg">
                🦊
              </div>
              <div>
                <h2 className="text-xl font-black text-slate-900">{child.fullName}</h2>
                <p className="mt-0.5 text-xs font-bold uppercase tracking-wider text-slate-400">
                  {child.educationLevel || t("levelUnknown")} · {modeLabel}
                </p>
              </div>
            </div>
            <Link
              href={`/lobby/${child.childId}`}
              className="rounded-xl bg-slate-900 px-5 py-3 text-center text-[10px] font-black uppercase tracking-widest text-white transition hover:bg-orange-600"
            >
              {t("openLobby")}
            </Link>
          </div>
        </div>

        <div className={cn("grid gap-3 p-6 sm:p-8", compact ? "grid-cols-2 sm:grid-cols-4" : "grid-cols-2 sm:grid-cols-4")}>
          <StatBox
            label={
              <span className="flex items-center justify-center gap-1">
                <Flame className="h-3 w-3" /> {t("streak")}
              </span>
            }
            value={`${child.readingStats.readingStreakDays}j`}
            className="border-orange-100 bg-orange-50/60 text-orange-600"
          />
          <StatBox
            label={t("level")}
            value={`${child.stats.level} · ${child.stats.progress}%`}
            className="border-orange-100 bg-orange-50/60 text-orange-700"
          />
          <StatBox label={t("books")} value={String(child.stats.booksRead)} className="border-orange-100 bg-orange-50/50 text-slate-900" />
          <StatBox label={t("missions")} value={String(child.stats.exercisesDone)} className="border-orange-100 bg-orange-50/50 text-slate-900" />
        </div>

        {!compact && child.recentMissions.length > 0 && (
          <div className="border-t border-slate-100 px-6 py-4 sm:px-8">
            <p className="mb-3 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("recentMissions")}</p>
            <ul className="space-y-2">
              {child.recentMissions.slice(0, 3).map((m) => (
                <li key={m.progressId} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate font-medium text-slate-700">{m.resourceTitle}</span>
                  <span
                    className={cn(
                      "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-black uppercase",
                      m.status === "done"
                        ? "bg-emerald-100 text-emerald-700"
                        : m.status === "in_progress"
                          ? "bg-amber-100 text-amber-700"
                          : "bg-slate-100 text-slate-600"
                    )}
                  >
                    {m.status === "done" ? t("done") : m.status === "in_progress" ? t("inProgress") : t("pending")}
                  </span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {!compact && profileComplete && pin && (
          <div className="border-t border-slate-100 px-6 py-4 sm:px-8">
            <ChildAccessPanel childId={child.childId} childName={child.fullName} hasPin={pin.hasPin} />
          </div>
        )}

        {!compact && (
          <div className="border-t border-slate-100 px-6 py-4 sm:px-8">
            <ParentEmotionalBoostButton
              childId={child.childId}
              childName={child.fullName}
              partnerId={partner?.id}
            />
          </div>
        )}
      </div>
    </BlurFade>
  );
}

function StatBox({
  label,
  value,
  className,
}: {
  label: React.ReactNode;
  value: string;
  className?: string;
}) {
  return (
    <div className={cn("rounded-2xl border p-4 text-center", className)}>
      <p className="mb-1 text-[10px] font-black uppercase tracking-widest opacity-80">{label}</p>
      <p className="text-2xl font-black">{value}</p>
    </div>
  );
}

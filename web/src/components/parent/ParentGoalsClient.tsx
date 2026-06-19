"use client";

import React, { useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Loader2, Target, Trophy } from "lucide-react";
import { cn } from "@/lib/utils";
import { RTL_ARROW_FLIP } from "@/lib/parent/parent-rtl";
import { ParentEmptyState, ParentPageHeader } from "@/components/parent/ParentShell";
import { updateQuarterGoalsAction } from "@/lib/actions/parent-goals";
import type { QuarterGoalProgress } from "@/lib/parent/quarter-goals";

type ChildGoals = {
  childId: number;
  fullName: string;
  educationLevel: string | null;
  progress: QuarterGoalProgress;
};

type Props = {
  children: ChildGoals[];
  selectedChildId: number | null;
};

function ProgressRing({ percent }: { percent: number }) {
  const r = 36;
  const c = 2 * Math.PI * r;
  const offset = c - (percent / 100) * c;

  return (
    <svg className="h-24 w-24 -rotate-90" viewBox="0 0 96 96">
      <circle cx="48" cy="48" r={r} fill="none" stroke="#E2E8F0" strokeWidth="8" />
      <circle
        cx="48"
        cy="48"
        r={r}
        fill="none"
        stroke="#F97316"
        strokeWidth="8"
        strokeLinecap="round"
        strokeDasharray={c}
        strokeDashoffset={offset}
      />
      <text x="48" y="52" textAnchor="middle" className="rotate-90 fill-slate-900 text-sm font-black" style={{ fontSize: 14 }}>
        {percent}%
      </text>
    </svg>
  );
}

export default function ParentGoalsClient({ children, selectedChildId }: Props) {
  const t = useTranslations("ParentSpace.goals");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";

  const initialId = selectedChildId ?? children[0]?.childId ?? null;
  const [activeId, setActiveId] = useState(initialId);
  const [pending, startTransition] = useTransition();
  const [message, setMessage] = useState<string | null>(null);

  const active = children.find((c) => c.childId === activeId);
  const [targets, setTargets] = useState(() =>
    active
      ? {
          booksTarget: active.progress.booksTarget,
          missionsTarget: active.progress.missionsTarget,
          readingDaysTarget: active.progress.readingDaysTarget,
        }
      : { booksTarget: 3, missionsTarget: 8, readingDaysTarget: 12 }
  );

  React.useEffect(() => {
    if (!active) return;
    setTargets({
      booksTarget: active.progress.booksTarget,
      missionsTarget: active.progress.missionsTarget,
      readingDaysTarget: active.progress.readingDaysTarget,
    });
  }, [activeId, active]);

  const save = () => {
    if (!activeId) return;
    setMessage(null);
    startTransition(async () => {
      const res = await updateQuarterGoalsAction(activeId, targets);
      setMessage(res.error ? res.error : t("saved"));
    });
  };

  if (children.length === 0) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />
        <ParentEmptyState>
          <p className="text-sm text-slate-600">{t("noChild")}</p>
          <Link
            href="/dashboard/children"
            className="mt-4 inline-flex items-center gap-2 rounded-xl bg-orange-500 px-5 py-3 text-xs font-black uppercase tracking-widest text-white hover:bg-orange-400"
          >
            {t("addChild")} <ArrowRight className={cn("h-3.5 w-3.5", RTL_ARROW_FLIP)} />
          </Link>
        </ParentEmptyState>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />

      <div className="mb-6 flex flex-wrap gap-2">
        {children.map((child) => (
          <button
            key={child.childId}
            type="button"
            onClick={() => setActiveId(child.childId)}
            className={cn(
              "rounded-xl px-4 py-2 text-xs font-black uppercase tracking-widest transition",
              activeId === child.childId
                ? "bg-orange-500 text-white shadow-lg shadow-orange-500/20"
                : "border border-slate-200 bg-white text-slate-600 hover:border-orange-200"
            )}
          >
            {child.fullName.split(" ")[0]}
          </button>
        ))}
      </div>

      {active && (
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-[#FFFBF7] to-orange-50/80 p-8 shadow-lg lg:col-span-1">
            <div className="mb-4 flex items-center gap-2 text-orange-600">
              <Trophy className="h-4 w-4" />
              <span className="text-[10px] font-black uppercase tracking-widest">{t("quarter", { q: active.progress.quarter })}</span>
            </div>
            <div className="flex items-center gap-6">
              <ProgressRing percent={active.progress.overallPercent} />
              <div>
                <p className="text-lg font-black text-slate-900">{active.fullName.split(" ")[0]}</p>
                <p className="text-xs text-slate-500">{active.educationLevel || t("levelUnknown")}</p>
                <p className="mt-2 text-sm font-bold text-orange-700">{t("overallProgress", { percent: active.progress.overallPercent })}</p>
              </div>
            </div>
          </div>

          <div className="space-y-4 lg:col-span-2">
            {[
              {
                key: "books" as const,
                label: t("books"),
                done: active.progress.booksDone,
                target: active.progress.booksTarget,
                percent: active.progress.booksPercent,
                field: "booksTarget" as const,
              },
              {
                key: "missions" as const,
                label: t("missions"),
                done: active.progress.missionsDone,
                target: active.progress.missionsTarget,
                percent: active.progress.missionsPercent,
                field: "missionsTarget" as const,
              },
              {
                key: "reading" as const,
                label: t("readingDays"),
                done: active.progress.readingStreak,
                target: active.progress.readingDaysTarget,
                percent: active.progress.readingPercent,
                field: "readingDaysTarget" as const,
              },
            ].map((row) => (
              <div key={row.key} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                <div className="mb-3 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-2">
                    <Target className="h-4 w-4 text-orange-500" />
                    <span className="text-sm font-black text-slate-900">{row.label}</span>
                  </div>
                  <span className="text-xs font-bold text-slate-500">
                    {t("progressLine", { done: row.done, target: row.target })}
                  </span>
                </div>
                <div className="mb-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500" style={{ width: `${row.percent}%` }} />
                </div>
                <label className="flex items-center gap-3 text-xs font-bold text-slate-600">
                  {t("target")}
                  <input
                    type="number"
                    min={1}
                    max={99}
                    value={targets[row.field]}
                    onChange={(e) =>
                      setTargets((prev) => ({
                        ...prev,
                        [row.field]: Math.max(1, parseInt(e.target.value, 10) || 1),
                      }))
                    }
                    className="w-20 rounded-lg border border-slate-200 px-2 py-1.5 text-center font-black text-slate-900"
                  />
                </label>
              </div>
            ))}

            <div className="flex flex-wrap items-center gap-3">
              <button
                type="button"
                disabled={pending}
                onClick={save}
                className="inline-flex items-center gap-2 rounded-xl bg-orange-500 px-6 py-3 text-xs font-black uppercase tracking-widest text-white shadow-lg hover:bg-orange-400 disabled:opacity-60"
              >
                {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
                {t("save")}
              </button>
              {message && <p className="text-sm font-bold text-orange-700">{message}</p>}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

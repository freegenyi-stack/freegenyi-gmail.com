"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import {
  BookOpen,
  CheckCircle2,
  Clock,
  Heart,
  Lock,
  PenTool,
  Search,
  Shield,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ParentPageHeader, ParentSectionCard } from "@/components/parent/ParentShell";
import type { UnifiedHistoryItem } from "@/lib/parent/parent-history.server";

type Props = {
  history: UnifiedHistoryItem[];
};

function iconFor(item: UnifiedHistoryItem) {
  switch (item.type) {
    case "reading":
      return BookOpen;
    case "mission":
      return item.detail === "Terminée" ? CheckCircle2 : Clock;
    case "boost":
      return Heart;
    case "auth":
      return Lock;
    case "exercise":
      return PenTool;
    case "search":
      return Search;
    default:
      return Shield;
  }
}

function colorFor(item: UnifiedHistoryItem) {
  switch (item.type) {
    case "reading":
      return "bg-amber-100 text-amber-800";
    case "mission":
      return "bg-orange-100 text-orange-700";
    case "boost":
      return "bg-rose-100 text-rose-700";
    case "auth":
      return "bg-blue-100 text-blue-700";
    case "exercise":
      return "bg-green-100 text-green-700";
    case "search":
      return "bg-purple-100 text-purple-700";
    default:
      return "bg-slate-100 text-slate-600";
  }
}

export default function ParentHistoryClient({ history }: Props) {
  const t = useTranslations("ParentSpace.history");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />

      <ParentSectionCard className="overflow-hidden p-0">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 px-6 py-4">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">{t("timeline")}</p>
          <div className="flex gap-2">
            <a
              href={`/api/parent/history/export?format=csv&locale=${encodeURIComponent(locale)}`}
              className="rounded-lg border border-orange-200 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-orange-700 hover:bg-orange-50"
            >
              {t("exportCsv")}
            </a>
            <a
              href={`/api/parent/history/export?format=pdf&locale=${encodeURIComponent(locale)}`}
              className="rounded-lg bg-orange-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-wider text-white hover:bg-orange-400"
            >
              {t("exportPdf")}
            </a>
          </div>
        </div>
        {history.length === 0 ? (
          <p className="p-10 text-center text-sm text-slate-500">{t("empty")}</p>
        ) : (
          <ul className="divide-y divide-slate-50">
            {history.map((item) => {
              const Icon = iconFor(item);
              return (
                <li key={item.id} className="flex items-start gap-4 px-6 py-4 hover:bg-orange-50/40">
                  <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl", colorFor(item))}>
                    <Icon className="h-4 w-4" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-col gap-1 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <p className="text-sm font-bold text-slate-900">{item.title}</p>
                        {(item.detail || item.childName) && (
                          <p className="text-xs text-slate-500">
                            {[item.childName, item.detail].filter(Boolean).join(" · ")}
                          </p>
                        )}
                      </div>
                      <span className="shrink-0 text-[10px] font-black uppercase tracking-wider text-slate-400">
                        {new Date(item.date).toLocaleDateString(locale, {
                          day: "numeric",
                          month: "short",
                          hour: "2-digit",
                          minute: "2-digit",
                        })}
                      </span>
                    </div>
                    <span
                      className={cn(
                        "mt-2 inline-block rounded-full px-2 py-0.5 text-[9px] font-black uppercase",
                        item.source === "child" ? "bg-orange-50 text-orange-700" : "bg-slate-100 text-slate-600"
                      )}
                    >
                      {item.source === "child" ? t("sourceChild") : t("sourceAccount")}
                    </span>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </ParentSectionCard>
    </div>
  );
}

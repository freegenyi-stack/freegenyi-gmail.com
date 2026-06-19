"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, FileText, Loader2, Printer } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParentEmptyState, ParentPageHeader, ParentSectionCard } from "@/components/parent/ParentShell";

type ChildOption = {
  id: number;
  fullName: string;
  educationLevel: string | null;
};

type Props = {
  children: ChildOption[];
  selectedChildId: number | null;
};

export default function ParentPrintableClient({ children, selectedChildId }: Props) {
  const t = useTranslations("ParentSpace.printables");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const [activeId, setActiveId] = useState(selectedChildId ?? children[0]?.id ?? null);
  const [loading, setLoading] = useState(false);

  const activeChild = children.find((c) => c.id === activeId);

  const downloadPdf = async () => {
    if (!activeId) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/parent/printables/${activeId}?locale=${encodeURIComponent(locale)}`);
      if (!res.ok) throw new Error("download_failed");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `cahier-revision-${activeChild?.fullName.split(" ")[0] ?? "enfant"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      alert(t("error"));
    } finally {
      setLoading(false);
    }
  };

  if (children.length === 0) {
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />
        <ParentEmptyState className="text-sm text-slate-600">{t("noChild")}</ParentEmptyState>
      </div>
    );
  }

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />

      <div className="grid gap-8 lg:grid-cols-2">
        <ParentSectionCard>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-100 text-blue-600">
              <Printer className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">{t("cardTitle")}</h2>
              <p className="text-xs text-slate-500">{t("cardDesc")}</p>
            </div>
          </div>

          {children.length > 1 && (
            <div className="mb-4 flex flex-wrap gap-2">
              {children.map((c) => (
                <button
                  key={c.id}
                  type="button"
                  onClick={() => setActiveId(c.id)}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-black transition",
                    activeId === c.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"
                  )}
                >
                  {c.fullName.split(" ")[0]}
                </button>
              ))}
            </div>
          )}

          {activeChild && (
            <p className="mb-4 text-sm text-slate-600">
              {t("forChild", { name: activeChild.fullName, level: activeChild.educationLevel || "—" })}
            </p>
          )}

          <ul className="mb-6 space-y-2 text-sm text-slate-600">
            {[t("point1"), t("point2"), t("point3")].map((line) => (
              <li key={line} className="flex items-start gap-2">
                <FileText className="mt-0.5 h-4 w-4 shrink-0 text-orange-600" />
                {line}
              </li>
            ))}
          </ul>

          <button
            type="button"
            disabled={loading || !activeId}
            onClick={downloadPdf}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-xs font-black uppercase tracking-widest text-white transition hover:bg-orange-400 disabled:opacity-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {t("cta")}
          </button>
          {children.length > 1 && (
            <button
              type="button"
              disabled={loading}
              onClick={async () => {
                setLoading(true);
                try {
                  const res = await fetch(`/api/parent/printables/family?locale=${encodeURIComponent(locale)}`);
                  if (!res.ok) throw new Error("fail");
                  const blob = await res.blob();
                  const url = URL.createObjectURL(blob);
                  const a = document.createElement("a");
                  a.href = url;
                  a.download = "cahier-famille-freegeny.pdf";
                  a.click();
                  URL.revokeObjectURL(url);
                } catch {
                  alert(t("error"));
                } finally {
                  setLoading(false);
                }
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 py-3 text-xs font-black uppercase tracking-widest text-blue-800 hover:bg-blue-100 disabled:opacity-50"
            >
              {t("ctaFamily")}
            </button>
          )}
        </ParentSectionCard>

        <ParentSectionCard className="border-orange-100 bg-gradient-to-br from-[#FFFBF7] to-white">
          <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-orange-700">{t("howTitle")}</h3>
          <ol className="space-y-3 text-sm text-slate-700">
            {[t("step1"), t("step2"), t("step3"), t("sampleExercise")].map((step, i) => (
              <li key={step} className="flex gap-3">
                <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-orange-500 text-[10px] font-black text-white">
                  {i + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>
        </ParentSectionCard>
      </div>
    </div>
  );
}

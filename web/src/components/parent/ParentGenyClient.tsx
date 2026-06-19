"use client";

import React, { useState, useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Download, Loader2, Send, Sparkles, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParentEmptyState, ParentPageHeader, ParentSectionCard } from "@/components/parent/ParentShell";
import {
  assignGenyWorksheetAction,
  generateGenyExercisesAction,
} from "@/lib/actions/parent-geny";
import type { GenyExerciseSet } from "@/lib/parent/geny-exercise-generator.server";
import { Link } from "@/i18n/routing";

type ChildOption = {
  id: number;
  fullName: string;
  educationLevel: string | null;
};

type Props = {
  children: ChildOption[];
  selectedChildId: number | null;
  embedded?: boolean;
};

export default function ParentGenyClient({ children, selectedChildId, embedded = false }: Props) {
  const t = useTranslations("ParentSpace.genyFactory");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const [activeId, setActiveId] = useState(selectedChildId ?? children[0]?.id ?? null);
  const [sets, setSets] = useState<GenyExerciseSet[]>([]);
  const [count, setCount] = useState(3);
  const [message, setMessage] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const [pdfLoading, setPdfLoading] = useState(false);

  const activeChild = children.find((c) => c.id === activeId);

  const onGenerate = () => {
    if (!activeId) return;
    setMessage(null);
    startTransition(async () => {
      const res = await generateGenyExercisesAction({ childId: activeId, count });
      if (res.error) {
        setMessage(res.error);
        setSets([]);
        return;
      }
      setSets(res.sets ?? []);
    });
  };

  const onAssign = () => {
    if (!activeId || sets.length === 0) return;
    setMessage(null);
    startTransition(async () => {
      const res = await assignGenyWorksheetAction({
        childId: activeId,
        sets,
        locale,
      });
      setMessage(res.error ?? t("assigned"));
    });
  };

  const downloadPdf = async () => {
    if (!activeId) return;
    setPdfLoading(true);
    try {
      const res = await fetch(`/api/parent/printables/${activeId}?locale=${encodeURIComponent(locale)}`);
      if (!res.ok) throw new Error("fail");
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `geny-cahier-${activeChild?.fullName.split(" ")[0] ?? "enfant"}.pdf`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage(t("error"));
    } finally {
      setPdfLoading(false);
    }
  };

  if (children.length === 0) {
    const empty = <ParentEmptyState className="text-sm text-slate-600">{t("noChild")}</ParentEmptyState>;
    if (embedded) return <div dir={isRTL ? "rtl" : "ltr"}>{empty}</div>;
    return (
      <div dir={isRTL ? "rtl" : "ltr"}>
        <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />
        {empty}
      </div>
    );
  }

  const content = (
    <>
      <div className="mb-6 flex flex-wrap gap-2">
        {children.map((c) => (
          <button
            key={c.id}
            type="button"
            onClick={() => {
              setActiveId(c.id);
              setSets([]);
              setMessage(null);
            }}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-black transition",
              activeId === c.id ? "bg-orange-500 text-white shadow-md shadow-orange-500/20" : "bg-slate-100 text-slate-600 hover:bg-orange-50"
            )}
          >
            {c.fullName.split(" ")[0]}
          </button>
        ))}
      </div>

      <div className="grid gap-8 lg:grid-cols-2">
        <ParentSectionCard>
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-900">{t("generateTitle")}</h2>
              <p className="text-xs text-slate-500">{t("generateDesc")}</p>
            </div>
          </div>

          <label className="mb-4 block text-xs font-bold text-slate-600">
            {t("countLabel")}
            <select
              value={count}
              onChange={(e) => setCount(parseInt(e.target.value, 10))}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm focus:border-orange-300 focus:outline-none focus:ring-2 focus:ring-orange-100"
            >
              {[2, 3, 4, 5].map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </select>
          </label>

          <button
            type="button"
            disabled={pending || !activeId}
            onClick={onGenerate}
            className="mb-3 flex w-full items-center justify-center gap-2 rounded-xl bg-violet-600 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-violet-700 disabled:opacity-50"
          >
            {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}
            {t("generateCta")}
          </button>

          <button
            type="button"
            disabled={pdfLoading || !activeId}
            onClick={downloadPdf}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-orange-200 py-3 text-xs font-black uppercase tracking-widest text-slate-700 hover:bg-orange-50 disabled:opacity-50"
          >
            {pdfLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
            {t("printCta")}
          </button>
          {children.length > 1 && (
            <button
              type="button"
              disabled={pdfLoading}
              onClick={async () => {
                setPdfLoading(true);
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
                  setMessage(t("error"));
                } finally {
                  setPdfLoading(false);
                }
              }}
              className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl border border-amber-200 bg-amber-50 py-3 text-xs font-black uppercase tracking-widest text-amber-900 hover:bg-amber-100 disabled:opacity-50"
            >
              {t("printFamilyCta")}
            </button>
          )}
        </ParentSectionCard>

        <ParentSectionCard className="border-orange-100 bg-gradient-to-br from-[#FFFBF7] to-white">
          <h3 className="mb-3 text-sm font-black uppercase tracking-widest text-orange-700">{t("previewTitle")}</h3>
          {sets.length === 0 ? (
            <p className="text-sm text-slate-500">{t("previewEmpty")}</p>
          ) : (
            <ul className="space-y-4">
              {sets.map((set) => (
                <li key={set.id} className="rounded-xl border border-orange-100 bg-white p-4">
                  <p className="text-xs font-black uppercase text-orange-600">
                    {isRTL ? set.subjectAr : set.subjectFr}
                  </p>
                  <p className="font-bold text-slate-900">{isRTL ? set.titleAr : set.titleFr}</p>
                  <p className="mt-1 text-xs text-slate-500">
                    {set.questions.length} {t("questions")}
                  </p>
                </li>
              ))}
            </ul>
          )}

          {sets.length > 0 && (
            <button
              type="button"
              disabled={pending}
              onClick={onAssign}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-orange-500 py-3.5 text-xs font-black uppercase tracking-widest text-white hover:bg-orange-400 disabled:opacity-50"
            >
              {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
              {t("assignCta")}
            </button>
          )}

          {message && (
            <p className="mt-4 rounded-xl bg-orange-50 px-4 py-3 text-sm font-bold text-orange-800">{message}</p>
          )}

          {activeId && (
            <Link
              href={`/lobby/${activeId}/geny`}
              className="mt-3 block text-center text-xs font-bold text-orange-700 underline"
            >
              {t("openLobby")}
            </Link>
          )}
        </ParentSectionCard>
      </div>
    </>
  );

  if (embedded) return <div dir={isRTL ? "rtl" : "ltr"}>{content}</div>;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />
      {content}
    </div>
  );
}

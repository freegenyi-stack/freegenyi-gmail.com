"use client";

import React, { useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  Download,
  FileText,
  Loader2,
  Pencil,
  Send,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ParentPageHeader, ParentSectionCard } from "@/components/parent/ParentShell";
import type { ProgramSectionDetail, ContentKind, CurriculumSubject } from "@/lib/curriculum/types";
import {
  sendSectionExercisesAction,
  sendSectionLessonPlaceholderAction,
  teacherAssignSectionAction,
} from "@/lib/actions/curriculum-programme";

type ChildOption = { id: number; fullName: string };

type Props = {
  detail: ProgramSectionDetail;
  mode: "parent" | "teacher";
  backHref: string;
  subject: CurriculumSubject;
  children?: ChildOption[];
  selectedChildId?: number | null;
  atelierHref?: string;
};

const KIND_COLORS: Record<ContentKind, string> = {
  lesson: "bg-sky-100 text-sky-700",
  surah: "bg-emerald-100 text-emerald-700",
  mahfoudat: "bg-amber-100 text-amber-800",
  exercise: "bg-orange-100 text-orange-700",
  project: "bg-violet-100 text-violet-700",
  audio: "bg-teal-100 text-teal-700",
};

export default function ProgrammeSectionClient({
  detail,
  mode,
  backHref,
  subject,
  children = [],
  selectedChildId,
  atelierHref,
}: Props) {
  const t = useTranslations("Programme");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const [filter, setFilter] = useState<string>("all");
  const [childId, setChildId] = useState(selectedChildId ?? children[0]?.id ?? null);
  const [message, setMessage] = useState<string | null>(null);
  const [pendingAction, setPendingAction] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  const filters = [
    { id: "all", label: t("filterAll") },
    { id: "lesson", label: t("filterLessons") },
    { id: "surah", label: t("filterSurah") },
    { id: "mahfoudat", label: t("filterMahfoudat") },
    { id: "project", label: t("filterProjects") },
  ];

  const matchesFilter = (kind: ContentKind) =>
    filter === "all" || filter === kind || (filter === "lesson" && kind === "lesson");

  const runAction = (action: string, fn: () => Promise<{ error?: string; message?: string; sessionKey?: string }>) => {
    if (!childId && mode === "parent") {
      setMessage(t("pickChild"));
      return;
    }
    if (!childId && mode === "teacher") {
      setMessage(t("pickStudent"));
      return;
    }
    setMessage(null);
    setPendingAction(action);
    startTransition(async () => {
      const res = await fn();
      setPendingAction(null);
      if (res.error) setMessage(res.error);
      else if (res.message) setMessage(res.message);
      else if (res.sessionKey) setMessage(t("sentOk"));
    });
  };

  const printUrl =
    childId != null
      ? `/api/parent/curriculum/print-section?childId=${childId}&maqtaId=${detail.maqtaId}&subject=${subject}`
      : null;

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <Link
        href={backHref}
        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-orange-600 hover:text-orange-700"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToProgram")}
      </Link>

      <ParentPageHeader
        title={detail.titreFr}
        subtitle={detail.titreAr}
        badge={t("sectionWorld")}
        premium
      />

      {children.length > 0 && (
        <div className="mb-4 flex flex-wrap gap-2">
          {children.map((c) => (
            <button
              key={c.id}
              type="button"
              onClick={() => setChildId(c.id)}
              className={cn(
                "rounded-full px-3 py-1.5 text-xs font-black transition",
                childId === c.id ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              {c.fullName.split(" ")[0]}
            </button>
          ))}
        </div>
      )}

      {message && (
        <p className="mb-4 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-sm font-medium text-orange-800">
          {message}
        </p>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        {filters.map((f) => (
          <button
            key={f.id}
            type="button"
            onClick={() => setFilter(f.id)}
            className={cn(
              "rounded-lg border px-3 py-1.5 text-[11px] font-bold transition",
              filter === f.id
                ? "border-orange-300 bg-orange-50 text-orange-700"
                : "border-slate-200 bg-white text-slate-500"
            )}
          >
            {f.label}
          </button>
        ))}
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <ActionBtn
          icon={Download}
          label={t("printLesson")}
          onClick={() =>
            runAction("print-lesson", () =>
              sendSectionLessonPlaceholderAction({ childId: childId!, maqtaId: detail.maqtaId, locale })
            )
          }
          pending={pendingAction === "print-lesson" || isPending}
        />
        <ActionBtn
          icon={Send}
          label={t("sendLesson")}
          onClick={() =>
            runAction("send-lesson", () =>
              sendSectionLessonPlaceholderAction({ childId: childId!, maqtaId: detail.maqtaId, locale })
            )
          }
          pending={pendingAction === "send-lesson" || isPending}
        />
        <ActionBtn
          icon={FileText}
          label={t("printExercises")}
          onClick={() => {
            if (printUrl) window.open(printUrl, "_blank", "noopener");
            else setMessage(t("pickChild"));
          }}
          pending={false}
        />
        <ActionBtn
          icon={Sparkles}
          label={t("sendExercises")}
          onClick={() =>
            runAction("send-exo", () =>
              mode === "teacher"
                ? teacherAssignSectionAction({
                    childId: childId!,
                    maqtaId: detail.maqtaId,
                    subject,
                    itemsCount: 5,
                  })
                : sendSectionExercisesAction({
                    childId: childId!,
                    maqtaId: detail.maqtaId,
                    subject,
                    locale,
                    itemsCount: 5,
                  })
            )
          }
          pending={pendingAction === "send-exo" || isPending}
          primary
        />
        {mode === "teacher" && atelierHref && (
          <Link
            href={atelierHref}
            className={cn(
              "flex items-center justify-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-3 text-xs font-black text-slate-700 transition hover:border-violet-200 hover:bg-violet-50 sm:col-span-2"
            )}
          >
            <Pencil className="h-4 w-4" />
            {t("editContent")}
          </Link>
        )}
      </div>

      <p className="mb-6 text-xs text-slate-500">{t("scanPendingHint")}</p>

      <div className="space-y-6">
        {detail.blocks.map((block) => {
          const units = block.units.filter((u) => matchesFilter(u.contentKind));
          if (units.length === 0) return null;
          return (
            <ParentSectionCard key={block.blockId}>
              <h3 className="mb-1 font-black text-slate-900" dir="rtl">
                {block.titreAr ?? block.titreFr}
              </h3>
              <p className="mb-4 text-xs text-slate-500">{block.titreFr}</p>
              <div className="space-y-3">
                {units.map((unit) => (
                  <div
                    key={unit.unitId}
                    className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 bg-slate-50/80 p-3"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-bold text-slate-900" dir="rtl">
                        {unit.titreAr ?? unit.titreFr}
                      </p>
                      <p className="text-xs text-slate-500">
                        {unit.titreFr}
                        {unit.pageRef != null && ` · p. ${unit.pageRef}`}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "rounded-full px-2 py-0.5 text-[10px] font-black uppercase",
                        KIND_COLORS[unit.contentKind] ?? "bg-slate-100 text-slate-600"
                      )}
                    >
                      {unit.contentKind}
                    </span>
                    <span className="text-[10px] font-bold text-slate-400">
                      {unit.lessonStatus === "pending_scan" ? t("awaitingScan") : unit.lessonStatus ?? "—"}
                    </span>
                  </div>
                ))}
              </div>
            </ParentSectionCard>
          );
        })}
      </div>
    </div>
  );
}

function ActionBtn({
  icon: Icon,
  label,
  onClick,
  pending,
  primary,
  className,
}: {
  icon: React.ComponentType<{ className?: string }>;
  label: string;
  onClick: () => void;
  pending?: boolean;
  primary?: boolean;
  className?: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={pending}
      className={cn(
        "flex items-center justify-center gap-2 rounded-xl border px-4 py-3 text-xs font-black transition hover:-translate-y-0.5",
        primary
          ? "border-orange-300 bg-orange-500 text-white shadow-md shadow-orange-500/20 hover:bg-orange-600"
          : "border-slate-200 bg-white text-slate-700 hover:border-orange-200 hover:bg-orange-50",
        className
      )}
    >
      {pending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Icon className="h-4 w-4" />}
      {label}
    </button>
  );
}

"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { BookOpen, ChevronRight, Users } from "lucide-react";
import AtelierClasseClient from "@/components/atelier/AtelierClasseClient";
import AtelierSchoolBanner from "@/components/atelier/AtelierSchoolBanner";
import { TeacherPageHeader } from "@/components/teacher/TeacherShell";
import type { ClasseProgressRow } from "@/lib/authoring/assignments.server";
import type { ActivityAttemptRow } from "@/lib/authoring/attempts.server";
import type { TeacherDashboardInsights } from "@/lib/teacher/dashboard-insights.server";
import type { SchoolReadingSummary, TeacherSchoolChild } from "@/lib/library/books.server";

type Props = {
  rows: ClasseProgressRow[];
  attemptRows: ActivityAttemptRow[];
  teacherLevels: string[];
  schoolChildren: TeacherSchoolChild[];
  readingSummary: SchoolReadingSummary;
  insights: TeacherDashboardInsights;
};

export default function TeacherClassHubClient({
  rows,
  attemptRows,
  teacherLevels,
  schoolChildren,
  readingSummary,
  insights,
}: Props) {
  const t = useTranslations("TeacherSpace.classHub");
  const avgLabel =
    insights.avgScore7d != null ? t("statAvgScoreValue", { score: insights.avgScore7d }) : t("statAvgScoreEmpty");

  return (
    <div className="space-y-8">
      <TeacherPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} />

      <AtelierSchoolBanner hasSchool={insights.hasSchool} childCount={schoolChildren.length} />

      <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-2xl border border-violet-100 bg-violet-50 p-4">
          <p className="text-[10px] font-black uppercase text-violet-800">{t("statPending")}</p>
          <p className="text-2xl font-black text-violet-950">{insights.pendingAssignments}</p>
        </div>
        <div className="rounded-2xl border border-amber-100 bg-amber-50 p-4">
          <p className="text-[10px] font-black uppercase text-amber-800">{t("statInProgress")}</p>
          <p className="text-2xl font-black text-amber-950">{insights.inProgressAssignments}</p>
        </div>
        <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4">
          <p className="text-[10px] font-black uppercase text-emerald-800">{t("statAvgScore")}</p>
          <p className="text-2xl font-black text-emerald-950">{avgLabel}</p>
          {insights.recentCompletions > 0 && (
            <p className="mt-1 text-[11px] font-semibold text-emerald-700">
              {t("statCompletionsHint", { count: insights.recentCompletions })}
            </p>
          )}
        </div>
        <div className="rounded-2xl border border-sky-100 bg-sky-50 p-4">
          <p className="text-[10px] font-black uppercase text-sky-800">{t("statReadingAvg")}</p>
          <p className="text-2xl font-black text-sky-950">
            {readingSummary.avgPercent > 0 ? `${readingSummary.avgPercent}%` : "—"}
          </p>
          {readingSummary.booksInProgress > 0 && (
            <p className="mt-1 text-[11px] font-semibold text-sky-700">
              {t("statReadingHint", {
                readers: readingSummary.activeReaders,
                books: readingSummary.booksInProgress,
              })}
            </p>
          )}
        </div>
      </div>

      <div className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/dashboard/enseignant/bibliotheque/classe"
          className="group flex items-center gap-4 rounded-2xl border border-slate-100 bg-white p-5 shadow-sm transition hover:shadow-md"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
            <BookOpen className="h-6 w-6" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-black text-slate-900">{t("readingTitle")}</p>
            <p className="text-sm text-slate-500">
              {readingSummary.booksInProgress > 0
                ? t("readingDescActive", {
                    readers: readingSummary.activeReaders,
                    books: readingSummary.booksInProgress,
                    avg: readingSummary.avgPercent,
                  })
                : t("readingDesc")}
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-slate-300 group-hover:text-teal-600" />
        </Link>
        <div className="rounded-2xl border border-teal-100 bg-teal-50/50 p-5">
          <div className="mb-3 flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-teal-100 text-teal-700">
              <Users className="h-6 w-6" />
            </div>
            <div>
              <p className="font-black text-slate-900">{t("studentsCount", { count: schoolChildren.length })}</p>
              <p className="text-sm text-slate-500">{t("studentsDesc")}</p>
            </div>
          </div>
          {schoolChildren.length > 0 && (
            <ul className="max-h-32 space-y-1 overflow-y-auto border-t border-teal-100 pt-3">
              {schoolChildren.slice(0, 12).map((child) => (
                <li
                  key={child.id}
                  className="flex items-center justify-between gap-2 text-sm font-semibold text-slate-700"
                >
                  <span className="truncate">{child.fullName}</span>
                  {child.educationLevel && (
                    <span className="shrink-0 rounded-full bg-white px-2 py-0.5 text-[10px] font-black uppercase text-teal-800">
                      {child.educationLevel}
                    </span>
                  )}
                </li>
              ))}
              {schoolChildren.length > 12 && (
                <li className="text-xs font-bold text-teal-700">
                  {t("studentsMore", { count: schoolChildren.length - 12 })}
                </li>
              )}
            </ul>
          )}
        </div>
      </div>

      <AtelierClasseClient rows={rows} attemptRows={attemptRows} teacherLevels={teacherLevels} unified />
    </div>
  );
}

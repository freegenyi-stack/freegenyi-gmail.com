"use client";

import React, { useTransition } from "react";
import { useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Bell, Clock, Download, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TeacherCourseDto } from "@/lib/teacher/workspace.server";
import { startTeacherCourseAction } from "@/lib/actions/teacher_workspace";
import DifficultyStars from "./DifficultyStars";
import { TeacherPageHeader } from "./TeacherShell";
import { toast } from "sonner";

function formatDuration(course: TeacherCourseDto, isAr: boolean): string {
  if (course.durationMinutes && course.durationMinutes > 0) {
    return isAr ? `${course.durationMinutes} د` : `${course.durationMinutes} min`;
  }
  if (course.durationLabel) return course.durationLabel;
  return isAr ? "—" : "—";
}

export default function TeacherTrainingClient({ courses }: { courses: TeacherCourseDto[] }) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("TeacherSpace.training");
  const isAr = locale.endsWith("-ar") || locale === "ar";
  const [pending, startTransition] = useTransition();

  const direct = courses.filter((c) => c.kind === "direct");
  const series = courses.filter((c) => c.kind === "series");

  const handleStart = (course: TeacherCourseDto) => {
    startTransition(async () => {
      const res = await startTeacherCourseAction(course.id);
      if ("error" in res && res.error) toast.error(t("progressError"));
      else if ("slug" in res && res.slug) router.push(`/dashboard/enseignant/formation/${res.slug}`);
    });
  };

  const certificateUrl = (courseId: number) =>
    `/api/teacher/courses/${courseId}/certificate?locale=${encodeURIComponent(locale)}`;

  const isCompleted = (course: TeacherCourseDto) => Boolean(course.certificateCode && course.completedAt);

  const metaRow = (course: TeacherCourseDto) => (
    <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-slate-500">
      <span className="inline-flex items-center gap-1">
        <DifficultyStars level={course.difficultyLevel} />
        <span className="text-slate-400">{t(`difficulty.${course.difficultyLevel}`)}</span>
      </span>
      <span className="inline-flex items-center gap-1">
        <Clock className="h-3.5 w-3.5" /> {formatDuration(course, isAr)}
      </span>
    </div>
  );

  return (
    <div>
      <TeacherPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} />

      {courses.length === 0 ? (
        <div className="rounded-2xl border-2 border-dashed border-slate-200 bg-slate-50 py-14 text-center">
          <p className="font-black text-slate-700">{t("emptyTitle")}</p>
          <p className="mx-auto mt-2 max-w-md text-sm text-slate-500">{t("emptyDesc")}</p>
        </div>
      ) : (
        <>
      <section className="mb-10">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">{t("directTitle")}</h2>
          <Badge variant="outline" className="font-bold">{t("directBadge")}</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          {direct.map((course) => (
            <Card key={course.id} className="border-slate-100 shadow-sm">
              <CardHeader className="pb-2">
                <div className="flex items-start justify-between gap-2">
                  <CardTitle className="text-sm font-black leading-snug">
                    {isAr ? course.titleAr : course.titleFr}
                  </CardTitle>
                  <Badge className="shrink-0 bg-emerald-600 hover:bg-emerald-600 text-[10px]">
                    {isAr ? course.tagAr : course.tagFr}
                  </Badge>
                </div>
                <div className="pt-2">{metaRow(course)}</div>
              </CardHeader>
              <CardContent className="flex flex-wrap items-center justify-end gap-2 pt-0">
                {isCompleted(course) && (
                  <>
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{t("completedBadge")}</Badge>
                    <a
                      href={certificateUrl(course.id)}
                      className="inline-flex items-center gap-1 rounded-lg border border-teal-200 bg-teal-50 px-3 py-1.5 text-xs font-bold text-teal-800 hover:bg-teal-100"
                    >
                      <Download className="h-3.5 w-3.5" /> {t("downloadCertificate")}
                    </a>
                  </>
                )}
                <Button
                  size="sm"
                  disabled={pending}
                  onClick={() => handleStart(course)}
                  className="rounded-lg bg-teal-600 hover:bg-teal-500 gap-1 font-bold"
                >
                  <Play className="h-3.5 w-3.5" /> {isCompleted(course) ? t("review") : t("start")}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-lg font-black text-slate-900">{t("seriesTitle")}</h2>
          <Badge variant="outline" className="gap-1 font-bold border-amber-200 bg-amber-50 text-amber-800">
            <Bell className="h-3 w-3" /> {t("seriesBadge")}
          </Badge>
        </div>
        <div className="space-y-4">
          {series.map((seriesItem) => {
            const pct = seriesItem.totalEpisodes
              ? Math.round((seriesItem.progressEpisode / seriesItem.totalEpisodes) * 100)
              : 0;
            return (
              <Card key={seriesItem.id} className="border-slate-100 shadow-sm overflow-hidden">
                <CardContent className="p-5">
                  <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0 flex-1">
                      <p className="font-black text-slate-900">
                        {isAr ? seriesItem.titleAr : seriesItem.titleFr}
                      </p>
                      <div className="mt-2">{metaRow(seriesItem)}</div>
                      <p className="mt-2 text-sm text-slate-500">
                        {t("episodeProgress", {
                          current: seriesItem.progressEpisode,
                          total: seriesItem.totalEpisodes,
                        })}
                      </p>
                      <div className="mt-3 h-2 w-full max-w-xs overflow-hidden rounded-full bg-slate-100">
                        <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${pct}%` }} />
                      </div>
                    </div>
                    <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                      <Button
                        disabled={pending}
                        onClick={() => handleStart(seriesItem)}
                        className="rounded-xl bg-emerald-600 hover:bg-emerald-500 font-bold"
                      >
                        {isCompleted(seriesItem)
                          ? t("review")
                          : seriesItem.progressEpisode > 0
                            ? t("continue")
                            : t("startSeries")}
                      </Button>
                      {isCompleted(seriesItem) && (
                        <a
                          href={certificateUrl(seriesItem.id)}
                          className="inline-flex items-center justify-center gap-1 rounded-xl border border-teal-200 bg-teal-50 px-4 py-2 text-sm font-bold text-teal-800 hover:bg-teal-100"
                        >
                          <Download className="h-4 w-4" /> {t("downloadCertificate")}
                        </a>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      </section>
        </>
      )}
    </div>
  );
}

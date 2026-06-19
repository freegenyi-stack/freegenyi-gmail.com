"use client";

import React, { useMemo, useState, useTransition } from "react";
import { Link, useRouter } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, CheckCircle2, Download, ExternalLink, Play } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { completeTeacherCourseEpisodeAction } from "@/lib/actions/teacher_workspace";
import { parseCourseContent } from "@/lib/teacher/course-content";
import type { TeacherCourseDto } from "@/lib/teacher/workspace.server";
import DifficultyStars from "./DifficultyStars";
import { toast } from "sonner";

type Props = {
  course: TeacherCourseDto;
};

export default function TeacherCoursePlayerClient({ course }: Props) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("TeacherSpace.training");
  const isAr = locale.endsWith("-ar") || locale === "ar";
  const [pending, startTransition] = useTransition();

  const content = useMemo(
    () =>
      parseCourseContent({
        externalUrl: course.externalUrl,
        kind: course.kind,
        totalEpisodes: course.totalEpisodes,
        titleFr: course.titleFr,
        titleAr: course.titleAr,
      }),
    [course]
  );

  const initialEpisode = Math.max(1, course.progressEpisode || 1);
  const [currentEpisode, setCurrentEpisode] = useState(
    Math.min(initialEpisode, content.episodes.length)
  );

  const episode = content.episodes[currentEpisode - 1];
  const title = isAr ? course.titleAr : course.titleFr;
  const episodeTitle = episode ? (isAr ? episode.titleAr : episode.titleFr) : title;
  const isLast = currentEpisode >= content.episodes.length;
  const pct = Math.round((Math.max(course.progressEpisode, currentEpisode) / content.episodes.length) * 100);

  const isCompleted = Boolean(course.certificateCode && course.completedAt);
  const certificateUrl = `/api/teacher/courses/${course.id}/certificate?locale=${encodeURIComponent(locale)}`;

  const markComplete = () => {
    startTransition(async () => {
      const res = await completeTeacherCourseEpisodeAction(course.id, currentEpisode, locale);
      if ("error" in res) {
        toast.error(t("progressError"));
        return;
      }
      if (res.completed) {
        toast.success(t("courseCompleted"));
        router.refresh();
        return;
      }
      toast.success(t("episodeCompleted"));
      setCurrentEpisode(res.nextEpisode);
      router.refresh();
    });
  };

  return (
    <div>
      <Link
        href="/dashboard/enseignant/formation"
        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-teal-700"
      >
        <ArrowLeft className="h-4 w-4" /> {t("backToCatalog")}
      </Link>

      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div>
          <h1 className="font-reem text-2xl font-black text-slate-900">{title}</h1>
          <p className="mt-1 text-sm font-bold text-slate-500">{episodeTitle}</p>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <Badge className="bg-teal-100 text-teal-800 hover:bg-teal-100">
              {isAr ? course.tagAr : course.tagFr}
            </Badge>
            <DifficultyStars level={course.difficultyLevel} />
            {course.kind === "series" && (
              <span className="text-xs font-bold text-slate-500">
                {t("episodeProgress", { current: currentEpisode, total: content.episodes.length })}
              </span>
            )}
            {isCompleted && (
              <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-100">{t("completedBadge")}</Badge>
            )}
          </div>
        </div>
        <div className="flex flex-col items-end gap-2">
          {isCompleted && (
            <a
              href={certificateUrl}
              className="inline-flex items-center gap-2 rounded-xl bg-teal-600 px-4 py-2 text-sm font-black text-white hover:bg-teal-500"
            >
              <Download className="h-4 w-4" /> {t("downloadCertificate")}
            </a>
          )}
          {course.kind === "series" && (
            <div className="w-full max-w-xs sm:w-48">
              <div className="h-2 overflow-hidden rounded-full bg-slate-100">
                <div className="h-full rounded-full bg-teal-500 transition-all" style={{ width: `${pct}%` }} />
              </div>
            </div>
          )}
        </div>
      </div>

      <Card className="mb-6 overflow-hidden border-slate-100 shadow-sm">
        <CardContent className="p-0">
          {episode?.embedUrl ? (
            <div className="aspect-video w-full bg-black">
              <iframe
                src={episode.embedUrl}
                title={episodeTitle}
                className="h-full w-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="flex aspect-video flex-col items-center justify-center gap-3 bg-slate-100 px-6 text-center">
              <Play className="h-12 w-12 text-slate-300" />
              <p className="max-w-md text-sm font-bold text-slate-600">{t("noVideoYet")}</p>
              <p className="text-xs text-slate-500">{t("noVideoHint")}</p>
            </div>
          )}
        </CardContent>
      </Card>

      {course.externalUrl && !episode?.embedUrl && course.externalUrl.startsWith("http") && (
        <a
          href={course.externalUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-teal-700 hover:underline"
        >
          <ExternalLink className="h-4 w-4" /> {t("openExternal")}
        </a>
      )}

      <div className="flex flex-wrap gap-3">
        {course.kind === "series" && currentEpisode > 1 && (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            className="rounded-xl font-bold"
            onClick={() => setCurrentEpisode((e) => Math.max(1, e - 1))}
          >
            {t("prevEpisode")}
          </Button>
        )}
        {course.kind === "series" && !isLast && (
          <Button
            type="button"
            variant="outline"
            disabled={pending}
            className="rounded-xl font-bold"
            onClick={() => setCurrentEpisode((e) => Math.min(content.episodes.length, e + 1))}
          >
            {t("nextEpisode")}
          </Button>
        )}
        <Button
          type="button"
          disabled={pending || isCompleted}
          onClick={markComplete}
          className="rounded-xl bg-emerald-600 font-black hover:bg-emerald-500"
        >
          <CheckCircle2 className="mr-2 h-4 w-4" />
          {isCompleted ? t("completedBadge") : isLast ? t("finishCourse") : t("markEpisodeDone")}
        </Button>
      </div>
    </div>
  );
}

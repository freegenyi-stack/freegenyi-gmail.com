"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ExternalLink, Maximize2, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import ActivityComposer from "@/components/activities/composer/ActivityComposer";
import ActivityImmersiveShell from "@/components/activities/ActivityImmersiveShell";
import ActivityWrapper from "@/components/activities/ActivityWrapper";
import AtelierResourceActions from "@/components/atelier/AtelierResourceActions";
import { markParentAtelierProgressAction } from "@/lib/actions/authoring";
import {
  activityLangFromLocale,
  buildDefaultEnvelope,
  parseActivityEnvelope,
  resolveActivityType,
} from "@/lib/activities/content";
import type { ActivityContentEnvelope, ActivityResult, ActivityType } from "@/types/activity";
import type { AuthoringFolderRow } from "@/lib/authoring/folders.server";
import type { AuthoringResourceRow } from "@/lib/authoring/types";
import type { TeacherSchoolChild } from "@/lib/library/books.server";
import { atelierAccentClasses, atelierAccentFromBackHref } from "@/lib/atelier/atelier-accent";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  resource: AuthoringResourceRow;
  backHref?: string;
  schoolChildren?: TeacherSchoolChild[];
  folders?: AuthoringFolderRow[];
  showActions?: boolean;
  teacherLevels?: string[];
  readOnly?: boolean;
  progressId?: number | null;
};

export default function AtelierActivityClient({
  resource,
  backHref = "/dashboard/enseignant/atelier",
  schoolChildren = [],
  folders = [],
  showActions = false,
  teacherLevels = [],
  readOnly = false,
  progressId = null,
}: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const locale = useLocale();
  const router = useRouter();
  const accent = atelierAccentFromBackHref(backHref);
  const ac = atelierAccentClasses(accent);
  const langue = activityLangFromLocale(locale);
  const progressStarted = useRef(false);
  const [mode, setMode] = useState<"composer" | "preview">(() => (readOnly ? "preview" : "composer"));
  const [immersive, setImmersive] = useState(() => readOnly);

  const activityType = resolveActivityType(
    parseActivityEnvelope(resource.contentJson)?.activityType,
    resource.h5pLibrary
  ) as ActivityType;

  const envelope = useMemo((): ActivityContentEnvelope => {
    const parsed = parseActivityEnvelope(resource.contentJson);
    if (parsed) return parsed;
    return buildDefaultEnvelope(activityType, resource.title, langue);
  }, [activityType, langue, resource.contentJson, resource.title]);

  useEffect(() => {
    if (!readOnly || !progressId || progressStarted.current) return;
    progressStarted.current = true;
    void markParentAtelierProgressAction(progressId, "in_progress");
  }, [readOnly, progressId]);

  const onComplete = useCallback(
    async (result: ActivityResult) => {
      if (readOnly && progressId) {
        const res = await markParentAtelierProgressAction(progressId, "done", result);
        if ("error" in res) toast.error(t("progressError"));
        else toast.success(t("submitSuccess"));
      }
      if (!readOnly) router.refresh();
    },
    [progressId, readOnly, router, t]
  );

  const tabs = readOnly
    ? [{ id: "preview" as const, icon: ExternalLink, label: t("tabPreview") }]
    : [
        { id: "composer" as const, icon: Pencil, label: t("tabComposer") },
        { id: "preview" as const, icon: ExternalLink, label: t("tabPreview") },
      ];

  if (immersive && readOnly) {
    return (
      <ActivityImmersiveShell
        envelope={envelope}
        langue={langue}
        activityId={resource.id}
        onComplete={onComplete}
        backHref={backHref}
        requireSubmit={readOnly && !!progressId}
      />
    );
  }

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={backHref}
          className={cn("inline-flex items-center gap-2 text-sm font-bold text-slate-500", ac.linkHover)}
        >
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>
        <div className="flex flex-wrap items-center gap-2">
          <Badge className={ac.badge}>{t("kindActivity")}</Badge>
          {readOnly && (
            <button
              type="button"
              onClick={() => setImmersive(true)}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-xs font-black text-white hover:bg-violet-500"
            >
              <Maximize2 className="h-4 w-4" /> {t("immersiveStart")}
            </button>
          )}
          {showActions && (
            <AtelierResourceActions
              resourceId={resource.id}
              resourceKind="activity"
              resourceTitle={resource.title}
              status={resource.status}
              tags={resource.tags}
              resourceSchoolLevel={resource.schoolLevel}
              schoolChildren={schoolChildren}
              teacherLevels={teacherLevels}
              folders={folders}
              locale={locale}
              ownerRole={backHref.includes("/parent/") ? "parent" : "enseignant"}
            />
          )}
        </div>
      </div>

      <h1 className="mb-4 font-reem text-2xl font-black text-slate-900">{resource.title}</h1>

      {readOnly && progressId && (
        <p className="mb-4 rounded-xl border border-violet-100 bg-violet-50 px-4 py-2 text-xs font-bold text-violet-800">
          {t("parentPlayHint")}
        </p>
      )}

      <div className="mb-4 flex flex-wrap gap-2">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            onClick={() => setMode(tab.id)}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black",
              mode === tab.id ? ac.tabActive : "bg-slate-100 text-slate-600"
            )}
          >
            <tab.icon className="h-4 w-4" /> {tab.label}
          </button>
        ))}
      </div>

      {mode === "composer" && !readOnly && (
        <ActivityComposer
          resourceId={resource.id}
          envelope={envelope}
          activityType={activityType}
          langue={langue}
        />
      )}

      {mode === "preview" && (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <ActivityWrapper
            envelope={envelope}
            langue={langue}
            activityId={resource.id}
            onComplete={onComplete}
            requireSubmit={readOnly && !!progressId}
          />
        </div>
      )}
    </div>
  );
}

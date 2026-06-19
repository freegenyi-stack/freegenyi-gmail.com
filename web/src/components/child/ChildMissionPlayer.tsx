"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useTranslations } from "next-intl";
import ActivityImmersiveShell from "@/components/activities/ActivityImmersiveShell";
import { markChildAtelierProgressAction } from "@/lib/actions/child-atelier";
import {
  activityLangFromLocale,
  buildDefaultEnvelope,
  parseActivityEnvelope,
  resolveActivityType,
} from "@/lib/activities/content";
import type { ActivityContentEnvelope, ActivityResult, ActivityType } from "@/types/activity";
import type { AuthoringResourceRow } from "@/lib/authoring/types";

type Props = {
  childId: number;
  progressId: number;
  resource: AuthoringResourceRow;
  locale: string;
};

export default function ChildMissionPlayer({ childId, progressId, resource, locale }: Props) {
  const t = useTranslations("TeacherSpace.atelier.childMissions");
  const langue = activityLangFromLocale(locale);
  const started = useRef(false);

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
    if (started.current) return;
    started.current = true;
    void markChildAtelierProgressAction(progressId, childId, "in_progress");
  }, [childId, progressId]);

  const onComplete = useCallback(
    (result: ActivityResult) => {
      void markChildAtelierProgressAction(progressId, childId, "done", result);
    },
    [childId, progressId]
  );

  return (
    <div>
      <Link
        href={`/lobby/${childId}/missions`}
        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>
      <ActivityImmersiveShell
        envelope={envelope}
        langue={langue}
        activityId={resource.id}
        onComplete={onComplete}
        backHref={`/lobby/${childId}/missions`}
        requireSubmit
      />
    </div>
  );
}

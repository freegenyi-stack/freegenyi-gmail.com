"use client";

import React, { useCallback, useMemo, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowLeft } from "lucide-react";
import ActivityImmersiveShell from "@/components/activities/ActivityImmersiveShell";
import { submitMurActivityAttemptAction } from "@/lib/actions/activity-attempts";
import {
  activityLangFromLocale,
  buildDefaultEnvelope,
  parseActivityEnvelope,
  resolveActivityType,
} from "@/lib/activities/content";
import type { ActivityContentEnvelope, ActivityResult, ActivityType } from "@/types/activity";
import { toast } from "sonner";

type ChildOption = { id: number; fullName: string };

type Props = {
  shareId: number;
  shareTitle: string;
  contentJson: string | null;
  h5pLibrary: string | null;
  resourceId: number;
  resourceTitle: string;
  locale: string;
  children: ChildOption[];
};

export default function MurActivityPlayClient({
  shareId,
  shareTitle,
  contentJson,
  h5pLibrary,
  resourceId,
  resourceTitle,
  locale,
  children,
}: Props) {
  const t = useTranslations("PedagogyWall");
  const langue = activityLangFromLocale(locale);
  const [childId, setChildId] = useState<number>(children[0]?.id ?? 0);
  const [playing, setPlaying] = useState(false);

  const activityType = resolveActivityType(
    parseActivityEnvelope(contentJson)?.activityType,
    h5pLibrary
  ) as ActivityType;

  const envelope = useMemo((): ActivityContentEnvelope => {
    const parsed = parseActivityEnvelope(contentJson);
    if (parsed) return parsed;
    return buildDefaultEnvelope(activityType, resourceTitle || shareTitle, langue);
  }, [activityType, contentJson, langue, resourceTitle, shareTitle]);

  const onComplete = useCallback(
    async (result: ActivityResult) => {
      if (!childId) {
        toast.error(t("playSelectChild"));
        return;
      }
      const res = await submitMurActivityAttemptAction({ shareId, childId, result });
      if ("error" in res) {
        if (res.error === "forbidden") toast.error(t("playForbidden"));
        else toast.error(t("playSubmitError"));
        return;
      }
      toast.success(t("playSubmitSuccess"));
    },
    [childId, shareId, t]
  );

  if (children.length === 0) {
    return (
      <div className="rounded-2xl border border-amber-200 bg-amber-50 p-6 text-center">
        <p className="font-bold text-amber-900">{t("playNoChildren")}</p>
        <Link href="/dashboard/parent/mur" className="mt-4 inline-block text-sm font-bold text-orange-700">
          {t("playBack")}
        </Link>
      </div>
    );
  }

  if (playing) {
    return (
      <ActivityImmersiveShell
        envelope={envelope}
        langue={langue}
        activityId={resourceId}
        onComplete={onComplete}
        backHref={`/dashboard/parent/mur/jouer/${shareId}`}
        requireSubmit
      />
    );
  }

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/parent/mur"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 hover:text-orange-700"
      >
        <ArrowLeft className="h-4 w-4" /> {t("playBack")}
      </Link>

      <div>
        <h1 className="text-2xl font-black text-slate-900">{shareTitle}</h1>
        <p className="mt-2 text-sm text-slate-600">{t("playIntro")}</p>
      </div>

      <label className="block">
        <span className="text-xs font-black uppercase text-slate-500">{t("playSelectChildLabel")}</span>
        <select
          value={childId}
          onChange={(e) => setChildId(Number(e.target.value))}
          className="mt-2 w-full rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm font-bold text-slate-900"
        >
          {children.map((c) => (
            <option key={c.id} value={c.id}>
              {c.fullName}
            </option>
          ))}
        </select>
      </label>

      <button
        type="button"
        onClick={() => setPlaying(true)}
        className="w-full rounded-2xl bg-orange-500 px-6 py-4 text-lg font-black text-white hover:bg-orange-400"
      >
        {t("playStart")}
      </button>
    </div>
  );
}

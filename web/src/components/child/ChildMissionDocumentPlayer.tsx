"use client";

import React, { useCallback, useEffect, useRef, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";
import TipTapDocumentEditor from "@/components/atelier/TipTapDocumentEditor";
import { markChildAtelierProgressAction } from "@/lib/actions/child-atelier";
import type { AuthoringResourceRow, SchoolHeaderInfo } from "@/lib/authoring/types";
import { toast } from "sonner";

type Props = {
  childId: number;
  progressId: number;
  resource: AuthoringResourceRow;
  header: SchoolHeaderInfo;
};

export default function ChildMissionDocumentPlayer({ childId, progressId, resource, header }: Props) {
  const t = useTranslations("TeacherSpace.atelier.childMissions");
  const started = useRef(false);
  const [pending, startTransition] = useTransition();

  useEffect(() => {
    if (started.current) return;
    started.current = true;
    void markChildAtelierProgressAction(progressId, childId, "in_progress");
  }, [childId, progressId]);

  const markDone = useCallback(() => {
    startTransition(async () => {
      const res = await markChildAtelierProgressAction(progressId, childId, "done");
      if ("error" in res) toast.error(t("progressError"));
      else toast.success(t("documentDone"));
    });
  }, [childId, progressId, t]);

  return (
    <div>
      <Link
        href={`/lobby/${childId}/missions`}
        className="mb-4 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> {t("back")}
      </Link>
      <h1 className="mb-4 font-jakarta text-2xl font-black">{resource.title}</h1>
      <div className="mb-4 overflow-hidden rounded-2xl border border-white/10 bg-white text-slate-900">
        <TipTapDocumentEditor initialJson={resource.contentJson} header={header} readOnly placeholder="" />
      </div>
      <button
        type="button"
        disabled={pending}
        onClick={markDone}
        className="inline-flex w-full items-center justify-center gap-2 rounded-2xl bg-emerald-600 px-6 py-4 text-sm font-black text-white hover:bg-emerald-500 disabled:opacity-60"
      >
        <CheckCircle2 className="h-5 w-5" /> {t("markRead")}
      </button>
    </div>
  );
}

"use client";

import React, { useCallback, useEffect, useRef, useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, CheckCircle2, Download, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import TipTapDocumentEditor from "@/components/atelier/TipTapDocumentEditor";
import AtelierResourceActions from "@/components/atelier/AtelierResourceActions";
import { markParentAtelierProgressAction, saveAtelierDocumentAction } from "@/lib/actions/authoring";
import type { AuthoringFolderRow } from "@/lib/authoring/folders.server";
import type { AuthoringResourceRow, SchoolHeaderInfo } from "@/lib/authoring/types";
import type { TeacherSchoolChild } from "@/lib/library/books.server";
import { atelierAccentFromBackHref } from "@/lib/atelier/atelier-accent";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type Props = {
  resource: AuthoringResourceRow;
  header: SchoolHeaderInfo;
  backHref?: string;
  readOnly?: boolean;
  schoolChildren?: TeacherSchoolChild[];
  folders?: AuthoringFolderRow[];
  showActions?: boolean;
  teacherLevels?: string[];
  progressId?: number | null;
};

export default function AtelierDocumentClient({
  resource,
  header,
  backHref = "/dashboard/enseignant/atelier",
  readOnly = false,
  schoolChildren = [],
  folders = [],
  showActions = false,
  teacherLevels = [],
  progressId = null,
}: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const locale = useLocale();
  const accent = atelierAccentFromBackHref(backHref);
  const [title, setTitle] = useState(resource.title);
  const [contentJson, setContentJson] = useState(resource.contentJson);
  const [pending, startTransition] = useTransition();
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const progressStarted = useRef(false);

  useEffect(() => {
    if (!readOnly || !progressId || progressStarted.current) return;
    progressStarted.current = true;
    void markParentAtelierProgressAction(progressId, "in_progress");
  }, [readOnly, progressId]);

  const markDocumentDone = useCallback(() => {
    if (!progressId) return;
    startTransition(async () => {
      const res = await markParentAtelierProgressAction(progressId, "done");
      if ("error" in res) toast.error(t("progressError"));
      else toast.success(t("documentReadDone"));
    });
  }, [progressId, t]);

  const persist = useCallback(
    (json: string, nextTitle?: string) => {
      startTransition(async () => {
        const res = await saveAtelierDocumentAction(resource.id, json, nextTitle);
        if ("error" in res) toast.error(t("saveError"));
      });
    },
    [resource.id, t]
  );

  const handleContentChange = (json: string) => {
    setContentJson(json);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(json, title), 1500);
  };

  useEffect(() => {
    return () => {
      if (saveTimer.current) clearTimeout(saveTimer.current);
    };
  }, []);

  const saveNow = () => {
    startTransition(async () => {
      const res = await saveAtelierDocumentAction(resource.id, contentJson, title);
      if ("error" in res) toast.error(t("saveError"));
      else toast.success(t("saved"));
    });
  };

  return (
    <div>
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <Link
          href={backHref}
          className={cn(
            "inline-flex items-center gap-2 text-sm font-bold text-slate-500",
            accent === "parent" ? "hover:text-orange-700" : "hover:text-violet-700"
          )}
        >
          <ArrowLeft className="h-4 w-4" /> {t("back")}
        </Link>
        <div className="flex flex-col gap-2 sm:items-end">
          <div className="flex flex-wrap gap-2">
            {!readOnly && (
              <>
                <a
                  href={`/api/authoring/resources/${resource.id}/export?format=pdf`}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5" /> PDF
                </a>
                <a
                  href={`/api/authoring/resources/${resource.id}/export?format=docx`}
                  className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50"
                >
                  <Download className="h-3.5 w-3.5" /> Word
                </a>
                <Button disabled={pending} onClick={saveNow} className="rounded-xl gap-1 bg-violet-600 font-black">
                  <Save className="h-4 w-4" /> {t("save")}
                </Button>
              </>
            )}
            {readOnly && (
              <a
                href={`/api/authoring/resources/${resource.id}/export?format=pdf`}
                className="inline-flex items-center gap-1 rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs font-bold hover:bg-slate-50"
              >
                <Download className="h-3.5 w-3.5" /> PDF
              </a>
            )}
          </div>
          {showActions && (
            <AtelierResourceActions
              resourceId={resource.id}
              resourceKind="document"
              resourceTitle={title}
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

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        onBlur={() => !readOnly && persist(contentJson, title)}
        readOnly={readOnly}
        className="mb-4 w-full rounded-xl border border-slate-200 px-4 py-3 text-lg font-black text-slate-900 read-only:bg-slate-50"
      />

      {readOnly && progressId && (
        <div className="mb-4 flex flex-wrap items-center gap-3 rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
          <p className="flex-1 text-xs font-bold text-violet-800">{t("parentDocumentHint")}</p>
          <Button
            type="button"
            disabled={pending}
            onClick={markDocumentDone}
            className="rounded-xl bg-emerald-600 text-xs font-black hover:bg-emerald-500"
          >
            <CheckCircle2 className="mr-1 h-4 w-4" /> {t("markDocumentDone")}
          </Button>
        </div>
      )}

      <TipTapDocumentEditor
        initialJson={contentJson}
        onChange={readOnly ? undefined : handleContentChange}
        header={header}
        placeholder={t("editorPlaceholder")}
        readOnly={readOnly}
      />
    </div>
  );
}

"use client";

import React, { useCallback, useMemo, useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ChevronDown, Download, FileCode2, ImageIcon, LayoutTemplate, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AtelierResourceActions from "@/components/atelier/AtelierResourceActions";
import TeacherNavDrawer from "@/components/teacher/TeacherNavDrawer";
import type { MindmapEditorHandle } from "@/components/atelier/AtelierMindmapEditor";
import { saveAtelierMindmapAction } from "@/lib/actions/authoring";
import { parseMindmapContent } from "@/lib/authoring/mindmap-content";
import { buildMindmapJson, MINDMAP_TEMPLATES } from "@/lib/authoring/mindmap-templates";
import type { AuthoringFolderRow } from "@/lib/authoring/folders.server";
import type { AuthoringResourceRow } from "@/lib/authoring/types";
import type { TeacherSchoolChild } from "@/lib/library/books.server";
import { atelierAccentClasses, atelierAccentFromBackHref } from "@/lib/atelier/atelier-accent";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AtelierMindmapEditor = dynamic(() => import("@/components/atelier/AtelierMindmapEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] items-center justify-center bg-[#f8fafc]">
      <p className="text-sm font-bold text-slate-500">…</p>
    </div>
  ),
});

type Props = {
  resource: AuthoringResourceRow;
  backHref?: string;
  schoolChildren?: TeacherSchoolChild[];
  folders?: AuthoringFolderRow[];
  showActions?: boolean;
  teacherLevels?: string[];
  readOnly?: boolean;
};

export default function AtelierMindmapClient({
  resource,
  backHref = "/dashboard/enseignant/atelier",
  schoolChildren = [],
  folders = [],
  showActions = true,
  teacherLevels = [],
  readOnly = false,
}: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const locale = useLocale();
  const accent = atelierAccentFromBackHref(backHref);
  const ac = atelierAccentClasses(accent);
  const isParent = accent === "parent";
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const isAr = isRTL;
  const [title, setTitle] = useState(resource.title);
  const [contentJson, setContentJson] = useState(resource.contentJson);
  const parsedContent = useMemo(
    () => parseMindmapContent(contentJson, title),
    [contentJson, title]
  );
  const [editorKey, setEditorKey] = useState(0);
  const [showResourcePanel, setShowResourcePanel] = useState(false);
  const [pending, startTransition] = useTransition();
  const editorRef = useRef<MindmapEditorHandle | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const exportBaseName = () =>
    title.replace(/[^\w\s-àâäéèêëïîôùûüç]/gi, "").trim() || "carte-mentale";

  const persist = useCallback(
    (json: string, nextTitle?: string) => {
      startTransition(async () => {
        const res = await saveAtelierMindmapAction(resource.id, json, nextTitle);
        if ("error" in res) toast.error(t("saveError"));
      });
    },
    [resource.id, t]
  );

  const handleContentChange = (json: string) => {
    if (readOnly) return;
    setContentJson(json);
    if (saveTimer.current) clearTimeout(saveTimer.current);
    saveTimer.current = setTimeout(() => persist(json, title), 1800);
  };

  const handleSaveNow = () => {
    if (saveTimer.current) clearTimeout(saveTimer.current);
    persist(contentJson, title);
    toast.success(t("saved"));
  };

  const applyTemplate = (templateId: string) => {
    const json = buildMindmapJson(title, templateId, { isAr, mode: parsedContent.mode });
    setContentJson(json);
    setEditorKey((k) => k + 1);
    persist(json, title);
    toast.success(t("mindmapTemplateApplied"));
  };

  return (
    <div className={cn("flex h-[calc(100dvh-var(--header-height,72px))] flex-col", isParent && "bg-[#FFFBF7]")}>
      <header
        className={cn(
          "sticky top-0 z-20 flex h-14 shrink-0 items-center gap-2 border-b px-3 shadow-sm sm:gap-3 sm:px-4",
          isParent ? "border-orange-100/90 bg-[#FFFBF7]" : "border-slate-200/90 bg-white"
        )}
      >
        {!readOnly && !isParent && <TeacherNavDrawer variant="logo" />}

        <Link
          href={backHref}
          title={t("back")}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg text-slate-500 transition hover:bg-slate-100 hover:text-slate-800"
        >
          <ArrowLeft className={cn("h-4 w-4", isRTL && "rotate-180")} />
        </Link>

        <div className="hidden h-7 w-px shrink-0 bg-slate-200 sm:block" />

        <div className="min-w-0 flex-1 px-1 sm:px-2">
          <input
            value={title}
            onChange={(e) => !readOnly && setTitle(e.target.value)}
            onBlur={() => !readOnly && persist(contentJson, title)}
            readOnly={readOnly}
            className={cn(
              "w-full truncate border-0 bg-transparent text-center text-sm font-semibold text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-0 sm:text-base",
              readOnly && "cursor-default"
            )}
            aria-label={t("titlePlaceholder")}
            placeholder={t("titlePlaceholder")}
          />
        </div>

        <div className="hidden shrink-0 rounded-full bg-slate-100 px-2.5 py-1 text-[10px] font-black uppercase text-slate-600 sm:block">
          {parsedContent.mode === "markmap" ? t("mindmapModeMarkmap") : t("mindmapModeExcalidraw")}
        </div>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {!readOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="hidden h-9 rounded-lg border-indigo-200 bg-indigo-50 px-2.5 font-bold text-indigo-900 hover:bg-indigo-100 sm:inline-flex"
                >
                  <LayoutTemplate className="mr-1.5 h-4 w-4" />
                  {t("mindmapApplyTemplate")}
                  <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px]">
                {MINDMAP_TEMPLATES.map((tpl) => (
                  <DropdownMenuItem
                    key={tpl.id}
                    onClick={() => applyTemplate(tpl.id)}
                    className="cursor-pointer font-semibold"
                  >
                    {isAr ? tpl.titleAr : tpl.titleFr}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!readOnly && (
            <Button
              type="button"
              variant="ghost"
              size="sm"
              disabled={pending}
              onClick={handleSaveNow}
              className="hidden h-9 rounded-lg px-3 font-bold text-slate-700 hover:bg-slate-100 sm:inline-flex"
            >
              <Save className="mr-1.5 h-4 w-4" />
              {t("save")}
            </Button>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                className={cn("h-9 rounded-lg px-3 font-bold text-white shadow-sm", ac.btnPrimary)}
              >
                <Download className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">{t("mindmapExport")}</span>
                <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-80" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuItem
                onClick={() => {
                  const api = editorRef.current;
                  if (!api) {
                    toast.error(t("mindmapExportError"));
                    return;
                  }
                  void api.exportPng(exportBaseName());
                }}
                className="cursor-pointer font-semibold"
              >
                <ImageIcon className="mr-2 h-4 w-4 text-slate-600" />
                {t("mindmapExportPng")}
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => {
                  const api = editorRef.current;
                  if (!api) {
                    toast.error(t("mindmapExportError"));
                    return;
                  }
                  api.exportSvg(exportBaseName());
                }}
                className="cursor-pointer font-semibold"
              >
                <FileCode2 className="mr-2 h-4 w-4 text-slate-600" />
                {parsedContent.mode === "markmap" ? t("mindmapExportSvg") : t("mindmapExportScene")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AtelierMindmapEditor
          key={editorKey}
          resourceId={resource.id}
          locale={locale}
          initialJson={contentJson}
          readOnly={readOnly}
          onChange={handleContentChange}
          onReady={(api) => {
            editorRef.current = api;
          }}
        />
      </div>

      {showActions && !readOnly && (
        <div className={cn("shrink-0 border-t", isParent ? "border-orange-100/90 bg-[#FFFBF7]" : "border-slate-200/90 bg-white")}>
          <button
            type="button"
            onClick={() => setShowResourcePanel((v) => !v)}
            className={cn(
              "flex w-full items-center justify-between px-4 py-2.5 text-left text-xs font-black uppercase tracking-wider text-slate-500 transition",
              ac.panelHover
            )}
          >
            <span className="flex items-center gap-2">
              <Image src="/assets/img/logo.png" alt="" width={16} height={16} className="h-4 w-4 opacity-60" />
              {t("mindmapResourcePanel")}
            </span>
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", showResourcePanel && "rotate-180")}
            />
          </button>
          {showResourcePanel && (
            <div className="border-t border-slate-100 px-4 py-4">
              <AtelierResourceActions
                resourceId={resource.id}
                resourceKind="mindmap"
                resourceTitle={title}
                status={resource.status}
                tags={resource.tags}
                schoolChildren={schoolChildren}
                teacherLevels={teacherLevels}
                resourceSchoolLevel={resource.schoolLevel}
                folders={folders}
                locale={locale}
                allowAssign
                showMur
              />
            </div>
          )}
        </div>
      )}
    </div>
  );
}

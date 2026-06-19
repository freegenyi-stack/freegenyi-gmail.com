"use client";

import React, { useCallback, useRef, useState, useTransition } from "react";
import dynamic from "next/dynamic";
import Image from "next/image";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, ChevronDown, Download, FileCode2, ImageIcon, LayoutTemplate, Maximize2, Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AtelierResourceActions from "@/components/atelier/AtelierResourceActions";
import TeacherNavDrawer from "@/components/teacher/TeacherNavDrawer";
import type { VisualEditorStore } from "@/components/atelier/AtelierVisualEditor";
import { saveAtelierVisualAction } from "@/lib/actions/authoring";
import { buildVisualStoreJson, VISUAL_TEMPLATES } from "@/lib/authoring/visual-templates";
import { applyVisualJsonToStore } from "@/lib/authoring/visual-store-init";
import { visualFormatById } from "@/lib/authoring/visual-formats";
import type { AuthoringFolderRow } from "@/lib/authoring/folders.server";
import type { AuthoringResourceRow } from "@/lib/authoring/types";
import type { TeacherSchoolChild } from "@/lib/library/books.server";
import { atelierAccentClasses, atelierAccentFromBackHref } from "@/lib/atelier/atelier-accent";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

const AtelierVisualEditor = dynamic(() => import("@/components/atelier/AtelierVisualEditor"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full min-h-[420px] items-center justify-center bg-[#f0f2f5]">
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

export default function AtelierVisualClient({
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
  const [title, setTitle] = useState(resource.title);
  const [contentJson, setContentJson] = useState(resource.contentJson);
  const [showResourcePanel, setShowResourcePanel] = useState(false);
  const [pending, startTransition] = useTransition();
  const storeRef = useRef<VisualEditorStore | null>(null);
  const saveTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const exportBaseName = () =>
    title.replace(/[^\w\s-àâäéèêëïîôùûüç]/gi, "").trim() || "affiche";

  const requireStore = () => {
    const store = storeRef.current;
    if (!store) {
      toast.error(t("visualExportError"));
      return null;
    }
    return store;
  };

  const persist = useCallback(
    (json: string, nextTitle?: string) => {
      startTransition(async () => {
        const res = await saveAtelierVisualAction(resource.id, json, nextTitle);
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

  const handleExportPdf = () => {
    const store = requireStore();
    if (!store) return;
    void store.saveAsPDF({ fileName: `${exportBaseName()}.pdf` });
  };

  const handleExportPng = () => {
    const store = requireStore();
    if (!store) return;
    const base = exportBaseName();
    store.pages.forEach((page, index) => {
      const suffix = store.pages.length > 1 ? `-${index + 1}` : "";
      void store.saveAsImage({ pageId: page.id, fileName: `${base}${suffix}.png` });
    });
  };

  const handleExportSvg = () => {
    const store = requireStore();
    if (!store) return;
    const base = exportBaseName();
    store.pages.forEach((page, index) => {
      const suffix = store.pages.length > 1 ? `-${index + 1}` : "";
      void store.saveAsSVG({ pageId: page.id, fileName: `${base}${suffix}.svg` });
    });
  };

  const applyFreegenyTemplate = (templateId: string) => {
    const store = storeRef.current;
    if (!store) {
      toast.error(t("visualExportError"));
      return;
    }
    const fmt = visualFormatById(
      VISUAL_TEMPLATES.find((x) => x.id === templateId)?.defaultFormatId ?? "a4-portrait"
    );
    const json = buildVisualStoreJson(title, templateId, {
      isAr: locale.startsWith("ar") || locale.endsWith("-ar"),
      formatId: fmt.id,
    });
    applyVisualJsonToStore(store, json);
    setContentJson(json);
    persist(json, title);
    toast.success(t("visualTemplateApplied"));
  };

  return (
    <div
      className={cn(
        "flex h-[calc(100dvh-var(--header-height,72px))] flex-col",
        isParent && "bg-[#FFFBF7]"
      )}
    >
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

        <Button
          type="button"
          variant="ghost"
          size="sm"
          onClick={() => storeRef.current?.openSidePanel("size")}
          className="hidden h-9 shrink-0 rounded-lg px-2.5 font-bold text-slate-600 hover:bg-slate-100 lg:inline-flex"
          title={t("visualFormatHint")}
        >
          <Maximize2 className="mr-1.5 h-4 w-4" />
          {t("visualFormatHint")}
        </Button>

        <div className="flex shrink-0 items-center gap-1 sm:gap-2">
          {!readOnly && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  className="hidden h-9 rounded-lg border-violet-200 bg-violet-50 px-2.5 font-bold text-violet-900 hover:bg-violet-100 sm:inline-flex"
                >
                  <LayoutTemplate className="mr-1.5 h-4 w-4" />
                  {t("visualApplyTemplate")}
                  <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-70" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-[200px]">
                {VISUAL_TEMPLATES.map((tpl) => (
                  <DropdownMenuItem
                    key={tpl.id}
                    onClick={() => applyFreegenyTemplate(tpl.id)}
                    className="cursor-pointer font-semibold"
                  >
                    {locale.startsWith("ar") || locale.endsWith("-ar") ? tpl.titleAr : tpl.titleFr}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}

          {!readOnly && (
            <>
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
              <Button
                type="button"
                variant="ghost"
                size="sm"
                disabled={pending}
                onClick={handleSaveNow}
                className="h-9 w-9 rounded-lg p-0 text-slate-700 hover:bg-slate-100 sm:hidden"
                aria-label={t("save")}
              >
                <Save className="h-4 w-4" />
              </Button>
            </>
          )}

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                type="button"
                size="sm"
                className={cn("h-9 rounded-lg px-3 font-bold text-white shadow-sm", ac.btnPrimary)}
              >
                <Download className="mr-1.5 h-4 w-4" />
                <span className="hidden sm:inline">{t("visualExport")}</span>
                <ChevronDown className="ml-1 h-3.5 w-3.5 opacity-80" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-[180px]">
              <DropdownMenuItem onClick={handleExportPdf} className="cursor-pointer font-semibold">
                <Download className={cn("mr-2 h-4 w-4", ac.btnPrimaryText)} />
                {t("visualExportPdf")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportPng} className="cursor-pointer font-semibold">
                <ImageIcon className="mr-2 h-4 w-4 text-slate-600" />
                {t("visualExportPng")}
              </DropdownMenuItem>
              <DropdownMenuItem onClick={handleExportSvg} className="cursor-pointer font-semibold">
                <FileCode2 className="mr-2 h-4 w-4 text-slate-600" />
                {t("visualExportSvg")}
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>

      <div className="relative min-h-0 flex-1 overflow-hidden">
        <AtelierVisualEditor
          resourceId={resource.id}
          locale={locale}
          initialJson={resource.contentJson}
          fullHeight
          onChange={handleContentChange}
          onReady={(store) => {
            storeRef.current = store;
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
              {t("visualResourcePanel")}
            </span>
            <ChevronDown
              className={cn("h-4 w-4 transition-transform", showResourcePanel && "rotate-180")}
            />
          </button>
          {showResourcePanel && (
            <div className="border-t border-slate-100 px-4 py-4">
              <AtelierResourceActions
                resourceId={resource.id}
                resourceKind="visual"
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

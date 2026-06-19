"use client";

import React, { useMemo, useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import {
  FileText,
  Gamepad2,
  GitBranch,
  LayoutTemplate,
  Plus,
  Search,
  FolderPlus,
  Pencil,
  Trash2,
  Users,
  Wand2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { TEACHER_TEMPLATES } from "@/constants/teacher-templates";
import { VISUAL_TEMPLATES, visualTemplateDefaultFormat } from "@/lib/authoring/visual-templates";
import { MINDMAP_TEMPLATES } from "@/lib/authoring/mindmap-templates";
import { VISUAL_PAGE_FORMATS } from "@/lib/authoring/visual-formats";
import { ATELIER_ACTIVITY_PATH } from "@/lib/authoring/h5p-config";
import { ATELIER_MINDMAP_PATH, ATELIER_VISUAL_PATH, atelierResourceEditPath } from "@/lib/authoring/visual-config";
import type { AuthoringResourceDto } from "@/lib/authoring/types";
import {
  createAtelierDocumentAction,
  createAtelierVisualAction,
  createAtelierMindmapAction,
  createAtelierFolderAction,
  createAtelierActivityAction,
  deleteAtelierFolderAction,
  deleteAtelierResourceAction,
  bulkAtelierResourcesAction,
  renameAtelierFolderAction,
} from "@/lib/actions/authoring";
import { ACTIVITY_TYPES } from "@/lib/activities/constants";
import { ACTIVITY_TEMPLATES } from "@/lib/activities/templates";
import { TeacherPageHeader } from "@/components/teacher/TeacherShell";
import { ParentPageHeader } from "@/components/parent/ParentShell";
import { cn } from "@/lib/utils";
import AtelierResourceActions from "@/components/atelier/AtelierResourceActions";
import AtelierSchoolBanner from "@/components/atelier/AtelierSchoolBanner";
import type { AuthoringAssignmentRow } from "@/lib/authoring/assignments.server";
import type { AuthoringFolderRow } from "@/lib/authoring/folders.server";
import type { TeacherSchoolChild } from "@/lib/library/books.server";
import AtelierActivityTypePicker from "@/components/atelier/AtelierActivityTypePicker";
import { toast } from "sonner";

type Props = {
  resources: AuthoringResourceDto[];
  schoolChildren?: TeacherSchoolChild[];
  folders?: AuthoringFolderRow[];
  assignments?: AuthoringAssignmentRow[];
  mode?: "enseignant" | "parent";
  teacherLevels?: string[];
  hasSchool?: boolean;
  basePath?: string;
  exploreMode?: boolean;
};

export default function AtelierHubClient({
  resources,
  schoolChildren = [],
  folders = [],
  assignments = [],
  mode = "enseignant",
  teacherLevels = [],
  hasSchool = false,
  basePath: basePathProp,
  exploreMode = false,
}: Props) {
  const locale = useLocale();
  const router = useRouter();
  const t = useTranslations("TeacherSpace.atelier");
  const isAr = locale.endsWith("-ar") || locale === "ar";
  const isTeacher = mode === "enseignant";
  const basePath =
    basePathProp ?? (isTeacher ? "/dashboard/enseignant/atelier" : "/dashboard/parent/atelier");
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [tab, setTab] = useState<"all" | "document" | "visual" | "mindmap" | "h5p" | "published" | "archived">("all");
  const [folderFilter, setFolderFilter] = useState<number | "all" | "none">("all");
  const [showCreate, setShowCreate] = useState<"document" | "visual" | "mindmap" | "activity" | "activityExpert" | null>(null);
  const [showFolderModal, setShowFolderModal] = useState<"create" | "rename" | null>(null);
  const [folderEditId, setFolderEditId] = useState<number | null>(null);
  const [folderName, setFolderName] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<number>>(new Set());

  const [title, setTitle] = useState("");
  const [templateId, setTemplateId] = useState("t1");
  const [visualTemplateId, setVisualTemplateId] = useState("v0");
  const [mindmapTemplateId, setMindmapTemplateId] = useState("m0");
  const [mindmapEditorMode, setMindmapEditorMode] = useState<"excalidraw" | "markmap">("excalidraw");
  const [visualFormatId, setVisualFormatId] = useState("a4-portrait");
  const [subject, setSubject] = useState("");
  const [schoolLevel, setSchoolLevel] = useState("");
  const [activityType, setActivityType] = useState<string>(ACTIVITY_TYPES[0]?.id ?? "QCM");

  const activityPickerTypes = useMemo(
    () =>
      ACTIVITY_TYPES.filter((t) => !t.comingSoon).map((item) => ({
        machineName: item.id,
        title: isAr ? item.labelAr : item.labelFr,
        description: isAr ? item.descriptionAr : item.descriptionFr,
        lucideIcon: item.icon,
        installed: true,
      })),
    [isAr]
  );
  const assistantTypes = useMemo(
    () => activityPickerTypes.filter((t) => ["QCM", "VRAI_FAUX", "FLASHCARDS"].includes(t.machineName)),
    [activityPickerTypes]
  );
  const pickerTypes = showCreate === "activityExpert" ? activityPickerTypes : assistantTypes;

  const filtered = useMemo(() => {
    let list = resources;
    if (tab === "published") list = list.filter((r) => r.status === "published");
    else if (tab === "archived") list = list.filter((r) => r.status === "archived");
    else if (tab !== "all") {
      list = list.filter((r) => {
        if (tab === "h5p") return r.kind === "activity" || r.kind === "h5p";
        if (tab === "visual") return r.kind === "visual";
        if (tab === "mindmap") return r.kind === "mindmap";
        return r.kind === tab;
      });
    }
    if (folderFilter === "none") list = list.filter((r) => !r.folderId);
    else if (folderFilter !== "all") list = list.filter((r) => r.folderId === folderFilter);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (r) =>
          r.title.toLowerCase().includes(q) ||
          (r.subject ?? "").toLowerCase().includes(q) ||
          (r.tags ?? "").toLowerCase().includes(q) ||
          r.resourceType.toLowerCase().includes(q)
      );
    }
    return list;
  }, [resources, tab, query, folderFilter]);

  const submitDocument = () => {
    if (!title.trim()) {
      toast.error(t("titleRequired"));
      return;
    }
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("templateId", templateId);
    fd.set("subject", subject);
    fd.set("schoolLevel", schoolLevel);
    startTransition(async () => {
      const res = await createAtelierDocumentAction(fd);
      if ("error" in res) {
        toast.error(t("createError"));
        return;
      }
      toast.success(t("docCreated"));
      setShowCreate(null);
      setTitle("");
      window.location.href = `/${locale}${basePath}/document/${res.id}`;
    });
  };

  const submitVisual = () => {
    if (!title.trim()) {
      toast.error(t("titleRequired"));
      return;
    }
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("templateId", visualTemplateId);
    fd.set("formatId", visualFormatId);
    fd.set("subject", subject);
    fd.set("schoolLevel", schoolLevel);
    fd.set("locale", locale);
    startTransition(async () => {
      const res = await createAtelierVisualAction(fd);
      if ("error" in res) {
        toast.error(t("createError"));
        return;
      }
      toast.success(t("visualCreated"));
      setShowCreate(null);
      setTitle("");
      window.location.href = `/${locale}${basePath}/${ATELIER_VISUAL_PATH}/${res.id}`;
    });
  };

  const submitMindmap = () => {
    if (!title.trim()) {
      toast.error(t("titleRequired"));
      return;
    }
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("templateId", mindmapTemplateId);
    fd.set("editorMode", mindmapEditorMode);
    fd.set("subject", subject);
    fd.set("schoolLevel", schoolLevel);
    fd.set("locale", locale);
    startTransition(async () => {
      const res = await createAtelierMindmapAction(fd);
      if ("error" in res) {
        toast.error(t("createError"));
        return;
      }
      toast.success(t("mindmapCreated"));
      setShowCreate(null);
      setTitle("");
      window.location.href = `/${locale}${basePath}/${ATELIER_MINDMAP_PATH}/${res.id}`;
    });
  };

  const submitActivity = () => {
    if (!title.trim()) {
      toast.error(t("titleRequired"));
      return;
    }
    const fd = new FormData();
    fd.set("title", title.trim());
    fd.set("activityType", activityType);
    fd.set("subject", subject);
    fd.set("schoolLevel", schoolLevel);

    startTransition(async () => {
      const res = await createAtelierActivityAction(fd);
      if ("error" in res) {
        toast.error(t("createError"));
        return;
      }
      toast.success(t("activityCreated"));
      setShowCreate(null);
      setTitle("");
      window.location.href = `/${locale}${basePath}/${ATELIER_ACTIVITY_PATH}/${res.id}`;
    });
  };

  const remove = (id: number) => {
    if (!window.confirm(t("confirmDelete"))) return;
    startTransition(async () => {
      const res = await deleteAtelierResourceAction(id);
      if ("error" in res) toast.error(t("deleteError"));
      else toast.success(t("deleted"));
    });
  };

  const submitFolder = () => {
    if (!folderName.trim()) {
      toast.error(t("folderNameRequired"));
      return;
    }
    startTransition(async () => {
      if (showFolderModal === "create") {
        const res = await createAtelierFolderAction(folderName.trim());
        if ("error" in res) toast.error(t("folderCreateError"));
        else {
          toast.success(t("folderCreated"));
          setShowFolderModal(null);
          setFolderName("");
        }
      } else if (showFolderModal === "rename" && folderEditId) {
        const res = await renameAtelierFolderAction(folderEditId, folderName.trim());
        if ("error" in res) toast.error(t("folderRenameError"));
        else {
          toast.success(t("folderRenamed"));
          setShowFolderModal(null);
          setFolderName("");
          setFolderEditId(null);
        }
      }
    });
  };

  const removeFolder = (folderId: number) => {
    if (!window.confirm(t("folderDeleteConfirm"))) return;
    startTransition(async () => {
      const res = await deleteAtelierFolderAction(folderId);
      if ("error" in res) toast.error(t("folderDeleteError"));
      else {
        toast.success(t("folderDeleted"));
        if (folderFilter === folderId) setFolderFilter("all");
      }
    });
  };

  const openRenameFolder = (folder: AuthoringFolderRow) => {
    setFolderEditId(folder.id);
    setFolderName(folder.name);
    setShowFolderModal("rename");
  };

  const toggleSelect = (id: number) => {
    setSelectedIds((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const toggleSelectAll = () => {
    if (selectedIds.size === filtered.length) setSelectedIds(new Set());
    else setSelectedIds(new Set(filtered.map((r) => r.id)));
  };

  const runBulk = (action: "delete" | "archive" | "publish" | "draft") => {
    if (selectedIds.size === 0) return;
    const labels = {
      delete: t("bulkConfirmDelete"),
      archive: t("bulkConfirmArchive"),
      publish: t("bulkConfirmPublish"),
      draft: t("bulkConfirmDraft"),
    };
    if (!window.confirm(labels[action])) return;

    const fd = new FormData();
    fd.set("action", action);
    fd.set("locale", locale);
    selectedIds.forEach((id) => fd.append("ids", String(id)));

    startTransition(async () => {
      const res = await bulkAtelierResourcesAction(fd);
      if ("error" in res) {
        toast.error(t("bulkError"));
        return;
      }
      toast.success(t("bulkSuccess", { count: res.done }));
      if (res.murFailed > 0) toast.warning(t("bulkMurPartial", { count: res.murFailed }));
      setSelectedIds(new Set());
      router.refresh();
    });
  };

  return (
    <div>
      {isTeacher ? (
        <TeacherPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} />
      ) : (
        <ParentPageHeader
          title={t("parentWorkshopTitle")}
          subtitle={t("parentWorkshopSubtitle")}
          badge={t("badge")}
          premium
        />
      )}

      {isTeacher && !exploreMode && (
        <>
          <AtelierSchoolBanner hasSchool={hasSchool} childCount={schoolChildren.length} />
          <Link
            href="/dashboard/enseignant/classe"
            className="mb-6 inline-flex items-center gap-2 rounded-2xl border border-violet-200 bg-violet-50 px-4 py-3 text-sm font-black text-violet-900 hover:bg-violet-100"
          >
            <Users className="h-4 w-4" />
            {t("classeLink")}
          </Link>
        </>
      )}

      {isTeacher && !exploreMode && assignments.length > 0 && (
        <section className="mb-8 rounded-2xl border border-violet-100 bg-violet-50/50 p-4">
          <h2 className="mb-3 text-xs font-black uppercase text-violet-900">{t("assignmentsTitle")}</h2>
          <ul className="space-y-2">
            {assignments.slice(0, 8).map((a) => (
              <li key={a.id} className="text-sm text-slate-700">
                <Link href="/dashboard/enseignant/classe" className="font-bold text-violet-900 hover:underline">
                  {a.resourceTitle}
                </Link>
                {" → "}
                {a.childName ?? t("assignAll")}
                {a.note ? <span className="text-slate-500"> · {a.note}</span> : null}
              </li>
            ))}
          </ul>
        </section>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        <button
          type="button"
          onClick={() => setShowCreate("document")}
          className="flex items-center gap-3 rounded-2xl border border-violet-100 bg-gradient-to-br from-violet-50 to-white p-4 text-start shadow-sm transition hover:border-violet-300"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-600 text-white">
            <FileText className="h-5 w-5" />
          </div>
          <div>
            <p className="font-black text-slate-900">{t("newDocument")}</p>
            <p className="text-xs text-slate-500">{t("newDocumentDesc")}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setShowCreate("activity")}
          className={cn(
            "flex items-center gap-3 rounded-2xl border p-4 text-start shadow-sm transition",
            isTeacher
              ? "border-teal-100 bg-gradient-to-br from-teal-50 to-white hover:border-teal-300"
              : "border-orange-100 bg-gradient-to-br from-[#FFFBF7] to-white hover:border-orange-300"
          )}
        >
          <div
            className={cn(
              "flex h-11 w-11 items-center justify-center rounded-xl text-white",
              isTeacher ? "bg-teal-600" : "bg-orange-500"
            )}
          >
            <Gamepad2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-black text-slate-900">{t("newActivityAssistant")}</p>
            <p className="text-xs text-slate-500">{t("newActivityAssistantDesc")}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setShowCreate("visual")}
          className="flex items-center gap-3 rounded-2xl border border-rose-100 bg-gradient-to-br from-rose-50 to-white p-4 text-start shadow-sm transition hover:border-rose-300"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-rose-600 text-white">
            <LayoutTemplate className="h-5 w-5" />
          </div>
          <div>
            <p className="font-black text-slate-900">{t("newVisual")}</p>
            <p className="text-xs text-slate-500">{t("newVisualDesc")}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setShowCreate("mindmap")}
          className="flex items-center gap-3 rounded-2xl border border-indigo-100 bg-gradient-to-br from-indigo-50 to-white p-4 text-start shadow-sm transition hover:border-indigo-300"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <GitBranch className="h-5 w-5" />
          </div>
          <div>
            <p className="font-black text-slate-900">{t("newMindmap")}</p>
            <p className="text-xs text-slate-500">{t("newMindmapDesc")}</p>
          </div>
        </button>
        <button
          type="button"
          onClick={() => setShowCreate("activityExpert")}
          className="flex items-center gap-3 rounded-2xl border border-slate-700/10 bg-gradient-to-br from-slate-50 to-white p-4 text-start shadow-sm transition hover:border-slate-300"
        >
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-600 text-white">
            <Wand2 className="h-5 w-5" />
          </div>
          <div>
            <p className="font-black text-slate-900">{t("newActivityExpert")}</p>
            <p className="text-xs text-slate-500">{t("newActivityExpertDesc")}</p>
          </div>
        </button>
      </div>

      {showCreate && (
        <Card className="mb-8 border-slate-200 shadow-md">
          <CardContent className="space-y-4 p-5">
            <p className="font-black text-slate-900">
              {showCreate === "document"
                ? t("newDocument")
                : showCreate === "visual"
                  ? t("newVisual")
                  : showCreate === "mindmap"
                    ? t("newMindmap")
                    : showCreate === "activityExpert"
                      ? t("newActivityExpert")
                      : t("newActivityAssistant")}
            </p>
            <input
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={t("titlePlaceholder")}
              className="w-full rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-bold"
            />
            <div className="grid gap-3 sm:grid-cols-2">
              <input
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                placeholder={t("subjectPlaceholder")}
                className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
              />
              {teacherLevels.length > 0 ? (
                <select
                  value={schoolLevel}
                  onChange={(e) => setSchoolLevel(e.target.value)}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm font-medium"
                >
                  <option value="">{t("assignAllLevels")}</option>
                  {teacherLevels.map((level) => (
                    <option key={level} value={level}>
                      {level}
                    </option>
                  ))}
                </select>
              ) : (
                <input
                  value={schoolLevel}
                  onChange={(e) => setSchoolLevel(e.target.value)}
                  placeholder={t("levelPlaceholder")}
                  className="rounded-xl border border-slate-200 px-4 py-2 text-sm"
                />
              )}
            </div>

            {showCreate === "document" && (
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
                {TEACHER_TEMPLATES.map((tpl) => (
                  <button
                    key={tpl.id}
                    type="button"
                    onClick={() => setTemplateId(tpl.id)}
                    className={`rounded-xl border p-3 text-center text-[11px] font-black ${
                      templateId === tpl.id ? "border-violet-400 bg-violet-50" : "border-slate-100"
                    }`}
                  >
                    {isAr ? tpl.titleAr : tpl.titleFr}
                  </button>
                ))}
              </div>
            )}

            {showCreate === "visual" && (
              <>
                <div>
                  <p className="mb-2 text-xs font-black uppercase text-slate-500">{t("visualFormatLabel")}</p>
                  <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                    {VISUAL_PAGE_FORMATS.map((fmt) => (
                      <button
                        key={fmt.id}
                        type="button"
                        onClick={() => setVisualFormatId(fmt.id)}
                        className={`rounded-xl border px-3 py-2.5 text-left text-[11px] font-black ${
                          visualFormatId === fmt.id
                            ? isTeacher
                              ? "border-teal-400 bg-teal-50 text-teal-900"
                              : "border-orange-400 bg-orange-50 text-orange-900"
                            : "border-slate-100"
                        }`}
                      >
                        {isAr ? fmt.labelAr : fmt.labelFr}
                      </button>
                    ))}
                  </div>
                </div>
                <div>
                  <p className="mb-2 text-xs font-black uppercase text-slate-500">{t("visualStyleLabel")}</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    {VISUAL_TEMPLATES.map((tpl) => (
                      <button
                        key={tpl.id}
                        type="button"
                        onClick={() => {
                          setVisualTemplateId(tpl.id);
                          setVisualFormatId(visualTemplateDefaultFormat(tpl.id));
                        }}
                        className={`rounded-xl border p-3 text-center text-[11px] font-black ${
                          visualTemplateId === tpl.id ? "border-rose-400 bg-rose-50" : "border-slate-100"
                        }`}
                      >
                        {isAr ? tpl.titleAr : tpl.titleFr}
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {showCreate === "mindmap" && (
              <>
                <div>
                  <p className="mb-2 text-xs font-black uppercase text-slate-500">{t("mindmapModeLabel")}</p>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2">
                    <button
                      type="button"
                      onClick={() => setMindmapEditorMode("excalidraw")}
                      className={`rounded-xl border p-3 text-left text-[11px] font-black ${
                        mindmapEditorMode === "excalidraw"
                          ? "border-indigo-400 bg-indigo-50 text-indigo-950"
                          : "border-slate-100"
                      }`}
                    >
                      {t("mindmapModeExcalidraw")}
                      <span className="mt-1 block text-[10px] font-semibold text-slate-500">
                        {t("mindmapModeExcalidrawDesc")}
                      </span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setMindmapEditorMode("markmap")}
                      className={`rounded-xl border p-3 text-left text-[11px] font-black ${
                        mindmapEditorMode === "markmap"
                          ? "border-indigo-400 bg-indigo-50 text-indigo-950"
                          : "border-slate-100"
                      }`}
                    >
                      {t("mindmapModeMarkmap")}
                      <span className="mt-1 block text-[10px] font-semibold text-slate-500">
                        {t("mindmapModeMarkmapDesc")}
                      </span>
                    </button>
                  </div>
                </div>
                <div>
                <p className="mb-2 text-xs font-black uppercase text-slate-500">{t("mindmapStyleLabel")}</p>
                <div className="grid grid-cols-1 gap-2 sm:grid-cols-3">
                  {MINDMAP_TEMPLATES.map((tpl) => (
                    <button
                      key={tpl.id}
                      type="button"
                      onClick={() => setMindmapTemplateId(tpl.id)}
                      className={`rounded-xl border p-3 text-center text-[11px] font-black ${
                        mindmapTemplateId === tpl.id ? "border-indigo-400 bg-indigo-50" : "border-slate-100"
                      }`}
                    >
                      {isAr ? tpl.titleAr : tpl.titleFr}
                    </button>
                    ))}
                </div>
              </div>
              </>
            )}

            {(showCreate === "activity" || showCreate === "activityExpert") && (
              <>
                {showCreate === "activity" && (
                  <div>
                    <p className="mb-2 text-xs font-black uppercase text-slate-500">{t("templateQuickTitle")}</p>
                    <div className="flex flex-wrap gap-2">
                      {ACTIVITY_TEMPLATES.map((tpl) => (
                        <button
                          key={tpl.id}
                          type="button"
                          onClick={() => {
                            setActivityType(tpl.activityType);
                            if (!title.trim()) setTitle(isAr ? tpl.titleAr : tpl.titleFr);
                            if (!subject.trim() && tpl.subject) setSubject(tpl.subject);
                            if (!schoolLevel.trim() && tpl.level) setSchoolLevel(tpl.level);
                          }}
                          className={cn(
                            "rounded-xl border px-3 py-2 text-[11px] font-black hover:border-orange-300",
                            isTeacher
                              ? "border-teal-100 bg-teal-50/50 text-teal-900 hover:border-teal-300"
                              : "border-orange-100 bg-orange-50/50 text-orange-900"
                          )}
                        >
                          {isAr ? tpl.titleAr : tpl.titleFr}
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                <AtelierActivityTypePicker
                  types={pickerTypes}
                  value={activityType}
                  onChange={setActivityType}
                  locale={locale}
                />
              </>
            )}

            <div className="flex flex-col items-center gap-3 border-t border-slate-100 pt-4">
              <Button
                disabled={pending}
                onClick={() => {
                  if (showCreate === "document") submitDocument();
                  else if (showCreate === "visual") submitVisual();
                  else if (showCreate === "mindmap") submitMindmap();
                  else submitActivity();
                }}
                className={`min-w-[220px] rounded-xl px-8 py-3 text-sm font-black shadow-md ${
                  showCreate === "visual"
                    ? "bg-rose-600 hover:bg-rose-500"
                    : showCreate === "mindmap"
                      ? "bg-indigo-600 hover:bg-indigo-500"
                      : "bg-violet-600 hover:bg-violet-500"
                }`}
              >
                <Plus className="mr-2 h-4 w-4" /> {t("create")}
              </Button>
              <Button variant="outline" type="button" className="rounded-xl px-6" onClick={() => setShowCreate(null)}>
                {t("cancel")}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2">
          {(["all", "document", "visual", "mindmap", "h5p", "published", "archived"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`rounded-full px-3 py-1.5 text-xs font-black ${
                tab === k ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {t(`filter_${k}`)}
            </button>
          ))}
        </div>
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("search")}
            className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm"
          />
        </div>
      </div>

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setFolderFilter("all")}
          className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase transition ${
            folderFilter === "all" ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-600"
          }`}
        >
          {t("folderFilterAll")}
        </button>
        <button
          type="button"
          onClick={() => setFolderFilter("none")}
          className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase transition ${
            folderFilter === "none" ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-600"
          }`}
        >
          {t("folderNone")}
        </button>
        {folders.map((f) => (
          <span key={f.id} className="inline-flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => setFolderFilter(f.id)}
              className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase transition ${
                folderFilter === f.id ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-600"
              }`}
            >
              {f.name}
            </button>
            <button
              type="button"
              title={t("folderRename")}
              onClick={() => openRenameFolder(f)}
              className="rounded-full p-1 text-slate-400 hover:bg-slate-100 hover:text-violet-700"
            >
              <Pencil className="h-3 w-3" />
            </button>
            <button
              type="button"
              title={t("folderDelete")}
              onClick={() => removeFolder(f.id)}
              className="rounded-full p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </span>
        ))}
        <button
          type="button"
          onClick={() => {
            setFolderName("");
            setShowFolderModal("create");
          }}
          className="inline-flex items-center gap-1 rounded-full border border-dashed border-violet-300 px-3 py-1.5 text-[10px] font-black uppercase text-violet-700 hover:bg-violet-50"
        >
          <FolderPlus className="h-3 w-3" /> {t("folderCreate")}
        </button>
      </div>

      {showFolderModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-sm rounded-2xl bg-white p-6 shadow-xl">
            <h3 className="mb-4 text-lg font-black text-slate-900">
              {showFolderModal === "create" ? t("folderCreateTitle") : t("folderRenameTitle")}
            </h3>
            <input
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder={t("folderNamePlaceholder")}
              className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"
            />
            <div className="flex justify-end gap-2">
              <Button type="button" variant="outline" onClick={() => setShowFolderModal(null)}>
                {t("cancel")}
              </Button>
              <Button type="button" disabled={pending} onClick={submitFolder} className="bg-violet-600 hover:bg-violet-500">
                {t("folderSave")}
              </Button>
            </div>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <div
          className={cn(
            "rounded-2xl border border-dashed px-6 py-16 text-center",
            isTeacher ? "border-slate-200 bg-white" : "border-orange-200 bg-[#FFFBF7]"
          )}
        >
          <Wand2 className="mx-auto mb-3 h-10 w-10 text-violet-300" />
          <p className="font-black text-slate-700">{t("emptyTitle")}</p>
          <p className="mt-1 text-sm text-slate-500">{t("emptyDesc")}</p>
        </div>
      ) : (
        <div className="space-y-2">
          {(isTeacher || exploreMode) && filtered.length > 0 && (
            <div className="flex flex-wrap items-center gap-2 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2">
              <label className="flex items-center gap-2 text-xs font-bold text-slate-600">
                <input
                  type="checkbox"
                  checked={selectedIds.size === filtered.length && filtered.length > 0}
                  onChange={toggleSelectAll}
                  className="rounded border-slate-300"
                />
                {t("bulkSelectAll")}
              </label>
              {selectedIds.size > 0 && (
                <>
                  <span className="text-xs font-black text-violet-700">
                    {t("bulkSelected", { count: selectedIds.size })}
                  </span>
                  {selectedIds.size === 1 && (() => {
                    const id = [...selectedIds][0];
                    const res = filtered.find((r) => r.id === id);
                    if (res && (res.kind === "activity" || res.kind === "h5p")) {
                      return (
                        <Link
                          href={`${basePath}/${ATELIER_ACTIVITY_PATH}/${id}`}
                          className={cn(
                            "rounded-lg px-3 py-1 text-[10px] font-black text-white",
                            isTeacher ? "bg-teal-600 hover:bg-teal-500" : "bg-orange-500 hover:bg-orange-400"
                          )}
                        >
                          {t("bulkModify")}
                        </Link>
                      );
                    }
                    if (res?.kind === "document" || res?.kind === "visual" || res?.kind === "mindmap") {
                      return (
                        <Link
                          href={atelierResourceEditPath(res.kind, id, basePath)}
                          className={cn(
                            "rounded-lg px-3 py-1 text-[10px] font-black text-white",
                            isTeacher ? "bg-teal-600 hover:bg-teal-500" : "bg-orange-500 hover:bg-orange-400"
                          )}
                        >
                          {t("bulkModify")}
                        </Link>
                      );
                    }
                    return null;
                  })()}
                  {!exploreMode && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => runBulk("publish")}
                      className="rounded-lg bg-emerald-600 px-3 py-1 text-[10px] font-black text-white hover:bg-emerald-500"
                    >
                      {t("bulkPublish")}
                    </button>
                  )}
                  {!exploreMode && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => runBulk("archive")}
                      className="rounded-lg bg-slate-700 px-3 py-1 text-[10px] font-black text-white hover:bg-slate-600"
                    >
                      {t("bulkArchive")}
                    </button>
                  )}
                  {!exploreMode && (
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => runBulk("draft")}
                      className="rounded-lg border border-slate-300 bg-white px-3 py-1 text-[10px] font-black text-slate-700"
                    >
                      {t("bulkDraft")}
                    </button>
                  )}
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => runBulk("delete")}
                    className="rounded-lg bg-red-600 px-3 py-1 text-[10px] font-black text-white hover:bg-red-500"
                  >
                    {t("bulkDelete")}
                  </button>
                </>
              )}
            </div>
          )}
          {filtered.map((r) => (
            <Card key={r.id} className={`border-slate-100 shadow-sm ${selectedIds.has(r.id) ? "ring-2 ring-violet-300" : ""}`}>
              <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex min-w-0 items-start gap-3">
                  {(isTeacher || exploreMode) && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.id)}
                      onChange={() => toggleSelect(r.id)}
                      className="mt-1 rounded border-slate-300"
                    />
                  )}
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="outline" className="text-[10px] font-black">
                      {r.kind === "document"
                        ? t("kindDocument")
                        : r.kind === "visual"
                          ? t("kindVisual")
                          : r.kind === "mindmap"
                            ? t("kindMindmap")
                            : t("kindActivity")}
                    </Badge>
                    {(r.kind === "activity" || r.kind === "h5p") && (
                      <Badge
                        className={cn(
                          "text-[10px] font-black",
                          isTeacher ? "bg-teal-50 text-teal-800 hover:bg-teal-50" : "bg-orange-50 text-orange-800 hover:bg-orange-50"
                        )}
                      >
                        {activityPickerTypes.find((tp) => tp.machineName === r.h5pLibrary)?.title ??
                          ACTIVITY_TYPES.find((tp) => tp.id === r.h5pLibrary)?.labelFr ??
                          t("kindActivity")}
                      </Badge>
                    )}
                    {r.kind === "document" && (
                      <Badge className="bg-slate-100 text-[10px] font-black text-slate-600 hover:bg-slate-100">
                        {r.resourceType}
                      </Badge>
                    )}
                    {r.tags && (
                      <Badge
                        variant="outline"
                        className={cn("text-[10px] font-bold", isTeacher ? "text-teal-700" : "text-orange-700")}
                      >
                        {r.tags}
                      </Badge>
                    )}
                    {r.status === "draft" && (
                      <Badge className="bg-amber-100 text-[10px] font-black text-amber-800 hover:bg-amber-100">
                        {t("draft")}
                      </Badge>
                    )}
                    {r.status === "archived" && (
                      <Badge className="bg-slate-200 text-[10px] font-black text-slate-700 hover:bg-slate-200">
                        {t("archived")}
                      </Badge>
                    )}
                    {r.status === "published" && (
                      <Badge className="bg-emerald-100 text-[10px] font-black text-emerald-800 hover:bg-emerald-100">
                        {t("publishedBadge")}
                      </Badge>
                    )}
                  </div>
                  <p className="mt-1 truncate font-black text-slate-900">{r.title}</p>
                  <p className="text-xs text-slate-400">
                    {[r.subject, r.schoolLevel].filter(Boolean).join(" · ") || t("noMeta")} —{" "}
                    {new Date(r.updatedAt).toLocaleDateString(isAr ? "ar-DZ" : "fr-FR")}
                  </p>
                </div>
                </div>
                <div className="flex shrink-0 flex-col gap-2 sm:items-end">
                  <div className="flex flex-wrap gap-2">
                    <Link
                      href={atelierResourceEditPath(r.kind, r.id, basePath)}
                      className="inline-flex items-center rounded-xl bg-violet-600 px-4 py-2 text-xs font-black text-white hover:bg-violet-500"
                    >
                      {t("open")}
                    </Link>
                    <button
                      type="button"
                      disabled={pending}
                      onClick={() => remove(r.id)}
                      className="inline-flex items-center rounded-xl border border-red-100 px-3 py-2 text-xs font-bold text-red-600 hover:bg-red-50"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                  {!exploreMode && (
                    <AtelierResourceActions
                      resourceId={r.id}
                      resourceKind={r.kind}
                      resourceTitle={r.title}
                      status={r.status}
                      tags={r.tags}
                      resourceSchoolLevel={r.schoolLevel}
                      schoolChildren={schoolChildren}
                      teacherLevels={teacherLevels}
                      folders={folders}
                      locale={locale}
                      ownerRole={isTeacher ? "enseignant" : "parent"}
                      allowAssign={isTeacher}
                      compact
                    />
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

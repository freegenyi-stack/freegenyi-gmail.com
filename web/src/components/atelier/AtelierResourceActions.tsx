"use client";



import React, { useState, useTransition } from "react";

import { useRouter } from "next/navigation";
import { useTranslations } from "next-intl";

import { ArrowLeft, ArrowRight, Check, Copy, FolderInput, Globe, GlobeLock, Share2, Tag, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";

import AtelierShareDialog from "@/components/atelier/AtelierShareDialog";
import AtelierAssignStepper from "@/components/atelier/AtelierAssignStepper";

import type { AuthoringFolderRow } from "@/lib/authoring/folders.server";

import type { AuthoringKind, AuthoringOwnerRole, AuthoringStatus } from "@/lib/authoring/types";

import type { TeacherSchoolChild } from "@/lib/library/books.server";

import {

  assignAtelierResourceAction,

  duplicateAtelierResourceAction,

  moveAtelierResourceFolderAction,

  publishAtelierResourceAction,

  tagAtelierResourceAction,

} from "@/lib/actions/authoring";
import { atelierResourceEditPath } from "@/lib/authoring/visual-config";

import { toast } from "sonner";



type Props = {

  resourceId: number;

  resourceKind: AuthoringKind;

  resourceTitle: string;

  status: AuthoringStatus;

  tags?: string | null;

  schoolChildren?: TeacherSchoolChild[];
  teacherLevels?: string[];
  resourceSchoolLevel?: string | null;
  folders?: AuthoringFolderRow[];

  locale: string;

  ownerRole?: AuthoringOwnerRole;

  compact?: boolean;

  allowAssign?: boolean;

  showMur?: boolean;

};



export default function AtelierResourceActions({

  resourceId,

  resourceKind,

  resourceTitle,

  status,

  tags = null,

  schoolChildren = [],
  teacherLevels = [],
  resourceSchoolLevel = null,
  folders = [],

  locale,

  ownerRole = "enseignant",

  compact,

  allowAssign = true,

  showMur,

}: Props) {

  const t = useTranslations("TeacherSpace.atelier");
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const [showAssign, setShowAssign] = useState(false);
  const [showMove, setShowMove] = useState(false);
  const [showTags, setShowTags] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [folderId, setFolderId] = useState<string>("");
  const [tagInput, setTagInput] = useState(tags ?? "");



  const base = ownerRole === "parent" ? "/dashboard/parent/atelier" : "/dashboard/enseignant/atelier";

  const resourcePath = atelierResourceEditPath(resourceKind, resourceId, base);

  const shareUrl =

    typeof window !== "undefined" ? `${window.location.origin}/${locale}${resourcePath}` : `/${locale}${resourcePath}`;



  const copyLink = async () => {

    try {

      await navigator.clipboard.writeText(shareUrl);

      toast.success(t("linkCopied"));

    } catch {

      toast.error(t("copyLinkError"));

    }

  };



  const togglePublish = () => {
    const publish = status !== "published";
    startTransition(async () => {
      const res = await publishAtelierResourceAction(resourceId, publish, locale);
      if ("error" in res) {
        if (res.error === "mur_failed") toast.error(res.detail || t("publishError"));
        else toast.error(t("publishError"));
        return;
      }
      if (publish && "murPosted" in res && res.murPosted) {
        toast.success(t("publishMurSuccess"));
      } else if (publish && "murSkipped" in res && res.murSkipped) {
        toast.success(t("publishSuccess"));
        toast.info(t("publishMurVerification"));
      } else {
        toast.success(publish ? t("publishSuccess") : t("unpublishSuccess"));
      }
      router.refresh();
    });
  };



  const submitAssign = (data: { childId: string; assignLevel: string; note: string; dueAt: string }) => {
    const fd = new FormData();
    fd.set("resourceId", String(resourceId));
    fd.set("locale", locale);
    if (data.childId) fd.set("childId", data.childId);
    else if (data.assignLevel.trim()) fd.set("assignLevel", data.assignLevel.trim());
    if (data.note.trim()) fd.set("note", data.note.trim());
    if (data.dueAt) fd.set("dueAt", data.dueAt);

    startTransition(async () => {
      const res = await assignAtelierResourceAction(fd);
      if ("error" in res) {
        if (res.error === "school_required") toast.error(t("assignErrorSchool"));
        else if (res.error === "no_students") toast.error(t("assignErrorNoStudents"));
        else toast.error(t("assignError"));
        return;
      }
      toast.success(t("assignSuccess"));
      setShowAssign(false);
    });
  };

  const duplicateResource = () => {
    startTransition(async () => {
      const res = await duplicateAtelierResourceAction(resourceId, locale);
      if ("error" in res) {
        toast.error(t("duplicateError"));
        return;
      }
      toast.success(t("duplicateSuccess"));
      router.push(res.path);
    });
  };



  const submitMove = () => {

    const nextFolderId = folderId ? parseInt(folderId, 10) : null;

    startTransition(async () => {

      const res = await moveAtelierResourceFolderAction(resourceId, nextFolderId);

      if ("error" in res) toast.error(t("moveFolderError"));

      else {

        toast.success(t("moveFolderSuccess"));

        setShowMove(false);

      }

    });

  };



  const submitTags = () => {

    startTransition(async () => {

      const res = await tagAtelierResourceAction(resourceId, tagInput.trim());

      if ("error" in res) toast.error(t("tagsError"));

      else {

        toast.success(t("tagsSuccess"));

        setShowTags(false);

      }

    });

  };



  const btnClass = compact

    ? "h-8 rounded-xl px-2.5 text-[10px] font-bold gap-1"

    : "rounded-xl text-xs font-bold gap-1.5";



  return (

    <>

      <div className="flex flex-wrap gap-2">

        {allowAssign && ownerRole === "enseignant" && schoolChildren.length > 0 && (

          <Button

            type="button"

            variant="outline"

            disabled={pending}

            className={btnClass}

            onClick={() => setShowAssign(true)}

          >

            <UserPlus className="h-3.5 w-3.5" />

            {t("assign")}

          </Button>

        )}



        <Button type="button" variant="outline" disabled={pending} className={btnClass} onClick={togglePublish}>

          {status === "published" ? (

            <>

              <GlobeLock className="h-3.5 w-3.5" /> {t("unpublish")}

            </>

          ) : (

            <>

              <Globe className="h-3.5 w-3.5" /> {t("publish")}

            </>

          )}

        </Button>



        <Button type="button" variant="outline" disabled={pending} className={btnClass} onClick={duplicateResource}>
          <Copy className="h-3.5 w-3.5" />
          {t("duplicate")}
        </Button>

        <Button type="button" variant="outline" disabled={pending} className={btnClass} onClick={copyLink}>

          <Copy className="h-3.5 w-3.5" /> {t("copyLink")}

        </Button>



        <Button type="button" variant="outline" disabled={pending} className={btnClass} onClick={() => setShowShare(true)}>

          <Share2 className="h-3.5 w-3.5" /> {t("share")}

        </Button>



        <Button type="button" variant="outline" disabled={pending} className={btnClass} onClick={() => setShowMove(true)}>

          <FolderInput className="h-3.5 w-3.5" /> {t("moveFolder")}

        </Button>



        <Button type="button" variant="outline" disabled={pending} className={btnClass} onClick={() => setShowTags(true)}>

          <Tag className="h-3.5 w-3.5" /> {t("tags")}

        </Button>

      </div>



      <AtelierShareDialog

        open={showShare}

        onClose={() => setShowShare(false)}

        resourceId={resourceId}

        resourceKind={resourceKind}

        resourceTitle={resourceTitle}

        locale={locale}

        ownerRole={ownerRole}

        showMur={showMur ?? ownerRole === "enseignant"}

      />



      <AtelierAssignStepper
        open={showAssign}
        onClose={() => setShowAssign(false)}
        onSubmit={submitAssign}
        pending={pending}
        schoolChildren={schoolChildren}
        teacherLevels={teacherLevels}
        resourceTitle={resourceTitle}
        resourceSchoolLevel={resourceSchoolLevel}
      />

      {showMove && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h3 className="mb-4 text-lg font-black text-slate-900">{t("moveFolderTitle")}</h3>

            <select

              value={folderId}

              onChange={(e) => setFolderId(e.target.value)}

              className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"

            >

              <option value="">{t("folderNone")}</option>

              {folders.map((f) => (

                <option key={f.id} value={f.id}>

                  {f.name}

                </option>

              ))}

            </select>

            <div className="flex justify-end gap-2">

              <Button type="button" variant="outline" onClick={() => setShowMove(false)}>

                {t("cancel")}

              </Button>

              <Button type="button" disabled={pending} onClick={submitMove} className="bg-violet-600 hover:bg-violet-500">

                {t("moveFolderSubmit")}

              </Button>

            </div>

          </div>

        </div>

      )}



      {showTags && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h3 className="mb-4 text-lg font-black text-slate-900">{t("tagsTitle")}</h3>

            <input

              value={tagInput}

              onChange={(e) => setTagInput(e.target.value)}

              placeholder={t("tagsPlaceholder")}

              className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"

            />

            <div className="flex justify-end gap-2">

              <Button type="button" variant="outline" onClick={() => setShowTags(false)}>

                {t("cancel")}

              </Button>

              <Button type="button" disabled={pending} onClick={submitTags} className="bg-violet-600 hover:bg-violet-500">

                {t("tagsSubmit")}

              </Button>

            </div>

          </div>

        </div>

      )}

    </>

  );

}


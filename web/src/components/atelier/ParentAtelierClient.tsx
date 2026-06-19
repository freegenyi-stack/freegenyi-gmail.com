"use client";

import React, { useEffect, useRef, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { ATELIER_ACTIVITY_PATH } from "@/lib/authoring/h5p-config";
import { ATELIER_MINDMAP_PATH, ATELIER_VISUAL_PATH } from "@/lib/authoring/visual-config";
import { useLocale, useTranslations } from "next-intl";
import { CheckCircle2, Clock, FileText, Gamepad2, GitBranch, ImageIcon, Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import type { FamilyAuthoringAssignmentRow } from "@/lib/authoring/assignments.server";
import { markParentAtelierProgressAction } from "@/lib/actions/authoring";
import { toast } from "sonner";

type Props = {
  assignments: FamilyAuthoringAssignmentRow[];
  highlightAssignmentId?: number | null;
  hideTitle?: boolean;
};

function statusLabel(status: string, t: ReturnType<typeof useTranslations<"TeacherSpace.atelier">>) {
  if (status === "done") return t("statusDone");
  if (status === "in_progress") return t("statusInProgress");
  return t("statusPending");
}

export default function ParentAtelierClient({ assignments, highlightAssignmentId, hideTitle }: Props) {
  const locale = useLocale();
  const t = useTranslations("TeacherSpace.atelier");
  const isAr = locale.endsWith("-ar") || locale === "ar";
  const [pending, startTransition] = useTransition();
  const highlightRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!highlightAssignmentId || !highlightRef.current) return;
    highlightRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [highlightAssignmentId, assignments.length]);

  const setStatus = (progressId: number, status: "in_progress" | "done") => {
    startTransition(async () => {
      const res = await markParentAtelierProgressAction(progressId, status);
      if ("error" in res) toast.error(t("progressError"));
      else toast.success(t("progressUpdated"));
    });
  };

  return (
    <div>
      {!hideTitle && (
        <div className="mb-8">
          <h1 className="font-reem text-3xl font-black text-slate-900">{t("parentTitle")}</h1>
          <p className="mt-1 text-sm text-slate-500">{t("parentSubtitle")}</p>
        </div>
      )}

      {assignments.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-orange-200 bg-[#FFFBF7] px-6 py-16 text-center">
          <p className="font-black text-slate-700">{t("parentEmptyTitle")}</p>
          <p className="mt-1 text-sm text-slate-500">{t("parentEmptyDesc")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {assignments.map((a) => {
            const href =
              a.resourceKind === "document"
                ? `/dashboard/parent/atelier/document/${a.resourceId}?assignment=${a.assignmentId}`
                : a.resourceKind === "visual"
                  ? `/dashboard/parent/atelier/${ATELIER_VISUAL_PATH}/${a.resourceId}?assignment=${a.assignmentId}`
                  : a.resourceKind === "mindmap"
                    ? `/dashboard/parent/atelier/${ATELIER_MINDMAP_PATH}/${a.resourceId}?assignment=${a.assignmentId}`
                    : `/dashboard/parent/atelier/${ATELIER_ACTIVITY_PATH}/${a.resourceId}?assignment=${a.assignmentId}`;
            const highlighted = highlightAssignmentId === a.assignmentId;

            return (
              <div key={a.progressId} ref={highlighted ? highlightRef : undefined}>
                <Card
                  className={`border-orange-100/60 shadow-sm ${highlighted ? "ring-2 ring-orange-400 ring-offset-2" : ""}`}
                >
                  <CardContent className="flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between">
                    <div className="min-w-0">
                      <div className="flex flex-wrap items-center gap-2">
                        <Badge variant="outline" className="text-[10px] font-black">
                          {a.resourceKind === "document" ? (
                            <>
                              <FileText className="mr-1 h-3 w-3" /> {t("kindDocument")}
                            </>
                          ) : a.resourceKind === "visual" ? (
                            <>
                              <ImageIcon className="mr-1 h-3 w-3" /> {t("kindVisual")}
                            </>
                          ) : a.resourceKind === "mindmap" ? (
                            <>
                              <GitBranch className="mr-1 h-3 w-3" /> {t("kindMindmap")}
                            </>
                          ) : (
                            <>
                              <Gamepad2 className="mr-1 h-3 w-3" /> {t("kindActivity")}
                            </>
                          )}
                        </Badge>
                        <Badge
                          className={`text-[10px] font-black hover:bg-slate-100 ${
                            a.status === "done"
                              ? "bg-orange-100 text-orange-800"
                              : a.status === "in_progress"
                                ? "bg-sky-100 text-sky-800"
                                : "bg-slate-100 text-slate-600"
                          }`}
                        >
                          {statusLabel(a.status, t)}
                        </Badge>
                      </div>
                      <p className="mt-1 truncate font-black text-slate-900">{a.resourceTitle}</p>
                      <p className="text-xs text-slate-500">
                        {a.childName}
                        {a.teacherName ? ` · ${a.teacherName}` : ""}
                        {a.dueAt
                          ? ` · ${t("dueLabel")} ${new Date(a.dueAt).toLocaleDateString(isAr ? "ar-DZ" : "fr-FR")}`
                          : ""}
                      </p>
                      {a.note && <p className="mt-1 text-xs text-slate-600">{a.note}</p>}
                    </div>
                    <div className="flex shrink-0 flex-wrap gap-2">
                      <Link
                        href={href}
                        className="inline-flex items-center rounded-xl bg-orange-500 px-4 py-2 text-xs font-black text-white hover:bg-orange-400"
                      >
                        {t("open")}
                      </Link>
                      {a.resourceKind === "document" ? (
                        <>
                          {a.status !== "in_progress" && a.status !== "done" && (
                            <Button
                              type="button"
                              variant="outline"
                              disabled={pending}
                              className="rounded-xl text-xs font-bold"
                              onClick={() => setStatus(a.progressId, "in_progress")}
                            >
                              <Loader2 className="mr-1 h-3.5 w-3.5" /> {t("markInProgress")}
                            </Button>
                          )}
                          {a.status !== "done" && (
                            <Button
                              type="button"
                              disabled={pending}
                              className="rounded-xl bg-orange-500 text-xs font-bold hover:bg-orange-400"
                              onClick={() => setStatus(a.progressId, "done")}
                            >
                              <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> {t("markDone")}
                            </Button>
                          )}
                          {a.status === "done" && (
                            <Button
                              type="button"
                              variant="outline"
                              disabled={pending}
                              className="rounded-xl text-xs font-bold"
                              onClick={() => setStatus(a.progressId, "in_progress")}
                            >
                              <Clock className="mr-1 h-3.5 w-3.5" /> {t("markInProgress")}
                            </Button>
                          )}
                        </>
                      ) : (
                        a.status === "done" && (
                          <span className="inline-flex items-center rounded-xl bg-orange-100 px-3 py-2 text-xs font-black text-orange-800">
                            <CheckCircle2 className="mr-1 h-3.5 w-3.5" /> {t("statusDone")}
                          </span>
                        )
                      )}
                    </div>
                  </CardContent>
                </Card>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

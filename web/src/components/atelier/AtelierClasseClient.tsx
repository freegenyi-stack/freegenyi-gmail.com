"use client";

import React, { useMemo, useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import {
  ArrowLeft,
  Bell,
  CheckCircle2,
  Clock,
  Download,
  Eye,
  Users,
  AlertCircle,
} from "lucide-react";
import ActivityAttemptDetailModal from "@/components/atelier/ActivityAttemptDetailModal";
import type { ClasseProgressRow } from "@/lib/authoring/assignments.server";
import type { ActivityAttemptRow } from "@/lib/authoring/attempts.server";
import { markTeacherAtelierProgressAction, remindAtelierProgressAction } from "@/lib/actions/authoring";
import { toast } from "sonner";

type Props = {
  rows: ClasseProgressRow[];
  attemptRows?: ActivityAttemptRow[];
  teacherLevels?: string[];
  unified?: boolean;
};

function sourceLabel(source: string, t: (k: string) => string): string {
  if (source === "mur") return t("sourceMur");
  if (source === "atelier") return t("sourceAtelier");
  return t("sourceAssignment");
}

export default function AtelierClasseClient({
  rows,
  attemptRows = [],
  teacherLevels = [],
  unified = false,
}: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [detailAttemptId, setDetailAttemptId] = useState<number | null>(null);

  const levels = useMemo(() => {
    const fromRows = rows.map((r) => r.childLevel).filter(Boolean) as string[];
    const merged = [...new Set([...teacherLevels, ...fromRows])];
    return merged.sort((a, b) => a.localeCompare(b));
  }, [rows, teacherLevels]);

  const filtered = useMemo(() => {
    let list = rows;
    if (levelFilter !== "all") {
      list = list.filter((r) => r.childLevel === levelFilter || r.resourceLevel === levelFilter);
    }
    if (statusFilter !== "all") {
      list = list.filter((r) => r.status === statusFilter);
    }
    return list;
  }, [rows, levelFilter, statusFilter]);

  const stats = useMemo(() => {
    const done = filtered.filter((r) => r.status === "done").length;
    const pendingCount = filtered.filter((r) => r.status === "pending").length;
    const inProgress = filtered.filter((r) => r.status === "in_progress").length;
    return { done, pending: pendingCount, inProgress, total: filtered.length };
  }, [filtered]);

  const exportCsv = () => {
    const header = ["Eleve", "Niveau", "Ressource", "Statut", "Score", "Etoiles", "Echeance"];
    const lines = filtered.map((r) =>
      [
        r.childName,
        r.childLevel ?? r.resourceLevel ?? "",
        r.resourceTitle,
        r.status,
        r.score ?? "",
        r.stars ?? "",
        r.dueAt ? new Date(r.dueAt).toLocaleDateString(locale) : "",
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(",")
    );
    const attemptsHeader = ["Eleve", "Ressource", "Source", "Score", "Etoiles", "Erreurs", "Duree_s", "Date"];
    const attemptLines = attemptRows.map((a) =>
      [
        a.childName ?? "",
        a.resourceTitle,
        a.source,
        a.score,
        a.stars ?? "",
        a.errors ?? "",
        a.durationSeconds ?? "",
        new Date(a.completedAt).toISOString(),
      ]
        .map((c) => `"${String(c).replace(/"/g, '""')}"`)
        .join(",")
    );
    const csv = [header.join(","), ...lines, "", attemptsHeader.join(","), ...attemptLines].join("\n");
    const blob = new Blob(["\uFEFF" + csv], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `suivi-classe-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const updateStatus = (progressId: number, status: "pending" | "in_progress" | "done") => {
    if (status === "done") {
      const row = rows.find((r) => r.progressId === progressId);
      if (row && row.score == null) {
        toast.info(t("markDoneNoScoreHint"));
      }
    }
    startTransition(async () => {
      const res = await markTeacherAtelierProgressAction(progressId, status);
      if ("error" in res) toast.error(t("progressError"));
      else toast.success(t("progressUpdated"));
    });
  };

  const remind = (progressId: number) => {
    startTransition(async () => {
      const res = await remindAtelierProgressAction(progressId, locale);
      if ("error" in res) {
        if (res.error === "already_done") toast.info(t("remindAlreadyDone"));
        else if (res.error === "no_parent") toast.error(t("remindNoParent"));
        else toast.error(t("remindError"));
        return;
      }
      toast.success(t("remindSuccess"));
    });
  };

  return (
    <div className="space-y-6">
      {!unified && (
        <Link
          href="/dashboard/enseignant/atelier"
          className="inline-flex items-center gap-2 text-sm font-bold text-violet-800 hover:text-violet-950"
        >
          <ArrowLeft className="h-4 w-4" />
          {t("classeBack")}
        </Link>
      )}

      {!unified && (
        <div className="flex items-center gap-3">
          <Users className="h-8 w-8 text-violet-600" />
          <div>
            <h1 className="text-2xl font-black text-slate-900">{t("classeTitle")}</h1>
            <p className="text-sm text-slate-500">{t("classeSubtitle")}</p>
          </div>
        </div>
      )}

      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="grid flex-1 gap-3 sm:grid-cols-4">
          <div className="rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3">
            <p className="text-[10px] font-black uppercase text-emerald-800">{t("statDone")}</p>
            <p className="text-2xl font-black text-emerald-900">{stats.done}</p>
          </div>
          <div className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3">
            <p className="text-[10px] font-black uppercase text-amber-800">{t("statInProgress")}</p>
            <p className="text-2xl font-black text-amber-900">{stats.inProgress}</p>
          </div>
          <div className="rounded-xl border border-slate-200 bg-slate-50 px-4 py-3">
            <p className="text-[10px] font-black uppercase text-slate-600">{t("statPending")}</p>
            <p className="text-2xl font-black text-slate-900">{stats.pending}</p>
          </div>
          <div className="rounded-xl border border-violet-100 bg-violet-50 px-4 py-3">
            <p className="text-[10px] font-black uppercase text-violet-800">{t("statTotal")}</p>
            <p className="text-2xl font-black text-violet-900">{stats.total}</p>
          </div>
        </div>
        {(filtered.length > 0 || attemptRows.length > 0) && (
          <button
            type="button"
            onClick={exportCsv}
            className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2 text-xs font-black text-slate-700 hover:bg-slate-50"
          >
            <Download className="h-4 w-4" />
            {t("exportCsv")}
          </button>
        )}
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setLevelFilter("all")}
          className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase ${
            levelFilter === "all" ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-600"
          }`}
        >
          {t("assignAllLevels")}
        </button>
        {levels.map((level) => (
          <button
            key={level}
            type="button"
            onClick={() => setLevelFilter(level)}
            className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase ${
              levelFilter === level ? "bg-violet-600 text-white" : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            {level}
          </button>
        ))}
      </div>

      <div className="flex flex-wrap gap-2">
        {(["all", "pending", "in_progress", "done"] as const).map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatusFilter(s)}
            className={`rounded-full px-3 py-1.5 text-[10px] font-black uppercase ${
              statusFilter === s ? "bg-slate-900 text-white" : "border border-slate-200 bg-white text-slate-600"
            }`}
          >
            {s === "all" ? t("filter_all") : t(`status${s === "in_progress" ? "InProgress" : s === "pending" ? "Pending" : "Done"}`)}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("classeEmpty")}
        </p>
      ) : (
        <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
          <table className="w-full min-w-[720px] text-sm">
            <thead className="bg-violet-50 text-left text-[10px] font-black uppercase text-violet-900">
              <tr>
                <th className="px-4 py-3">{t("colStudent")}</th>
                <th className="px-4 py-3">{t("colLevel")}</th>
                <th className="px-4 py-3">{t("colResource")}</th>
                <th className="px-4 py-3">{t("colStatus")}</th>
                <th className="px-4 py-3">{t("colScore")}</th>
                <th className="px-4 py-3">{t("colDue")}</th>
                <th className="px-4 py-3">{t("colActions")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filtered.map((r) => (
                <tr key={r.progressId}>
                  <td className="px-4 py-3 font-bold text-slate-900">{r.childName}</td>
                  <td className="px-4 py-3 text-xs text-slate-600">{r.childLevel ?? r.resourceLevel ?? "—"}</td>
                  <td className="px-4 py-3 text-slate-700">{r.resourceTitle}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-black uppercase ${
                        r.status === "done"
                          ? "bg-emerald-100 text-emerald-800"
                          : r.status === "in_progress"
                            ? "bg-amber-100 text-amber-800"
                            : "bg-slate-100 text-slate-600"
                      }`}
                    >
                      {r.status === "done" ? (
                        <CheckCircle2 className="h-3 w-3" />
                      ) : r.status === "in_progress" ? (
                        <Clock className="h-3 w-3" />
                      ) : (
                        <AlertCircle className="h-3 w-3" />
                      )}
                      {r.status === "pending"
                        ? t("statusPending")
                        : r.status === "in_progress"
                          ? t("statusInProgress")
                          : t("statusDone")}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs font-bold text-slate-700">
                    {r.status === "done" && r.score != null ? (
                      <span className="inline-flex items-center gap-1">
                        {r.score}%
                        {r.stars != null ? (
                          <span className="text-amber-600">{"★".repeat(Math.min(3, r.stars))}</span>
                        ) : null}
                        {r.xpEarned != null ? (
                          <span className="text-teal-600">+{r.xpEarned} XP</span>
                        ) : null}
                      </span>
                    ) : (
                      "—"
                    )}
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {r.dueAt ? new Date(r.dueAt).toLocaleDateString(locale) : "—"}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-1">
                      <select
                        disabled={pending}
                        value={r.status}
                        onChange={(e) =>
                          updateStatus(r.progressId, e.target.value as "pending" | "in_progress" | "done")
                        }
                        className="rounded-lg border border-slate-200 px-2 py-1 text-xs font-bold"
                      >
                        <option value="pending">{t("statusPending")}</option>
                        <option value="in_progress">{t("statusInProgress")}</option>
                        <option value="done">{t("statusDone")}</option>
                      </select>
                      {r.status !== "done" && (
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => remind(r.progressId)}
                          className="inline-flex items-center gap-1 rounded-lg border border-violet-200 bg-violet-50 px-2 py-1 text-xs font-bold text-violet-800 hover:bg-violet-100"
                          title={t("remindParent")}
                        >
                          <Bell className="h-3 w-3" />
                          {t("remind")}
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {attemptRows.length > 0 && (
        <div className="space-y-3">
          <h2 className="text-lg font-black text-slate-900">
            {unified ? t("attemptsUnifiedTitle") : t("murAttemptsTitle")}
          </h2>
          <p className="text-sm text-slate-500">
            {unified ? t("attemptsUnifiedSubtitle") : t("murAttemptsSubtitle")}
          </p>
          <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
            <table className="w-full min-w-[800px] text-sm">
              <thead className="bg-teal-50 text-left text-[10px] font-black uppercase text-teal-900">
                <tr>
                  <th className="px-4 py-3">{t("colStudent")}</th>
                  <th className="px-4 py-3">{t("colResource")}</th>
                  {unified && <th className="px-4 py-3">{t("colSource")}</th>}
                  <th className="px-4 py-3">{t("colScore")}</th>
                  <th className="px-4 py-3">{t("colErrors")}</th>
                  <th className="px-4 py-3">{t("colDuration")}</th>
                  <th className="px-4 py-3">{t("colUpdated")}</th>
                  <th className="px-4 py-3">{t("colActions")}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(unified ? attemptRows : attemptRows.filter((a) => a.source === "mur")).map((a) => (
                  <tr key={a.id}>
                    <td className="px-4 py-3 font-bold text-slate-900">{a.childName ?? "—"}</td>
                    <td className="px-4 py-3 text-slate-700">{a.resourceTitle}</td>
                    {unified && (
                      <td className="px-4 py-3 text-xs font-bold text-slate-600">
                        {sourceLabel(a.source, t)}
                      </td>
                    )}
                    <td className="px-4 py-3 text-xs font-bold text-slate-700">
                      {a.score}%
                      {a.stars != null ? (
                        <span className="ml-1 text-amber-600">{"★".repeat(Math.min(3, a.stars))}</span>
                      ) : null}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-600">{a.errors ?? "—"}</td>
                    <td className="px-4 py-3 text-xs text-slate-600">
                      {a.durationSeconds != null ? `${a.durationSeconds}s` : "—"}
                    </td>
                    <td className="px-4 py-3 text-xs text-slate-500">
                      {new Date(a.completedAt).toLocaleString(locale)}
                    </td>
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => setDetailAttemptId(a.id)}
                        className="inline-flex items-center gap-1 rounded-lg bg-teal-50 px-2 py-1 text-[10px] font-black uppercase text-teal-800 hover:bg-teal-100"
                      >
                        <Eye className="h-3 w-3" />
                        {t("attemptDetail")}
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <ActivityAttemptDetailModal
        attemptId={detailAttemptId}
        locale={locale}
        onClose={() => setDetailAttemptId(null)}
      />
    </div>
  );
}

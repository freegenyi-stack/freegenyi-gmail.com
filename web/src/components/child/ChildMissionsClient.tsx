"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, CheckCircle2, Clock, FileText, Gamepad2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ChildMissionRow } from "@/lib/child/gamification.server";
import { isActivityKind } from "@/lib/authoring/types";

export default function ChildMissionsClient({
  childId,
  missions,
}: {
  childId: number;
  missions: ChildMissionRow[];
}) {
  const t = useTranslations("TeacherSpace.atelier.childMissions");
  const pending = missions.filter((m) => m.status !== "done");
  const done = missions.filter((m) => m.status === "done");

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white">
      <Link
        href={`/lobby/${childId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-slate-400 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" /> {t("backLobby")}
      </Link>
      <h1 className="mb-2 font-jakarta text-3xl font-black">{t("title")}</h1>
      <p className="mb-8 text-slate-400">{t("subtitle")}</p>

      {pending.length === 0 && done.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-white/20 p-8 text-center text-slate-400">{t("empty")}</p>
      ) : (
        <div className="space-y-8">
          {pending.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-orange-400">
                <Clock className="h-4 w-4" /> {t("pendingTitle", { count: pending.length })}
              </h2>
              <ul className="space-y-3">
                {pending.map((m) => {
                  const isActivity = isActivityKind(m.resourceKind);
                  return (
                    <li key={m.progressId}>
                      <Link
                        href={`/lobby/${childId}/missions/${m.progressId}`}
                        className="flex items-center justify-between gap-4 rounded-2xl border border-white/10 bg-white/5 p-4 transition hover:border-orange-500/50 hover:bg-orange-500/10"
                      >
                        <div className="flex items-center gap-3">
                          {isActivity ? (
                            <Gamepad2 className="h-8 w-8 text-orange-400" />
                          ) : (
                            <FileText className="h-8 w-8 text-sky-400" />
                          )}
                          <div>
                            <p className="font-black">{m.resourceTitle}</p>
                            {m.teacherName && <p className="text-xs text-slate-400">{m.teacherName}</p>}
                            {m.note && <p className="text-xs text-orange-200/80">{m.note}</p>}
                          </div>
                        </div>
                        <span className="shrink-0 rounded-full bg-orange-600 px-3 py-1 text-[10px] font-black uppercase">
                          {isActivity ? t("play") : t("read")}
                        </span>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </section>
          )}
          {done.length > 0 && (
            <section>
              <h2 className="mb-4 flex items-center gap-2 text-sm font-black uppercase tracking-widest text-emerald-400">
                <CheckCircle2 className="h-4 w-4" /> {t("doneTitle", { count: done.length })}
              </h2>
              <ul className="space-y-2">
                {done.map((m) => (
                  <li
                    key={m.progressId}
                    className="flex items-center justify-between rounded-xl border border-white/5 bg-white/5 px-4 py-3 text-sm"
                  >
                    <span>{m.resourceTitle}</span>
                    {m.xpEarned ? <span className="font-black text-orange-400">+{m.xpEarned} XP</span> : null}
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>
      )}
    </div>
  );
}

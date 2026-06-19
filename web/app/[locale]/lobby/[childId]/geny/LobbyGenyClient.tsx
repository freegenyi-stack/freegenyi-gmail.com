"use client";

import React, { useTransition } from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft, CheckCircle2 } from "lucide-react";
import type { ParentWorksheetRecord } from "@/lib/parent/parent-worksheets.server";
import { completeGenyWorksheetAction } from "@/lib/actions/parent-geny";

export default function LobbyGenyClient({
  childId,
  locale,
  worksheets,
  isRTL,
}: {
  childId: number;
  locale: string;
  worksheets: ParentWorksheetRecord[];
  isRTL: boolean;
}) {
  const [pending, startTransition] = useTransition();
  const [doneIds, setDoneIds] = React.useState<Set<number>>(new Set());

  const visible = worksheets.filter((w) => w.status === "pending" && !doneIds.has(w.id));

  return (
    <div className="min-h-[calc(100dvh-64px)] p-6 text-white" dir={isRTL ? "rtl" : "ltr"}>
      <Link
        href={`/lobby/${childId}`}
        className="mb-6 inline-flex items-center gap-2 text-sm font-bold text-teal-300 hover:text-white"
      >
        <ArrowLeft className="h-4 w-4" />
        {isRTL ? "العودة" : "Retour au lobby"}
      </Link>

      <h1 className="mb-2 text-3xl font-black">
        {isRTL ? "تمارين من الوالدين" : "Exercices de tes parents"}
      </h1>
      <p className="mb-8 text-teal-200/80">
        {isRTL ? "أنجز التمارين ثم اضغط « انتهيت »" : "Fais les exercices puis appuie sur « J'ai fini »"}
      </p>

      {visible.length === 0 ? (
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center text-slate-300">
          {isRTL ? "لا تمارين جديدة — bravo !" : "Aucun nouvel exercice — bravo !"}
        </div>
      ) : (
        <ul className="space-y-6">
          {visible.map((ws) => (
            <li key={ws.id} className="rounded-3xl border border-teal-500/30 bg-teal-950/40 p-6">
              {ws.sets.map((set) => (
                <div key={set.id} className="mb-6 last:mb-0">
                  <p className="text-xs font-black uppercase text-teal-400">
                    {isRTL ? set.subjectAr : set.subjectFr}
                  </p>
                  <h2 className="text-xl font-black">{isRTL ? set.titleAr : set.titleFr}</h2>
                  <p className="mt-2 text-sm text-slate-300">
                    {isRTL ? set.instructionsAr : set.instructionsFr}
                  </p>
                  <ol className="mt-4 space-y-3">
                    {set.questions.map((q, i) => (
                      <li key={i} className="rounded-xl bg-black/20 px-4 py-3 text-sm">
                        {i + 1}. {isRTL ? q.ar : q.fr}
                      </li>
                    ))}
                  </ol>
                </div>
              ))}
              <button
                type="button"
                disabled={pending}
                onClick={() => {
                  startTransition(async () => {
                    const res = await completeGenyWorksheetAction(ws.id, childId);
                    if (!res.error) setDoneIds((s) => new Set(s).add(ws.id));
                  });
                }}
                className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-teal-500 py-3 font-black text-slate-900 hover:bg-teal-400 disabled:opacity-50"
              >
                <CheckCircle2 className="h-5 w-5" />
                {isRTL ? "انتهيت!" : "J'ai fini !"}
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

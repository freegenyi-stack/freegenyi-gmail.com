"use client";

import React from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { LogOut, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActivityWrapper from "@/components/activities/ActivityWrapper";
import type { ActivityContentEnvelope, ActivityLang, ActivityResult } from "@/types/activity";

type Props = {
  envelope: ActivityContentEnvelope;
  langue: ActivityLang;
  activityId: number;
  onComplete?: (result: ActivityResult) => void | Promise<void>;
  backHref: string;
  requireSubmit?: boolean;
};

export default function ActivityImmersiveShell({
  envelope,
  langue,
  activityId,
  onComplete,
  backHref,
  requireSubmit = true,
}: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const router = useRouter();
  const [sessionKey, setSessionKey] = React.useState(0);
  const allowRetry = envelope.regles?.autoriserRefaire !== false;

  return (
    <div className="fixed inset-x-0 bottom-16 top-16 z-40 flex flex-col bg-slate-900/5 backdrop-blur-sm md:bottom-0 md:top-14">
      <div className="flex shrink-0 items-center justify-between gap-3 border-b border-slate-200 bg-white/95 px-4 py-3 shadow-sm">
        <Button type="button" variant="outline" size="sm" className="gap-2 rounded-xl" onClick={() => router.push(backHref)}>
          <LogOut className="h-4 w-4" /> {t("immersiveQuit")}
        </Button>
        <p className="truncate text-sm font-black text-slate-800">
          {langue === "ar" ? envelope.titre_ar || envelope.titre_fr : envelope.titre_fr || envelope.titre_ar}
        </p>
        {allowRetry && (
          <Button
            type="button"
            variant="outline"
            size="sm"
            className="gap-2 rounded-xl"
            onClick={() => setSessionKey((k) => k + 1)}
          >
            <RotateCcw className="h-4 w-4" /> {t("immersiveRetry")}
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto p-3 md:p-6">
        <div className="mx-auto max-w-3xl">
          {(envelope.instructions_fr || envelope.instructions_ar) && (
            <p className="mb-4 rounded-2xl border border-teal-100 bg-teal-50 px-4 py-3 text-sm font-medium text-teal-900">
              {langue === "ar" ? envelope.instructions_ar || envelope.instructions_fr : envelope.instructions_fr || envelope.instructions_ar}
            </p>
          )}
          <ActivityWrapper
            key={sessionKey}
            envelope={envelope}
            langue={langue}
            activityId={activityId}
            onComplete={onComplete}
            showTimer={envelope.regles?.afficherChrono === true}
            immersive
            requireSubmit={requireSubmit}
          />
        </div>
      </div>
    </div>
  );
}

"use client";

import React, { useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Heart, Loader2, Mic } from "lucide-react";
import { cn } from "@/lib/utils";
import { sendEmotionalBoostAction } from "@/lib/actions/parent-boost";
import ChatOpener from "@/components/ChatOpener";

type Props = {
  childId: number;
  childName: string;
  partnerId?: number | null;
  compact?: boolean;
};

export default function ParentEmotionalBoostButton({ childId, childName, partnerId, compact }: Props) {
  const t = useTranslations("ParentSpace.boost");
  const [pending, startTransition] = useTransition();
  const [sent, setSent] = useState(false);

  const sendBoost = () => {
    startTransition(async () => {
      const res = await sendEmotionalBoostAction(childId);
      if ("success" in res && res.success) setSent(true);
    });
  };

  const firstName = childName.split(" ")[0];

  if (compact) {
    return (
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          disabled={pending || sent}
          onClick={sendBoost}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-[10px] font-black uppercase tracking-widest transition",
            sent ? "bg-emerald-100 text-emerald-700" : "bg-orange-500 text-white hover:bg-orange-600"
          )}
        >
          {pending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <Heart className="h-3.5 w-3.5" />}
          {sent ? t("sent") : t("send")}
        </button>
        <ChatOpener
          voice
          boost
          geny
          userId={partnerId ?? undefined}
          childId={childId}
          childName={firstName}
          className="inline-flex items-center gap-2 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:border-orange-300"
        >
          <Mic className="h-3.5 w-3.5 text-blue-500" />
          {t("voice")}
        </ChatOpener>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-orange-100 bg-gradient-to-r from-orange-50 to-amber-50/60 p-5">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-white text-orange-600 shadow-sm">
            <Heart className="h-6 w-6" />
          </div>
          <div>
            <h4 className="text-sm font-black text-orange-950">{t("title")}</h4>
            <p className="text-xs font-medium text-orange-700">{t("desc", { name: firstName })}</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={pending || sent}
            onClick={sendBoost}
            className={cn(
              "rounded-xl px-5 py-3 text-[10px] font-black uppercase tracking-widest transition",
              sent ? "bg-emerald-600 text-white" : "bg-white text-orange-600 shadow-sm hover:bg-orange-600 hover:text-white"
            )}
          >
            {pending ? <Loader2 className="mx-auto h-4 w-4 animate-spin" /> : sent ? t("sent") : t("send")}
          </button>
          <ChatOpener
            voice
            boost
            geny
            userId={partnerId ?? undefined}
            childId={childId}
            childName={firstName}
            className="rounded-xl border border-orange-200 bg-white px-5 py-3 text-[10px] font-black uppercase tracking-widest text-slate-700 hover:bg-orange-50"
          >
            {t("voice")}
          </ChatOpener>
        </div>
      </div>
      {sent && <p className="mt-3 text-xs font-bold text-emerald-700">{t("sentHint", { name: firstName })}</p>}
    </div>
  );
}

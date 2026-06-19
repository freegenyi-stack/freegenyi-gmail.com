"use client";

import React, { useEffect, useState } from "react";
import { Send, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  defaultLabel: string;
  isRTL: boolean;
  t: (key: string, values?: Record<string, string>) => string;
  onCancel: () => void;
  onConfirm: (caption: string) => void;
};

export default function MediaCaptionModal({ open, defaultLabel, isRTL, t, onCancel, onConfirm }: Props) {
  const [caption, setCaption] = useState("");

  useEffect(() => {
    if (open) setCaption("");
  }, [open, defaultLabel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[410] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <div className={cn("w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl", isRTL && "font-ui-ar text-right")}>
        <div className={cn("mb-4 flex items-start justify-between", isRTL && "flex-row-reverse")}>
          <div>
            <h3 className="text-lg font-black text-slate-900">{t("mediaCaptionTitle")}</h3>
            <p className={cn("mt-1 text-sm text-slate-500", isRTL && "font-lateef")}>{t("mediaCaptionHint")}</p>
          </div>
          <button type="button" onClick={onCancel} className="rounded-lg p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <input
          value={caption}
          onChange={(e) => setCaption(e.target.value)}
          placeholder={defaultLabel}
          className={cn(
            "fg-glass-input mb-4 w-full rounded-xl px-4 py-3 text-sm font-medium text-slate-800 outline-none",
            isRTL && "text-right font-lateef"
          )}
        />
        <p className={cn("mb-4 text-xs text-slate-400", isRTL && "font-lateef")}>
          {t("mediaCaptionDefault", { label: defaultLabel })}
        </p>
        <div className={cn("flex gap-2", isRTL && "flex-row-reverse")}>
          <button
            type="button"
            onClick={() => onConfirm(caption.trim())}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700"
          >
            <Send className={cn("h-4 w-4", isRTL && "rotate-180")} />
            {t("mediaCaptionSend")}
          </button>
          <button type="button" onClick={onCancel} className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600">
            {t("profileClose")}
          </button>
        </div>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { X } from "lucide-react";
import { useLocale } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  title: string;
  body: string;
  onClose: () => void;
};

export default function FeatureSoonModal({ open, title, body, onClose }: Props) {
  const locale = useLocale();
  const isRTL = locale === "ar" || locale.endsWith("-ar");

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-center justify-center p-4" role="dialog" aria-modal="true">
      <button type="button" className="absolute inset-0 bg-slate-950/35 backdrop-blur-md" onClick={onClose} />
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={cn(
          "fg-glass-sheet relative w-full max-w-sm rounded-3xl border p-6 shadow-2xl",
          isRTL && "font-ui-ar text-right"
        )}
      >
        <button type="button" onClick={onClose} className="fg-glass-icon absolute end-4 top-4 size-9 text-slate-500">
          <X className="h-4 w-4" />
        </button>
        <h2 className="pe-8 text-lg font-black text-slate-900">{title}</h2>
        <p className="mt-3 text-sm font-medium leading-relaxed text-slate-600">{body}</p>
        <button type="button" onClick={onClose} className="fg-header-cta mt-6 w-full rounded-2xl py-3 text-sm font-bold text-white">
          OK
        </button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Globe, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  countryName?: string;
  onClose: () => void;
};

export default function CountryUnavailableModal({ open, countryName, onClose }: Props) {
  const t = useTranslations("RegionGate");
  const locale = useLocale();
  const isRTL = locale === "ar" || locale.endsWith("-ar");

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[300] flex items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="region-gate-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-slate-950/35 backdrop-blur-md"
        aria-label={t("close")}
        onClick={onClose}
      />
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={cn(
          "fg-glass-sheet relative w-full max-w-md rounded-3xl border p-6 shadow-2xl",
          isRTL && "font-ui-ar text-right"
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="fg-glass-icon absolute end-4 top-4 size-9 text-slate-500"
          aria-label={t("close")}
        >
          <X className="h-4 w-4" />
        </button>

        <div className={cn("mb-5 flex items-center gap-3", isRTL && "flex-row-reverse")}>
          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500/90 text-white shadow-lg shadow-orange-500/25">
            <Globe className="h-6 w-6" />
          </div>
          <div>
            <h2 id="region-gate-title" className="text-lg font-black text-slate-900">
              {t("title")}
            </h2>
            {countryName && (
              <p className="text-xs font-semibold text-orange-600">{countryName}</p>
            )}
          </div>
        </div>

        <p className="text-sm font-medium leading-relaxed text-slate-600">{t("body")}</p>
        <p className="mt-3 text-xs font-medium text-slate-400">{t("hint")}</p>

        <button
          type="button"
          onClick={onClose}
          className="fg-header-cta mt-6 w-full rounded-2xl py-3 text-sm font-bold text-white"
        >
          {t("understood")}
        </button>
      </div>
    </div>
  );
}

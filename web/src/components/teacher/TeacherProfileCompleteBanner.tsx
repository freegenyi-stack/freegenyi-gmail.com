"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations, useLocale } from "next-intl";
import { AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";

export default function TeacherProfileCompleteBanner({ complete }: { complete: boolean }) {
  const t = useTranslations("TeacherProfile");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";

  if (complete) return null;

  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 rounded-2xl border-2 border-teal-200 bg-teal-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        isRTL && "text-right sm:flex-row-reverse"
      )}
    >
      <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-teal-700" />
        <div>
          <p className="font-extrabold text-teal-950">{t("incompleteTitle")}</p>
          <p className="text-sm text-teal-900/80">{t("incompleteDesc")}</p>
        </div>
      </div>
      <Link
        href="/dashboard/enseignant/profil"
        className="shrink-0 rounded-xl bg-teal-600 px-5 py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-white hover:bg-teal-500"
      >
        {t("incompleteCta")}
      </Link>
    </div>
  );
}

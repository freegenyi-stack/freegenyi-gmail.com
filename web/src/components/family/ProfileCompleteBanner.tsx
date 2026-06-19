"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { AlertCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { cn } from "@/lib/utils";

export default function ProfileCompleteBanner({
  locale,
  role,
  complete,
}: {
  locale: string;
  role: string;
  complete: boolean;
}) {
  const t = useTranslations("CompleteProfile.banner");
  const isRTL = locale.endsWith("-ar") || locale === "ar";

  if (complete || role !== "coparent") return null;

  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 rounded-2xl border-2 border-orange-200 bg-orange-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        isRTL && "font-ui-ar text-right sm:flex-row-reverse"
      )}
    >
      <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-orange-700" />
        <div>
          <p className="font-extrabold text-orange-950">{t("title")}</p>
          <p className="text-sm text-orange-900/80">{t("desc")}</p>
        </div>
      </div>
      <Link
        href="/dashboard/complete-profile"
        className="shrink-0 rounded-xl bg-orange-600 px-5 py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-white hover:bg-orange-700"
      >
        {t("cta")}
      </Link>
    </div>
  );
}

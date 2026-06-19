"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { AlertTriangle } from "lucide-react";

export default function ExploreBanner() {
  const t = useTranslations("Explore");

  return (
    <div className="mb-6 flex flex-col gap-3 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 px-4 py-4 sm:flex-row sm:items-center sm:justify-between">
      <div className="flex items-start gap-3">
        <AlertTriangle className="mt-0.5 h-5 w-5 shrink-0 text-amber-600" />
        <div>
          <p className="font-black text-amber-950">{t("bannerTitle")}</p>
          <p className="mt-1 text-sm text-amber-900/80">{t("bannerDesc")}</p>
        </div>
      </div>
      <Link
        href="/auth/register"
        className="inline-flex shrink-0 items-center justify-center rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white hover:bg-amber-500"
      >
        {t("ctaSave")}
      </Link>
    </div>
  );
}

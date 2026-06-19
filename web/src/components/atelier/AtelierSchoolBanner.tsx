"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { AlertTriangle, School } from "lucide-react";
import { useTranslations } from "next-intl";

type Props = {
  hasSchool: boolean;
  childCount: number;
};

export default function AtelierSchoolBanner({ hasSchool, childCount }: Props) {
  const t = useTranslations("TeacherSpace.atelier");

  if (hasSchool && childCount > 0) return null;

  return (
    <div className="mb-6 rounded-2xl border border-amber-200 bg-gradient-to-r from-amber-50 to-orange-50 p-5">
      <div className="flex gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
          {hasSchool ? <AlertTriangle className="h-5 w-5" /> : <School className="h-5 w-5" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-black text-amber-950">{t("schoolBannerTitle")}</p>
          <p className="mt-1 text-sm text-amber-900/80">{t("schoolBannerDesc")}</p>
          <Link
            href="/dashboard/enseignant/profil"
            className="mt-3 inline-flex rounded-xl bg-amber-600 px-4 py-2 text-xs font-black text-white hover:bg-amber-500"
          >
            {t("schoolBannerCta")}
          </Link>
        </div>
      </div>
    </div>
  );
}

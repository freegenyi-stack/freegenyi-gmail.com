"use client";

import { useTransition } from "react";
import { useLocale, useTranslations } from "next-intl";
import { GraduationCap, Users } from "lucide-react";
import { startExploreSessionAction } from "@/lib/actions/explore";
import type { ExploreRole } from "@/lib/explore/constants";

export default function ExploreRolePicker() {
  const t = useTranslations("Explore");
  const locale = useLocale();
  const [pending, startTransition] = useTransition();

  const pick = (role: ExploreRole) => {
    startTransition(() => {
      void startExploreSessionAction(role, locale);
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-12">
      <div className="mb-10 text-center">
        <h1 className="font-reem text-3xl font-black text-slate-900 sm:text-4xl">{t("landingTitle")}</h1>
        <p className="mx-auto mt-3 max-w-xl text-sm text-slate-600 sm:text-base">{t("landingSubtitle")}</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <button
          type="button"
          disabled={pending}
          onClick={() => pick("parent")}
          className="group flex flex-col items-start gap-4 rounded-3xl border border-orange-200 bg-gradient-to-br from-orange-50 to-white p-6 text-start shadow-sm transition hover:border-orange-400 hover:shadow-md disabled:opacity-60"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-orange-600 text-white">
            <Users className="h-6 w-6" />
          </div>
          <div>
            <p className="font-black text-slate-900">{t("roleParent")}</p>
            <p className="mt-1 text-sm text-slate-600">{t("roleParentDesc")}</p>
          </div>
        </button>

        <button
          type="button"
          disabled={pending}
          onClick={() => pick("teacher")}
          className="group flex flex-col items-start gap-4 rounded-3xl border border-violet-200 bg-gradient-to-br from-violet-50 to-white p-6 text-start shadow-sm transition hover:border-violet-400 hover:shadow-md disabled:opacity-60"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-violet-600 text-white">
            <GraduationCap className="h-6 w-6" />
          </div>
          <div>
            <p className="font-black text-slate-900">{t("roleTeacher")}</p>
            <p className="mt-1 text-sm text-slate-600">{t("roleTeacherDesc")}</p>
          </div>
        </button>
      </div>

      <p className="mt-8 text-center text-xs text-slate-500">{t("landingHint")}</p>
    </div>
  );
}

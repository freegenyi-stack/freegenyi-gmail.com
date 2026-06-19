"use client";

import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { BookOpen, Compass, Hammer, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { ExploreRole } from "@/lib/explore/constants";

type Props = {
  role: ExploreRole;
};

export default function ExploreNav({ role }: Props) {
  const t = useTranslations("Explore");
  const base = role === "teacher" ? "/dashboard/explore/enseignant" : "/dashboard/explore/parent";

  return (
    <nav className="mb-8 flex flex-wrap items-center gap-2">
      <Link
        href={`${base}/atelier`}
        className="inline-flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-4 py-2 text-xs font-black text-violet-900 hover:bg-violet-100"
      >
        <Hammer className="h-4 w-4" />
        {t("navAtelier")}
      </Link>
      <Link
        href={`${base}/bibliotheque`}
        className="inline-flex items-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-4 py-2 text-xs font-black text-orange-900 hover:bg-orange-100"
      >
        <BookOpen className="h-4 w-4" />
        {t("navBibliotheque")}
      </Link>
      <Link
        href="/dashboard/explore"
        className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-xs font-bold text-slate-600 hover:bg-slate-50"
      >
        <Compass className="h-4 w-4" />
        {t("changeRole")}
      </Link>
      <Link href="/auth/register" className="ms-auto">
        <Button size="sm" className="gap-2 font-black">
          <LogIn className="h-4 w-4" />
          {t("ctaRegister")}
        </Button>
      </Link>
    </nav>
  );
}

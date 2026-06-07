"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { AlertCircle } from "lucide-react";
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
  const isRTL = locale.endsWith("-ar") || locale === "ar";

  if (complete || role !== "coparent") return null;

  return (
    <div
      className={cn(
        "mb-8 flex flex-col gap-3 rounded-2xl border-2 border-amber-200 bg-amber-50 px-5 py-4 sm:flex-row sm:items-center sm:justify-between",
        isRTL && "font-amiri text-right sm:flex-row-reverse"
      )}
    >
      <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
        <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        <div>
          <p className="font-extrabold text-amber-950">Profil incomplet</p>
          <p className="text-sm text-amber-900/80">
            Messagerie enseignant et gestion avancée sont bloquées jusqu&apos;à la vérification d&apos;identité.
          </p>
        </div>
      </div>
      <Link
        href="/dashboard/complete-profile"
        className="shrink-0 rounded-xl bg-amber-700 px-5 py-2.5 text-center text-xs font-extrabold uppercase tracking-wide text-white hover:bg-amber-800"
      >
        Compléter mon profil
      </Link>
    </div>
  );
}

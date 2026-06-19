"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { ShieldCheck } from "lucide-react";
import { cn } from "@/lib/utils";

export default function ParentVerificationBanner({
  status,
}: {
  status: "pending" | "rejected" | "approved" | null;
}) {
  const t = useTranslations("ParentSpace.verification");
  if (!status || status === "approved") return null;

  const isRejected = status === "rejected";

  return (
    <div
      className={cn(
        "mb-6 flex items-start gap-3 rounded-2xl border px-4 py-3 text-sm",
        isRejected ? "border-red-200 bg-red-50 text-red-900" : "border-amber-200 bg-amber-50 text-amber-950"
      )}
    >
      <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="font-black">{isRejected ? t("rejectedTitle") : t("pendingTitle")}</p>
        <p className="mt-1 text-xs opacity-90">{isRejected ? t("rejectedDesc") : t("pendingDesc")}</p>
      </div>
    </div>
  );
}

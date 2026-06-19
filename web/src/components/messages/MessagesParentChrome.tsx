"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { isParentRtl } from "@/lib/parent/parent-rtl";
import { cn } from "@/lib/utils";

export default function MessagesParentChrome({ children }: { children: React.ReactNode }) {
  const t = useTranslations("ParentSpace.messagesChrome");
  const locale = useLocale();
  const rtl = isParentRtl(locale);

  return (
    <div className="flex min-h-[calc(100dvh-var(--header-height,72px))] flex-col">
      <div
        dir={rtl ? "rtl" : "ltr"}
        className="flex shrink-0 items-center gap-2 border-b border-orange-100 bg-[#FFFBF7] px-3 py-2 sm:px-4"
      >
        <Link
          href="/dashboard/parent"
          className="inline-flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-black uppercase tracking-wide text-orange-700 transition hover:bg-orange-50"
        >
          <ArrowLeft className={cn("h-4 w-4", rtl && "rotate-180")} />
          {t("backToParent")}
        </Link>
      </div>
      <div className="min-h-0 flex-1">{children}</div>
    </div>
  );
}

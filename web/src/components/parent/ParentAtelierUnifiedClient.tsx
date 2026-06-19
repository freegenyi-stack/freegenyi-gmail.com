"use client";

import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";
import { Blocks, Gamepad2, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import { ParentPageHeader } from "@/components/parent/ParentShell";
import ParentGenyClient from "@/components/parent/ParentGenyClient";
import ParentAtelierClient from "@/components/atelier/ParentAtelierClient";
import AtelierHubClient from "@/components/atelier/AtelierHubClient";
import type { FamilyAuthoringAssignmentRow } from "@/lib/authoring/assignments.server";
import type { AuthoringFolderRow } from "@/lib/authoring/folders.server";
import type { AuthoringResourceDto } from "@/lib/authoring/types";

export type ParentAtelierTab = "geny" | "missions" | "create";

type ChildOption = {
  id: number;
  fullName: string;
  educationLevel: string | null;
};

type Props = {
  children: ChildOption[];
  selectedChildId: number | null;
  assignments: FamilyAuthoringAssignmentRow[];
  highlightAssignmentId?: number | null;
  resources: AuthoringResourceDto[];
  folders: AuthoringFolderRow[];
  showCreateTab: boolean;
  initialTab?: ParentAtelierTab;
};

const TABS: { id: ParentAtelierTab; icon: React.ElementType }[] = [
  { id: "geny", icon: Sparkles },
  { id: "missions", icon: Gamepad2 },
  { id: "create", icon: Blocks },
];

export default function ParentAtelierUnifiedClient({
  children,
  selectedChildId,
  assignments,
  highlightAssignmentId,
  resources,
  folders,
  showCreateTab,
  initialTab = "geny",
}: Props) {
  const t = useTranslations("ParentSpace.atelierUnified");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const router = useRouter();
  const searchParams = useSearchParams();

  const tabParam = searchParams.get("tab") as ParentAtelierTab | null;
  const activeTab: ParentAtelierTab =
    tabParam === "geny" || tabParam === "missions" || tabParam === "create"
      ? tabParam === "create" && !showCreateTab
        ? "geny"
        : tabParam
      : initialTab;

  const setTab = (tab: ParentAtelierTab) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("tab", tab);
    if (tab !== "missions") params.delete("assignment");
    router.replace(`/${locale}/dashboard/parent/atelier?${params.toString()}`, { scroll: false });
  };

  const visibleTabs = TABS.filter((tab) => tab.id !== "create" || showCreateTab);

  return (
    <div dir={isRTL ? "rtl" : "ltr"}>
      <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />

      <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-orange-100/80 bg-[#FFFBF7] p-1.5 shadow-sm">
        {visibleTabs.map(({ id, icon: Icon }) => (
          <button
            key={id}
            type="button"
            onClick={() => setTab(id)}
            className={cn(
              "inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-3 py-3 text-xs font-black uppercase tracking-wider transition sm:flex-none sm:px-5",
              activeTab === id
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/25"
                : "text-slate-600 hover:bg-white hover:text-orange-800"
            )}
          >
            <Icon className="h-4 w-4 shrink-0" />
            {t(`tab_${id}`)}
          </button>
        ))}
      </div>

      {activeTab === "geny" && (
        <ParentGenyClient children={children} selectedChildId={selectedChildId} embedded />
      )}

      {activeTab === "missions" && (
        <ParentAtelierClient
          assignments={assignments}
          highlightAssignmentId={highlightAssignmentId}
          hideTitle
        />
      )}

      {activeTab === "create" && showCreateTab && (
        <AtelierHubClient mode="parent" resources={resources} folders={folders} />
      )}
    </div>
  );
}

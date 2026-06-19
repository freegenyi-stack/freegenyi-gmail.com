"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ChevronDown, Users } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ChildOption = { id: number; fullName: string; educationLevel: string | null };

export default function ParentChildSwitcher({ inline = false }: { inline?: boolean }) {
  const t = useTranslations("ParentSpace.header");
  const router = useRouter();
  const [children, setChildren] = useState<ChildOption[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/parent/children")
      .then((r) => r.json())
      .then((data) => {
        if (data.children) {
          setChildren(data.children);
          const stored = document.cookie
            .split("; ")
            .find((row) => row.startsWith("fg_parent_child_id="))
            ?.split("=")[1];
          const parsed = stored ? parseInt(stored, 10) : NaN;
          const valid = !Number.isNaN(parsed) && data.children.some((c: ChildOption) => c.id === parsed);
          setSelectedId(valid ? parsed : data.children[0]?.id ?? null);
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  const selected = children.find((c) => c.id === selectedId);

  const selectChild = async (childId: number) => {
    setSelectedId(childId);
    await fetch("/api/parent/selected-child", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ childId }),
    });
    router.refresh();
  };

  if (loading || children.length === 0) return null;

  if (children.length === 1 && selected) {
    return (
      <div
        className={cn(
          "items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3 py-1.5",
          inline ? "inline-flex" : "hidden lg:flex"
        )}
      >
        <span className="text-lg">🦊</span>
        <span className="max-w-[8rem] truncate text-xs font-black text-orange-900">{selected.fullName.split(" ")[0]}</span>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className={cn(
            "items-center gap-2 rounded-full border border-orange-200/80 bg-orange-50/80 px-3 py-1.5 text-xs font-black text-orange-900 transition hover:border-orange-300",
            inline ? "inline-flex" : "hidden lg:inline-flex"
          )}
        >
          <Users className="h-3.5 w-3.5" />
          <span className="max-w-[7rem] truncate">{selected?.fullName.split(" ")[0] ?? t("selectChild")}</span>
          <ChevronDown className="h-3.5 w-3.5 opacity-60" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent
        align="center"
        className="w-56 rounded-2xl border border-orange-100/80 bg-[#FFFBF7]/95 p-2 shadow-xl backdrop-blur-xl"
      >
        <p className="px-2 py-1 text-[10px] font-black uppercase tracking-widest text-slate-400">{t("switchChild")}</p>
        {children.map((c) => (
          <DropdownMenuItem
            key={c.id}
            onClick={() => selectChild(c.id)}
            className={cn(
              "cursor-pointer rounded-xl px-3 py-2 font-bold",
              c.id === selectedId ? "bg-orange-50 text-orange-800" : "text-slate-700"
            )}
          >
            <span className="me-2">🦊</span>
            {c.fullName}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

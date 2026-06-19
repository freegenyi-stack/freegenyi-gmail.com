"use client";

import React, { useMemo, useState } from "react";
import { useTranslations } from "next-intl";
import {
  ChevronDown,
  Gamepad2,
  Layers,
  ListChecks,
  Move,
  Search,
  TextCursorInput,
  ToggleLeft,
  Video,
  type LucideIcon,
} from "lucide-react";
import { getH5pTypeLabel } from "@/lib/authoring/h5p-type-labels";
import type { H5pActivityTypeDto } from "@/lib/authoring/h5p.server";

const ICON_MAP: Record<string, LucideIcon> = {
  "list-checks": ListChecks,
  "text-cursor-input": TextCursorInput,
  move: Move,
  layers: Layers,
  "toggle-left": ToggleLeft,
  video: Video,
};

export type ActivityPickerItem = {
  machineName: string;
  title: string;
  description: string;
  icon?: string | null;
  hubIcon?: string | null;
  installed?: boolean;
  lucideIcon?: string;
};

type Props = {
  types: ActivityPickerItem[];
  value: string;
  onChange: (machineName: string) => void;
  locale: string;
  compact?: boolean;
};

function TypeIcon({ item }: { item: ActivityPickerItem }) {
  if (item.hubIcon) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={item.hubIcon}
        alt=""
        className="h-8 w-8 shrink-0 rounded-lg border border-slate-100 bg-white p-1"
      />
    );
  }
  const Lucide = item.lucideIcon ? ICON_MAP[item.lucideIcon] : Gamepad2;
  const Icon = Lucide ?? Gamepad2;
  return (
    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-teal-50 text-teal-700">
      <Icon className="h-4 w-4" />
    </span>
  );
}

export default function AtelierActivityTypePicker({ types, value, onChange, locale, compact }: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const enriched = useMemo(
    () =>
      types.map((item) => {
        const label = getH5pTypeLabel(item.machineName, locale, item.title, item.description);
        return { ...item, displayTitle: label.title, displayDescription: label.description || item.description };
      }),
    [types, locale]
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return enriched;
    return enriched.filter(
      (item) =>
        item.displayTitle.toLowerCase().includes(q) ||
        item.displayDescription.toLowerCase().includes(q) ||
        item.machineName.toLowerCase().includes(q)
    );
  }, [enriched, query]);

  const selected = enriched.find((item) => item.machineName === value) ?? enriched[0];

  return (
    <div className="relative">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex w-full items-center gap-3 rounded-xl border border-slate-200 bg-white px-3 py-2.5 text-left shadow-sm transition hover:border-teal-300"
      >
        {selected ? <TypeIcon item={selected} /> : null}
        <span className="min-w-0 flex-1">
          <span className="block truncate text-sm font-black text-slate-900">
            {selected?.displayTitle ?? t("pickActivityType")}
          </span>
          {!compact && selected?.displayDescription ? (
            <span className="block truncate text-[11px] text-slate-500">{selected.displayDescription}</span>
          ) : null}
        </span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-slate-400 transition ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <div className="absolute z-30 mt-2 w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-xl">
          <div className="border-b border-slate-100 p-2">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={t("searchActivityType")}
                className="w-full rounded-xl border border-slate-200 py-2 pl-9 pr-3 text-sm"
              />
            </div>
          </div>
          <ul className="max-h-64 overflow-y-auto p-1">
            {filtered.length === 0 ? (
              <li className="px-3 py-6 text-center text-xs text-slate-400">{t("noActivityTypeMatch")}</li>
            ) : (
              filtered.map((item) => (
                <li key={item.machineName}>
                  <button
                    type="button"
                    onClick={() => {
                      onChange(item.machineName);
                      setOpen(false);
                      setQuery("");
                    }}
                    className={`flex w-full items-start gap-3 rounded-xl px-3 py-2.5 text-left transition ${
                      value === item.machineName ? "bg-teal-50 ring-1 ring-teal-200" : "hover:bg-slate-50"
                    }`}
                  >
                    <TypeIcon item={item} />
                    <span className="min-w-0 flex-1">
                      <span className="block text-sm font-black text-slate-900">{item.displayTitle}</span>
                      <span className="mt-0.5 block text-[11px] leading-snug text-slate-500">
                        {item.displayDescription}
                      </span>
                      {item.installed === false && (
                        <span className="mt-1 inline-block text-[10px] font-bold text-amber-700">
                          {t("typeNotInstalled")}
                        </span>
                      )}
                    </span>
                  </button>
                </li>
              ))
            )}
          </ul>
        </div>
      )}
    </div>
  );
}

export function mapHubTypesToPicker(types: H5pActivityTypeDto[]): ActivityPickerItem[] {
  return types.map((t) => ({
    machineName: t.machineName,
    title: t.title,
    description: t.description || t.summary,
    hubIcon: t.icon,
    installed: t.installed,
  }));
}

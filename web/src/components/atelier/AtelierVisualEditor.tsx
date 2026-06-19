"use client";

import React, { useEffect, useRef, useState } from "react";
import "@blueprintjs/core/lib/css/blueprint.css";
import { createStore } from "openpolotno/model/store";
import { RaeditorApp } from "openpolotno";
import { configureOpenPolotno } from "@/lib/authoring/openpolotno-setup";
import { hydrateVisualStore } from "@/lib/authoring/visual-store-init";
import { OPENPOLOTNO_KEY, OPENPOLOTNO_SECTIONS } from "@/lib/authoring/visual-config";
import type { OpenPolotnoStore } from "openpolotno/model/store";
import { cn } from "@/lib/utils";

export type VisualEditorStore = OpenPolotnoStore;

type Props = {
  resourceId: number;
  locale: string;
  initialJson: string;
  fullHeight?: boolean;
  onChange: (json: string) => void;
  onReady?: (store: VisualEditorStore) => void;
};

export default function AtelierVisualEditor({
  resourceId,
  locale,
  initialJson,
  fullHeight = false,
  onChange,
  onReady,
}: Props) {
  const [store, setStore] = useState<VisualEditorStore | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;
  const initialJsonRef = useRef(initialJson);
  initialJsonRef.current = initialJson;

  useEffect(() => {
    configureOpenPolotno(locale);

    const s = createStore({ key: OPENPOLOTNO_KEY, showCredit: false });
    hydrateVisualStore(s, initialJsonRef.current);

    const unsub = s.on("change", () => {
      onChangeRef.current(JSON.stringify(s.toJSON()));
    });

    setStore(s);
    onReady?.(s);

    return () => {
      unsub?.();
      setStore(null);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- remount only when resource changes
  }, [resourceId, locale]);

  if (!store) {
    return (
      <div
        className={cn(
          "flex h-full min-h-[480px] items-center justify-center bg-[#e8e8e8]",
          !fullHeight && "rounded-2xl border border-slate-200"
        )}
      >
        <p className="text-sm font-bold text-slate-500">…</p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "atelier-visual-editor h-full w-full min-h-[480px] overflow-hidden",
        "[&_.raeditor-app-container]:!flex [&_.raeditor-app-container]:!h-full [&_.raeditor-app-container]:!min-h-[480px] [&_.raeditor-app-container]:!w-full",
        "[&_.raeditor-workspace-container]:!min-h-[420px] [&_.raeditor-workspace-container]:!flex-1",
        "[&_.raeditor-download-button]:!hidden",
        fullHeight
          ? "bg-[#e8e8e8] [&_.raeditor-app-container]:!rounded-none"
          : "rounded-2xl border border-slate-200 bg-white shadow-inner"
      )}
    >
      <RaeditorApp
        store={store}
        sections={[...OPENPOLOTNO_SECTIONS]}
        style={{ width: "100%", height: "100%", minHeight: 480 }}
      />
    </div>
  );
}

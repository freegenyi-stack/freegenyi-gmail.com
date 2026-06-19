"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ExcalidrawImperativeAPI } from "@excalidraw/excalidraw/types";
import {
  parseMindmapContent,
  serializeMindmapContent,
  type MindmapContentV2,
  type MindmapEditorMode,
} from "@/lib/authoring/mindmap-content";
import { cn } from "@/lib/utils";

export type MindmapEditorHandle = {
  mode: MindmapEditorMode;
  exportPng: (fileName: string) => Promise<void>;
  exportSvg: (fileName: string) => void;
};

type Props = {
  resourceId: number;
  locale: string;
  initialJson: string;
  readOnly?: boolean;
  onChange: (json: string) => void;
  onReady?: (api: MindmapEditorHandle) => void;
};

function downloadBlob(blob: Blob, fileName: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = fileName;
  a.click();
  URL.revokeObjectURL(url);
}

function ExcalidrawPane({
  content,
  readOnly,
  onChange,
  onReady,
}: {
  content: MindmapContentV2;
  readOnly: boolean;
  onChange: (json: string) => void;
  onReady: (api: MindmapEditorHandle) => void;
}) {
  const [ExcalidrawComponent, setExcalidrawComponent] = useState<React.ComponentType<any> | null>(null);
  const [helpers, setHelpers] = useState<{
    serializeAsJSON: typeof import("@excalidraw/excalidraw").serializeAsJSON;
    restoreElements: typeof import("@excalidraw/excalidraw").restoreElements;
    restoreAppState: typeof import("@excalidraw/excalidraw").restoreAppState;
    exportToBlob: typeof import("@excalidraw/excalidraw").exportToBlob;
  } | null>(null);
  const apiRef = useRef<ExcalidrawImperativeAPI | null>(null);
  const onChangeRef = useRef(onChange);
  onChangeRef.current = onChange;

  useEffect(() => {
    (window as Window & { EXCALIDRAW_ASSET_PATH?: string }).EXCALIDRAW_ASSET_PATH = window.origin;
  }, []);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      await import("@excalidraw/excalidraw/index.css");
      const mod = await import("@excalidraw/excalidraw");
      if (cancelled) return;
      setExcalidrawComponent(() => mod.Excalidraw);
      setHelpers({
        serializeAsJSON: mod.serializeAsJSON,
        restoreElements: mod.restoreElements,
        restoreAppState: mod.restoreAppState,
        exportToBlob: mod.exportToBlob,
      });
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!helpers) return;
    onReady({
      mode: "excalidraw",
      exportPng: async (fileName: string) => {
        const api = apiRef.current;
        if (!api) return;
        const blob = await helpers.exportToBlob({
          elements: api.getSceneElements(),
          appState: api.getAppState(),
          files: api.getFiles(),
          mimeType: "image/png",
        });
        downloadBlob(blob, fileName.endsWith(".png") ? fileName : `${fileName}.png`);
      },
      exportSvg: (fileName: string) => {
        const api = apiRef.current;
        if (!api || !helpers) return;
        const json = helpers.serializeAsJSON(
          api.getSceneElements(),
          api.getAppState(),
          api.getFiles(),
          "local"
        );
        downloadBlob(new Blob([json], { type: "application/json" }), `${fileName}.excalidraw.json`);
      },
    });
  }, [helpers, onReady]);

  const initialData = useMemo(() => {
    if (!helpers) return null;
    const scene = content.excalidraw ?? { elements: [], appState: {}, files: {} };
    return {
      elements: helpers.restoreElements((scene.elements ?? []) as never[], null),
      appState: helpers.restoreAppState(scene.appState ?? {}, null),
      files: scene.files ?? {},
    };
  }, [content, helpers]);

  const handleChange = useCallback(
    (elements: readonly unknown[], appState: Record<string, unknown>, files: Record<string, unknown>) => {
      if (readOnly) return;
      onChangeRef.current(
        serializeMindmapContent({
          schemaVersion: 2,
          mode: "excalidraw",
          excalidraw: {
            elements: [...elements],
            appState,
            files,
          },
        })
      );
    },
    [readOnly]
  );

  if (!ExcalidrawComponent || !initialData) {
    return (
      <div className="flex h-full min-h-[480px] items-center justify-center bg-white">
        <p className="text-sm font-bold text-slate-500">…</p>
      </div>
    );
  }

  const Excalidraw = ExcalidrawComponent;

  return (
    <div className="h-full w-full min-h-[480px]">
      <Excalidraw
        excalidrawAPI={(api: ExcalidrawImperativeAPI) => {
          apiRef.current = api;
        }}
        initialData={initialData}
        onChange={handleChange}
        viewModeEnabled={readOnly}
        zenModeEnabled={false}
        gridModeEnabled={false}
        UIOptions={{
          canvasActions: {
            changeViewBackgroundColor: !readOnly,
            clearCanvas: !readOnly,
            export: false,
            loadScene: false,
            saveToActiveFile: false,
            toggleTheme: true,
          },
        }}
      />
    </div>
  );
}

function MarkmapPane({
  content,
  readOnly,
  onChange,
  onReady,
}: {
  content: MindmapContentV2;
  readOnly: boolean;
  onChange: (json: string) => void;
  onReady: (api: MindmapEditorHandle) => void;
}) {
  const svgRef = useRef<SVGSVGElement>(null);
  const mmRef = useRef<import("markmap-view").Markmap | null>(null);
  const transformerRef = useRef<InstanceType<typeof import("markmap-lib").Transformer> | null>(null);
  const [markdown, setMarkdown] = useState(content.markdown ?? "# Sujet\n");

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const { Transformer } = await import("markmap-lib");
      const { Markmap } = await import("markmap-view");
      if (cancelled || !svgRef.current) return;
      transformerRef.current = new Transformer();
      mmRef.current = Markmap.create(svgRef.current);
      onReady({
        mode: "markmap",
        exportPng: async (fileName: string) => {
          const svg = svgRef.current;
          if (!svg) return;
          const xml = new XMLSerializer().serializeToString(svg);
          const img = new Image();
          const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
          const url = URL.createObjectURL(blob);
          await new Promise<void>((resolve, reject) => {
            img.onload = () => {
              const canvas = document.createElement("canvas");
              canvas.width = svg.clientWidth || 1200;
              canvas.height = svg.clientHeight || 800;
              const ctx = canvas.getContext("2d");
              if (!ctx) {
                reject(new Error("canvas"));
                return;
              }
              ctx.fillStyle = "#ffffff";
              ctx.fillRect(0, 0, canvas.width, canvas.height);
              ctx.drawImage(img, 0, 0);
              canvas.toBlob((png) => {
                if (png) downloadBlob(png, fileName.endsWith(".png") ? fileName : `${fileName}.png`);
                URL.revokeObjectURL(url);
                resolve();
              }, "image/png");
            };
            img.onerror = reject;
            img.src = url;
          });
        },
        exportSvg: (fileName: string) => {
          const svg = svgRef.current;
          if (!svg) return;
          const xml = new XMLSerializer().serializeToString(svg);
          downloadBlob(
            new Blob([xml], { type: "image/svg+xml;charset=utf-8" }),
            fileName.endsWith(".svg") ? fileName : `${fileName}.svg`
          );
        },
      });
    })();
    return () => {
      cancelled = true;
    };
  }, [onReady]);

  useEffect(() => {
    const transformer = transformerRef.current;
    const mm = mmRef.current;
    if (!transformer || !mm) return;
    const { root } = transformer.transform(markdown);
    mm.setData(root);
    mm.fit();
  }, [markdown]);

  const persistMarkdown = (next: string) => {
    setMarkdown(next);
    onChange(
      serializeMindmapContent({
        schemaVersion: 2,
        mode: "markmap",
        markdown: next,
      })
    );
  };

  return (
    <div className="flex h-full min-h-[480px] flex-col lg:flex-row">
      {!readOnly && (
        <div className="flex w-full shrink-0 flex-col border-b border-slate-200 bg-white lg:w-[340px] lg:border-b-0 lg:border-r">
          <p className="border-b border-slate-100 px-3 py-2 text-[10px] font-black uppercase tracking-wider text-slate-500">
            Markdown
          </p>
          <textarea
            value={markdown}
            onChange={(e) => persistMarkdown(e.target.value)}
            className="min-h-[180px] flex-1 resize-none bg-slate-50 p-3 font-mono text-xs leading-relaxed text-slate-800 focus:outline-none lg:min-h-0"
            spellCheck={false}
          />
        </div>
      )}
      <div className="relative min-h-0 flex-1 bg-white">
        <svg ref={svgRef} className="h-full w-full min-h-[320px]" />
      </div>
    </div>
  );
}

export default function AtelierMindmapEditor({
  resourceId,
  locale,
  initialJson,
  readOnly = false,
  onChange,
  onReady,
}: Props) {
  const isAr = locale.startsWith("ar") || locale.endsWith("-ar");
  const content = useMemo(
    () => parseMindmapContent(initialJson, isAr ? "الموضوع" : "Sujet"),
    [initialJson, isAr, resourceId]
  );

  const handleReady = onReady ?? (() => {});

  return (
    <div
      className={cn(
        "atelier-mindmap-editor h-full w-full min-h-[480px] overflow-hidden",
        content.mode === "excalidraw" ? "bg-white" : "bg-slate-50"
      )}
    >
      {content.mode === "excalidraw" ? (
        <ExcalidrawPane content={content} readOnly={readOnly} onChange={onChange} onReady={handleReady} />
      ) : (
        <MarkmapPane content={content} readOnly={readOnly} onChange={onChange} onReady={handleReady} />
      )}
    </div>
  );
}

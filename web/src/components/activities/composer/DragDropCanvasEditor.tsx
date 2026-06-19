"use client";

import React, { useCallback, useRef, useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import type { DragDropZone } from "@/types/activity";
import { COMPOSER_LABELS, TextField, unifiedText } from "./composerShared";

type Props = {
  imageUrl?: string | null;
  zones: DragDropZone[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onUpdateZone: (index: number, patch: Partial<DragDropZone>) => void;
  onRemoveZone: (index: number) => void;
  onAddZone: () => void;
  onAddZoneAt: (pos: { x_percent: number; y_percent: number; width_percent: number; height_percent: number }) => void;
};

const DEFAULT_W = 22;
const DEFAULT_H = 16;

export default function DragDropCanvasEditor({
  imageUrl,
  zones,
  selectedIndex,
  onSelect,
  onUpdateZone,
  onRemoveZone,
  onAddZone,
  onAddZoneAt,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragMode, setDragMode] = useState<"move" | "resize" | null>(null);
  const dragStart = useRef<{ x: number; y: number; zone: DragDropZone } | null>(null);

  const placeZone = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(100 - DEFAULT_W / 2, ((clientX - rect.left) / rect.width) * 100 - DEFAULT_W / 2));
      const y = Math.max(0, Math.min(100 - DEFAULT_H / 2, ((clientY - rect.top) / rect.height) * 100 - DEFAULT_H / 2));
      onAddZoneAt({
        x_percent: Math.round(x * 10) / 10,
        y_percent: Math.round(y * 10) / 10,
        width_percent: DEFAULT_W,
        height_percent: DEFAULT_H,
      });
    },
    [onAddZoneAt]
  );

  const onPointerDownZone = (e: React.PointerEvent, index: number, mode: "move" | "resize") => {
    e.stopPropagation();
    onSelect(index);
    setDragMode(mode);
    dragStart.current = { x: e.clientX, y: e.clientY, zone: { ...zones[index] } };
    (e.target as HTMLElement).setPointerCapture(e.pointerId);
  };

  const onPointerMove = (e: React.PointerEvent) => {
    if (!dragMode || !dragStart.current || selectedIndex < 0) return;
    const el = containerRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const dx = ((e.clientX - dragStart.current.x) / rect.width) * 100;
    const dy = ((e.clientY - dragStart.current.y) / rect.height) * 100;
    const base = dragStart.current.zone;

    if (dragMode === "move") {
      onUpdateZone(selectedIndex, {
        x_percent: Math.max(0, Math.min(100 - (base.width_percent ?? DEFAULT_W), (base.x_percent ?? 0) + dx)),
        y_percent: Math.max(0, Math.min(100 - (base.height_percent ?? DEFAULT_H), (base.y_percent ?? 0) + dy)),
      });
    } else {
      onUpdateZone(selectedIndex, {
        width_percent: Math.max(8, Math.min(60, (base.width_percent ?? DEFAULT_W) + dx)),
        height_percent: Math.max(8, Math.min(40, (base.height_percent ?? DEFAULT_H) + dy)),
      });
    }
  };

  const endDrag = () => {
    setDragMode(null);
    dragStart.current = null;
  };

  const zone = zones[selectedIndex];

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs font-bold text-slate-500">
          Cliquez sur le canvas pour ajouter une zone · faites glisser pour déplacer · coin bas-droit pour redimensionner
        </p>
        <button
          type="button"
          onClick={onAddZone}
          className="inline-flex items-center gap-1 rounded-lg border border-slate-200 px-2 py-1 text-[10px] font-black uppercase"
        >
          <Plus className="h-3 w-3" /> Zone
        </button>
      </div>

      <div
        ref={containerRef}
        className="relative mx-auto aspect-video max-w-2xl cursor-crosshair overflow-hidden rounded-2xl border border-slate-200 bg-gradient-to-br from-slate-100 to-slate-50"
        onClick={(e) => {
          if ((e.target as HTMLElement).dataset.canvas === "bg") placeZone(e.clientX, e.clientY);
        }}
        onPointerMove={onPointerMove}
        onPointerUp={endDrag}
        onPointerLeave={endDrag}
      >
        {imageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={imageUrl} alt="" className="absolute inset-0 h-full w-full object-contain" draggable={false} data-canvas="bg" />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-slate-400" data-canvas="bg">
            Canvas sans image — ajoutez une image de fond ci-dessous
          </div>
        )}

        {zones.map((z, i) => (
          <div
            key={z.id}
            className={`absolute rounded-xl border-2 border-dashed transition-shadow ${
              i === selectedIndex ? "border-teal-500 bg-teal-400/25 ring-2 ring-teal-300" : "border-violet-400 bg-violet-400/20"
            }`}
            style={{
              left: `${z.x_percent ?? 10 + i * 12}%`,
              top: `${z.y_percent ?? 20}%`,
              width: `${z.width_percent ?? DEFAULT_W}%`,
              height: `${z.height_percent ?? DEFAULT_H}%`,
              backgroundColor: z.couleur_fond ?? undefined,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(i);
            }}
            onPointerDown={(e) => onPointerDownZone(e, i, "move")}
          >
            <span className="pointer-events-none absolute inset-0 flex items-center justify-center p-1 text-center text-[10px] font-black text-slate-800">
              {z.icone && <span className="mr-1">{z.icone}</span>}
              {unifiedText(z.label_fr, z.label_ar) || `${COMPOSER_LABELS.zone} ${i + 1}`}
            </span>
            {i === selectedIndex && (
              <span
                className="absolute bottom-0 right-0 h-4 w-4 cursor-se-resize rounded-tl bg-teal-600"
                onPointerDown={(e) => onPointerDownZone(e, i, "resize")}
              />
            )}
          </div>
        ))}
      </div>

      {zone && selectedIndex >= 0 && (
        <div className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 md:grid-cols-2">
          <TextField
            label={`${COMPOSER_LABELS.label} FR`}
            value={zone.label_fr}
            onChange={(v) => onUpdateZone(selectedIndex, { label_fr: v, label_ar: v })}
          />
          <TextField
            label="Couleur fond"
            value={zone.couleur_fond ?? "#E0E7FF"}
            onChange={(v) => onUpdateZone(selectedIndex, { couleur_fond: v })}
          />
          <TextField
            label="Icône (emoji)"
            value={zone.icone ?? ""}
            onChange={(v) => onUpdateZone(selectedIndex, { icone: v })}
          />
          <div className="flex items-end">
            {zones.length > 1 && (
              <button
                type="button"
                onClick={() => onRemoveZone(selectedIndex)}
                className="inline-flex items-center gap-1 rounded-lg border border-red-200 px-3 py-2 text-xs font-bold text-red-600"
              >
                <Trash2 className="h-3.5 w-3.5" /> Supprimer zone
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

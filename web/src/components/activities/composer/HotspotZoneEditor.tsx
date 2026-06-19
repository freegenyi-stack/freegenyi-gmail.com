"use client";

import React, { useCallback, useRef, useState } from "react";
import type { ImageHotspotContent } from "@/types/activity";
import { COMPOSER_LABELS, TextField, unifiedText } from "./composerShared";

type Zone = ImageHotspotContent["zones"][number];

type Props = {
  imageUrl: string;
  zones: Zone[];
  selectedIndex: number;
  onSelect: (index: number) => void;
  onUpdateZone: (index: number, patch: Partial<Zone>) => void;
};

export default function HotspotZoneEditor({
  imageUrl,
  zones,
  selectedIndex,
  onSelect,
  onUpdateZone,
}: Props) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dragging, setDragging] = useState(false);

  const placeAt = useCallback(
    (clientX: number, clientY: number) => {
      const el = containerRef.current;
      if (!el || selectedIndex < 0) return;
      const rect = el.getBoundingClientRect();
      const x = Math.max(0, Math.min(100, ((clientX - rect.left) / rect.width) * 100));
      const y = Math.max(0, Math.min(100, ((clientY - rect.top) / rect.height) * 100));
      onUpdateZone(selectedIndex, {
        x_percent: Math.round(x * 10) / 10,
        y_percent: Math.round(y * 10) / 10,
      });
    },
    [onUpdateZone, selectedIndex]
  );

  const zone = zones[selectedIndex];

  return (
    <div className="space-y-3">
      <p className="text-xs font-bold text-slate-500">
        Cliquez sur l&apos;image pour placer la zone sélectionnée · faites glisser le cercle pour ajuster
      </p>
      <div
        ref={containerRef}
        className="relative mx-auto max-w-lg cursor-crosshair overflow-hidden rounded-2xl border border-slate-200 bg-slate-50"
        onClick={(e) => placeAt(e.clientX, e.clientY)}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={imageUrl} alt="" className="block w-full select-none" draggable={false} />
        {zones.map((z, i) => (
          <button
            key={z.id}
            type="button"
            className={`absolute rounded-full border-2 transition-shadow ${
              i === selectedIndex
                ? "border-teal-500 bg-teal-400/30 ring-2 ring-teal-300"
                : z.correct
                  ? "border-emerald-500 bg-emerald-400/25"
                  : "border-amber-500 bg-amber-400/20"
            }`}
            style={{
              left: `${z.x_percent}%`,
              top: `${z.y_percent}%`,
              width: `${z.rayon_percent * 2}%`,
              height: `${z.rayon_percent * 2}%`,
              transform: "translate(-50%, -50%)",
            }}
            onClick={(e) => {
              e.stopPropagation();
              onSelect(i);
            }}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSelect(i);
              setDragging(true);
              (e.target as HTMLElement).setPointerCapture(e.pointerId);
            }}
            onPointerMove={(e) => {
              if (!dragging || i !== selectedIndex) return;
              e.stopPropagation();
              placeAt(e.clientX, e.clientY);
            }}
            onPointerUp={() => setDragging(false)}
            aria-label={unifiedText(z.label_fr, z.label_ar) || `Zone ${i + 1}`}
          />
        ))}
      </div>

      {zone && (
        <div className="grid gap-2 rounded-xl border border-slate-100 bg-slate-50 p-3 md:grid-cols-3">
          <TextField
            label="X %"
            value={zone.x_percent}
            onChange={(v) => onUpdateZone(selectedIndex, { x_percent: parseFloat(v) || 0 })}
            type="number"
          />
          <TextField
            label="Y %"
            value={zone.y_percent}
            onChange={(v) => onUpdateZone(selectedIndex, { y_percent: parseFloat(v) || 0 })}
            type="number"
          />
          <TextField
            label={`${COMPOSER_LABELS.zone} — rayon %`}
            value={zone.rayon_percent}
            onChange={(v) => onUpdateZone(selectedIndex, { rayon_percent: parseFloat(v) || 5 })}
            type="number"
          />
        </div>
      )}
    </div>
  );
}

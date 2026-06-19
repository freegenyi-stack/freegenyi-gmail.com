"use client";

import React from "react";
import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { COMPOSER_LABELS, UnifiedField, uid, unifiedText } from "./composerShared";
import type { ActivityLang, VraiFauxContent } from "@/types/activity";

type Item = Omit<VraiFauxContent, "type" | "items">;

type Props = {
  content: VraiFauxContent;
  langue: ActivityLang;
  onChange: (content: VraiFauxContent) => void;
  vraiCorrectLabel: string;
};

function newItem(index: number): Item {
  return {
    affirmation_fr: `Affirmation ${index + 1}`,
    affirmation_ar: `Affirmation ${index + 1}`,
    reponse_correcte: true,
    explication_fr: "",
    explication_ar: "",
  };
}

export default function ActivityComposerVraiFaux({ content, onChange, vraiCorrectLabel }: Props) {
  const items: Item[] =
    content.items?.length && content.items.length > 0
      ? content.items
      : [
          {
            affirmation_fr: content.affirmation_fr,
            affirmation_ar: content.affirmation_ar,
            affirmation_audio_url: content.affirmation_audio_url,
            reponse_correcte: content.reponse_correcte,
            explication_fr: content.explication_fr,
            explication_ar: content.explication_ar,
          },
        ];

  const sync = (nextItems: Item[]) => {
    if (nextItems.length === 1) {
      const item = nextItems[0];
      onChange({
        type: "VRAI_FAUX",
        affirmation_fr: item.affirmation_fr,
        affirmation_ar: item.affirmation_ar,
        affirmation_audio_url: item.affirmation_audio_url,
        reponse_correcte: item.reponse_correcte,
        explication_fr: item.explication_fr,
        explication_ar: item.explication_ar,
      });
    } else {
      onChange({
        type: "VRAI_FAUX",
        affirmation_fr: "",
        affirmation_ar: "",
        reponse_correcte: true,
        items: nextItems,
      });
    }
  };

  const updateItem = (index: number, patch: Partial<Item>) => {
    sync(items.map((item, i) => (i === index ? { ...item, ...patch } : item)));
  };

  return (
    <div className="space-y-4">
      {items.map((item, i) => (
        <div key={i} className="rounded-2xl border border-slate-200 bg-white p-4">
          <div className="mb-3 flex items-center justify-between">
            <p className="text-sm font-black text-slate-900">
              {COMPOSER_LABELS.statement} {i + 1}
            </p>
            {items.length > 1 && (
              <button
                type="button"
                onClick={() => sync(items.filter((_, j) => j !== i))}
                className="text-red-500 hover:text-red-700"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
          </div>

          <UnifiedField
            label={COMPOSER_LABELS.statement}
            value={unifiedText(item.affirmation_fr, item.affirmation_ar)}
            onChange={(v) => updateItem(i, { affirmation_fr: v, affirmation_ar: v })}
          />

          <UnifiedField
            label={COMPOSER_LABELS.explanation}
            value={unifiedText(item.explication_fr, item.explication_ar)}
            onChange={(v) => updateItem(i, { explication_fr: v, explication_ar: v })}
            rows={1}
          />

          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={item.reponse_correcte}
              onChange={(e) => updateItem(i, { reponse_correcte: e.target.checked })}
              className="rounded accent-teal-600"
            />
            {vraiCorrectLabel}
          </label>
        </div>
      ))}

      <Button
        type="button"
        variant="outline"
        className="gap-2"
        onClick={() => sync([...items, newItem(items.length)])}
      >
        <Plus className="h-4 w-4" /> Ajouter une affirmation
      </Button>
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Plus, Trash2, ChevronUp, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActivityMediaPicker from "./ActivityMediaPicker";
import DragDropCanvasEditor from "./DragDropCanvasEditor";
import HotspotZoneEditor from "./HotspotZoneEditor";
import { COMPOSER_LABELS, ComposerSection, TextField, UnifiedField, uid, unifiedText, useComposerT } from "./composerShared";
import type {
  ActivityContentPayload,
  ActivityLang,
  ActivityType,
  CalculInteractifContent,
  ColoriageContent,
  DragDropContent,
  FlashcardsContent,
  ImageHotspotContent,
  LettresManquantesContent,
  MatchingContent,
  MemoryGameContent,
  SequencingContent,
  TexteATrousContent,
} from "@/types/activity";

type Props = {
  activityType: ActivityType;
  content: ActivityContentPayload;
  langue: ActivityLang;
  onChange: (content: ActivityContentPayload) => void;
};

export default function ActivityComposerByType({ activityType, content, onChange }: Props) {
  switch (activityType) {
    case "FLASHCARDS":
      return <FlashcardsForm content={content as FlashcardsContent} onChange={onChange} />;
    case "MEMORY_GAME":
      return <MemoryForm content={content as MemoryGameContent} onChange={onChange} />;
    case "TEXTE_A_TROUS":
      return <TexteTrousForm content={content as TexteATrousContent} onChange={onChange} />;
    case "DRAG_DROP":
      return <DragDropForm content={content as DragDropContent} onChange={onChange} />;
    case "SEQUENCING":
      return <SequencingForm content={content as SequencingContent} onChange={onChange} />;
    case "MATCHING":
      return <MatchingForm content={content as MatchingContent} onChange={onChange} />;
    case "IMAGE_HOTSPOT":
      return <HotspotForm content={content as ImageHotspotContent} onChange={onChange} />;
    case "COLORIAGE":
      return <ColoriageForm content={content as ColoriageContent} onChange={onChange} />;
    case "LETTRES_MANQUANTES":
      return <LettresForm content={content as LettresManquantesContent} onChange={onChange} />;
    case "CALCUL_INTERACTIF":
      return <CalculForm content={content as CalculInteractifContent} onChange={onChange} />;
    default:
      return null;
  }
}

function FlashcardsForm({ content, onChange }: { content: FlashcardsContent; onChange: (c: ActivityContentPayload) => void }) {
  const tc = useComposerT();
  const updateCard = (i: number, patch: Partial<(typeof content.cartes)[0]>) => {
    onChange({ ...content, cartes: content.cartes.map((c, j) => (j === i ? { ...c, ...patch } : c)) });
  };
  return (
    <ComposerSection title={tc("flashcardsTitle")}>
      {content.cartes.map((card, i) => (
        <div key={card.id} className="mb-4 rounded-xl border border-slate-100 p-3">
          <div className="mb-2 flex justify-between">
            <span className="text-xs font-black text-slate-500">{tc("cardN", { n: i + 1 })}</span>
            {content.cartes.length > 1 && (
              <button type="button" onClick={() => onChange({ ...content, cartes: content.cartes.filter((_, j) => j !== i) })}>
                <Trash2 className="h-4 w-4 text-red-400" />
              </button>
            )}
          </div>
          <UnifiedField
            label={COMPOSER_LABELS.recto}
            value={unifiedText(card.recto_texte_fr, card.recto_texte_ar)}
            onChange={(v) => updateCard(i, { recto_texte_fr: v, recto_texte_ar: v })}
            rows={1}
          />
          <UnifiedField
            label={COMPOSER_LABELS.verso}
            value={unifiedText(card.verso_texte_fr, card.verso_texte_ar)}
            onChange={(v) => updateCard(i, { verso_texte_fr: v, verso_texte_ar: v })}
            rows={1}
          />
          <ActivityMediaPicker
            label={tc("rectoImage")}
            value={card.recto_image_url}
            onChange={(url) => updateCard(i, { recto_image_url: url })}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() =>
          onChange({
            ...content,
            cartes: [
              ...content.cartes,
              {
                id: uid("fc"),
                recto_texte_fr: "",
                recto_texte_ar: "",
                verso_texte_fr: "",
                verso_texte_ar: "",
              },
            ],
          })
        }
      >
        <Plus className="h-3 w-3" /> {tc("addCard")}
      </Button>
    </ComposerSection>
  );
}

function MemoryForm({ content, onChange }: { content: MemoryGameContent; onChange: (c: ActivityContentPayload) => void }) {
  const tc = useComposerT();
  return (
    <ComposerSection title={tc("memoryTitle")}>
      <label className="mb-3 block text-xs font-bold text-slate-600">
        {tc("gridLabel")}
        <select
          value={content.grille}
          onChange={(e) => onChange({ ...content, grille: e.target.value as "4x3" | "4x4" })}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="4x3">{tc("grid43")}</option>
          <option value="4x4">{tc("grid44")}</option>
        </select>
      </label>
      {content.paires.map((pair, i) => (
        <div key={pair.id} className="mb-3 grid gap-2 rounded-xl border border-slate-100 p-3 md:grid-cols-2">
          <TextField
            label={tc("pairSide", { n: i + 1, side: "A" })}
            value={pair.carte_a.valeur}
            onChange={(v) =>
              onChange({
                ...content,
                paires: content.paires.map((p, j) =>
                  j === i ? { ...p, carte_a: { ...p.carte_a, type: "texte", valeur: v } } : p
                ),
              })
            }
          />
          <TextField
            label={tc("pairSide", { n: i + 1, side: "B" })}
            value={pair.carte_b.valeur}
            onChange={(v) =>
              onChange({
                ...content,
                paires: content.paires.map((p, j) =>
                  j === i ? { ...p, carte_b: { ...p.carte_b, type: "texte", valeur: v } } : p
                ),
              })
            }
          />
          {content.paires.length > 2 && (
            <button
              type="button"
              className="self-end text-red-400"
              onClick={() => onChange({ ...content, paires: content.paires.filter((_, j) => j !== i) })}
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onChange({
            ...content,
            paires: [
              ...content.paires,
              { id: uid("mp"), carte_a: { type: "texte", valeur: "" }, carte_b: { type: "texte", valeur: "" } },
            ],
          })
        }
      >
        <Plus className="h-3 w-3" /> {tc("addPair")}
      </Button>
    </ComposerSection>
  );
}

function TexteTrousForm({ content, onChange }: { content: TexteATrousContent; onChange: (c: ActivityContentPayload) => void }) {
  const tc = useComposerT();
  return (
    <ComposerSection title={tc("blanksTitle")}>
      <label className="mb-3 block text-xs font-bold text-slate-600">
        {tc("modeLabel")}
        <select
          value={content.mode}
          onChange={(e) => onChange({ ...content, mode: e.target.value as "choix" | "clavier" })}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        >
          <option value="choix">{tc("modeChoice")}</option>
          <option value="clavier">{tc("modeKeyboard")}</option>
        </select>
      </label>
      <UnifiedField
        label={tc("blanksTextHint")}
        value={unifiedText(content.texte_fr, content.texte_ar)}
        onChange={(v) => onChange({ ...content, texte_fr: v, texte_ar: v })}
      />
      {content.trous.map((trou, i) => (
        <UnifiedField
          key={trou.id}
          label={tc("answerBlank", { n: i + 1 })}
          value={unifiedText(trou.reponse_correcte, trou.reponse_correcte_ar)}
          onChange={(v) =>
            onChange({
              ...content,
              trous: content.trous.map((t, j) => (j === i ? { ...t, reponse_correcte: v, reponse_correcte_ar: v } : t)),
            })
          }
          rows={1}
        />
      ))}
      <TextField
        label={tc("wordBank")}
        value={(content.word_bank_fr ?? content.word_bank_ar ?? []).join(", ")}
        onChange={(v) => {
          const words = v.split(",").map((s) => s.trim()).filter(Boolean);
          onChange({ ...content, word_bank_fr: words, word_bank_ar: words });
        }}
      />
    </ComposerSection>
  );
}

function DragDropForm({ content, onChange }: { content: DragDropContent; onChange: (c: ActivityContentPayload) => void }) {
  const tc = useComposerT();
  const [selectedZone, setSelectedZone] = useState(0);

  const addZoneAt = (pos: { x_percent: number; y_percent: number; width_percent: number; height_percent: number }) => {
    const id = uid("z");
    onChange({
      ...content,
      zones: [
        ...content.zones,
        {
          id,
          label_fr: "Zone",
          label_ar: "Zone",
          couleur_fond: "#E0E7FF",
          ...pos,
        },
      ],
    });
    setSelectedZone(content.zones.length);
  };

  const addZone = () => {
    addZoneAt({
      x_percent: 10 + content.zones.length * 8,
      y_percent: 20,
      width_percent: 22,
      height_percent: 16,
    });
  };

  return (
    <ComposerSection title={tc("dragDropTitle")}>
      <UnifiedField
        label={COMPOSER_LABELS.instruction}
        value={unifiedText(content.instruction_fr, content.instruction_ar)}
        onChange={(v) => onChange({ ...content, instruction_fr: v, instruction_ar: v })}
        rows={1}
      />
      <ActivityMediaPicker
        label={tc("canvasBgImage")}
        value={content.image_url}
        onChange={(url) => onChange({ ...content, image_url: url })}
      />
      <DragDropCanvasEditor
        imageUrl={content.image_url}
        zones={content.zones}
        selectedIndex={selectedZone}
        onSelect={setSelectedZone}
        onUpdateZone={(i, patch) =>
          onChange({ ...content, zones: content.zones.map((z, j) => (j === i ? { ...z, ...patch } : z)) })
        }
        onRemoveZone={(i) => {
          onChange({ ...content, zones: content.zones.filter((_, j) => j !== i) });
          setSelectedZone(Math.max(0, i - 1));
        }}
        onAddZone={addZone}
        onAddZoneAt={addZoneAt}
      />
      <p className="mb-2 mt-4 text-xs font-black uppercase text-slate-500">{tc("elementsToSort")}</p>
      {content.elements.map((el, i) => (
        <div key={el.id} className="mb-2 rounded-xl border border-slate-100 p-3">
          <div className="grid gap-2 md:grid-cols-2">
            <UnifiedField
              label={COMPOSER_LABELS.text}
              value={unifiedText(el.texte_fr, el.texte_ar)}
              onChange={(v) => onChange({ ...content, elements: content.elements.map((e, j) => (j === i ? { ...e, texte_fr: v, texte_ar: v } : e)) })}
              rows={1}
            />
            <label className="block text-xs font-bold text-slate-600">
              {tc("correctZone")}
              <select
                value={el.zone_correcte}
                onChange={(e) => onChange({ ...content, elements: content.elements.map((el2, j) => (j === i ? { ...el2, zone_correcte: e.target.value } : el2)) })}
                className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
              >
                {content.zones.map((z) => (
                  <option key={z.id} value={z.id}>{unifiedText(z.label_fr, z.label_ar) || z.id}</option>
                ))}
              </select>
            </label>
          </div>
          <ActivityMediaPicker
            label={tc("optionalImage")}
            value={el.image_url}
            onChange={(url) => onChange({ ...content, elements: content.elements.map((e, j) => (j === i ? { ...e, image_url: url } : e)) })}
          />
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() =>
          onChange({
            ...content,
            elements: [
              ...content.elements,
              { id: uid("e"), texte_fr: "", texte_ar: "", zone_correcte: content.zones[0]?.id ?? "z1" },
            ],
          })
        }
      >
        <Plus className="h-3 w-3" /> {tc("addElement")}
      </Button>
    </ComposerSection>
  );
}

function SequencingForm({ content, onChange }: { content: SequencingContent; onChange: (c: ActivityContentPayload) => void }) {
  const tc = useComposerT();
  const reorder = (from: number, to: number) => {
    if (to < 0 || to >= content.elements.length) return;
    const next = [...content.elements];
    const [item] = next.splice(from, 1);
    next.splice(to, 0, item);
    onChange({
      ...content,
      elements: next.map((el, i) => ({ ...el, ordre_correct: i + 1 })),
    });
  };

  return (
    <ComposerSection title={tc("sequencingTitle")}>
      <UnifiedField
        label={COMPOSER_LABELS.instruction}
        value={unifiedText(content.instruction_fr, content.instruction_ar)}
        onChange={(v) => onChange({ ...content, instruction_fr: v, instruction_ar: v })}
        rows={1}
      />
      {content.elements.map((el, i) => (
        <div key={el.id} className="mb-2 flex gap-2">
          <div className="flex shrink-0 flex-col gap-1 pt-6">
            <button
              type="button"
              disabled={i === 0}
              onClick={() => reorder(i, i - 1)}
              className="rounded-lg border border-slate-200 p-1 disabled:opacity-30"
              aria-label={tc("moveUp")}
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={i === content.elements.length - 1}
              onClick={() => reorder(i, i + 1)}
              className="rounded-lg border border-slate-200 p-1 disabled:opacity-30"
              aria-label={tc("moveDown")}
            >
              <ChevronDown className="h-4 w-4" />
            </button>
          </div>
          <div className="min-w-0 flex-1">
            <UnifiedField
              label={`${COMPOSER_LABELS.step} ${i + 1}`}
              value={unifiedText(el.texte_fr, el.texte_ar)}
              onChange={(v) =>
                onChange({
                  ...content,
                  elements: content.elements.map((e, j) => (j === i ? { ...e, texte_fr: v, texte_ar: v } : e)),
                })
              }
              rows={1}
            />
          </div>
          {content.elements.length > 1 && (
            <button
              type="button"
              className="mt-6 shrink-0"
              onClick={() =>
                onChange({
                  ...content,
                  elements: content.elements
                    .filter((_, j) => j !== i)
                    .map((e, j) => ({ ...e, ordre_correct: j + 1 })),
                })
              }
            >
              <Trash2 className="h-4 w-4 text-red-400" />
            </button>
          )}
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="gap-1"
        onClick={() =>
          onChange({
            ...content,
            elements: [
              ...content.elements,
              { id: uid("s"), texte_fr: "", texte_ar: "", ordre_correct: content.elements.length + 1 },
            ],
          })
        }
      >
        <Plus className="h-3 w-3" /> {tc("addStep")}
      </Button>
    </ComposerSection>
  );
}

function MatchingForm({ content, onChange }: { content: MatchingContent; onChange: (c: ActivityContentPayload) => void }) {
  const tc = useComposerT();
  return (
    <ComposerSection title={tc("matchingTitle")}>
      <UnifiedField
        label={COMPOSER_LABELS.instruction}
        value={unifiedText(content.instruction_fr, content.instruction_ar)}
        onChange={(v) => onChange({ ...content, instruction_fr: v, instruction_ar: v })}
        rows={1}
      />
      {content.paires.map((pair, i) => (
        <div key={pair.id} className="mb-3 grid gap-2 rounded-xl border border-slate-100 p-3 md:grid-cols-2">
          <UnifiedField
            label={tc("columnA", { n: i + 1 })}
            value={unifiedText(pair.colonne_a.valeur_fr ?? pair.colonne_a.valeur, pair.colonne_a.valeur_ar)}
            onChange={(v) => onChange({ ...content, paires: content.paires.map((p, j) => (j === i ? { ...p, colonne_a: { type: "texte" as const, valeur_fr: v, valeur_ar: v } } : p)) })}
            rows={1}
          />
          <UnifiedField
            label={tc("columnB")}
            value={unifiedText(pair.colonne_b.valeur_fr ?? pair.colonne_b.valeur, pair.colonne_b.valeur_ar)}
            onChange={(v) => onChange({ ...content, paires: content.paires.map((p, j) => (j === i ? { ...p, colonne_b: { type: "texte" as const, valeur_fr: v, valeur_ar: v } } : p)) })}
            rows={1}
          />
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => onChange({ ...content, paires: [...content.paires, { id: uid("m"), colonne_a: { type: "texte", valeur_fr: "" }, colonne_b: { type: "texte", valeur_fr: "" } }] })}>
        <Plus className="h-3 w-3" /> {tc("addPair")}
      </Button>
    </ComposerSection>
  );
}

function HotspotForm({ content, onChange }: { content: ImageHotspotContent; onChange: (c: ActivityContentPayload) => void }) {
  const tc = useComposerT();
  const [selectedIndex, setSelectedIndex] = useState(0);
  const safeIndex = Math.min(selectedIndex, Math.max(0, content.zones.length - 1));

  return (
    <ComposerSection title={tc("hotspotTitle")}>
      <ActivityMediaPicker label={tc("bgImage")} value={content.image_url} onChange={(url) => onChange({ ...content, image_url: url ?? content.image_url })} />
      <UnifiedField
        label={COMPOSER_LABELS.instruction}
        value={unifiedText(content.instruction_fr, content.instruction_ar)}
        onChange={(v) => onChange({ ...content, instruction_fr: v, instruction_ar: v })}
        rows={1}
      />

      {content.image_url && content.zones.length > 0 && (
        <HotspotZoneEditor
          imageUrl={content.image_url}
          zones={content.zones}
          selectedIndex={safeIndex}
          onSelect={setSelectedIndex}
          onUpdateZone={(i, patch) =>
            onChange({ ...content, zones: content.zones.map((z, j) => (j === i ? { ...z, ...patch } : z)) })
          }
        />
      )}

      {content.zones.map((zone, i) => (
        <div key={zone.id} className={`mb-3 rounded-xl border p-3 ${i === safeIndex ? "border-teal-300 bg-teal-50/40" : "border-slate-100"}`}>
          <button type="button" className="mb-2 text-xs font-black text-teal-700" onClick={() => setSelectedIndex(i)}>
            {tc("zoneN", { n: i + 1 })}{i === safeIndex ? ` · ${tc("zoneSelected")}` : ""}
          </button>
          <UnifiedField
            label={COMPOSER_LABELS.label}
            value={unifiedText(zone.label_fr, zone.label_ar)}
            onChange={(v) => onChange({ ...content, zones: content.zones.map((z, j) => (j === i ? { ...z, label_fr: v, label_ar: v } : z)) })}
            rows={1}
          />
          <label className="mt-2 flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={zone.correct} onChange={(e) => onChange({ ...content, zones: content.zones.map((z, j) => (j === i ? { ...z, correct: e.target.checked } : z)) })} className="accent-teal-600" />
            {tc("correctZoneCheckbox")}
          </label>
        </div>
      ))}
      <Button type="button" variant="outline" size="sm" className="gap-1" onClick={() => { onChange({ ...content, zones: [...content.zones, { id: uid("hz"), label_fr: "Zone", label_ar: "Zone", x_percent: 50, y_percent: 50, rayon_percent: 10, correct: false }] }); setSelectedIndex(content.zones.length); }}>
        <Plus className="h-3 w-3" /> {tc("addZone")}
      </Button>
    </ComposerSection>
  );
}

function ColoriageForm({ content, onChange }: { content: ColoriageContent; onChange: (c: ActivityContentPayload) => void }) {
  const tc = useComposerT();
  return (
    <ComposerSection title={tc("coloringTitle")}>
      <label className="mb-3 block text-xs font-bold text-slate-600">
        {tc("modeLabel")}
        <select value={content.mode} onChange={(e) => onChange({ ...content, mode: e.target.value as "guide" | "libre" })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="libre">{tc("modeFree")}</option>
          <option value="guide">{tc("modeGuided")}</option>
        </select>
      </label>
      <TextField label={tc("svgUrl")} value={content.svg_url} onChange={(v) => onChange({ ...content, svg_url: v })} />
      <UnifiedField
        label={COMPOSER_LABELS.instruction}
        value={unifiedText(content.instruction_fr, content.instruction_ar)}
        onChange={(v) => onChange({ ...content, instruction_fr: v, instruction_ar: v })}
        rows={1}
      />
      <TextField label={tc("palette")} value={content.palette.join(", ")} onChange={(v) => onChange({ ...content, palette: v.split(",").map((s) => s.trim()).filter(Boolean) })} />
    </ComposerSection>
  );
}

function LettresForm({ content, onChange }: { content: LettresManquantesContent; onChange: (c: ActivityContentPayload) => void }) {
  const tc = useComposerT();
  return (
    <ComposerSection title={tc("lettersTitle")}>
      <UnifiedField
        label={COMPOSER_LABELS.word}
        value={unifiedText(content.mot_fr, content.mot_ar)}
        onChange={(v) => onChange({ ...content, mot_fr: v.toUpperCase(), mot_ar: v })}
        rows={1}
      />
      <TextField
        label={tc("availableLetters")}
        value={(content.lettres_disponibles_fr.length ? content.lettres_disponibles_fr : content.lettres_disponibles_ar).join(" ")}
        onChange={(v) => {
          const letters = v.split(/\s+/).filter(Boolean);
          onChange({ ...content, lettres_disponibles_fr: letters, lettres_disponibles_ar: letters });
        }}
      />
      <TextField label={tc("maskedIndices")} value={content.lettres_masquees_fr.join(",")} onChange={(v) => onChange({ ...content, lettres_masquees_fr: v.split(",").map((n) => parseInt(n.trim(), 10)).filter((n) => !Number.isNaN(n)) })} />
    </ComposerSection>
  );
}

function CalculForm({ content, onChange }: { content: CalculInteractifContent; onChange: (c: ActivityContentPayload) => void }) {
  const tc = useComposerT();
  return (
    <ComposerSection title={tc("calculTitle")}>
      <label className="mb-3 block text-xs font-bold text-slate-600">
        {tc("operationLabel")}
        <select value={content.operation} onChange={(e) => onChange({ ...content, operation: e.target.value as CalculInteractifContent["operation"] })} className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm">
          <option value="addition">{tc("opAddition")}</option>
          <option value="soustraction">{tc("opSubtraction")}</option>
          <option value="multiplication">{tc("opMultiplication")}</option>
          <option value="division">{tc("opDivision")}</option>
        </select>
      </label>
      <div className="grid gap-3 md:grid-cols-3">
        <TextField label={tc("numberA")} value={content.nombre_a} onChange={(v) => onChange({ ...content, nombre_a: parseInt(v, 10) || 0 })} type="number" />
        <TextField label={tc("numberB")} value={content.nombre_b} onChange={(v) => onChange({ ...content, nombre_b: parseInt(v, 10) || 0 })} type="number" />
        <TextField label={tc("correctAnswer")} value={content.reponse_correcte} onChange={(v) => onChange({ ...content, reponse_correcte: parseInt(v, 10) || 0 })} type="number" />
      </div>
      <UnifiedField
        label={COMPOSER_LABELS.question}
        value={unifiedText(content.question_fr, content.question_ar)}
        onChange={(v) => onChange({ ...content, question_fr: v, question_ar: v })}
        rows={1}
      />
      <label className="flex items-center gap-2 text-sm font-bold">
        <input type="checkbox" checked={content.aide_visuelle ?? false} onChange={(e) => onChange({ ...content, aide_visuelle: e.target.checked })} className="accent-teal-600" />
        {tc("visualAid")}
      </label>
    </ComposerSection>
  );
}

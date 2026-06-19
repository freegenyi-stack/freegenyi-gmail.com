"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { Eye, Save, Settings2, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import ActivityWrapper from "@/components/activities/ActivityWrapper";
import ActivityComposerQCM from "./ActivityComposerQCM";
import ActivityComposerVraiFaux from "./ActivityComposerVraiFaux";
import ActivityComposerByType from "./ActivityComposerByType";
import ActivityComposerAssistant from "./ActivityComposerAssistant";
import { saveAtelierActivityAction } from "@/lib/actions/authoring";
import type {
  ActivityContentEnvelope,
  ActivityLang,
  ActivityRegles,
  ActivityType,
  QcmContent,
  VraiFauxContent,
} from "@/types/activity";
import { activityTypeLabel } from "@/lib/activities/constants";
import { toast } from "sonner";
import { BilingualField } from "./composerShared";

type Props = {
  resourceId: number;
  envelope: ActivityContentEnvelope;
  activityType: ActivityType;
  langue: ActivityLang;
  readOnly?: boolean;
};

const DEFAULT_REGLES: ActivityRegles = {
  autoriserRefaire: true,
  maxTentatives: 3,
  notePassage: 50,
  couleurPrincipale: "#F97316",
  couleurFond: "#FFFBF5",
  couleurAccent: "#F59E0B",
  afficherChrono: false,
};

export default function ActivityComposer({
  resourceId,
  envelope: initial,
  activityType,
  langue,
  readOnly = false,
}: Props) {
  const t = useTranslations("TeacherSpace.atelier");
  const [envelope, setEnvelope] = useState<ActivityContentEnvelope>(() => ({
    ...initial,
    regles: { ...DEFAULT_REGLES, ...initial.regles },
    notation: initial.notation ?? { notePassage: 50, bareme: 20 },
  }));
  const [tab, setTab] = useState<"content" | "settings" | "preview">("content");
  const [editMode, setEditMode] = useState<"assistant" | "expert">("assistant");
  const [pending, startTransition] = useTransition();

  const supportsAssistant = activityType === "QCM" || activityType === "VRAI_FAUX";

  const typeLabel = activityTypeLabel(activityType, langue);

  const save = () => {
    startTransition(async () => {
      const res = await saveAtelierActivityAction(resourceId, JSON.stringify(envelope));
      if ("error" in res) toast.error(t("assistantSaveError"));
      else toast.success(t("assistantSaved"));
    });
  };

  const updateRegles = (patch: Partial<ActivityRegles>) => {
    setEnvelope((v) => ({ ...v, regles: { ...DEFAULT_REGLES, ...v.regles, ...patch } }));
  };

  const contentEditor = useMemo(() => {
    if (activityType === "QCM") {
      return (
        <ActivityComposerQCM
          content={envelope.contenu as QcmContent}
          langue={langue}
          onChange={(contenu) => setEnvelope((v) => ({ ...v, contenu }))}
        />
      );
    }
    if (activityType === "VRAI_FAUX") {
      return (
        <ActivityComposerVraiFaux
          content={envelope.contenu as VraiFauxContent}
          langue={langue}
          onChange={(contenu) => setEnvelope((v) => ({ ...v, contenu }))}
          vraiCorrectLabel={t("activityVraiCorrect")}
        />
      );
    }
    if (
      [
        "FLASHCARDS",
        "MEMORY_GAME",
        "TEXTE_A_TROUS",
        "DRAG_DROP",
        "SEQUENCING",
        "MATCHING",
        "IMAGE_HOTSPOT",
        "COLORIAGE",
        "LETTRES_MANQUANTES",
        "CALCUL_INTERACTIF",
      ].includes(activityType)
    ) {
      return (
        <ActivityComposerByType
          activityType={activityType}
          content={envelope.contenu}
          langue={langue}
          onChange={(contenu) => setEnvelope((v) => ({ ...v, contenu }))}
        />
      );
    }
    return (
      <p className="rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-900">
        {t("activityComposerTypeSoon", { type: typeLabel })}
      </p>
    );
  }, [activityType, envelope.contenu, langue, t, typeLabel]);

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm font-black text-slate-900">{t("activityComposerTitle")}</p>
          <p className="text-xs text-slate-500">{typeLabel}</p>
        </div>
        <div className="flex flex-wrap gap-2">
          {(["content", "settings", "preview"] as const).map((k) => (
            <button
              key={k}
              type="button"
              onClick={() => setTab(k)}
              className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-black ${
                tab === k ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
              }`}
            >
              {k === "content" && <Sparkles className="h-3.5 w-3.5" />}
              {k === "settings" && <Settings2 className="h-3.5 w-3.5" />}
              {k === "preview" && <Eye className="h-3.5 w-3.5" />}
              {k === "content" ? t("tabComposerEdit") : k === "settings" ? t("tabSettings") : t("tabPreview")}
            </button>
          ))}
        </div>
      </div>

      {tab === "content" && !readOnly && (
        <div className="rounded-2xl border border-teal-100 bg-teal-50/40 p-4">
          {supportsAssistant && (
            <div className="mb-4 flex gap-2">
              {(["assistant", "expert"] as const).map((mode) => (
                <button
                  key={mode}
                  type="button"
                  onClick={() => setEditMode(mode)}
                  className={`rounded-xl px-3 py-1.5 text-xs font-black ${
                    editMode === mode ? "bg-violet-600 text-white" : "bg-white text-slate-600"
                  }`}
                >
                  {mode === "assistant" ? t("tabAssistant") : t("tabExpert")}
                </button>
              ))}
            </div>
          )}

          {supportsAssistant && editMode === "assistant" ? (
            <ActivityComposerAssistant
              activityType={activityType}
              envelope={envelope}
              onChange={setEnvelope}
              onDone={() => setEditMode("expert")}
            />
          ) : (
            <>
              <BilingualField
                labelFr="Titre (FR)"
                labelAr="العنوان (AR)"
                valueFr={envelope.titre_fr ?? ""}
                valueAr={envelope.titre_ar ?? ""}
                onChangeFr={(v) => setEnvelope((prev) => ({ ...prev, titre_fr: v }))}
                onChangeAr={(v) => setEnvelope((prev) => ({ ...prev, titre_ar: v }))}
                rows={1}
              />

              <BilingualField
                labelFr="Consignes (FR)"
                labelAr="التعليمات (AR)"
                valueFr={envelope.instructions_fr ?? ""}
                valueAr={envelope.instructions_ar ?? ""}
                onChangeFr={(v) => setEnvelope((prev) => ({ ...prev, instructions_fr: v }))}
                onChangeAr={(v) => setEnvelope((prev) => ({ ...prev, instructions_ar: v }))}
                placeholderFr={t("activityInstructionsPlaceholder")}
              />

              {contentEditor}

              <Button type="button" onClick={save} disabled={pending} className="mt-6 gap-2">
                <Save className="h-4 w-4" /> {t("saveActivity")}
              </Button>
            </>
          )}
        </div>
      )}

      {tab === "settings" && !readOnly && (
        <div className="grid gap-4 rounded-2xl border border-slate-200 bg-white p-4 md:grid-cols-2">
          <label className="block text-sm font-bold text-slate-700">
            {t("activityNotePassage")}
            <input
              type="number"
              min={0}
              max={100}
              value={envelope.notation?.notePassage ?? 50}
              onChange={(e) =>
                setEnvelope((v) => ({
                  ...v,
                  notation: { bareme: v.notation?.bareme ?? 20, notePassage: parseInt(e.target.value, 10) || 0 },
                }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            {t("activityBareme")}
            <input
              type="number"
              min={1}
              max={100}
              value={envelope.notation?.bareme ?? 20}
              onChange={(e) =>
                setEnvelope((v) => ({
                  ...v,
                  notation: { notePassage: v.notation?.notePassage ?? 50, bareme: parseInt(e.target.value, 10) || 20 },
                }))
              }
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input
              type="checkbox"
              checked={envelope.regles?.autoriserRefaire !== false}
              onChange={(e) => updateRegles({ autoriserRefaire: e.target.checked })}
              className="rounded accent-teal-600"
            />
            {t("activityAllowRetry")}
          </label>
          <label className="block text-sm font-bold text-slate-700">
            {t("activityMaxAttempts")}
            <input
              type="number"
              min={1}
              max={10}
              value={envelope.regles?.maxTentatives ?? 3}
              onChange={(e) => updateRegles({ maxTentatives: parseInt(e.target.value, 10) || 3 })}
              className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            {t("activityColorPrimary")}
            <input
              type="color"
              value={envelope.regles?.couleurPrincipale ?? "#F97316"}
              onChange={(e) => updateRegles({ couleurPrincipale: e.target.value })}
              className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-slate-200"
            />
          </label>
          <label className="block text-sm font-bold text-slate-700">
            {t("activityColorBg")}
            <input
              type="color"
              value={envelope.regles?.couleurFond ?? "#FFFBF5"}
              onChange={(e) => updateRegles({ couleurFond: e.target.value })}
              className="mt-1 h-10 w-full cursor-pointer rounded-xl border border-slate-200"
            />
          </label>
          <Button type="button" onClick={save} disabled={pending} className="gap-2 md:col-span-2">
            <Save className="h-4 w-4" /> {t("saveActivity")}
          </Button>
        </div>
      )}

      {(tab === "preview" || readOnly) && (
        <ActivityWrapper envelope={envelope} langue={langue} activityId={resourceId} readOnlyPreview={readOnly} />
      )}
    </div>
  );
}

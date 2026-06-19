"use client";

import React from "react";
import { useTranslations } from "next-intl";

/** Libellés trilingues — un seul champ, l'enseignant écrit dans la langue de son choix. */
export const COMPOSER_LABELS = {
  title: "Titre · Title · عنوان",
  instructions: "Consignes · Instructions · تعليمات",
  question: "Question · سؤال",
  answer: "Réponse · Answer · إجابة",
  statement: "Affirmation · Statement · عبارة",
  instruction: "Consigne · Instruction · تعليمات",
  text: "Texte · Text · نص",
  word: "Mot · Word · كلمة",
  zone: "Zone · Zone · منطقة",
  step: "Étape · Step · خطوة",
  label: "Libellé · Label · تسمية",
  recto: "Recto (face visible) · الوجه",
  verso: "Verso (face cachée) · الظهر",
  explanation: "Explication · Explanation · شرح",
} as const;

export function useComposerT() {
  return useTranslations("TeacherSpace.atelier.composer");
}

export function unifiedText(fr?: string | null, ar?: string | null): string {
  return fr || ar || "";
}

export function ComposerSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-4">
      <p className="mb-3 text-sm font-black text-slate-900">{title}</p>
      {children}
    </div>
  );
}

export function UnifiedField({
  label,
  value,
  onChange,
  rows = 2,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  rows?: number;
  placeholder?: string;
}) {
  const isRtl = /[\u0600-\u06FF]/.test(value);
  return (
    <label className="mb-3 block text-xs font-bold text-slate-600">
      {label}
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        rows={rows}
        dir={isRtl ? "rtl" : "auto"}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
      />
    </label>
  );
}

export function UnifiedInput({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  const str = String(value);
  const isRtl = /[\u0600-\u06FF]/.test(str);
  return (
    <label className="mb-3 block text-xs font-bold text-slate-600">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        dir={isRtl ? "rtl" : "auto"}
        placeholder={placeholder}
        className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
      />
    </label>
  );
}

export function TextField({
  label,
  value,
  onChange,
  type = "text",
  placeholder,
}: {
  label: string;
  value: string | number;
  onChange: (v: string) => void;
  type?: string;
  placeholder?: string;
}) {
  return UnifiedInput({ label, value, onChange, type, placeholder });
}

export function uid(prefix: string) {
  return `${prefix}_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

/** Écrit la même valeur dans les champs FR et AR (compatibilité moteur). */
export function dualLang(value: string): { fr: string; ar: string } {
  return { fr: value, ar: value };
}

export function BilingualField({
  labelFr,
  labelAr,
  valueFr,
  valueAr,
  onChangeFr,
  onChangeAr,
  rows = 2,
  placeholderFr,
  placeholderAr,
}: {
  labelFr: string;
  labelAr: string;
  valueFr: string;
  valueAr: string;
  onChangeFr: (v: string) => void;
  onChangeAr: (v: string) => void;
  rows?: number;
  placeholderFr?: string;
  placeholderAr?: string;
}) {
  return (
    <div className="mb-3 grid gap-3 md:grid-cols-2">
      <label className="block text-xs font-bold text-slate-600">
        {labelFr}
        <textarea
          value={valueFr}
          onChange={(e) => onChangeFr(e.target.value)}
          rows={rows}
          dir="ltr"
          placeholder={placeholderFr}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm"
        />
      </label>
      <label className="block text-xs font-bold text-slate-600">
        {labelAr}
        <textarea
          value={valueAr}
          onChange={(e) => onChangeAr(e.target.value)}
          rows={rows}
          dir="rtl"
          placeholder={placeholderAr}
          className="mt-1 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-arabic"
        />
      </label>
    </div>
  );
}

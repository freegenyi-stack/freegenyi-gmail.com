"use client";

import { useEffect, useRef, useState } from "react";
import { useTranslations } from "next-intl";

type Props = {
  excerpt: string;
  onSave: (note: string) => void;
  onClose: () => void;
};

export default function ReaderNoteDialog({ excerpt, onSave, onClose }: Props) {
  const t = useTranslations("Library.noteDialog");
  const [value, setValue] = useState("");
  const inputRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="freegeny-reader-chrome fixed inset-0 z-[600] flex items-center justify-center bg-black/45 p-4">
      <div
        className="w-full max-w-md rounded-2xl border-2 border-orange-500 bg-white p-4 shadow-2xl"
        role="dialog"
        aria-label={t("title")}
      >
        <p className="mb-2 text-xs font-bold uppercase tracking-wide text-orange-600">{t("label")}</p>
        <p className="mb-3 line-clamp-3 rounded-lg bg-slate-100 px-3 py-2 text-sm text-slate-700">
          « {excerpt} »
        </p>
        <textarea
          ref={inputRef}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          rows={4}
          placeholder={t("placeholder")}
          className="w-full resize-none rounded-xl border border-slate-200 px-3 py-2 text-sm text-slate-900 outline-none focus:border-orange-400"
        />
        <div className="mt-3 flex justify-end gap-2">
          <button
            type="button"
            className="rounded-lg px-4 py-2 text-sm font-bold text-slate-600 hover:bg-slate-100"
            style={{ background: "transparent", color: "#475569" }}
            onClick={onClose}
          >
            {t("cancel")}
          </button>
          <button
            type="button"
            className="fg-btn-tts"
            style={{ padding: "0.5rem 1rem", fontSize: "0.875rem" }}
            onClick={() => {
              const note = value.trim();
              if (note) onSave(note);
            }}
          >
            {t("save")}
          </button>
        </div>
      </div>
    </div>
  );
}

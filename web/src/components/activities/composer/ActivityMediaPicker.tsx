"use client";

import React, { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { ACTIVITY_MEDIA_LIBRARY, emojiToDataUrl } from "@/lib/activities/media-library";

type Props = {
  value?: string | null;
  onChange: (url: string | null) => void;
  label?: string;
  accept?: string;
};

export default function ActivityMediaPicker({
  value,
  onChange,
  label,
  accept = "image/*,audio/*",
}: Props) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const fd = new FormData();
      fd.set("file", file);
      const res = await fetch("/api/authoring/media", { method: "POST", body: fd });
      const data = (await res.json()) as { url?: string; error?: string };
      if (!res.ok || !data.url) throw new Error(data.error ?? "upload_failed");
      onChange(data.url);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      {label ? <p className="mb-2 text-xs font-bold text-slate-600">{label}</p> : null}
      <div className="flex flex-wrap gap-2">
        {ACTIVITY_MEDIA_LIBRARY.map((item) => {
          const url = emojiToDataUrl(item.emoji);
          const selected = value === url;
          return (
            <button
              key={item.id}
              type="button"
              title={item.label}
              onClick={() => onChange(selected ? null : url)}
              className={`flex h-12 w-12 items-center justify-center rounded-xl border-2 text-2xl transition ${
                selected ? "border-teal-500 bg-teal-50" : "border-slate-200 bg-white hover:border-teal-300"
              }`}
            >
              {item.emoji}
            </button>
          );
        })}
        <button
          type="button"
          disabled={uploading}
          onClick={() => inputRef.current?.click()}
          className="flex h-12 min-w-[3rem] items-center justify-center gap-1 rounded-xl border-2 border-dashed border-slate-300 px-3 text-xs font-bold text-slate-600 hover:border-teal-400"
        >
          <Upload className="h-4 w-4" />
          {uploading ? "…" : "↑"}
        </button>
        {value && (
          <button
            type="button"
            onClick={() => onChange(null)}
            className="rounded-xl border border-dashed border-slate-300 px-3 text-xs font-bold text-slate-500"
          >
            ✕
          </button>
        )}
      </div>
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0];
          if (f) void uploadFile(f);
          e.target.value = "";
        }}
      />
      <input
        type="url"
        value={value?.startsWith("data:") ? "" : value ?? ""}
        onChange={(e) => onChange(e.target.value.trim() || null)}
        placeholder="https://…"
        className="mt-2 w-full rounded-xl border border-slate-200 px-3 py-2 text-xs"
      />
      {value && value.startsWith("/uploads/") && (
        <p className="mt-1 truncate text-[10px] font-bold text-teal-700">{value}</p>
      )}
    </div>
  );
}

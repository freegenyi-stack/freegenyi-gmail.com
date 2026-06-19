"use client";

import React, { useRef, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { LUXURY_AVATARS } from "@/lib/teacher/avatar-catalog";
import { PEDAGOGY_LEVELS, PEDAGOGY_SUBJECTS_AR, PEDAGOGY_SUBJECTS_FR } from "@/lib/pedagogy/constants";
import TeacherAvatarDisplay from "./TeacherAvatarDisplay";
import { Camera, Upload } from "lucide-react";

type Props = {
  avatarMode: "photo" | "catalog";
  avatarId: string;
  image: string | null;
  fullName: string;
  onModeChange: (mode: "photo" | "catalog") => void;
  onAvatarChange: (id: string) => void;
  onPhotoSelected: (file: File) => void;
};

export default function TeacherAvatarPicker({
  avatarMode,
  avatarId,
  image,
  fullName,
  onModeChange,
  onAvatarChange,
  onPhotoSelected,
}: Props) {
  const t = useTranslations("TeacherProfile");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const fileRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);

  return (
    <div className="space-y-4">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:items-start">
        <TeacherAvatarDisplay
          fullName={fullName}
          image={preview || image}
          avatarConfig={{ id: avatarId, style: "luxury" }}
          avatarMode={preview || (avatarMode === "photo" && image) ? "photo" : avatarMode}
          size="xl"
        />
        <div className="flex-1 space-y-3">
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() => onModeChange("catalog")}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-black uppercase",
                avatarMode === "catalog" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              {t("avatarCatalog")}
            </button>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              className={cn(
                "inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-xs font-black uppercase",
                avatarMode === "photo" ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
              )}
            >
              <Camera className="h-3.5 w-3.5" />
              {t("avatarPhoto")}
            </button>
          </div>
          <input
            ref={fileRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="hidden"
            onChange={(e) => {
              const f = e.target.files?.[0];
              if (!f) return;
              onPhotoSelected(f);
              onModeChange("photo");
              setPreview(URL.createObjectURL(f));
            }}
          />
          <p className="text-xs text-slate-500">{t("avatarHint")}</p>
        </div>
      </div>

      {avatarMode === "catalog" && (
        <div className="grid grid-cols-4 gap-2 sm:grid-cols-6">
          {LUXURY_AVATARS.map((av) => {
            const Icon = av.icon;
            const active = avatarId === av.id;
            return (
              <button
                key={av.id}
                type="button"
                onClick={() => onAvatarChange(av.id)}
                title={isRTL ? av.labelAr : av.labelFr}
                className={cn(
                  "flex flex-col items-center gap-1 rounded-2xl border-2 p-2 transition-all",
                  active ? "border-teal-500 bg-teal-50 scale-105 shadow-md" : "border-slate-100 hover:border-teal-200"
                )}
              >
                <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br text-white", av.gradient)}>
                  <Icon className="h-5 w-5" />
                </div>
                <span className="text-[9px] font-bold text-slate-600 truncate w-full text-center">
                  {isRTL ? av.labelAr : av.labelFr}
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

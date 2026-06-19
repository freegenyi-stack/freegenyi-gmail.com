"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Brain, Compass } from "lucide-react";
import { useTranslations } from "next-intl";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import ChildNeedsStep from "@/components/onboarding/ChildNeedsStep";
import ChildLearningPreferencesStep from "@/components/onboarding/ChildLearningPreferencesStep";
import {
  childAgeFromBirthDate,
  parseChildLearningProfileJson,
  type ChildLearningProfile,
} from "@/lib/child/learning-profile";
import { updateChildLearningProfileAction } from "@/lib/actions/children";

type Props = {
  childId: number;
  childName: string;
  birthDate: string | null;
  initialProfileJson: string | null;
  locale: string;
  onClose: () => void;
  onSaved: () => void;
};

export default function ChildProfileEditSheet({
  childId,
  childName,
  birthDate,
  initialProfileJson,
  locale,
  onClose,
  onSaved,
}: Props) {
  const t = useTranslations("Children");
  const isRTL = locale === "ar" || locale.endsWith("-ar");
  const [tab, setTab] = useState<"needs" | "learning">("needs");
  const [profile, setProfile] = useState<ChildLearningProfile>(() =>
    parseChildLearningProfileJson(initialProfileJson)
  );
  const [saving, setSaving] = useState(false);
  const childAge = childAgeFromBirthDate(birthDate);

  const handleSave = async () => {
    setSaving(true);
    const res = await updateChildLearningProfileAction(childId, profile);
    setSaving(false);
    if ("error" in res && res.error) {
      toast.error(res.error);
      return;
    }
    toast.success(t("profileSaved"));
    onSaved();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[200] flex items-end sm:items-center justify-center p-0 sm:p-6">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
        onClick={onClose}
      />
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 40 }}
        className="relative flex max-h-[92dvh] w-full max-w-2xl flex-col overflow-hidden rounded-t-[2rem] bg-white shadow-2xl sm:rounded-[2rem]"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className={cn("flex items-start justify-between border-b border-slate-100 p-6", isRTL && "flex-row-reverse")}>
          <div className={isRTL ? "text-right" : ""}>
            <h2 className={cn("text-xl font-black text-slate-900", isRTL && "font-ui-ar")}>
              {t("editProfileTitle")}
            </h2>
            <p className="text-sm text-slate-500 mt-1">{childName}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl bg-slate-100 p-2 hover:bg-slate-200">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex gap-2 border-b border-slate-100 px-4 pt-3">
          <button
            type="button"
            onClick={() => setTab("needs")}
            className={cn(
              "flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs font-black uppercase transition",
              tab === "needs" ? "bg-emerald-50 text-emerald-800" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Brain className="h-4 w-4" />
            {t("tabNeeds")}
          </button>
          <button
            type="button"
            onClick={() => setTab("learning")}
            className={cn(
              "flex items-center gap-2 rounded-t-xl px-4 py-2.5 text-xs font-black uppercase transition",
              tab === "learning" ? "bg-orange-50 text-orange-800" : "text-slate-500 hover:text-slate-800"
            )}
          >
            <Compass className="h-4 w-4" />
            {t("tabLearning")}
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {tab === "needs" ? (
            <ChildNeedsStep value={profile} onChange={setProfile} />
          ) : (
            <ChildLearningPreferencesStep childAge={childAge} value={profile} onChange={setProfile} />
          )}
        </div>

        <div className="border-t border-slate-100 p-4 sm:p-6">
          <button
            type="button"
            disabled={saving}
            onClick={() => void handleSave()}
            className="w-full rounded-2xl bg-slate-950 py-4 text-sm font-black uppercase tracking-wide text-white hover:bg-orange-600 disabled:opacity-50"
          >
            {saving ? t("savingProfile") : t("saveProfile")}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

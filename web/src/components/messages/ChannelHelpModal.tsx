"use client";

import { useTranslations } from "next-intl";
import { X, HelpCircle } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  onClose: () => void;
  isRTL: boolean;
};

export default function ChannelHelpModal({ open, onClose, isRTL }: Props) {
  const t = useTranslations("Messages");

  if (!open) return null;

  const sections = [
    { title: t("helpAnnouncementsTitle"), body: t("helpAnnouncementsBody") },
    { title: t("helpSchoolTitle"), body: t("helpSchoolBody") },
    { title: t("helpClassTitle"), body: t("helpClassBody") },
    { title: t("helpCommunityTitle"), body: t("helpCommunityBody") },
    { title: t("helpStaffTitle"), body: t("helpStaffBody") },
    { title: t("helpDirectTitle"), body: t("helpDirectBody") },
  ];

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        className={cn(
          "max-h-[85vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl",
          isRTL && "font-amiri text-right"
        )}
      >
        <div className={cn("mb-4 flex items-start justify-between gap-3", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <HelpCircle className="h-5 w-5 text-orange-600" />
            <h2 className="text-lg font-black text-slate-900">{t("helpTitle")}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <p className={cn("mb-5 text-sm text-slate-600", isRTL && "font-lateef")}>{t("helpIntro")}</p>
        <div className="space-y-4">
          {sections.map((s) => (
            <div key={s.title} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <h3 className="text-sm font-black text-orange-700">{s.title}</h3>
              <p className={cn("mt-1 text-xs font-medium leading-relaxed text-slate-600", isRTL && "font-lateef")}>
                {s.body}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

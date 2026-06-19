"use client";

import React, { useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { AlertCircle, CheckCircle2, Clock, Upload, XCircle } from "lucide-react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { resubmitTeacherVerificationAction } from "@/lib/actions/org_verification";

export type TeacherVerificationInfo = {
  status: "pending" | "approved" | "rejected";
  trackingCode?: string | null;
  rejectionReason?: string | null;
};

export default function TeacherVerificationBanner({ verification }: { verification: TeacherVerificationInfo }) {
  const t = useTranslations("TeacherSpace.verification");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const fileRef = useRef<HTMLInputElement>(null);
  const [submitting, setSubmitting] = useState(false);

  if (verification.status === "approved") return null;

  const isRejected = verification.status === "rejected";

  const handleResubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const file = fileRef.current?.files?.[0];
    const fd = new FormData();
    if (file) fd.set("doc_identity", file);

    setSubmitting(true);
    const result = await resubmitTeacherVerificationAction(fd);
    setSubmitting(false);

    if ("success" in result && result.success) {
      toast.success(t("resubmitSuccess"));
      window.location.reload();
      return;
    }
    toast.error("error" in result ? result.error : t("resubmitError"));
  };

  return (
    <div
      className={cn(
        "mb-6 rounded-2xl border-2 px-5 py-4",
        isRejected ? "border-red-200 bg-red-50" : "border-amber-200 bg-amber-50",
        isRTL && "text-right"
      )}
    >
      <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
        {isRejected ? (
          <XCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-600" />
        ) : (
          <Clock className="mt-0.5 h-5 w-5 shrink-0 text-amber-700" />
        )}
        <div className="flex-1">
          <p className={cn("font-extrabold", isRejected ? "text-red-950" : "text-amber-950")}>
            {isRejected ? t("rejectedTitle") : t("pendingTitle")}
          </p>
          <p className={cn("mt-1 text-sm", isRejected ? "text-red-900/80" : "text-amber-900/80")}>
            {isRejected ? t("rejectedDesc") : t("pendingDesc")}
          </p>
          {verification.rejectionReason && isRejected && (
            <p className="mt-2 text-xs font-medium text-red-800">{verification.rejectionReason}</p>
          )}
          {verification.trackingCode && (
            <p className="mt-2 font-mono text-[10px] font-bold text-teal-700">
              {t("trackingLabel")}: {verification.trackingCode}
            </p>
          )}
          {!isRejected && (
            <>
              <p className="mt-2 flex items-center gap-1 text-xs text-amber-800">
                <AlertCircle className="h-3.5 w-3.5" />
                {t("pendingHint")}
              </p>
              <ul className="mt-2 list-inside list-disc text-xs text-amber-900/90">
                <li>{t("limitedMur")}</li>
                <li>{t("limitedContact")}</li>
                <li>{t("limitedPublic")}</li>
              </ul>
            </>
          )}
          {isRejected && (
            <form onSubmit={handleResubmit} className="mt-4 space-y-3">
              <label className="block text-xs font-bold text-red-900">
                {t("resubmitDoc")}
                <input
                  ref={fileRef}
                  type="file"
                  accept="image/*,application/pdf"
                  className="mt-1 block w-full text-xs file:mr-2 file:rounded-lg file:border-0 file:bg-red-600 file:px-3 file:py-1.5 file:text-white"
                />
              </label>
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-red-600 px-4 py-2 text-xs font-black uppercase text-white hover:bg-red-500 disabled:opacity-60"
              >
                <Upload className="h-3.5 w-3.5" />
                {submitting ? t("resubmitting") : t("resubmit")}
              </button>
            </form>
          )}
        </div>
        {!isRejected && <CheckCircle2 className="hidden h-5 w-5 text-amber-400 sm:block" />}
      </div>
    </div>
  );
}

"use client";

import { Link } from "@/i18n/routing";
import React, { useState } from "react";
import { Send, ArrowLeft, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { sendInvitationAction } from "@/lib/actions/activity";
import { toast } from "sonner";
import { useLocale, useTranslations } from "next-intl";
import { ParentPageHeader, ParentSectionCard } from "@/components/parent/ParentShell";
import { isParentRtl, RTL_BACK_ARROW_HOVER } from "@/lib/parent/parent-rtl";
import { cn } from "@/lib/utils";

const ROLE_OPTIONS = ["coparent", "maman", "papa", "tuteur"] as const;

export default function InviteClient() {
  const locale = useLocale();
  const t = useTranslations("ParentSpace.invite");
  const isRtl = isParentRtl(locale);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setInviteUrl(null);

    const formData = new FormData(e.currentTarget);
    const result = await sendInvitationAction(formData);

    if ("success" in result && result.success) {
      setSuccessMsg(result.success);
      setInviteUrl(result.inviteUrl ?? null);
      setEmailSent(result.emailSent ?? true);
      (e.target as HTMLFormElement).reset();
      toast.success(result.emailSent ? t("toastSent") : t("toastCreated"));
    } else if ("error" in result && result.error) {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="mx-auto max-w-2xl" dir={isRtl ? "rtl" : "ltr"}>
      <ParentPageHeader badge={t("badge")} title={t("title")} subtitle={t("subtitle")} premium />

      <AnimatePresence>
        {successMsg && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className={`mb-6 flex items-start gap-4 rounded-2xl border p-5 ${
              emailSent
                ? "border-green-100 bg-green-50 text-green-700"
                : "border-amber-100 bg-amber-50 text-amber-900"
            }`}
          >
            {emailSent ? (
              <CheckCircle className="h-6 w-6 shrink-0" />
            ) : (
              <AlertCircle className="h-6 w-6 shrink-0" />
            )}
            <div className="min-w-0">
              <p className="text-sm font-bold">{successMsg}</p>
              {inviteUrl && !emailSent && (
                <p className="mt-2 break-all font-mono text-xs opacity-90">{inviteUrl}</p>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <ParentSectionCard>
        <form onSubmit={handleSubmit} className="space-y-6">
          <input type="hidden" name="locale" value={locale} />
          <div className="space-y-2">
            <label className="ms-1 block text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              {t("emailLabel")}
            </label>
            <input
              name="email"
              type="email"
              required
              placeholder={t("emailPlaceholder")}
              className="w-full rounded-2xl border-2 border-orange-100 bg-[#FFFBF7] px-5 py-4 text-sm font-bold text-slate-900 shadow-inner placeholder:text-slate-300 focus:border-orange-400 focus:outline-none"
            />
          </div>

          <div className="space-y-2">
            <label className="ms-1 block text-[11px] font-black uppercase tracking-[0.18em] text-slate-400">
              {t("roleLabel")}
            </label>
            <div className="relative">
              <select
                name="role"
                className="w-full cursor-pointer appearance-none rounded-2xl border-2 border-orange-100 bg-[#FFFBF7] px-5 py-4 text-sm font-bold text-slate-900 shadow-inner focus:border-orange-400 focus:outline-none"
              >
                {ROLE_OPTIONS.map((role) => (
                  <option key={role} value={role}>
                    {t(`roles.${role}`)}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute end-5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            </div>
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-3 rounded-2xl bg-orange-600 py-4 text-sm font-black uppercase tracking-widest text-white shadow-lg shadow-orange-500/25 transition hover:bg-orange-700 disabled:opacity-50"
          >
            {isSubmitting ? (
              t("submitting")
            ) : (
              <>
                <Send className="h-4 w-4" />
                {t("submit")}
              </>
            )}
          </button>
        </form>
      </ParentSectionCard>

      <div className="mt-8 text-center">
        <Link
          href="/dashboard/parent"
          className="group inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-400 transition hover:text-orange-600"
        >
          <ArrowLeft className={cn("h-4 w-4", RTL_BACK_ARROW_HOVER)} />
          {t("back")}
        </Link>
      </div>
    </div>
  );
}

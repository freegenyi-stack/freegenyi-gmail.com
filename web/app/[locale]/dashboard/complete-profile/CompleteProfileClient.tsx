"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { ShieldCheck, Upload } from "lucide-react";
import { toast } from "sonner";
import { useTranslations } from "next-intl";
import { completeCoparentProfileAction } from "@/lib/actions/family";
import { cn } from "@/lib/utils";

export default function CompleteProfileClient({ locale }: { locale: string }) {
  const t = useTranslations("CompleteProfile");
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const fileRef = React.useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!file) {
      toast.error(t("errIdentity"));
      return;
    }
    setIsSubmitting(true);
    const fd = new FormData();
    fd.set("doc_identity", file);
    const result = await completeCoparentProfileAction(fd);
    if ("error" in result && result.error) {
      toast.error(result.error);
      setIsSubmitting(false);
      return;
    }
    toast.success(t("success"));
    window.location.href = `/${locale}/dashboard/parent`;
  };

  return (
    <div className="mx-auto max-w-lg px-4 py-10" dir={isRTL ? "rtl" : "ltr"}>
      <h1 className={cn("text-2xl font-extrabold text-black", isRTL && "font-amiri text-right")}>{t("title")}</h1>
      <p className={cn("mt-2 text-neutral-600", isRTL && "font-lateef text-right")}>{t("subtitle")}</p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <input
          ref={fileRef}
          type="file"
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className={cn(
            "w-full rounded-2xl border-2 border-dashed p-6 text-center transition",
            file ? "border-emerald-400 bg-emerald-50" : "border-neutral-300 hover:border-orange-300"
          )}
        >
          <Upload className="mx-auto mb-2 h-5 w-5 text-neutral-600" />
          <p className="font-bold text-black">{file ? file.name : t("drop")}</p>
        </button>
        <p className={cn("flex items-center gap-2 text-xs text-neutral-600", isRTL && "flex-row-reverse font-amiri")}>
          <ShieldCheck className="h-4 w-4 text-emerald-700" />
          {t("secure")}
        </p>
        <button
          type="submit"
          disabled={isSubmitting}
          className="min-h-[52px] w-full rounded-2xl border-b-[4px] border-orange-800 bg-orange-500 py-3 font-extrabold uppercase text-white disabled:opacity-50"
        >
          {isSubmitting ? t("submitting") : t("submit")}
        </button>
        <Link href="/dashboard/parent" className="block text-center text-sm font-bold text-neutral-500 hover:text-orange-600">
          {t("later")}
        </Link>
      </form>
    </div>
  );
}

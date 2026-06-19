"use client";

import React, { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Upload, X } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import {
  PEDAGOGY_LEVELS,
  PEDAGOGY_POST_TYPES,
  PEDAGOGY_SUBJECTS_AR,
  PEDAGOGY_SUBJECTS_FR,
} from "@/lib/pedagogy/constants";

type Props = {
  defaultLevel?: string;
  defaultSubject?: string;
  onPublished: () => void;
  canPublish?: boolean;
  publishBlockedMessage?: string;
};

export default function ShareComposer({
  defaultLevel,
  defaultSubject,
  onPublished,
  canPublish = true,
  publishBlockedMessage,
}: Props) {
  const t = useTranslations("PedagogyWall");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const fileRef = useRef<HTMLInputElement>(null);

  const [open, setOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [postType, setPostType] = useState<string>("exercise");
  const [level, setLevel] = useState(defaultLevel || "3AP");
  const [subject, setSubject] = useState(defaultSubject || "");
  const [files, setFiles] = useState<File[]>([]);

  const subjects = isRTL ? PEDAGOGY_SUBJECTS_AR : PEDAGOGY_SUBJECTS_FR;

  const reset = () => {
    setTitle("");
    setDescription("");
    setPostType("exercise");
    setLevel(defaultLevel || "3AP");
    setSubject(defaultSubject || "");
    setFiles([]);
  };

  const handleFiles = (list: FileList | null) => {
    if (!list) return;
    const next = [...files, ...Array.from(list)].slice(0, 5);
    setFiles(next);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      toast.error(t("errTitle"));
      return;
    }
    if (files.length === 0 && postType !== "exercise") {
      toast.error(t("errFiles"));
      return;
    }

    setSubmitting(true);
    try {
      const fd = new FormData();
      fd.set("title", title.trim());
      fd.set("description", description.trim());
      fd.set("post_type", postType);
      fd.set("education_level", level);
      if (subject) fd.set("subject", subject);
      files.forEach((f) => fd.append("files", f));

      const res = await fetch("/api/pedagogy/shares", { method: "POST", body: fd });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t("errGeneric"));
        return;
      }

      toast.success(t("published"));
      reset();
      setOpen(false);
      onPublished();
    } catch {
      toast.error(t("errGeneric"));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <>
      {!canPublish && publishBlockedMessage && (
        <div className="mb-4 rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-950">
          {publishBlockedMessage}
        </div>
      )}
      <button
        type="button"
        onClick={() => canPublish && setOpen(true)}
        disabled={!canPublish}
        className={cn(
          "mb-6 flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed py-4 text-sm font-black uppercase tracking-wide transition",
          canPublish
            ? "border-teal-300 bg-teal-50/80 text-teal-800 hover:border-teal-400 hover:bg-teal-50"
            : "cursor-not-allowed border-slate-200 bg-slate-50 text-slate-400"
        )}
      >
        <Plus className="h-5 w-5" />
        {t("composeCta")}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-end justify-center bg-slate-900/50 p-4 sm:items-center"
            onClick={() => !submitting && setOpen(false)}
          >
            <motion.div
              initial={{ y: 40, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 40, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl bg-white p-6 shadow-2xl"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-lg font-black text-slate-900">{t("composeTitle")}</h2>
                <button type="button" onClick={() => setOpen(false)} className="rounded-full p-2 hover:bg-slate-100">
                  <X className="h-5 w-5" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase text-slate-500">{t("fieldTitle")}</label>
                  <Input value={title} onChange={(e) => setTitle(e.target.value)} className="rounded-xl font-bold" />
                </div>

                <div>
                  <label className="mb-1 block text-[10px] font-black uppercase text-slate-500">{t("fieldDesc")}</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={3}
                    className="w-full rounded-xl border border-slate-200 px-3 py-2 text-sm outline-none focus:border-teal-500"
                    placeholder={t("fieldDescPlaceholder")}
                  />
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-slate-500">{t("fieldType")}</label>
                  <div className="flex flex-wrap gap-2">
                    {PEDAGOGY_POST_TYPES.map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setPostType(type)}
                        className={cn(
                          "rounded-full px-3 py-1.5 text-xs font-black uppercase transition",
                          postType === type ? "bg-teal-600 text-white" : "bg-slate-100 text-slate-600"
                        )}
                      >
                        {t(`types.${type}`)}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase text-slate-500">{t("fieldLevel")}</label>
                    <select
                      value={level}
                      onChange={(e) => setLevel(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold"
                    >
                      {PEDAGOGY_LEVELS.map((lv) => (
                        <option key={lv} value={lv}>{lv}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="mb-1 block text-[10px] font-black uppercase text-slate-500">{t("fieldSubject")}</label>
                    <select
                      value={subject}
                      onChange={(e) => setSubject(e.target.value)}
                      className="w-full rounded-xl border border-slate-200 px-3 py-2.5 text-sm font-bold"
                    >
                      <option value="">{t("subjectOptional")}</option>
                      {subjects.map((s) => (
                        <option key={s} value={s}>{s}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-[10px] font-black uppercase text-slate-500">{t("fieldFiles")}</label>
                  <input
                    ref={fileRef}
                    type="file"
                    multiple
                    accept=".pdf,.jpg,.jpeg,.png,.webp,.doc,.docx"
                    className="hidden"
                    onChange={(e) => handleFiles(e.target.files)}
                  />
                  <button
                    type="button"
                    onClick={() => fileRef.current?.click()}
                    className="flex w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-slate-200 py-6 text-sm font-bold text-slate-600 hover:border-teal-300 hover:bg-teal-50/50"
                  >
                    <Upload className="h-5 w-5" />
                    {t("uploadHint")}
                  </button>
                  {files.length > 0 && (
                    <ul className="mt-2 space-y-1">
                      {files.map((f, i) => (
                        <li key={`${f.name}-${i}`} className="flex items-center justify-between text-xs font-bold text-slate-600">
                          <span className="truncate">{f.name}</span>
                          <button type="button" onClick={() => setFiles(files.filter((_, j) => j !== i))}>
                            <X className="h-3.5 w-3.5" />
                          </button>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <Button
                  type="submit"
                  disabled={submitting}
                  className="w-full rounded-2xl bg-teal-600 py-6 font-black uppercase hover:bg-teal-500"
                >
                  {submitting ? t("publishing") : t("publish")}
                </Button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

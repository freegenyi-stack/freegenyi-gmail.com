"use client";

import React, { useRef, useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowLeft, FileUp, Plus, Trash2 } from "lucide-react";
import {
  removeAnnexAction,
  removeQuizQuestionAction,
  saveAnnexAction,
  saveQuizMetaAction,
  saveQuizQuestionAction,
  updateLibraryBookAction,
} from "@/lib/actions/library_admin";
import type { LibraryAudience } from "@/lib/library/audience";
import type { AdminAnnex } from "@/lib/library/admin.server";
import type { LibraryBookRow } from "@/lib/library/books.server";
import type { BookQuiz } from "@/lib/library/quiz.server";
import { adminFieldClass, adminSelectClass, adminTextareaClass } from "@/components/admin/adminFormStyles";
import { toast } from "sonner";

type Props = {
  book: LibraryBookRow;
  annexes: AdminAnnex[];
  quiz: (BookQuiz & { isPublished: boolean }) | null;
};

function fileLabel(fileUrl: string | null): string {
  if (!fileUrl) return "";
  if (fileUrl.startsWith("uploads://")) return fileUrl.replace("uploads://library/", "");
  if (fileUrl.length > 60) return `${fileUrl.slice(0, 57)}…`;
  return fileUrl;
}

export default function AdminBookDetailClient({ book, annexes, quiz }: Props) {
  const t = useTranslations("Library.admin");
  const te = useTranslations("Library.errors");
  const ta = useTranslations("Library.audience");
  const tp = useTranslations("Library.sidePanel");
  const [pending, startTransition] = useTransition();

  const err = (code?: string | null) => {
    if (code && /^[a-z_]+$/.test(code)) return te(code as "upload_failed");
    return te("upload_failed");
  };

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author ?? "");
  const [description, setDescription] = useState(book.description ?? "");
  const [subject, setSubject] = useState(book.subject ?? "");
  const [language, setLanguage] = useState(book.language ?? "fr");
  const [audience, setAudience] = useState<LibraryAudience>(book.audience);
  const [ageMin, setAgeMin] = useState(book.ageMin != null ? String(book.ageMin) : "");
  const [ageMax, setAgeMax] = useState(book.ageMax != null ? String(book.ageMax) : "");
  const [isPublished, setIsPublished] = useState(book.isPublished);
  const [storedFile, setStoredFile] = useState(book.fileUrl);
  const [bookFormat, setBookFormat] = useState(book.format);

  const bookFileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const [annexTitle, setAnnexTitle] = useState("");
  const [annexUrl, setAnnexUrl] = useState("");

  const [quizTitle, setQuizTitle] = useState(quiz?.title ?? t("defaultQuizTitle", { title: book.title }));
  const [quizPublished, setQuizPublished] = useState(quiz?.isPublished ?? true);
  const [qText, setQText] = useState("");
  const [qOptions, setQOptions] = useState(t("defaultQuizOptions"));
  const [qCorrect, setQCorrect] = useState("0");

  const buildMetaFormData = () => {
    const fd = new FormData();
    fd.set("id", String(book.id));
    fd.set("title", title);
    fd.set("author", author);
    fd.set("description", description);
    fd.set("subject", subject);
    fd.set("language", language);
    fd.set("audience", audience);
    fd.set("ageMin", ageMin);
    fd.set("ageMax", ageMax);
    fd.set("isPublished", isPublished ? "true" : "false");
    return fd;
  };

  const buildUploadFormData = () => {
    const fd = buildMetaFormData();
    fd.delete("id");
    fd.set("bookId", String(book.id));
    const bookFile = bookFileRef.current?.files?.[0];
    const cover = coverRef.current?.files?.[0];
    if (bookFile) fd.set("bookFile", bookFile);
    if (cover) fd.set("cover", cover);
    return { fd, hasBookFile: !!bookFile, hasCover: !!cover, bookFile };
  };

  const saveBook = () => {
    startTransition(async () => {
      const res = await updateLibraryBookAction(buildMetaFormData());
      if ("error" in res && res.error) toast.error(res.error);
      else toast.success(t("bookSaved"));
    });
  };

  const replaceFiles = () => {
    const { fd, hasBookFile, hasCover, bookFile } = buildUploadFormData();
    if (!hasBookFile && !hasCover) {
      toast.error(t("pickEpubOrCover"));
      return;
    }

    startTransition(async () => {
      const res = await fetch("/api/admin/library/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { error?: string; success?: boolean; format?: string };
      if (!res.ok || data.error) {
        toast.error(err(data.error));
        return;
      }
      if (hasBookFile && hasCover) toast.success(t("filesUpdated"));
      else if (hasBookFile) {
        const isPdf = data.format === "pdf" || bookFile?.name.toLowerCase().endsWith(".pdf");
        toast.success(isPdf ? t("pdfReplaced") : t("epubReplaced"));
        setBookFormat(isPdf ? "pdf" : "epub");
        setStoredFile(`uploads://library/${book.id}.${isPdf ? "pdf" : "epub"}`);
      } else toast.success(t("coverReplaced"));
      if (bookFileRef.current) bookFileRef.current.value = "";
      if (coverRef.current) coverRef.current.value = "";
    });
  };

  const addAnnex = () => {
    if (!annexTitle.trim() || !annexUrl.trim()) {
      toast.error(t("annexRequired"));
      return;
    }
    const fd = new FormData();
    fd.set("bookId", String(book.id));
    fd.set("title", annexTitle);
    fd.set("url", annexUrl);
    startTransition(async () => {
      const res = await saveAnnexAction(fd);
      if ("error" in res && res.error) toast.error(res.error);
      else {
        toast.success(t("annexAdded"));
        setAnnexTitle("");
        setAnnexUrl("");
      }
    });
  };

  const saveQuiz = () => {
    const fd = new FormData();
    fd.set("bookId", String(book.id));
    fd.set("title", quizTitle);
    fd.set("isPublished", quizPublished ? "true" : "false");
    startTransition(async () => {
      const res = await saveQuizMetaAction(fd);
      if ("error" in res && res.error) toast.error(res.error);
      else toast.success(t("quizSaved"));
    });
  };

  const addQuestion = () => {
    if (!quiz?.id) {
      toast.error(t("quizSaveFirst"));
      return;
    }
    const fd = new FormData();
    fd.set("quizId", String(quiz.id));
    fd.set("bookId", String(book.id));
    fd.set("question", qText);
    fd.set("options", qOptions);
    fd.set("correctIndex", qCorrect);
    fd.set("sortOrder", String(quiz.questions.length));
    startTransition(async () => {
      const res = await saveQuizQuestionAction(fd);
      if ("error" in res && res.error) toast.error(res.error);
      else {
        toast.success(t("questionAdded"));
        setQText("");
      }
    });
  };

  return (
    <div className="space-y-8">
      <Link
        href="/dashboard/admin/library"
        className="inline-flex items-center gap-2 text-sm font-bold text-slate-600 hover:text-slate-900"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backCatalog")}
      </Link>

      <section className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-6">
        <h2 className="text-sm font-black uppercase text-indigo-900 mb-2">{t("filesSection")}</h2>
        <p className="mb-4 text-xs text-indigo-800">
          {t("currentFile")} :{" "}
          <span className="font-mono font-bold">
            {storedFile ? fileLabel(storedFile) : t("noFile")}
          </span>
          {storedFile && (
            <span className="ml-2 rounded bg-indigo-200 px-1.5 py-0.5 text-[10px] font-black uppercase">
              {bookFormat === "pdf" ? t("formatPdf") : t("formatEpub")}
            </span>
          )}
        </p>
        <div className="grid gap-3 sm:grid-cols-2">
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-600">{t("replaceBookFile")}</span>
            <input ref={bookFileRef} type="file" accept=".epub,.pdf,application/epub+zip,application/pdf" className="mt-1 w-full text-sm" />
          </label>
          <label className="block">
            <span className="text-xs font-black uppercase text-slate-600">{t("replaceCover")}</span>
            <input ref={coverRef} type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 w-full text-sm" />
          </label>
        </div>
        <button
          type="button"
          disabled={pending}
          onClick={replaceFiles}
          className="mt-4 inline-flex items-center gap-2 rounded-xl bg-indigo-700 px-5 py-2.5 text-xs font-black uppercase text-white disabled:opacity-50"
        >
          <FileUp className="h-4 w-4" />
          {t("replaceFiles")}
        </button>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-black uppercase text-slate-700 mb-4">
          {t("editBook")} #{book.id}
        </h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <input value={title} onChange={(e) => setTitle(e.target.value)} placeholder={t("fieldTitle")} className={adminFieldClass} />
          <input value={author} onChange={(e) => setAuthor(e.target.value)} placeholder={t("fieldAuthor")} className={adminFieldClass} />
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} placeholder={t("fieldDescription")} rows={2} className={`sm:col-span-2 ${adminTextareaClass}`} />
          <input value={subject} onChange={(e) => setSubject(e.target.value)} placeholder={t("fieldSubject")} className={adminFieldClass} />
          <select value={language} onChange={(e) => setLanguage(e.target.value)} className={adminSelectClass}>
            <option value="fr">{t("langFr")}</option>
            <option value="ar">{t("langAr")}</option>
          </select>
          <select value={audience} onChange={(e) => setAudience(e.target.value as LibraryAudience)} className={`sm:col-span-2 ${adminSelectClass}`}>
            <option value="teachers">{ta("teachers")}</option>
            <option value="parents">{ta("parents")}</option>
            <option value="family">{ta("family")}</option>
          </select>
          <div className="flex gap-2">
            <input value={ageMin} onChange={(e) => setAgeMin(e.target.value)} placeholder={t("fieldAgeMin")} className={`w-full ${adminFieldClass}`} />
            <input value={ageMax} onChange={(e) => setAgeMax(e.target.value)} placeholder={t("fieldAgeMax")} className={`w-full ${adminFieldClass}`} />
          </div>
          <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
            <input type="checkbox" checked={isPublished} onChange={(e) => setIsPublished(e.target.checked)} />
            {t("published")}
          </label>
        </div>
        <button type="button" disabled={pending} onClick={saveBook} className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black uppercase text-white disabled:opacity-50">
          {t("saveMetadata")}
        </button>
      </section>

      <section className="rounded-2xl border border-teal-200 bg-teal-50/40 p-6">
        <h2 className="text-sm font-black uppercase text-teal-900 mb-4">{t("annexesTitle", { count: annexes.length })}</h2>
        <ul className="mb-4 space-y-2">
          {annexes.map((a) => (
            <li key={a.id} className="flex items-center justify-between gap-2 rounded-xl bg-white px-3 py-2 text-sm">
              <span className="font-bold truncate">{a.title}</span>
              <button
                type="button"
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    await removeAnnexAction(a.id, book.id);
                    toast.success(t("annexRemoved"));
                  })
                }
                className="text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </li>
          ))}
        </ul>
        <div className="grid gap-2 sm:grid-cols-2">
          <input value={annexTitle} onChange={(e) => setAnnexTitle(e.target.value)} placeholder={t("annexTitle")} className={adminFieldClass} />
          <input value={annexUrl} onChange={(e) => setAnnexUrl(e.target.value)} placeholder={t("annexUrl")} className={adminFieldClass} />
        </div>
        <button type="button" disabled={pending} onClick={addAnnex} className="mt-3 inline-flex items-center gap-1 rounded-xl bg-teal-700 px-4 py-2 text-xs font-black uppercase text-white">
          <Plus className="h-3 w-3" /> {t("annexAdd")}
        </button>
      </section>

      <section className="rounded-2xl border border-orange-200 bg-orange-50/40 p-6">
        <h2 className="text-sm font-black uppercase text-orange-900 mb-4">{t("quizSection")}</h2>
        <div className="grid gap-3 sm:grid-cols-2 mb-4">
          <input value={quizTitle} onChange={(e) => setQuizTitle(e.target.value)} placeholder={t("quizTitle")} className={adminFieldClass} />
          <label className="flex items-center gap-2 text-sm font-bold">
            <input type="checkbox" checked={quizPublished} onChange={(e) => setQuizPublished(e.target.checked)} />
            {t("quizPublished")}
          </label>
        </div>
        <button type="button" disabled={pending} onClick={saveQuiz} className="mb-6 rounded-xl bg-orange-600 px-4 py-2 text-xs font-black uppercase text-white">
          {t("quizSave")}
        </button>

        {quiz && quiz.questions.length > 0 && (
          <ul className="mb-4 space-y-2">
            {quiz.questions.map((q) => (
              <li key={q.id} className="rounded-xl bg-white px-3 py-2 text-sm">
                <p className="font-bold">{q.question}</p>
                <p className="text-xs text-slate-500">{q.options.join(" · ")}</p>
                <button
                  type="button"
                  disabled={pending}
                  onClick={() =>
                    startTransition(async () => {
                      await removeQuizQuestionAction(q.id, book.id);
                      toast.success(t("questionRemoved"));
                    })
                  }
                  className="mt-1 text-xs font-bold text-red-600"
                >
                  {tp("deleteMark")}
                </button>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-2">
          <input value={qText} onChange={(e) => setQText(e.target.value)} placeholder={t("questionNew")} className={`w-full ${adminFieldClass}`} />
          <textarea value={qOptions} onChange={(e) => setQOptions(e.target.value)} placeholder={t("questionOptions")} rows={4} className={`w-full ${adminTextareaClass}`} />
          <input value={qCorrect} onChange={(e) => setQCorrect(e.target.value)} placeholder={t("questionCorrectIndex")} className={`w-32 ${adminFieldClass}`} />
          <button type="button" disabled={pending} onClick={addQuestion} className="inline-flex items-center gap-1 rounded-xl bg-orange-700 px-4 py-2 text-xs font-black uppercase text-white">
            <Plus className="h-3 w-3" /> {t("addQuestion")}
          </button>
        </div>
      </section>
    </div>
  );
}

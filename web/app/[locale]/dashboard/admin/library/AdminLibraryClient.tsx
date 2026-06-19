"use client";

import React, { useMemo, useRef, useState, useTransition } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import {
  deleteLibraryBookAction,
  toggleFeaturedBookAction,
  toggleLibraryBookAction,
} from "@/lib/actions/library_admin";
import { checkCalibreConnectionAction, syncCalibreAction } from "@/lib/actions/library";
import type { LibraryAudience } from "@/lib/library/audience";
import type { LibraryBookRow } from "@/lib/library/books.server";
import { Search, Settings2, Star, Trash2 } from "lucide-react";
import { adminFieldClass, adminSelectClass, adminTextareaClass } from "@/components/admin/adminFormStyles";
import { toast } from "sonner";

export default function AdminLibraryClient({ books }: { books: LibraryBookRow[] }) {
  const t = useTranslations("Library.admin");
  const te = useTranslations("Library.errors");
  const ta = useTranslations("Library.audience");
  const [pending, startTransition] = useTransition();
  const [query, setQuery] = useState("");
  const [audienceFilter, setAudienceFilter] = useState<"all" | LibraryAudience>("all");
  const [statusFilter, setStatusFilter] = useState<"all" | "published" | "draft">("all");
  const [calibreStatus, setCalibreStatus] = useState<string | null>(null);

  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [subject, setSubject] = useState("");
  const [description, setDescription] = useState("");
  const [language, setLanguage] = useState("fr");
  const [audience, setAudience] = useState<LibraryAudience>("family");
  const [ageMin, setAgeMin] = useState("");
  const [ageMax, setAgeMax] = useState("");
  const bookFileRef = useRef<HTMLInputElement>(null);
  const coverRef = useRef<HTMLInputElement>(null);

  const err = (code?: string | null) => {
    if (code && /^[a-z_]+$/.test(code)) return te(code as "upload_failed");
    return te("upload_failed");
  };

  const filtered = useMemo(() => {
    let list = books;
    if (audienceFilter !== "all") list = list.filter((b) => b.audience === audienceFilter);
    if (statusFilter === "published") list = list.filter((b) => b.isPublished);
    if (statusFilter === "draft") list = list.filter((b) => !b.isPublished);
    if (query.trim()) {
      const q = query.toLowerCase();
      list = list.filter(
        (b) =>
          b.title.toLowerCase().includes(q) ||
          (b.author ?? "").toLowerCase().includes(q) ||
          (b.subject ?? "").toLowerCase().includes(q)
      );
    }
    return list;
  }, [books, query, audienceFilter, statusFilter]);

  const handleCreate = () => {
    if (!title.trim()) {
      toast.error(err("title_required"));
      return;
    }
    const bookFile = bookFileRef.current?.files?.[0];
    if (!bookFile) {
      toast.error(err("file_required"));
      return;
    }

    const fd = new FormData();
    fd.set("title", title);
    fd.set("author", author);
    fd.set("subject", subject);
    fd.set("description", description);
    fd.set("language", language);
    fd.set("audience", audience);
    fd.set("ageMin", ageMin);
    fd.set("ageMax", ageMax);
    fd.set("isPublished", "true");
    fd.set("bookFile", bookFile);
    const cover = coverRef.current?.files?.[0];
    if (cover) fd.set("cover", cover);

    startTransition(async () => {
      const res = await fetch("/api/admin/library/upload", { method: "POST", body: fd });
      const data = (await res.json()) as { error?: string; success?: boolean };
      if (!res.ok || data.error) {
        toast.error(err(data.error));
        return;
      }
      toast.success(t("bookSaved"));
      setTitle("");
      setAuthor("");
      setSubject("");
      setDescription("");
      if (bookFileRef.current) bookFileRef.current.value = "";
      if (coverRef.current) coverRef.current.value = "";
    });
  };

  const handleToggle = (id: number, current: boolean) => {
    startTransition(async () => {
      const res = await toggleLibraryBookAction(id, !current);
      if ("error" in res && res.error) toast.error(res.error);
    });
  };

  const handleDelete = (id: number) => {
    if (!confirm(t("deleteConfirm"))) return;
    startTransition(async () => {
      const res = await deleteLibraryBookAction(id);
      if ("error" in res && res.error) toast.error(res.error);
      else toast.success(t("bookDeleted"));
    });
  };

  const handleFeatured = (id: number, featured: boolean) => {
    startTransition(async () => {
      await toggleFeaturedBookAction(id, featured);
    });
  };

  const handleSyncCalibre = () => {
    startTransition(async () => {
      const res = await syncCalibreAction();
      if ("error" in res && res.error) {
        toast.error(res.error);
        return;
      }
      if (!("imported" in res)) return;
      toast.success(t("calibreImported", { imported: res.imported, updated: res.updated ?? 0 }));
    });
  };

  const handleCheckCalibre = () => {
    startTransition(async () => {
      const res = await checkCalibreConnectionAction();
      if ("error" in res && res.error) setCalibreStatus(res.error);
      else setCalibreStatus("message" in res ? res.message : "OK");
    });
  };

  return (
    <div className="space-y-8">
      <section className="rounded-2xl border border-dashed border-violet-200 bg-violet-50/50 p-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-sm text-violet-900 font-medium">{t("subtitle")}</p>
          {calibreStatus && <p className="text-xs text-violet-700 mt-1">{calibreStatus}</p>}
        </div>
        <div className="flex flex-wrap gap-2">
          <button type="button" disabled={pending} onClick={handleCheckCalibre} className="rounded-xl border border-violet-300 bg-white px-4 py-2 text-xs font-black uppercase text-violet-800 disabled:opacity-50">
            {t("testCalibre")}
          </button>
          <button type="button" disabled={pending} onClick={handleSyncCalibre} className="rounded-xl bg-violet-700 px-4 py-2 text-xs font-black uppercase text-white disabled:opacity-50">
            {t("importCalibre")}
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
        <h2 className="text-sm font-black uppercase text-slate-700 mb-4">{t("addBook")}</h2>
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
          <label className="sm:col-span-2 block">
            <span className="text-xs font-black uppercase text-slate-600">{t("bookFileRequired")}</span>
            <input ref={bookFileRef} type="file" accept=".epub,.pdf,application/epub+zip,application/pdf" className="mt-1 w-full text-sm" />
          </label>
          <label className="sm:col-span-2 block">
            <span className="text-xs font-black uppercase text-slate-600">{t("coverOptional")}</span>
            <input ref={coverRef} type="file" accept="image/jpeg,image/png,image/webp" className="mt-1 w-full text-sm" />
          </label>
        </div>
        <button type="button" disabled={pending} onClick={handleCreate} className="mt-4 rounded-xl bg-slate-900 px-5 py-2.5 text-xs font-black uppercase text-white disabled:opacity-50">
          {t("publish")}
        </button>
      </section>

      <section>
        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h2 className="text-sm font-black uppercase text-slate-700">{t("catalog")} ({filtered.length}/{books.length})</h2>
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={t("search")} className={`w-full py-2 pl-10 pr-3 ${adminFieldClass}`} />
          </div>
        </div>
        <div className="mb-3 flex flex-wrap gap-2">
          {(["all", "teachers", "parents", "family"] as const).map((a) => (
            <button key={a} type="button" onClick={() => setAudienceFilter(a)} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${audienceFilter === a ? "bg-teal-700 text-white" : "bg-slate-100 text-slate-600"}`}>
              {a === "all" ? t("allAudiences") : ta(a)}
            </button>
          ))}
          {(["all", "published", "draft"] as const).map((s) => (
            <button key={s} type="button" onClick={() => setStatusFilter(s)} className={`rounded-full px-3 py-1 text-[10px] font-black uppercase ${statusFilter === s ? "bg-violet-700 text-white" : "bg-slate-100 text-slate-600"}`}>
              {s === "all" ? t("allStatuses") : s === "published" ? t("published") : t("draft")}
            </button>
          ))}
        </div>

        {filtered.length === 0 ? (
          <p className="text-sm text-slate-500">{t("catalogEmpty")}</p>
        ) : (
          <ul className="divide-y divide-slate-100 rounded-2xl border border-slate-200 bg-white overflow-hidden">
            {filtered.map((book) => {
              const featured = book.isFeatured;
              const formatLabel = book.format === "pdf" ? t("formatPdf") : t("formatEpub");
              return (
                <li key={book.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-3">
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-slate-900">{book.title}</p>
                    <p className="text-xs text-slate-500">
                      {formatLabel} · {ta(book.audience)} · {book.language ?? "fr"} · {book.author || "—"}
                    </p>
                  </div>
                  <div className="flex flex-wrap items-center gap-2">
                    <Link href={`/dashboard/admin/library/${book.id}`} className="inline-flex items-center gap-1 rounded-lg bg-slate-100 px-3 py-1.5 text-[10px] font-black uppercase text-slate-700 hover:bg-slate-200">
                      <Settings2 className="h-3 w-3" /> {t("manage")}
                    </Link>
                    <button type="button" disabled={pending} onClick={() => handleFeatured(book.id, !featured)} className={`rounded-lg px-2 py-1.5 ${featured ? "bg-amber-100 text-amber-800" : "bg-slate-100 text-slate-500"}`}>
                      <Star className="h-3.5 w-3.5" />
                    </button>
                    <button type="button" disabled={pending} onClick={() => handleToggle(book.id, book.isPublished)} className={`rounded-lg px-3 py-1.5 text-[10px] font-black uppercase ${book.isPublished ? "bg-emerald-100 text-emerald-800" : "bg-slate-100 text-slate-600"}`}>
                      {book.isPublished ? t("published") : t("draft")}
                    </button>
                    <button type="button" disabled={pending} onClick={() => handleDelete(book.id)} className="rounded-lg bg-red-50 px-2 py-1.5 text-red-600">
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>
    </div>
  );
}

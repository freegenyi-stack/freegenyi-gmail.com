"use client";



import React, { useMemo, useState, useTransition } from "react";

import { useLocale, useTranslations } from "next-intl";

import { BookMarked, Filter, Languages, Search, UserPlus } from "lucide-react";

import { Link } from "@/i18n/routing";

import { Badge } from "@/components/ui/badge";

import { Button } from "@/components/ui/button";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

import { Input } from "@/components/ui/input";

import { cn } from "@/lib/utils";

import type { LibraryAssignmentRow, LibraryBookRow, TeacherSchoolChild } from "@/lib/library/books.server";

import { assignBookToStudentAction } from "@/lib/actions/library";

import { TeacherPageHeader } from "./TeacherShell";

import { toast } from "sonner";



type Props = {

  books: LibraryBookRow[];

  schoolChildren: TeacherSchoolChild[];

  assignments: LibraryAssignmentRow[];

};



export default function TeacherLibraryClient({ books, schoolChildren, assignments }: Props) {

  const locale = useLocale();

  const t = useTranslations("TeacherSpace.library");

  const [langFilter, setLangFilter] = useState<"all" | "ar" | "fr">("all");

  const [subjectFilter, setSubjectFilter] = useState<string>("all");

  const [query, setQuery] = useState("");

  const [assignBookId, setAssignBookId] = useState<number | null>(null);

  const [childId, setChildId] = useState("");

  const [note, setNote] = useState("");

  const [pending, startTransition] = useTransition();



  const subjects = useMemo(() => {
    const set = new Set<string>();
    for (const b of books) {
      const s = b.subject?.trim();
      if (s) set.add(s);
    }
    return ["all", ...Array.from(set).sort()];
  }, [books]);

  const filtered = useMemo(() => {

    let list = books;

    if (langFilter !== "all") {

      list = list.filter((b) => (b.language ?? "fr").startsWith(langFilter));

    }

    if (subjectFilter !== "all") {

      list = list.filter((b) => (b.subject ?? "").includes(subjectFilter));

    }

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

  }, [books, langFilter, subjectFilter, query]);



  const submitAssign = () => {

    if (assignBookId == null) return;

    const fd = new FormData();

    fd.set("bookId", String(assignBookId));

    if (childId) fd.set("childId", childId);

    if (note.trim()) fd.set("note", note.trim());



    startTransition(async () => {

      const res = await assignBookToStudentAction(fd);

      if ("error" in res && res.error) {

        toast.error(res.error);

        return;

      }

      toast.success(t("assignSuccess"));

      setAssignBookId(null);

      setChildId("");

      setNote("");

    });

  };



  return (

    <div>

      <TeacherPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} />



      {assignments.length > 0 && (

        <section className="mb-8 rounded-2xl border border-amber-100 bg-amber-50/50 p-4">

          <h2 className="text-xs font-black uppercase text-amber-900 mb-3">{t("assignmentsTitle")}</h2>

          <ul className="space-y-2">

            {assignments.slice(0, 8).map((a) => (

              <li key={a.id} className="text-sm text-slate-700">

                <span className="font-bold">{a.bookTitle}</span>

                {" → "}

                {a.childName ?? t("assignAll")}

                {a.note ? <span className="text-slate-500"> · {a.note}</span> : null}

              </li>

            ))}

          </ul>

        </section>

      )}



      <div className="mb-6 flex flex-col gap-3 sm:flex-row">

        <div className="relative flex-1">

          <Search className="absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 ltr:left-3 rtl:right-3" />

          <Input

            value={query}

            onChange={(e) => setQuery(e.target.value)}

            placeholder={t("searchPlaceholder")}

            className="rounded-xl border-slate-200 ltr:pl-10 rtl:pr-10 font-medium"

          />

        </div>

        <Button variant="outline" className="rounded-xl gap-2 font-bold shrink-0" type="button">
          <Filter className="h-4 w-4" /> {subjects.length - 1} {t("filters")}
        </Button>
      </div>

      <div className="mb-4 flex flex-wrap gap-2">
        {subjects.map((sub) => (
          <button
            key={sub}
            type="button"
            onClick={() => setSubjectFilter(sub)}
            className={cn(
              "rounded-full px-3 py-1.5 text-[10px] font-black uppercase transition",
              subjectFilter === sub
                ? "bg-amber-600 text-white"
                : "border border-slate-200 bg-white text-slate-600 hover:border-amber-300"
            )}
          >
            {sub === "all" ? t("allSubjects") : sub}
          </button>
        ))}
      </div>



      <div className="mb-6 flex flex-wrap gap-2">

        {(["all", "ar", "fr"] as const).map((lang) => (

          <button

            key={lang}

            type="button"

            onClick={() => setLangFilter(lang)}

            className={cn(

              "inline-flex items-center gap-1.5 rounded-full px-4 py-2 text-xs font-bold transition-colors",

              langFilter === lang ? "bg-amber-600 text-white" : "border border-slate-200 bg-white text-slate-600"

            )}

          >

            <Languages className="h-3.5 w-3.5" />

            {lang === "all" ? t("allLangs") : lang === "ar" ? t("arabic") : t("french")}

          </button>

        ))}

      </div>



      {filtered.length === 0 ? (

        <p className="text-center text-sm text-slate-500 py-12">{t("emptyCatalog")}</p>

      ) : (

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">

          {filtered.map((book) => (

            <Card key={book.id} className="group border-slate-100 shadow-sm transition-all hover:shadow-md">

              <CardHeader className="pb-2">

                <div className="mb-3 flex h-28 items-center justify-center rounded-xl bg-gradient-to-br from-amber-100 to-orange-50 overflow-hidden">

                  {book.coverUrl ? (

                    // eslint-disable-next-line @next/next/no-img-element

                    <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />

                  ) : (

                    <BookMarked className="h-10 w-10 text-amber-700/70" />

                  )}

                </div>

                <CardTitle className="text-sm font-black leading-snug line-clamp-2">{book.title}</CardTitle>

              </CardHeader>

              <CardContent className="pt-0">

                {book.author && <p className="text-xs text-slate-500 mb-2">{book.author}</p>}

                <div className="mb-3 flex flex-wrap gap-2">

                  <Badge variant="outline" className="font-bold uppercase text-[10px]">

                    {(book.language ?? "fr").startsWith("ar") ? t("arabic") : t("french")}

                  </Badge>

                  {book.subject && (

                    <Badge variant="outline" className="font-bold text-[10px]">

                      {book.subject}

                    </Badge>

                  )}

                </div>

                <div className="flex flex-col gap-2">

                  <Link href={`/dashboard/enseignant/bibliotheque/${book.id}`}>

                    <Button className="w-full rounded-xl bg-amber-600 hover:bg-amber-500 font-bold">

                      {t("read")}

                    </Button>

                  </Link>

                  <Button

                    type="button"

                    variant="outline"

                    className="w-full rounded-xl font-bold gap-2"

                    onClick={() => {

                      setAssignBookId(book.id);

                      setChildId("");

                      setNote("");

                    }}

                  >

                    <UserPlus className="h-4 w-4" />

                    {t("assign")}

                  </Button>

                </div>

              </CardContent>

            </Card>

          ))}

        </div>

      )}



      {assignBookId != null && (

        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">

          <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-xl">

            <h3 className="text-lg font-black text-slate-900 mb-4">{t("assignTitle")}</h3>

            {schoolChildren.length === 0 ? (

              <p className="text-sm text-slate-500 mb-4">{t("noStudents")}</p>

            ) : (

              <select

                value={childId}

                onChange={(e) => setChildId(e.target.value)}

                className="mb-3 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm font-medium"

              >

                <option value="">{t("assignAll")}</option>

                {schoolChildren.map((c) => (

                  <option key={c.id} value={c.id}>

                    {c.fullName}

                  </option>

                ))}

              </select>

            )}

            <textarea

              value={note}

              onChange={(e) => setNote(e.target.value)}

              rows={3}

              placeholder={t("assignNote")}

              className="mb-4 w-full rounded-xl border border-slate-200 px-3 py-2 text-sm resize-none"

            />

            <div className="flex gap-2 justify-end">

              <Button type="button" variant="outline" onClick={() => setAssignBookId(null)}>

                {t("cancel")}

              </Button>

              <Button type="button" disabled={pending} onClick={submitAssign} className="bg-amber-600 hover:bg-amber-500">

                {t("assignSubmit")}

              </Button>

            </div>

          </div>

        </div>

      )}

    </div>

  );

}


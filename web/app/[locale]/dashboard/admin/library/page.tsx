import React from "react";
import { getTranslations } from "next-intl/server";
import { listAllBooks } from "@/lib/library/books.server";
import AdminLibraryClient from "./AdminLibraryClient";

export default async function AdminLibraryPage() {
  const t = await getTranslations("Library.admin");
  const books = await listAllBooks();

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-slate-900">{t("title")}</h1>
        <p className="mt-1 text-sm text-slate-500">{t("subtitle")}</p>
      </div>
      <AdminLibraryClient books={books} />
    </div>
  );
}

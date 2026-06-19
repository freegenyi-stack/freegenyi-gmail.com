"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowLeft, Users } from "lucide-react";
import type { SchoolReadingRow } from "@/lib/library/books.server";

export default function TeacherClassReadingClient({ rows }: { rows: SchoolReadingRow[] }) {
  const t = useTranslations("Library.classReading");
  const locale = useLocale();

  return (
    <div className="space-y-6">
      <Link
        href="/dashboard/enseignant/bibliotheque"
        className="inline-flex items-center gap-2 text-sm font-bold text-amber-800 hover:text-amber-950"
      >
        <ArrowLeft className="h-4 w-4" />
        {t("back")}
      </Link>

      <div className="flex items-center gap-3">
        <Users className="h-8 w-8 text-amber-600" />
        <div>
          <h1 className="text-2xl font-black text-slate-900">{t("title")}</h1>
          <p className="text-sm text-slate-500">{t("subtitle")}</p>
        </div>
      </div>

      {rows.length === 0 ? (
        <p className="rounded-2xl border border-dashed border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
          {t("empty")}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white">
          <table className="w-full text-sm">
            <thead className="bg-amber-50 text-left text-[10px] font-black uppercase text-amber-900">
              <tr>
                <th className="px-4 py-3">{t("colStudent")}</th>
                <th className="px-4 py-3">{t("colBook")}</th>
                <th className="px-4 py-3">{t("colProgress")}</th>
                <th className="px-4 py-3">{t("colUpdated")}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {rows.map((r) => (
                <tr key={`${r.childId}-${r.bookId}`}>
                  <td className="px-4 py-3 font-bold text-slate-900">{r.childName}</td>
                  <td className="px-4 py-3 text-slate-700">{r.bookTitle}</td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-2">
                      <div className="h-2 w-24 overflow-hidden rounded-full bg-slate-100">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-amber-500 to-orange-500"
                          style={{ width: `${r.percent}%` }}
                        />
                      </div>
                      <span className="text-xs font-black text-amber-700">{r.percent}%</span>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-xs text-slate-500">
                    {new Date(r.updatedAt).toLocaleDateString(locale)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

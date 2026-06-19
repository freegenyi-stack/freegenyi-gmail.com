"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { BookOpen, School } from "lucide-react";
import type {
  ContinueReadingRow,
  FamilyAssignmentRow,
  LibraryBookRow,
} from "@/lib/library/books.server";
import type { LibraryDiscovery } from "@/lib/library/discovery.server";
import type {
  UserContinueRow,
  UserHistoryRow,
  UserReadingStats,
} from "@/lib/library/user-library.server";
import LibraryHub from "@/components/library/LibraryHub";
import { cn } from "@/lib/utils";

type Props = {
  books: LibraryBookRow[];
  assignments: FamilyAssignmentRow[];
  continueReading: ContinueReadingRow[];
  progressMap: Record<number, number>;
  userProgressMap?: Record<number, number>;
  discovery?: LibraryDiscovery;
  userStats?: UserReadingStats | null;
  userContinue?: UserContinueRow[];
  userHistory?: UserHistoryRow[];
  forYou?: LibraryBookRow[];
  statsPath?: string;
  basePath?: string;
  childId?: number | null;
  dark?: boolean;
  badges?: { key: string; label: string }[];
  userId?: number | null;
};

function ProgressBar({ percent, dark }: { percent: number; dark?: boolean }) {
  if (percent <= 0) return null;
  return (
    <div className="mt-3">
      <div
        className={cn(
          "mb-1 flex justify-between text-[10px] font-bold uppercase",
          dark ? "text-slate-400" : "text-slate-500"
        )}
      >
        <span>Progression</span>
        <span>{percent}%</span>
      </div>
      <div className={cn("h-2 overflow-hidden rounded-full", dark ? "bg-white/10" : "bg-slate-100")}>
        <div
          className="h-full rounded-full bg-gradient-to-r from-orange-500 to-amber-500 transition-all"
          style={{ width: `${Math.min(100, percent)}%` }}
        />
      </div>
    </div>
  );
}

function BookGrid({
  books,
  badge,
  progressMap,
  basePath,
  childId,
  dark,
  emptyLabel,
}: {
  books: LibraryBookRow[];
  badge?: string;
  progressMap: Record<number, number>;
  basePath: string;
  childId?: number | null;
  dark?: boolean;
  emptyLabel: string;
}) {
  if (books.length === 0) {
    return (
      <p className={cn("py-8 text-center text-sm", dark ? "text-slate-400" : "text-slate-500")}>
        {emptyLabel}
      </p>
    );
  }

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => {
        const href =
          childId != null ? `${basePath}/${book.id}?child=${childId}` : `${basePath}/${book.id}`;
        const percent = progressMap[book.id] ?? 0;

        return (
          <Link
            key={book.id}
            href={href}
            className={cn(
              "block rounded-2xl border p-4 shadow-sm transition hover:shadow-md",
              dark
                ? "border-white/10 bg-white/5 hover:border-violet-400/40"
                : "border-slate-200 bg-white hover:border-orange-300"
            )}
          >
            <div className="relative mb-3 flex h-36 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-orange-100 to-amber-50">
              {book.coverUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={book.coverUrl} alt="" className="h-full w-full object-cover" />
              ) : (
                <BookOpen className="h-10 w-10 text-orange-400" />
              )}
              {percent > 0 && (
                <span className="absolute bottom-2 right-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-black text-white">
                  {percent}%
                </span>
              )}
            </div>
            {badge && (
              <span className="mb-2 inline-block rounded-full bg-amber-100 px-2 py-0.5 text-[10px] font-black uppercase text-amber-800">
                {badge}
              </span>
            )}
            <h2 className={cn("font-black leading-snug", dark ? "text-white" : "text-slate-900")}>
              {book.title}
            </h2>
            {book.author && (
              <p className={cn("mt-1 text-xs", dark ? "text-slate-400" : "text-slate-500")}>
                {book.author}
              </p>
            )}
            <ProgressBar percent={percent} dark={dark} />
          </Link>
        );
      })}
    </div>
  );
}

export default function BibliothequeClient({
  books,
  assignments,
  continueReading,
  progressMap,
  userProgressMap = {},
  discovery,
  userStats,
  userContinue = [],
  userHistory = [],
  forYou = [],
  statsPath,
  basePath = "/dashboard/parent/bibliotheque",
  childId = null,
  dark = false,
  badges = [],
  userId = null,
}: Props) {
  const t = useTranslations("Library");
  const [tab, setTab] = useState<"assigned" | "catalog">(
    assignments.length > 0 ? "assigned" : "catalog"
  );

  const mergedProgress = { ...progressMap, ...userProgressMap };

  const assignedBooks: LibraryBookRow[] = assignments.map((a) => ({
    id: a.bookId,
    title: a.bookTitle,
    author: a.bookAuthor,
    description: null,
    format: "epub",
    fileUrl: null,
    coverUrl: null,
    ageMin: null,
    ageMax: null,
    subject: a.bookSubject,
    language: a.bookLanguage,
    isPublished: true,
    isFeatured: false,
    pageCount: null,
    calibreId: null,
    audience: "family" as const,
    createdAt: a.createdAt,
  }));

  const assignmentBadges = Object.fromEntries(
    assignments.map((a) => {
      if (a.childName) {
        const base = t("recommendedFor", { name: a.childName });
        const suffix = a.teacherName ? ` · ${a.teacherName}` : "";
        return [a.bookId, `${base}${suffix}`];
      }
      const base = t("recommendedBy", { name: a.teacherName ?? t("schoolDefault") });
      const note = a.note ? t("recommendedNote", { note: a.note }) : "";
      return [a.bookId, `${base}${note}`];
    })
  );

  if (books.length === 0 && assignments.length === 0 && !discovery) {
    return (
      <div className="rounded-3xl border-2 border-dashed border-orange-200 bg-orange-50/50 p-10 text-center">
        <BookOpen className="mx-auto mb-3 h-10 w-10 text-orange-400" />
        <p className="font-bold text-slate-800">{t("catalogEmptyTitle")}</p>
        <p className="mt-1 text-sm text-slate-600">{t("catalogEmptyDesc")}</p>
      </div>
    );
  }

  return (
    <div className="space-y-10">
      {discovery && (
        <LibraryHub
          basePath={basePath}
          dark={dark}
          userStats={userStats}
          discovery={discovery}
          userContinue={userContinue}
          childContinue={continueReading}
          userHistory={userHistory}
          userProgressMap={userProgressMap}
          childProgressMap={progressMap}
          childId={childId}
          forYou={forYou}
          statsPath={statsPath}
          badges={badges}
          userId={userId}
        />
      )}

      <div className="mb-8 flex flex-wrap gap-2 rounded-2xl border border-orange-100/80 bg-[#FFFBF7] p-1.5 shadow-sm">
        {assignments.length > 0 && (
          <button
            type="button"
            onClick={() => setTab("assigned")}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase",
              tab === "assigned"
                ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : dark
                  ? "border border-white/15 bg-white/5 text-slate-300"
                  : "border border-slate-200 bg-white text-slate-600"
            )}
          >
            <School className="h-4 w-4" />
            {t("assignedTab", { count: assignments.length })}
          </button>
        )}
        <button
          type="button"
          onClick={() => setTab("catalog")}
          className={cn(
            "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-xs font-black uppercase",
            tab === "catalog"
              ? "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : dark
                ? "border border-white/15 bg-white/5 text-slate-300"
                : "border border-slate-200 bg-white text-slate-600"
          )}
        >
          <BookOpen className="h-4 w-4" />
          {t("fullCatalogTab")}
        </button>
      </div>

      {tab === "assigned" ? (
        <div className="space-y-4">
          {assignedBooks.map((book) => (
            <div key={book.id}>
              <p className={cn("mb-2 text-xs font-bold", dark ? "text-amber-300" : "text-amber-800")}>
                {assignmentBadges[book.id]}
              </p>
              <BookGrid
                books={[book]}
                progressMap={mergedProgress}
                basePath={basePath}
                childId={childId}
                dark={dark}
                emptyLabel={t("sectionEmpty")}
              />
            </div>
          ))}
        </div>
      ) : (
        <BookGrid
          books={books}
          progressMap={mergedProgress}
          basePath={basePath}
          childId={childId}
          dark={dark}
          emptyLabel={t("sectionEmpty")}
        />
      )}
    </div>
  );
}

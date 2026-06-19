"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Award, BookOpen, Download, Flame, Sparkles, TrendingUp } from "lucide-react";
import { toast } from "sonner";
import type { LibraryBookRow } from "@/lib/library/books.server";
import type { LibraryDiscovery } from "@/lib/library/discovery.server";
import type { UserContinueRow, UserHistoryRow, UserReadingStats } from "@/lib/library/user-library.server";
import type { ContinueReadingRow } from "@/lib/library/books.server";
import { bookCoverSrc } from "@/lib/library/library-display";
import { cn } from "@/lib/utils";

type Props = {
  basePath: string;
  dark?: boolean;
  userStats?: UserReadingStats | null;
  discovery: LibraryDiscovery;
  userContinue?: UserContinueRow[];
  childContinue?: ContinueReadingRow[];
  userHistory?: UserHistoryRow[];
  userProgressMap?: Record<number, number>;
  childProgressMap?: Record<number, number>;
  childId?: number | null;
  forYou?: LibraryBookRow[];
  statsPath?: string;
  badges?: { key: string; label: string }[];
  enableOffline?: boolean;
  userId?: number | null;
  offlineWeekBookId?: number | null;
};

function ProgressBar({ percent, dark, label }: { percent: number; dark?: boolean; label: string }) {
  if (percent <= 0) return null;
  return (
    <div className="mt-3">
      <div
        className={cn(
          "mb-1 flex justify-between text-[10px] font-bold uppercase",
          dark ? "text-slate-400" : "text-slate-500"
        )}
      >
        <span>{label}</span>
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

function BookRow({
  books,
  basePath,
  progressMap,
  childId,
  dark,
  badge,
  enableOffline,
  userId,
  offlineLabels,
  progressLabel,
  offlineWeekBookId,
  offlineBadgeLabel,
  onOfflineCached,
}: {
  books: LibraryBookRow[];
  basePath: string;
  progressMap?: Record<number, number>;
  childId?: number | null;
  userId?: number | null;
  dark?: boolean;
  badge?: string;
  enableOffline?: boolean;
  offlineLabels: { success: string; quota: string; error: string; download: string };
  progressLabel: string;
  offlineWeekBookId?: number | null;
  offlineBadgeLabel: string;
  onOfflineCached?: (bookId: number) => void;
}) {
  const cacheBook = async (bookId: number, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    try {
      const res = await fetch("/api/library/offline", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ bookId, userId: userId ?? undefined, childId: childId ?? undefined }),
      });
      const data = (await res.json()) as { error?: string };
      if (!res.ok) {
        toast.error(data.error === "offline_quota" ? offlineLabels.quota : offlineLabels.error);
        return;
      }
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.ready;
        const cache = await caches.open("freegeny-library-v2");
        await cache.add(`/api/library/books/${bookId}/file`);
        await cache.add(`/api/library/books/${bookId}/readium/manifest.json`);
      }
      onOfflineCached?.(bookId);
      toast.success(offlineLabels.success);
    } catch {
      toast.error(offlineLabels.error);
    }
  };
  if (!books.length) return null;

  return (
    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
      {books.map((book) => {
        const href =
          childId != null ? `${basePath}/${book.id}?child=${childId}` : `${basePath}/${book.id}`;
        const percent = progressMap?.[book.id] ?? 0;
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
              {bookCoverSrc(book) ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={bookCoverSrc(book)!} alt="" className="h-full w-full object-cover" />
              ) : (
                <BookOpen className="h-10 w-10 text-orange-400" />
              )}
              {badge && (
                <span className="absolute left-2 top-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-black uppercase text-white">
                  {badge}
                </span>
              )}
              {percent > 0 && (
                <span className="absolute bottom-2 right-2 rounded-full bg-slate-900/80 px-2 py-0.5 text-[10px] font-black text-white">
                  {percent}%
                </span>
              )}
              {offlineWeekBookId === book.id && (
                <span className="absolute right-2 top-2 rounded-full bg-orange-500/90 px-2 py-0.5 text-[9px] font-black uppercase text-white">
                  {offlineBadgeLabel}
                </span>
              )}
              {enableOffline && (userId || childId) && (
                <button
                  type="button"
                  title={offlineLabels.download}
                  onClick={(e) => void cacheBook(book.id, e)}
                  className="absolute bottom-2 left-2 rounded-full bg-white/90 p-1.5 text-slate-700 shadow hover:bg-white"
                >
                  <Download className="h-3.5 w-3.5" />
                </button>
              )}
            </div>
            <h2 className={cn("font-black leading-snug", dark ? "text-white" : "text-slate-900")}>
              {book.title}
            </h2>
            {book.author && (
              <p className={cn("mt-1 text-xs", dark ? "text-slate-400" : "text-slate-500")}>
                {book.author}
              </p>
            )}
            <ProgressBar percent={percent} dark={dark} label={progressLabel} />
          </Link>
        );
      })}
    </div>
  );
}

function Section({
  title,
  icon,
  children,
  dark,
}: {
  title: string;
  icon: React.ReactNode;
  children: React.ReactNode;
  dark?: boolean;
}) {
  return (
    <section className="space-y-4">
      <div className="flex items-center gap-2">
        {icon}
        <h2 className={cn("text-lg font-black", dark ? "text-white" : "text-slate-900")}>{title}</h2>
      </div>
      {children}
    </section>
  );
}

export default function LibraryHub({
  basePath,
  dark,
  userStats,
  discovery,
  userContinue = [],
  childContinue = [],
  userHistory = [],
  userProgressMap = {},
  childProgressMap = {},
  childId = null,
  forYou = [],
  statsPath,
  badges = [],
  enableOffline = true,
  userId = null,
}: Props) {
  const t = useTranslations("Library");
  const [offlineWeekBookId, setOfflineWeekBookId] = useState<number | null>(null);

  useEffect(() => {
    if (!enableOffline || (!userId && !childId)) return;
    const params = new URLSearchParams();
    if (userId) params.set("userId", String(userId));
    if (childId) params.set("childId", String(childId));
    void fetch(`/api/library/offline?${params}`)
      .then((r) => r.json())
      .then((d: { weekBookId?: number | null }) => setOfflineWeekBookId(d.weekBookId ?? null))
      .catch(() => {});
  }, [enableOffline, userId, childId]);

  const progressMap = { ...childProgressMap, ...userProgressMap };
  const offlineLabels = {
    success: t("offlineSuccess"),
    quota: t("offlineQuota"),
    error: t("offlineError"),
    download: t("offlineDownload"),
  };
  const bookRowProps = {
    basePath,
    progressMap,
    childId,
    userId,
    dark,
    enableOffline,
    offlineLabels,
    progressLabel: t("progress"),
    offlineWeekBookId,
    offlineBadgeLabel: t("offlineBadge"),
    onOfflineCached: setOfflineWeekBookId,
  };

  return (
    <div className="space-y-10">
      {badges.length > 0 && (
        <Section
          title={t("badgesTitle")}
          icon={<Award className={cn("h-5 w-5", dark ? "text-amber-400" : "text-amber-600")} />}
          dark={dark}
        >
          <div className="flex flex-wrap gap-2">
            {badges.map((b) => (
              <span
                key={b.key}
                className={cn(
                  "rounded-full px-3 py-1.5 text-xs font-black",
                  dark ? "bg-amber-500/20 text-amber-200" : "bg-amber-100 text-amber-900"
                )}
              >
                {t(`badges.${b.key}` as "badges.first_book")}
              </span>
            ))}
          </div>
        </Section>
      )}
      {userStats && (
        <div
          className={cn(
            "grid gap-3 rounded-3xl border p-5 sm:grid-cols-4",
            dark ? "border-white/10 bg-white/5" : "border-violet-200 bg-gradient-to-br from-violet-50 to-orange-50"
          )}
        >
          {[
            { label: t("statsFinished"), value: userStats.booksFinished },
            { label: t("statsReading"), value: userStats.booksReading },
            { label: t("statsPages"), value: userStats.pagesThisMonth },
            { label: t("statsStreak"), value: userStats.readingStreakDays },
          ].map((s) => (
            <div key={s.label}>
              <p className={cn("text-[10px] font-black uppercase", dark ? "text-violet-300" : "text-violet-600")}>
                {s.label}
              </p>
              <p className={cn("text-2xl font-black", dark ? "text-white" : "text-slate-900")}>{s.value}</p>
            </div>
          ))}
          {statsPath && (
            <div className="sm:col-span-4">
              <Link
                href={statsPath}
                className={cn(
                  "inline-flex rounded-xl px-4 py-2 text-xs font-black uppercase",
                  dark ? "bg-violet-600 text-white" : "bg-violet-600 text-white hover:bg-violet-700"
                )}
              >
                {t("statsDetail")}
              </Link>
            </div>
          )}
        </div>
      )}

      {userContinue.length > 0 && (
        <Section
          title={t("continueSelf")}
          icon={<Sparkles className={cn("h-5 w-5", dark ? "text-violet-400" : "text-violet-600")} />}
          dark={dark}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {userContinue.map((item) => (
              <Link
                key={item.bookId}
                href={`${basePath}/${item.bookId}`}
                className={cn(
                  "flex gap-4 rounded-2xl border p-4 transition hover:shadow-md",
                  dark ? "border-white/10 bg-white/5" : "border-white/80 bg-white/90"
                )}
              >
                <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                  <BookOpen className="h-8 w-8 text-orange-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[10px] font-black uppercase", dark ? "text-violet-300" : "text-violet-600")}>
                    {item.percent}%
                  </p>
                  <p className={cn("truncate font-black", dark ? "text-white" : "text-slate-900")}>
                    {item.title}
                  </p>
                  <ProgressBar percent={item.percent} dark={dark} label={t("progress")} />
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      {childContinue.length > 0 && (
        <Section
          title={t("continueChild")}
          icon={<Sparkles className="h-5 w-5 text-orange-500" />}
          dark={dark}
        >
          <div className="grid gap-4 sm:grid-cols-2">
            {childContinue.map((item) => (
              <Link
                key={`${item.childId}-${item.bookId}`}
                href={`${basePath}/${item.bookId}?child=${item.childId}`}
                className={cn(
                  "flex gap-4 rounded-2xl border p-4 transition hover:shadow-md",
                  dark ? "border-white/10 bg-white/5" : "border-white/80 bg-white/90"
                )}
              >
                <div className="flex h-20 w-16 shrink-0 items-center justify-center rounded-xl bg-orange-100">
                  <BookOpen className="h-8 w-8 text-orange-500" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className={cn("text-[10px] font-black uppercase", dark ? "text-orange-300" : "text-orange-600")}>
                    {item.childName.split(" ")[0]} · {item.percent}%
                  </p>
                  <p className={cn("truncate font-black", dark ? "text-white" : "text-slate-900")}>
                    {item.title}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </Section>
      )}

      <Section
        title={t("recent")}
        icon={<Sparkles className={cn("h-5 w-5", dark ? "text-amber-400" : "text-amber-600")} />}
        dark={dark}
      >
        <BookRow books={discovery.recent} {...bookRowProps} badge={t("newBadge")} />
      </Section>

      {discovery.trending.length > 0 && (
        <Section
          title={t("trending")}
          icon={<TrendingUp className={cn("h-5 w-5", dark ? "text-orange-400" : "text-orange-600")} />}
          dark={dark}
        >
          <BookRow books={discovery.trending} {...bookRowProps} />
        </Section>
      )}

      {discovery.mostRead.length > 0 && (
        <Section
          title={t("mostRead")}
          icon={<Flame className={cn("h-5 w-5", dark ? "text-orange-400" : "text-orange-600")} />}
          dark={dark}
        >
          <BookRow books={discovery.mostRead} {...bookRowProps} />
        </Section>
      )}

      {forYou.length > 0 && (
        <Section
          title={t("forYou")}
          icon={<BookOpen className={cn("h-5 w-5", dark ? "text-violet-400" : "text-violet-600")} />}
          dark={dark}
        >
          <BookRow books={forYou} {...bookRowProps} />
        </Section>
      )}

      {userHistory.length > 0 && (
        <Section
          title={t("history")}
          icon={<BookOpen className={cn("h-5 w-5", dark ? "text-slate-400" : "text-slate-600")} />}
          dark={dark}
        >
          <div className="space-y-2">
            {userHistory.map((item) => (
              <Link
                key={item.bookId}
                href={`${basePath}/${item.bookId}`}
                className={cn(
                  "flex items-center justify-between rounded-xl border px-4 py-3 text-sm transition hover:shadow-sm",
                  dark ? "border-white/10 bg-white/5 text-white" : "border-slate-200 bg-white text-slate-800"
                )}
              >
                <span className="truncate font-bold">{item.title}</span>
                <span className={cn("shrink-0 text-xs font-black", item.percent >= 100 ? "text-orange-600" : "text-amber-600")}>
                  {item.percent >= 100 ? t("finished") : `${item.percent}%`}
                </span>
              </Link>
            ))}
          </div>
        </Section>
      )}
    </div>
  );
}

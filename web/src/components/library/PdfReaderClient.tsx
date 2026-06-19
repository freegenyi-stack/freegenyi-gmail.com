"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { ArrowLeft, ChevronLeft, ChevronRight, Download, Volume2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { toast } from "sonner";

type Props = {
  bookId: number;
  title: string;
  backHref: string;
  userId?: number | null;
  childId?: number | null;
  initialPercent?: number;
  initialLocatorJson?: string | null;
  pageCount?: number | null;
  language?: string | null;
  readerRole?: "parent" | "teacher" | "child";
};

function parsePdfLocator(
  initialLocatorJson: string | null | undefined,
  initialPercent: number,
  pageCount?: number | null
) {
  let page = Math.max(1, Math.round((initialPercent / 100) * (pageCount || 10)) || 1);
  if (initialLocatorJson) {
    try {
      const parsed = JSON.parse(initialLocatorJson) as { page?: number };
      if (typeof parsed.page === "number" && parsed.page >= 1) {
        page = parsed.page;
      }
    } catch {
      /* ignore */
    }
  }
  const total = pageCount && pageCount > 0 ? pageCount : Math.max(page, 10);
  return { page, totalPages: total };
}

export default function PdfReaderClient({
  bookId,
  title,
  backHref,
  userId = null,
  childId = null,
  initialPercent = 0,
  initialLocatorJson = null,
  pageCount = null,
  language = "fr",
  readerRole,
}: Props) {
  const t = useTranslations("Library");
  const isParentChrome = readerRole === "parent";
  const initial = useMemo(
    () => parsePdfLocator(initialLocatorJson, initialPercent, pageCount),
    [initialLocatorJson, initialPercent, pageCount]
  );
  const [page, setPage] = useState(initial.page);
  const [totalPages, setTotalPages] = useState(initial.totalPages);
  const [speaking, setSpeaking] = useState(false);
  const src = `/api/library/books/${bookId}/file#page=${page}`;

  const percent = Math.min(100, Math.round((page / totalPages) * 100));

  const saveProgress = useCallback(
    async (p: number, pg: number) => {
      const locatorJson = JSON.stringify({ href: `page-${pg}`, type: "pdf", page: pg });
      try {
        if (userId) {
          await fetch("/api/library/user/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, bookId, percent: p, locatorJson }),
          });
        } else if (childId) {
          await fetch("/api/library/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ childId, bookId, percent: p, locatorJson, location: `page-${pg}` }),
          });
        }
      } catch {
        /* silent */
      }
    },
    [bookId, userId, childId]
  );

  useEffect(() => {
    const timer = setTimeout(() => void saveProgress(percent, page), 800);
    return () => clearTimeout(timer);
  }, [page, percent, saveProgress]);

  const prevPage = () => setPage((p) => Math.max(1, p - 1));
  const nextPage = () =>
    setPage((p) => {
      const next = p + 1;
      setTotalPages((total) => Math.max(total, next));
      return next;
    });

  const downloadOffline = async () => {
    try {
      if ("serviceWorker" in navigator) {
        await navigator.serviceWorker.ready;
        const cache = await caches.open("freegeny-library-v2");
        await cache.add(`/api/library/books/${bookId}/file`);
        toast.success(t("reader.pdfOfflineSuccess"));
      } else {
        window.open(`/api/library/books/${bookId}/file`, "_blank");
      }
    } catch {
      toast.error(t("reader.pdfOfflineError"));
    }
  };

  const speakTitle = () => {
    if (!window.speechSynthesis) {
      toast.error(t("reader.ttsUnavailable"));
      return;
    }
    setSpeaking(true);
    const utterance = new SpeechSynthesisUtterance(`${title}. Page ${page}.`);
    utterance.lang = language?.startsWith("ar") ? "ar" : "fr-FR";
    utterance.onend = () => setSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  return (
    <div
      className={`freegeny-reader-chrome fixed inset-0 z-[200] flex flex-col ${isParentChrome ? "freegeny-reader-chrome--parent bg-[#FFFBF7]" : "bg-slate-950"}`}
    >
      <header
        className={`z-[210] flex shrink-0 items-center gap-2 border-b px-3 py-2.5 sm:px-4 ${
          isParentChrome ? "border-orange-100 bg-[#FFFBF7]" : "border-white/10 bg-slate-950"
        }`}
      >
        <Link
          href={backHref}
          className={isParentChrome ? "fg-btn-header fg-btn-header--parent" : "fg-btn-header"}
        >
          <ArrowLeft className="h-4 w-4" />
          {t("reader.back")}
        </Link>
        <p
          className={`min-w-0 flex-1 truncate text-center text-sm font-black ${isParentChrome ? "text-slate-900" : "text-white"}`}
        >
          {title}
        </p>
        <span
          className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase ${
            isParentChrome ? "bg-orange-100 text-orange-700" : "bg-white/10 text-orange-300"
          }`}
        >
          PDF
        </span>
      </header>

      <div className="relative min-h-0 flex-1 pb-[4.5rem]">
        <iframe key={page} title={title} src={src} className="h-full w-full bg-white" />
      </div>

      <footer
        className={`fixed bottom-0 left-0 right-0 z-[220] border-t px-3 py-3 backdrop-blur-md ${
          isParentChrome ? "border-orange-100 bg-[#FFFBF7]/95" : "border-white/10 bg-slate-950/95"
        }`}
      >
        <div className="mx-auto flex max-w-3xl flex-wrap items-center justify-center gap-2">
          <button type="button" onClick={prevPage} className="fg-btn-tts !min-w-0 !px-3">
            <ChevronLeft className="h-4 w-4" />
          </button>
          <span className={`text-xs font-black ${isParentChrome ? "text-slate-700" : "text-white"}`}>
            p.{page} · {percent}%
          </span>
          <button type="button" onClick={nextPage} className="fg-btn-tts !min-w-0 !px-3">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button type="button" onClick={speakTitle} disabled={speaking} className="fg-btn-tts">
            <Volume2 className="h-4 w-4" />
            {t("reader.listenPage")}
          </button>
          <button type="button" onClick={() => void downloadOffline()} className="fg-btn-tts">
            <Download className="h-4 w-4" />
            {t("offlineDownload")}
          </button>
        </div>
        <p className={`mt-2 text-center text-[10px] ${isParentChrome ? "text-slate-400" : "text-slate-500"}`}>
          {t("reader.pdfFooterHint")}
        </p>
      </footer>
    </div>
  );
}

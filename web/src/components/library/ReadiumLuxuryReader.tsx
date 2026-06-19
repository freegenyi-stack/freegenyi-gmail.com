"use client";

import "@edrlab/thorium-web/reader/styles";
import "@edrlab/thorium-web/epub/styles";
import "@readium/css/css/dist/ReadiumCSS-before.css";
import "@readium/css/css/dist/ReadiumCSS-default.css";
import "@readium/css/css/dist/ReadiumCSS-after.css";
import "./readium-reader-chrome.css";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { ArrowLeft, BookOpen, Heart, List, Volume2 } from "lucide-react";
import { Link } from "@/i18n/routing";
import { ThStoreProvider } from "@edrlab/thorium-web/core/lib";
import {
  StatefulGlobalPreferencesProvider,
  StatefulReaderWrapper,
  usePublication,
  type PositionStorage,
} from "@edrlab/thorium-web/reader";
import type { Locator } from "@readium/shared";
import { toast } from "sonner";
import { applyHighlightMarks, getReaderIframe, waitForReaderPageText } from "@/lib/library/reader-iframe";
import {
  attachReaderEditingListeners,
  highlightReaderSelection,
  underlineReaderSelection,
  type ReaderSelectionAnchor,
} from "@/lib/library/reader-selection";
import { initThoriumI18n } from "@/lib/thorium-i18n";
import LibraryReaderSidePanel from "@/components/library/LibraryReaderSidePanel";
import ReaderSelectionMenu from "@/components/library/ReaderSelectionMenu";
import ReaderNoteDialog from "@/components/library/ReaderNoteDialog";
import ChildBookQuiz from "@/components/library/ChildBookQuiz";
import { useLocale, useTranslations } from "next-intl";

type Props = {
  bookId: number;
  title: string;
  childId?: number | null;
  userId?: number | null;
  backHref: string;
  language?: string | null;
  initialLocatorJson?: string | null;
  kioskMode?: boolean;
  readerRole?: "parent" | "teacher" | "child";
};

type ReaderMark = {
  id: number;
  locator: Locator;
  label: string | null;
  kind: string;
  createdAt: string;
};

function ttsLanguage(language?: string | null): string {
  if (language?.startsWith("ar")) return "ar";
  if (language?.startsWith("en")) return "en";
  return "fr";
}

function speakWithBrowser(text: string, lang: string, onDone: () => void): boolean {
  if (typeof window === "undefined" || !window.speechSynthesis) return false;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = lang === "ar" ? "ar-SA" : lang === "en" ? "en-US" : "fr-FR";
  utter.onend = onDone;
  utter.onerror = onDone;
  window.speechSynthesis.speak(utter);
  return true;
}

function ReaderLoadingState({ message }: { message?: string }) {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-6">
      <div className="flex items-center gap-4">
        <BookOpen className="h-11 w-11 animate-pulse text-amber-400" strokeWidth={1.5} aria-hidden />
        <Heart className="h-9 w-9 animate-pulse fill-rose-400/25 text-rose-400" strokeWidth={1.5} aria-hidden />
      </div>
      <p className="text-sm font-semibold tracking-wide text-slate-300">{message ?? "…"}</p>
    </div>
  );
}

function ThoriumI18nBootstrap({ children }: { children: React.ReactNode }) {
  const t = useTranslations("Library.reader");
  const [ready, setReady] = useState(false);

  useEffect(() => {
    void initThoriumI18n().then(() => setReady(true));
  }, []);

  if (!ready) return <ReaderLoadingState message={t("loading")} />;

  return <>{children}</>;
}

function ReaderInner({
  bookId,
  title,
  childId = null,
  userId = null,
  backHref,
  language,
  initialLocatorJson,
  kioskMode,
  readerRole,
}: Props) {
  const canAnnotate = !!(childId || userId);
  const isParentChrome = readerRole === "parent" && !kioskMode;
  const locale = useLocale();
  const readiumLng = locale.startsWith("ar") ? "ar" : locale.startsWith("en") ? "en" : "fr";
  const t = useTranslations("Library.reader");
  const labels = {
    back: t("back"),
    menu: t("menu"),
    listenPage: t("listenPage"),
    stop: t("stop"),
    loading: t("loading"),
  };
  const [panelTab, setPanelTab] = useState<"marks" | "review" | "plus">("marks");
  const [quizData, setQuizData] = useState<{
    quizId: number;
    title: string;
    questions: { id: number; question: string; options: string[] }[];
  } | null>(null);
  const finishedRef = useRef(false);
  const manifestUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/api/library/books/${bookId}/readium/manifest.json`
      : `/api/library/books/${bookId}/readium/manifest.json`;

  const [readerKey, setReaderKey] = useState(0);
  const [panelOpen, setPanelOpen] = useState(false);
  const [marks, setMarks] = useState<ReaderMark[]>([]);
  const [speaking, setSpeaking] = useState(false);
  const [selectionMenu, setSelectionMenu] = useState<ReaderSelectionAnchor | null>(null);
  const [noteDraft, setNoteDraft] = useState<string | null>(null);
  const pendingJumpRef = useRef<Locator | null>(null);
  const lastLocatorRef = useRef<string | null>(initialLocatorJson ?? null);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const { publication, profile, isLoading, error, localDataKey } = usePublication({
    url: manifestUrl,
  });

  useEffect(() => {
    if (typeof window === "undefined" || !("caches" in window)) return;
    void caches.open("freegeny-readium-v1").then((cache) => {
      void cache.add(manifestUrl);
      void cache.add(`/api/library/books/${bookId}/readium/positions.json`);
    });
  }, [bookId, manifestUrl]);

  useEffect(() => {
    if (!publication) return;
    return attachReaderEditingListeners(setSelectionMenu);
  }, [publication, readerKey]);

  const loadMarks = useCallback(async () => {
    if (!canAnnotate) return;
    try {
      const url = userId
        ? `/api/library/user/annotations?userId=${userId}&bookId=${bookId}`
        : `/api/library/books/${bookId}/bookmarks?childId=${childId}`;
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) return;
      const data = (await res.json()) as { bookmarks?: ReaderMark[]; annotations?: ReaderMark[] };
      const list = data.annotations ?? data.bookmarks ?? [];
      setMarks(list);
    } catch {
      /* ignore */
    }
  }, [bookId, childId, userId, canAnnotate]);

  useEffect(() => {
    void loadMarks();
  }, [loadMarks]);

  const highlights = useMemo(() => marks.filter((m) => m.kind === "highlight"), [marks]);
  const bookmarks = useMemo(
    () => marks.filter((m) => m.kind !== "highlight" && m.kind !== "note"),
    [marks]
  );
  const notes = useMemo(() => marks.filter((m) => m.kind === "note"), [marks]);

  useEffect(() => {
    if (!highlights.length) return;
    const snippets = highlights.map((h) => h.label).filter(Boolean) as string[];

    const paint = () => {
      const doc = getReaderIframe()?.contentDocument;
      if (!doc?.body) return false;
      applyHighlightMarks(doc, snippets);
      return true;
    };

    if (paint()) return;
    const timer = window.setInterval(() => {
      if (paint()) window.clearInterval(timer);
    }, 800);
    return () => window.clearInterval(timer);
  }, [highlights, readerKey, publication]);

  const positionStorage: PositionStorage = useMemo(
    () => ({
      get: () => {
        if (pendingJumpRef.current) {
          const jump = pendingJumpRef.current;
          pendingJumpRef.current = null;
          return jump;
        }
        const raw = lastLocatorRef.current ?? initialLocatorJson;
        if (!raw) return undefined;
        try {
          return JSON.parse(raw) as Locator;
        } catch {
          return undefined;
        }
      },
      set: async (locator: Locator) => {
        const json = JSON.stringify(locator);
        lastLocatorRef.current = json;
        const percent = Math.round((locator.locations?.totalProgression ?? 0) * 100);
        if (userId) {
          await fetch("/api/library/user/progress", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userId, bookId, locatorJson: json, percent }),
          });
          return;
        }
        if (!childId) return;
        await fetch("/api/library/progress", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ childId, bookId, locatorJson: json, percent }),
        });
        if (percent >= 100 && !finishedRef.current) {
          finishedRef.current = true;
          void fetch(`/api/library/books/${bookId}/quiz?childId=${childId}&ensure=1`)
            .then((r) => r.json())
            .then(
              (data: {
                quiz?: {
                  id: number;
                  title: string;
                  questions: { id: number; question: string; options: string[] }[];
                };
              }) => {
                if (data.quiz)
                  setQuizData({
                    quizId: data.quiz.id,
                    title: data.quiz.title,
                    questions: data.quiz.questions,
                  });
              }
            )
            .catch(() => undefined);
        }
      },
    }),
    [bookId, childId, userId, initialLocatorJson]
  );

  const jumpToLocator = useCallback((locator: Locator) => {
    pendingJumpRef.current = locator;
    setReaderKey((k) => k + 1);
    setPanelOpen(false);
  }, []);

  const addMark = useCallback(
    async (
      kind: "bookmark" | "highlight" | "note" | "underline",
      markLabel?: string,
      noteText?: string,
      color?: string
    ) => {
      if (!canAnnotate) {
        toast.error(t("authRequired"));
        return;
      }
      if (!lastLocatorRef.current) {
        toast.error(t("waitForPage"));
        return;
      }
      try {
        const locator = JSON.parse(lastLocatorRef.current) as Locator;
        if (userId) {
          const res = await fetch("/api/library/user/annotations", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              userId,
              bookId,
              locator,
              label: markLabel || title,
              noteText,
              kind,
              color: kind === "highlight" ? color || "yellow" : undefined,
            }),
          });
          if (!res.ok) throw new Error();
        } else {
          const res = await fetch(`/api/library/books/${bookId}/bookmarks`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              childId,
              locator,
              label: markLabel || title,
              noteText,
              kind,
              color: kind === "highlight" ? color || "yellow" : undefined,
            }),
          });
          if (!res.ok) throw new Error();
        }
        toast.success(
          kind === "highlight"
            ? t("highlightSaved")
            : kind === "underline"
              ? t("underlineSaved")
              : kind === "note"
                ? t("noteSaved")
                : t("bookmarkSaved")
        );
        await loadMarks();
      } catch {
        toast.error(t("saveFailed"));
      }
    },
    [bookId, childId, userId, canAnnotate, loadMarks, title, t]
  );

  const removeMark = useCallback(
    async (markId: number) => {
      if (!canAnnotate) return;
      try {
        const url = userId
          ? `/api/library/user/annotations?userId=${userId}&bookId=${bookId}&annotationId=${markId}`
          : `/api/library/books/${bookId}/bookmarks?childId=${childId}&bookmarkId=${markId}`;
        const res = await fetch(url, { method: "DELETE" });
        if (!res.ok) throw new Error();
        await loadMarks();
      } catch {
        toast.error(t("deleteFailed"));
      }
    },
    [bookId, childId, userId, canAnnotate, loadMarks]
  );

  const speakText = useCallback(
    async (rawText: string) => {
      if (speaking) {
        audioRef.current?.pause();
        window.speechSynthesis?.cancel();
        setSpeaking(false);
        return;
      }

      const text = rawText.trim();
      if (!text) {
        toast.error(t("noTextToRead"));
        return;
      }

      const lang = ttsLanguage(language);
      setSpeaking(true);
      const stopSpeaking = () => setSpeaking(false);

      try {
        const res = await fetch("/api/tts/coqui", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ text: text.slice(0, 1200), language: lang }),
        });
        if (res.ok) {
          const engine = res.headers.get("X-TTS-Engine");
          const blob = await res.blob();
          const url = URL.createObjectURL(blob);
          const audio = new Audio(url);
          audioRef.current = audio;
          audio.onended = () => {
            URL.revokeObjectURL(url);
            stopSpeaking();
          };
          audio.onerror = () => {
            URL.revokeObjectURL(url);
            stopSpeaking();
          };
          await audio.play();
          if (engine === "coqui") toast.success(t("voiceCoqui"));
          else if (engine === "edge") toast.success(t("voiceNatural"));
          return;
        }
      } catch {
        /* fallback */
      }

      if (speakWithBrowser(text.slice(0, 1200), lang, stopSpeaking)) {
        toast.message(t("voiceBrowser"));
        return;
      }

      stopSpeaking();
      toast.error(t("voiceUnavailable"));
    },
    [language, speaking, t]
  );

  const speakPage = useCallback(async () => {
    const text = (await waitForReaderPageText(1200)) || title;
    await speakText(text);
  }, [speakText, title]);

  const copyText = useCallback(
    (text: string) => {
      void navigator.clipboard.writeText(`« ${text} » — ${title}`);
      toast.success(t("quoteCopied"));
      setSelectionMenu(null);
    },
    [title, t]
  );

  const onHighlightSelection = useCallback(
    (text: string, color: string) => {
      highlightReaderSelection(color);
      void addMark("highlight", text, undefined, color);
      setSelectionMenu(null);
    },
    [addMark]
  );

  const onUnderlineSelection = useCallback(
    (text: string) => {
      underlineReaderSelection();
      void addMark("underline", text);
      setSelectionMenu(null);
    },
    [addMark]
  );

  const onNoteSelection = useCallback((text: string) => {
    setSelectionMenu(null);
    setNoteDraft(text);
  }, []);

  const saveNote = useCallback(
    (note: string) => {
      const excerpt = noteDraft || "";
      void addMark("note", excerpt.slice(0, 120) || note.trim().slice(0, 120), note.trim());
      setNoteDraft(null);
    },
    [addMark, noteDraft]
  );

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center text-sm font-bold text-red-400">
        Impossible de charger le livre.
      </div>
    );
  }

  return (
    <div
      className={`freegeny-reader-chrome fixed inset-0 z-[200] flex flex-col ${isParentChrome ? "freegeny-reader-chrome--parent" : ""} ${kioskMode ? "bg-[#0f172a]" : isParentChrome ? "bg-[#FFFBF7]" : "bg-slate-950"}`}
      style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}
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
          {labels.back}
        </Link>
        <p
          className={`min-w-0 flex-1 truncate text-center text-sm font-black ${isParentChrome ? "text-slate-900" : "text-white"}`}
        >
          {title}
        </p>
        <button
          type="button"
          className={isParentChrome ? "fg-btn-header fg-btn-header--parent" : "fg-btn-header"}
          onClick={() => {
            setPanelOpen(true);
            setPanelTab("marks");
          }}
        >
          <List className="h-4 w-4" />
          {labels.menu}
        </button>
      </header>

      <div className="relative flex min-h-0 flex-1 pb-[4.5rem]">
        <div className="relative min-h-0 min-w-0 flex-1 [&_.th-reader]:!h-full">
          {publication && profile ? (
            <StatefulReaderWrapper
              key={`${localDataKey}-${readerKey}`}
              profile={profile}
              publication={publication}
              localDataKey={localDataKey}
              isLoading={isLoading}
              positionStorage={positionStorage}
              i18n={{ lng: readiumLng, fallbackLng: "fr" }}
            />
          ) : (
            <ReaderLoadingState message={labels.loading} />
          )}
        </div>

        {panelOpen && (
          <LibraryReaderSidePanel
            open={panelOpen}
            onClose={() => setPanelOpen(false)}
            tab={panelTab}
            onTab={setPanelTab}
            marks={marks}
            bookmarks={bookmarks}
            highlights={highlights}
            notes={notes}
            onJump={jumpToLocator}
            onRemove={(id) => void removeMark(id)}
            userId={userId}
            bookId={bookId}
            bookTitle={title}
            readerRole={readerRole ?? (userId ? "parent" : "child")}
            relatedBasePath={backHref}
          />
        )}
      </div>

      <div
        className="pointer-events-none fixed inset-x-0 bottom-0 z-[300] flex justify-center px-3"
        style={{ paddingBottom: "max(4.75rem, calc(0.75rem + env(safe-area-inset-bottom)))" }}
      >
        <div className="fg-reader-bottom-bar pointer-events-auto flex w-full max-w-lg justify-center rounded-t-2xl px-4 py-3">
          <button
            type="button"
            onClick={() => void speakPage()}
            className={`fg-btn-tts ${speaking ? "is-speaking" : ""}`}
          >
            <Volume2 className="h-5 w-5" />
            {speaking ? labels.stop : labels.listenPage}
          </button>
        </div>
      </div>

      {selectionMenu && (
        <ReaderSelectionMenu
          anchor={selectionMenu}
          onCopy={copyText}
          onHighlight={onHighlightSelection}
          onUnderline={onUnderlineSelection}
          onNote={onNoteSelection}
          onSpeak={(text) => void speakText(text)}
          onClose={() => setSelectionMenu(null)}
        />
      )}

      {noteDraft && (
        <ReaderNoteDialog
          excerpt={noteDraft}
          onSave={saveNote}
          onClose={() => setNoteDraft(null)}
        />
      )}

      {quizData && childId && (
        <ChildBookQuiz
          bookId={bookId}
          childId={childId}
          quizId={quizData.quizId}
          title={quizData.title}
          questions={quizData.questions}
          onClose={() => setQuizData(null)}
        />
      )}
    </div>
  );
}

export default function ReadiumLuxuryReader(props: Props) {
  const storageKey = `freegeny-readium-${props.bookId}-${props.userId ?? props.childId ?? "guest"}`;
  return (
    <ThStoreProvider storageKey={storageKey}>
      <StatefulGlobalPreferencesProvider initialPreferences={{ locale: "fr" }}>
        <ThoriumI18nBootstrap>
          <ReaderInner {...props} />
        </ThoriumI18nBootstrap>
      </StatefulGlobalPreferencesProvider>
    </ThStoreProvider>
  );
}

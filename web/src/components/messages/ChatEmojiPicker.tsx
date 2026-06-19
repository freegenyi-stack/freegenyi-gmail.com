"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Search, Sparkles, Smile } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  getEmojiCategories,
  getRecentEmojis,
  pushRecentEmoji,
  searchEmojis,
  QUICK_EMOJIS,
  type EmojiCategory,
} from "@/lib/messaging/emoji-catalog";
import { FG_STICKER_PACKS, twemojiUrl } from "@/lib/messaging/twemoji";
import { chatMobileClasses } from "@/lib/messaging/chat-mobile";

type Tab = "emoji" | "sticker";

type Props = {
  locale: string;
  isRTL: boolean;
  onSelect: (emoji: string) => void;
  onStickerSelect?: (emoji: string) => void;
  className?: string;
};

function TwemojiImg({
  emoji,
  size = 28,
  className,
}: {
  emoji: string;
  size?: number;
  className?: string;
}) {
  const [failed, setFailed] = useState(false);
  if (failed) {
    return <span className={cn("select-none leading-none", className)} style={{ fontSize: size * 0.85 }}>{emoji}</span>;
  }
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={twemojiUrl(emoji, size >= 48 ? 72 : 72)}
      alt={emoji}
      width={size}
      height={size}
      draggable={false}
      loading="lazy"
      className={cn("pointer-events-none select-none drop-shadow-sm", className)}
      onError={() => setFailed(true)}
    />
  );
}

export default function ChatEmojiPicker({ locale, isRTL, onSelect, onStickerSelect, className }: Props) {
  const [tab, setTab] = useState<Tab>("emoji");
  const [query, setQuery] = useState("");
  const [activeCat, setActiveCat] = useState("people");
  const [stickerPack, setStickerPack] = useState(FG_STICKER_PACKS[0].id);
  const [recent, setRecent] = useState<string[]>([]);

  const isAr = locale.startsWith("ar");
  const categories = useMemo(() => getEmojiCategories(), []);

  useEffect(() => {
    setRecent(getRecentEmojis());
  }, []);

  const handlePick = useCallback(
    (emoji: string) => {
      pushRecentEmoji(emoji);
      setRecent(getRecentEmojis());
      if (tab === "sticker" && onStickerSelect) {
        onStickerSelect(emoji);
      } else {
        onSelect(emoji);
      }
    },
    [onSelect, onStickerSelect, tab]
  );

  const searchResults = useMemo(() => (query.trim() ? searchEmojis(query) : []), [query]);

  const displayedEmojis = useMemo(() => {
    if (query.trim()) return searchResults;
    if (activeCat === "recent") return recent.length ? recent : QUICK_EMOJIS;
    return categories.find((c) => c.id === activeCat)?.emojis ?? [];
  }, [query, searchResults, activeCat, recent, categories]);

  const activePack = FG_STICKER_PACKS.find((p) => p.id === stickerPack) ?? FG_STICKER_PACKS[0];

  const catLabel = (c: EmojiCategory | { labelFr: string; labelAr: string }) =>
    isAr ? c.labelAr : c.labelFr;

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className={cn(
        chatMobileClasses.emojiPanel,
        "fg-emoji-panel overflow-hidden rounded-[1.35rem] border border-white/60 bg-white/95 shadow-[0_20px_60px_-12px_rgba(15,23,42,0.35)] ring-1 ring-slate-900/5 backdrop-blur-xl",
        className
      )}
    >
      {/* Segmented control */}
      <div className="p-2 pb-0">
        <div className="relative flex rounded-2xl bg-slate-100/90 p-1">
          <button
            type="button"
            onClick={() => setTab("emoji")}
            className={cn(
              "relative z-[1] flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition",
              tab === "emoji" ? "text-violet-900" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Smile className="h-3.5 w-3.5" />
            {isAr ? "إيموجي" : "Émojis"}
          </button>
          <button
            type="button"
            onClick={() => setTab("sticker")}
            className={cn(
              "relative z-[1] flex flex-1 items-center justify-center gap-1.5 rounded-xl py-2.5 text-xs font-bold transition",
              tab === "sticker" ? "text-amber-900" : "text-slate-500 hover:text-slate-700"
            )}
          >
            <Sparkles className="h-3.5 w-3.5" />
            {isAr ? "ملصقات" : "Autocollants"}
          </button>
          <span
            className={cn(
              "absolute inset-y-1 w-[calc(50%-4px)] rounded-xl bg-white shadow-md transition-all duration-300 ease-out",
              tab === "emoji" ? "start-1" : "end-1"
            )}
          />
        </div>
      </div>

      {tab === "emoji" ? (
        <>
          {/* Search */}
          <div className="px-3 pt-3">
            <div className={cn("relative", isRTL && "font-ui-ar")}>
              <Search className={cn("absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400", isRTL ? "end-3" : "start-3")} />
              <input
                type="search"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder={isAr ? "بحث…" : "Rechercher un emoji…"}
                className={cn(
                  "w-full rounded-xl border border-slate-200/80 bg-slate-50/80 py-2.5 text-sm font-medium text-slate-800 outline-none transition placeholder:text-slate-400 focus:border-violet-300 focus:bg-white focus:ring-2 focus:ring-violet-200/60",
                  isRTL ? "pe-9 ps-3 text-right" : "ps-9 pe-3"
                )}
              />
            </div>
          </div>

          {/* Quick row */}
          {!query.trim() && (
            <div className={cn("flex gap-0.5 overflow-x-auto px-3 py-2.5 scrollbar-none", isRTL && "flex-row-reverse")}>
              {QUICK_EMOJIS.map((emoji) => (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => handlePick(emoji)}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl transition hover:scale-110 hover:bg-violet-50 active:scale-95"
                >
                  <TwemojiImg emoji={emoji} size={26} />
                </button>
              ))}
            </div>
          )}

          {/* Categories */}
          {!query.trim() && (
            <div className={cn("flex gap-1 overflow-x-auto border-b border-slate-100 px-2 pb-2 scrollbar-none", isRTL && "flex-row-reverse")}>
              <button
                type="button"
                onClick={() => setActiveCat("recent")}
                title={isAr ? "الأخيرة" : "Récents"}
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
                  activeCat === "recent"
                    ? "bg-violet-600 shadow-md shadow-violet-200"
                    : "bg-slate-100 hover:bg-slate-200"
                )}
              >
                <TwemojiImg emoji="🕐" size={22} className={activeCat === "recent" ? "brightness-110" : ""} />
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  type="button"
                  title={catLabel(cat)}
                  onClick={() => setActiveCat(cat.id)}
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl transition",
                    activeCat === cat.id
                      ? "bg-violet-600 shadow-md shadow-violet-200"
                      : "bg-slate-100 hover:bg-slate-200"
                  )}
                >
                  <TwemojiImg emoji={cat.icon} size={22} />
                </button>
              ))}
            </div>
          )}

          {/* Grid */}
          <div className={cn(chatMobileClasses.emojiScroll, "overflow-y-auto px-2 py-2 scrollbar-thin")}>
            {displayedEmojis.length === 0 ? (
              <p className={cn("py-8 text-center text-sm text-slate-400", isRTL && "font-ui-ar")}>
                {isAr ? "لا نتائج" : "Aucun emoji trouvé"}
              </p>
            ) : (
              <div className={chatMobileClasses.emojiGrid}>
                {displayedEmojis.map((emoji, i) => (
                  <button
                    key={`${emoji}-${i}`}
                    type="button"
                    onClick={() => handlePick(emoji)}
                    className="fg-chat-reaction-btn flex aspect-square min-h-[2.75rem] items-center justify-center rounded-xl transition active:scale-90 hover:bg-gradient-to-br hover:from-violet-50 hover:to-fuchsia-50 sm:min-h-0 sm:hover:scale-110"
                  >
                    <TwemojiImg emoji={emoji} size={28} />
                  </button>
                ))}
              </div>
            )}
          </div>
        </>
      ) : (
        <>
          {/* Sticker packs */}
          <div className={cn("flex gap-1 overflow-x-auto px-2 pt-3 scrollbar-none", isRTL && "flex-row-reverse")}>
            {FG_STICKER_PACKS.map((pack) => (
              <button
                key={pack.id}
                type="button"
                onClick={() => setStickerPack(pack.id)}
                className={cn(
                  "flex shrink-0 items-center gap-1.5 rounded-full px-3 py-1.5 text-[11px] font-bold transition",
                  stickerPack === pack.id
                    ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white shadow-md shadow-amber-200"
                    : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                )}
              >
                <TwemojiImg emoji={pack.icon} size={18} />
                {isAr ? pack.labelAr : pack.labelFr}
              </button>
            ))}
          </div>

          <div className={cn(chatMobileClasses.emojiScroll, "overflow-y-auto p-3 scrollbar-thin")}>
            <div className="grid grid-cols-3 gap-2 sm:grid-cols-4 md:grid-cols-5">
              {activePack.stickers.map((s) => (
                <button
                  key={s.emoji}
                  type="button"
                  title={isAr ? s.ar : s.fr}
                  onClick={() => handlePick(s.emoji)}
                  className="group flex flex-col items-center rounded-2xl border border-transparent bg-gradient-to-br from-white to-amber-50/60 p-2.5 shadow-sm transition hover:scale-[1.04] hover:border-amber-200/80 hover:shadow-lg active:scale-95"
                >
                  <TwemojiImg emoji={s.emoji} size={52} className="transition group-hover:drop-shadow-md" />
                  <span className="mt-1.5 line-clamp-1 text-[9px] font-semibold text-slate-500">
                    {isAr ? s.ar : s.fr}
                  </span>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

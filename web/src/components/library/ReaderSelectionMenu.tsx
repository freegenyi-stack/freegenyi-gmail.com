"use client";

import { Copy, Highlighter, StickyNote, Underline, Volume2 } from "lucide-react";
import { useTranslations } from "next-intl";
import type { ReaderSelectionAnchor } from "@/lib/library/reader-selection";

const HIGHLIGHT_KEYS = ["yellow", "green", "blue", "pink"] as const;

type Props = {
  anchor: ReaderSelectionAnchor;
  onCopy: (text: string) => void;
  onHighlight: (text: string, color: string) => void;
  onUnderline: (text: string) => void;
  onNote: (text: string) => void;
  onSpeak: (text: string) => void;
  onClose: () => void;
};

export default function ReaderSelectionMenu({
  anchor,
  onCopy,
  onHighlight,
  onUnderline,
  onNote,
  onSpeak,
  onClose,
}: Props) {
  const tr = useTranslations("Library.reader");
  const ts = useTranslations("Library.selection");

  const highlightColors = HIGHLIGHT_KEYS.map((key) => ({
    key,
    label: ts(`color${key.charAt(0).toUpperCase()}${key.slice(1)}` as "colorYellow"),
    className:
      key === "yellow"
        ? "bg-yellow-300"
        : key === "green"
          ? "bg-green-300"
          : key === "blue"
            ? "bg-blue-300"
            : "bg-pink-300",
  }));

  const top = Math.min(typeof window !== "undefined" ? window.innerHeight - 280 : anchor.top, anchor.top);
  const left = Math.min(
    typeof window !== "undefined" ? window.innerWidth - 240 : anchor.left,
    Math.max(8, anchor.left)
  );

  const run = (fn: () => void) => {
    fn();
    onClose();
  };

  return (
    <div className="freegeny-reader-chrome">
      <button
        type="button"
        className="fixed inset-0 z-[490] cursor-default border-0 bg-black/30 p-0"
        style={{ background: "rgba(0,0,0,0.35)" }}
        aria-label={ts("closeMenu")}
        onClick={onClose}
      />
      <div
        className="fg-context-menu fixed z-[500]"
        style={{ top, left }}
        role="menu"
        aria-label={ts("actionsMenu")}
        data-freegeny-selection-menu
      >
        <button type="button" className="fg-context-item" role="menuitem" onClick={() => run(() => onCopy(anchor.text))}>
          <Copy className="h-4 w-4 text-orange-600" />
          {tr("copy")}
        </button>
        <div className="px-3 py-1 text-[9px] font-black uppercase text-slate-400">{ts("highlightLabel")}</div>
        <div className="flex gap-1 px-2 pb-1">
          {highlightColors.map((c) => (
            <button
              key={c.key}
              type="button"
              title={c.label}
              className={`h-6 w-6 rounded-full border border-slate-200 ${c.className}`}
              onClick={() => run(() => onHighlight(anchor.text, c.key))}
            />
          ))}
        </div>
        <button type="button" className="fg-context-item" role="menuitem" onClick={() => run(() => onUnderline(anchor.text))}>
          <Underline className="h-4 w-4 text-violet-600" />
          {tr("underline")}
        </button>
        <button type="button" className="fg-context-item" role="menuitem" onClick={() => run(() => onNote(anchor.text))}>
          <StickyNote className="h-4 w-4 text-blue-600" />
          {tr("note")}
        </button>
        <div className="fg-context-divider" />
        <button type="button" className="fg-context-item" role="menuitem" onClick={() => run(() => onSpeak(anchor.text))}>
          <Volume2 className="h-4 w-4 text-teal-600" />
          {tr("speakSelection")}
        </button>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { Eye, Forward, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessageDto } from "@/lib/messaging/types";
import { displayMediaLabel } from "@/lib/messaging/media-labels";
import { twemojiUrl } from "@/lib/messaging/twemoji";

const REACTIONS = ["👍", "❤️", "😂", "😮", "😢", "🙏"];

type Props = {
  open: boolean;
  message: ChatMessageDto | null;
  locale: string;
  isRTL: boolean;
  t: (key: string) => string;
  onClose: () => void;
  onReact: (emoji: string) => void;
  onView: () => void;
  onForward: () => void;
  onDelete: () => void;
};

export default function ChatMediaActionSheet({
  open,
  message,
  locale,
  isRTL,
  t,
  onClose,
  onReact,
  onView,
  onForward,
  onDelete,
}: Props) {
  if (!open || !message?.mediaUrl) return null;

  const label = displayMediaLabel(message.content, message.messageType, message.mediaUrl, locale);
  const reactions = message.reactions || {};

  return (
    <div className="fixed inset-0 z-[460] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" aria-hidden />
      <div
        className={cn(
          "relative w-full max-w-lg animate-in slide-in-from-bottom-4 rounded-t-3xl bg-white pb-[env(safe-area-inset-bottom)] shadow-2xl sm:rounded-3xl sm:mb-4",
          isRTL && "font-ui-ar text-right"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-slate-200 sm:hidden" />
        <div className={cn("flex items-start justify-between gap-2 px-5 pt-4", isRTL && "flex-row-reverse")}>
          <div>
            <p className="text-base font-black text-slate-900">{label}</p>
            <p className={cn("text-xs text-slate-500", isRTL && "font-lateef")}>{t("mediaActionsHint")}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div className="mx-4 mt-4 rounded-2xl border border-slate-100 bg-gradient-to-r from-violet-50 to-orange-50 px-2 py-2 shadow-inner">
          <p className={cn("mb-1.5 px-2 text-[10px] font-bold uppercase tracking-wide text-slate-500", isRTL && "text-right")}>
            {t("reactLabel")}
          </p>
          <div className={cn("flex gap-1 overflow-x-auto pb-0.5", isRTL && "flex-row-reverse")}>
            {REACTIONS.map((emoji) => {
              const count = reactions[emoji]?.length || 0;
              const active = count > 0;
              return (
                <button
                  key={emoji}
                  type="button"
                  onClick={() => onReact(emoji)}
                  className={cn(
                    "flex shrink-0 flex-col items-center rounded-xl px-2.5 py-1.5 transition active:scale-95",
                    active ? "bg-white shadow-md ring-2 ring-violet-200" : "hover:bg-white/70"
                  )}
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={twemojiUrl(emoji)} alt={emoji} className="h-8 w-8" draggable={false} />
                  {count > 0 && <span className="mt-0.5 text-[10px] font-bold text-violet-700">{count}</span>}
                </button>
              );
            })}
          </div>
        </div>

        <ul className="mt-3 px-3 pb-4">
          <li>
            <button
              type="button"
              onClick={onView}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start transition hover:bg-slate-50",
                isRTL && "flex-row-reverse text-right"
              )}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#128c7e]/10 text-[#128c7e]">
                <Eye className="h-5 w-5" />
              </span>
              <span className="font-semibold text-slate-800">{t("mediaView")}</span>
            </button>
          </li>
          <li>
            <button
              type="button"
              onClick={onForward}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 text-start transition hover:bg-slate-50",
                isRTL && "flex-row-reverse text-right"
              )}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                <Forward className="h-5 w-5" />
              </span>
              <span className="font-semibold text-slate-800">{t("mediaForward")}</span>
            </button>
          </li>
          {message.isMine && (
            <li className="mt-1 border-t border-slate-100 pt-1">
              <button
                type="button"
                onClick={onDelete}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-3.5 text-start transition hover:bg-red-100",
                  isRTL && "flex-row-reverse text-right"
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-100 text-red-600">
                  <Trash2 className="h-5 w-5" />
                </span>
                <span className="font-bold text-red-700">{t("deleteMessage")}</span>
              </button>
            </li>
          )}
        </ul>
      </div>
    </div>
  );
}

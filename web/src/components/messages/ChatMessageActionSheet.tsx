"use client";

import React from "react";
import { Eye, Forward, Flag, Pin, PinOff, Reply, Trash2, X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ChatMessageDto } from "@/lib/messaging/types";
import { displayMediaLabel } from "@/lib/messaging/media-labels";
import {
  extraReactionsOnMessage,
  MESSAGE_REACTION_GROUPS,
  reactionGroupLabel,
} from "@/lib/messaging/message-reactions";
import { twemojiUrl } from "@/lib/messaging/twemoji";
import { chatMobileClasses } from "@/lib/messaging/chat-mobile";

type Props = {
  open: boolean;
  message: ChatMessageDto | null;
  locale: string;
  isRTL: boolean;
  canPin?: boolean;
  t: (key: string, values?: Record<string, string | number>) => string;
  onClose: () => void;
  onReact: (emoji: string) => void;
  onReply: () => void;
  onView?: () => void;
  onForward?: () => void;
  onPin?: () => void;
  onDelete?: () => void;
  onReport?: () => void;
};

function ReactionBtn({
  emoji,
  count,
  onPick,
}: {
  emoji: string;
  count: number;
  onPick: (e: string) => void;
}) {
  const active = count > 0;
  return (
    <button
      type="button"
      title={emoji}
      onClick={() => onPick(emoji)}
      className={cn(
        chatMobileClasses.reactionBtn,
        "relative flex items-center justify-center rounded-xl transition active:scale-90",
        active ? "bg-white shadow-md ring-2 ring-violet-300" : "hover:bg-white/80 hover:scale-105"
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={twemojiUrl(emoji)} alt={emoji} className="h-7 w-7" draggable={false} />
      {count > 0 && (
        <span className="absolute -end-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-0.5 text-[9px] font-bold text-white">
          {count}
        </span>
      )}
    </button>
  );
}

export default function ChatMessageActionSheet({
  open,
  message,
  locale,
  isRTL,
  canPin,
  t,
  onClose,
  onReact,
  onReply,
  onView,
  onForward,
  onPin,
  onDelete,
  onReport,
}: Props) {
  if (!open || !message) return null;

  const hasMedia = !!message.mediaUrl;
  const label = hasMedia
    ? displayMediaLabel(message.content, message.messageType, message.mediaUrl, locale)
    : message.content.trim().slice(0, 120) || t("attachment");
  const reactions = message.reactions || {};
  const isPinned = !!message.pinnedAt;
  const extras = extraReactionsOnMessage(reactions);

  return (
    <div className="fixed inset-0 z-[460] flex items-end justify-center" onClick={onClose}>
      <div className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" aria-hidden />
      <div
        className={cn(
          chatMobileClasses.actionSheet,
          "relative flex w-full max-w-lg flex-col bg-white shadow-2xl sm:mb-4 sm:rounded-3xl",
          "animate-in slide-in-from-bottom-4 rounded-t-3xl",
          isRTL && "font-ui-ar text-right"
        )}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mx-auto mt-2 h-1 w-10 shrink-0 rounded-full bg-slate-200 sm:hidden" />
        <div className={cn("flex shrink-0 items-start justify-between gap-2 px-5 pt-4", isRTL && "flex-row-reverse")}>
          <div className="min-w-0">
            <p className="truncate text-base font-black text-slate-900">{label}</p>
            <p className={cn("text-xs text-slate-500", isRTL && "font-lateef")}>{t("messageActionsHint")}</p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>

        <div
          className={cn(
            chatMobileClasses.reactionsScroll,
            "mx-4 mt-3 min-h-0 flex-1 overflow-y-auto rounded-2xl border border-slate-100 bg-gradient-to-b from-violet-50/80 to-orange-50/50 px-3 py-3 shadow-inner"
          )}
        >
          <p className={cn("mb-2 text-[10px] font-bold uppercase tracking-wide text-slate-500", isRTL && "text-right")}>
            {t("reactLabel")}
          </p>

          {extras.length > 0 && (
            <div className="mb-3">
              <p className={cn("mb-1.5 text-[10px] font-semibold text-violet-700", isRTL && "text-right")}>
                {locale.startsWith("ar") ? "على هذه الرسالة" : t("reactionsOnMessage")}
              </p>
              <div className={cn("flex flex-wrap gap-1", isRTL && "flex-row-reverse")}>
                {extras.map((emoji) => (
                  <ReactionBtn
                    key={emoji}
                    emoji={emoji}
                    count={reactions[emoji]?.length || 0}
                    onPick={onReact}
                  />
                ))}
              </div>
            </div>
          )}

          {MESSAGE_REACTION_GROUPS.map((group) => (
            <div key={group.id} className="mb-3 last:mb-0">
              <p className={cn("mb-1.5 text-[10px] font-bold text-slate-600", isRTL && "text-right")}>
                {reactionGroupLabel(group, locale)}
              </p>
              <div className={cn("flex flex-wrap gap-1", isRTL && "flex-row-reverse")}>
                {group.emojis.map((emoji) => (
                  <ReactionBtn
                    key={emoji}
                    emoji={emoji}
                    count={reactions[emoji]?.length || 0}
                    onPick={onReact}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        <ul className="mt-2 shrink-0 px-3 pb-4 max-md:[&_button]:min-h-[48px]">
          <li>
            <button
              type="button"
              onClick={onReply}
              className={cn(
                "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start transition hover:bg-slate-50",
                isRTL && "flex-row-reverse text-right"
              )}
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-sky-100 text-sky-600">
                <Reply className="h-5 w-5" />
              </span>
              <span className="font-semibold text-slate-800">{t("replyTo")}</span>
            </button>
          </li>
          {hasMedia && onView && (
            <li>
              <button
                type="button"
                onClick={onView}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start transition hover:bg-slate-50",
                  isRTL && "flex-row-reverse text-right"
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#128c7e]/10 text-[#128c7e]">
                  <Eye className="h-5 w-5" />
                </span>
                <span className="font-semibold text-slate-800">{t("mediaView")}</span>
              </button>
            </li>
          )}
          {onForward && (
            <li>
              <button
                type="button"
                onClick={onForward}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start transition hover:bg-slate-50",
                  isRTL && "flex-row-reverse text-right"
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-indigo-100 text-indigo-600">
                  <Forward className="h-5 w-5" />
                </span>
                <span className="font-semibold text-slate-800">{t("mediaForward")}</span>
              </button>
            </li>
          )}
          {!message.isMine && onReport && (
            <li>
              <button
                type="button"
                onClick={onReport}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start transition hover:bg-slate-50",
                  isRTL && "flex-row-reverse text-right"
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-700">
                  <Flag className="h-5 w-5" />
                </span>
                <span className="font-semibold text-slate-800">{t("reportMessage")}</span>
              </button>
            </li>
          )}
          {canPin && onPin && (
            <li>
              <button
                type="button"
                onClick={onPin}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-start transition hover:bg-slate-50",
                  isRTL && "flex-row-reverse text-right"
                )}
              >
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-100 text-amber-700">
                  {isPinned ? <PinOff className="h-5 w-5" /> : <Pin className="h-5 w-5" />}
                </span>
                <span className="font-semibold text-slate-800">{isPinned ? t("unpinMessage") : t("pinMessage")}</span>
              </button>
            </li>
          )}
          {message.isMine && onDelete && (
            <li className="mt-1 border-t border-slate-100 pt-1">
              <button
                type="button"
                onClick={onDelete}
                className={cn(
                  "flex w-full items-center gap-3 rounded-2xl bg-red-50 px-4 py-3 text-start transition hover:bg-red-100",
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

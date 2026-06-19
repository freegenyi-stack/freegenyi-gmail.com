"use client";

import React from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { ConversationPreview } from "@/lib/messaging/types";

type Props = {
  open: boolean;
  conversations: ConversationPreview[];
  activeId: number | null;
  isRTL: boolean;
  t: (key: string) => string;
  onClose: () => void;
  onPick: (conversationId: number) => void;
};

export default function ForwardPickerModal({ open, conversations, activeId, isRTL, t, onClose, onPick }: Props) {
  if (!open) return null;

  const targets = conversations.filter((c) => c.id !== activeId && c.type !== "channel");

  return (
    <div className="fixed inset-0 z-[430] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <div className={cn("max-h-[70vh] w-full max-w-md overflow-hidden rounded-3xl bg-white shadow-2xl", isRTL && "font-ui-ar text-right")}>
        <div className={cn("flex items-center justify-between border-b px-4 py-3", isRTL && "flex-row-reverse")}>
          <h3 className="font-black text-slate-900">{t("mediaForward")}</h3>
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <ul className="max-h-[50vh] overflow-y-auto">
          {targets.length === 0 ? (
            <li className={cn("px-4 py-8 text-center text-sm text-slate-500", isRTL && "font-lateef")}>{t("noUsersFound")}</li>
          ) : (
            targets.map((c) => (
              <li key={c.id}>
                <button
                  type="button"
                  onClick={() => onPick(c.id)}
                  className={cn(
                    "flex w-full items-center gap-3 px-4 py-3 text-start hover:bg-violet-50",
                    isRTL && "flex-row-reverse text-right"
                  )}
                >
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-violet-100 text-sm font-bold text-violet-700">
                    {(c.otherUser?.fullName || c.otherUser?.username || "?")[0]?.toUpperCase()}
                  </div>
                  <span className="truncate font-semibold text-slate-900">
                    {c.otherUser?.fullName || c.otherUser?.username || "…"}
                  </span>
                </button>
              </li>
            ))
          )}
        </ul>
      </div>
    </div>
  );
}

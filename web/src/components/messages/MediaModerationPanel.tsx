"use client";

import { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { FileText, Loader2, Shield, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = {
  messageId: number;
  conversationId: number;
  senderName: string;
  messageType: string | null;
  mediaUrl: string | null;
  content: string | null;
  mediaBlocked: boolean;
  createdAt: string;
  conversationLabel: string;
};

type Props = {
  open: boolean;
  onClose: () => void;
  isRTL: boolean;
};

export default function MediaModerationPanel({ open, onClose, isRTL }: Props) {
  const t = useTranslations("Messages");
  const [items, setItems] = useState<Item[]>([]);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/chat/moderation");
      const data = await res.json();
      setItems(data.items || []);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (open) void load();
  }, [open, load]);

  const toggleBlock = async (item: Item) => {
    const res = await fetch("/api/chat/moderation", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: item.messageId,
        action: item.mediaBlocked ? "unblock" : "block",
      }),
    });
    if (res.ok) void load();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[300] flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div className={cn("flex max-h-[85vh] w-full max-w-lg flex-col rounded-3xl bg-white shadow-2xl", isRTL && "font-amiri")}>
        <div className={cn("flex items-center justify-between border-b border-slate-100 px-5 py-4", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <Shield className="h-5 w-5 text-indigo-600" />
            <h2 className="text-lg font-black text-slate-900">{t("moderationTitle")}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4">
          {loading ? (
            <div className="flex justify-center py-12">
              <Loader2 className="h-8 w-8 animate-spin text-indigo-600" />
            </div>
          ) : items.length === 0 ? (
            <p className={cn("py-8 text-center text-sm text-slate-500", isRTL && "font-lateef")}>{t("moderationEmpty")}</p>
          ) : (
            <ul className="space-y-3">
              {items.map((item) => (
                <li key={item.messageId} className="rounded-2xl border border-slate-100 bg-slate-50 p-3">
                  <p className="text-xs font-black text-slate-800">{item.senderName}</p>
                  <p className="text-[10px] text-slate-500 truncate">{item.conversationLabel}</p>
                  <div className="mt-2 flex items-center gap-2">
                    {item.messageType === "image" && item.mediaUrl && !item.mediaBlocked ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={item.mediaUrl} alt="" className="h-12 w-12 rounded-lg object-cover" />
                    ) : (
                      <FileText className="h-8 w-8 text-slate-400" />
                    )}
                    <span className="min-w-0 flex-1 truncate text-xs font-medium text-slate-600">
                      {item.content || item.mediaUrl?.split("/").pop()}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => void toggleBlock(item)}
                    className={cn(
                      "mt-2 w-full rounded-xl px-3 py-2 text-xs font-black transition",
                      item.mediaBlocked
                        ? "bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        : "bg-red-50 text-red-700 hover:bg-red-100"
                    )}
                  >
                    {item.mediaBlocked ? t("moderationUnblock") : t("moderationBlock")}
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}

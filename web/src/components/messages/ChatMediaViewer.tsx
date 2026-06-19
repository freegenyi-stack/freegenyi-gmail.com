"use client";

import React, { useCallback, useEffect, useMemo, useRef } from "react";
import { Download, ExternalLink, Mail, Printer, Share2, Trash2, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatMediaApiUrl, mimeFromPath } from "@/lib/messaging/media-url";
import ChatMediaPlayer from "@/components/messages/ChatMediaPlayer";
import type { ChatMessageType } from "@/lib/messaging/types";

type Props = {
  open: boolean;
  url: string;
  fileName: string;
  messageType?: ChatMessageType;
  canDelete?: boolean;
  onClose: () => void;
  onDelete?: () => void;
  isRTL?: boolean;
  t: (key: string) => string;
};

function extFromUrl(url: string): string {
  return url.split("?")[0]?.split(".").pop()?.toLowerCase() || "";
}

export default function ChatMediaViewer({
  open,
  url,
  fileName,
  messageType,
  canDelete,
  onClose,
  onDelete,
  isRTL,
  t,
}: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const src = chatMediaApiUrl(url) || url;
  const ext = extFromUrl(url);
  const mime = mimeFromPath(url, messageType);

  const kind = useMemo(() => {
    if (messageType === "video" || ["mp4", "webm", "mov", "m4v"].includes(ext)) return "video";
    if (messageType === "voice" || messageType === "audio" || ["mp3", "wav", "ogg", "m4a", "aac"].includes(ext)) {
      return "audio";
    }
    if (messageType === "image" || ["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    return "other";
  }, [ext, messageType]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  const handlePrint = useCallback(() => {
    if (kind === "pdf" && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
      return;
    }
    if (kind === "image") {
      window.open(src, "_blank")?.print();
    }
  }, [kind, src]);

  const handleShare = useCallback(async () => {
    const title = fileName || t("attachment");
    try {
      if (navigator.share) {
        await navigator.share({ title, text: title, url: window.location.origin + src });
        return;
      }
    } catch {
      /* cancelled */
    }
    try {
      await navigator.clipboard.writeText(window.location.origin + src);
      alert(t("linkCopied"));
    } catch {
      window.open(src, "_blank");
    }
  }, [fileName, src, t]);

  const handleEmail = useCallback(() => {
    const subject = encodeURIComponent(fileName || t("attachment"));
    const body = encodeURIComponent(`${fileName}\n${window.location.origin}${src}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  }, [fileName, src, t]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[450] flex flex-col"
      role="dialog"
      aria-modal="true"
      onClick={onClose}
    >
      <div className="absolute inset-0 bg-black/80" aria-hidden />
      <div className="relative z-10 flex h-full min-h-0 flex-col pointer-events-none">
        <div
          className={cn(
            "pointer-events-auto flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#111b21]/95 px-3 py-2.5 text-white backdrop-blur-md sm:px-4",
            isRTL && "flex-row-reverse"
          )}
          onClick={(e) => e.stopPropagation()}
        >
          <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-white/10">
            <X className="h-5 w-5" />
          </button>
          <div className={cn("min-w-0 flex-1", isRTL && "text-right")}>
            <p className="truncate text-sm font-bold">{fileName}</p>
            <p className="truncate text-[11px] text-white/60">{mime || ext.toUpperCase()}</p>
          </div>
          <div className={cn("flex shrink-0 items-center gap-1", isRTL && "flex-row-reverse")}>
            {canDelete && onDelete && (
              <button
                type="button"
                title={t("deleteMessage")}
                onClick={onDelete}
                className="rounded-lg bg-red-500/90 p-2 hover:bg-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}
            <a href={src} target="_blank" rel="noopener noreferrer" title={t("openWith")} className="rounded-lg p-2 hover:bg-white/10">
              <ExternalLink className="h-4 w-4" />
            </a>
            <button type="button" title={t("docShare")} onClick={() => void handleShare()} className="rounded-lg p-2 hover:bg-white/10">
              <Share2 className="h-4 w-4" />
            </button>
            <button type="button" title={t("docPrint")} onClick={handlePrint} className="rounded-lg p-2 hover:bg-white/10">
              <Printer className="h-4 w-4" />
            </button>
            <button type="button" title={t("docEmail")} onClick={handleEmail} className="rounded-lg p-2 hover:bg-white/10">
              <Mail className="h-4 w-4" />
            </button>
            <a href={src} download={fileName} title={t("mediaDownload")} className="rounded-lg p-2 hover:bg-white/10">
              <Download className="h-4 w-4" />
            </a>
          </div>
        </div>

        <div
          className="pointer-events-auto min-h-0 flex-1 overflow-auto p-3 sm:p-6"
          onClick={(e) => {
            if (e.target === e.currentTarget) onClose();
          }}
        >
          <div
            className="mx-auto flex h-full min-h-[50vh] max-w-5xl items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            {kind === "image" && (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={src} alt={fileName} className="max-h-[85vh] max-w-full rounded-xl object-contain shadow-2xl ring-1 ring-white/10" />
            )}
            {kind === "pdf" && (
              <iframe
                ref={iframeRef}
                src={`${src}#toolbar=1&navpanes=0`}
                title={fileName}
                className="h-[min(85vh,900px)] w-full rounded-xl bg-white shadow-2xl"
              />
            )}
            {kind === "video" && (
              <video src={src} controls playsInline autoPlay className="max-h-[85vh] max-w-full rounded-xl bg-black shadow-2xl">
                {mime && <source src={src} type={mime} />}
              </video>
            )}
            {(kind === "audio" || messageType === "voice") && (
              <div className="w-full max-w-lg rounded-3xl bg-white p-8 shadow-2xl">
                <ChatMediaPlayer
                  url={url}
                  messageType={messageType === "voice" ? "voice" : "audio"}
                  label={fileName}
                  isRTL={isRTL}
                  t={t}
                  className="!min-w-full !max-w-none"
                />
              </div>
            )}
            {kind === "other" && (
              <div className="rounded-2xl bg-white p-8 text-center shadow-2xl">
                <FileText className="mx-auto h-14 w-14 text-[#128c7e]" />
                <p className="mt-4 text-lg font-bold text-slate-900">{fileName}</p>
                <p className={cn("mt-2 text-sm text-slate-500", isRTL && "font-lateef")}>{t("docPreviewUnavailable")}</p>
                <div className="mt-5 flex flex-wrap justify-center gap-2">
                  <a
                    href={src}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50"
                  >
                    <ExternalLink className="h-4 w-4" />
                    {t("openWith")}
                  </a>
                  <a
                    href={src}
                    download={fileName}
                    className="inline-flex items-center gap-2 rounded-xl bg-[#128c7e] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0e6b5f]"
                  >
                    <Download className="h-4 w-4" />
                    {t("mediaDownload")}
                  </a>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

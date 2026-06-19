"use client";

import React, { useCallback, useMemo, useRef } from "react";
import { Download, Mail, Printer, Share2, X, FileText } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatMediaApiUrl, mimeFromPath } from "@/lib/messaging/media-url";

type Props = {
  open: boolean;
  url: string;
  fileName: string;
  onClose: () => void;
  isRTL?: boolean;
  t: (key: string) => string;
};

function extFromUrl(url: string): string {
  return url.split("?")[0]?.split(".").pop()?.toLowerCase() || "";
}

export default function ChatDocumentViewer({ open, url, fileName, onClose, isRTL, t }: Props) {
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const src = chatMediaApiUrl(url) || url;
  const ext = extFromUrl(url);
  const mime = mimeFromPath(url, ext === "pdf" ? "file" : undefined);

  const kind = useMemo(() => {
    if (["jpg", "jpeg", "png", "gif", "webp"].includes(ext)) return "image";
    if (ext === "pdf") return "pdf";
    return "other";
  }, [ext]);

  const handlePrint = useCallback(() => {
    if (kind === "pdf" && iframeRef.current?.contentWindow) {
      iframeRef.current.contentWindow.print();
      return;
    }
    if (kind === "image") {
      const w = window.open(src, "_blank");
      w?.print();
      return;
    }
    window.open(src, "_blank")?.print();
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
    <div className="fixed inset-0 z-[400] flex flex-col bg-black/60">
      <div
        className={cn(
          "flex shrink-0 items-center gap-2 border-b border-white/10 bg-[#111b21] px-3 py-2.5 text-white sm:px-4",
          isRTL && "flex-row-reverse"
        )}
      >
        <button type="button" onClick={onClose} className="rounded-lg p-2 hover:bg-white/10" aria-label={t("profileClose")}>
          <X className="h-5 w-5" />
        </button>
        <div className={cn("min-w-0 flex-1", isRTL && "text-right")}>
          <p className="truncate text-sm font-bold">{fileName}</p>
          <p className="truncate text-[11px] text-white/60">{mime || ext.toUpperCase()}</p>
        </div>
        <div className={cn("flex shrink-0 items-center gap-1", isRTL && "flex-row-reverse")}>
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

      <div className="min-h-0 flex-1 overflow-auto bg-[#0b141a] p-3 sm:p-6">
        <div className="mx-auto flex h-full max-w-4xl items-center justify-center">
          {kind === "image" && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={fileName} className="max-h-full max-w-full rounded-lg object-contain shadow-2xl" />
          )}
          {kind === "pdf" && (
            <iframe ref={iframeRef} src={src} title={fileName} className="h-[min(85vh,900px)] w-full rounded-lg bg-white shadow-2xl" />
          )}
          {kind === "other" && (
            <div className="rounded-2xl bg-white p-8 text-center shadow-2xl">
              <FileText className="mx-auto h-14 w-14 text-[#128c7e]" />
              <p className="mt-4 text-lg font-bold text-slate-900">{fileName}</p>
              <p className={cn("mt-2 text-sm text-slate-500", isRTL && "font-lateef")}>{t("docPreviewUnavailable")}</p>
              <a
                href={src}
                download={fileName}
                className="mt-5 inline-flex items-center gap-2 rounded-xl bg-[#128c7e] px-5 py-2.5 text-sm font-bold text-white hover:bg-[#0e6b5f]"
              >
                <Download className="h-4 w-4" />
                {t("mediaDownload")}
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

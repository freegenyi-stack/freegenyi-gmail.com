"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Loader2, Square, Video, X } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  open: boolean;
  isRTL: boolean;
  t: (key: string, values?: Record<string, string | number>) => string;
  onClose: () => void;
  onRecorded: (file: File) => Promise<void>;
};

export default function VideoRecordModal({ open, isRTL, t, onClose, onRecorded }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const [recording, setRecording] = useState(false);
  const [sec, setSec] = useState(0);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const stopStream = useCallback(() => {
    streamRef.current?.getTracks().forEach((tr) => tr.stop());
    streamRef.current = null;
    if (videoRef.current) videoRef.current.srcObject = null;
  }, []);

  const cleanup = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = null;
    recorderRef.current = null;
    chunksRef.current = [];
    setRecording(false);
    setSec(0);
    stopStream();
  }, [stopStream]);

  useEffect(() => {
    if (!open) {
      cleanup();
      setError(null);
      return;
    }

    let cancelled = false;
    (async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 1280 } },
          audio: true,
        });
        if (cancelled) {
          stream.getTracks().forEach((tr) => tr.stop());
          return;
        }
        streamRef.current = stream;
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
        }
      } catch {
        setError(t("cameraPermissionDenied"));
      }
    })();

    return () => {
      cancelled = true;
      cleanup();
    };
  }, [open, cleanup, t]);

  const startRecording = () => {
    const stream = streamRef.current;
    if (!stream) return;
    setError(null);
    chunksRef.current = [];
    const mime = MediaRecorder.isTypeSupported("video/mp4")
      ? "video/mp4"
      : MediaRecorder.isTypeSupported("video/webm;codecs=vp9,opus")
        ? "video/webm;codecs=vp9,opus"
        : MediaRecorder.isTypeSupported("video/webm")
          ? "video/webm"
          : "";
    const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
    recorder.ondataavailable = (ev) => {
      if (ev.data.size > 0) chunksRef.current.push(ev.data);
    };
    recorder.onstop = async () => {
      const blob = new Blob(chunksRef.current, { type: recorder.mimeType || "video/webm" });
      if (blob.size > 0) {
        setBusy(true);
        try {
      const ext = mime.includes("mp4") ? "mp4" : "webm";
          const file = new File([blob], `video-${Date.now()}.${ext}`, { type: blob.type || mime || "video/webm" });
          await onRecorded(file);
          onClose();
        } catch {
          setError(t("errorUpload"));
        } finally {
          setBusy(false);
        }
      }
      cleanup();
    };
    recorder.start(250);
    recorderRef.current = recorder;
    setRecording(true);
    setSec(0);
    timerRef.current = setInterval(() => setSec((s) => s + 1), 1000);
  };

  const stopRecording = () => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;
    if (timerRef.current) clearInterval(timerRef.current);
    setRecording(false);
    recorder.stop();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[320] flex items-center justify-center p-4">
      <button type="button" className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />
      <div
        dir={isRTL ? "rtl" : "ltr"}
        className={cn(
          "relative w-full max-w-md overflow-hidden rounded-3xl bg-[#111b21] shadow-2xl",
          isRTL && "font-ui-ar"
        )}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute end-3 top-3 z-10 rounded-full bg-black/40 p-2 text-white"
        >
          <X className="h-5 w-5" />
        </button>
        <div className="relative aspect-[9/16] max-h-[70vh] w-full bg-black">
          <video ref={videoRef} className="h-full w-full scale-x-[-1] object-cover" playsInline muted autoPlay />
          {recording && (
            <div className="absolute start-3 top-3 flex items-center gap-2 rounded-full bg-red-600/90 px-3 py-1 text-xs font-bold text-white">
              <span className="h-2 w-2 animate-pulse rounded-full bg-white" />
              {t("recording", { sec })}
            </div>
          )}
        </div>
        <div className="flex flex-col gap-2 p-4">
          {error && <p className="text-center text-xs text-red-400">{error}</p>}
          <div className="flex justify-center gap-3">
            {!recording ? (
              <button
                type="button"
                disabled={busy || !!error}
                onClick={startRecording}
                className="flex items-center gap-2 rounded-full bg-[#25d366] px-6 py-3 text-sm font-bold text-white disabled:opacity-40"
              >
                <Video className="h-5 w-5" />
                {t("recordVideo")}
              </button>
            ) : (
              <button
                type="button"
                onClick={stopRecording}
                className="flex items-center gap-2 rounded-full bg-red-600 px-6 py-3 text-sm font-bold text-white"
              >
                <Square className="h-4 w-4 fill-current" />
                {t("stopRecording")}
              </button>
            )}
          </div>
          {busy && (
            <div className="flex justify-center py-2">
              <Loader2 className="h-6 w-6 animate-spin text-[#25d366]" />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

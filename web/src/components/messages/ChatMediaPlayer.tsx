"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { Download, Pause, Play, AlertCircle } from "lucide-react";
import { cn } from "@/lib/utils";
import { chatMediaApiUrl, mimeFromPath } from "@/lib/messaging/media-url";
import type { ChatMessageType } from "@/lib/messaging/types";

type Props = {
  url: string;
  messageType: ChatMessageType;
  label?: string;
  isRTL?: boolean;
  t: (key: string) => string;
  className?: string;
};

function formatDuration(sec: number) {
  if (!Number.isFinite(sec) || sec < 0) return "0:00";
  const m = Math.floor(sec / 60);
  const s = Math.floor(sec % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

export default function ChatMediaPlayer({ url, messageType, label, isRTL, t, className }: Props) {
  const src = chatMediaApiUrl(url);
  const mime = mimeFromPath(url, messageType);
  const apiSrc = src?.includes("/api/chat/media")
    ? `${src}${src.includes("?") ? "&" : "?"}type=${encodeURIComponent(messageType)}`
    : src;

  const audioRef = useRef<HTMLAudioElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [current, setCurrent] = useState(0);
  const [failed, setFailed] = useState(false);

  const isVoice = messageType === "voice";
  const isAudio = messageType === "audio" || isVoice;
  const isVideo = messageType === "video";

  const applyDuration = useCallback((d: number) => {
    if (Number.isFinite(d) && d > 0) setDuration(d);
  }, []);

  useEffect(() => {
    setPlaying(false);
    setDuration(0);
    setCurrent(0);
    setFailed(false);
  }, [url, messageType]);

  useEffect(() => {
    if (!isVoice || !apiSrc) return;
    const audio = audioRef.current;
    if (!audio) return;

    const syncDuration = () => applyDuration(audio.duration);
    audio.addEventListener("loadedmetadata", syncDuration);
    audio.addEventListener("durationchange", syncDuration);
    audio.addEventListener("canplay", syncDuration);
    audio.load();

    let cancelled = false;
    if (typeof AudioContext !== "undefined") {
      fetch(apiSrc)
        .then((r) => (r.ok ? r.arrayBuffer() : Promise.reject()))
        .then((buf) => {
          const ctx = new AudioContext();
          return ctx.decodeAudioData(buf).then((decoded) => {
            ctx.close();
            return decoded.duration;
          });
        })
        .then((d) => {
          if (!cancelled) applyDuration(d);
        })
        .catch(() => {});
    }

    return () => {
      cancelled = true;
      audio.removeEventListener("loadedmetadata", syncDuration);
      audio.removeEventListener("durationchange", syncDuration);
      audio.removeEventListener("canplay", syncDuration);
    };
  }, [apiSrc, isVoice, applyDuration]);

  const onToggle = useCallback(async () => {
    const el = isVideo ? videoRef.current : audioRef.current;
    if (!el) return;
    try {
      if (el.paused) {
        await el.play();
        setPlaying(true);
        if (isVoice && !duration) applyDuration(el.duration);
      } else {
        el.pause();
        setPlaying(false);
      }
    } catch {
      setFailed(true);
    }
  }, [isVideo, isVoice, duration, applyDuration]);

  if (!src) return null;

  if (failed) {
    return (
      <div
        className={cn(
          "mb-1 flex items-center gap-2 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-xs text-amber-900",
          isRTL && "flex-row-reverse font-ui-ar",
          className
        )}
      >
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span className="min-w-0 flex-1">{t("mediaPlayError")}</span>
        <a
          href={apiSrc || url}
          download
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex shrink-0 items-center gap-1 rounded-lg bg-white px-2 py-1 font-semibold text-[#128c7e] shadow-sm hover:underline"
        >
          <Download className="h-3.5 w-3.5" />
          {t("mediaDownload")}
        </a>
      </div>
    );
  }

  if (isVideo) {
    return (
      <div className={cn("mb-1 max-w-full", className)}>
        <video
          ref={videoRef}
          src={apiSrc || undefined}
          controls
          playsInline
          preload="metadata"
          className="max-h-72 max-w-full rounded-lg bg-black/5"
          onError={() => setFailed(true)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
        >
          {mime && <source src={apiSrc || undefined} type={mime} />}
          {t("mediaPlayError")}
        </video>
      </div>
    );
  }

  if (isAudio) {
    return (
      <div className={cn("mb-1 min-w-[14rem] max-w-xs", className)}>
        {isVoice ? (
          <div
            className={cn(
              "flex items-center gap-2 rounded-full px-2 py-1.5",
              "bg-[#128c7e]/10",
              isRTL && "flex-row-reverse"
            )}
          >
            <button
              type="button"
              onClick={() => void onToggle()}
              className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-[#128c7e] text-white shadow-md transition hover:bg-[#0e6b5f]"
              aria-label={playing ? t("pauseAudio") : t("playAudio")}
            >
              {playing ? <Pause className="h-4 w-4" /> : <Play className="ms-0.5 h-4 w-4" />}
            </button>
            <div className="min-w-0 flex-1">
              <div className="flex h-1.5 overflow-hidden rounded-full bg-[#128c7e]/20">
                <div
                  className="h-full rounded-full bg-[#128c7e] transition-all"
                  style={{ width: duration ? `${Math.min(100, (current / duration) * 100)}%` : "0%" }}
                />
              </div>
              <div className={cn("mt-1 flex justify-between text-[10px] tabular-nums text-[#667781]", isRTL && "flex-row-reverse")}>
                <span>{formatDuration(current)}</span>
                <span>{duration > 0 ? formatDuration(duration) : "…"}</span>
              </div>
            </div>
          </div>
        ) : null}
        <audio
          ref={audioRef}
          src={apiSrc || undefined}
          preload="metadata"
          className={isVoice ? "sr-only" : "h-9 w-full"}
          controls={!isVoice}
          onError={() => setFailed(true)}
          onLoadedMetadata={(e) => applyDuration((e.target as HTMLAudioElement).duration)}
          onDurationChange={(e) => applyDuration((e.target as HTMLAudioElement).duration)}
          onTimeUpdate={() => setCurrent(audioRef.current?.currentTime || 0)}
          onPlay={() => setPlaying(true)}
          onPause={() => setPlaying(false)}
          onEnded={() => setPlaying(false)}
        >
          {mime && <source src={apiSrc || undefined} type={mime} />}
        </audio>
        {!isVoice && label && (
          <p className={cn("mt-1 truncate text-[11px] text-[#667781]", isRTL && "text-right font-lateef")}>{label}</p>
        )}
      </div>
    );
  }

  return null;
}

"use client";

import React, { useEffect, useState } from "react";
import type { LearningMode } from "@/lib/child/learning-profile";
import { logChildScreenTimeAction } from "@/lib/actions/children";

function todayKey(childId: number) {
  const d = new Date();
  return `fg_screen_${childId}_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

function readMinutes(childId: number): number {
  if (typeof window === "undefined") return 0;
  const raw = localStorage.getItem(todayKey(childId));
  return raw ? parseInt(raw, 10) || 0 : 0;
}

function writeMinutes(childId: number, minutes: number) {
  if (typeof window === "undefined") return;
  localStorage.setItem(todayKey(childId), String(minutes));
}

export function useChildScreenTime(childId: number, dailyLimitMinutes: number) {
  const [minutesUsed, setMinutesUsed] = useState(0);
  const [synced, setSynced] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const local = readMinutes(childId);

    void fetch(`/api/child/screen-time/${childId}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((data: { minutesToday?: number } | null) => {
        if (cancelled) return;
        const cloud = data?.minutesToday ?? 0;
        const merged = Math.max(local, cloud);
        writeMinutes(childId, merged);
        setMinutesUsed(merged);
        setSynced(true);
      })
      .catch(() => {
        if (!cancelled) {
          setMinutesUsed(local);
          setSynced(true);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [childId]);

  useEffect(() => {
    if (!synced) return;
    const interval = setInterval(() => {
      setMinutesUsed((prev) => {
        const next = prev + 1;
        writeMinutes(childId, next);
        if (next % 2 === 0) {
          void logChildScreenTimeAction(childId, next);
        }
        return next;
      });
    }, 60_000);
    return () => clearInterval(interval);
  }, [childId, synced]);

  const remaining = Math.max(0, dailyLimitMinutes - minutesUsed);
  const limitReached = minutesUsed >= dailyLimitMinutes;

  return { minutesUsed, remaining, limitReached, dailyLimitMinutes };
}

export function ScreenTimeBanner({
  remaining,
  dailyLimitMinutes,
  limitReached,
}: {
  remaining: number;
  dailyLimitMinutes: number;
  limitReached: boolean;
}) {
  return (
    <div
      className={`mb-6 rounded-2xl border px-4 py-3 text-sm font-bold ${
        limitReached
          ? "border-red-400/40 bg-red-500/10 text-red-200"
          : "border-emerald-400/30 bg-emerald-500/10 text-emerald-100"
      }`}
    >
      {limitReached
        ? `Temps d'écran atteint (${dailyLimitMinutes} min). Repose-toi — reviens demain !`
        : `Temps restant aujourd'hui : ${remaining} min / ${dailyLimitMinutes} min`}
    </div>
  );
}

export function filterPortalsByLearningMode<T extends { href: string }>(
  portals: T[],
  learningMode: LearningMode,
  limitReached: boolean
): T[] {
  if (limitReached) return [];
  if (learningMode === "guided") return portals.slice(0, 1);
  if (learningMode === "semi_guided") return portals.slice(0, 2);
  return portals;
}

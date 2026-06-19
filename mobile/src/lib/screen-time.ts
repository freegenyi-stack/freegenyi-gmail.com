import { useEffect, useRef, useState } from "react";
import * as SecureStore from "expo-secure-store";
import { apiGet, apiPost, API_BASE_URL } from "@/lib/api";

function todayKey(childId: number) {
  const d = new Date();
  return `fg_screen_${childId}_${d.getFullYear()}-${d.getMonth() + 1}-${d.getDate()}`;
}

export function useChildScreenTime(childId: number | null, dailyLimitMinutes: number, token: string | null) {
  const [minutesUsed, setMinutesUsed] = useState(0);
  const [synced, setSynced] = useState(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (!childId || !token) return;
    let cancelled = false;

    void (async () => {
      const localRaw = await SecureStore.getItemAsync(todayKey(childId));
      const local = localRaw ? parseInt(localRaw, 10) || 0 : 0;
      try {
        const data = await apiGet<{ minutesToday: number }>("/api/mobile/child/screen-time", token);
        const merged = Math.max(local, data.minutesToday ?? 0);
        if (!cancelled) {
          setMinutesUsed(merged);
          await SecureStore.setItemAsync(todayKey(childId), String(merged));
          setSynced(true);
        }
      } catch {
        if (!cancelled) {
          setMinutesUsed(local);
          setSynced(true);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [childId, token]);

  useEffect(() => {
    if (!synced || !childId || !token) return;
    intervalRef.current = setInterval(() => {
      setMinutesUsed((prev) => {
        const next = prev + 1;
        void SecureStore.setItemAsync(todayKey(childId), String(next));
        if (next % 2 === 0) {
          void apiPost("/api/mobile/child/screen-time", { minutesToday: next }, token).catch(() => undefined);
        }
        return next;
      });
    }, 60_000);
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [childId, synced, token]);

  const remaining = Math.max(0, dailyLimitMinutes - minutesUsed);
  const limitReached = minutesUsed >= dailyLimitMinutes;
  return { minutesUsed, remaining, limitReached, dailyLimitMinutes };
}

export function bookCoverUri(coverPath: string) {
  return `${API_BASE_URL}${coverPath}`;
}

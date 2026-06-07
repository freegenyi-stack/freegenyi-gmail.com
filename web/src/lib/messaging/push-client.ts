"use client";

export type PushPermission = NotificationPermission | "unsupported";

export type PushRegistrationResult =
  | { ok: true }
  | { ok: false; reason: "unsupported" | "not-configured" | "denied" | "error"; message?: string };

const SW_URL = "/sw.js";

export function isPushSupported(): boolean {
  if (typeof window === "undefined") return false;
  return "serviceWorker" in navigator && "PushManager" in window && "Notification" in window;
}

export function getPushPermission(): PushPermission {
  if (!isPushSupported()) return "unsupported";
  return Notification.permission;
}

export function isPushConfiguredClient(): boolean {
  return Boolean(process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY);
}

export async function getLocalPushSubscription(): Promise<PushSubscription | null> {
  if (!isPushSupported()) return null;
  try {
    const reg = await navigator.serviceWorker.getRegistration(SW_URL);
    if (!reg) return null;
    return reg.pushManager.getSubscription();
  } catch {
    return null;
  }
}

export async function registerPushNotifications(): Promise<PushRegistrationResult> {
  if (!isPushSupported()) {
    return { ok: false, reason: "unsupported" };
  }

  const vapidKey = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY;
  if (!vapidKey) {
    return { ok: false, reason: "not-configured" };
  }

  try {
    const reg = await navigator.serviceWorker.register(SW_URL, { scope: "/" });
    await navigator.serviceWorker.ready;

    const permission = await Notification.requestPermission();
    if (permission !== "granted") {
      return { ok: false, reason: "denied" };
    }

    let sub = await reg.pushManager.getSubscription();
    if (!sub) {
      sub = await reg.pushManager.subscribe({
        userVisibleOnly: true,
        applicationServerKey: urlBase64ToUint8Array(vapidKey),
      });
    }

    const res = await fetch("/api/notifications/push", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ subscription: sub.toJSON() }),
    });

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { ok: false, reason: "error", message: data.error || "Erreur serveur" };
    }

    return { ok: true };
  } catch (e) {
    console.warn("Push registration failed:", e);
    return {
      ok: false,
      reason: "error",
      message: e instanceof Error ? e.message : "Erreur inconnue",
    };
  }
}

export async function unregisterPushNotifications(): Promise<boolean> {
  if (!isPushSupported()) return false;

  try {
    const reg = await navigator.serviceWorker.getRegistration(SW_URL);
    const sub = reg ? await reg.pushManager.getSubscription() : null;

    if (sub) {
      const endpoint = sub.endpoint;
      await sub.unsubscribe();
      await fetch("/api/notifications/push", {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ endpoint }),
      });
    }

    return true;
  } catch (e) {
    console.warn("Push unregister failed:", e);
    return false;
  }
}

function urlBase64ToUint8Array(base64String: string): BufferSource {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  const base64 = (base64String + padding).replace(/-/g, "+").replace(/_/g, "/");
  const raw = atob(base64);
  const arr = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) arr[i] = raw.charCodeAt(i);
  return arr;
}

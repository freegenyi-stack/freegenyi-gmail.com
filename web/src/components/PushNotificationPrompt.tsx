"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";
import { BellRing, X, CheckCircle2, Shield } from "lucide-react";
import { toast } from "sonner";
import { usePathname } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import {
  getPushPermission,
  isPushConfiguredClient,
  isPushSupported,
  registerPushNotifications,
} from "@/lib/messaging/push-client";

const DISMISS_KEY = "fg_push_banner_dismissed_until";
const DISMISS_DAYS = 7;

function isDismissed(): boolean {
  if (typeof window === "undefined") return true;
  const until = localStorage.getItem(DISMISS_KEY);
  if (!until) return false;
  return Date.now() < parseInt(until, 10);
}

function dismissBanner() {
  const until = Date.now() + DISMISS_DAYS * 24 * 60 * 60 * 1000;
  localStorage.setItem(DISMISS_KEY, String(until));
}

export default function PushNotificationPrompt() {
  const { status } = useSession();
  const locale = useLocale();
  const pathname = usePathname();
  const t = useTranslations("PushNotifications");
  const isRTL = locale === "ar" || locale.endsWith("-ar");

  const [visible, setVisible] = useState(false);
  const [loading, setLoading] = useState(false);
  const [serverSubscribed, setServerSubscribed] = useState(false);

  const isDashboard = pathname?.startsWith("/dashboard");

  const refreshStatus = useCallback(async () => {
    if (!isPushSupported() || !isPushConfiguredClient()) {
      setVisible(false);
      return;
    }

    const permission = getPushPermission();
    if (permission === "denied" || permission === "unsupported") {
      setVisible(false);
      return;
    }

    try {
      const res = await fetch("/api/notifications/push");
      const data = await res.json();
      setServerSubscribed(Boolean(data.subscribed));

      if (data.subscribed) {
        setVisible(false);
        return;
      }

      setVisible(!isDismissed());
    } catch {
      setVisible(false);
    }
  }, []);

  useEffect(() => {
    if (status !== "authenticated" || !isDashboard) {
      setVisible(false);
      return;
    }
    refreshStatus();
  }, [status, isDashboard, refreshStatus]);

  const handleEnable = async () => {
    setLoading(true);
    const result = await registerPushNotifications();
    setLoading(false);

    if (result.ok) {
      toast.success(t("enabledToast"));
      setVisible(false);
      setServerSubscribed(true);
      window.dispatchEvent(new CustomEvent("fg-push-status-changed"));
      return;
    }

    if (result.reason === "denied") {
      toast.error(t("deniedToast"));
      setVisible(false);
      return;
    }

    toast.error(result.message || t("errorToast"));
  };

  const handleDismiss = () => {
    dismissBanner();
    setVisible(false);
  };

  if (status !== "authenticated" || !isDashboard || serverSubscribed) return null;

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 24 }}
          transition={{ type: "spring", stiffness: 380, damping: 32 }}
          dir={isRTL ? "rtl" : "ltr"}
          className={cn(
            "fixed z-[200] inset-x-4 bottom-4 sm:inset-x-auto sm:bottom-6 sm:end-6 sm:max-w-md",
            "pointer-events-none"
          )}
        >
          <div
            className={cn(
              "pointer-events-auto overflow-hidden rounded-3xl border border-orange-100",
              "bg-white/95 shadow-[0_20px_60px_rgba(234,88,12,0.18)] backdrop-blur-md"
            )}
          >
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-orange-400 via-orange-500 to-amber-500" />

            <div className="relative p-5 sm:p-6">
              <button
                type="button"
                onClick={handleDismiss}
                className={cn(
                  "absolute top-3 end-3 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-600 transition",
                  isRTL && "end-auto start-3"
                )}
                aria-label={t("dismiss")}
              >
                <X className="h-4 w-4" />
              </button>

              <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/30">
                  <BellRing className="h-6 w-6" />
                </div>

                <div className="min-w-0 flex-1 pe-6">
                  <h3 className={cn("text-base font-black text-slate-900 leading-snug", isRTL && "font-amiri text-right")}>
                    {t("bannerTitle")}
                  </h3>
                  <p className={cn("mt-1.5 text-sm text-slate-600 leading-relaxed", isRTL && "font-lateef text-right")}>
                    {t("bannerDesc")}
                  </p>

                  <div className={cn("mt-3 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wide text-emerald-700", isRTL && "flex-row-reverse font-amiri normal-case")}>
                    <Shield className="h-3.5 w-3.5 shrink-0" />
                    {t("privacyHint")}
                  </div>

                  <div className={cn("mt-4 flex flex-wrap gap-2", isRTL && "flex-row-reverse")}>
                    <button
                      type="button"
                      onClick={handleEnable}
                      disabled={loading}
                      className="rounded-xl bg-orange-500 px-4 py-2.5 text-xs font-black uppercase tracking-wide text-white shadow-md shadow-orange-500/25 transition hover:bg-orange-600 disabled:opacity-60"
                    >
                      {loading ? t("enabling") : t("enable")}
                    </button>
                    <button
                      type="button"
                      onClick={handleDismiss}
                      className={cn(
                        "rounded-xl px-4 py-2.5 text-xs font-bold text-slate-500 transition hover:bg-slate-100 hover:text-slate-800",
                        isRTL && "font-amiri"
                      )}
                    >
                      {t("later")}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/** Indicateur compact pour le menu notifications */
export function PushNotificationToggle({ onStatusChange }: { onStatusChange?: () => void }) {
  const t = useTranslations("PushNotifications");
  const locale = useLocale();
  const isRTL = locale === "ar" || locale.endsWith("-ar");

  const [state, setState] = useState<"loading" | "off" | "on" | "denied" | "unavailable">("loading");
  const [busy, setBusy] = useState(false);

  const refresh = useCallback(async () => {
    if (!isPushSupported() || !isPushConfiguredClient()) {
      setState("unavailable");
      return;
    }

    const permission = getPushPermission();
    if (permission === "denied") {
      setState("denied");
      return;
    }

    try {
      const res = await fetch("/api/notifications/push");
      const data = await res.json();
      setState(data.subscribed ? "on" : "off");
    } catch {
      setState("off");
    }
  }, []);

  useEffect(() => {
    refresh();
    const handler = () => refresh();
    window.addEventListener("fg-push-status-changed", handler);
    return () => window.removeEventListener("fg-push-status-changed", handler);
  }, [refresh]);

  const handleToggle = async () => {
    if (state === "unavailable" || state === "denied") return;

    setBusy(true);
    if (state === "on") {
      const { unregisterPushNotifications } = await import("@/lib/messaging/push-client");
      await unregisterPushNotifications();
      toast.success(t("disabledToast"));
      setState("off");
    } else {
      const result = await registerPushNotifications();
      if (result.ok) {
        toast.success(t("enabledToast"));
        setState("on");
        window.dispatchEvent(new CustomEvent("fg-push-status-changed"));
      } else if (result.reason === "denied") {
        toast.error(t("deniedToast"));
        setState("denied");
      } else {
        toast.error(result.message || t("errorToast"));
      }
    }
    setBusy(false);
    onStatusChange?.();
  };

  const handleTest = async () => {
    setBusy(true);
    try {
      const res = await fetch("/api/notifications/push/test", { method: "POST" });
      const data = await res.json();
      if (res.ok) {
        toast.success(t("testSent"));
      } else {
        toast.error(data.message || data.error || t("errorToast"));
      }
    } catch {
      toast.error(t("errorToast"));
    }
    setBusy(false);
  };

  if (state === "unavailable") {
    return (
      <div className={cn("mx-1 rounded-2xl border border-amber-100 bg-amber-50/80 p-3", isRTL && "text-right")}>
        <p className={cn("text-xs font-black text-amber-900", isRTL && "font-amiri")}>{t("menuTitle")}</p>
        <p className={cn("mt-1 text-[11px] font-medium text-amber-800", isRTL && "font-lateef text-sm")}>
          {t("notConfigured")}
        </p>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "mx-3 mb-2 rounded-2xl border border-orange-100 bg-gradient-to-br from-orange-50/80 to-white p-3",
        isRTL && "text-right"
      )}
    >
      <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
        <div className={cn("mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-xl", state === "on" ? "bg-emerald-500 text-white" : "bg-orange-500 text-white")}>
          {state === "on" ? <CheckCircle2 className="h-4 w-4" /> : <BellRing className="h-4 w-4" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className={cn("text-xs font-black text-slate-900", isRTL && "font-amiri")}>{t("menuTitle")}</p>
          <p className={cn("mt-0.5 text-[11px] font-medium text-slate-500 leading-snug", isRTL && "font-lateef text-sm")}>
            {state === "on" ? t("menuOn") : state === "denied" ? t("menuDenied") : t("menuOff")}
          </p>
          <div className={cn("mt-2 flex flex-wrap gap-2", isRTL && "flex-row-reverse")}>
            {state !== "denied" && (
              <button
                type="button"
                disabled={busy || state === "loading"}
                onClick={handleToggle}
                className="rounded-lg bg-orange-500 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-white hover:bg-orange-600 disabled:opacity-50"
              >
                {state === "on" ? t("disable") : t("enable")}
              </button>
            )}
            {state === "on" && (
              <button
                type="button"
                disabled={busy}
                onClick={handleTest}
                className="rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-[10px] font-bold text-slate-600 hover:bg-slate-50 disabled:opacity-50"
              >
                {t("test")}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

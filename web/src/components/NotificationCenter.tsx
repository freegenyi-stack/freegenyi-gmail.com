"use client";

import React, { useState, useEffect, useCallback, useRef } from "react";
import { Bell, Check, Award, MessageCircle, AlertCircle, Info, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PushNotificationToggle } from "@/components/PushNotificationPrompt";
import { playNotifySound, unlockChatSounds } from "@/lib/messaging/chat-sounds";
import { Sheet, SheetContent } from "@/components/ui/sheet";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export interface Notification {
  id: number;
  type: string;
  title: string;
  content: string | null;
  link: string | null;
  isRead: boolean;
  createdAt: string;
}

let openPanel: (() => void) | null = null;

/** Ouvre le panneau notifications (header, menu profil, etc.) */
export function openNotificationPanel() {
  openPanel?.();
}

/** Panneau latéral — monté une fois dans le Header */
export function NotificationPanel() {
  const t = useTranslations("UserMenu");
  const locale = useLocale();
  const isRTL = locale === "ar" || locale.endsWith("-ar");
  const [open, setOpen] = useState(false);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const prevUnreadRef = useRef(0);
  const notifyInitRef = useRef(true);

  useEffect(() => {
    openPanel = () => setOpen(true);
    return () => {
      openPanel = null;
    };
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/notifications");
      const data = await res.json();
      const list = (data.notifications || []) as Notification[];
      const unread = list.filter((n) => !n.isRead).length;
      setNotifications(list);
      setUnreadCount(unread);
      if (notifyInitRef.current) {
        notifyInitRef.current = false;
        prevUnreadRef.current = unread;
      } else if (unread > prevUnreadRef.current) {
        playNotifySound();
      }
      prevUnreadRef.current = unread;
    } catch {
      setNotifications([]);
    }
  }, []);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [load]);

  const markAsRead = async (id: number) => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    setNotifications((prev) => prev.map((n) => (n.id === id ? { ...n, isRead: true } : n)));
    setUnreadCount((c) => Math.max(0, c - 1));
  };

  const markAllAsRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
  };

  const getIcon = (type: string) => {
    switch (type) {
      case "message":
        return <MessageCircle className="w-5 h-5 text-blue-500" />;
      case "achievement":
        return <Award className="w-5 h-5 text-orange-500" />;
      case "alert":
        return <AlertCircle className="w-5 h-5 text-red-500" />;
      case "suggestion":
        return <Sparkles className="w-5 h-5 text-orange-500" />;
      case "family":
        return <Info className="w-5 h-5 text-emerald-600" />;
      default:
        return <Info className="w-5 h-5 text-slate-500" />;
    }
  };

  const dateLocale = isRTL ? "ar-DZ" : locale.startsWith("fr") || locale.endsWith("-fr") ? "fr-FR" : "en-US";

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetContent
        side={isRTL ? "left" : "right"}
        className="flex w-full max-w-md flex-col gap-0 p-0"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="border-b border-slate-100 bg-gradient-to-br from-orange-50/80 to-white px-6 pb-4 pt-8">
          <div className={cn("flex items-center justify-between gap-3", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500 text-white shadow-lg shadow-orange-500/25">
                <Bell className="h-5 w-5" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <h2 className={cn("text-lg font-black text-slate-900", isRTL && "font-amiri")}>{t("notifications")}</h2>
                {unreadCount > 0 && (
                  <p className={cn("text-xs font-bold text-orange-600", isRTL && "font-amiri")}>
                    {unreadCount} non lue{unreadCount > 1 ? "s" : ""}
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className={cn("text-[10px] font-bold text-orange-600 hover:text-orange-700 shrink-0", isRTL && "font-amiri")}
              >
                {t("markAllRead")}
              </button>
            )}
          </div>
        </div>

        <div className="border-b border-slate-100 px-3 py-3">
          <PushNotificationToggle onStatusChange={load} />
        </div>

        <div className="flex-1 overflow-y-auto">
          {notifications.length > 0 ? (
            notifications.map((n) => (
              <div
                key={n.id}
                className={cn(
                  "border-b border-slate-50 p-4 transition-colors",
                  !n.isRead ? "bg-orange-50/40" : "bg-white hover:bg-slate-50"
                )}
              >
                <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <div className="mt-0.5 shrink-0">{getIcon(n.type)}</div>
                  <div className="min-w-0 flex-1">
                    {n.link ? (
                      <Link
                        href={n.link}
                        onClick={() => {
                          markAsRead(n.id);
                          setOpen(false);
                        }}
                        className={cn(
                          "block text-sm font-black hover:text-orange-600",
                          !n.isRead ? "text-slate-900" : "text-slate-700",
                          isRTL && "font-amiri text-right"
                        )}
                      >
                        {n.title}
                      </Link>
                    ) : (
                      <p className={cn("text-sm font-black", !n.isRead ? "text-slate-900" : "text-slate-700", isRTL && "font-amiri text-right")}>
                        {n.title}
                      </p>
                    )}
                    {n.content && (
                      <p className={cn("mt-1 text-xs font-medium leading-relaxed text-slate-500", isRTL && "font-lateef text-sm text-right")}>
                        {n.content}
                      </p>
                    )}
                    <p className={cn("mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400", isRTL && "font-amiri normal-case text-right")}>
                      {new Date(n.createdAt).toLocaleDateString(dateLocale)}
                    </p>
                  </div>
                  {!n.isRead && (
                    <button
                      type="button"
                      onClick={() => markAsRead(n.id)}
                      className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-slate-100 text-slate-400 transition hover:bg-green-100 hover:text-green-600"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center text-slate-400">
              <Bell className="mb-3 h-10 w-10 opacity-40" />
              <p className={cn("text-sm font-bold", isRTL && "font-amiri")}>{t("noNotifications")}</p>
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}

/** Entrée menu profil */
export default function NotificationMenuItem() {
  const t = useTranslations("UserMenu");
  const locale = useLocale();
  const isRTL = locale === "ar" || locale.endsWith("-ar");

  return (
    <button
      type="button"
      onClick={() => openNotificationPanel()}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-orange-600",
        isRTL && "flex-row-reverse font-amiri"
      )}
    >
      <Bell className="h-4 w-4 opacity-50 shrink-0" />
      {t("notifications")}
    </button>
  );
}

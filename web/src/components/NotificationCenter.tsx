"use client";

import React, { useState, useEffect, useCallback, useRef, useMemo } from "react";
import { Bell, Check, Award, MessageCircle, AlertCircle, Info, Sparkles } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { PushNotificationToggle } from "@/components/PushNotificationPrompt";
import { playNotifySound, unlockChatSounds } from "@/lib/messaging/chat-sounds";
import {
  displayMessageNotificationContent,
  parseMessageNotificationCount,
} from "@/lib/messaging/notify-utils";
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

type GroupedNotification = Notification & {
  unreadMessages: number;
  groupLink?: string;
};

let openPanel: (() => void) | null = null;

function groupNotifications(list: Notification[]): GroupedNotification[] {
  const others: GroupedNotification[] = [];
  const msgGroups = new Map<string, GroupedNotification>();

  for (const n of list) {
    if (n.type === "message" && n.link) {
      const key = n.link;
      const count = n.isRead ? 0 : parseMessageNotificationCount(n.content);
      const existing = msgGroups.get(key);

      if (!existing) {
        msgGroups.set(key, {
          ...n,
          unreadMessages: count,
          groupLink: key,
        });
        continue;
      }

      if (!n.isRead) {
        existing.unreadMessages += count;
        existing.isRead = false;
      }
      if (new Date(n.createdAt).getTime() > new Date(existing.createdAt).getTime()) {
        existing.title = n.title;
        existing.content = n.content;
        existing.createdAt = n.createdAt;
        existing.id = n.id;
      }
    } else {
      others.push({ ...n, unreadMessages: n.isRead ? 0 : 1 });
    }
  }

  return [...msgGroups.values(), ...others].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
  );
}

function emitNotificationsUpdated() {
  window.dispatchEvent(new CustomEvent("fg-notifications-updated"));
}

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
  const [unreadMessages, setUnreadMessages] = useState(0);
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
      const unread = typeof data.unreadCount === "number" ? data.unreadCount : list.filter((n) => !n.isRead).length;
      setNotifications(list);
      setUnreadCount(unread);
      setUnreadMessages(typeof data.unreadMessages === "number" ? data.unreadMessages : 0);
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

  const grouped = useMemo(() => groupNotifications(notifications), [notifications]);

  useEffect(() => {
    if (open) load();
  }, [open, load]);

  useEffect(() => {
    load();
    const id = setInterval(load, 15000);
    return () => clearInterval(id);
  }, [load]);

  const markAsRead = async (item: GroupedNotification) => {
    const body = item.groupLink ? { link: item.groupLink } : { id: item.id };
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });
    setNotifications((prev) =>
      prev.map((n) => {
        if (item.groupLink && n.type === "message" && n.link === item.groupLink) {
          return { ...n, isRead: true };
        }
        if (n.id === item.id) return { ...n, isRead: true };
        return n;
      })
    );
    setUnreadCount((c) => Math.max(0, c - item.unreadMessages));
    emitNotificationsUpdated();
  };

  const markAllAsRead = async () => {
    await fetch("/api/notifications", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ all: true }),
    });
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
    setUnreadCount(0);
    emitNotificationsUpdated();
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
        className="fg-glass-sheet flex w-full max-w-md flex-col gap-0 p-0 shadow-2xl"
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="fg-glass-bar shrink-0 border-b px-6 pb-4 pt-8">
          <div className={cn("flex items-center justify-between gap-3", isRTL && "flex-row-reverse")}>
            <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
              <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-orange-500/90 text-white shadow-lg shadow-orange-500/25 backdrop-blur-sm">
                <Bell className="h-5 w-5" />
              </div>
              <div className={isRTL ? "text-right" : ""}>
                <h2 className={cn("text-lg font-black text-slate-900", isRTL && "font-ui-ar")}>{t("notifications")}</h2>
                {unreadCount > 0 && (
                  <p className={cn("text-xs font-bold text-orange-600", isRTL && "font-ui-ar")}>
                    {unreadMessages > 0
                      ? `${unreadMessages} message${unreadMessages > 1 ? "s" : ""} non lu${unreadMessages > 1 ? "s" : ""}`
                      : `${unreadCount} non lue${unreadCount > 1 ? "s" : ""}`}
                  </p>
                )}
              </div>
            </div>
            {unreadCount > 0 && (
              <button
                type="button"
                onClick={markAllAsRead}
                className={cn("text-[10px] font-bold text-orange-600 hover:text-orange-700 shrink-0", isRTL && "font-ui-ar")}
              >
                {t("markAllRead")}
              </button>
            )}
          </div>
        </div>

        <div className="fg-glass-bar shrink-0 border-b px-3 py-3">
          <PushNotificationToggle onStatusChange={load} />
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto custom-scroll">
          {grouped.length > 0 ? (
            grouped.map((n) => {
              const preview =
                n.type === "message"
                  ? displayMessageNotificationContent(n.content)
                  : n.content;
              const showBadge = !n.isRead && n.unreadMessages > 0;

              return (
                <div
                  key={n.groupLink ? `g-${n.groupLink}` : `n-${n.id}`}
                  className={cn(
                    "fg-glass-row border-b p-4 transition-colors",
                    !n.isRead ? "fg-glass-row-active" : "hover:bg-white/20"
                  )}
                >
                  <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                    <div className="relative mt-0.5 shrink-0">
                      {getIcon(n.type)}
                      {showBadge && n.unreadMessages === 1 && (
                        <span className="absolute -end-0.5 -top-0.5 h-2.5 w-2.5 rounded-full bg-orange-500 ring-2 ring-white/80" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <div className={cn("flex items-start justify-between gap-2", isRTL && "flex-row-reverse")}>
                        {n.link ? (
                          <Link
                            href={n.link}
                            onClick={() => {
                              void markAsRead(n);
                              setOpen(false);
                            }}
                            className={cn(
                              "block text-sm font-black hover:text-orange-600",
                              !n.isRead ? "text-slate-900" : "text-slate-700",
                              isRTL && "font-ui-ar text-right"
                            )}
                          >
                            {n.title}
                          </Link>
                        ) : (
                          <p className={cn("text-sm font-black", !n.isRead ? "text-slate-900" : "text-slate-700", isRTL && "font-ui-ar text-right")}>
                            {n.title}
                          </p>
                        )}
                        {showBadge && n.unreadMessages > 1 && (
                          <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-bold text-white">
                            {n.unreadMessages > 9 ? "9+" : n.unreadMessages}
                          </span>
                        )}
                      </div>
                      {preview && (
                        <p className={cn("mt-1 text-xs font-medium leading-relaxed text-slate-500", isRTL && "font-lateef text-sm text-right")}>
                          {preview}
                        </p>
                      )}
                      <p className={cn("mt-2 text-[10px] font-bold uppercase tracking-wide text-slate-400", isRTL && "font-ui-ar normal-case text-right")}>
                        {new Date(n.createdAt).toLocaleDateString(dateLocale)}
                      </p>
                    </div>
                    {!n.isRead && (
                      <button
                        type="button"
                        onClick={() => void markAsRead(n)}
                        className="fg-glass-icon flex h-7 w-7 shrink-0 items-center justify-center !rounded-full text-slate-400 hover:text-green-600"
                      >
                        <Check className="h-3.5 w-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              );
            })
          ) : (
            <div className="flex flex-col items-center justify-center px-6 py-16 text-center text-slate-400">
              <Bell className="mb-3 h-10 w-10 opacity-40" />
              <p className={cn("text-sm font-bold", isRTL && "font-ui-ar")}>{t("noNotifications")}</p>
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
      onClick={() => {
        unlockChatSounds();
        openNotificationPanel();
      }}
      className={cn(
        "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-orange-600",
        isRTL && "flex-row-reverse font-ui-ar"
      )}
    >
      <Bell className="h-4 w-4 opacity-50 shrink-0" />
      {t("notifications")}
    </button>
  );
}

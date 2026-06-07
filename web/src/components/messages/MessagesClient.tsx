"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Check,
  CheckCheck,
  LayoutDashboard,
  Loader2,
  MessageSquare,
  Megaphone,
  Paperclip,
  Users,
  GraduationCap,
  FileText,
  Building2,
  Search,
  Send,
  Shield,
  Sparkles,
  BellOff,
  HelpCircle,
  Pencil,
  Trash2,
  Volume2,
  VolumeX,
  X,
} from "lucide-react";
import type { ChatMessageDto, ConversationPreview, MessageSuggestionDto } from "@/lib/messaging/types";
import { SECTION_ORDER, type ChannelSection } from "@/lib/messaging/channel-catalog";
import {
  isChatSoundsEnabled,
  playReceiveSound,
  playSendSound,
  setChatSoundsEnabled,
  unlockChatSounds,
} from "@/lib/messaging/chat-sounds";
import { cn } from "@/lib/utils";
import { useIsDesktopLayout, useIsMobileLayout } from "@/hooks/useMediaQuery";
import ChannelHelpModal from "@/components/messages/ChannelHelpModal";
import MediaModerationPanel from "@/components/messages/MediaModerationPanel";

const DASH_BY_ROLE: Record<string, string> = {
  parent: "parent",
  coparent: "parent",
  enseignant: "enseignant",
  ecole: "ecole",
  ong: "ong",
};

const ROLE_BUBBLE: Record<string, string> = {
  parent: "bg-orange-500 text-white",
  coparent: "bg-orange-400 text-white",
  enseignant: "bg-teal-600 text-white",
  ecole: "bg-indigo-600 text-white",
  ong: "bg-amber-600 text-white",
};

const ROLE_ACCENT: Record<string, { primary: string; light: string; ring: string }> = {
  parent: { primary: "bg-orange-600", light: "bg-orange-50", ring: "ring-orange-200" },
  enseignant: { primary: "bg-teal-600", light: "bg-teal-50", ring: "ring-teal-200" },
  ecole: { primary: "bg-indigo-600", light: "bg-indigo-50", ring: "ring-indigo-200" },
  ong: { primary: "bg-amber-600", light: "bg-amber-50", ring: "ring-amber-200" },
};

type Props = { role: string };

function formatTime(iso: string, locale: string) {
  try {
    return new Date(iso).toLocaleTimeString(locale.startsWith("ar") ? "ar-DZ" : "fr-FR", {
      hour: "2-digit",
      minute: "2-digit",
    });
  } catch {
    return "";
  }
}

const SECTION_ICONS: Record<ChannelSection, React.ReactNode> = {
  announcements: <Megaphone className="h-4 w-4" />,
  school: <Building2 className="h-4 w-4" />,
  class: <GraduationCap className="h-4 w-4" />,
  community: <Users className="h-4 w-4" />,
  staff: <Users className="h-4 w-4" />,
  external: <Building2 className="h-4 w-4" />,
  documents: <FileText className="h-4 w-4" />,
  direct: <MessageSquare className="h-4 w-4" />,
};

function convTitle(conv: ConversationPreview, t: (k: string) => string, isRTL: boolean) {
  if (conv.type === "channel" && conv.channelMeta) {
    const key = conv.channelMeta.labelKey;
    try {
      return t(key);
    } catch {
      return conv.channelMeta.slug.replace(/^fg-/, "");
    }
  }
  if (conv.otherUser) return displayUserName(conv.otherUser, isRTL);
  return "…";
}

function convPreview(conv: ConversationPreview, t: (k: string) => string) {
  const msg = conv.lastMessage;
  if (!msg) return t("noMessageYet");
  let body = msg.content;
  if (msg.messageType === "image") body = msg.content?.trim() || t("previewImage");
  else if (msg.messageType === "file") body = msg.content?.trim() || t("previewFile");
  if (!body?.trim() && !msg.mediaUrl) return t("noMessageYet");
  if (conv.type === "channel") {
    const prefix = msg.isMine ? t("youPrefix") : msg.senderName || "…";
    return `${prefix}: ${body}`;
  }
  return body;
}

function fileLabel(content: string, mediaUrl: string | null | undefined): string {
  if (content.trim()) return content.trim();
  if (mediaUrl) {
    const part = mediaUrl.split("/").pop() || "fichier";
    return decodeURIComponent(part.replace(/^\d+-/, ""));
  }
  return "Fichier";
}

function displayUserName(u: { fullName: string | null; username: string | null }, isRTL: boolean) {
  const name = u.fullName?.trim() || u.username || "?";
  return isRTL ? name : name;
}

function ConversationRow({
  conv,
  activeId,
  accent,
  isRTL,
  locale,
  t,
  onOpen,
}: {
  conv: ConversationPreview;
  activeId: number | null;
  accent: { ring: string; light: string };
  isRTL: boolean;
  locale: string;
  t: (k: string) => string;
  onOpen: (id: number) => void;
}) {
  const isChannel = conv.type === "channel";
  const section = (conv.channelMeta?.section || "direct") as ChannelSection;

  return (
    <button
      type="button"
      onClick={() => onOpen(conv.id)}
      className={cn(
        "w-full flex items-center gap-3 rounded-2xl px-3 py-3 text-start transition-all",
        activeId === conv.id ? cn("ring-2 shadow-md", accent.ring, accent.light) : "hover:bg-slate-50",
        isRTL && "flex-row-reverse text-right"
      )}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            "flex h-11 w-11 items-center justify-center rounded-2xl text-sm font-black",
            isChannel ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-600"
          )}
        >
          {isChannel ? (
            SECTION_ICONS[section] || <MessageSquare className="h-4 w-4" />
          ) : (
            (conv.otherUser?.fullName || conv.otherUser?.username || "?")[0]?.toUpperCase()
          )}
        </div>
        {!isChannel && conv.otherUser?.isOnline && (
          <span className="absolute -bottom-0.5 -end-0.5 h-3 w-3 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>
      <div className="min-w-0 flex-1">
        <div className={cn("flex items-center justify-between gap-2", isRTL && "flex-row-reverse")}>
          <p className={cn("truncate text-sm font-black text-slate-900", isRTL && "font-amiri")}>
            {convTitle(conv, t, isRTL)}
          </p>
          {conv.lastMessage && (
            <span className="shrink-0 text-[10px] font-bold text-slate-400">
              {formatTime(conv.lastMessage.createdAt, locale)}
            </span>
          )}
        </div>
        <p className={cn("truncate text-xs font-medium text-slate-500 mt-0.5", isRTL && "font-lateef")}>
          {convPreview(conv, t)}
        </p>
      </div>
      {conv.unreadCount > 0 && (
        <span className="flex h-5 min-w-5 shrink-0 items-center justify-center rounded-full bg-orange-500 px-1.5 text-[10px] font-black text-white">
          {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
        </span>
      )}
      {conv.muted && (
        <BellOff className="h-4 w-4 shrink-0 text-slate-400" aria-label={t("muted")} />
      )}
    </button>
  );
}

export default function MessagesClient({ role }: Props) {
  const t = useTranslations("Messages");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const isRTL = locale === "ar" || locale.endsWith("-ar");
  const isMobile = useIsMobileLayout();
  const isDesktop = useIsDesktopLayout();
  const accent = ROLE_ACCENT[role] || ROLE_ACCENT.parent;

  const [conversations, setConversations] = useState<ConversationPreview[]>([]);
  const [suggestions, setSuggestions] = useState<MessageSuggestionDto[]>([]);
  const [activeId, setActiveId] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessageDto[]>([]);
  const [partnerRole, setPartnerRole] = useState<string>("parent");
  const [activeChannel, setActiveChannel] = useState<{ labelKey: string; section: string } | null>(null);
  const [loadingList, setLoadingList] = useState(true);
  const [loadingChat, setLoadingChat] = useState(false);
  const [sending, setSending] = useState(false);
  const [draft, setDraft] = useState("");
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [mobileView, setMobileView] = useState<"list" | "chat">("list");
  const [typingUsers, setTypingUsers] = useState<{ userId: number; name: string }[]>([]);
  const [soundsOn, setSoundsOn] = useState(true);
  const [canPost, setCanPost] = useState(true);
  const [allowBroadcast, setAllowBroadcast] = useState(false);
  const [broadcastMode, setBroadcastMode] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [pendingMedia, setPendingMedia] = useState<{
    url: string;
    messageType: "image" | "file";
    fileName: string;
  } | null>(null);
  const [muted, setMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showModeration, setShowModeration] = useState(false);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const deepLinkHandled = useRef(false);
  const typingPingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMsgIdRef = useRef(0);

  const activeConv = conversations.find((c) => c.id === activeId);

  const dashPath = DASH_BY_ROLE[role] || "parent";
  const subtitleKey =
    role === "enseignant" ? "subtitleTeacher" : role === "ecole" ? "subtitleSchool" : role === "ong" ? "subtitleNgo" : "subtitleParent";
  const backLabelKey =
    role === "enseignant" ? "backTeacher" : role === "ecole" ? "backSchool" : role === "ong" ? "backNgo" : "backParent";

  useEffect(() => {
    setSoundsOn(isChatSoundsEnabled());
  }, []);

  const fetchList = useCallback(async () => {
    try {
      const [convRes, sugRes] = await Promise.all([
        fetch("/api/chat/conversations"),
        fetch(`/api/chat/suggestions?locale=${encodeURIComponent(locale)}`),
      ]);
      const convData = await convRes.json();
      const sugData = await sugRes.json();
      setConversations(convData.conversations || []);
      setSuggestions(sugData.suggestions || []);
    } catch {
      setError(t("errorGeneric"));
    } finally {
      setLoadingList(false);
    }
  }, [locale, t]);

  const openConversation = useCallback(
    async (conversationId: number) => {
      setActiveId(conversationId);
      setLoadingChat(true);
      setError(null);
      if (isMobile) setMobileView("chat");

      try {
        const res = await fetch(`/api/chat/conversations/${conversationId}/messages`);
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t("errorGeneric"));
        setMessages(data.messages || []);
        setHasMoreOlder((data.messages || []).length >= 50);
        const latest = (data.messages || []).slice(-1)[0];
        lastMsgIdRef.current = latest?.id && latest.id > 0 ? latest.id : 0;
        const partner = data.partner;
        setMuted(!!partner?.muted);
        if (partner?.kind === "channel") {
          setActiveChannel({ labelKey: partner.labelKey, section: partner.section });
          setPartnerRole("parent");
          setCanPost(partner.canPost !== false);
          setAllowBroadcast(!!partner.allowBroadcast);
          setBroadcastMode(false);
        } else {
          setActiveChannel(null);
          setPartnerRole(partner?.user?.role || "parent");
          setCanPost(true);
          setAllowBroadcast(false);
          setBroadcastMode(false);
        }
        setPendingMedia(null);
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
        );
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errorGeneric"));
      } finally {
        setLoadingChat(false);
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 50);
      }
    },
    [isMobile, t]
  );

  const startWithUser = useCallback(
    async (targetUserId: number) => {
      setError(null);
      const existing = conversations.find(
        (c) => c.type !== "channel" && c.otherUser?.id === targetUserId
      );
      if (existing) {
        await openConversation(existing.id);
        return;
      }
      try {
        const res = await fetch("/api/chat/conversations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ targetUserId }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t("errorGeneric"));
        await fetchList();
        await openConversation(data.conversationId);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errorGeneric"));
      }
    },
    [conversations, fetchList, openConversation, t]
  );

  const dismissSuggestion = async (id: number) => {
    await fetch("/api/chat/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suggestionId: id }),
    });
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
  };

  const sendMessage = async () => {
    if (!activeId || sending || uploading) return;
    const text = draft.trim();
    if (!text && !pendingMedia) return;
    setDraft("");
    const media = pendingMedia;
    setPendingMedia(null);
    void fetch(`/api/chat/conversations/${activeId}/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: false }),
    });
    setSending(true);
    setError(null);

    const optimistic: ChatMessageDto = {
      id: -Date.now(),
      conversationId: activeId,
      senderId: -1,
      content: text || media?.fileName || "",
      messageType: media?.messageType || "text",
      mediaUrl: media?.url,
      createdAt: new Date().toISOString(),
      isMine: true,
      isRead: false,
    };
    setMessages((prev) => [...prev, optimistic]);
    setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 30);

    try {
      const res = await fetch(`/api/chat/conversations/${activeId}/messages`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          content: text,
          locale,
          mediaUrl: media?.url,
          messageType: media?.messageType,
          fileName: media?.fileName,
          broadcast: broadcastMode && allowBroadcast,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("errorSend"));
      setMessages((prev) => [...prev.filter((m) => m.id !== optimistic.id), data.message]);
      if (data.message?.id) lastMsgIdRef.current = data.message.id;
      playSendSound();
      fetchList();
    } catch (e) {
      setMessages((prev) => prev.filter((m) => m.id !== optimistic.id));
      setDraft(text);
      if (media) setPendingMedia(media);
      setError(e instanceof Error ? e.message : t("errorSend"));
    } finally {
      setSending(false);
      inputRef.current?.focus();
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !activeId) return;
    unlockChatSounds();
    setUploading(true);
    setError(null);
    try {
      const form = new FormData();
      form.append("file", file);
      const res = await fetch("/api/chat/upload", { method: "POST", body: form });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("errorUpload"));
      setPendingMedia({
        url: data.url,
        messageType: data.messageType,
        fileName: data.fileName,
      });
      inputRef.current?.focus();
    } catch (err) {
      setError(err instanceof Error ? err.message : t("errorUpload"));
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    const c = searchParams.get("c");
    const u = searchParams.get("u");
    if (loadingList || deepLinkHandled.current) return;

    if (u) {
      const targetId = parseInt(u, 10);
      if (!Number.isNaN(targetId)) {
        deepLinkHandled.current = true;
        startWithUser(targetId);
      }
      return;
    }

    if (c) {
      const id = parseInt(c, 10);
      if (!Number.isNaN(id)) {
        deepLinkHandled.current = true;
        openConversation(id);
      }
    }
  }, [searchParams, loadingList, openConversation, startWithUser]);

  useEffect(() => {
    if (!activeId) {
      setTypingUsers([]);
      return;
    }

    let es: EventSource | null = null;
    let retryTimer: ReturnType<typeof setTimeout> | null = null;
    let cancelled = false;

    const connect = () => {
      if (cancelled) return;
      const since = lastMsgIdRef.current;
      es = new EventSource(`/api/chat/stream?conversationId=${activeId}&since=${since}`);

      es.onmessage = (ev) => {
        try {
          const data = JSON.parse(ev.data);
          if (Array.isArray(data.typing)) {
            setTypingUsers(data.typing);
          }
          if (data.type === "messages" && data.messages?.length) {
            const latest = data.messages[data.messages.length - 1] as ChatMessageDto;
            if (latest.id > lastMsgIdRef.current) {
              if (!latest.isMine) playReceiveSound();
              lastMsgIdRef.current = latest.id;
            }
            setMessages(data.messages);
            fetchList();
            setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 30);
          }
        } catch {
          /* ignore */
        }
      };

      es.onerror = () => {
        es?.close();
        es = null;
        if (!cancelled) {
          retryTimer = setTimeout(connect, 4000);
        }
      };
    };

    connect();

    return () => {
      cancelled = true;
      if (retryTimer) clearTimeout(retryTimer);
      es?.close();
    };
  }, [activeId, fetchList]);

  useEffect(() => {
    if (!activeId || !draft.trim()) {
      if (activeId) {
        void fetch(`/api/chat/conversations/${activeId}/typing`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ active: false }),
        });
      }
      return;
    }

    const ping = () => {
      void fetch(`/api/chat/conversations/${activeId}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: true }),
      });
    };

    ping();
    typingPingRef.current = setInterval(ping, 2500);

    return () => {
      if (typingPingRef.current) clearInterval(typingPingRef.current);
      void fetch(`/api/chat/conversations/${activeId}/typing`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ active: false }),
      });
    };
  }, [activeId, draft]);

  const loadOlderMessages = async () => {
    if (!activeId || loadingOlder || !hasMoreOlder || messages.length === 0) return;
    const first = messages[0];
    if (!first || first.id <= 0) return;
    setLoadingOlder(true);
    const el = scrollRef.current;
    const prevHeight = el?.scrollHeight || 0;
    try {
      const res = await fetch(`/api/chat/conversations/${activeId}/messages?before=${first.id}`);
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("errorGeneric"));
      const older = (data.messages || []) as ChatMessageDto[];
      if (older.length < 50) setHasMoreOlder(false);
      if (older.length > 0) {
        setMessages((prev) => [...older, ...prev]);
        requestAnimationFrame(() => {
          if (el) el.scrollTop = el.scrollHeight - prevHeight;
        });
      }
    } catch {
      /* ignore */
    } finally {
      setLoadingOlder(false);
    }
  };

  const toggleMute = async () => {
    if (!activeId) return;
    const next = !muted;
    const res = await fetch(`/api/chat/conversations/${activeId}/mute`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ muted: next }),
    });
    const data = await res.json();
    if (res.ok) {
      setMuted(next);
      setConversations((prev) => prev.map((c) => (c.id === activeId ? { ...c, muted: next } : c)));
    } else {
      setError(data.error || t("errorGeneric"));
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!activeId || !window.confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/chat/conversations/${activeId}/messages/${messageId}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } else {
      const data = await res.json();
      setError(data.error || t("errorSend"));
    }
  };

  const saveEditMessage = async () => {
    if (!activeId || !editingId || !editDraft.trim()) return;
    const res = await fetch(`/api/chat/conversations/${activeId}/messages/${editingId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ content: editDraft.trim() }),
    });
    const data = await res.json();
    if (res.ok) {
      setMessages((prev) => prev.map((m) => (m.id === editingId ? data.message : m)));
      setEditingId(null);
      setEditDraft("");
    } else {
      setError(data.error || t("errorSend"));
    }
  };

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;
    const onScroll = () => {
      if (el.scrollTop < 80) void loadOlderMessages();
    };
    el.addEventListener("scroll", onScroll);
    return () => el.removeEventListener("scroll", onScroll);
  }, [activeId, messages, loadingOlder, hasMoreOlder]);

  const typingLabel = (() => {
    if (typingUsers.length === 0) return null;
    if (typingUsers.length === 1) {
      return t("typingOne", { name: typingUsers[0].name.split(" ")[0] });
    }
    if (typingUsers.length === 2) {
      return t("typingTwo", {
        a: typingUsers[0].name.split(" ")[0],
        b: typingUsers[1].name.split(" ")[0],
      });
    }
    return t("typingMany");
  })();

  const filtered = conversations.filter((c) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = (c.otherUser?.fullName || c.otherUser?.username || "").toLowerCase();
    const channelTitle =
      c.type === "channel" && c.channelMeta
        ? `${c.channelMeta.slug} ${t(c.channelMeta.labelKey)}`.toLowerCase()
        : "";
    return name.includes(q) || channelTitle.includes(q);
  });

  const directConversations = filtered.filter((c) => c.type !== "channel");
  const channelConversations = filtered.filter((c) => c.type === "channel");
  const channelGroups = SECTION_ORDER.map((section) => ({
    section,
    items: channelConversations.filter((c) => c.channelMeta?.section === section),
  })).filter((g) => g.items.length > 0);

  const sectionTitle = (section: ChannelSection) => {
    const keys: Record<ChannelSection, string> = {
      announcements: "sectionAnnouncements",
      school: "sectionSchool",
      class: "sectionClass",
      community: "sectionCommunity",
      staff: "sectionStaff",
      external: "sectionExternal",
      documents: "sectionDocuments",
      direct: "sectionDirect",
    };
    return t(keys[section]);
  };

  const filteredSuggestions = suggestions.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = (s.targetUser.fullName || s.targetUser.username || "").toLowerCase();
    return name.includes(q) || s.reasonLabel.toLowerCase().includes(q);
  });

  const suggestionAvatarClass = (s: MessageSuggestionDto) => {
    const role = s.targetUser.role;
    if (s.reasonKey === "teacher_of_child" || role === "enseignant") {
      return "bg-teal-100 text-teal-700 ring-teal-200/60";
    }
    if (s.reasonKey === "parent_at_school" || role === "parent" || role === "coparent") {
      return "bg-orange-100 text-orange-700 ring-orange-200/60";
    }
    if (s.reasonKey === "family_ally") {
      return "bg-emerald-100 text-emerald-700 ring-emerald-200/60";
    }
    return "bg-indigo-100 text-indigo-700 ring-indigo-200/60";
  };

  const sidebar = (
    <aside
      className={cn(
        "flex flex-col bg-white border-e border-slate-100 shrink-0 shadow-sm z-10 h-full",
        isMobile ? (mobileView === "list" ? "w-full flex-1" : "hidden") : isDesktop ? "w-full max-w-sm" : "w-80"
      )}
    >
      <div className="px-4 pt-4 pb-2">
        <Link
          href={`/dashboard/${dashPath}`}
          className={cn(
            "flex items-center gap-2 w-full px-4 py-3 rounded-2xl text-xs font-black uppercase tracking-wide transition-all shadow-sm text-white hover:opacity-90",
            accent.primary,
            isRTL && "flex-row-reverse font-amiri text-sm tracking-normal"
          )}
        >
          {isRTL ? <ArrowLeft className="w-4 h-4 shrink-0 rotate-180" /> : <ArrowLeft className="w-4 h-4 shrink-0" />}
          <LayoutDashboard className="w-4 h-4 shrink-0 opacity-80" />
          <span className="truncate">{t(backLabelKey)}</span>
        </Link>
      </div>

      <div className={cn("px-6 py-4 border-b border-slate-50", accent.light)}>
        <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
          <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center text-white shadow-lg", accent.primary)}>
            <MessageSquare className="w-5 h-5" />
          </div>
          <div className={isRTL ? "text-right" : ""}>
            <h1 className={cn("text-xl font-black text-slate-900 font-reem", isRTL && "font-amiri")}>{t("title")}</h1>
            <p className="text-[10px] font-bold text-slate-500 uppercase tracking-widest">FreeGeny</p>
          </div>
        </div>
        <p className={cn("text-xs text-slate-600 font-medium mt-3 leading-relaxed", isRTL && "font-lateef text-sm text-right")}>
          {t(subtitleKey)}
        </p>
      </div>

      <div className="px-4 py-2 bg-amber-50/80 border-b border-amber-100 flex gap-2">
        <Shield className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
        <p className={cn("text-[10px] font-bold text-amber-800 leading-relaxed flex-1", isRTL && "font-amiri text-xs text-right")}>
          {t("regulation")}
        </p>
        <button
          type="button"
          onClick={() => setShowHelp(true)}
          className="shrink-0 rounded-lg p-1 text-amber-700 hover:bg-amber-100"
          title={t("helpTitle")}
        >
          <HelpCircle className="h-4 w-4" />
        </button>
        {role === "ecole" && (
          <button
            type="button"
            onClick={() => setShowModeration(true)}
            className="shrink-0 rounded-lg p-1 text-indigo-700 hover:bg-indigo-100"
            title={t("moderationTitle")}
          >
            <Shield className="h-4 w-4" />
          </button>
        )}
      </div>

      <div className="p-4 pt-2 shrink-0">
        <div className="relative">
          <Search className={cn("w-4 h-4 absolute top-3 text-slate-400", isRTL ? "end-4" : "start-4")} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t("searchUser")}
            className={cn(
              "w-full bg-slate-50 border-2 border-slate-100 rounded-2xl py-2.5 text-sm font-bold text-slate-700 outline-none focus:border-orange-400 transition-all",
              isRTL ? "pe-10 ps-4 font-amiri text-right" : "ps-10 pe-4"
            )}
          />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-3 pb-4">
        {loadingList ? (
          <div className="flex justify-center py-12">
            <Loader2 className="w-6 h-6 animate-spin text-orange-500" />
          </div>
        ) : (
          <>
            {filteredSuggestions.length > 0 && (
              <section className="mb-2">
            <div
              className={cn(
                "mb-2 flex items-center justify-between gap-2 px-1",
                isRTL && "flex-row-reverse"
              )}
            >
              <p
                className={cn(
                  "flex items-center gap-1.5 text-[10px] font-black uppercase tracking-widest text-slate-400",
                  isRTL && "flex-row-reverse font-amiri"
                )}
              >
                <Sparkles className="h-3.5 w-3.5 text-orange-500 shrink-0" />
                {t("suggestionsTitle")}
              </p>
              <span className="rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black text-orange-700">
                {filteredSuggestions.length}
              </span>
            </div>
            <ul className="space-y-1">
              {filteredSuggestions.map((s) => (
                <li key={s.id} className="group relative">
                  <button
                    type="button"
                    onClick={() => startWithUser(s.targetUser.id)}
                    className={cn(
                      "flex w-full items-center gap-3 rounded-2xl border border-slate-100/80 bg-slate-50/50 px-3 py-3 text-start transition-all hover:border-orange-200 hover:bg-orange-50/70 hover:shadow-sm active:scale-[0.99]",
                      isRTL && "flex-row-reverse text-right"
                    )}
                  >
                    <div
                      className={cn(
                        "flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl text-sm font-black ring-2",
                        suggestionAvatarClass(s)
                      )}
                    >
                      {(s.targetUser.fullName || s.targetUser.username || "?")[0]?.toUpperCase()}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className={cn("truncate text-sm font-black text-slate-900", isRTL && "font-amiri")}>
                        {displayUserName(s.targetUser, isRTL)}
                      </p>
                      <p
                        className={cn(
                          "mt-0.5 line-clamp-2 text-xs font-medium leading-snug text-slate-500",
                          isRTL && "font-lateef"
                        )}
                      >
                        {s.reasonLabel}
                      </p>
                    </div>
                    <span
                      className={cn(
                        "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-white text-orange-500 shadow-sm ring-1 ring-orange-100 transition group-hover:bg-orange-500 group-hover:text-white",
                        isRTL && "rotate-180"
                      )}
                    >
                      <MessageSquare className="h-4 w-4" />
                    </span>
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      dismissSuggestion(s.id);
                    }}
                    aria-label={t("dismissSuggestion")}
                    className="absolute top-2 end-2 rounded-lg p-1.5 text-slate-400 opacity-70 transition hover:bg-white hover:text-slate-600 hover:opacity-100 sm:opacity-0 sm:group-hover:opacity-100"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </li>
              ))}
            </ul>
          </section>
            )}

            {filteredSuggestions.length > 0 && (channelGroups.length > 0 || directConversations.length > 0) && (
              <div className="my-3 flex items-center gap-3 px-1">
                <div className="h-px flex-1 bg-slate-100" />
                <span className={cn("text-[9px] font-black uppercase tracking-widest text-slate-300", isRTL && "font-amiri")}>
                  {channelGroups.length > 0 ? t("channelsSection") : t("conversationsSection")}
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
            )}

            {channelGroups.map(({ section, items }) => (
          <section key={section} className="mb-3">
            <p
              className={cn(
                "mb-1.5 flex items-center gap-1.5 px-1 text-[9px] font-black uppercase tracking-widest text-slate-400",
                isRTL && "flex-row-reverse font-amiri"
              )}
            >
              {SECTION_ICONS[section]}
              {sectionTitle(section)}
            </p>
            <div className="space-y-1">
              {items.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conv={conv}
                  activeId={activeId}
                  accent={accent}
                  isRTL={isRTL}
                  locale={locale}
                  t={t}
                  onOpen={openConversation}
                />
              ))}
            </div>
          </section>
            ))}

            {directConversations.length > 0 && channelGroups.length > 0 && (
              <div className="my-3 flex items-center gap-3 px-1">
                <div className="h-px flex-1 bg-slate-100" />
                <span className={cn("text-[9px] font-black uppercase tracking-widest text-slate-300", isRTL && "font-amiri")}>
                  {t("conversationsSection")}
                </span>
                <div className="h-px flex-1 bg-slate-100" />
              </div>
            )}

            {filtered.length === 0 && filteredSuggestions.length === 0 ? (
              <p className={cn("px-4 py-8 text-center text-xs font-bold text-slate-400", isRTL && "font-amiri")}>
                {t("noRooms")}
              </p>
            ) : (
              directConversations.length > 0 && (
                <div className="space-y-1">
                  {directConversations.map((conv) => (
                    <ConversationRow
                      key={conv.id}
                      conv={conv}
                      activeId={activeId}
                      accent={accent}
                      isRTL={isRTL}
                      locale={locale}
                      t={t}
                      onOpen={openConversation}
                    />
                  ))}
                </div>
              )
            )}
          </>
        )}
      </div>
    </aside>
  );

  const chatPanel = (
    <main
      className={cn(
        "flex flex-1 flex-col min-w-0 bg-gradient-to-b from-slate-50/50 to-white h-full",
        isMobile && mobileView !== "chat" && "hidden"
      )}
    >
      {!activeId ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div className={cn("mb-6 flex h-16 w-16 items-center justify-center rounded-3xl text-white shadow-xl", accent.primary)}>
            <MessageSquare className="h-8 w-8" />
          </div>
          <h2 className={cn("text-xl font-black text-slate-900", isRTL && "font-amiri")}>{t("emptyTitle")}</h2>
          <p className={cn("mt-2 max-w-sm text-sm text-slate-500", isRTL && "font-lateef")}>{t("emptyDesc")}</p>
        </div>
      ) : (
        <>
          <header className="flex items-center gap-3 border-b border-slate-100 bg-white/90 px-4 py-3 backdrop-blur-md shrink-0">
            {isMobile && (
              <button type="button" onClick={() => setMobileView("list")} className="rounded-xl p-2 hover:bg-slate-100">
                <ArrowLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
              </button>
            )}
            <div className={cn("flex min-w-0 flex-1 items-center gap-3", isRTL && "flex-row-reverse")}>
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black",
                  activeChannel ? "bg-indigo-100 text-indigo-700" : "bg-slate-100 text-slate-700"
                )}
              >
                {activeChannel ? (
                  SECTION_ICONS[(activeChannel.section as ChannelSection) || "direct"] || (
                    <MessageSquare className="h-4 w-4" />
                  )
                ) : (
                  (activeConv?.otherUser?.fullName || "?")[0]?.toUpperCase()
                )}
              </div>
              <div className={cn("min-w-0", isRTL && "text-right")}>
                <p className={cn("truncate font-black text-slate-900", isRTL && "font-amiri")}>
                  {activeChannel
                    ? t(activeChannel.labelKey)
                    : activeConv
                      ? displayUserName(activeConv.otherUser!, isRTL)
                      : "…"}
                </p>
                <p
                  className={cn(
                    "text-[10px] font-bold uppercase tracking-wide truncate",
                    typingLabel ? "text-teal-600 normal-case" : "text-slate-500",
                    isRTL && typingLabel && "font-amiri"
                  )}
                >
                  {typingLabel ||
                    (activeChannel
                      ? t("channelRoomHint")
                      : activeConv?.otherUser?.isOnline
                        ? t("liveConnected")
                        : t("liveReconnecting"))}
                </p>
              </div>
            </div>
            <div className={cn("flex shrink-0 items-center gap-1", isRTL && "flex-row-reverse")}>
              {activeChannel && (
                <button
                  type="button"
                  title={t("helpTitle")}
                  onClick={() => setShowHelp(true)}
                  className="rounded-xl p-2 text-slate-500 hover:bg-slate-100 hover:text-orange-600"
                >
                  <HelpCircle className="h-5 w-5" />
                </button>
              )}
              <button
                type="button"
                title={muted ? t("unmute") : t("mute")}
                onClick={toggleMute}
                className={cn(
                  "rounded-xl p-2 transition",
                  muted ? "bg-amber-50 text-amber-700" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <BellOff className="h-5 w-5" />
              </button>
            </div>
          </header>

          {error && (
            <div className="mx-4 mt-2 rounded-xl border border-red-100 bg-red-50 px-4 py-2 text-xs font-bold text-red-700">
              {error}
            </div>
          )}

          <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-3">
            {loadingOlder && (
              <div className="flex justify-center py-2">
                <Loader2 className="h-5 w-5 animate-spin text-orange-500" />
              </div>
            )}
            {loadingChat ? (
              <div className="flex justify-center py-16">
                <Loader2 className="h-8 w-8 animate-spin text-orange-500" />
              </div>
            ) : messages.length === 0 ? (
              <p className={cn("py-12 text-center text-sm font-bold text-slate-400", isRTL && "font-amiri")}>{t("emptyRoom")}</p>
            ) : (
              messages.map((m) => {
                const bubbleRole = m.isMine ? role : m.senderRole || partnerRole;
                const isChannelChat = !!activeChannel;
                const isMedia = m.messageType === "image" || m.messageType === "file";
                const caption =
                  isMedia && m.content.trim() === fileLabel(m.content, m.mediaUrl) ? "" : m.content.trim();
                return (
                  <motion.div
                    key={m.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={cn("flex flex-col gap-0.5", m.isMine ? (isRTL ? "items-start" : "items-end") : isRTL ? "items-end" : "items-start")}
                  >
                    {isChannelChat && !m.isMine && m.senderName && (
                      <span className={cn("px-1 text-[10px] font-black text-slate-500", isRTL && "font-amiri")}>
                        {m.senderName}
                      </span>
                    )}
                    <div className={cn("flex w-full items-end gap-1", m.isMine ? (isRTL ? "justify-start" : "justify-end") : isRTL ? "justify-end" : "justify-start")}>
                      <div
                        className={cn(
                          "max-w-[85%] rounded-2xl px-4 py-2.5 shadow-sm",
                          m.isMine
                            ? cn("rounded-be-md", ROLE_BUBBLE[bubbleRole] || ROLE_BUBBLE.parent)
                            : "rounded-bs-md bg-white border border-slate-100 text-slate-800"
                        )}
                      >
                        {m.mediaBlocked && (
                          <p className={cn("mb-2 text-xs font-bold italic opacity-80", isRTL && "font-amiri")}>
                            {t("mediaBlocked")}
                          </p>
                        )}
                        {m.messageType === "image" && m.mediaUrl && (
                          <a href={m.mediaUrl} target="_blank" rel="noopener noreferrer" className="block mb-2">
                            {/* eslint-disable-next-line @next/next/no-img-element */}
                            <img
                              src={m.mediaUrl}
                              alt={m.content || t("attachment")}
                              className="max-h-64 max-w-full rounded-xl object-contain"
                            />
                          </a>
                        )}
                        {m.messageType === "file" && m.mediaUrl && (
                          <a
                            href={m.mediaUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className={cn(
                              "mb-2 flex items-center gap-2 rounded-xl border px-3 py-2 text-sm font-bold underline-offset-2 hover:underline",
                              m.isMine ? "border-white/30 bg-white/10" : "border-slate-200 bg-slate-50"
                            )}
                          >
                            <FileText className="h-4 w-4 shrink-0" />
                            <span className="truncate">{fileLabel(m.content, m.mediaUrl)}</span>
                          </a>
                        )}
                        {(m.messageType === "text" || !m.messageType) && m.content.trim() && (
                          <p
                            className={cn(
                              "text-sm font-medium leading-relaxed whitespace-pre-wrap break-words",
                              isRTL && "font-lateef text-right"
                            )}
                          >
                            {m.content}
                          </p>
                        )}
                        {caption && (
                          <p
                            className={cn(
                              "text-sm font-medium leading-relaxed whitespace-pre-wrap break-words",
                              isMedia && "mt-2",
                              isRTL && "font-lateef text-right"
                            )}
                          >
                            {caption}
                          </p>
                        )}
                        <div className={cn("mt-1 flex items-center gap-1 opacity-70", m.isMine ? "justify-end" : isRTL ? "justify-start" : "justify-end")}>
                          {m.editedAt && (
                            <span className="text-[9px] font-bold italic opacity-80">{t("edited")}</span>
                          )}
                          <span className="text-[9px] font-bold">{formatTime(m.createdAt, locale)}</span>
                          {m.isMine && !isChannelChat &&
                            (m.isRead ? <CheckCheck className="h-3 w-3" /> : <Check className="h-3 w-3" />)}
                        </div>
                      </div>
                      {m.isMine && m.id > 0 && !m.mediaUrl && m.messageType !== "image" && m.messageType !== "file" && (
                        <div className={cn("flex flex-col gap-0.5 pb-1", isRTL && "items-start")}>
                          <button
                            type="button"
                            title={t("editMessage")}
                            onClick={() => {
                              setEditingId(m.id);
                              setEditDraft(m.content);
                            }}
                            className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 hover:text-orange-600"
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </button>
                          <button
                            type="button"
                            title={t("deleteMessage")}
                            onClick={() => void handleDeleteMessage(m.id)}
                            className="rounded-lg p-1 text-slate-400 hover:bg-red-50 hover:text-red-600"
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      )}
                    </div>
                  </motion.div>
                );
              })
            )}
          </div>

          <footer className="shrink-0 border-t border-slate-100 bg-white p-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
            {editingId ? (
              <div className={cn("flex items-end gap-2", isRTL && "flex-row-reverse")}>
                <textarea
                  value={editDraft}
                  onChange={(e) => setEditDraft(e.target.value)}
                  rows={2}
                  className={cn(
                    "min-h-[48px] flex-1 resize-none rounded-2xl border-2 border-orange-200 bg-orange-50 px-4 py-3 text-sm font-medium",
                    isRTL && "font-lateef text-right"
                  )}
                />
                <button type="button" onClick={() => { setEditingId(null); setEditDraft(""); }} className="rounded-2xl px-3 py-3 text-xs font-bold text-slate-500">
                  {t("cancelEdit")}
                </button>
                <button type="button" onClick={saveEditMessage} className={cn("rounded-2xl px-4 py-3 text-xs font-black text-white", accent.primary)}>
                  {t("saveEdit")}
                </button>
              </div>
            ) : !canPost ? (
              <p className={cn("rounded-2xl bg-slate-50 px-4 py-3 text-center text-xs font-bold text-slate-500", isRTL && "font-amiri")}>
                {t("readOnlyChannel")}
              </p>
            ) : (
              <>
                {allowBroadcast && (
                  <label
                    className={cn(
                      "mb-3 flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold transition",
                      broadcastMode
                        ? "border-amber-300 bg-amber-50 text-amber-900"
                        : "border-slate-100 bg-slate-50 text-slate-600",
                      isRTL && "flex-row-reverse font-amiri"
                    )}
                  >
                    <input
                      type="checkbox"
                      checked={broadcastMode}
                      onChange={(e) => setBroadcastMode(e.target.checked)}
                      className="h-4 w-4 rounded border-slate-300 text-amber-600"
                    />
                    <Megaphone className="h-4 w-4 shrink-0" />
                    <span>{t("broadcastToggle")}</span>
                  </label>
                )}
                {pendingMedia && (
                  <div
                    className={cn(
                      "mb-3 flex items-center gap-2 rounded-2xl border border-orange-100 bg-orange-50 px-3 py-2",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    {pendingMedia.messageType === "image" ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={pendingMedia.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : (
                      <FileText className="h-5 w-5 shrink-0 text-orange-600" />
                    )}
                    <span className={cn("min-w-0 flex-1 truncate text-xs font-bold text-orange-900", isRTL && "font-amiri")}>
                      {pendingMedia.fileName}
                    </span>
                    <button
                      type="button"
                      onClick={() => setPendingMedia(null)}
                      className="rounded-lg p-1 text-orange-700 hover:bg-orange-100"
                      aria-label={t("removeAttachment")}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="application/pdf,image/jpeg,image/png,image/webp,image/gif"
                  className="hidden"
                  onChange={handleFileSelect}
                />
                <div className={cn("flex items-end gap-2", isRTL && "flex-row-reverse")}>
                  <button
                    type="button"
                    title={soundsOn ? t("soundsOff") : t("soundsOn")}
                    onClick={() => {
                      unlockChatSounds();
                      const next = !soundsOn;
                      setSoundsOn(next);
                      setChatSoundsEnabled(next);
                      if (next) playSendSound();
                    }}
                    className={cn(
                      "flex h-12 w-10 shrink-0 items-center justify-center rounded-2xl border-2 transition",
                      soundsOn
                        ? "border-orange-200 bg-orange-50 text-orange-600"
                        : "border-slate-100 bg-slate-50 text-slate-400"
                    )}
                  >
                    {soundsOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                  <button
                    type="button"
                    title={t("attach")}
                    disabled={uploading || sending}
                    onClick={() => fileInputRef.current?.click()}
                    className={cn(
                      "flex h-12 w-10 shrink-0 items-center justify-center rounded-2xl border-2 transition",
                      uploading
                        ? "border-orange-200 bg-orange-50 text-orange-600"
                        : "border-slate-100 bg-slate-50 text-slate-500 hover:border-orange-200 hover:text-orange-600"
                    )}
                  >
                    {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                  </button>
                  <textarea
                    ref={inputRef}
                    value={draft}
                    onChange={(e) => setDraft(e.target.value)}
                    onFocus={() => unlockChatSounds()}
                    onKeyDown={(e) => {
                      if (e.key === "Enter" && !e.shiftKey) {
                        e.preventDefault();
                        sendMessage();
                      }
                    }}
                    rows={1}
                    placeholder={t("placeholder")}
                    className={cn(
                      "max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl border-2 border-slate-100 bg-slate-50 px-4 py-3 text-sm font-medium text-slate-800 outline-none focus:border-orange-400",
                      isRTL && "font-lateef text-right"
                    )}
                  />
                  <button
                    type="button"
                    onClick={sendMessage}
                    disabled={(!draft.trim() && !pendingMedia) || sending || uploading}
                    className={cn(
                      "flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl text-white shadow-lg transition hover:opacity-90 disabled:opacity-40",
                      accent.primary
                    )}
                  >
                    {sending ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className={cn("h-5 w-5", isRTL && "rotate-180")} />}
                  </button>
                </div>
              </>
            )}
          </footer>
        </>
      )}
    </main>
  );

  return (
    <div
      dir={isRTL ? "rtl" : "ltr"}
      className="flex-1 h-[calc(100dvh-64px)] flex overflow-hidden font-cairo bg-gradient-to-br from-slate-50 via-white to-orange-50/30"
    >
      {sidebar}
      {chatPanel}
      <ChannelHelpModal open={showHelp} onClose={() => setShowHelp(false)} isRTL={isRTL} />
      <MediaModerationPanel open={showModeration} onClose={() => setShowModeration(false)} isRTL={isRTL} />
    </div>
  );
}

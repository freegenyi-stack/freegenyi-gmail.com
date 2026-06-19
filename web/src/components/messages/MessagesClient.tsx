"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import { Link } from "@/i18n/routing";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  Building2,
  Check,
  CheckCheck,
  FileText,
  GraduationCap,
  HelpCircle,
  Image as ImageIcon,
  Loader2,
  Megaphone,
  MessageSquare,
  Mic,
  Music,
  Paperclip,
  Pencil,
  Search,
  Pin,
  Send,
  ShieldCheck,
  Smile,
  Trash2,
  User,
  Users,
  BellOff,
  Video,
  Volume2,
  VolumeX,
  X,
  MoreHorizontal,
} from "lucide-react";
import type {
  ChatMessageDto,
  ChatMessageType,
  ChatUserPreview,
  ConversationPreview,
  MessageSuggestionDto,
} from "@/lib/messaging/types";
import { type ChannelSection } from "@/lib/messaging/channel-catalog";
import {
  isChatSoundsEnabled,
  playReceiveSound,
  playSendSound,
  setChatSoundsEnabled,
  unlockChatSounds,
} from "@/lib/messaging/chat-sounds";
import { cn } from "@/lib/utils";
import { useIsMobileLayout } from "@/hooks/useMediaQuery";
import ChannelHelpModal from "@/components/messages/ChannelHelpModal";
import MediaModerationPanel from "@/components/messages/MediaModerationPanel";
import TeacherProfileLink from "@/components/teacher/TeacherProfileLink";
import ChatEmojiPicker from "@/components/messages/ChatEmojiPicker";
import ChatMediaPlayer from "@/components/messages/ChatMediaPlayer";
import ChatMediaViewer from "@/components/messages/ChatMediaViewer";
import ChatMessageActionSheet from "@/components/messages/ChatMessageActionSheet";
import MediaCaptionModal from "@/components/messages/MediaCaptionModal";
import ForwardPickerModal from "@/components/messages/ForwardPickerModal";
import SuggestionProfileModal from "@/components/messages/SuggestionProfileModal";
import type { ProfileData } from "@/components/messages/SuggestionProfileModal";
import VideoRecordModal from "@/components/messages/VideoRecordModal";
import { chatMediaApiUrl } from "@/lib/messaging/media-url";
import { resolveMessagingError } from "@/lib/messaging/chat-ui-errors";
import { defaultMediaLabel, displayMediaLabel } from "@/lib/messaging/media-labels";
import { twemojiUrl } from "@/lib/messaging/twemoji";
import { formatLastSeen, replyQuoteText } from "@/lib/messaging/chat-ui-utils";
import { bindLongPress, chatMobileClasses } from "@/lib/messaging/chat-mobile";
import {
  getPushPermission,
  isPushConfiguredClient,
  isPushSupported,
  registerPushNotifications,
} from "@/lib/messaging/push-client";
import FeatureSoonModal from "@/components/FeatureSoonModal";
import {
  CHANNEL_SECTION_PRIORITY,
  getTabThemes,
  channelDescKey,
  safeMessageKey,
  sectionShortKey,
  type MessageListTab,
  type TabTheme,
} from "@/components/messages/messaging-ui-helpers";

const DASH_BY_ROLE: Record<string, string> = {
  parent: "parent",
  coparent: "parent",
  enseignant: "enseignant",
  ecole: "ecole",
  ong: "ong",
};

const ROLE_ACCENT: Record<
  string,
  { primary: string; light: string; ring: string; focusRing: string; text: string; hover: string; spinner: string }
> = {
  parent: {
    primary: "bg-orange-600",
    light: "bg-orange-50",
    ring: "ring-orange-200",
    focusRing: "focus:ring-orange-200/60",
    text: "text-orange-600",
    hover: "hover:bg-orange-50",
    spinner: "text-orange-600",
  },
  enseignant: {
    primary: "bg-teal-600",
    light: "bg-teal-50",
    ring: "ring-teal-200",
    focusRing: "focus:ring-teal-200/60",
    text: "text-teal-600",
    hover: "hover:bg-teal-50",
    spinner: "text-teal-600",
  },
  ecole: {
    primary: "bg-indigo-600",
    light: "bg-indigo-50",
    ring: "ring-indigo-200",
    focusRing: "focus:ring-indigo-200/60",
    text: "text-indigo-600",
    hover: "hover:bg-indigo-50",
    spinner: "text-indigo-600",
  },
  ong: {
    primary: "bg-amber-600",
    light: "bg-amber-50",
    ring: "ring-amber-200",
    focusRing: "focus:ring-amber-200/60",
    text: "text-amber-600",
    hover: "hover:bg-amber-50",
    spinner: "text-amber-600",
  },
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

/** Date dans la liste des conversations — style WhatsApp */
function formatListDate(iso: string, locale: string, t: (k: string) => string) {
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "";
  const now = new Date();
  const startToday = new Date(now.getFullYear(), now.getMonth(), now.getDate()).getTime();
  const startMsg = new Date(d.getFullYear(), d.getMonth(), d.getDate()).getTime();
  const dayDiff = Math.round((startToday - startMsg) / 86400000);
  const loc = locale.startsWith("ar") ? "ar-DZ" : locale.startsWith("fr") ? "fr-FR" : "en-GB";

  if (dayDiff === 0) return formatTime(iso, locale);
  if (dayDiff === 1) return t("yesterday");
  if (dayDiff < 7) return d.toLocaleDateString(loc, { weekday: "short" });
  if (d.getFullYear() === now.getFullYear()) {
    return d.toLocaleDateString(loc, { day: "2-digit", month: "2-digit" });
  }
  return d.toLocaleDateString(loc, { day: "2-digit", month: "2-digit", year: "2-digit" });
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
    return safeMessageKey(t, conv.channelMeta.labelKey, t("channelDefault"));
  }
  if (conv.otherUser) return displayUserName(conv.otherUser, isRTL);
  return "…";
}

function convPreview(conv: ConversationPreview, t: (k: string) => string) {
  const msg = conv.lastMessage;
  if (!msg) {
    return conv.type === "channel" ? t("emptySalonHint") : t("noMessageYet");
  }
  let body = msg.content;
  if (msg.messageType === "image") body = msg.content?.trim() || t("previewImage");
  else if (msg.messageType === "video") body = msg.content?.trim() || t("previewVideo");
  else if (msg.messageType === "voice") body = msg.content?.trim() || t("previewVoice");
  else if (msg.messageType === "audio") body = msg.content?.trim() || t("previewAudio");
  else if (msg.messageType === "file") body = msg.content?.trim() || t("previewFile");
  if (!body?.trim() && !msg.mediaUrl) {
    return conv.type === "channel" ? t("emptySalonHint") : t("noMessageYet");
  }
  if (conv.type === "channel") {
    const prefix = msg.isMine ? t("youPrefix") : msg.senderName || "…";
    return `${prefix}: ${body}`;
  }
  return body;
}

function channelSubtitle(conv: ConversationPreview, t: (k: string) => string) {
  const labelKey = conv.channelMeta?.labelKey;
  if (!labelKey) return t("channelRoomHint");
  return safeMessageKey(t, channelDescKey(labelKey), t("channelRoomHint"));
}

function mediaLabel(content: string, mediaUrl: string | null | undefined, messageType: string | null | undefined, locale: string) {
  return displayMediaLabel(content, messageType, mediaUrl, locale);
}

function displayUserName(
  u: { fullName: string | null; username: string | null } | null | undefined,
  isRTL: boolean
) {
  if (!u) return "…";
  const name = u.fullName?.trim() || u.username || "?";
  return isRTL ? name : name;
}

function roleLabelShort(role: string | null, t: (k: string) => string) {
  if (role === "enseignant") return t("roleTeacher");
  if (role === "ecole") return t("roleSchool");
  if (role === "ong") return t("roleNgo");
  if (role === "parent" || role === "coparent") return t("roleParent");
  return t("roleMember");
}

function chatHeaderTitle(
  activeChannel: { labelKey: string } | null,
  activeConv: ConversationPreview | undefined,
  t: (k: string) => string,
  isRTL: boolean
) {
  if (activeChannel) return safeMessageKey(t, activeChannel.labelKey, t("channelDefault"));
  if (activeConv?.otherUser) return displayUserName(activeConv.otherUser, isRTL);
  if (activeConv?.type === "channel" && activeConv.channelMeta) {
    return safeMessageKey(t, activeConv.channelMeta.labelKey, t("channelDefault"));
  }
  return "…";
}

function ConversationRow({
  conv,
  activeId,
  accent,
  isRTL,
  locale,
  t,
  rowTheme,
  onOpen,
}: {
  conv: ConversationPreview;
  activeId: number | null;
  accent: { ring: string; light: string; primary: string };
  rowTheme: TabTheme;
  isRTL: boolean;
  locale: string;
  t: (k: string) => string;
  onOpen: (id: number) => void;
}) {
  const isChannel = conv.type === "channel";
  const section = (conv.channelMeta?.section || "direct") as ChannelSection;
  const isActive = activeId === conv.id;
  const preview = convPreview(conv, t);
  const isEmpty = preview === t("noMessageYet") || preview === t("emptySalonHint");

  return (
    <button
      type="button"
      onClick={() => onOpen(conv.id)}
      className={cn(
        "group relative flex w-full items-center gap-3 border-b border-[#e9edef] bg-white px-3 py-3 text-start transition-colors hover:bg-[#f5f6f6]",
        isActive && "bg-[#f0f2f5]",
        isRTL && "flex-row-reverse text-right",
        isActive && rowTheme.activeRow
      )}
    >
      <div className="relative shrink-0">
        <div
          className={cn(
            "flex h-12 w-12 items-center justify-center rounded-full text-sm font-black shadow-sm",
            isChannel
              ? isActive
                ? cn("text-white", accent.primary)
                : "bg-slate-100 text-slate-600"
              : isActive
                ? cn("text-white", accent.primary)
                : "bg-gradient-to-br from-slate-100 to-slate-200 text-slate-700"
          )}
        >
          {isChannel ? (
            SECTION_ICONS[section] || <MessageSquare className="h-5 w-5" />
          ) : (
            (conv.otherUser?.fullName || conv.otherUser?.username || "?")[0]?.toUpperCase()
          )}
        </div>
        {!isChannel && conv.otherUser?.isOnline && (
          <span className="absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
        )}
      </div>

      <div className="min-w-0 flex-1">
        <div className={cn("mb-0.5 flex items-baseline justify-between gap-2", isRTL && "flex-row-reverse")}>
          <p className={cn("truncate text-[15px] font-semibold text-slate-900", isRTL && "font-ui-ar")}>
            {convTitle(conv, t, isRTL)}
          </p>
          {conv.lastMessage && (
            <span className="shrink-0 text-[11px] font-normal text-[#667781]">
              {formatListDate(conv.lastMessage.createdAt, locale, t)}
            </span>
          )}
        </div>

        {isChannel && (
          <p className={cn("mb-1 truncate text-[11px] font-medium text-slate-400", isRTL && "font-lateef")}>
            {channelSubtitle(conv, t)}
          </p>
        )}

        <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <p
            className={cn(
              "min-w-0 flex-1 truncate text-[13px] leading-snug",
              isEmpty ? "italic text-slate-400" : "text-slate-500",
              isRTL && "font-lateef"
            )}
          >
            {preview}
          </p>
          {isChannel && (
            <span className="shrink-0 rounded-md bg-slate-100 px-1.5 py-0.5 text-[9px] font-bold uppercase tracking-wide text-slate-500">
              {t(sectionShortKey(section))}
            </span>
          )}
        </div>
      </div>

      <div className={cn("flex shrink-0 flex-col items-end gap-1", isRTL && "items-start")}>
        {conv.unreadCount > 0 && (
          <span className={cn("flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[10px] font-bold text-white shadow-sm", accent.primary)}>
            {conv.unreadCount > 9 ? "9+" : conv.unreadCount}
          </span>
        )}
        {conv.muted && <BellOff className="h-4 w-4 text-slate-400" aria-label={t("muted")} />}
      </div>
    </button>
  );
}

export default function MessagesClient({ role }: Props) {
  const t = useTranslations("Messages");
  const locale = useLocale();
  const searchParams = useSearchParams();
  const boostChildName = searchParams.get("childName");
  const boostChildId = searchParams.get("childId");
  const isChildBoost = searchParams.get("boost") === "1" && !!boostChildName;
  const isGenyBoost = searchParams.get("geny") === "1" || isChildBoost;
  const isRTL = locale === "ar" || locale.endsWith("-ar");
  const isMobile = useIsMobileLayout();
  const accent = ROLE_ACCENT[role] || ROLE_ACCENT.parent;
  const tabThemes = useMemo(() => getTabThemes(role), [role]);

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
  const [listTab, setListTab] = useState<MessageListTab>("private");
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
    messageType: ChatMessageType;
    fileName: string;
    defaultLabel: string;
  } | null>(null);
  const [attachMenuOpen, setAttachMenuOpen] = useState(false);
  const [emojiOpen, setEmojiOpen] = useState(false);
  const [videoRecordOpen, setVideoRecordOpen] = useState(false);
  const [showVideoCallSoon, setShowVideoCallSoon] = useState(false);
  const [recording, setRecording] = useState(false);
  const [recordingSec, setRecordingSec] = useState(0);
  const [muted, setMuted] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [showModeration, setShowModeration] = useState(false);
  const [hasMoreOlder, setHasMoreOlder] = useState(true);
  const [loadingOlder, setLoadingOlder] = useState(false);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editDraft, setEditDraft] = useState("");
  const [profileUserId, setProfileUserId] = useState<number | null>(null);
  const [docViewer, setDocViewer] = useState<{
    url: string;
    fileName: string;
    messageType?: ChatMessageType;
    messageId?: number;
    isMine?: boolean;
  } | null>(null);
  const [actionMsg, setActionMsg] = useState<ChatMessageDto | null>(null);
  const [replyTo, setReplyTo] = useState<ChatMessageDto | null>(null);
  const [pinnedMessages, setPinnedMessages] = useState<ChatMessageDto[]>([]);
  const [activePartnerUser, setActivePartnerUser] = useState<ChatUserPreview | null>(null);
  const [chatSearchOpen, setChatSearchOpen] = useState(false);
  const [chatSearchQuery, setChatSearchQuery] = useState("");
  const [chatSearchResults, setChatSearchResults] = useState<ChatMessageDto[]>([]);
  const [chatSearchLoading, setChatSearchLoading] = useState(false);
  const [showPushBanner, setShowPushBanner] = useState(false);
  const [forwardOpen, setForwardOpen] = useState(false);
  const [mediaCaptionPrompt, setMediaCaptionPrompt] = useState<{
    url: string;
    messageType: ChatMessageType;
    fileName: string;
    defaultLabel: string;
  } | null>(null);
  const [peopleSearch, setPeopleSearch] = useState<ProfileData[]>([]);
  const [peopleSearchLoading, setPeopleSearchLoading] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const imageInputRef = useRef<HTMLInputElement>(null);
  const videoInputRef = useRef<HTMLInputElement>(null);
  const audioInputRef = useRef<HTMLInputElement>(null);
  const attachMenuRef = useRef<HTMLDivElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const recordChunksRef = useRef<Blob[]>([]);
  const recordTimerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const deepLinkHandled = useRef(false);
  const boostDeepLinkHandled = useRef(false);
  const voiceIntentRef = useRef(false);
  const typingPingRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const lastMsgIdRef = useRef(0);

  const activeConv = conversations.find((c) => c.id === activeId);

  const chatErr = useCallback(
    (data: { error?: string; code?: string }, fallback = "errorGeneric") =>
      resolveMessagingError(data, t, fallback),
    [t]
  );

  const dashPath = DASH_BY_ROLE[role] || "parent";
  const subtitleKey =
    role === "enseignant" ? "subtitleTeacher" : role === "ecole" ? "subtitleSchool" : role === "ong" ? "subtitleNgo" : "subtitleParent";
  const backLabelKey =
    role === "enseignant" ? "backTeacher" : role === "ecole" ? "backSchool" : role === "ong" ? "backNgo" : "backParent";

  useEffect(() => {
    setSoundsOn(isChatSoundsEnabled());
  }, []);

  useEffect(() => {
    if (!attachMenuOpen && !emojiOpen) return;
    const onDocClick = (e: MouseEvent) => {
      const t = e.target as Node;
      if (attachMenuOpen && attachMenuRef.current && !attachMenuRef.current.contains(t)) {
        setAttachMenuOpen(false);
      }
      if (emojiOpen && emojiRef.current && !emojiRef.current.contains(t)) {
        setEmojiOpen(false);
      }
    };
    document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [attachMenuOpen, emojiOpen]);

  useEffect(() => {
    return () => {
      if (recordTimerRef.current) clearInterval(recordTimerRef.current);
      recorderRef.current?.stream?.getTracks().forEach((t) => t.stop());
    };
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
        if (!res.ok) throw new Error(chatErr(data));
        setMessages(data.messages || []);
        setPinnedMessages(data.pinned || []);
        setHasMoreOlder((data.messages || []).length >= 50);
        const latest = (data.messages || []).slice(-1)[0];
        lastMsgIdRef.current = latest?.id && latest.id > 0 ? latest.id : 0;
        const partner = data.partner;
        setMuted(!!partner?.muted);
        if (partner?.kind === "channel") {
          setListTab("salons");
          setActiveChannel({ labelKey: partner.labelKey, section: partner.section });
          setPartnerRole("parent");
          setCanPost(partner.canPost !== false);
          setAllowBroadcast(!!partner.allowBroadcast);
          setBroadcastMode(false);
          setActivePartnerUser(null);
        } else {
          setListTab("private");
          setActiveChannel(null);
          setPartnerRole(partner?.user?.role || "parent");
          setCanPost(true);
          setAllowBroadcast(false);
          setBroadcastMode(false);
          setActivePartnerUser(partner?.user ?? null);
        }
        setPendingMedia(null);
        setConversations((prev) =>
          prev.map((c) => (c.id === conversationId ? { ...c, unreadCount: 0 } : c))
        );
        window.dispatchEvent(new CustomEvent("fg-notifications-updated"));
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errorGeneric"));
      } finally {
        setLoadingChat(false);
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 50);
      }
    },
    [isMobile, t]
  );

  const acceptSuggestion = async (targetUserId: number) => {
    setSuggestions((prev) => prev.filter((s) => s.targetUser.id !== targetUserId));
    await fetch("/api/chat/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId }),
    });
    await startWithUser(targetUserId);
  };

  const reactToMessage = async (messageId: number, emoji: string) => {
    if (!activeId) return;
    const res = await fetch(`/api/chat/conversations/${activeId}/messages/${messageId}/reactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ emoji }),
    });
    const data = await res.json();
    if (res.ok && data.reactions) {
      setMessages((prev) =>
        prev.map((m) => (m.id === messageId ? { ...m, reactions: data.reactions } : m))
      );
      setActionMsg((prev) => (prev?.id === messageId ? { ...prev, reactions: data.reactions } : prev));
    }
  };

  const reportMessage = async (messageId: number) => {
    if (!activeId) return;
    const res = await fetch(`/api/chat/conversations/${activeId}/messages/${messageId}/report`, {
      method: "POST",
    });
    const data = await res.json();
    if (!res.ok) {
      setError(chatErr(data));
      return;
    }
    setActionMsg(null);
    setError(t("messageReported"));
    setTimeout(() => setError(null), 2500);
  };

  const forwardMessageTo = async (targetConversationId: number) => {
    if (!activeId || !actionMsg) return;
    setForwardOpen(false);
    const res = await fetch(`/api/chat/conversations/${activeId}/messages/forward`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messageId: actionMsg.id,
        targetConversationId,
        locale,
      }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(chatErr(data, "errorSend"));
      return;
    }
    setActionMsg(null);
    setError(t("forwardDone"));
    setTimeout(() => setError(null), 2500);
  };

  const startWithUser = useCallback(
    async (targetUserId: number) => {
      setError(null);
      setListTab("private");
      if (isMobile) setMobileView("list");
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
        if (!res.ok) throw new Error(chatErr(data));
        await fetchList();
        await openConversation(data.conversationId);
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errorGeneric"));
      }
    },
    [conversations, fetchList, openConversation, t, isMobile]
  );

  const dismissSuggestion = async (id: number) => {
    setSuggestions((prev) => prev.filter((s) => s.id !== id));
    const res = await fetch("/api/chat/suggestions", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ suggestionId: id }),
    });
    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(chatErr(data));
      void fetchList();
    }
  };

  const openProfile = (userId: number) => setProfileUserId(userId);

  const sendContactInvite = async (targetUserId: number) => {
    const res = await fetch("/api/chat/users/invite", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ targetUserId, locale }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(chatErr(data));
    setError(t("inviteSent"));
    setTimeout(() => setError(null), 3000);
  };

  const openDocument = (
    mediaUrl: string,
    content: string,
    messageType?: ChatMessageType,
    meta?: { messageId?: number; isMine?: boolean }
  ) => {
    setDocViewer({
      url: mediaUrl,
      fileName: mediaLabel(content, mediaUrl, messageType, locale),
      messageType,
      messageId: meta?.messageId,
      isMine: meta?.isMine,
    });
  };

  const openMessageActions = (msg: ChatMessageDto) => {
    if (msg.id <= 0) return;
    setActionMsg(msg);
  };

  const messagePreview = useCallback(
    (m: ChatMessageDto) => {
      if (m.mediaUrl) return mediaLabel(m.content, m.mediaUrl, m.messageType, locale);
      const text = m.content.trim();
      return text.length > 80 ? `${text.slice(0, 80)}…` : text;
    },
    [locale]
  );

  const scrollToMessage = (messageId: number) => {
    document.getElementById(`msg-${messageId}`)?.scrollIntoView({ behavior: "smooth", block: "center" });
    setChatSearchOpen(false);
  };

  const togglePinMessage = async (msg: ChatMessageDto) => {
    if (!activeId) return;
    const pin = !msg.pinnedAt;
    const res = await fetch(`/api/chat/conversations/${activeId}/messages/${msg.id}/pin`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ pin }),
    });
    const data = await res.json();
    if (!res.ok) {
      setError(chatErr(data));
      return;
    }
    const now = pin ? new Date().toISOString() : null;
    setMessages((prev) => prev.map((m) => (m.id === msg.id ? { ...m, pinnedAt: now } : m)));
    setPinnedMessages((prev) => {
      if (!pin) return prev.filter((p) => p.id !== msg.id);
      const next = [{ ...msg, pinnedAt: now }, ...prev.filter((p) => p.id !== msg.id)];
      return next.slice(0, 3);
    });
    setActionMsg((prev) => (prev?.id === msg.id ? { ...prev, pinnedAt: now } : prev));
    setActionMsg(null);
  };

  useEffect(() => {
    setDocViewer(null);
    setActionMsg(null);
    setReplyTo(null);
    setChatSearchOpen(false);
    setChatSearchQuery("");
  }, [activeId]);

  useEffect(() => {
    if (!activeId) return;
    void fetch("/api/chat/presence", { method: "POST" });
    const iv = setInterval(() => void fetch("/api/chat/presence", { method: "POST" }), 60_000);
    return () => clearInterval(iv);
  }, [activeId]);

  useEffect(() => {
    if (!chatSearchOpen || !activeId || chatSearchQuery.trim().length < 2) {
      setChatSearchResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setChatSearchLoading(true);
      try {
        const res = await fetch(
          `/api/chat/conversations/${activeId}/messages/search?q=${encodeURIComponent(chatSearchQuery.trim())}`
        );
        const data = await res.json();
        setChatSearchResults(data.results || []);
      } finally {
        setChatSearchLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [chatSearchOpen, chatSearchQuery, activeId]);

  useEffect(() => {
    if (!isPushSupported() || !isPushConfiguredClient()) {
      setShowPushBanner(false);
      return;
    }
    setShowPushBanner(getPushPermission() !== "granted");
  }, []);

  const enablePushFromChat = async () => {
    const result = await registerPushNotifications();
    if (result.ok) setShowPushBanner(false);
    else if (result.reason === "denied") setShowPushBanner(false);
  };

  const appendServerMessages = useCallback((incoming: ChatMessageDto[]) => {
    if (incoming.length === 0) return;
    setMessages((prev) => {
      const map = new Map(prev.filter((m) => m.id > 0).map((m) => [m.id, m]));
      for (const msg of incoming) map.set(msg.id, msg);
      return [...map.values()].sort((a, b) => a.id - b.id);
    });
  }, []);

  const postMessage = useCallback(
    async (text: string, media?: { url: string; messageType: ChatMessageType; fileName: string }) => {
      if (!activeId || sending) return false;
      unlockChatSounds();
      setSending(true);
      setError(null);
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
            replyToMessageId: replyTo?.id,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(chatErr(data, "errorSend"));
        if (data.message?.id) {
          lastMsgIdRef.current = Math.max(lastMsgIdRef.current, data.message.id);
          appendServerMessages([data.message]);
        }
        setReplyTo(null);
        playSendSound();
        fetchList();
        setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" }), 30);
        return true;
      } catch (e) {
        setError(e instanceof Error ? e.message : t("errorSend"));
        return false;
      } finally {
        setSending(false);
        inputRef.current?.focus();
      }
    },
    [activeId, sending, locale, broadcastMode, allowBroadcast, t, appendServerMessages, fetchList, replyTo]
  );

  const sendMessage = async () => {
    if (!activeId || sending || uploading) return;
    const text = draft.trim();
    if (!text && !pendingMedia) return;
    const media = pendingMedia;
    setDraft("");
    setPendingMedia(null);
    setEmojiOpen(false);
    void fetch(`/api/chat/conversations/${activeId}/typing`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: false }),
    });
    const ok = await postMessage(text, media || undefined);
    if (!ok && !text && media) setPendingMedia(media);
    else if (!ok) setDraft(text);
  };

  const uploadMediaFile = useCallback(
    async (file: File, voice = false, autoSend = false) => {
      if (!activeId) return null;
      unlockChatSounds();
      setUploading(true);
      setError(null);
      setAttachMenuOpen(false);
      try {
        const form = new FormData();
        form.append("file", file);
        if (voice) form.append("voice", "true");
        const res = await fetch("/api/chat/upload", { method: "POST", body: form });
        const data = await res.json();
        if (!res.ok) throw new Error(chatErr(data, "errorUpload"));
        const saved = {
          url: data.url as string,
          messageType: data.messageType as ChatMessageType,
          fileName: data.fileName as string,
          defaultLabel: defaultMediaLabel(data.messageType as ChatMessageType, locale),
        };
        if (autoSend) {
          setMediaCaptionPrompt(saved);
        } else {
          setPendingMedia(saved);
          inputRef.current?.focus();
        }
        return saved;
      } catch (err) {
        setError(err instanceof Error ? err.message : t("errorUpload"));
        return null;
      } finally {
        setUploading(false);
      }
    },
    [activeId, t, postMessage, locale]
  );

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file || !activeId) return;
    await uploadMediaFile(file);
  };

  const stopRecording = async (send: boolean) => {
    const recorder = recorderRef.current;
    if (!recorder || recorder.state === "inactive") return;

    const mime = recorder.mimeType || "audio/webm";
    const chunks = [...recordChunksRef.current];

    await new Promise<void>((resolve) => {
      recorder.onstop = () => {
        recorder.stream.getTracks().forEach((tr) => tr.stop());
        resolve();
      };
      recorder.stop();
    });

    if (recordTimerRef.current) {
      clearInterval(recordTimerRef.current);
      recordTimerRef.current = null;
    }
    setRecording(false);
    setRecordingSec(0);
    recorderRef.current = null;
    recordChunksRef.current = [];

    if (send && chunks.length > 0) {
      const blob = new Blob(chunks, { type: mime });
      const ext = mime.includes("mp4") ? "m4a" : "webm";
      const file = new File([blob], `voice-${Date.now()}.${ext}`, { type: blob.type || mime || "audio/webm" });
      await uploadMediaFile(file, true, true);
    }
  };

  const toggleVoiceRecording = async () => {
    if (!activeId || uploading || sending) return;
    unlockChatSounds();
    if (recording) {
      void stopRecording(true);
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      const mime = MediaRecorder.isTypeSupported("audio/mp4")
        ? "audio/mp4"
        : MediaRecorder.isTypeSupported("audio/webm;codecs=opus")
          ? "audio/webm;codecs=opus"
          : MediaRecorder.isTypeSupported("audio/webm")
            ? "audio/webm"
            : "";
      const recorder = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      recordChunksRef.current = [];
      recorder.ondataavailable = (ev) => {
        if (ev.data.size > 0) recordChunksRef.current.push(ev.data);
      };
      recorder.start(200);
      recorderRef.current = recorder;
      setRecording(true);
      setRecordingSec(0);
      recordTimerRef.current = setInterval(() => setRecordingSec((s) => s + 1), 1000);
    } catch {
      setError(t("micPermissionDenied"));
    }
  };

  useEffect(() => {
    if (!voiceIntentRef.current || loadingChat || !activeId || !canPost || recording) return;
    voiceIntentRef.current = false;
    void toggleVoiceRecording();
  }, [loadingChat, activeId, canPost, recording]);

  const handleVideoRecorded = async (file: File) => {
    await uploadMediaFile(file, false, true);
  };

  useEffect(() => {
    if (activeId) unlockChatSounds();
  }, [activeId]);

  useEffect(() => {
    fetchList();
  }, [fetchList]);

  useEffect(() => {
    if (listTab !== "suggestions" || search.trim().length < 2) {
      setPeopleSearch([]);
      return;
    }
    let cancelled = false;
    const timer = setTimeout(async () => {
      setPeopleSearchLoading(true);
      try {
        const res = await fetch(`/api/chat/users/search?q=${encodeURIComponent(search.trim())}`);
        const data = await res.json();
        if (!cancelled) setPeopleSearch(data.results || []);
      } catch {
        if (!cancelled) setPeopleSearch([]);
      } finally {
        if (!cancelled) setPeopleSearchLoading(false);
      }
    }, 350);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [listTab, search]);

  useEffect(() => {
    const c = searchParams.get("c");
    const u = searchParams.get("u");
    if (searchParams.get("voice") === "1") voiceIntentRef.current = true;
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
    if (!isChildBoost || !boostChildName) return;
    const template = isRTL
      ? `يا ${boostChildName}، أنا فخور بك! 💛`
      : `Mon champion ${boostChildName}, je suis fier(e) de toi ! 💛`;
    setDraft((prev) => (prev.trim() ? prev : template));
  }, [isChildBoost, boostChildName, isRTL]);

  useEffect(() => {
    if (loadingList || boostDeepLinkHandled.current) return;
    if (!isChildBoost || searchParams.get("voice") !== "1") return;
    if (searchParams.get("u")) {
      boostDeepLinkHandled.current = true;
      return;
    }

    boostDeepLinkHandled.current = true;

    const openBoostChat = async () => {
      const u = searchParams.get("u");
      if (u) {
        const targetId = parseInt(u, 10);
        if (!Number.isNaN(targetId)) {
          voiceIntentRef.current = true;
          await startWithUser(targetId);
          if (isMobile) setMobileView("chat");
          return;
        }
      }

      try {
        const res = await fetch("/api/parent/boost-voice-context");
        const data = await res.json();
        if (data.partnerUserId) {
          voiceIntentRef.current = true;
          await startWithUser(data.partnerUserId);
          if (isMobile) setMobileView("chat");
          return;
        }
      } catch {
        /* fallback below */
      }

      const ally = suggestions.find((s) => s.reasonKey === "family_ally");
      if (ally?.targetUser?.id) {
        voiceIntentRef.current = true;
        await acceptSuggestion(ally.targetUser.id);
        if (isMobile) setMobileView("chat");
        return;
      }

      const firstPrivate = conversations.find((c) => c.type !== "channel");
      if (firstPrivate) {
        voiceIntentRef.current = true;
        await openConversation(firstPrivate.id);
        if (isMobile) setMobileView("chat");
      }
    };

    void openBoostChat();
  }, [
    loadingList,
    isChildBoost,
    searchParams,
    startWithUser,
    acceptSuggestion,
    openConversation,
    conversations,
    suggestions,
    isMobile,
  ]);

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
            const incoming = data.messages as ChatMessageDto[];
            const newOnes = incoming.filter((m) => m.id > lastMsgIdRef.current);
            if (newOnes.length > 0) {
              const latest = newOnes[newOnes.length - 1];
              if (!latest.isMine) playReceiveSound();
              lastMsgIdRef.current = latest.id;
              appendServerMessages(newOnes);
              fetchList();
              setTimeout(() => scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight }), 30);
            }
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
  }, [activeId, fetchList, appendServerMessages]);

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
      if (!res.ok) throw new Error(chatErr(data));
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
      setError(chatErr(data));
    }
  };

  const handleDeleteMessage = async (messageId: number) => {
    if (!activeId || !window.confirm(t("confirmDelete"))) return;
    const res = await fetch(`/api/chat/conversations/${activeId}/messages/${messageId}`, { method: "DELETE" });
    if (res.ok) {
      setMessages((prev) => prev.filter((m) => m.id !== messageId));
    } else {
      const data = await res.json();
      setError(chatErr(data, "errorSend"));
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
      setError(chatErr(data, "errorSend"));
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
  const channelConversations = filtered
    .filter((c) => c.type === "channel")
    .sort((a, b) => {
      const sa = (a.channelMeta?.section || "direct") as ChannelSection;
      const sb = (b.channelMeta?.section || "direct") as ChannelSection;
      const pa = CHANNEL_SECTION_PRIORITY[sa] ?? 99;
      const pb = CHANNEL_SECTION_PRIORITY[sb] ?? 99;
      if (pa !== pb) return pa - pb;
      if (b.unreadCount !== a.unreadCount) return b.unreadCount - a.unreadCount;
      return convTitle(a, t, isRTL).localeCompare(convTitle(b, t, isRTL), isRTL ? "ar" : "fr");
    });

  const filteredSuggestions = suggestions.filter((s) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    const name = (s.targetUser.fullName || s.targetUser.username || "").toLowerCase();
    return name.includes(q) || s.reasonLabel.toLowerCase().includes(q);
  });

  const listTabs: { id: MessageListTab; label: string; count: number }[] = [
    { id: "private", label: t("tabPrivate"), count: directConversations.length },
    { id: "salons", label: t("tabSalons"), count: channelConversations.length },
    { id: "suggestions", label: t("tabSuggestions"), count: filteredSuggestions.length },
  ];

  const currentTabTheme = tabThemes[listTab];
  const chatTheme = activeChannel ? tabThemes.salons : tabThemes.private;

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
        "fg-glass-panel relative z-10 flex h-full min-h-0 shrink-0 flex-col border-e border-white/40",
        isMobile ? (mobileView === "list" ? "w-full flex-1" : "hidden") : "w-[min(100%,22rem)] lg:w-96"
      )}
    >
      <div className="fg-glass-bar shrink-0 border-b px-3 py-3 sm:px-4">
        <div className={cn("mb-3 flex items-center gap-2", isRTL && "flex-row-reverse")}>
          <Link
            href={`/dashboard/${dashPath}`}
            className={cn(
              "inline-flex items-center gap-1.5 rounded-xl px-2.5 py-2 text-xs font-semibold text-slate-600 transition fg-glass-surface hover:bg-white/45",
              isRTL && "flex-row-reverse font-ui-ar"
            )}
          >
            {isRTL ? <ArrowLeft className="h-4 w-4 rotate-180" /> : <ArrowLeft className="h-4 w-4" />}
            <span className="max-w-[8rem] truncate sm:max-w-none">{t(backLabelKey)}</span>
          </Link>
          <div className={cn("min-w-0 flex-1", isRTL ? "text-right" : "text-left")}>
            <h1 className={cn("truncate text-lg font-bold text-slate-900", isRTL && "font-ui-ar")}>{t("title")}</h1>
            <p className={cn("truncate text-xs text-slate-500", isRTL && "font-lateef")}>{t(subtitleKey)}</p>
          </div>
          <button
            type="button"
            onClick={() => setShowHelp(true)}
            className="fg-glass-icon shrink-0 !rounded-xl p-2"
            title={t("helpTitle")}
          >
            <HelpCircle className="h-5 w-5" />
          </button>
        </div>

        <div className="relative">
          <Search className={cn("absolute top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400", isRTL ? "end-3" : "start-3")} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={listTab === "suggestions" ? t("searchUserHint") : t("searchUser")}
            className={cn(
              "fg-glass-input w-full rounded-xl py-2.5 text-sm font-medium text-slate-800 outline-none transition focus:ring-2",
              accent.focusRing,
              isRTL ? "pe-10 ps-3 text-right font-ui-ar" : "ps-10 pe-3"
            )}
          />
        </div>

        {isChildBoost && (
          <div
            className={cn(
              "mt-3 rounded-xl border px-3 py-3",
              isGenyBoost
                ? "border-orange-200 bg-gradient-to-r from-orange-50 via-amber-50 to-teal-50"
                : "border-orange-200 bg-gradient-to-r from-orange-50 to-amber-50",
              isRTL && "text-right font-ui-ar"
            )}
          >
            <p className="text-[11px] font-black uppercase tracking-widest text-orange-700">
              {isGenyBoost ? t("childBoostGenyBadge") : t("childBoostBadge")}
            </p>
            <p className="mt-1 text-xs font-semibold text-orange-900">
              {t("childBoostHint", { name: boostChildName ?? "" })}
            </p>
            <p className="mt-1 text-[10px] text-orange-700/80">
              {searchParams.get("voice") === "1" ? t("childBoostVoiceAutoHint") : t("childBoostVoiceHint")}
            </p>
          </div>
        )}

        {showPushBanner && (
          <div
            className={cn(
              "mt-3 flex items-center gap-2 rounded-xl border border-violet-200 bg-violet-50 px-3 py-2",
              isRTL && "flex-row-reverse font-ui-ar"
            )}
          >
            <p className="min-w-0 flex-1 text-[11px] font-semibold text-violet-900">{t("pushChatHint")}</p>
            <button
              type="button"
              onClick={() => void enablePushFromChat()}
              className="shrink-0 rounded-lg bg-violet-600 px-2.5 py-1 text-[10px] font-bold text-white hover:bg-violet-700"
            >
              {t("enablePush")}
            </button>
          </div>
        )}

        <div className={cn("mt-3 flex border-b border-[#e9edef]", isRTL && "flex-row-reverse")}>
          {listTabs.map((tab) => {
            const theme = tabThemes[tab.id];
            const active = listTab === tab.id;
            return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                setListTab(tab.id);
                if (isMobile) setMobileView("list");
              }}
              className={cn(
                "relative flex min-w-0 flex-1 flex-col items-center gap-1 px-2 py-2.5 text-xs font-semibold transition",
                active ? theme.accentText : "text-[#667781] hover:text-[#111b21]"
              )}
            >
              <span className="truncate">{tab.label}</span>
              {tab.count > 0 && (
                <span
                  className={cn(
                    "rounded-full px-1.5 py-0.5 text-[10px] font-bold",
                    active ? cn(theme.badge, theme.badgeText) : "bg-[#e9edef] text-[#667781]"
                  )}
                >
                  {tab.count}
                </span>
              )}
              {active && (
                <span className={cn("absolute inset-x-2 bottom-0 h-0.5 rounded-full", theme.accent)} />
              )}
            </button>
            );
          })}
        </div>
      </div>

      <div className="min-h-0 flex-1 overflow-y-auto">
        {loadingList ? (
          <div className="flex justify-center py-12">
            <Loader2 className={cn("h-6 w-6 animate-spin", accent.spinner)} />
          </div>
        ) : listTab === "private" ? (
          directConversations.length === 0 ? (
            <p className={cn("px-4 py-10 text-center text-sm text-slate-400", isRTL && "font-ui-ar")}>{t("noUsersFound")}</p>
          ) : (
            <div>
              {directConversations.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conv={conv}
                  activeId={activeId}
                  accent={accent}
                  rowTheme={tabThemes.private}
                  isRTL={isRTL}
                  locale={locale}
                  t={t}
                  onOpen={openConversation}
                />
              ))}
            </div>
          )
        ) : listTab === "salons" ? (
          channelConversations.length === 0 ? (
            <p className={cn("px-4 py-10 text-center text-sm text-slate-400", isRTL && "font-ui-ar")}>{t("noRooms")}</p>
          ) : (
            <div>
              {channelConversations.map((conv) => (
                <ConversationRow
                  key={conv.id}
                  conv={conv}
                  activeId={activeId}
                  accent={accent}
                  rowTheme={tabThemes.salons}
                  isRTL={isRTL}
                  locale={locale}
                  t={t}
                  onOpen={openConversation}
                />
              ))}
            </div>
          )
        ) : listTab === "suggestions" ? (
          <>
            {search.trim().length >= 2 && (
              <div className="border-b border-amber-100/80 bg-amber-50/40 px-3 py-3">
                <p className={cn("mb-2 text-[11px] font-bold uppercase tracking-wide text-amber-800", isRTL && "font-ui-ar")}>
                  {t("searchPeopleTitle")}
                </p>
                {peopleSearchLoading ? (
                  <div className="flex justify-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin text-amber-600" />
                  </div>
                ) : peopleSearch.length === 0 ? (
                  <p className={cn("text-center text-xs text-slate-500", isRTL && "font-lateef")}>{t("noUsersFound")}</p>
                ) : (
                  <ul className="space-y-1">
                    {peopleSearch.map((p) => (
                      <li key={p.id} className="flex items-center gap-2 rounded-xl bg-white/80 p-2">
                        <button
                          type="button"
                          onClick={() => openProfile(p.id)}
                          className={cn("flex min-w-0 flex-1 items-center gap-2 text-start", isRTL && "flex-row-reverse")}
                        >
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-amber-100 text-xs font-bold text-amber-800">
                            {(p.fullName || p.username || "?")[0]?.toUpperCase()}
                          </div>
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-slate-900">{p.fullName || p.username}</p>
                            <p className="truncate text-[11px] text-slate-500">{p.schoolName || roleLabelShort(p.role, t)}</p>
                          </div>
                        </button>
                        {p.canMessage ? (
                          <button
                            type="button"
                            title={t("suggestionAccept")}
                            onClick={() => void acceptSuggestion(p.id)}
                            className="rounded-lg bg-violet-600 p-2 text-white hover:bg-violet-700"
                          >
                            <MessageSquare className="h-4 w-4" />
                          </button>
                        ) : (
                          <button
                            type="button"
                            title={t("sendInvite")}
                            onClick={() => void sendContactInvite(p.id).catch((e) => setError(e instanceof Error ? e.message : t("errorGeneric")))}
                            className="rounded-lg bg-amber-500 p-2 text-white hover:bg-amber-600"
                          >
                            <Send className="h-4 w-4" />
                          </button>
                        )}
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            )}
            <p className={cn("px-3 pt-3 text-[11px] font-bold uppercase tracking-wide text-amber-800/80", isRTL && "font-ui-ar")}>
              {t("suggestionsTitle")}
            </p>
            {filteredSuggestions.length === 0 ? (
              <p className={cn("px-4 py-8 text-center text-sm text-slate-400", isRTL && "font-ui-ar")}>{t("noSuggestions")}</p>
            ) : (
              <ul>
                {filteredSuggestions.map((s) => (
                  <li key={s.id} className="border-b border-slate-100/80">
                    <div className={cn("flex items-center gap-1.5 px-2 py-2", isRTL && "flex-row-reverse")}>
                      <button
                        type="button"
                        onClick={() => openProfile(s.targetUser.id)}
                        className={cn(
                          "flex min-w-0 flex-1 items-center gap-3 rounded-xl px-2 py-2 text-start transition hover:bg-amber-50/60",
                          isRTL && "flex-row-reverse text-right"
                        )}
                      >
                        <div
                          className={cn(
                            "flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-sm font-bold ring-2",
                            suggestionAvatarClass(s)
                          )}
                        >
                          {(s.targetUser.fullName || s.targetUser.username || "?")[0]?.toUpperCase()}
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className={cn("truncate text-[15px] font-semibold text-slate-900", isRTL && "font-ui-ar")}>
                            {displayUserName(s.targetUser, isRTL)}
                          </p>
                          <p className={cn("mt-0.5 line-clamp-2 text-[12px] text-slate-500", isRTL && "font-lateef")}>
                            {s.reasonLabel}
                          </p>
                        </div>
                      </button>
                      <button
                        type="button"
                        title={t("suggestionAccept")}
                        onClick={() => void acceptSuggestion(s.targetUser.id)}
                        className="rounded-xl bg-violet-600 p-2.5 text-white shadow-sm hover:bg-violet-700"
                      >
                        <Check className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title={t("viewProfile")}
                        onClick={() => openProfile(s.targetUser.id)}
                        className="rounded-xl border border-slate-200 bg-white p-2.5 text-slate-600 hover:border-amber-300 hover:text-amber-700"
                      >
                        <User className="h-4 w-4" />
                      </button>
                      <button
                        type="button"
                        title={t("dismissSuggestion")}
                        onClick={() => void dismissSuggestion(s.id)}
                        className="rounded-xl p-2.5 text-slate-400 hover:bg-red-50 hover:text-red-600"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </>
        ) : null}
      </div>
    </aside>
  );

  const chatPanel = (
    <main
      className={cn(
        "relative z-10 flex min-h-0 min-w-0 flex-1 flex-col bg-[#f0f2f5]",
        isMobile && mobileView !== "chat" && "hidden"
      )}
    >
      {!activeId ? (
        <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
          <div
            className={cn(
              "mb-6 flex h-16 w-16 items-center justify-center rounded-3xl bg-gradient-to-br text-white shadow-xl",
              currentTabTheme.emptyIcon
            )}
          >
            <MessageSquare className="h-8 w-8" />
          </div>
          <h2 className={cn("text-xl font-black text-slate-900", isRTL && "font-ui-ar")}>{t("emptyTitle")}</h2>
          <p className={cn("mt-2 max-w-md text-sm leading-relaxed text-slate-500", isRTL && "font-lateef")}>
            {t("emptyDesc")}
          </p>
          <div className={cn("mt-6 flex flex-wrap justify-center gap-2", isRTL && "flex-row-reverse")}>
            {(["private", "salons", "suggestions"] as MessageListTab[]).map((tabId) => {
              const th = tabThemes[tabId];
              return (
                <button
                  key={tabId}
                  type="button"
                  onClick={() => {
                    setListTab(tabId);
                    if (isMobile) setMobileView("list");
                  }}
                  className={cn(
                    "rounded-full px-3 py-1.5 text-xs font-bold transition",
                    th.accentSoft,
                    th.accentText,
                    "hover:shadow-sm"
                  )}
                >
                  {listTabs.find((x) => x.id === tabId)?.label}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <>
          <header className="flex shrink-0 items-center gap-3 border-b border-[#e9edef] bg-[#f0f2f5] px-4 py-2.5">
            {isMobile && (
              <button type="button" onClick={() => setMobileView("list")} className="rounded-xl p-2 hover:bg-slate-100">
                <ArrowLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
              </button>
            )}
            <div className={cn("flex min-w-0 flex-1 items-center gap-3", isRTL && "flex-row-reverse")}>
              {!activeChannel &&
              activeConv?.otherUser &&
              (partnerRole === "enseignant" || activePartnerUser?.role === "enseignant") ? (
                <TeacherProfileLink
                  teacherId={activeConv.otherUser.id}
                  viewerRole={role}
                  className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-teal-100 text-sm font-black text-teal-800"
                >
                  {(activeConv.otherUser.fullName || "?")[0]?.toUpperCase()}
                </TeacherProfileLink>
              ) : (
              <div
                className={cn(
                  "flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl text-sm font-black",
                  activeChannel ? cn(chatTheme.accentSoft, chatTheme.accentText) : cn(chatTheme.accentSoft, chatTheme.accentText)
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
              )}
              <div className={cn("min-w-0", isRTL && "text-right")}>
                <p className={cn("truncate font-black text-slate-900", isRTL && "font-ui-ar")}>
                  {chatHeaderTitle(activeChannel, activeConv, t, isRTL)}
                </p>
                <p
                  className={cn(
                    "text-[11px] font-medium truncate",
                    typingLabel ? chatTheme.accentText : "text-slate-500",
                    isRTL && typingLabel && "font-ui-ar"
                  )}
                >
                  {typingLabel ||
                    (activeChannel
                      ? safeMessageKey(t, channelDescKey(activeChannel.labelKey), t("channelRoomHint"))
                      : activePartnerUser?.isOnline
                        ? t("liveConnected")
                        : activePartnerUser?.lastSeenAt
                          ? formatLastSeen(activePartnerUser.lastSeenAt, locale)
                          : t("liveReconnecting"))}
                </p>
              </div>
            </div>
            <div className={cn("flex shrink-0 items-center gap-1", isRTL && "flex-row-reverse")}>
              <button
                type="button"
                title={t("searchInChat")}
                onClick={() => setChatSearchOpen((o) => !o)}
                className={cn(
                  "rounded-xl p-2 transition",
                  chatSearchOpen ? "bg-violet-100 text-violet-700" : "text-slate-500 hover:bg-slate-100"
                )}
              >
                <Search className="h-5 w-5" />
              </button>
              {!activeChannel && activeConv?.otherUser && (
                <>
                  {(partnerRole === "enseignant" || activePartnerUser?.role === "enseignant") && (
                    <button
                      type="button"
                      title={t("viewProfile")}
                      onClick={() => activePartnerUser && openProfile(activePartnerUser.id)}
                      className="rounded-xl p-2 text-teal-600 hover:bg-teal-50"
                    >
                      <User className="h-5 w-5" />
                    </button>
                  )}
                  <button
                  type="button"
                  title={t("videoCall")}
                  onClick={() => setShowVideoCallSoon(true)}
                  className={cn("rounded-xl p-2", accent.text, accent.hover)}
                >
                  <Video className="h-5 w-5" />
                </button>
                </>
              )}
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
              {role === "ecole" && (
                <button
                  type="button"
                  title="Modération médias"
                  onClick={() => setShowModeration(true)}
                  className="rounded-xl p-2 text-amber-700 hover:bg-amber-50"
                >
                  <ShieldCheck className="h-5 w-5" />
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
            <div
              className={cn(
                "mx-4 mt-2 rounded-xl border px-4 py-2 text-xs font-bold",
                error === t("inviteSent") || error === t("forwardDone")
                  ? "border-emerald-100 bg-emerald-50 text-emerald-800"
                  : "border-red-100 bg-red-50 text-red-700"
              )}
            >
              {error}
            </div>
          )}

          {chatSearchOpen && (
            <div className={cn(chatMobileClasses.chatSearchPanel, "border-b border-[#e9edef] bg-white px-4 py-2")}>
              <input
                type="search"
                value={chatSearchQuery}
                onChange={(e) => setChatSearchQuery(e.target.value)}
                placeholder={t("searchInChat")}
                className={cn(
                  "w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm outline-none focus:border-violet-300 focus:ring-2 focus:ring-violet-100",
                  isRTL && "font-ui-ar text-right"
                )}
              />
              {chatSearchQuery.trim().length >= 2 && (
                <div className="mt-2 max-h-40 overflow-y-auto rounded-xl border border-slate-100">
                  {chatSearchLoading ? (
                    <div className="flex justify-center py-4">
                      <Loader2 className="h-5 w-5 animate-spin text-violet-600" />
                    </div>
                  ) : chatSearchResults.length === 0 ? (
                    <p className={cn("px-3 py-4 text-center text-xs text-slate-500", isRTL && "font-ui-ar")}>
                      {t("searchNoResults")}
                    </p>
                  ) : (
                    chatSearchResults.map((hit) => (
                      <button
                        key={hit.id}
                        type="button"
                        onClick={() => scrollToMessage(hit.id)}
                        className={cn(
                          "block w-full border-b border-slate-50 px-3 py-2 text-start text-xs hover:bg-violet-50 last:border-0",
                          isRTL && "font-ui-ar text-right"
                        )}
                      >
                        <span className="font-bold text-violet-700">{hit.senderName || t("youPrefix")}</span>
                        <span className="mt-0.5 block truncate text-slate-600">{messagePreview(hit)}</span>
                      </button>
                    ))
                  )}
                </div>
              )}
            </div>
          )}

          {pinnedMessages.length > 0 && (
            <div className="border-b border-amber-100 bg-amber-50/90 px-4 py-2">
              <p className={cn("mb-1 text-[10px] font-bold uppercase tracking-wide text-amber-800", isRTL && "text-right font-ui-ar")}>
                {t("pinnedMessages")}
              </p>
              <div className="flex flex-col gap-1">
                {pinnedMessages.map((pm) => (
                  <button
                    key={pm.id}
                    type="button"
                    onClick={() => scrollToMessage(pm.id)}
                    className={cn(
                      "flex items-center gap-2 rounded-lg bg-white/80 px-2 py-1.5 text-start text-xs shadow-sm hover:bg-white",
                      isRTL && "flex-row-reverse text-right font-ui-ar"
                    )}
                  >
                    <Pin className="h-3.5 w-3.5 shrink-0 text-amber-600" />
                    <span className="min-w-0 truncate font-medium text-slate-800">{messagePreview(pm)}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          <div ref={scrollRef} className="fg-wa-chat-bg min-h-0 flex-1 overflow-y-auto px-[4%] py-2 sm:px-[6%]">
            <div className="mx-auto flex w-full max-w-3xl flex-col">
            {loadingOlder && (
              <div className="flex justify-center py-2">
                <Loader2 className={cn("h-5 w-5 animate-spin", accent.spinner)} />
              </div>
            )}
            {loadingChat ? (
              <div className="flex justify-center py-16">
                <Loader2 className={cn("h-8 w-8 animate-spin", accent.spinner)} />
              </div>
            ) : messages.length === 0 ? (
              <p className={cn("py-12 text-center text-sm font-medium text-slate-500", isRTL && "font-ui-ar")}>{t("emptyRoom")}</p>
            ) : (
              messages.map((m) => {
                const isChannelChat = !!activeChannel;
                const isMedia = ["image", "file", "video", "audio", "voice"].includes(m.messageType || "text");
                const textBody = m.isHidden
                  ? t("messageHidden")
                  : (m.messageType === "text" || !m.messageType) && m.content.trim()
                    ? m.content.trim()
                    : "";
                const mediaCaption =
                  isMedia &&
                  m.content.trim() &&
                  m.content.trim() !== mediaLabel(m.content, m.mediaUrl, m.messageType, locale)
                    ? m.content.trim()
                    : "";
                const hasMeta = !isMedia || textBody || mediaCaption;
                const reactionEntries = m.reactions
                  ? Object.entries(m.reactions).filter(([, users]) => users.length > 0)
                  : [];
                const reactionTotal = reactionEntries.reduce((sum, [, users]) => sum + users.length, 0);
                return (
                  <motion.div
                    key={m.id}
                    id={`msg-${m.id}`}
                    initial={{ opacity: 0, y: 4 }}
                    animate={{ opacity: 1, y: 0 }}
                    {...bindLongPress(() => openMessageActions(m))}
                    className={cn(
                      "fg-wa-bubble-gap flex w-full py-[1px]",
                      m.isMine ? (isRTL ? "justify-start" : "justify-end") : isRTL ? "justify-end" : "justify-start"
                    )}
                  >
                    <div className={cn("flex max-w-full flex-col", m.isMine ? "items-end" : "items-start")}>
                      {isChannelChat && !m.isMine && m.senderName && (
                        <span className={cn("mb-0.5 px-1 text-[11px] font-semibold text-[#128c7e]", isRTL && "font-ui-ar")}>
                          {m.senderName}
                        </span>
                      )}
                      <div className={cn("group flex items-end gap-1", m.isMine && "flex-row-reverse")}>
                        <div className="relative inline-block max-w-full">
                          <div
                            className={cn(
                              "fg-wa-bubble",
                              m.isMine ? "fg-wa-bubble-out" : "fg-wa-bubble-in",
                              reactionTotal > 0 && "mb-2"
                            )}
                          >
                          {m.replyTo && (
                            <button
                              type="button"
                              onClick={() => scrollToMessage(m.replyTo!.id)}
                              className={cn(
                                "mb-1 w-full rounded-md border-s-4 border-[#25d366] bg-black/[0.04] px-2 py-1.5 text-start",
                                isRTL && "border-s-0 border-e-4 font-ui-ar"
                              )}
                            >
                              <p className="text-[11px] font-bold text-[#128c7e]">{m.replyTo.senderName}</p>
                              <p className="truncate text-[11px] text-slate-600">{replyQuoteText(m.replyTo, locale)}</p>
                            </button>
                          )}
                          {m.mediaBlocked && (
                            <p className={cn("mb-1 text-xs italic text-[#667781]", isRTL && "font-ui-ar")}>
                              {t("mediaBlocked")}
                            </p>
                          )}
                          {m.messageType === "image" && m.mediaUrl && (
                            <div className="relative mb-1">
                              <button
                                type="button"
                                onClick={() => openMessageActions(m)}
                                className="absolute end-1 top-1 z-10 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
                                title={t("mediaActionsHint")}
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openMessageActions(m)}
                                className="block cursor-pointer"
                              >
                                {/* eslint-disable-next-line @next/next/no-img-element */}
                                <img
                                  src={chatMediaApiUrl(m.mediaUrl) || m.mediaUrl}
                                  alt={mediaLabel(m.content, m.mediaUrl, m.messageType, locale)}
                                  className="max-h-72 max-w-full rounded-md object-cover"
                                />
                              </button>
                            </div>
                          )}
                          {(m.messageType === "video" || m.messageType === "audio" || m.messageType === "voice") &&
                            m.mediaUrl && (
                              <div className="relative mb-1">
                                <button
                                  type="button"
                                  onClick={() => openMessageActions(m)}
                                  className="absolute end-1 top-1 z-10 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
                                  title={t("mediaActionsHint")}
                                >
                                  <MoreHorizontal className="h-3.5 w-3.5" />
                                </button>
                                <ChatMediaPlayer
                                  url={m.mediaUrl}
                                  messageType={m.messageType}
                                  label={mediaLabel(m.content, m.mediaUrl, m.messageType, locale)}
                                  isRTL={isRTL}
                                  t={t}
                                />
                              </div>
                            )}
                          {m.messageType === "file" && m.mediaUrl && (
                            <div className="relative mb-1">
                              <button
                                type="button"
                                onClick={() => openMessageActions(m)}
                                className="absolute end-1 top-1 z-10 rounded-full bg-black/40 p-1 text-white hover:bg-black/60"
                                title={t("mediaActionsHint")}
                              >
                                <MoreHorizontal className="h-3.5 w-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => openMessageActions(m)}
                                className="flex w-full items-center gap-2 rounded-md border border-[#e9edef] bg-[#f0f2f5] px-2.5 py-2 text-start text-sm text-[#111b21] hover:bg-[#e9edef]"
                              >
                                <FileText className="h-4 w-4 shrink-0 text-[#128c7e]" />
                                <span className="truncate">{mediaLabel(m.content, m.mediaUrl, m.messageType, locale)}</span>
                              </button>
                            </div>
                          )}
                          {(textBody || mediaCaption) && (
                            <span className={cn("fg-wa-bubble-text", isRTL && "font-lateef text-right")}>
                              {textBody || mediaCaption}
                              {hasMeta && (
                                <span className="fg-wa-bubble-meta">
                                  {m.editedAt && (
                                    <span className="italic">{t("edited")}</span>
                                  )}
                                  <span>{formatTime(m.createdAt, locale)}</span>
                                  {m.isMine && !isChannelChat &&
                                    (m.isRead ? (
                                      <CheckCheck className="wa-read h-[14px] w-[14px] stroke-[2]" />
                                    ) : (
                                      <CheckCheck className="h-[14px] w-[14px] stroke-[2] opacity-50" />
                                    ))}
                                </span>
                              )}
                            </span>
                          )}
                          {!textBody && !mediaCaption && isMedia && (
                            <span className="fg-wa-bubble-meta !float-none !mt-0 flex justify-end">
                              <span>{formatTime(m.createdAt, locale)}</span>
                              {m.isMine && !isChannelChat && (
                                <CheckCheck className={cn("h-[14px] w-[14px] stroke-[2]", m.isRead && "wa-read")} />
                              )}
                            </span>
                          )}
                          </div>
                          {reactionTotal > 0 && (
                            <button
                              type="button"
                              onClick={() => openMessageActions(m)}
                              title={t("reactLabel")}
                              className={cn(
                                "absolute -bottom-2 z-[2] flex items-center gap-0.5 rounded-full border border-[#e9edef] bg-white px-1.5 py-0.5 shadow-md transition hover:shadow-lg",
                                m.isMine ? (isRTL ? "start-1" : "end-1") : isRTL ? "end-1" : "start-1"
                              )}
                            >
                              {reactionEntries.slice(0, 3).map(([emoji]) => (
                                // eslint-disable-next-line @next/next/no-img-element
                                <img key={emoji} src={twemojiUrl(emoji)} alt={emoji} className="h-4 w-4" draggable={false} />
                              ))}
                              {reactionTotal > 1 && (
                                <span className="text-[10px] font-bold text-slate-500">{reactionTotal}</span>
                              )}
                            </button>
                          )}
                        </div>
                        {m.isMine && m.id > 0 && m.messageType === "text" && !m.mediaUrl && (
                          <div className={cn("flex flex-col gap-0.5 pb-1 opacity-0 transition group-hover:opacity-100", isRTL && "items-start")}>
                            <button
                              type="button"
                              title={t("messageActionsHint")}
                              onClick={() => openMessageActions(m)}
                              className="rounded-lg p-1 text-slate-400 hover:bg-white/80 hover:text-violet-600"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                            <button
                              type="button"
                              title={t("editMessage")}
                              onClick={() => {
                                setEditingId(m.id);
                                setEditDraft(m.content);
                              }}
                              className="rounded-lg p-1 text-slate-400 hover:bg-white/80 hover:text-orange-600"
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
                        {m.id > 0 && !m.isMine && !m.mediaUrl && (
                          <div className={cn("flex flex-col gap-0.5 pb-1 opacity-0 transition group-hover:opacity-100", isRTL && "items-start")}>
                            <button
                              type="button"
                              title={t("messageActionsHint")}
                              onClick={() => openMessageActions(m)}
                              className="rounded-lg p-1 text-slate-400 hover:bg-white/80 hover:text-violet-600"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
                            </button>
                          </div>
                        )}
                        {m.isMine && m.id > 0 && m.mediaUrl && (
                          <div className={cn("flex flex-col gap-0.5 pb-1 opacity-100 sm:opacity-0 sm:transition sm:group-hover:opacity-100", isRTL && "items-start")}>
                            <button
                              type="button"
                              title={t("mediaActionsHint")}
                              onClick={() => openMessageActions(m)}
                              className="rounded-lg p-1 text-slate-400 hover:bg-white/80 hover:text-[#128c7e]"
                            >
                              <MoreHorizontal className="h-3.5 w-3.5" />
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
                    </div>
                  </motion.div>
                );
              })
            )}
            </div>
          </div>

          <footer className="shrink-0 border-t border-[#e9edef] bg-[#f0f2f5] px-3 py-2 pb-[max(0.5rem,env(safe-area-inset-bottom))] sm:px-4">
            <div className="mx-auto w-full max-w-3xl">
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
              <p className={cn("rounded-2xl bg-slate-50 px-4 py-3 text-center text-xs font-bold text-slate-500", isRTL && "font-ui-ar")}>
                {t("readOnlyChannel")}
              </p>
            ) : (
              <>
                {replyTo && (
                  <div
                    className={cn(
                      "mb-2 flex items-center gap-2 rounded-2xl border border-sky-200 bg-sky-50 px-3 py-2",
                      isRTL && "flex-row-reverse font-ui-ar"
                    )}
                  >
                    <div className={cn("min-w-0 flex-1", isRTL && "text-right")}>
                      <p className="text-[11px] font-bold text-sky-800">
                        {t("replyToName", { name: replyTo.senderName || t("youPrefix") })}
                      </p>
                      <p className="truncate text-xs text-sky-700">{messagePreview(replyTo)}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => setReplyTo(null)}
                      className="shrink-0 rounded-lg p-1 text-sky-600 hover:bg-sky-100"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
                {allowBroadcast && (
                  <label
                    className={cn(
                      "mb-3 flex cursor-pointer items-center gap-2 rounded-2xl border px-3 py-2 text-xs font-bold transition",
                      broadcastMode
                        ? "border-amber-300 bg-amber-50 text-amber-900"
                        : "border-slate-100 bg-slate-50 text-slate-600",
                      isRTL && "flex-row-reverse font-ui-ar"
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
                      "mb-3 flex items-center gap-2 rounded-2xl border border-orange-100/80 bg-orange-50/80 px-3 py-2 backdrop-blur-sm",
                      isRTL && "flex-row-reverse"
                    )}
                  >
                    {pendingMedia.messageType === "image" ? (
                      /* eslint-disable-next-line @next/next/no-img-element */
                      <img src={pendingMedia.url} alt="" className="h-10 w-10 rounded-lg object-cover" />
                    ) : pendingMedia.messageType === "video" ? (
                      <Video className="h-5 w-5 shrink-0 text-orange-600" />
                    ) : pendingMedia.messageType === "voice" ? (
                      <Mic className="h-5 w-5 shrink-0 text-orange-600" />
                    ) : pendingMedia.messageType === "audio" ? (
                      <Music className="h-5 w-5 shrink-0 text-orange-600" />
                    ) : (
                      <FileText className="h-5 w-5 shrink-0 text-orange-600" />
                    )}
                    <span className={cn("min-w-0 flex-1 truncate text-xs font-bold text-orange-900", isRTL && "font-ui-ar")}>
                      {pendingMedia.defaultLabel}
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
                <input ref={imageInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="hidden" onChange={handleFileSelect} />
                <input ref={fileInputRef} type="file" accept="application/pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt" className="hidden" onChange={handleFileSelect} />
                <input ref={videoInputRef} type="file" accept="video/mp4,video/webm,video/quicktime" className="hidden" onChange={handleFileSelect} />
                <input ref={audioInputRef} type="file" accept="audio/mpeg,audio/mp4,audio/webm,audio/ogg,audio/wav" className="hidden" onChange={handleFileSelect} />
                {recording && (
                  <div className={cn("mb-2 flex items-center justify-center gap-2 rounded-2xl bg-red-50/90 px-3 py-2 text-xs font-bold text-red-700", isRTL && "font-ui-ar")}>
                    <span className="inline-flex h-2 w-2 animate-pulse rounded-full bg-red-500" />
                    {t("recording", { sec: recordingSec })}
                  </div>
                )}
                <div className={cn("relative flex items-end gap-2", isRTL && "flex-row-reverse")}>
                  <div ref={emojiRef} className={cn("relative shrink-0", isMobile && "fg-chat-emoji-anchor")}>
                    <button
                      type="button"
                      title={t("emojiPicker")}
                      disabled={uploading || sending || recording}
                      onClick={() => {
                        unlockChatSounds();
                        setEmojiOpen((o) => !o);
                        setAttachMenuOpen(false);
                      }}
                      className={cn(
                        "flex h-12 w-10 shrink-0 items-center justify-center rounded-full bg-white text-[#54656f] shadow-sm transition hover:bg-[#f0f2f5]",
                        emojiOpen && "ring-2 ring-[#25d366]/40"
                      )}
                    >
                      <Smile className="h-5 w-5" />
                    </button>
                    <AnimatePresence>
                      {emojiOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: 8 }}
                          className={cn(
                            "absolute bottom-full z-30 mb-2 w-[min(100vw-1rem,380px)]",
                            isRTL ? "start-0" : "end-0",
                            isMobile && "fg-chat-emoji-floating"
                          )}
                        >
                          <ChatEmojiPicker
                            locale={locale}
                            isRTL={isRTL}
                            onSelect={(emoji) => {
                              setDraft((d) => d + emoji);
                              setEmojiOpen(false);
                              inputRef.current?.focus();
                            }}
                          />
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
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
                    className="fg-glass-icon flex h-12 w-10 shrink-0 !rounded-2xl"
                  >
                    {soundsOn ? <Volume2 className="h-4 w-4" /> : <VolumeX className="h-4 w-4" />}
                  </button>
                  <div ref={attachMenuRef} className="relative shrink-0">
                    <button
                      type="button"
                      title={t("attach")}
                      disabled={uploading || sending || recording}
                      onClick={() => setAttachMenuOpen((o) => !o)}
                      className={cn(
                        "fg-glass-icon flex h-12 w-10 items-center justify-center !rounded-2xl",
                        attachMenuOpen && "ring-2 ring-orange-300/60"
                      )}
                    >
                      {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Paperclip className="h-4 w-4" />}
                    </button>
                    <AnimatePresence>
                      {attachMenuOpen && (
                        <motion.div
                          initial={{ opacity: 0, y: 8, scale: 0.96 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: 8, scale: 0.96 }}
                          className={cn(
                            "fg-glass-sheet absolute bottom-full z-20 mb-2 min-w-[11rem] overflow-hidden rounded-2xl border p-1.5 shadow-xl",
                            isRTL ? "start-0" : "end-0"
                          )}
                        >
                          {[
                            { icon: ImageIcon, label: t("attachImage"), action: () => imageInputRef.current?.click() },
                            { icon: FileText, label: t("attachDocument"), action: () => fileInputRef.current?.click() },
                            { icon: Video, label: t("attachVideo"), action: () => videoInputRef.current?.click() },
                            { icon: Video, label: t("recordVideo"), action: () => { setAttachMenuOpen(false); setVideoRecordOpen(true); } },
                            { icon: Music, label: t("attachAudio"), action: () => audioInputRef.current?.click() },
                          ].map(({ icon: Icon, label, action }) => (
                            <button
                              key={label}
                              type="button"
                              onClick={action}
                              className={cn(
                                "flex w-full items-center gap-2.5 rounded-xl px-3 py-2.5 text-start text-sm font-semibold text-slate-700 transition hover:bg-white/50",
                                isRTL && "flex-row-reverse font-ui-ar"
                              )}
                            >
                              <Icon className="h-4 w-4 shrink-0 text-orange-600" />
                              {label}
                            </button>
                          ))}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                  <button
                    type="button"
                    title={recording ? t("stopRecording") : t("voiceMessage")}
                    disabled={uploading || sending}
                    onClick={() => void toggleVoiceRecording()}
                    className={cn(
                      "flex h-12 w-10 shrink-0 items-center justify-center rounded-2xl border-2 transition",
                      recording
                        ? "border-red-300 bg-red-50 text-red-600 animate-pulse"
                        : "fg-glass-icon !rounded-2xl border-transparent"
                    )}
                  >
                    <Mic className="h-4 w-4" />
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
                    placeholder={pendingMedia ? pendingMedia.defaultLabel : t("placeholder")}
                    className={cn(
                      "fg-glass-input max-h-32 min-h-[48px] flex-1 resize-none rounded-2xl px-4 py-3 text-sm font-medium text-slate-800 outline-none",
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
            </div>
          </footer>
        </>
      )}
    </main>
  );

  return (
    <div dir={isRTL ? "rtl" : "ltr"} className="relative z-10 flex h-full min-h-0 w-full overflow-hidden font-ui-ar">
      {sidebar}
      {chatPanel}
      <ChannelHelpModal open={showHelp} onClose={() => setShowHelp(false)} isRTL={isRTL} />
      <MediaModerationPanel open={showModeration} onClose={() => setShowModeration(false)} isRTL={isRTL} />
      <FeatureSoonModal
        open={showVideoCallSoon}
        title={t("videoCall")}
        body={t("videoCallSoon")}
        onClose={() => setShowVideoCallSoon(false)}
      />
      <VideoRecordModal
        open={videoRecordOpen}
        isRTL={isRTL}
        t={t}
        onClose={() => setVideoRecordOpen(false)}
        onRecorded={handleVideoRecorded}
      />
      <SuggestionProfileModal
        open={profileUserId != null}
        userId={profileUserId}
        locale={locale}
        isRTL={isRTL}
        t={t}
        onClose={() => setProfileUserId(null)}
        onStartChat={(id) => void acceptSuggestion(id)}
        onInvite={sendContactInvite}
      />
      <ChatMediaViewer
        open={!!docViewer}
        url={docViewer?.url || ""}
        fileName={docViewer?.fileName || t("attachment")}
        messageType={docViewer?.messageType}
        canDelete={!!docViewer?.isMine && !!docViewer?.messageId}
        onDelete={() => {
          if (!docViewer?.messageId) return;
          void handleDeleteMessage(docViewer.messageId);
          setDocViewer(null);
        }}
        onClose={() => setDocViewer(null)}
        isRTL={isRTL}
        t={t}
      />
      <ChatMessageActionSheet
        open={!!actionMsg}
        message={actionMsg}
        locale={locale}
        isRTL={isRTL}
        canPin={canPost}
        t={t}
        onClose={() => setActionMsg(null)}
        onReact={(emoji) => actionMsg && void reactToMessage(actionMsg.id, emoji)}
        onReply={() => {
          if (!actionMsg) return;
          setReplyTo(actionMsg);
          setActionMsg(null);
          inputRef.current?.focus();
        }}
        onView={
          actionMsg?.mediaUrl
            ? () => {
                if (!actionMsg?.mediaUrl) return;
                openDocument(actionMsg.mediaUrl, actionMsg.content, actionMsg.messageType, {
                  messageId: actionMsg.id,
                  isMine: actionMsg.isMine,
                });
                setActionMsg(null);
              }
            : undefined
        }
        onForward={
          actionMsg && !actionMsg.isHidden && (actionMsg.mediaUrl || actionMsg.content.trim())
            ? () => setForwardOpen(true)
            : undefined
        }
        onReport={
          actionMsg && !actionMsg.isMine && !actionMsg.isHidden
            ? () => void reportMessage(actionMsg.id)
            : undefined
        }
        onPin={actionMsg ? () => void togglePinMessage(actionMsg) : undefined}
        onDelete={
          actionMsg?.isMine
            ? () => {
                if (!actionMsg) return;
                void handleDeleteMessage(actionMsg.id);
                setActionMsg(null);
              }
            : undefined
        }
      />
      <ForwardPickerModal
        open={forwardOpen}
        conversations={conversations}
        activeId={activeId}
        isRTL={isRTL}
        t={t}
        onClose={() => setForwardOpen(false)}
        onPick={(id) => void forwardMessageTo(id)}
      />
      <MediaCaptionModal
        open={!!mediaCaptionPrompt}
        defaultLabel={mediaCaptionPrompt?.defaultLabel || t("attachment")}
        isRTL={isRTL}
        t={t}
        onCancel={() => setMediaCaptionPrompt(null)}
        onConfirm={(caption) => {
          if (!mediaCaptionPrompt) return;
          const media = mediaCaptionPrompt;
          setMediaCaptionPrompt(null);
          void postMessage(caption, media);
        }}
      />
    </div>
  );
}

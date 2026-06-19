"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { toast } from "sonner";
import {
  Flag,
  ImageIcon,
  MessageCircle,
  Smile,
  Sparkles,
  ThumbsUp,
  Trash2,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import ChatEmojiPicker from "@/components/messages/ChatEmojiPicker";
import NewsCommentAvatar from "./NewsCommentAvatar";
import TeacherProfileLink from "@/components/teacher/TeacherProfileLink";
import { formatNewsCommentTime } from "@/lib/news/formatCommentTime";
import { NEWS_GIF_PRESETS } from "@/lib/news/news-gif-presets";
import { twemojiUrl } from "@/lib/messaging/twemoji";
import type { NewsCommentDto, NewsCommentViewer } from "@/lib/news/comments.server";

function updateInTree(
  list: NewsCommentDto[],
  id: number,
  fn: (c: NewsCommentDto) => NewsCommentDto
): NewsCommentDto[] {
  return list.map((c) => {
    if (c.id === id) return fn(c);
    if (c.replies.length) return { ...c, replies: updateInTree(c.replies, id, fn) };
    return c;
  });
}

function removeFromTree(list: NewsCommentDto[], id: number): NewsCommentDto[] {
  return list
    .filter((c) => c.id !== id)
    .map((c) => ({ ...c, replies: removeFromTree(c.replies, id) }));
}

function appendReply(list: NewsCommentDto[], parentId: number, reply: NewsCommentDto): NewsCommentDto[] {
  return list.map((c) => {
    if (c.id === parentId) return { ...c, replies: [...c.replies, reply] };
    if (c.replies.length) return { ...c, replies: appendReply(c.replies, parentId, reply) };
    return c;
  });
}

function StickerImg({ emoji, size = 96 }: { emoji: string; size?: number }) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={twemojiUrl(emoji, 512)}
      alt={emoji}
      width={size}
      height={size}
      className="drop-shadow-md"
      draggable={false}
    />
  );
}

type ComposerProps = {
  articleId: number;
  viewer: NewsCommentViewer;
  parentId?: number | null;
  placeholder: string;
  compact?: boolean;
  variant?: "parent" | "enseignant";
  onPosted: (comment: NewsCommentDto, parentId?: number | null) => void;
  onCancel?: () => void;
};

function CommentComposer({
  articleId,
  viewer,
  parentId = null,
  placeholder,
  compact,
  variant = "enseignant",
  onPosted,
  onCancel,
}: ComposerProps) {
  const locale = useLocale();
  const t = useTranslations("News");
  const isRTL = locale.startsWith("ar");
  const isParent = variant === "parent";
  const [body, setBody] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [showEmoji, setShowEmoji] = useState(false);
  const [showGif, setShowGif] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewFile, setPreviewFile] = useState<File | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);
  const emojiRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!showEmoji) return;
    const close = (e: MouseEvent) => {
      if (emojiRef.current && !emojiRef.current.contains(e.target as Node)) setShowEmoji(false);
    };
    document.addEventListener("mousedown", close);
    return () => document.removeEventListener("mousedown", close);
  }, [showEmoji]);

  const resetMedia = () => {
    setPreviewUrl(null);
    setPreviewFile(null);
    if (fileRef.current) fileRef.current.value = "";
  };

  const submit = async (opts?: {
    attachmentType?: NewsCommentDto["attachmentType"];
    attachmentUrl?: string | null;
    attachmentSticker?: string | null;
    text?: string;
  }) => {
    const text = (opts?.text ?? body).trim();
    const hasMedia = Boolean(opts?.attachmentSticker || opts?.attachmentUrl || previewFile);
    if (!text && !hasMedia) return;

    setSubmitting(true);
    try {
      let res: Response;
      if (previewFile) {
        const fd = new FormData();
        fd.set("body", text);
        if (parentId) fd.set("parentId", String(parentId));
        fd.set("file", previewFile);
        res = await fetch(`/api/news/${articleId}/comments`, { method: "POST", body: fd });
      } else {
        res = await fetch(`/api/news/${articleId}/comments`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            body: text,
            parentId,
            attachmentType: opts?.attachmentType ?? "none",
            attachmentUrl: opts?.attachmentUrl ?? null,
            attachmentSticker: opts?.attachmentSticker ?? null,
          }),
        });
      }
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t("commentError"));
        return;
      }
      onPosted(data.comment, parentId);
      setBody("");
      resetMedia();
      setShowEmoji(false);
      setShowGif(false);
      if (!parentId) toast.success(t("commentPosted"));
    } finally {
      setSubmitting(false);
    }
  };

  const onPickEmoji = (emoji: string) => {
    setBody((b) => b + emoji);
    setShowEmoji(false);
  };

  const onPickSticker = async (emoji: string) => {
    setShowEmoji(false);
    await submit({ attachmentType: "sticker", attachmentSticker: emoji, text: body });
  };

  const onPickGif = async (url: string) => {
    setShowGif(false);
    await submit({ attachmentType: "gif", attachmentUrl: url, text: body });
  };

  const onPhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setPreviewFile(file);
    setPreviewUrl(URL.createObjectURL(file));
  };

  const viewerAsAuthor = {
    id: 0,
    name: viewer.name,
    role: viewer.role,
    image: viewer.image,
    avatarConfig: viewer.avatarConfig,
  };

  return (
    <div className={cn("flex gap-2", compact ? "mt-2" : "")}>
      <NewsCommentAvatar author={viewerAsAuthor} size={compact ? "sm" : "md"} className="mt-1" />
      <div className="min-w-0 flex-1">
        <div
          className={cn(
            "relative rounded-[1.25rem] bg-slate-100/90 ring-1 ring-slate-200/80 transition focus-within:bg-white",
            isParent ? "focus-within:ring-orange-400/60" : "focus-within:ring-teal-400/60"
          )}
        >
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={compact ? 1 : 2}
            maxLength={2000}
            placeholder={placeholder}
            className="w-full resize-none bg-transparent px-4 py-3 text-sm text-slate-800 outline-none placeholder:text-slate-400"
          />
          {previewUrl && (
            <div className="relative mx-3 mb-2 inline-block">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt="" className="max-h-40 rounded-xl object-cover shadow-sm" />
              <button
                type="button"
                onClick={resetMedia}
                className="absolute -right-2 -top-2 rounded-full bg-slate-900/80 p-1 text-white hover:bg-slate-900"
              >
                <X className="h-3 w-3" />
              </button>
            </div>
          )}
          <div className="flex flex-wrap items-center justify-between gap-2 border-t border-slate-200/60 px-2 py-1.5">
            <div className="flex items-center gap-0.5">
              <div className="relative" ref={emojiRef}>
                <button
                  type="button"
                  onClick={() => {
                    setShowEmoji((v) => !v);
                    setShowGif(false);
                  }}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-amber-500"
                  title={t("commentEmoji")}
                >
                  <Smile className="h-4 w-4" />
                </button>
                {showEmoji && (
                  <div className="absolute bottom-full z-30 mb-2 w-[min(100vw-2rem,320px)]">
                    <ChatEmojiPicker
                      locale={locale}
                      isRTL={isRTL}
                      onSelect={onPickEmoji}
                      onStickerSelect={(emoji) => void onPickSticker(emoji)}
                    />
                  </div>
                )}
              </div>
              <button
                type="button"
                onClick={() => fileRef.current?.click()}
                className={cn(
                  "rounded-full p-2 text-slate-500 transition hover:bg-white",
                  isParent ? "hover:text-orange-600" : "hover:text-teal-600"
                )}
                title={t("commentPhoto")}
              >
                <ImageIcon className="h-4 w-4" />
              </button>
              <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={onPhotoChange} />
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setShowGif((v) => !v);
                    setShowEmoji(false);
                  }}
                  className="rounded-full p-2 text-slate-500 transition hover:bg-white hover:text-violet-600"
                  title={t("commentGif")}
                >
                  <Sparkles className="h-4 w-4" />
                </button>
                {showGif && (
                  <div className="absolute bottom-full z-30 mb-2 w-72 rounded-2xl border border-slate-200 bg-white p-3 shadow-xl">
                    <p className="mb-2 text-[10px] font-black uppercase tracking-wider text-slate-400">
                      {t("commentGifPick")}
                    </p>
                    <div className="grid grid-cols-3 gap-2">
                      {NEWS_GIF_PRESETS.map((g) => (
                        <button
                          key={g.id}
                          type="button"
                          onClick={() => void onPickGif(g.url)}
                          className={cn(
                            "overflow-hidden rounded-xl ring-1 ring-slate-100 transition",
                            isParent ? "hover:ring-orange-400" : "hover:ring-teal-400"
                          )}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img src={g.url} alt="" className="aspect-square w-full object-cover" />
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex items-center gap-2">
              {onCancel && (
                <button
                  type="button"
                  onClick={onCancel}
                  className="text-xs font-semibold text-slate-500 hover:text-slate-700"
                >
                  {t("commentCancel")}
                </button>
              )}
              <Button
                type="button"
                size="sm"
                disabled={submitting || (!body.trim() && !previewFile)}
                onClick={() => void submit()}
                className={cn(
                  "h-8 rounded-full px-4 text-xs font-bold",
                  isParent ? "bg-orange-500 hover:bg-orange-400" : "bg-teal-600 hover:bg-teal-500"
                )}
              >
                {submitting ? t("commentSending") : t("commentSubmit")}
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

type CommentItemProps = {
  comment: NewsCommentDto;
  articleId: number;
  viewer: NewsCommentViewer;
  locale: string;
  variant?: "parent" | "enseignant";
  depth?: number;
  onLike: (id: number) => void;
  onReport: (id: number) => void;
  onDelete: (id: number) => void;
  onReplyPosted: (parentId: number, reply: NewsCommentDto) => void;
};

function CommentItem({
  comment,
  articleId,
  viewer,
  locale,
  variant = "enseignant",
  depth = 0,
  onLike,
  onReport,
  onDelete,
  onReplyPosted,
}: CommentItemProps) {
  const t = useTranslations("News");
  const [replyOpen, setReplyOpen] = useState(false);
  const timeLabel = formatNewsCommentTime(comment.createdAt, locale);

  return (
    <div className={cn(depth > 0 && "mt-3")}>
      <div className="group flex gap-2.5">
        {comment.author.role === "enseignant" ? (
          <TeacherProfileLink teacherId={comment.author.id} viewerRole={viewer.role}>
            <NewsCommentAvatar author={comment.author} size={depth > 0 ? "sm" : "md"} className="mt-0.5" />
          </TeacherProfileLink>
        ) : (
          <NewsCommentAvatar author={comment.author} size={depth > 0 ? "sm" : "md"} className="mt-0.5" />
        )}
        <div className="min-w-0 flex-1">
          <div className="inline-block max-w-full rounded-[1.15rem] bg-slate-100/90 px-3.5 py-2.5 ring-1 ring-slate-200/70 transition group-hover:bg-slate-100">
            <div className="flex flex-wrap items-baseline gap-x-1.5 gap-y-0.5">
              {comment.author.role === "enseignant" ? (
                <TeacherProfileLink teacherId={comment.author.id} viewerRole={viewer.role} variant="name">
                  <span className="text-[13px] font-black text-slate-900">{comment.author.name}</span>
                </TeacherProfileLink>
              ) : (
                <span className="text-[13px] font-black text-slate-900">{comment.author.name}</span>
              )}
              {comment.author.role === "enseignant" && (
                <span className="rounded-full bg-teal-100 px-1.5 py-px text-[8px] font-black uppercase text-teal-800">
                  {t("roleTeacher")}
                </span>
              )}
            </div>

            {comment.attachmentType === "sticker" && comment.attachmentSticker && (
              <div className="mt-1 py-1">
                <StickerImg emoji={comment.attachmentSticker} size={depth > 0 ? 72 : 96} />
              </div>
            )}

            {comment.body && (
              <p className="mt-0.5 whitespace-pre-wrap text-[13px] leading-relaxed text-slate-800">{comment.body}</p>
            )}

            {(comment.attachmentType === "image" || comment.attachmentType === "gif") && comment.attachmentUrl && (
              <div className="mt-2 overflow-hidden rounded-xl">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={comment.attachmentUrl}
                  alt=""
                  className="max-h-64 max-w-full object-contain"
                  loading="lazy"
                />
              </div>
            )}
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 px-1">
            {comment.likeCount > 0 && (
              <span className="flex items-center gap-1 text-[11px] font-semibold text-slate-500">
                <span className="flex h-4 w-4 items-center justify-center rounded-full bg-blue-600 text-white">
                  <ThumbsUp className="h-2.5 w-2.5" />
                </span>
                {comment.likeCount}
              </span>
            )}
            <button
              type="button"
              onClick={() => onLike(comment.id)}
              className={cn(
                "text-[11px] font-bold transition hover:underline",
                comment.likedByMe ? "text-blue-600" : "text-slate-500 hover:text-blue-600"
              )}
            >
              {comment.likedByMe ? t("commentLiked") : t("commentLike")}
            </button>
            {depth === 0 && (
              <button
                type="button"
                onClick={() => setReplyOpen((v) => !v)}
                className="text-[11px] font-bold text-slate-500 transition hover:text-slate-800 hover:underline"
              >
                {t("commentReply")}
              </button>
            )}
            <span className="text-[11px] text-slate-400" title={new Date(comment.createdAt).toLocaleString()}>
              {timeLabel}
            </span>
            <div className="ml-auto flex gap-0.5 opacity-0 transition group-hover:opacity-100">
              {!comment.isOwn && (
                <button
                  type="button"
                  onClick={() => onReport(comment.id)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-amber-600"
                  title={t("commentReport")}
                >
                  <Flag className="h-3 w-3" />
                </button>
              )}
              {comment.isOwn && (
                <button
                  type="button"
                  onClick={() => onDelete(comment.id)}
                  className="rounded-full p-1 text-slate-400 hover:bg-slate-200 hover:text-red-600"
                  title={t("commentDelete")}
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              )}
            </div>
          </div>

          {replyOpen && depth === 0 && (
            <CommentComposer
              articleId={articleId}
              viewer={viewer}
              parentId={comment.id}
              placeholder={t("commentReplyPlaceholder")}
              compact
              variant={variant}
              onCancel={() => setReplyOpen(false)}
              onPosted={(reply, pid) => {
                if (pid) onReplyPosted(pid, reply);
                setReplyOpen(false);
              }}
            />
          )}

          {comment.replies.length > 0 && (
            <div className="relative mt-2 border-l-2 border-slate-200/80 pl-3 ml-3">
              {comment.replies.map((r) => (
                <CommentItem
                  key={r.id}
                  comment={r}
                  articleId={articleId}
                  viewer={viewer}
                  locale={locale}
                  variant={variant}
                  depth={1}
                  onLike={onLike}
                  onReport={onReport}
                  onDelete={onDelete}
                  onReplyPosted={onReplyPosted}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function NewsComments({
  articleId,
  variant = "enseignant",
}: {
  articleId: number;
  variant?: "parent" | "enseignant";
}) {
  const isParent = variant === "parent";
  const locale = useLocale();
  const t = useTranslations("News");
  const disqusHost = process.env.NEXT_PUBLIC_DISQUS_SHORTNAME;
  const [comments, setComments] = useState<NewsCommentDto[]>([]);
  const [viewer, setViewer] = useState<NewsCommentViewer | null>(null);
  const [loading, setLoading] = useState(true);

  const load = useCallback(async () => {
    if (disqusHost) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/news/${articleId}/comments`);
      const data = await res.json();
      if (res.ok) {
        setComments(data.comments ?? []);
        setViewer(data.viewer ?? null);
      }
    } finally {
      setLoading(false);
    }
  }, [articleId, disqusHost]);

  useEffect(() => {
    void load();
  }, [load]);

  const handleLike = async (commentId: number) => {
    const res = await fetch(`/api/news/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "like", commentId }),
    });
    const data = await res.json();
    if (!res.ok) return;
    setComments((prev) =>
      updateInTree(prev, commentId, (c) => ({
        ...c,
        likedByMe: data.liked,
        likeCount: data.likeCount,
      }))
    );
  };

  const handleReport = async (commentId: number) => {
    const res = await fetch(`/api/news/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "report", commentId }),
    });
    const data = await res.json();
    if (!res.ok) toast.error(data.error || t("commentError"));
    else {
      toast.success(t("commentReported"));
      void load();
    }
  };

  const handleDelete = async (commentId: number) => {
    const res = await fetch(`/api/news/${articleId}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "delete", commentId }),
    });
    if (res.ok) {
      setComments((prev) => removeFromTree(prev, commentId));
      toast.success(t("commentDeleted"));
    }
  };

  const handleTopPosted = (comment: NewsCommentDto) => {
    setComments((prev) => [comment, ...prev]);
  };

  const handleReplyPosted = (parentId: number, reply: NewsCommentDto) => {
    setComments((prev) => appendReply(prev, parentId, reply));
  };

  if (disqusHost) return null;

  return (
    <section className="mt-10 overflow-hidden rounded-2xl border border-slate-200/80 bg-gradient-to-b from-white via-slate-50/30 to-white p-5 shadow-[0_8px_30px_-12px_rgba(15,23,42,0.12)] sm:p-6">
      <div className="mb-5 flex items-center gap-3">
        <div
          className={cn(
            "flex h-10 w-10 items-center justify-center rounded-full text-white shadow-md",
            isParent ? "bg-gradient-to-br from-orange-500 to-amber-500" : "bg-gradient-to-br from-teal-500 to-emerald-600"
          )}
        >
          <MessageCircle className="h-5 w-5" />
        </div>
        <div>
          <h2 className="text-lg font-black text-slate-900">{t("discussionTitle")}</h2>
          <p className="text-xs text-slate-500">{t("discussionHint")}</p>
        </div>
      </div>

      {viewer && (
        <CommentComposer
          articleId={articleId}
          viewer={viewer}
          placeholder={t("commentPlaceholder")}
          variant={variant}
          onPosted={(c) => handleTopPosted(c)}
        />
      )}

      <div className="mt-6 border-t border-slate-100 pt-5">
        {loading ? (
          <p className="text-sm text-slate-400 animate-pulse">{t("commentsLoading")}</p>
        ) : comments.length === 0 ? (
          <p className="rounded-xl bg-slate-50 py-8 text-center text-sm text-slate-500">{t("commentsEmpty")}</p>
        ) : viewer ? (
          <div className="space-y-5">
            {comments.map((c) => (
              <CommentItem
                key={c.id}
                comment={c}
                articleId={articleId}
                viewer={viewer}
                locale={locale}
                variant={variant}
                onLike={(id) => void handleLike(id)}
                onReport={(id) => void handleReport(id)}
                onDelete={(id) => void handleDelete(id)}
                onReplyPosted={handleReplyPosted}
              />
            ))}
          </div>
        ) : null}
      </div>
    </section>
  );
}

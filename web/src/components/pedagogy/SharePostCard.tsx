"use client";

import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  ExternalLink,
  Eye,
  FileText,
  Heart,
  Image as ImageIcon,
  Flag,
  MessageCircle,
  Play,
  Trash2,
} from "lucide-react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ATELIER_ACTIVITY_PATH } from "@/lib/authoring/h5p-config";
import type { PedagogyShareDto } from "@/lib/pedagogy/types";
import type { PedagogyShareCommentDto } from "@/lib/pedagogy/shares.server";
import { pedagogyMediaApiUrl } from "@/lib/pedagogy/media-url";
import { cn } from "@/lib/utils";
import TeacherProfileLink from "@/components/teacher/TeacherProfileLink";
import TeacherAvatarDisplay from "@/components/teacher/TeacherAvatarDisplay";
import { Badge } from "@/components/ui/badge";

type Props = {
  post: PedagogyShareDto;
  viewerRole?: string;
  canDelete?: boolean;
  onLike: (id: number) => void;
  onDelete?: (id: number) => void;
  liking?: boolean;
};

export default function SharePostCard({ post, viewerRole, canDelete, onLike, onDelete, liking }: Props) {
  const t = useTranslations("PedagogyWall");
  const locale = useLocale();
  const isParent = viewerRole === "parent";
  const [commentsOpen, setCommentsOpen] = useState(false);
  const [comments, setComments] = useState<PedagogyShareCommentDto[]>([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [commentBody, setCommentBody] = useState("");
  const [commentPending, setCommentPending] = useState(false);

  useEffect(() => {
    if (!commentsOpen) return;
    setCommentsLoading(true);
    void fetch(`/api/pedagogy/shares/${post.id}/comments`)
      .then((r) => r.json())
      .then((data) => setComments(data.comments ?? []))
      .catch(() => setComments([]))
      .finally(() => setCommentsLoading(false));
  }, [commentsOpen, post.id]);

  const submitComment = async () => {
    const body = commentBody.trim();
    if (!body) return;
    setCommentPending(true);
    try {
      const res = await fetch(`/api/pedagogy/shares/${post.id}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ body }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error);
      if (data.comment) setComments((prev) => [...prev, data.comment]);
      setCommentBody("");
    } catch {
      /* ignore */
    } finally {
      setCommentPending(false);
    }
  };

  const deleteComment = async (commentId: number) => {
    const res = await fetch(`/api/pedagogy/shares/${post.id}/comments`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ commentId }),
    });
    if (res.ok) setComments((prev) => prev.filter((c) => c.id !== commentId));
  };

  const reportComment = async (commentId: number) => {
    const res = await fetch(`/api/pedagogy/shares/${post.id}/comments`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "report", commentId }),
    });
    if (res.ok) {
      setComments((prev) => prev.filter((c) => c.id !== commentId));
    }
  };

  const reportPost = async () => {
    await fetch(`/api/pedagogy/shares/${post.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "report" }),
    });
  };

  useEffect(() => {
    void fetch(`/api/pedagogy/shares/${post.id}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "view" }),
    }).catch(() => undefined);
  }, [post.id]);

  const typeColors: Record<string, string> = {
    lesson: "bg-sky-100 text-sky-800 border-sky-200",
    exercise: "bg-emerald-100 text-emerald-800 border-emerald-200",
    exam: "bg-violet-100 text-violet-800 border-violet-200",
    resource: "bg-amber-100 text-amber-800 border-amber-200",
  };

  return (
    <motion.article
      layout
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-3xl border border-slate-100 bg-white p-5 shadow-sm transition-shadow hover:shadow-md"
    >
      <div className="flex items-start gap-3">
        <TeacherProfileLink teacherId={post.author.id} viewerRole={viewerRole} className="shrink-0">
          <TeacherAvatarDisplay
            fullName={post.author.fullName}
            image={post.author.image}
            avatarConfig={post.author.avatarConfig}
            avatarMode={post.author.avatarMode}
            size="sm"
            className={cn("rounded-full ring-2", isParent ? "ring-orange-100" : "ring-teal-100")}
          />
        </TeacherProfileLink>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <TeacherProfileLink teacherId={post.author.id} viewerRole={viewerRole} variant="name">
              {post.author.fullName}
            </TeacherProfileLink>
            <Badge variant="outline" className={cn("text-[10px] font-black uppercase", typeColors[post.postType])}>
              {t(`types.${post.postType}`)}
            </Badge>
            <Badge variant="outline" className="text-[10px] font-bold">
              {post.educationLevel}
            </Badge>
            {post.subject && (
              <Badge variant="outline" className="text-[10px] font-bold text-slate-500">
                {post.subject}
              </Badge>
            )}
          </div>
          <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-0.5">
            {new Date(post.createdAt).toLocaleDateString(undefined, {
              day: "numeric",
              month: "short",
              year: "numeric",
            })}
          </p>
        </div>
        {canDelete && onDelete && (
          <button
            type="button"
            onClick={() => onDelete(post.id)}
            className="rounded-xl p-2 text-slate-400 hover:bg-red-50 hover:text-red-600 transition-colors"
            aria-label={t("delete")}
          >
            <Trash2 className="h-4 w-4" />
          </button>
        )}
      </div>

      <h3 className="mt-4 text-lg font-black text-slate-900 leading-snug">{post.title}</h3>
      {post.description && (
        <p className="mt-2 text-sm text-slate-600 leading-relaxed whitespace-pre-wrap">{post.description}</p>
      )}

          {post.authoringResourceId && (
        <div className="mt-3 flex flex-wrap gap-2">
          {post.postType === "exercise" && post.authoringResourceKind !== "document" && viewerRole === "parent" && (
            <Link
              href={`/dashboard/parent/mur/jouer/${post.id}`}
              locale={locale}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-black text-white hover:bg-violet-500"
            >
              <Play className="h-4 w-4" />
              {t("playActivity")}
            </Link>
          )}
          {post.postType === "exercise" && post.authoringResourceKind !== "document" && viewerRole === "enseignant" && (
            <Link
              href={`/dashboard/enseignant/atelier/activite/${post.authoringResourceId}`}
              locale={locale}
              className="inline-flex items-center gap-2 rounded-xl bg-violet-600 px-4 py-2 text-sm font-black text-white hover:bg-violet-500"
            >
              <Play className="h-4 w-4" />
              {t("previewActivity")}
            </Link>
          )}
          <Link
            href={
              post.authoringResourceKind === "document"
                ? `/dashboard/enseignant/atelier/document/${post.authoringResourceId}`
                : `/dashboard/parent/atelier/${ATELIER_ACTIVITY_PATH}/${post.authoringResourceId}`
            }
            locale={locale}
            className={cn(
              "inline-flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-black text-white",
              isParent ? "bg-orange-500 hover:bg-orange-400" : "bg-teal-600 hover:bg-teal-500"
            )}
          >
            <ExternalLink className="h-4 w-4" />
            {t("openAtelierResource")}
          </Link>
        </div>
      )}

      {post.attachments.length > 0 && (
        <div className="mt-4 space-y-2">
          {post.attachments.map((att) => {
            const isImage = att.mimeType?.startsWith("image/");
            const downloadHref =
              pedagogyMediaApiUrl(att.fileUrl) ??
              att.fileUrl;
            return (
              <div
                key={att.id}
                className="flex items-center gap-3 rounded-2xl border border-slate-100 bg-slate-50 p-3"
              >
                <div className={cn("flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm", isParent ? "text-orange-600" : "text-teal-600")}>
                  {isImage ? <ImageIcon className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-bold text-slate-900">{att.fileName}</p>
                  <p className="text-[10px] font-bold uppercase text-slate-400">{t("attachment")}</p>
                </div>
                <a
                  href={downloadHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  download={att.fileName}
                  className={cn(
                    "inline-flex items-center gap-1 rounded-xl px-3 py-2 text-[10px] font-black uppercase text-white",
                    isParent ? "bg-orange-500 hover:bg-orange-400" : "bg-teal-600 hover:bg-teal-500"
                  )}
                >
                  <Download className="h-3.5 w-3.5" />
                  {t("download")}
                </a>
              </div>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex items-center gap-4 border-t border-slate-100 pt-4">
        <button
          type="button"
          disabled={liking}
          onClick={() => onLike(post.id)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-black transition-all",
            post.likedByMe
              ? "bg-rose-100 text-rose-600 scale-105"
              : "bg-slate-100 text-slate-600 hover:bg-rose-50 hover:text-rose-500"
          )}
        >
          <Heart className={cn("h-4 w-4", post.likedByMe && "fill-current")} />
          {post.likeCount}
        </button>
        <span className="inline-flex items-center gap-1.5 text-xs font-bold text-slate-400">
          <Eye className="h-4 w-4" />
          {post.viewCount} {t("views")}
        </span>
        <button
          type="button"
          onClick={() => setCommentsOpen((v) => !v)}
          className={cn(
            "inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-600",
            isParent ? "hover:bg-orange-50 hover:text-orange-700" : "hover:bg-teal-50 hover:text-teal-700"
          )}
        >
          <MessageCircle className="h-4 w-4" />
          {t("commentsToggle")}
        </button>
        <button
          type="button"
          onClick={() => void reportPost()}
          className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-1.5 text-xs font-black text-slate-500 hover:bg-amber-50 hover:text-amber-700"
        >
          <Flag className="h-4 w-4" />
          {t("reportPost")}
        </button>
      </div>

      {commentsOpen && (
        <div className="mt-4 space-y-3 border-t border-slate-100 pt-4">
          <p className="text-xs font-black uppercase text-slate-500">{t("commentsTitle")}</p>
          {commentsLoading ? (
            <p className="text-sm text-slate-400">{t("commentsLoading")}</p>
          ) : comments.length === 0 ? (
            <p className="text-sm text-slate-400">{t("commentsEmpty")}</p>
          ) : (
            <ul className="space-y-2">
              {comments.map((c) => (
                <li key={c.id} className="rounded-xl bg-slate-50 px-3 py-2 text-sm">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-slate-800">{c.author.fullName ?? "—"}</p>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => void reportComment(c.id)}
                        className="text-[10px] font-black uppercase text-amber-600"
                      >
                        {t("commentReport")}
                      </button>
                      {c.canDelete && (
                        <button
                          type="button"
                          onClick={() => void deleteComment(c.id)}
                          className="text-[10px] font-black uppercase text-red-500"
                        >
                          {t("commentDelete")}
                        </button>
                      )}
                    </div>
                  </div>
                  <p className="mt-1 whitespace-pre-wrap text-slate-600">{c.body}</p>
                  <p className="mt-1 text-[10px] text-slate-400">
                    {new Date(c.createdAt).toLocaleString(locale)}
                  </p>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2">
            <input
              value={commentBody}
              onChange={(e) => setCommentBody(e.target.value)}
              placeholder={t("commentPlaceholder")}
              className="min-w-0 flex-1 rounded-xl border border-slate-200 px-3 py-2 text-sm"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void submitComment();
                }
              }}
            />
            <button
              type="button"
              disabled={commentPending || !commentBody.trim()}
              onClick={() => void submitComment()}
              className={cn(
                "rounded-xl px-4 py-2 text-xs font-black text-white disabled:opacity-50",
                isParent ? "bg-orange-500 hover:bg-orange-400" : "bg-teal-600"
              )}
            >
              {t("commentSubmit")}
            </button>
          </div>
        </div>
      )}
    </motion.article>
  );
}

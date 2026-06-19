"use client";

import React, { useMemo, useState, useTransition } from "react";
import { useTranslations } from "next-intl";
import { hideCommentAction, hideMurCommentAction, blockChatMediaAction, hideChatMessageAction } from "@/lib/actions/admin_modules";
import { adminFieldClass } from "@/components/admin/adminFormStyles";
import { toast } from "sonner";
import {
  ChevronLeft,
  ChevronRight,
  Eye,
  FileAudio,
  FileText,
  Film,
  Search,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

type CommentRow = {
  id: number;
  body: string;
  reportCount: number;
  isHidden: boolean;
  createdAt: Date;
  userId: number;
  userName: string | null;
  userEmail: string | null;
};

type ChatRow = {
  id: number;
  body: string | null;
  reportCount?: number;
  isHidden?: boolean | null;
  createdAt: Date;
  senderId: number;
  senderName: string | null;
  senderEmail: string | null;
};

type MediaRow = {
  id: number;
  body: string | null;
  mediaUrl: string | null;
  mediaBlocked: boolean | null;
  createdAt: Date;
  senderId: number;
  messageType: string | null;
  senderName: string | null;
  senderEmail: string | null;
};

type MurCommentRow = CommentRow & { shareId: number; shareTitle: string | null };

type Tab = "comments" | "mur" | "media" | "chat" | "chatReported";

const PAGE_SIZE = 12;

function MediaPreview({
  item,
  onClose,
}: {
  item: MediaRow;
  onClose: () => void;
}) {
  const t = useTranslations("AdminMessages");
  const type = item.messageType ?? "file";
  const url = item.mediaUrl;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4" onClick={onClose}>
      <div
        className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-2xl bg-white p-4 shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          type="button"
          onClick={onClose}
          className="absolute right-3 top-3 rounded-lg bg-slate-100 p-2 hover:bg-slate-200"
        >
          <X className="h-4 w-4" />
        </button>
        <p className="mb-3 text-sm font-black text-slate-900">
          {item.senderName || item.senderEmail || `User #${item.senderId}`}
        </p>
        <p className="mb-4 text-xs text-slate-500">
          {type} · {new Date(item.createdAt).toLocaleString("fr-FR")}
        </p>
        {url && type === "image" && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={url} alt="" className="mx-auto max-h-[60vh] rounded-xl border border-slate-200 object-contain" />
        )}
        {url && (type === "video" || type === "voice") && (
          <video src={url} controls className="mx-auto max-h-[60vh] w-full rounded-xl bg-black" />
        )}
        {url && type === "audio" && <audio src={url} controls className="w-full" />}
        {url && type !== "image" && type !== "video" && type !== "voice" && type !== "audio" && (
          <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed border-slate-200 bg-slate-50 p-8">
            <FileText className="h-12 w-12 text-slate-400" />
            <p className="text-sm font-bold text-slate-700">{item.body || url.split("/").pop()}</p>
            <a href={url} target="_blank" rel="noopener noreferrer" className="text-sm font-black text-orange-600 hover:underline">
              {t("openFile")}
            </a>
          </div>
        )}
        {item.body && <p className="mt-4 text-sm text-slate-700">{item.body}</p>}
      </div>
    </div>
  );
}

function MediaThumb({ item, onPreview }: { item: MediaRow; onPreview: () => void }) {
  const type = item.messageType ?? "file";
  const blocked = item.mediaBlocked ?? false;

  return (
    <button
      type="button"
      onClick={onPreview}
      className={cn(
        "group relative aspect-square overflow-hidden rounded-xl border-2 bg-slate-100 text-left transition hover:border-orange-400",
        blocked ? "border-red-300 opacity-60" : "border-slate-200"
      )}
    >
      {type === "image" && item.mediaUrl && !blocked ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={item.mediaUrl} alt="" className="h-full w-full object-cover" />
      ) : (
        <div className="flex h-full flex-col items-center justify-center gap-1 p-2">
          {type === "video" || type === "voice" ? (
            <Film className="h-8 w-8 text-slate-400" />
          ) : type === "audio" ? (
            <FileAudio className="h-8 w-8 text-slate-400" />
          ) : (
            <FileText className="h-8 w-8 text-slate-400" />
          )}
          <span className="line-clamp-2 text-[10px] font-bold text-slate-600">
            {item.body || item.mediaUrl?.split("/").pop()}
          </span>
        </div>
      )}
      <span className="absolute inset-0 flex items-center justify-center bg-black/0 opacity-0 transition group-hover:bg-black/30 group-hover:opacity-100">
        <Eye className="h-6 w-6 text-white" />
      </span>
      {blocked && (
        <span className="absolute left-1 top-1 rounded bg-red-600 px-1.5 py-0.5 text-[9px] font-black uppercase text-white">
          Bloqué
        </span>
      )}
    </button>
  );
}

function Pagination({
  page,
  total,
  pageSize,
  onChange,
}: {
  page: number;
  total: number;
  pageSize: number;
  onChange: (p: number) => void;
}) {
  const pages = Math.max(1, Math.ceil(total / pageSize));
  if (pages <= 1) return null;

  return (
    <div className="mt-4 flex items-center justify-between gap-3">
      <p className="text-xs text-slate-500">
        {total} élément{total > 1 ? "s" : ""} · page {page}/{pages}
      </p>
      <div className="flex gap-2">
        <button
          type="button"
          disabled={page <= 1}
          onClick={() => onChange(page - 1)}
          className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-40"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <button
          type="button"
          disabled={page >= pages}
          onClick={() => onChange(page + 1)}
          className="rounded-lg border border-slate-200 bg-white p-2 disabled:opacity-40"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
}

export default function AdminMessagesClient({
  comments,
  murComments,
  chatPreview,
  reportedChat,
  mediaPreview,
  commentTotal,
  murCommentTotal,
  chatTotal,
  reportedChatTotal,
  mediaTotal,
}: {
  comments: CommentRow[];
  murComments: MurCommentRow[];
  chatPreview: ChatRow[];
  reportedChat: ChatRow[];
  mediaPreview: MediaRow[];
  commentTotal: number;
  murCommentTotal: number;
  chatTotal: number;
  reportedChatTotal: number;
  mediaTotal: number;
}) {
  const t = useTranslations("AdminMessages");
  const [pending, startTransition] = useTransition();
  const [tab, setTab] = useState<Tab>("comments");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [previewMedia, setPreviewMedia] = useState<MediaRow | null>(null);

  const filteredComments = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return comments;
    return comments.filter(
      (c) =>
        c.body.toLowerCase().includes(q) ||
        (c.userName ?? "").toLowerCase().includes(q) ||
        (c.userEmail ?? "").toLowerCase().includes(q)
    );
  }, [comments, search]);

  const filteredChat = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return chatPreview;
    return chatPreview.filter(
      (m) =>
        (m.body ?? "").toLowerCase().includes(q) ||
        (m.senderName ?? "").toLowerCase().includes(q) ||
        (m.senderEmail ?? "").toLowerCase().includes(q)
    );
  }, [chatPreview, search]);

  const filteredReported = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return reportedChat;
    return reportedChat.filter(
      (m) =>
        (m.body ?? "").toLowerCase().includes(q) ||
        (m.senderName ?? "").toLowerCase().includes(q) ||
        (m.senderEmail ?? "").toLowerCase().includes(q)
    );
  }, [reportedChat, search]);

  const filteredMur = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return murComments;
    return murComments.filter(
      (c) =>
        c.body.toLowerCase().includes(q) ||
        (c.userName ?? "").toLowerCase().includes(q) ||
        (c.shareTitle ?? "").toLowerCase().includes(q)
    );
  }, [murComments, search]);

  const pagedComments = filteredComments.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pagedMur = filteredMur.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pagedChat = filteredChat.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pagedReported = filteredReported.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const pagedMedia = mediaPreview.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  const total =
    tab === "comments"
      ? search
        ? filteredComments.length
        : commentTotal
      : tab === "mur"
        ? search
          ? filteredMur.length
          : murCommentTotal
      : tab === "chat"
        ? search
          ? filteredChat.length
          : chatTotal
        : tab === "chatReported"
          ? search
            ? filteredReported.length
            : reportedChatTotal
          : mediaTotal;

  const toggleHide = (id: number, hidden: boolean) => {
    startTransition(async () => {
      const res = await hideCommentAction(id, !hidden);
      if ("error" in res && res.error) toast.error(res.error);
      else toast.success(hidden ? t("toastCommentShown") : t("toastCommentHidden"));
    });
  };

  const toggleMediaBlock = (id: number, blocked: boolean) => {
    startTransition(async () => {
      const res = await blockChatMediaAction(id, !blocked);
      if ("error" in res && res.error) toast.error(res.error);
      else toast.success(blocked ? t("toastMediaUnblocked") : t("toastMediaBlocked"));
    });
  };

  const toggleChatHide = (id: number, hidden: boolean) => {
    startTransition(async () => {
      const res = await hideChatMessageAction(id, !hidden);
      if ("error" in res && res.error) toast.error(res.error);
      else toast.success(hidden ? t("toastChatShown") : t("toastChatHidden"));
    });
  };

  const toggleMurHide = (id: number, hidden: boolean) => {
    startTransition(async () => {
      const res = await hideMurCommentAction(id, !hidden);
      if ("error" in res && res.error) toast.error(res.error);
      else toast.success(hidden ? t("toastCommentShown") : t("toastCommentHidden"));
    });
  };

  const tabs: { id: Tab; label: string; count: number }[] = [
    { id: "comments", label: t("tabComments"), count: commentTotal },
    { id: "mur", label: t("tabMur"), count: murCommentTotal },
    { id: "chatReported", label: t("tabReported"), count: reportedChatTotal },
    { id: "media", label: t("tabMedia"), count: mediaTotal },
    { id: "chat", label: t("tabChat"), count: chatTotal },
  ];

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          {tabs.map((tabItem) => (
            <button
              key={tabItem.id}
              type="button"
              onClick={() => {
                setTab(tabItem.id);
                setPage(1);
              }}
              className={cn(
                "rounded-full px-4 py-2 text-xs font-black uppercase transition",
                tab === tabItem.id ? "bg-slate-900 text-white" : "bg-white text-slate-600 border border-slate-200"
              )}
            >
              {tabItem.label} ({tabItem.count})
            </button>
          ))}
        </div>
        <div className="relative max-w-xs flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            placeholder={t("search")}
            className={`w-full py-2 pl-10 pr-3 ${adminFieldClass}`}
          />
        </div>
      </div>

      {tab === "comments" && (
        <section>
          {pagedComments.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              {t("emptyComments")}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b bg-slate-50 text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">{t("colUser")}</th>
                    <th className="px-4 py-3">{t("colComment")}</th>
                    <th className="px-4 py-3">{t("colReports")}</th>
                    <th className="px-4 py-3">{t("colStatus")}</th>
                    <th className="px-4 py-3">{t("colAction")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedComments.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 align-top">
                        <p className="font-bold text-slate-900">{c.userName || "—"}</p>
                        <p className="text-xs text-slate-500">{c.userEmail}</p>
                      </td>
                      <td className="px-4 py-3 align-top max-w-md">
                        <p className="text-slate-800">{c.body.slice(0, 300)}</p>
                        <p className="mt-1 text-[10px] text-slate-400">
                          {new Date(c.createdAt).toLocaleString("fr-FR")}
                        </p>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-black text-red-800">
                          {c.reportCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className={cn("text-xs font-bold", c.isHidden ? "text-amber-700" : "text-emerald-700")}>
                          {c.isHidden ? t("statusHidden") : t("statusVisible")}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => toggleHide(c.id, c.isHidden)}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-black uppercase text-white"
                        >
                          {c.isHidden ? t("show") : t("hide")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
        </section>
      )}

      {tab === "mur" && (
        <section>
          {pagedMur.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              {t("emptyMurComments")}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[720px] text-left text-sm">
                <thead className="border-b bg-slate-50 text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">{t("colUser")}</th>
                    <th className="px-4 py-3">{t("colMurPost")}</th>
                    <th className="px-4 py-3">{t("colComment")}</th>
                    <th className="px-4 py-3">{t("colReports")}</th>
                    <th className="px-4 py-3">{t("colAction")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedMur.map((c) => (
                    <tr key={c.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 align-top">
                        <p className="font-bold text-slate-900">{c.userName || "—"}</p>
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-slate-600">{c.shareTitle ?? `#${c.shareId}`}</td>
                      <td className="px-4 py-3 align-top max-w-md">{c.body.slice(0, 200)}</td>
                      <td className="px-4 py-3 align-top">
                        <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-black text-red-800">
                          {c.reportCount}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => toggleMurHide(c.id, c.isHidden)}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-xs font-black text-white"
                        >
                          {c.isHidden ? t("show") : t("hide")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
        </section>
      )}

      {tab === "media" && (
        <section>
          {pagedMedia.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              {t("emptyMedia")}
            </p>
          ) : (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6">
              {pagedMedia.map((m) => (
                <div key={m.id} className="space-y-2">
                  <MediaThumb item={m} onPreview={() => setPreviewMedia(m)} />
                  <p className="truncate text-[10px] font-bold text-slate-700">
                    {m.senderName || m.senderEmail || `#${m.senderId}`}
                  </p>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => toggleMediaBlock(m.id, m.mediaBlocked ?? false)}
                    className={cn(
                      "w-full rounded-lg px-2 py-1 text-[10px] font-black uppercase text-white",
                      m.mediaBlocked ? "bg-emerald-600" : "bg-red-600"
                    )}
                  >
                    {m.mediaBlocked ? t("unblock") : t("block")}
                  </button>
                </div>
              ))}
            </div>
          )}
          <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
        </section>
      )}

      {tab === "chatReported" && (
        <section>
          {pagedReported.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              {t("emptyReported")}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b bg-slate-50 text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">{t("colSender")}</th>
                    <th className="px-4 py-3">{t("colMessage")}</th>
                    <th className="px-4 py-3">{t("colReports")}</th>
                    <th className="px-4 py-3">{t("colStatus")}</th>
                    <th className="px-4 py-3">{t("colDate")}</th>
                    <th className="px-4 py-3">{t("colAction")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedReported.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 align-top">
                        <p className="font-bold text-slate-900">{m.senderName || "—"}</p>
                        <p className="text-xs text-slate-500">{m.senderEmail}</p>
                      </td>
                      <td className="px-4 py-3 align-top max-w-lg text-slate-800">{(m.body ?? "").slice(0, 200)}</td>
                      <td className="px-4 py-3 align-top">
                        <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-black text-red-800">
                          {m.reportCount ?? 0}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className={cn("text-xs font-bold", m.isHidden ? "text-amber-700" : "text-emerald-700")}>
                          {m.isHidden ? t("statusHidden") : t("statusVisible")}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-slate-500 whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => toggleChatHide(m.id, m.isHidden ?? false)}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-black uppercase text-white"
                        >
                          {m.isHidden ? t("show") : t("hide")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
        </section>
      )}

      {tab === "chat" && (
        <section>
          {pagedChat.length === 0 ? (
            <p className="rounded-2xl border border-slate-200 bg-white p-8 text-center text-sm text-slate-500">
              {t("emptyChat")}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="border-b bg-slate-50 text-[10px] font-black uppercase text-slate-500">
                  <tr>
                    <th className="px-4 py-3">{t("colSender")}</th>
                    <th className="px-4 py-3">{t("colMessage")}</th>
                    <th className="px-4 py-3">{t("colReports")}</th>
                    <th className="px-4 py-3">{t("colStatus")}</th>
                    <th className="px-4 py-3">{t("colDate")}</th>
                    <th className="px-4 py-3">{t("colAction")}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {pagedChat.map((m) => (
                    <tr key={m.id} className="hover:bg-slate-50/80">
                      <td className="px-4 py-3 align-top">
                        <p className="font-bold text-slate-900">{m.senderName || "—"}</p>
                        <p className="text-xs text-slate-500">{m.senderEmail}</p>
                      </td>
                      <td className="px-4 py-3 align-top max-w-lg text-slate-800">{(m.body ?? "").slice(0, 200)}</td>
                      <td className="px-4 py-3 align-top">
                        {(m.reportCount ?? 0) > 0 ? (
                          <span className="inline-flex rounded-full bg-red-100 px-2 py-1 text-xs font-black text-red-800">
                            {m.reportCount}
                          </span>
                        ) : (
                          "—"
                        )}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <span className={cn("text-xs font-bold", m.isHidden ? "text-amber-700" : "text-emerald-700")}>
                          {m.isHidden ? t("statusHidden") : t("statusVisible")}
                        </span>
                      </td>
                      <td className="px-4 py-3 align-top text-xs text-slate-500 whitespace-nowrap">
                        {new Date(m.createdAt).toLocaleString("fr-FR")}
                      </td>
                      <td className="px-4 py-3 align-top">
                        <button
                          type="button"
                          disabled={pending}
                          onClick={() => toggleChatHide(m.id, m.isHidden ?? false)}
                          className="rounded-lg bg-slate-900 px-3 py-1.5 text-[10px] font-black uppercase text-white"
                        >
                          {m.isHidden ? t("show") : t("hide")}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          <Pagination page={page} total={total} pageSize={PAGE_SIZE} onChange={setPage} />
        </section>
      )}

      {previewMedia && <MediaPreview item={previewMedia} onClose={() => setPreviewMedia(null)} />}
    </div>
  );
}

"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { Star, X } from "lucide-react";
import { toast } from "sonner";
import type { Locator } from "@readium/shared";

type ReaderMark = {
  id: number;
  locator: Locator;
  label: string | null;
  kind: string;
  noteText?: string | null;
  createdAt: string;
};

type Annex = { id: number; title: string; url: string; kind: string };
type Related = { id: number; title: string; author: string | null };
type TeacherReview = {
  id: number;
  userName: string | null;
  rating: number;
  comment: string | null;
};

type Props = {
  open: boolean;
  onClose: () => void;
  tab: "marks" | "review" | "plus";
  onTab: (t: "marks" | "review" | "plus") => void;
  marks: ReaderMark[];
  bookmarks: ReaderMark[];
  highlights: ReaderMark[];
  notes: ReaderMark[];
  onJump: (loc: Locator) => void;
  onRemove: (id: number) => void;
  userId?: number | null;
  bookId: number;
  bookTitle: string;
  readerRole?: "parent" | "teacher" | "child";
  relatedBasePath?: string;
};

export default function LibraryReaderSidePanel({
  open,
  onClose,
  tab,
  onTab,
  marks,
  bookmarks,
  highlights,
  notes,
  onJump,
  onRemove,
  userId,
  bookId,
  bookTitle,
  readerRole,
  relatedBasePath,
}: Props) {
  const tr = useTranslations("Library.reader");
  const tp = useTranslations("Library.sidePanel");
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [visibility, setVisibility] = useState(readerRole === "teacher" ? "teachers" : "private");
  const [annexes, setAnnexes] = useState<Annex[]>([]);
  const [related, setRelated] = useState<Related[]>([]);
  const [teacherReviews, setTeacherReviews] = useState<TeacherReview[]>([]);
  const deepenAccent = readerRole === "parent" ? "text-orange-400" : "text-teal-400";
  const deepenLink = readerRole === "parent" ? "text-orange-200" : "text-teal-200";

  useEffect(() => {
    if (!open) return;
    void fetch(`/api/library/books/${bookId}/meta`)
      .then((r) => r.json())
      .then((data: {
        annexes?: Annex[];
        related?: Related[];
        teacherReviews?: TeacherReview[];
      }) => {
        setAnnexes(data.annexes ?? []);
        setRelated(data.related ?? []);
        setTeacherReviews(data.teacherReviews ?? []);
      })
      .catch(() => undefined);
  }, [open, bookId]);

  useEffect(() => {
    if (!userId || !open) return;
    void fetch(`/api/library/user/reviews?userId=${userId}&bookId=${bookId}`)
      .then((r) => r.json())
      .then((data: { review?: { rating: number; comment: string | null; visibility: string } }) => {
        if (data.review) {
          setRating(data.review.rating);
          setComment(data.review.comment ?? "");
          setVisibility(data.review.visibility);
        }
      })
      .catch(() => undefined);
  }, [userId, bookId, open]);

  const saveReview = async () => {
    if (!userId || rating < 1) {
      toast.error(tp("reviewRatingRequired"));
      return;
    }
    try {
      const res = await fetch("/api/library/user/reviews", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, bookId, rating, comment, visibility }),
      });
      if (!res.ok) throw new Error();
      toast.success(tp("reviewSaved"));
    } catch {
      toast.error(tp("reviewSaveFailed"));
    }
  };

  const exportMd = () => {
    if (!userId) return;
    window.open(`/api/library/user/export?userId=${userId}&bookId=${bookId}`, "_blank");
  };

  const exportPdf = () => {
    if (!userId) return;
    window.open(`/api/library/user/export?userId=${userId}&bookId=${bookId}&format=pdf`, "_blank");
  };

  if (!open) return null;

  return (
    <aside className="absolute inset-y-0 right-0 z-30 flex w-full max-w-sm flex-col border-l border-white/10 bg-slate-900/95 shadow-2xl backdrop-blur-md sm:relative sm:w-96">
      <div className="flex items-center justify-between border-b border-white/10 px-4 py-3">
        <div className="flex gap-1">
          {(["marks", "review", "plus"] as const).map((tkey) => (
            <button
              key={tkey}
              type="button"
              onClick={() => onTab(tkey)}
              className={`rounded-lg px-2 py-1 text-[10px] font-black uppercase ${
                tab === tkey ? "bg-violet-600 text-white" : "text-slate-400 hover:bg-white/10"
              }`}
            >
              {tkey === "marks" ? tp("tabMarks") : tkey === "review" ? tp("tabReview") : tp("tabMore")}
            </button>
          ))}
        </div>
        <button type="button" onClick={onClose} className="rounded-lg p-1 text-slate-400 hover:text-white">
          <X className="h-4 w-4" />
        </button>
      </div>

      <div className="flex-1 overflow-y-auto p-3">
        {tab === "marks" && (
          <>
            {marks.length === 0 ? (
              <p className="py-8 text-center text-xs text-slate-400">{tp("noMarks")}</p>
            ) : (
              <div className="space-y-4">
                {bookmarks.length > 0 && (
                  <MarkList
                    title={tp("bookmarks")}
                    deleteLabel={tp("deleteMark")}
                    items={bookmarks}
                    onJump={onJump}
                    onRemove={onRemove}
                  />
                )}
                {highlights.length > 0 && (
                  <MarkList
                    title={tp("highlights")}
                    deleteLabel={tp("deleteMark")}
                    items={highlights}
                    onJump={onJump}
                    onRemove={onRemove}
                    yellow
                  />
                )}
                {notes.length > 0 && (
                  <MarkList
                    title={tp("notes")}
                    deleteLabel={tp("deleteMark")}
                    items={notes}
                    onJump={onJump}
                    onRemove={onRemove}
                    blue
                  />
                )}
              </div>
            )}
          </>
        )}

        {tab === "review" && userId && (
          <div className="space-y-4">
            <p className="text-xs font-bold text-slate-300">{tp("myReview", { title: bookTitle })}</p>
            <div className="flex gap-1">
              {[1, 2, 3, 4, 5].map((n) => (
                <button key={n} type="button" onClick={() => setRating(n)}>
                  <Star
                    className={`h-6 w-6 ${n <= rating ? "fill-amber-400 text-amber-400" : "text-slate-600"}`}
                  />
                </button>
              ))}
            </div>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder={tp("reviewPlaceholder")}
              className="h-24 w-full rounded-xl border border-white/10 bg-white/5 p-3 text-xs text-white placeholder:text-slate-500"
            />
            {readerRole === "teacher" && (
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white"
              >
                <option value="private">{tp("visibilityPrivate")}</option>
                <option value="teachers">{tp("visibilityTeachers")}</option>
                <option value="school">{tp("visibilitySchool")}</option>
              </select>
            )}
            {readerRole === "parent" && (
              <select
                value={visibility}
                onChange={(e) => setVisibility(e.target.value)}
                className="w-full rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white"
              >
                <option value="private">{tp("visibilityPrivate")}</option>
                <option value="parents">{tp("visibilityParents")}</option>
              </select>
            )}
            <button
              type="button"
              onClick={() => void saveReview()}
              className="w-full rounded-xl bg-violet-600 py-2 text-xs font-black uppercase text-white"
            >
              {tp("saveReview")}
            </button>
            {teacherReviews.length > 0 && (
              <div className="border-t border-white/10 pt-4">
                <p className="mb-2 text-[10px] font-black uppercase text-slate-400">{tp("colleagueReviews")}</p>
                {teacherReviews.map((r) => (
                  <div key={r.id} className="mb-2 rounded-xl border border-white/10 bg-white/5 p-3">
                    <p className="text-[10px] font-bold text-violet-300">
                      {r.userName} · {"★".repeat(r.rating)}
                    </p>
                    {r.comment && <p className="mt-1 text-xs text-slate-300">{r.comment}</p>}
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {tab === "plus" && (
          <div className="space-y-6">
            {userId && (
              <>
                <button
                  type="button"
                  onClick={exportMd}
                  className="w-full rounded-xl border border-white/15 bg-white/5 py-2 text-xs font-black uppercase text-white hover:bg-white/10"
                >
                  {tr("exportMd")}
                </button>
                <button
                  type="button"
                  onClick={exportPdf}
                  className="w-full rounded-xl border border-orange-400/30 bg-orange-500/10 py-2 text-xs font-black uppercase text-orange-200 hover:bg-orange-500/20"
                >
                  {tr("exportPdf")}
                </button>
              </>
            )}
            {annexes.length > 0 && (
              <section>
                <p className={`mb-2 text-[10px] font-black uppercase ${deepenAccent}`}>{tp("deepen")}</p>
                <ul className="space-y-2">
                  {annexes.map((a) => (
                    <li key={a.id}>
                      <a
                        href={a.url}
                        target="_blank"
                        rel="noreferrer"
                        className={`block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs font-bold ${deepenLink} hover:bg-white/10`}
                      >
                        {a.title}
                      </a>
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {related.length > 0 && relatedBasePath && (
              <section>
                <p className="mb-2 text-[10px] font-black uppercase text-orange-400">{tp("related")}</p>
                <ul className="space-y-2">
                  {related.map((b) => (
                    <li key={b.id}>
                      <Link
                        href={`${relatedBasePath}/${b.id}`}
                        className="block rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-xs text-white hover:bg-white/10"
                      >
                        <span className="font-bold">{b.title}</span>
                        {b.author && <span className="text-slate-400"> — {b.author}</span>}
                      </Link>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}
      </div>
    </aside>
  );
}

function MarkList({
  title,
  deleteLabel,
  items,
  onJump,
  onRemove,
  yellow,
  blue,
}: {
  title: string;
  deleteLabel: string;
  items: ReaderMark[];
  onJump: (loc: Locator) => void;
  onRemove: (id: number) => void;
  yellow?: boolean;
  blue?: boolean;
}) {
  return (
    <section>
      <p
        className={`mb-2 text-[10px] font-black uppercase ${yellow ? "text-yellow-400" : blue ? "text-blue-400" : "text-amber-400"}`}
      >
        {title}
      </p>
      <ul className="space-y-2">
        {items.map((mark) => (
          <li
            key={mark.id}
            className={`rounded-xl border p-3 ${yellow ? "border-yellow-500/20 bg-yellow-500/10" : blue ? "border-blue-500/20 bg-blue-500/10" : "border-white/10 bg-white/5"}`}
          >
            <button
              type="button"
              onClick={() => onJump(mark.locator)}
              className="w-full text-left text-xs font-bold text-white hover:opacity-80"
            >
              {mark.label || title}
            </button>
            {mark.noteText && <p className="mt-1 text-[11px] text-slate-300">{mark.noteText}</p>}
            <div className="mt-2 flex justify-end">
              <button
                type="button"
                onClick={() => void onRemove(mark.id)}
                className="text-[10px] font-bold text-red-400"
              >
                {deleteLabel}
              </button>
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}

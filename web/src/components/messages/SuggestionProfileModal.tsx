"use client";

import React, { useEffect, useState } from "react";
import { Loader2, MessageCircle, Send, User, X, ExternalLink } from "lucide-react";
import { Link } from "@/i18n/routing";
import { cn } from "@/lib/utils";
import TeacherAvatarDisplay from "@/components/teacher/TeacherAvatarDisplay";

export type ProfileData = {
  id: number;
  fullName: string | null;
  username: string | null;
  role: string | null;
  image: string | null;
  isOnline: boolean;
  schoolName: string | null;
  canMessage: boolean;
  teacherCard?: {
    bio: string | null;
    subjects: string[];
    levels: string[];
    publicProfileHref: string;
  };
};

type Props = {
  open: boolean;
  userId: number | null;
  locale: string;
  isRTL: boolean;
  t: (key: string, values?: Record<string, string>) => string;
  onClose: () => void;
  onStartChat: (userId: number) => void;
  onInvite: (userId: number) => Promise<void>;
};

function roleLabel(role: string | null, t: (k: string) => string) {
  if (role === "enseignant") return t("roleTeacher");
  if (role === "ecole") return t("roleSchool");
  if (role === "ong") return t("roleNgo");
  if (role === "parent" || role === "coparent") return t("roleParent");
  return t("roleMember");
}

export default function SuggestionProfileModal({
  open,
  userId,
  isRTL,
  t,
  onClose,
  onStartChat,
  onInvite,
}: Props) {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(false);
  const [inviting, setInviting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!open || !userId) {
      setProfile(null);
      setError(null);
      return;
    }

    let cancelled = false;
    setLoading(true);
    fetch(`/api/chat/users/${userId}/profile`)
      .then(async (res) => {
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t("errorGeneric"));
        if (!cancelled) setProfile(data.profile);
      })
      .catch((e) => {
        if (!cancelled) setError(e instanceof Error ? e.message : t("errorGeneric"));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [open, userId, t]);

  if (!open) return null;

  const name = profile?.fullName?.trim() || profile?.username || "?";
  const card = profile?.teacherCard;

  return (
    <div className="fixed inset-0 z-[400] flex items-end justify-center bg-black/45 p-4 sm:items-center">
      <div className={cn("w-full max-w-md rounded-3xl bg-white p-6 shadow-2xl", isRTL && "font-ui-ar text-right")}>
        <div className={cn("mb-4 flex items-start justify-between gap-3", isRTL && "flex-row-reverse")}>
          <div className={cn("flex items-center gap-2", isRTL && "flex-row-reverse")}>
            <User className="h-5 w-5 text-amber-600" />
            <h2 className="text-lg font-black text-slate-900">{t("profilePreviewTitle")}</h2>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 hover:bg-slate-100">
            <X className="h-5 w-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex justify-center py-10">
            <Loader2 className="h-7 w-7 animate-spin text-amber-500" />
          </div>
        ) : error ? (
          <p className="py-6 text-center text-sm text-red-600">{error}</p>
        ) : profile ? (
          <>
            <div className={cn("flex items-center gap-4", isRTL && "flex-row-reverse")}>
              {profile.role === "enseignant" ? (
                <TeacherAvatarDisplay
                  fullName={name}
                  image={profile.image}
                  avatarConfig={null}
                  avatarMode={profile.image ? "photo" : "catalog"}
                  size="md"
                />
              ) : (
                <div className="relative flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-100 to-orange-100 text-xl font-black text-amber-800">
                  {profile.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={profile.image} alt="" className="h-full w-full rounded-2xl object-cover" />
                  ) : (
                    name[0]?.toUpperCase()
                  )}
                  {profile.isOnline && (
                    <span className="absolute -bottom-0.5 -end-0.5 h-3.5 w-3.5 rounded-full border-2 border-white bg-emerald-500" />
                  )}
                </div>
              )}
              <div className="min-w-0">
                <p className="truncate text-lg font-black text-slate-900">{name}</p>
                {profile.username && <p className="truncate text-sm text-slate-500">@{profile.username}</p>}
                <p className="mt-1 text-xs font-semibold text-amber-700">{roleLabel(profile.role, t)}</p>
                {profile.schoolName && (
                  <p className={cn("mt-0.5 text-xs text-slate-500", isRTL && "font-lateef")}>{profile.schoolName}</p>
                )}
              </div>
            </div>

            {card && (
              <div className="mt-4 space-y-3 rounded-2xl border border-teal-100 bg-teal-50/50 p-4">
                {card.bio && (
                  <p className={cn("text-sm italic text-slate-600 line-clamp-3", isRTL && "font-lateef")}>
                    &ldquo;{card.bio}&rdquo;
                  </p>
                )}
                {(card.subjects.length > 0 || card.levels.length > 0) && (
                  <div className="flex flex-wrap gap-1.5">
                    {card.subjects.map((s) => (
                      <span key={s} className="rounded-full bg-white px-2.5 py-0.5 text-[10px] font-bold text-teal-800">
                        {s}
                      </span>
                    ))}
                    {card.levels.map((l) => (
                      <span key={l} className="rounded-full bg-teal-600/10 px-2.5 py-0.5 text-[10px] font-bold text-teal-700">
                        {l}
                      </span>
                    ))}
                  </div>
                )}
                <Link
                  href={card.publicProfileHref}
                  onClick={onClose}
                  className="inline-flex items-center gap-1.5 text-xs font-black text-teal-600 hover:underline"
                >
                  <ExternalLink className="h-3.5 w-3.5" />
                  {t("viewFullProfile")}
                </Link>
              </div>
            )}

            {!card && (
              <p className={cn("mt-4 text-sm leading-relaxed text-slate-600", isRTL && "font-lateef")}>
                {t("profilePreviewHint")}
              </p>
            )}

            <div className={cn("mt-5 flex flex-wrap gap-2", isRTL && "flex-row-reverse")}>
              {profile.canMessage ? (
                <button
                  type="button"
                  onClick={() => {
                    onStartChat(profile.id);
                    onClose();
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-violet-600 px-4 py-2.5 text-sm font-bold text-white hover:bg-violet-700"
                >
                  <MessageCircle className="h-4 w-4" />
                  {t("suggestionAccept")}
                </button>
              ) : (
                <button
                  type="button"
                  disabled={inviting}
                  onClick={async () => {
                    setInviting(true);
                    try {
                      await onInvite(profile.id);
                    } finally {
                      setInviting(false);
                    }
                  }}
                  className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-amber-500 px-4 py-2.5 text-sm font-bold text-white hover:bg-amber-600 disabled:opacity-60"
                >
                  {inviting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                  {t("sendInvite")}
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="rounded-xl border border-slate-200 px-4 py-2.5 text-sm font-semibold text-slate-600 hover:bg-slate-50"
              >
                {t("profileClose")}
              </button>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
}

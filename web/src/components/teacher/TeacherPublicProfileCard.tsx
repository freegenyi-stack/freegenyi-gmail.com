"use client";

import React from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/i18n/routing";
import {
  Award,
  BookOpen,
  Calendar,
  Eye,
  Heart,
  MessageCircle,
  Sparkles,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeacherPublicProfile } from "@/lib/teacher/profile.types";
import TeacherAvatarDisplay from "./TeacherAvatarDisplay";
import { Button } from "@/components/ui/button";

type Props = {
  profile: TeacherPublicProfile;
  showActions?: boolean;
  viewerRole?: string | null;
};

function isParentViewer(role?: string | null) {
  return role === "parent" || role === "coparent";
}

export default function TeacherPublicProfileCard({ profile, showActions = true, viewerRole }: Props) {
  const t = useTranslations("TeacherProfile");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const parentView = isParentViewer(viewerRole);

  const visibleChannels = profile.contactEnabled
    ? Object.entries(profile.contactChannels || {}).filter(([, v]) => v?.visible && v?.value)
    : [];

  return (
    <div className="overflow-hidden rounded-[2rem] border border-slate-100 bg-white shadow-xl">
      <div
        className={cn(
          "px-6 py-8 text-white",
          parentView
            ? "bg-gradient-to-br from-orange-600 via-amber-600 to-orange-800"
            : "bg-gradient-to-br from-teal-600 via-emerald-600 to-teal-800"
        )}
      >
        <div className={cn("flex flex-col items-center gap-4 sm:flex-row sm:items-start", isRTL && "sm:flex-row-reverse")}>
          <TeacherAvatarDisplay
            fullName={profile.fullName}
            image={profile.image}
            avatarConfig={profile.avatarConfig}
            avatarMode={profile.avatarMode}
            size="xl"
            className="ring-4 ring-white/30"
          />
          <div className={cn("flex-1 text-center sm:text-start", isRTL && "sm:text-right")}>
            <h2 className="text-2xl font-black">{profile.fullName}</h2>
            {profile.username && (
              <p className={cn("text-sm", parentView ? "text-orange-100" : "text-teal-100")}>@{profile.username}</p>
            )}
            <div className="mt-3 flex flex-wrap justify-center gap-2 sm:justify-start">
              {profile.subjects.map((s) => (
                <span key={s} className="rounded-full bg-white/20 px-3 py-1 text-[10px] font-black uppercase">
                  {s}
                </span>
              ))}
              {profile.levels.map((l) => (
                <span key={l} className="rounded-full bg-white/15 px-3 py-1 text-[10px] font-bold">
                  {l}
                </span>
              ))}
            </div>
            {profile.schoolName && (
              <p className={cn("mt-2 text-sm font-medium", parentView ? "text-orange-50" : "text-teal-50")}>
                {profile.schoolName}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="p-6 space-y-6">
        {profile.bio && (
          <p className="text-sm leading-relaxed text-slate-600 italic">&ldquo;{profile.bio}&rdquo;</p>
        )}

        <div className="grid grid-cols-3 gap-3">
          <Stat icon={Sparkles} label={t("statPosts")} value={profile.stats.publications} parentView={parentView} />
          <Stat icon={Eye} label={t("statViews")} value={profile.stats.views} parentView={parentView} />
          <Stat icon={Heart} label={t("statLikes")} value={profile.stats.likes} parentView={parentView} />
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-3 rounded-2xl bg-amber-50 p-4 border border-amber-100">
            <Trophy className="h-8 w-8 text-amber-600" />
            <div>
              <p className="text-[10px] font-black uppercase text-amber-800">{t("rankPosts")}</p>
              <p className="text-xl font-black text-amber-900">
                #{profile.stats.rankPosts}
                <span className="text-xs font-bold text-amber-700"> / {profile.stats.totalTeachers}</span>
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl bg-rose-50 p-4 border border-rose-100">
            <Award className="h-8 w-8 text-rose-600" />
            <div>
              <p className="text-[10px] font-black uppercase text-rose-800">{t("rankLikes")}</p>
              <p className="text-xl font-black text-rose-900">
                #{profile.stats.rankLikes}
                <span className="text-xs font-bold text-rose-700"> / {profile.stats.totalTeachers}</span>
              </p>
            </div>
          </div>
        </div>

        {profile.availability?.enabled && profile.availability.slots.length > 0 && (
          <div
            className={cn(
              "rounded-2xl border p-4",
              parentView ? "border-orange-100 bg-orange-50/50" : "border-teal-100 bg-teal-50/50"
            )}
          >
            <div className="mb-3 flex items-center gap-2">
              <Calendar className={cn("h-4 w-4", parentView ? "text-orange-600" : "text-teal-600")} />
              <p className={cn("text-sm font-black", parentView ? "text-orange-900" : "text-teal-900")}>
                {t("availabilityTitle")}
              </p>
            </div>
            <ul className="space-y-1">
              {profile.availability.slots.map((slot, i) => (
                <li key={i} className={cn("text-xs font-bold", parentView ? "text-orange-800" : "text-teal-800")}>
                  {t(`days.${slot.day}`)} · {slot.from} – {slot.to}
                </li>
              ))}
            </ul>
            {profile.availability.acceptsTutoring && (
              <p
                className={cn(
                  "mt-3 inline-flex items-center gap-1 rounded-full px-3 py-1 text-[10px] font-black uppercase text-white",
                  parentView ? "bg-orange-600" : "bg-teal-600"
                )}
              >
                <BookOpen className="h-3 w-3" />
                {t("acceptsTutoring")}
              </p>
            )}
          </div>
        )}

        {profile.contactEnabled && profile.contactNote && (
          <p className="text-xs font-medium text-slate-500">{profile.contactNote}</p>
        )}

        {visibleChannels.length > 0 && (
          <div className="flex flex-wrap gap-2">
            {visibleChannels.map(([key, ch]) => (
              <span key={key} className="rounded-xl bg-slate-100 px-3 py-1.5 text-[10px] font-bold text-slate-700 capitalize">
                {key}: {ch!.value}
              </span>
            ))}
          </div>
        )}

        {showActions && !profile.isOwnProfile && (
          <div className="flex flex-wrap gap-3 pt-2">
            {profile.canMessage ? (
              <Link href={`/dashboard/messages?u=${profile.id}`} className="flex-1">
                <Button
                  className={cn(
                    "w-full rounded-2xl py-6 font-black uppercase",
                    parentView ? "bg-orange-600 hover:bg-orange-500" : "bg-teal-600 hover:bg-teal-500"
                  )}
                >
                  <MessageCircle className="mr-2 h-4 w-4" />
                  {t("messageCta")}
                </Button>
              </Link>
            ) : (
              <p className="text-xs text-slate-500">{t("messageUnavailable")}</p>
            )}
          </div>
        )}

        {profile.isOwnProfile && (
          <p className={cn("text-center text-xs font-bold", parentView ? "text-orange-600" : "text-teal-600")}>
            {t("previewNote")}
          </p>
        )}
      </div>
    </div>
  );
}

function Stat({
  icon: Icon,
  label,
  value,
  parentView,
}: {
  icon: React.ElementType;
  label: string;
  value: number;
  parentView?: boolean;
}) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-3 text-center">
      <Icon className={cn("mx-auto mb-1 h-4 w-4", parentView ? "text-orange-600" : "text-teal-600")} />
      <p className="text-xl font-black text-slate-900">{value}</p>
      <p className="text-[9px] font-black uppercase text-slate-400">{label}</p>
    </div>
  );
}

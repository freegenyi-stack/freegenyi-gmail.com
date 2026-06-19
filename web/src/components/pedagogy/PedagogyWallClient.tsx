"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useTranslations } from "next-intl";
import { Sparkles, TrendingUp, Trophy } from "lucide-react";
import { toast } from "sonner";
import ShareComposer from "./ShareComposer";
import SharePostCard from "./SharePostCard";
import { TeacherPageHeader } from "@/components/teacher/TeacherShell";
import { ParentPageHeader } from "@/components/parent/ParentShell";
import { cn } from "@/lib/utils";
import type { PedagogyShareDto } from "@/lib/pedagogy/types";
import { PEDAGOGY_LEVELS } from "@/lib/pedagogy/constants";

type Props = {
  role: "enseignant" | "parent";
  defaultLevel?: string;
  defaultSubject?: string;
  childLevels?: string[];
  canPublish?: boolean;
  publishBlockedMessage?: string;
};

export default function PedagogyWallClient({
  role,
  defaultLevel,
  defaultSubject,
  childLevels = [],
  canPublish = true,
  publishBlockedMessage,
}: Props) {
  const t = useTranslations("PedagogyWall");
  const isTeacher = role === "enseignant";

  const [shares, setShares] = useState<PedagogyShareDto[]>([]);
  const [loading, setLoading] = useState(true);
  const [levelFilter, setLevelFilter] = useState<string>("all");
  const [mineOnly, setMineOnly] = useState(false);
  const [likingId, setLikingId] = useState<number | null>(null);
  const [stats, setStats] = useState({ publications: 0, views: 0, likes: 0 });
  const [leaderboard, setLeaderboard] = useState<
    { rank: number; authorId: number; fullName: string; posts: number; likes: number }[]
  >([]);

  const loadShares = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (levelFilter !== "all") params.set("level", levelFilter);
      if (mineOnly && isTeacher) params.set("mine", "1");
      const res = await fetch(`/api/pedagogy/shares?${params.toString()}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t("errGeneric"));
        return;
      }
      setShares(data.shares ?? []);
      if (isTeacher && !mineOnly) {
        const [mineRes, lbRes] = await Promise.all([
          fetch("/api/pedagogy/shares?mine=1", { cache: "no-store" }),
          fetch("/api/pedagogy/shares?leaderboard=1", { cache: "no-store" }),
        ]);
        const mineData = await mineRes.json();
        const lbData = await lbRes.json();
        const mine = mineData.shares ?? [];
        setStats({
          publications: mine.length,
          views: mine.reduce((a: number, s: PedagogyShareDto) => a + s.viewCount, 0),
          likes: mine.reduce((a: number, s: PedagogyShareDto) => a + s.likeCount, 0),
        });
        setLeaderboard(lbData.leaderboard ?? []);
      }
    } catch {
      toast.error(t("errGeneric"));
    } finally {
      setLoading(false);
    }
  }, [levelFilter, mineOnly, isTeacher, t]);

  useEffect(() => {
    void loadShares();
  }, [loadShares]);

  const handleLike = async (id: number) => {
    setLikingId(id);
    try {
      const res = await fetch(`/api/pedagogy/shares/${id}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "like" }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || t("errGeneric"));
        return;
      }
      setShares((prev) =>
        prev.map((s) =>
          s.id === id ? { ...s, likedByMe: data.liked, likeCount: data.likeCount } : s
        )
      );
    } finally {
      setLikingId(null);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm(t("deleteConfirm"))) return;
    const res = await fetch(`/api/pedagogy/shares/${id}`, { method: "DELETE" });
    const data = await res.json();
    if (!res.ok) {
      toast.error(data.error || t("errGeneric"));
      return;
    }
    toast.success(t("deleted"));
    void loadShares();
  };

  const levelOptions = isTeacher ? PEDAGOGY_LEVELS : [...new Set(childLevels.length ? childLevels : PEDAGOGY_LEVELS)];

  return (
    <div>
      {isTeacher ? (
        <TeacherPageHeader
          title={t("title")}
          subtitle={t("subtitleTeacher")}
          badge={t("badge")}
        />
      ) : (
        <ParentPageHeader
          title={t("title")}
          subtitle={t("subtitleParent")}
          badge={t("badge")}
          premium
        />
      )}

      {isTeacher && (
        <div className="mb-6 grid gap-4 lg:grid-cols-[1fr_280px]">
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: t("statPosts"), value: stats.publications, icon: Sparkles },
              { label: t("statViews"), value: stats.views, icon: TrendingUp },
              { label: t("statLikes"), value: stats.likes, icon: Sparkles },
            ].map((item) => (
              <div key={item.label} className="rounded-2xl border border-teal-100 bg-teal-50/50 p-4 text-center">
                <item.icon className="mx-auto mb-1 h-4 w-4 text-teal-600" />
                <p className="text-2xl font-black text-slate-900">{item.value}</p>
                <p className="text-[9px] font-black uppercase tracking-wider text-slate-500">{item.label}</p>
              </div>
            ))}
          </div>
          {leaderboard.length > 0 && (
            <div className="rounded-2xl border border-amber-100 bg-amber-50/60 p-4">
              <p className="mb-3 flex items-center gap-2 text-xs font-black uppercase text-amber-900">
                <Trophy className="h-4 w-4" /> {t("leaderboardTitle")}
              </p>
              <ol className="space-y-2">
                {leaderboard.map((row) => (
                  <li key={row.authorId} className="flex items-center justify-between gap-2 text-sm">
                    <span className="font-bold text-slate-800">
                      <span className="mr-2 inline-flex h-6 w-6 items-center justify-center rounded-full bg-amber-200 text-[10px] font-black">
                        {row.rank}
                      </span>
                      {row.fullName}
                    </span>
                    <span className="shrink-0 text-xs font-black text-amber-800">
                      {row.likes} ♥ · {row.posts} {t("leaderboardPosts")}
                    </span>
                  </li>
                ))}
              </ol>
            </div>
          )}
        </div>
      )}

      {isTeacher && (
        <ShareComposer
          defaultLevel={defaultLevel}
          defaultSubject={defaultSubject}
          onPublished={() => void loadShares()}
          canPublish={canPublish}
          publishBlockedMessage={publishBlockedMessage}
        />
      )}

      <div className="mb-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => setLevelFilter("all")}
          className={cn(
            "rounded-full px-3 py-1.5 text-xs font-black uppercase",
            levelFilter === "all"
              ? isTeacher
                ? "bg-slate-900 text-white"
                : "bg-orange-500 text-white shadow-md shadow-orange-500/20"
              : "border border-slate-200 bg-white text-slate-600"
          )}
        >
          {t("allLevels")}
        </button>
        {levelOptions.map((lv) => (
          <button
            key={lv}
            type="button"
            onClick={() => setLevelFilter(lv)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-black uppercase",
              levelFilter === lv
                ? isTeacher
                  ? "bg-teal-600 text-white"
                  : "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                : "border border-slate-200 bg-white text-slate-600"
            )}
          >
            {lv}
          </button>
        ))}
        {isTeacher && (
          <button
            type="button"
            onClick={() => setMineOnly(!mineOnly)}
            className={cn(
              "rounded-full px-3 py-1.5 text-xs font-black uppercase ms-auto",
              mineOnly ? "bg-orange-500 text-white" : "bg-white border border-slate-200 text-slate-600"
            )}
          >
            {t("myPosts")}
          </button>
        )}
      </div>

      {loading ? (
        <p className="py-12 text-center text-sm font-bold text-slate-400 animate-pulse">{t("loading")}</p>
      ) : shares.length === 0 ? (
        <div
          className={cn(
            "rounded-3xl border-2 border-dashed py-16 text-center",
            isTeacher ? "border-slate-200 bg-slate-50" : "border-orange-200 bg-[#FFFBF7]"
          )}
        >
          <p className="text-lg font-black text-slate-700">{t("emptyTitle")}</p>
          <p className="mt-2 text-sm text-slate-500 max-w-sm mx-auto">{isTeacher ? t("emptyTeacher") : t("emptyParent")}</p>
        </div>
      ) : (
        <div className="space-y-4">
          {shares.map((post) => (
            <SharePostCard
              key={post.id}
              post={post}
              viewerRole={role}
              canDelete={isTeacher && mineOnly}
              onLike={handleLike}
              onDelete={handleDelete}
              liking={likingId === post.id}
            />
          ))}
        </div>
      )}
    </div>
  );
}

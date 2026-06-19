"use client";

import React, { useState } from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ChevronRight, MessageCircle } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NewsArticleListItem } from "@/lib/news/articles.server";
import { TEACHER_NEWS_TOPICS } from "@/lib/teacher/news-constants";
import { newsArticleHref } from "@/lib/news/constants";
import NewsPreferencesPanel from "./NewsPreferencesPanel";

type Props = {
  role: "enseignant" | "parent";
  initialArticles: NewsArticleListItem[];
  showHeader?: React.ReactNode;
};

function truncateExcerpt(text: string, maxLines = 3): string {
  const lines = text.split(/\n/).filter(Boolean);
  if (lines.length <= maxLines && text.length <= 220) return text;
  const joined = lines.slice(0, maxLines).join(" ");
  const cut = joined.length > 220 ? `${joined.slice(0, 217).trim()}…` : joined;
  return cut.endsWith("…") ? cut : `${cut}…`;
}

export default function NewsFeedClient({ role, initialArticles, showHeader }: Props) {
  const locale = useLocale();
  const t = useTranslations("News");
  const isAr = locale.endsWith("-ar") || locale === "ar";
  const isParent = role === "parent";
  const [activeTopic, setActiveTopic] = useState<string>("all");
  const [showPrefs, setShowPrefs] = useState(false);
  const [articles] = useState(initialArticles);

  const filtered =
    activeTopic === "all" ? articles : articles.filter((n) => n.topic === activeTopic);

  return (
    <div>
      {showHeader}

      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-slate-500">{t("retentionHint", { days: 90 })}</p>
        <button
          type="button"
          onClick={() => setShowPrefs(!showPrefs)}
          className={cn(
            "text-xs font-black uppercase hover:underline",
            isParent ? "text-orange-700" : "text-teal-700"
          )}
        >
          {showPrefs ? t("hidePrefs") : t("showPrefs")}
        </button>
      </div>

      {showPrefs && (
        <div className="mb-6">
          <NewsPreferencesPanel locale={locale} role={role} />
        </div>
      )}

      <div className="mb-6 flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTopic("all")}
          className={cn(
            "rounded-full px-4 py-2 text-xs font-bold transition-colors",
            activeTopic === "all"
              ? isParent
                ? "bg-orange-500 text-white"
                : "bg-teal-600 text-white"
              : "bg-white text-slate-600 border border-slate-200"
          )}
        >
          {t("allTopics")}
        </button>
        {TEACHER_NEWS_TOPICS.map((topic) => (
          <button
            key={topic.id}
            type="button"
            onClick={() => setActiveTopic(topic.id)}
            className={cn(
              "rounded-full px-4 py-2 text-xs font-bold transition-colors",
              activeTopic === topic.id
                ? isParent
                  ? "bg-orange-500 text-white"
                  : "bg-teal-600 text-white"
                : "bg-white text-slate-600 border border-slate-200"
            )}
          >
            {isAr ? topic.labelAr : topic.labelFr}
          </button>
        ))}
      </div>

      {filtered.length === 0 ? (
        <div
          className={cn(
            "rounded-2xl border-2 border-dashed py-12 text-center",
            isParent ? "border-orange-200 bg-[#FFFBF7]" : "border-slate-200 bg-slate-50"
          )}
        >
          <p className="font-black text-slate-600">{t("emptyTitle")}</p>
          <p className="mt-2 text-sm text-slate-500">{t("emptyDesc")}</p>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((item) => {
            const excerpt = truncateExcerpt(isAr ? item.excerptAr : item.excerptFr);
            const href = newsArticleHref(role, item.id);
            return (
              <Card key={item.id} className={cn("shadow-sm transition-shadow hover:shadow-md", isParent ? "border-orange-100" : "border-slate-100")}>
                <CardHeader className="pb-2">
                  <div className="flex items-start justify-between gap-3">
                    <CardTitle className="text-base font-black leading-snug text-slate-900">
                      {isAr ? item.titleAr : item.titleFr}
                    </CardTitle>
                    {item.unread && <Badge className="shrink-0 bg-sky-500 hover:bg-sky-500">{t("new")}</Badge>}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm text-slate-500 leading-relaxed line-clamp-3">{excerpt}</p>
                  <div className="mt-3 flex flex-wrap items-center justify-between gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                      {item.publishedAt}
                      {item.commentCount > 0 && (
                        <span className={cn("ml-2 inline-flex items-center gap-0.5", isParent ? "text-orange-600" : "text-teal-600")}>
                          <MessageCircle className="h-3 w-3" /> {item.commentCount}
                        </span>
                      )}
                    </span>
                    <Link
                      href={href}
                      className={cn(
                        "inline-flex items-center gap-1 rounded-xl px-3 py-1.5 text-[10px] font-black uppercase text-white",
                        isParent ? "bg-orange-500 hover:bg-orange-400" : "bg-teal-600 hover:bg-teal-500"
                      )}
                    >
                      {t("readMore")} <ChevronRight className="h-3 w-3" />
                    </Link>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

"use client";

import React from "react";
import { useLocale, useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import type { NewsArticleDetail } from "@/lib/news/articles.server";
import { newsListHref } from "@/lib/news/constants";
import NewsComments from "./NewsComments";
import NewsAdSlot from "./NewsAdSlot";
import DisqusEmbed from "./DisqusEmbed";
import { cn } from "@/lib/utils";

type Props = {
  role: "enseignant" | "parent";
  article: NewsArticleDetail;
};

export default function NewsArticleView({ role, article }: Props) {
  const locale = useLocale();
  const t = useTranslations("News");
  const isAr = locale.endsWith("-ar") || locale === "ar";
  const isParent = role === "parent";
  const title = isAr ? article.titleAr : article.titleFr;
  const body =
    (isAr ? article.bodyAr : article.bodyFr) ||
    (isAr ? article.excerptAr : article.excerptFr);

  return (
    <article className="mx-auto max-w-2xl pb-16">
      <Link
        href={newsListHref(role)}
        className={cn(
          "mb-6 inline-flex items-center gap-1 text-sm font-bold hover:underline",
          isParent ? "text-orange-700" : "text-teal-700"
        )}
      >
        <ArrowLeft className="h-4 w-4" /> {t("backToFeed")}
      </Link>

      <header className="mb-6">
        <p className="text-[10px] font-black uppercase tracking-wider text-slate-400">{article.publishedAt}</p>
        <h1 className="mt-2 text-2xl font-black leading-tight text-slate-900 sm:text-3xl">{title}</h1>
      </header>

      <NewsAdSlot />

      <div className="prose prose-slate max-w-none text-slate-700 leading-relaxed whitespace-pre-wrap">{body}</div>

      <NewsAdSlot slot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_NEWS_FOOTER} />

      <NewsComments articleId={article.id} variant={role} />
      <DisqusEmbed articleId={article.id} title={title} />
    </article>
  );
}

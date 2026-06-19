"use client";

import React, { useEffect, useState } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { ArrowRight, Blocks, Heart, MessageCircle, Newspaper, Sparkles, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import { RTL_ARROW_FLIP } from "@/lib/parent/parent-rtl";
import ChatOpener from "@/components/ChatOpener";
import ParentEmotionalBoostButton from "@/components/parent/ParentEmotionalBoostButton";
import { learningModeLabel } from "@/components/parent/home/learning-mode-label";
import { BlurFade } from "@/components/magicui/blur-fade";
import { safeMessageKey } from "@/components/messages/messaging-ui-helpers";
import type { ParentChildInsights } from "@/lib/parent/dashboard-insights.server";
import type { ParentSuggestion } from "@/lib/parent/parent-suggestions.server";
import type { ParentHomeExtras } from "@/lib/parent/parent-home.types";

type Partner = {
  id: number;
  fullName: string | null;
  lastLoginAt: Date | string | null;
} | null;

type Props = {
  locale: string;
  selected: ParentChildInsights | null;
  suggestion: ParentSuggestion;
  extras: ParentHomeExtras;
  partner: Partner;
};

function isOnline(lastLogin: Date | string | null) {
  if (!lastLogin) return false;
  return Date.now() - new Date(lastLogin).getTime() < 5 * 60 * 1000;
}

export default function ParentHomeSidebar({ locale, selected, suggestion, extras, partner }: Props) {
  const t = useTranslations("ParentSpace");
  const tMsg = useTranslations("Messages");
  const isAr = locale.endsWith("-ar") || locale === "ar";
  const storageKey = `fg_parent_suggestion_dismiss_${suggestion.id}`;
  const [dismissedSuggestion, setDismissedSuggestion] = useState(false);

  useEffect(() => {
    setDismissedSuggestion(localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  const dismissSuggestion = () => {
    localStorage.setItem(storageKey, "1");
    setDismissedSuggestion(true);
  };

  const modeLabel = selected ? learningModeLabel(selected.learningMode, isAr) : "";

  return (
    <div className="space-y-6">
      <BlurFade delay={0.06}>
        <Link
          href="/dashboard/parent/atelier"
          className="block rounded-3xl border border-violet-100 bg-gradient-to-br from-violet-50 via-[#FFFBF7] to-white p-6 shadow-sm transition hover:border-violet-200 hover:shadow-md"
        >
          <div className="flex items-center gap-4">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-violet-100 text-violet-600">
              <Blocks className="h-5 w-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-slate-900">{t("atelierUnified.cardTitle")}</h3>
              <p className="text-xs text-slate-500">{t("atelierUnified.cardDesc")}</p>
            </div>
          </div>
        </Link>
      </BlurFade>

      <BlurFade delay={0.08}>
        <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
          <div className="mb-4 flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-orange-100 text-orange-600">
              <Heart className="h-5 w-5" />
            </div>
            <h3 className="text-lg font-black text-slate-900">{t("home.allianceTitle")}</h3>
          </div>
          {partner ? (
            <>
              <div className="mb-4 flex items-center gap-3 rounded-2xl bg-orange-50/60 p-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-br from-slate-200 to-slate-300 text-lg font-black text-slate-600">
                  {partner.fullName?.[0]?.toUpperCase() ?? "P"}
                </div>
                <div>
                  <p className="font-black text-slate-900">{partner.fullName}</p>
                  <p className="text-[10px] font-bold uppercase tracking-widest text-orange-600">
                    {isOnline(partner.lastLoginAt) ? t("home.partnerOnline") : t("home.partnerOffline")}
                  </p>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <ChatOpener
                  userId={partner.id}
                  className="rounded-xl bg-slate-900 py-3 text-center text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-600"
                >
                  {t("home.messagePartner")}
                </ChatOpener>
                <Link
                  href="/dashboard/invite"
                  className="rounded-xl border border-slate-200 py-3 text-center text-[10px] font-black uppercase tracking-widest text-slate-600 hover:border-orange-300"
                >
                  {t("home.invite")}
                </Link>
              </div>
            </>
          ) : (
            <>
              <p className="mb-4 text-sm text-slate-600">{t("home.noPartner")}</p>
              <Link
                href="/dashboard/invite"
                className="block rounded-xl border-2 border-dashed border-slate-200 py-4 text-center text-[10px] font-black uppercase tracking-widest text-slate-500 hover:border-orange-300 hover:text-orange-600"
              >
                {t("home.invitePartner")}
              </Link>
            </>
          )}
        </div>
      </BlurFade>

      {extras.messagePreviews.length > 0 && (
        <BlurFade delay={0.1}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-orange-600" />
                <h3 className="text-lg font-black text-slate-900">{t("home.messagesPreview")}</h3>
              </div>
              {extras.totalUnreadMessages > 0 && (
                <span className="rounded-full bg-orange-500 px-2.5 py-0.5 text-[10px] font-black text-white">
                  {extras.totalUnreadMessages > 99 ? "99+" : extras.totalUnreadMessages}
                </span>
              )}
            </div>
            <ul className="space-y-3">
              {extras.messagePreviews.map((msg) => {
                const title = msg.labelKey
                  ? safeMessageKey(tMsg, msg.labelKey, msg.otherUserName ?? t("nav.messages"))
                  : msg.otherUserName ?? t("nav.messages");
                return (
                  <li key={msg.id}>
                    <Link
                      href={`/dashboard/messages?c=${msg.id}`}
                      className="block rounded-xl border border-slate-100 bg-slate-50/80 p-3 transition hover:border-orange-200 hover:bg-white"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <p className="truncate text-sm font-black text-slate-800">{title}</p>
                        {msg.unreadCount > 0 && (
                          <span className="shrink-0 rounded-full bg-orange-100 px-2 py-0.5 text-[10px] font-black text-orange-700">
                            {msg.unreadCount}
                          </span>
                        )}
                      </div>
                      <p className="mt-1 truncate text-xs text-slate-500">{msg.preview}</p>
                    </Link>
                  </li>
                );
              })}
            </ul>
            <Link
              href="/dashboard/messages"
              className="mt-4 inline-flex items-center gap-1 text-xs font-black text-orange-600 hover:underline"
            >
              {t("home.viewAllMessages")} <ArrowRight className={cn("h-3 w-3", RTL_ARROW_FLIP)} />
            </Link>
          </div>
        </BlurFade>
      )}

      {extras.newsPreviews.length > 0 && (
        <BlurFade delay={0.12}>
          <div className="rounded-3xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="mb-4 flex items-center gap-2">
              <Newspaper className="h-4 w-4 text-indigo-600" />
              <h3 className="text-lg font-black text-slate-900">{t("home.newsPreview")}</h3>
            </div>
            <ul className="space-y-3">
              {extras.newsPreviews.map((article) => (
                <li key={article.id}>
                  <Link
                    href={`/dashboard/parent/actualites/${article.id}`}
                    className={cn(
                      "block rounded-xl border p-3 transition hover:border-orange-200",
                      article.unread ? "border-orange-100 bg-orange-50/60" : "border-orange-50/80 bg-[#FFFBF7]"
                    )}
                  >
                    <p className="text-sm font-black text-slate-800">
                      {isAr ? article.titleAr : article.titleFr}
                    </p>
                    <p className="mt-1 line-clamp-2 text-xs text-slate-500">
                      {isAr ? article.excerptAr : article.excerptFr}
                    </p>
                  </Link>
                </li>
              ))}
            </ul>
            <Link
              href="/dashboard/parent/actualites"
              className="mt-4 inline-flex items-center gap-1 text-xs font-black text-orange-600 hover:underline"
            >
              {t("home.viewAllNews")} <ArrowRight className={cn("h-3 w-3", RTL_ARROW_FLIP)} />
            </Link>
          </div>
        </BlurFade>
      )}

      {!dismissedSuggestion && (
        <BlurFade delay={0.14}>
          <div className="relative overflow-hidden rounded-3xl border border-orange-200 bg-gradient-to-br from-[#FFFBF7] to-orange-50 p-6 shadow-lg">
            <div className="absolute -end-10 -top-10 h-40 w-40 rounded-full bg-orange-300/30 blur-3xl" />
            <div className="relative z-10">
              <span className="mb-4 inline-flex items-center gap-1 rounded-lg border border-orange-300/40 bg-orange-100/60 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-700">
                <Sparkles className="h-3 w-3" /> {t("suggestions.badge")}
              </span>
              <h4 className="mb-2 text-lg font-black text-slate-900">{t(`suggestions.${suggestion.titleKey}`)}</h4>
              <p className="mb-6 text-sm leading-relaxed text-slate-600">
                {t(`suggestions.${suggestion.bodyKey}`, suggestion.bodyParams ?? {})}
              </p>
              <div className="flex gap-2">
                {suggestion.ctaKey === "encourage" && selected ? (
                  <ParentEmotionalBoostButton
                    childId={selected.childId}
                    childName={selected.fullName}
                    partnerId={partner?.id}
                    compact
                  />
                ) : suggestion.href ? (
                  <Link
                    href={suggestion.href}
                    className="flex-1 rounded-xl bg-orange-500 py-3 text-center text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-400"
                  >
                    {t(`suggestions.${suggestion.ctaKey}`)}
                  </Link>
                ) : (
                  <ChatOpener
                    type="ai"
                    name="Geny"
                    className="flex-1 rounded-xl bg-orange-500 py-3 text-center text-[10px] font-black uppercase tracking-widest text-white hover:bg-orange-400"
                  >
                    {t(`suggestions.${suggestion.ctaKey}`)}
                  </ChatOpener>
                )}
                <button
                  type="button"
                  onClick={dismissSuggestion}
                  className="flex-1 rounded-xl border border-slate-200 bg-white py-3 text-[10px] font-black uppercase tracking-widest text-slate-600 hover:bg-slate-50"
                >
                  {t("suggestions.later")}
                </button>
              </div>
            </div>
          </div>
        </BlurFade>
      )}

      {selected && (
        <BlurFade delay={0.16}>
          <div className="rounded-3xl border border-orange-100 bg-gradient-to-br from-orange-50/80 to-[#FFFBF7] p-6">
            <div className="mb-3 flex items-center gap-2">
              <Star className="h-4 w-4 text-orange-600" />
              <p className="text-sm font-black text-slate-900">{t("home.xpBreakdown")}</p>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { label: t("home.xpReading"), value: selected.stats.breakdown.reading },
                { label: t("home.xpExercises"), value: selected.stats.breakdown.exercises },
                { label: t("home.xpBadges"), value: selected.stats.breakdown.badges },
                { label: t("home.xpQuizzes"), value: selected.stats.breakdown.quizzes },
              ].map((row) => (
                <div key={row.label} className="rounded-xl bg-white/80 px-3 py-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400">{row.label}</p>
                  <p className="font-black text-slate-800">{row.value} XP</p>
                </div>
              ))}
            </div>
            <p className="mt-3 text-xs text-slate-500">
              {t("home.guidanceMode")}: <strong>{modeLabel}</strong>
            </p>
            <Link
              href="/dashboard/parent/reglages"
              className="mt-3 inline-flex items-center gap-1 text-xs font-black text-orange-700 hover:underline"
            >
              {t("home.adjustSettings")} <ArrowRight className={cn("h-3 w-3", RTL_ARROW_FLIP)} />
            </Link>
          </div>
        </BlurFade>
      )}
    </div>
  );
}

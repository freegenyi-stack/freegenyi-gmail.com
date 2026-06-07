"use client";

import { Link } from "@/i18n/routing";
import React, { useEffect, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { useRegion } from "@/context/RegionContext";
import { getVariant } from "@/constants/variants";
import {
  ArrowRight,
  GraduationCap,
  Globe,
  Zap,
  Heart,
  Mic,
  Sparkles,
  Users,
  BookOpen,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const ImpactCounter = ({ target, label, suffix = "" }: { target: number; label: string; suffix?: string }) => {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const increment = target / 125;
    const timer = setInterval(() => {
      start += increment;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <div className="text-center">
      <p className="text-2xl font-black text-slate-900">
        {count}
        {suffix}
      </p>
      <p className="text-[10px] font-bold uppercase tracking-wider text-slate-400 mt-1">{label}</p>
    </div>
  );
};

export default function HomePage() {
  const t = useTranslations("Hero");
  const tNav = useTranslations("Nav");
  const ti = useTranslations("Impact");
  const tp = useTranslations("Portals");
  const te = useTranslations("Ecosystem");
  const tin = useTranslations("Innovation");
  const tf = useTranslations("Footer");

  const locale = useLocale();
  const { selectedCountry, selectedLang } = useRegion();
  const variant = getVariant(selectedCountry, selectedLang);
  const isRTL = locale === "ar" || locale.endsWith("-ar");

  const portals = [
    { key: "Local", icon: BookOpen, href: "/portal-local", accent: "text-blue-600 bg-blue-50" },
    { key: "World", icon: Globe, href: "/portal-world", accent: "text-orange-600 bg-orange-50", featured: true },
    { key: "Magic", icon: Zap, href: "/portal-magic", accent: "text-teal-600 bg-teal-50" },
  ] as const;

  const roles = [
    { key: "Parents", icon: Heart, href: "/parents", color: "hover:border-orange-300" },
  ] as const;

  return (
    <div className="min-h-screen bg-white" dir={isRTL ? "rtl" : "ltr"}>
      {/* Hero */}
      <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -top-32 left-1/2 h-[420px] w-[720px] -translate-x-1/2 rounded-full bg-gradient-to-r from-orange-200/50 via-white to-teal-200/40 blur-3xl" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6">
          <div className={cn("grid items-center gap-14 lg:grid-cols-2", isRTL && "lg:direction-rtl")}>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className={cn(isRTL ? "text-right lg:order-2" : "text-left")}
            >
              <span className="inline-flex items-center gap-2 rounded-full border border-orange-100 bg-orange-50 px-4 py-1.5 text-xs font-bold text-orange-700">
                <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
                {t("status")}
              </span>

              <h1
                className={cn(
                  "mt-6 text-4xl font-black leading-[1.08] tracking-tight text-slate-900 md:text-5xl lg:text-6xl",
                  isRTL && "font-amiri leading-snug"
                )}
              >
                {t.rich("title", {
                  orange: (chunks) => <span className="text-orange-500">{chunks}</span>,
                })}
              </h1>

              <p className={cn("mt-6 max-w-xl text-lg text-slate-500 leading-relaxed", isRTL && "font-lateef text-2xl mr-0 ml-auto")}>
                {t("subtitle")}
              </p>

              <div className={cn("mt-8 flex flex-wrap gap-3", isRTL && "justify-end")}>
                <Link href="/auth/register">
                  <Button size="lg" className="rounded-2xl px-8">
                    {t("cta")}
                    <ArrowRight className={cn("w-4 h-4", isRTL && "rotate-180")} />
                  </Button>
                </Link>
                <Link href="/dashboard/guest">
                  <Button size="lg" variant="secondary" className="rounded-2xl px-8">
                    {tNav("FreeExplore")}
                  </Button>
                </Link>
                <Link href="/approach">
                  <Button size="lg" variant="outline" className="rounded-2xl px-8">
                    {t("approach")}
                  </Button>
                </Link>
              </div>

              <div className={cn("mt-10 grid grid-cols-3 gap-4 sm:grid-cols-5 max-w-lg", isRTL && "mr-0 ml-auto")}>
                <ImpactCounter target={15} label={ti("Geniuses")} suffix="K+" />
                <ImpactCounter target={60} label={ti("Countries")} suffix="+" />
                <ImpactCounter target={300} label={ti("Schools")} suffix="+" />
                <ImpactCounter target={16} label={ti("Languages")} suffix="+" />
                <ImpactCounter target={55} label={ti("Courses")} suffix="K+" />
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className={cn("relative", isRTL && "lg:order-1")}
            >
              <div className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-orange-400/15 to-teal-400/15 blur-2xl" />
              <Image
                src={variant.heroImage}
                alt="FreeGeny"
                width={640}
                height={640}
                priority
                className="relative z-10 mx-auto w-full max-w-lg rounded-[2rem] border border-white object-cover shadow-2xl shadow-slate-900/10 aspect-square"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = "/assets/img/hero_elite.png";
                }}
              />
              <Card className="absolute -bottom-6 z-20 max-w-xs border-white/80 bg-white/95 shadow-xl backdrop-blur-sm ltr:-left-2 rtl:-right-2">
                <CardContent className="p-4">
                  <p className={cn("text-sm font-medium text-slate-700 italic leading-relaxed", isRTL && "font-amiri not-italic text-base")}>
                    {variant.heroQuote}
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Portals */}
      <section className="bg-slate-50/60 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-orange-600">{tp("Tag")}</span>
            <h2 className={cn("mt-3 text-3xl font-black text-slate-900 md:text-5xl", isRTL && "font-amiri")}>{tp("Title")}</h2>
            <p className={cn("mt-4 text-slate-500 text-lg", isRTL && "font-lateef text-2xl")}>{tp("Subtitle")}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-3">
            {portals.map(({ key, icon: Icon, href, accent, featured }) => (
              <Card
                key={key}
                className={cn(
                  "group transition-all duration-300 hover:-translate-y-1 hover:shadow-lg",
                  featured && "border-slate-900 bg-slate-900 text-white md:scale-[1.02]"
                )}
              >
                <CardHeader>
                  <div className={cn("mb-4 flex h-12 w-12 items-center justify-center rounded-xl", featured ? "bg-white/10 text-orange-400" : accent)}>
                    <Icon className="h-6 w-6" />
                  </div>
                  <CardTitle className={cn(featured && "text-white", isRTL && "font-amiri text-xl")}>
                    {tp(`${key}.Title`)}
                  </CardTitle>
                  <CardDescription className={cn(featured ? "text-slate-300" : "", isRTL && "font-lateef text-lg")}>
                    {tp(`${key}.Desc`)}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Link href={href} className={cn("text-sm font-bold text-orange-600 group-hover:underline", featured && "text-orange-400")}>
                    {tp(`${key}.CTA`)}
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className="mx-auto mb-14 max-w-2xl text-center">
            <span className="text-xs font-bold uppercase tracking-widest text-blue-600">{te("Tag")}</span>
            <h2 className={cn("mt-3 text-3xl font-black text-slate-900 md:text-5xl", isRTL && "font-amiri")}>{te("Title")}</h2>
            <p className={cn("mt-4 text-slate-500 text-lg", isRTL && "font-lateef text-2xl")}>{te("Subtitle")}</p>
          </div>

          <div className="grid gap-6 lg:grid-cols-2">
            {roles.map(({ key, icon: Icon, href, color }) => (
              <Card key={key} className={cn("p-2 transition-all duration-300 hover:shadow-lg", color)}>
                <CardHeader className={cn("flex-row items-center gap-4 space-y-0", isRTL && "flex-row-reverse")}>
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-orange-50 text-orange-600">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className={isRTL ? "text-right" : ""}>
                    <CardTitle className={isRTL ? "font-amiri text-2xl" : ""}>{te(`${key}.Title`)}</CardTitle>
                    <CardDescription className={cn("mt-2", isRTL && "font-lateef text-lg")}>{te(`${key}.Desc`)}</CardDescription>
                  </div>
                </CardHeader>
                <CardContent>
                  <Link href={href}>
                    <Button variant="default" className="rounded-xl">
                      {te(`${key}.CTA`)}
                    </Button>
                  </Link>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Innovation */}
      <section className="bg-slate-50/60 py-20 md:py-28">
        <div className="mx-auto max-w-7xl px-6">
          <div className={cn("grid items-center gap-12 lg:grid-cols-2", isRTL && "lg:direction-rtl")}>
            <div className={cn(isRTL && "text-right lg:order-2")}>
              <span className="text-xs font-bold uppercase tracking-widest text-orange-600">{tin("Tag")}</span>
              <h2 className={cn("mt-3 text-3xl font-black text-slate-900 md:text-4xl", isRTL && "font-amiri text-5xl")}>
                {tin("Title")}
              </h2>
              <div className="mt-8 space-y-6">
                {(["Boost", "AI"] as const).map((k) => (
                  <div key={k} className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm">
                      {k === "Boost" ? <Mic className="h-5 w-5 text-orange-600" /> : <Sparkles className="h-5 w-5 text-blue-600" />}
                    </div>
                    <div className={isRTL ? "text-right" : ""}>
                      <h3 className={cn("font-bold text-slate-900", isRTL && "font-amiri text-xl")}>{tin(`${k}.Title`)}</h3>
                      <p className={cn("mt-1 text-slate-500", isRTL && "font-lateef text-lg")}>{tin(`${k}.Desc`)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Card className={cn("overflow-hidden", isRTL && "lg:order-1")}>
              <CardContent className="p-8">
                <div className={cn("flex items-center gap-3 mb-6", isRTL && "flex-row-reverse")}>
                  <Users className="h-5 w-5 text-orange-600" />
                  <p className={cn("text-sm font-bold text-slate-800", isRTL && "font-amiri")}>{variant.scienceQuote}</p>
                </div>
                <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: "78%" }}
                    viewport={{ once: true }}
                    className={cn("h-full rounded-full bg-gradient-to-r from-orange-500 to-teal-500", isRTL && "ml-auto origin-right")}
                  />
                </div>
                <p className={cn("mt-4 text-xs font-semibold text-slate-400", isRTL && "text-right font-amiri")}>
                  FreeGeny · {selectedCountry}-{selectedLang}
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="rounded-t-[3rem] bg-slate-900 py-20 text-white">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <h2 className={cn("text-3xl font-black md:text-5xl", isRTL && "font-amiri text-5xl")}>{tf("Title")}</h2>
          <Link href="/auth/register" className="mt-8 inline-block">
            <Button size="lg" className="rounded-2xl bg-orange-600 hover:bg-orange-500 px-10">
              {tf("CTA")}
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}

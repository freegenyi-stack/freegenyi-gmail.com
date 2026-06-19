"use client";

import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { useRegion } from "@/context/RegionContext";
import { getVariant } from "@/constants/variants";
import {
  ArrowRight,
  BookOpen,
  CheckCircle2,
  Globe,
  GraduationCap,
  Heart,
  Library,
  MessageCircle,
  Mic,
  Monitor,
  Sparkles,
  Users,
  Wand2,
  Compass,
} from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { BlurFade } from "@/components/magicui/blur-fade";
import {
  ClassroomCard,
  EventsSection,
  FeatureTile,
  PadoraDecor,
  PadoraSectionHeader,
  PhotoGallery,
  StatsBand,
  TestimonialsCarousel,
} from "@/components/landing/padora";

const EASE = [0.22, 1, 0.36, 1] as const;

export default function LandingPadoraPage() {
  const t = useTranslations("Hero");
  const tL = useTranslations("Landing");
  const tNav = useTranslations("Nav");
  const ti = useTranslations("Impact");
  const tp = useTranslations("Portals");
  const te = useTranslations("Ecosystem");
  const tin = useTranslations("Innovation");

  const locale = useLocale();
  const { selectedCountry, selectedLang } = useRegion();
  const variant = getVariant(selectedCountry, selectedLang);
  const isRTL = locale === "ar" || locale.endsWith("-ar");

  const portals = [
    { key: "Local" as const, icon: BookOpen, href: "/portal-local", cover: "bg-gradient-to-br from-teal-100 via-teal-50 to-emerald-100" },
    { key: "World" as const, icon: Globe, href: "/portal-world", cover: "bg-gradient-to-br from-orange-100 via-amber-50 to-orange-50" },
    { key: "Magic" as const, icon: Wand2, href: "/portal-magic", cover: "bg-gradient-to-br from-violet-100 via-purple-50 to-fuchsia-100" },
  ];

  const features = [
    { key: "geny" as const, icon: Sparkles },
    { key: "workshop" as const, icon: BookOpen },
    { key: "library" as const, icon: Library },
    { key: "messaging" as const, icon: MessageCircle },
    { key: "screenTime" as const, icon: Monitor },
    { key: "explore" as const, icon: Compass },
  ];

  const stats = [
    { value: 15, suffix: "K+", label: ti("Geniuses") },
    { value: 60, suffix: "+", label: ti("Countries") },
    { value: 300, suffix: "+", label: ti("Schools") },
    { value: 16, suffix: "+", label: ti("Languages") },
    { value: 55, suffix: "K+", label: ti("Courses") },
  ];

  const testimonials = (["t1", "t2", "t3", "t4"] as const).map((k) => ({
    name: tL(`testimonials.${k}.name`),
    quote: tL(`testimonials.${k}.quote`),
  }));

  const gallery = (
    [
      { key: "g1", icon: BookOpen, gradient: "linear-gradient(145deg, #fdba74 0%, #fed7aa 45%, #fff7ed 100%)", accent: "#ea580c", pattern: "dots" as const },
      { key: "g2", icon: Library, gradient: "linear-gradient(145deg, #5eead4 0%, #99f6e4 45%, #ecfdf5 100%)", accent: "#0d9488", pattern: "rings" as const },
      { key: "g3", icon: BookOpen, gradient: "linear-gradient(145deg, #67e8f9 0%, #a5f3fc 45%, #ecfeff 100%)", accent: "#0891b2", pattern: "waves" as const },
      { key: "g4", icon: Globe, gradient: "linear-gradient(145deg, #fcd34d 0%, #fde68a 45%, #fffbeb 100%)", accent: "#d97706", pattern: "dots" as const },
      { key: "g5", icon: Wand2, gradient: "linear-gradient(145deg, #c4b5fd 0%, #ddd6fe 45%, #f5f3ff 100%)", accent: "#7c3aed", pattern: "rings" as const },
      { key: "g6", icon: Heart, gradient: "linear-gradient(145deg, #fda4af 0%, #fecdd3 45%, #fff1f2 100%)", accent: "#e11d48", pattern: "waves" as const },
    ] as const
  ).map(({ key, icon, gradient, accent, pattern }) => ({
    label: tL(`gallery.${key}`),
    icon,
    gradient,
    accent,
    pattern,
  }));

  const events = (["e1", "e2"] as const).map((k) => ({
    day: tL(`events.${k}.day`),
    month: tL(`events.${k}.month`),
    title: tL(`events.${k}.title`),
    location: tL(`events.${k}.location`),
    href: k === "e1" ? "/blog" : "/contact",
    cta: tL("eventsSeeDetails"),
  }));

  const bullets = [tL("aboutBullet1"), tL("aboutBullet2"), tL("aboutBullet3")];

  return (
    <div className="fg-padora-cream text-slate-900" dir={isRTL ? "rtl" : "ltr"}>
      <section className="relative overflow-hidden -mt-[var(--header-height,72px)] pt-[calc(var(--header-height,72px)+3rem)] pb-16 md:pb-24">
        <PadoraDecor variant="hero" />
        <div className="pointer-events-none absolute -right-20 top-24 h-72 w-72 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-64 w-64 rounded-full bg-teal-200/25 blur-3xl" />
        <div className="relative mx-auto max-w-4xl px-4 text-center sm:px-6">
          <BlurFade>
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-orange-500">{t("status")}</p>
          </BlurFade>
          <BlurFade delay={0.06}>
            <h1 className={cn("font-landing-display mt-5 text-[2rem] font-bold leading-[1.12] text-slate-900 sm:text-5xl md:text-6xl", isRTL && "font-ui-ar leading-snug")}>
              {t.rich("title", { orange: (chunks) => <span className="text-orange-500">{chunks}</span> })}
            </h1>
          </BlurFade>
          <BlurFade delay={0.12}>
            <p className={cn("mx-auto mt-6 max-w-2xl text-base leading-relaxed text-slate-600 md:text-lg", isRTL && "font-lateef text-xl")}>{t("subtitle")}</p>
          </BlurFade>
          <BlurFade delay={0.18}>
            <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
              <Link href="/auth/register">
                <Button size="lg" className="h-12 min-w-[200px] rounded-full bg-orange-500 px-8 text-white shadow-lg shadow-orange-500/25 hover:bg-orange-600">
                  {t("cta")}
                  <ArrowRight className={cn("h-4 w-4", isRTL && "rotate-180")} />
                </Button>
              </Link>
              <Link href="/approach">
                <Button size="lg" variant="outline" className="h-12 rounded-full border-orange-200 bg-white px-8 text-slate-700 hover:bg-orange-50">{t("approach")}</Button>
              </Link>
            </div>
          </BlurFade>
        </div>
      </section>

      <section className="relative pb-16 md:pb-24">
        <PadoraDecor variant="classroom" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade>
            <PadoraSectionHeader label={tL("classroomLabel")} title={tL("classroomTitle")} description={tp("Subtitle")} align="center" isRTL={isRTL} />
          </BlurFade>
          <div className="fg-snap-x mt-12 flex gap-5 overflow-x-auto pb-4 md:grid md:grid-cols-3 md:overflow-visible md:pb-0">
            {portals.map(({ key, icon, href, cover }, i) => (
              <div key={key} className="fg-snap-item w-[85vw] shrink-0 md:w-auto">
                <ClassroomCard title={tp(`${key}.Title`)} description={tp(`${key}.Desc`)} href={href} cta={tp(`${key}.CTA`)} icon={icon} coverClass={cover} isRTL={isRTL} delay={i * 0.08} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative fg-padora-sand py-16 md:py-24">
        <PadoraDecor variant="about" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-12 lg:grid-cols-2 lg:gap-16">
            <BlurFade className={isRTL ? "lg:order-2" : ""}>
              <PadoraSectionHeader label={tL("aboutLabel")} title={tL("aboutTitle")} isRTL={isRTL} />
              <p className={cn("mt-5 leading-relaxed text-slate-600", isRTL && "font-lateef text-lg text-right")}>{tL("aboutText")}</p>
              <ul className={cn("mt-6 space-y-3", isRTL && "text-right")}>
                {bullets.map((item) => (
                  <li key={item} className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-teal-600" strokeWidth={1.75} />
                    <span className={cn("text-sm text-slate-700 md:text-base", isRTL && "font-lateef")}>{item}</span>
                  </li>
                ))}
              </ul>
              <Link href="/approach" className="mt-8 inline-block">
                <Button variant="secondary" className="rounded-full px-6">{tL("readStory")}</Button>
              </Link>
            </BlurFade>
            <div className="grid gap-4 sm:grid-cols-2">
              {features.map(({ key, icon }, i) => (
                <FeatureTile key={key} icon={icon} title={tL(`features.${key}.title`)} description={tL(`features.${key}.desc`)} isRTL={isRTL} delay={i * 0.06} />
              ))}
            </div>
          </div>
        </div>
      </section>

      <div className="relative">
        <PadoraDecor variant="stats" />
        <StatsBand stats={stats} isRTL={isRTL} />
      </div>

      <section className="relative py-16 md:py-24">
        <PadoraDecor variant="testimonials" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade className="mb-12">
            <PadoraSectionHeader label={tL("testimonialsLabel")} title={tL("testimonialsTitle")} align="center" isRTL={isRTL} />
          </BlurFade>
          <BlurFade delay={0.1}>
            <TestimonialsCarousel items={testimonials} isRTL={isRTL} />
          </BlurFade>
        </div>
      </section>

      <section className="relative fg-padora-sand py-16 md:py-24">
        <PadoraDecor variant="events" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade className="mb-12">
            <PadoraSectionHeader label={tL("eventsLabel")} title={tL("eventsTitle")} align="center" isRTL={isRTL} />
          </BlurFade>
          <EventsSection events={events} isRTL={isRTL} />
        </div>
      </section>

      <section className="relative py-16 md:py-24">
        <PadoraDecor variant="gallery" />
        <div className="relative mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade className="mb-12">
            <PadoraSectionHeader label={tL("galleryLabel")} title={tL("galleryTitle")} align="center" isRTL={isRTL} />
          </BlurFade>
          <PhotoGallery items={gallery} isRTL={isRTL} />
        </div>
      </section>

      <section className="relative fg-padora-sand py-16 md:py-24">
        <PadoraDecor variant="classroom" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade>
            <PadoraSectionHeader label={te("Tag")} title={te("Title")} description={te("Subtitle")} align="center" isRTL={isRTL} />
          </BlurFade>
          <div className="mt-12 grid gap-6 md:grid-cols-2">
            {(
              [
                { key: "Parents" as const, icon: Heart, href: "/parents", tint: "from-orange-50 to-amber-50" },
                { key: "Teachers" as const, icon: GraduationCap, href: "/teachers", tint: "from-teal-50 to-emerald-50" },
              ] as const
            ).map(({ key, icon: Icon, href, tint }, i) => (
              <BlurFade key={key} delay={i * 0.1}>
                <motion.article whileHover={{ y: -6 }} className="overflow-hidden rounded-[1.75rem] bg-white shadow-[0_16px_48px_-20px_rgba(15,23,42,0.1)] ring-1 ring-slate-100">
                  <div className={cn("flex h-36 items-center justify-center bg-gradient-to-br", tint)}>
                    <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white shadow-md ring-1 ring-orange-50">
                      <Icon className="h-8 w-8 text-orange-500" strokeWidth={1.5} />
                    </div>
                  </div>
                  <div className={cn("p-7", isRTL && "text-right")}>
                    <h3 className={cn("font-landing-display text-2xl font-bold", isRTL && "font-ui-ar")}>{te(`${key}.Title`)}</h3>
                    <p className={cn("mt-3 text-slate-600", isRTL && "font-lateef text-lg")}>{te(`${key}.Desc`)}</p>
                    <Link href={href} className="mt-6 inline-block">
                      <Button className="rounded-full bg-slate-900 hover:bg-orange-600">{te(`${key}.CTA`)}</Button>
                    </Link>
                  </div>
                </motion.article>
              </BlurFade>
            ))}
          </div>
        </div>
      </section>

      <section className="relative py-16 md:py-24">
        <PadoraDecor variant="about" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <div className="grid gap-10 lg:grid-cols-2 lg:gap-14">
            <div>
              <BlurFade>
                <PadoraSectionHeader label={tin("Tag")} title={tin("Title")} isRTL={isRTL} />
              </BlurFade>
              <div className="mt-8 space-y-4">
                {(
                  [{ key: "Boost" as const, icon: Mic }, { key: "AI" as const, icon: Sparkles }] as const
                ).map(({ key, icon: Icon }, i) => (
                  <BlurFade key={key} delay={0.08 + i * 0.08}>
                    <motion.div whileHover={{ x: isRTL ? -4 : 4 }} className={cn("flex gap-4 rounded-2xl border border-orange-100/80 bg-white p-5 shadow-sm", isRTL && "flex-row-reverse text-right")}>
                      <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-orange-50 text-orange-600">
                        <Icon className="h-5 w-5" />
                      </div>
                      <div>
                        <h3 className={cn("font-bold text-slate-900", isRTL && "font-ui-ar text-lg")}>{tin(`${key}.Title`)}</h3>
                        <p className={cn("mt-1 text-sm text-slate-600", isRTL && "font-lateef")}>{tin(`${key}.Desc`)}</p>
                      </div>
                    </motion.div>
                  </BlurFade>
                ))}
              </div>
            </div>
            <BlurFade delay={0.12}>
              <div className="rounded-[1.75rem] bg-white p-8 shadow-[0_16px_48px_-20px_rgba(15,23,42,0.08)] ring-1 ring-orange-100">
                <div className={cn("flex items-start gap-3", isRTL && "flex-row-reverse")}>
                  <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-orange-100 text-orange-600">
                    <Users className="h-5 w-5" />
                  </div>
                  <p className={cn("text-sm leading-relaxed text-slate-700 md:text-base", isRTL && "font-ui-ar text-right")}>{variant.scienceQuote}</p>
                </div>
                <div className="mt-8 h-1.5 overflow-hidden rounded-full bg-orange-100">
                  <motion.div initial={{ width: 0 }} whileInView={{ width: "78%" }} viewport={{ once: true }} transition={{ duration: 1.2, ease: EASE }} className="h-full rounded-full bg-orange-500" />
                </div>
                <p className={cn("mt-4 text-xs font-semibold uppercase tracking-wider text-slate-500", isRTL && "text-right")}>
                  FreeGeny · {selectedCountry}-{selectedLang}
                </p>
              </div>
            </BlurFade>
          </div>
        </div>
      </section>

      <section className="relative pb-16 md:pb-20">
        <PadoraDecor variant="cta" />
        <div className="mx-auto max-w-6xl px-4 sm:px-6">
          <BlurFade>
            <div className="overflow-hidden rounded-[2rem] bg-gradient-to-br from-orange-500 via-orange-500 to-amber-500 px-8 py-12 text-center text-white shadow-xl shadow-orange-500/20 md:px-16 md:py-14">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-orange-100">{tL("registerLabel")}</p>
              <h2 className={cn("font-landing-display mt-4 text-2xl font-bold md:text-4xl", isRTL && "font-ui-ar")}>{tL("registerTitle")}</h2>
              <p className={cn("mx-auto mt-4 max-w-xl text-orange-50/95", isRTL && "font-lateef text-lg")}>{tL("registerDesc")}</p>
              <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
                <Link href="/auth/register">
                  <Button size="lg" className="h-12 min-w-[200px] rounded-full bg-white text-orange-600 hover:bg-orange-50">{tL("registerCta")}</Button>
                </Link>
                <Link href="/dashboard/explore">
                  <Button size="lg" variant="outline" className="h-12 rounded-full border-white/40 bg-transparent text-white hover:bg-white/10">{tNav("FreeExplore")}</Button>
                </Link>
              </div>
            </div>
          </BlurFade>
        </div>
      </section>
    </div>
  );
}

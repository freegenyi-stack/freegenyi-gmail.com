"use client";

import type { ReactNode } from "react";
import { Link } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Globe, ShieldCheck, Sparkles } from "lucide-react";
import { FOOTER_SOCIAL_LINKS, type FooterSocialKey } from "@/constants/footerSocial";

const linkClass =
  "text-[11px] font-medium leading-snug text-slate-400 transition-colors hover:text-orange-600 xl:text-xs";

const columnTitleClass =
  "mb-3 text-[10px] font-black uppercase tracking-widest text-slate-900 font-title xl:mb-4 xl:text-[11px]";

function FooterColumn({
  title,
  links,
  className,
}: {
  title: string;
  links: { href: string; label: string; external?: boolean }[];
  className?: string;
}) {
  return (
    <div className={className}>
      <h4 className={columnTitleClass}>{title}</h4>
      <ul className="space-y-2 xl:space-y-2.5">
        {links.map(({ href, label, external }) => (
          <li key={`${href}-${label}`}>
            {external ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className={linkClass}
              >
                {label}
              </a>
            ) : (
              <Link href={href} className={linkClass}>
                {label}
              </Link>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
}

const SOCIAL_ICONS: Record<FooterSocialKey, ReactNode> = {
  linkedin: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden>
      <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433a2.062 2.062 0 01-2.063-2.065 2.064 2.064 0 114.126 0 2.063 2.063 0 01-2.063 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
    </svg>
  ),
  facebook: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
    </svg>
  ),
  instagram: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden>
      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
    </svg>
  ),
  youtube: (
    <svg viewBox="0 0 24 24" className="h-[18px] w-[18px] fill-current" aria-hidden>
      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
    </svg>
  ),
};

export default function Footer() {
  const t = useTranslations("Footer");
  const locale = useLocale();
  const isRTL = locale.endsWith("-ar") || locale === "ar";

  const socialEntries = Object.entries(FOOTER_SOCIAL_LINKS) as [FooterSocialKey, string][];

  return (
    <footer
      className="fg-footer-glow relative border-t-2 border-slate-900 bg-white pb-16 pt-16 md:pt-24"
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div className="mx-auto w-full max-w-[1440px] px-4 sm:px-6">
        {/* Grille unique 4 colonnes — ligne 2 alignée sur ligne 1 */}
        <div className="mb-12 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:mb-16 lg:grid-cols-4 lg:gap-x-8 lg:gap-y-12 xl:gap-x-10">
          {/* Ligne 1 · col 1 — Marque */}
          <div className="min-w-0 sm:col-span-2 lg:col-span-1 lg:row-start-1 lg:col-start-1">
              <Link href="/" className="inline-block">
                <span className="font-title text-xl font-black uppercase leading-none tracking-tighter text-slate-900 xl:text-2xl">
                  FreeGeny
                </span>
                <span className="mt-1 block font-caveat text-base font-bold text-orange-600 xl:text-lg">
                  {t("tagline")}
                </span>
              </Link>
              <p className="mt-3 text-xs leading-relaxed text-slate-500">
                {t("description")}
              </p>

              <div className="mt-4 flex flex-wrap gap-2">
                <Link
                  href="/dashboard/explore"
                  className="inline-flex items-center gap-1.5 rounded-xl bg-orange-600 px-3 py-2 text-[10px] font-black text-white transition hover:bg-orange-500 xl:text-xs"
                >
                  <Sparkles className="h-3 w-3 shrink-0" />
                  {t("tryFree")}
                </Link>
                <Link
                  href="/auth/register"
                  className="inline-flex items-center rounded-xl border border-slate-200 px-3 py-2 text-[10px] font-black text-slate-700 transition hover:border-orange-300 hover:text-orange-600 xl:text-xs"
                >
                  {t("registerFree")}
                </Link>
              </div>

              <div className="mt-5 flex gap-3 lg:hidden">
                {socialEntries.map(([key, url]) =>
                  url.startsWith("/") ? (
                    <Link
                      key={key}
                      href={url}
                      aria-label={t(`social.${key}`)}
                      className="text-slate-300 transition hover:text-orange-600"
                    >
                      {SOCIAL_ICONS[key]}
                    </Link>
                  ) : (
                    <a
                      key={key}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      aria-label={t(`social.${key}`)}
                      className="text-slate-300 transition hover:text-orange-600"
                    >
                      {SOCIAL_ICONS[key]}
                    </a>
                  )
                )}
              </div>
            </div>

            <FooterColumn
              className="min-w-0 lg:row-start-1 lg:col-start-2"
              title={t("columns.product")}
              links={[
                { href: "/parents", label: t("product.parents") },
                { href: "/teachers", label: t("product.teachers") },
                { href: "/dashboard/explore", label: t("product.explore") },
                { href: "/auth/login", label: t("product.login") },
                { href: "/auth/register", label: t("product.register") },
              ]}
            />

            <FooterColumn
              className="min-w-0 lg:row-start-1 lg:col-start-3"
              title={t("columns.features")}
              links={[
                { href: "/dashboard/explore", label: t("features.workshop") },
                { href: "/parents", label: t("features.geny") },
                { href: "/dashboard/explore", label: t("features.library") },
                { href: "/parents", label: t("features.messaging") },
                { href: "/parents", label: t("features.screenTime") },
                { href: "/teachers", label: t("features.teacherWall") },
                { href: "/teachers", label: t("features.teacherClass") },
              ]}
            />

            <FooterColumn
              className="min-w-0 lg:row-start-1 lg:col-start-4"
              title={t("columns.help")}
              links={[
                { href: "/faq", label: t("help.faq") },
                { href: "/contact", label: t("help.contact") },
                { href: "/blog", label: t("help.blog") },
                { href: "/press", label: t("help.press") },
              ]}
            />

          {/* Ligne 2 · alignée sous Produit · Fonctionnalités · Aide */}
          <FooterColumn
            className="min-w-0 lg:row-start-2 lg:col-start-2"
            title={t("columns.company")}
            links={[
              { href: "/about", label: t("company.about") },
              { href: "/approach", label: t("company.approach") },
              { href: "/mission", label: t("company.mission") },
              { href: "/science", label: t("company.science") },
            ]}
          />

          <FooterColumn
            className="min-w-0 lg:row-start-2 lg:col-start-3"
            title={t("columns.legal")}
            links={[
              { href: "/privacy", label: t("legal.privacy") },
              { href: "/terms", label: t("legal.terms") },
              { href: "/legal", label: t("legal.legalNotice") },
              { href: "/data-protection", label: t("legal.dataProtection") },
              { href: "/cookies", label: t("legal.cookies") },
              { href: "/child-safety", label: t("legal.childSafety") },
            ]}
          />

          <div className="min-w-0 lg:row-start-2 lg:col-start-4">
            <h4 className={columnTitleClass}>{t("columns.trust")}</h4>
            <div className="flex flex-col gap-3">
              {[t("bottom.trustEncrypted"), t("bottom.trustChildSafe")].map((label) => (
                <span
                  key={label}
                  className="inline-flex w-fit items-center gap-1.5 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-[10px] font-black uppercase tracking-wide text-slate-600"
                >
                  <ShieldCheck className="h-3 w-3 shrink-0 text-emerald-600" />
                  {label}
              </span>
              ))}
            </div>
            <div className="mt-5 hidden gap-3 lg:flex">
              {socialEntries.map(([key, url]) =>
                url.startsWith("/") ? (
                  <Link
                    key={key}
                    href={url}
                    aria-label={t(`social.${key}`)}
                    className="text-slate-300 transition hover:text-orange-600"
                  >
                    {SOCIAL_ICONS[key]}
                  </Link>
                ) : (
                  <a
                    key={key}
                    href={url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={t(`social.${key}`)}
                    className="text-slate-300 transition hover:text-orange-600"
                  >
                    {SOCIAL_ICONS[key]}
                  </a>
                )
              )}
            </div>
          </div>
        </div>

        {/* Barre basse — une seule ligne */}
        <div className="flex flex-col items-center gap-4 border-t border-slate-100 pt-8 lg:flex-row lg:justify-between">
          <p className="text-center text-[11px] font-semibold uppercase tracking-wide text-slate-400 lg:text-start lg:whitespace-nowrap">
            © {new Date().getFullYear()} FreeGeny · {t("bottom.rights")} · {t("bottom.region")}
          </p>

          <div className="flex shrink-0 flex-wrap items-center justify-center gap-3">
            <Link
              href="/dashboard/explore"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl bg-slate-900 px-5 py-2.5 text-white transition hover:bg-slate-800"
            >
              <Sparkles className="h-4 w-4 shrink-0 text-orange-400" />
              <span className="text-[11px] font-bold">{t("web.explore")}</span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-2 whitespace-nowrap rounded-xl border border-slate-200 bg-white px-5 py-2.5 text-slate-800 transition hover:border-orange-300 hover:text-orange-600"
            >
              <Globe className="h-4 w-4 shrink-0" />
              <span className="text-[11px] font-bold">{t("web.openApp")}</span>
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}


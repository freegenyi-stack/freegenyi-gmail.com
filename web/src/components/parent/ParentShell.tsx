"use client";

import React, { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { isParentRtl, parentSubtitleFont, parentTitleFont } from "@/lib/parent/parent-rtl";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Spotlight } from "@/components/aceternity/spotlight";
import {
  PARENT_MOBILE_MORE_KEYS,
  PARENT_MOBILE_PRIMARY_KEYS,
  PARENT_NAV,
  PARENT_NAV_EXTRA,
} from "@/components/parent/parent-nav";

export function ParentPageHeader({
  title,
  subtitle,
  badge,
  premium = false,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
  premium?: boolean;
}) {
  const locale = useLocale();
  const isRtl = isParentRtl(locale);

  if (premium) {
    return (
      <div className="relative mb-6 overflow-hidden rounded-[1.75rem] border border-orange-100/80 bg-[#FFFBF7] p-6 shadow-lg shadow-orange-100/40 md:mb-8 md:p-8">
        <Spotlight className="-top-40 start-0 md:-top-20 md:start-60" />
        <div className="pointer-events-none absolute -end-12 -top-12 h-40 w-40 rounded-full bg-orange-200/30 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-16 start-8 h-36 w-36 rounded-full bg-amber-100/50 blur-3xl" />
        <div className="relative z-10">
          {badge && (
            <span className="mb-3 inline-flex items-center rounded-full border border-orange-200/60 bg-orange-50 px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-orange-600">
              {badge}
            </span>
          )}
          <h1
            className={cn(
              parentTitleFont(isRtl),
              "text-2xl font-black tracking-tight text-slate-900 md:text-3xl"
            )}
          >
            {title}
          </h1>
          {subtitle && (
            <p
              className={cn(
                "mt-2 max-w-2xl text-sm font-medium text-slate-600 md:text-base",
                parentSubtitleFont(isRtl)
              )}
            >
              {subtitle}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mb-5 lg:mb-8">
      {badge && (
        <span className="mb-3 inline-flex items-center rounded-full bg-orange-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-orange-700">
          {badge}
        </span>
      )}
      <h1
        className={cn(parentTitleFont(isRtl), "text-2xl font-black tracking-tight text-slate-900 md:text-3xl")}
      >
        {title}
      </h1>
      {subtitle && (
        <p
          className={cn(
            "mt-1 max-w-2xl text-sm font-medium text-slate-500 md:text-base",
            parentSubtitleFont(isRtl)
          )}
        >
          {subtitle}
        </p>
      )}
    </div>
  );
}

export function ParentSectionCard({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <section
      className={cn(
        "rounded-3xl border border-orange-100/60 bg-white p-6 shadow-sm",
        className
      )}
    >
      {children}
    </section>
  );
}

/** Empty state cohérent — remplace les `border-teal-200 bg-teal-50` ad hoc */
export function ParentEmptyState({
  children,
  className,
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <ParentSectionCard
      className={cn("border-dashed border-orange-200/80 bg-[#FFFBF7]/80 p-10 text-center", className)}
    >
      {children}
    </ParentSectionCard>
  );
}

function NavLink({
  href,
  icon: Icon,
  label,
  active,
  compact,
  onNavigate,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  compact?: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center rounded-xl transition-all font-bold",
        compact ? "min-w-0 flex-col justify-center px-0.5 py-1" : "gap-2.5 px-4 py-2.5 text-sm",
        !compact && active && "bg-orange-500 text-white shadow-lg shadow-orange-500/20",
        !compact && !active && "text-slate-600 hover:bg-orange-50 hover:text-orange-800",
        compact && !active && "text-slate-500"
      )}
    >
      {compact ? (
        <span
          className={cn(
            "flex w-full min-w-0 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5",
            active && "bg-orange-500 text-white shadow-md shadow-orange-500/20"
          )}
        >
          <Icon className="h-[18px] w-[18px] shrink-0" />
          <span className="w-full truncate text-center text-[9px] font-bold leading-tight">{label}</span>
        </span>
      ) : (
        <>
          <Icon className="h-4 w-4 shrink-0" />
          <span>{label}</span>
        </>
      )}
    </Link>
  );
}

function ParentNavLinks({
  t,
  isActive,
  onNavigate,
}: {
  t: (key: string) => string;
  isActive: (href: string, exact?: boolean) => boolean;
  onNavigate?: () => void;
}) {
  return (
    <>
      {PARENT_NAV.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={t(item.key)}
          active={isActive(item.href, "exact" in item ? item.exact : undefined)}
          onNavigate={onNavigate}
        />
      ))}
      <div className="my-2 border-t border-orange-100/80" />
      {PARENT_NAV_EXTRA.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={t(item.key)}
          active={isActive(item.href)}
          onNavigate={onNavigate}
        />
      ))}
    </>
  );
}

export default function ParentShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("ParentSpace.nav");
  const isRTL = isParentRtl(locale);
  const [moreOpen, setMoreOpen] = useState(false);

  const isFocusMode = Boolean(
    pathname &&
      (pathname.includes("/atelier/visuel/") ||
        pathname.includes("/atelier/carte-mentale/") ||
        pathname.includes("/atelier/document/") ||
        pathname.includes("/atelier/h5p/") ||
        pathname.includes("/atelier/activite/") ||
        pathname.includes("/mur/jouer/") ||
        (pathname.includes("/bibliotheque/") && !pathname.endsWith("/bibliotheque") && !pathname.endsWith("/stats")))
  );

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);

  const moreActive =
    PARENT_NAV.some(
      (item) => PARENT_MOBILE_MORE_KEYS.has(item.key) && isActive(item.href, "exact" in item ? item.exact : undefined)
    ) || PARENT_NAV_EXTRA.some((item) => isActive(item.href));

  return (
    <div
      className={cn(
        "min-h-[calc(100dvh-var(--header-height,72px))] font-ui-ar",
        isFocusMode
          ? "bg-[#f0f2f5]"
          : "bg-gradient-to-b from-[#FFFBF7] via-white to-orange-50/30 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-8"
      )}
      dir={isRTL ? "rtl" : "ltr"}
    >
      <div
        className={cn(
          "mx-auto flex w-full",
          isFocusMode ? "max-w-none" : "max-w-7xl gap-6 px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8"
        )}
      >
        {!isFocusMode && (
          <aside className="sticky top-[calc(var(--header-height,72px)+1rem)] hidden w-52 shrink-0 flex-col gap-0.5 self-start lg:flex xl:w-56">
            <p className="mb-2 px-4 text-[10px] font-black uppercase tracking-widest text-slate-400">
              {t("sectionLabel")}
            </p>
            <ParentNavLinks t={t} isActive={isActive} />
          </aside>
        )}

        <main className="min-w-0 flex-1">{children}</main>
      </div>

      {!isFocusMode && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-orange-100/80 bg-[#FFFBF7]/95 shadow-[0_-8px_30px_rgba(249,115,22,0.06)] backdrop-blur-lg pb-[env(safe-area-inset-bottom)] lg:hidden">
          <div className="mx-auto grid max-w-lg grid-cols-5 gap-0 px-0.5 pt-1">
            {[
              ...PARENT_NAV.filter((item) => PARENT_MOBILE_PRIMARY_KEYS.has(item.key)),
              ...PARENT_NAV_EXTRA.filter((item) => PARENT_MOBILE_PRIMARY_KEYS.has(item.key)),
            ].map((item) => (
              <NavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={t(item.key)}
                active={isActive(item.href, "exact" in item ? item.exact : undefined)}
                compact
              />
            ))}
            <Sheet open={moreOpen} onOpenChange={setMoreOpen}>
              <SheetTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "flex min-w-0 flex-col items-center justify-center rounded-xl px-0.5 py-1 font-bold transition-all",
                    moreActive ? "text-orange-700" : "text-slate-500"
                  )}
                >
                  <span
                    className={cn(
                      "flex w-full min-w-0 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5",
                      moreActive && "bg-orange-500 text-white shadow-md shadow-orange-500/20"
                    )}
                  >
                    <Menu className="h-[18px] w-[18px] shrink-0" />
                    <span className="w-full truncate text-center text-[9px] font-bold leading-tight">{t("more")}</span>
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "left" : "right"} className="w-full max-w-xs bg-[#FFFBF7]">
                <p className="text-lg font-black text-slate-900">{t("moreTitle")}</p>
                <div className="mt-4 flex flex-col gap-1">
                  {PARENT_NAV.filter((item) => PARENT_MOBILE_MORE_KEYS.has(item.key)).map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={t(item.key)}
                      active={isActive(item.href, "exact" in item ? item.exact : undefined)}
                      onNavigate={() => setMoreOpen(false)}
                    />
                  ))}
                  <div className="my-2 border-t border-orange-100/80" />
                  {PARENT_NAV_EXTRA.map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={t(item.key)}
                      active={isActive(item.href)}
                      onNavigate={() => setMoreOpen(false)}
                    />
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </nav>
      )}
    </div>
  );
}

"use client";

import React, { useState } from "react";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import TeacherVerificationBanner, { type TeacherVerificationInfo } from "./TeacherVerificationBanner";
import {
  TEACHER_MOBILE_MORE_KEYS,
  TEACHER_MOBILE_PRIMARY_KEYS,
  TEACHER_NAV,
  TEACHER_NAV_EXTRA,
} from "@/components/teacher/teacher-nav";

export function TeacherPageHeader({
  title,
  subtitle,
  badge,
}: {
  title: string;
  subtitle?: string;
  badge?: string;
}) {
  return (
    <div className="mb-5 lg:mb-8">
      {badge && (
        <span className="mb-3 inline-flex items-center rounded-full bg-teal-100 px-3 py-1 text-[10px] font-black uppercase tracking-widest text-teal-700">
          {badge}
        </span>
      )}
      <h1 className="font-reem text-2xl font-black tracking-tight text-slate-900 md:text-3xl">{title}</h1>
      {subtitle && <p className="mt-1 max-w-2xl text-sm font-medium text-slate-500 md:text-base">{subtitle}</p>}
    </div>
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
        !compact && active && "bg-teal-600 text-white shadow-lg shadow-teal-600/20",
        !compact && !active && "text-slate-600 hover:bg-teal-50 hover:text-teal-800",
        compact && !active && "text-slate-500"
      )}
    >
      {compact ? (
        <span
          className={cn(
            "flex w-full min-w-0 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5",
            active && "bg-teal-600 text-white shadow-md shadow-teal-600/20"
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

function TeacherNavLinks({
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
      {TEACHER_NAV.map((item) => (
        <NavLink
          key={item.href}
          href={item.href}
          icon={item.icon}
          label={t(item.key)}
          active={isActive(item.href, "exact" in item ? item.exact : undefined)}
          onNavigate={onNavigate}
        />
      ))}
      <div className="my-2 border-t border-slate-200" />
      {TEACHER_NAV_EXTRA.map((item) => (
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

export default function TeacherShell({
  children,
  verification,
}: {
  children: React.ReactNode;
  verification?: TeacherVerificationInfo | null;
}) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("TeacherSpace.nav");
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const [moreOpen, setMoreOpen] = useState(false);
  const isFocusMode = Boolean(pathname && (pathname.includes("/atelier/visuel/") || pathname.includes("/atelier/carte-mentale/")));

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);

  const moreActive =
    TEACHER_NAV.some(
      (item) => TEACHER_MOBILE_MORE_KEYS.has(item.key) && isActive(item.href, "exact" in item ? item.exact : undefined)
    ) || TEACHER_NAV_EXTRA.some((item) => isActive(item.href));

  return (
    <div
      className={cn(
        "min-h-[calc(100dvh-var(--header-height,72px))] font-ui-ar",
        isFocusMode
          ? "bg-[#f0f2f5]"
          : "bg-gradient-to-b from-teal-50/60 via-white to-slate-50 pb-[calc(4.5rem+env(safe-area-inset-bottom))] lg:pb-8"
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
            <TeacherNavLinks t={t} isActive={isActive} />
          </aside>
        )}

        <main className="min-w-0 flex-1">
          {!isFocusMode && verification && verification.status !== "approved" && (
            <TeacherVerificationBanner verification={verification} />
          )}
          {children}
        </main>
      </div>

      {!isFocusMode && (
        <nav className="fixed inset-x-0 bottom-0 z-30 border-t border-slate-200/90 bg-white/95 shadow-[0_-8px_30px_rgba(15,23,42,0.08)] backdrop-blur-lg pb-[env(safe-area-inset-bottom)] lg:hidden">
          <div className="mx-auto grid max-w-lg grid-cols-5 gap-0 px-0.5 pt-1">
            {TEACHER_NAV.filter((item) => TEACHER_MOBILE_PRIMARY_KEYS.has(item.key)).map((item) => (
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
                    moreActive ? "text-teal-700" : "text-slate-500"
                  )}
                >
                  <span
                    className={cn(
                      "flex w-full min-w-0 flex-col items-center gap-0.5 rounded-xl px-1 py-1.5",
                      moreActive && "bg-teal-600 text-white shadow-md shadow-teal-600/20"
                    )}
                  >
                    <Menu className="h-[18px] w-[18px] shrink-0" />
                    <span className="w-full truncate text-center text-[9px] font-bold leading-tight">{t("more")}</span>
                  </span>
                </button>
              </SheetTrigger>
              <SheetContent side={isRTL ? "left" : "right"} className="w-full max-w-xs">
                <p className="text-lg font-black text-slate-900">{t("moreTitle")}</p>
                <div className="mt-4 flex flex-col gap-1">
                  {TEACHER_NAV.filter((item) => TEACHER_MOBILE_MORE_KEYS.has(item.key)).map((item) => (
                    <NavLink
                      key={item.href}
                      href={item.href}
                      icon={item.icon}
                      label={t(item.key)}
                      active={isActive(item.href, "exact" in item ? item.exact : undefined)}
                      onNavigate={() => setMoreOpen(false)}
                    />
                  ))}
                  <div className="my-2 border-t border-slate-200" />
                  {TEACHER_NAV_EXTRA.map((item) => (
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

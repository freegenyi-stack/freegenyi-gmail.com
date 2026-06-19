"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Link, usePathname } from "@/i18n/routing";
import { useLocale, useTranslations } from "next-intl";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { TEACHER_NAV, TEACHER_NAV_EXTRA } from "@/components/teacher/teacher-nav";

function DrawerNavLink({
  href,
  icon: Icon,
  label,
  active,
  onNavigate,
}: {
  href: string;
  icon: React.ElementType;
  label: string;
  active: boolean;
  onNavigate?: () => void;
}) {
  return (
    <Link
      href={href}
      onClick={onNavigate}
      className={cn(
        "flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-bold transition-all",
        active
          ? "bg-teal-600 text-white shadow-lg shadow-teal-600/20"
          : "text-slate-600 hover:bg-teal-50 hover:text-teal-800"
      )}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span>{label}</span>
    </Link>
  );
}

type Props = {
  /** Variante compacte pour la barre éditeur (logo FG seul). */
  variant?: "logo" | "default";
};

export default function TeacherNavDrawer({ variant = "logo" }: Props) {
  const pathname = usePathname();
  const locale = useLocale();
  const t = useTranslations("TeacherSpace.nav");
  const isRTL = locale.endsWith("-ar") || locale === "ar";
  const [open, setOpen] = useState(false);

  const isActive = (href: string, exact?: boolean) =>
    exact ? pathname === href : pathname === href || pathname?.startsWith(`${href}/`);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        {variant === "logo" ? (
          <button
            type="button"
            className="group relative flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-gradient-to-br from-teal-500 via-teal-600 to-emerald-600 shadow-md shadow-teal-700/25 ring-1 ring-inset ring-white/20 transition hover:scale-[1.03] hover:shadow-lg hover:shadow-teal-700/30 active:scale-95"
            aria-label={t("openMenu")}
          >
            <Image
              src="/assets/img/logo.png"
              alt=""
              width={24}
              height={24}
              className="h-6 w-6 drop-shadow-sm transition group-hover:brightness-110"
            />
          </button>
        ) : (
          <button
            type="button"
            className="flex h-10 w-10 items-center justify-center rounded-xl border border-slate-200 bg-white text-slate-600 shadow-sm transition hover:border-teal-200 hover:text-teal-700"
            aria-label={t("openMenu")}
          >
            <Image src="/assets/img/logo.png" alt="" width={22} height={22} className="h-5 w-5" />
          </button>
        )}
      </SheetTrigger>
      <SheetContent
        side={isRTL ? "right" : "left"}
        className="flex w-full max-w-[280px] flex-col gap-0 border-slate-200/80 p-0"
      >
        <div className="border-b border-slate-100 bg-gradient-to-br from-teal-600 to-emerald-700 px-5 py-5 text-white">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-white/15 ring-1 ring-white/25">
              <Image src="/assets/img/logo.png" alt="" width={28} height={28} className="h-7 w-7" />
            </div>
            <div>
              <p className="font-reem text-lg font-black leading-tight">FreeGeny</p>
              <p className="text-[11px] font-bold text-teal-100/90">{t("sectionLabel")}</p>
            </div>
          </div>
        </div>
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <div className="flex flex-col gap-1">
            {TEACHER_NAV.map((item) => (
              <DrawerNavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={t(item.key)}
                active={isActive(item.href, "exact" in item ? item.exact : undefined)}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
          <div className="my-3 border-t border-slate-200" />
          <div className="flex flex-col gap-1">
            {TEACHER_NAV_EXTRA.map((item) => (
              <DrawerNavLink
                key={item.href}
                href={item.href}
                icon={item.icon}
                label={t(item.key)}
                active={isActive(item.href)}
                onNavigate={() => setOpen(false)}
              />
            ))}
          </div>
        </nav>
      </SheetContent>
    </Sheet>
  );
}

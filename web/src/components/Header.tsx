"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import { useRegion } from "@/context/RegionContext";
import { REGIONS } from "@/constants/regions";
import { HIDDEN_NAV_HREFS } from "@/constants/publicNav";
import { LUXURY } from "@/constants/design";
import {
  ChevronDown,
  LayoutDashboard,
  Clock,
  UserPlus,
  Palette,
  Settings,
  LogOut,
  MessageCircle,
  Mic,
  Bell,
  FlaskConical,
  Calculator,
  Feather,
  Paintbrush,
  Rocket,
  Code2,
  AlertCircle,
  Menu,
} from "lucide-react";
import { NotificationPanel, openNotificationPanel } from "./NotificationCenter";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, locales } from "@/i18n/routing";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const AVATAR_ICONS: Record<string, React.ReactNode> = {
  scientist: <FlaskConical className="w-3.5 h-3.5" />,
  math: <Calculator className="w-3.5 h-3.5" />,
  lit: <Feather className="w-3.5 h-3.5" />,
  artist: <Paintbrush className="w-3.5 h-3.5" />,
  astro: <Rocket className="w-3.5 h-3.5" />,
  tech: <Code2 className="w-3.5 h-3.5" />,
};

const AVATAR_BG: Record<string, string> = {
  scientist: "bg-sky-600",
  math: "bg-orange-600",
  lit: "bg-emerald-600",
  artist: "bg-violet-600",
  astro: "bg-indigo-600",
  tech: "bg-neutral-800",
};

const DASH_ROUTES: Record<string, string> = {
  parent: "parent",
  coparent: "parent",
  enseignant: "enseignant",
  ecole: "ecole",
  school: "ecole",
  ong: "ong",
  ngo: "ong",
};

interface UserProfile {
  id: number;
  fullName: string;
  username: string;
  role: string;
  image: string | null;
  avatarConfig: { id: string; icon: string; bg: string } | null;
  profileComplete: boolean;
  notifCount: number;
  partner: {
    id: number;
    fullName: string;
    role: string;
    image: string | null;
    isOnline: boolean;
  } | null;
}

export default function Header() {
  const pathname = usePathname();
  const { data: session } = useSession();
  const tNav = useTranslations("Nav");
  const tAuth = useTranslations("Auth");
  const tUser = useTranslations("UserMenu");
  const locale = useLocale();
  const { selectedCountry, setRegion } = useRegion();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);

  const isRTL = locale === "ar" || locale.endsWith("-ar");

  useEffect(() => {
    if (!session?.user?.email) return;
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (!data.error) setProfile(data);
      })
      .catch(() => {});
  }, [session]);

  const navLinks = [
    { label: tNav("About"), href: "/about" },
    { label: tNav("Approach"), href: "/approach" },
    { label: tNav("Parents"), href: "/parents" },
    { label: tNav("Teachers"), href: "/teachers" },
    { label: tNav("Schools"), href: "/schools" },
    { label: tNav("NGOs"), href: "/ngos" },
    { label: tNav("Science"), href: "/science" },
  ].filter((item) => !HIDDEN_NAV_HREFS.includes(item.href as (typeof HIDDEN_NAV_HREFS)[number]));

  const handleRegionChange = (code: string, l: string) => {
    setRegion(code, l);
    const rawPath = window.location.pathname;
    const cleanSegments = rawPath
      .split("/")
      .filter(Boolean)
      .filter((seg) => !locales.some((loc) => loc.toLowerCase() === seg.toLowerCase()));
    const cleanPath = "/" + cleanSegments.join("/");
    window.location.href = `/${code}-${l}${cleanPath === "/" ? "" : cleanPath}${window.location.search}`;
  };

  const regions = REGIONS as Record<string, { name: string; langs: string[] }>;
  const sortedCountries = Object.keys(regions).sort((a, b) => regions[a].name.localeCompare(regions[b].name));
  const finalCountries = [selectedCountry, ...sortedCountries.filter((c) => c !== selectedCountry)];

  const langCode = locale.includes("-") ? locale.split("-").pop()?.toUpperCase() : locale.toUpperCase();

  const getInitials = () => {
    const name = session?.user?.name?.trim();
    if (!name) return "U";
    const parts = name.split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name[0].toUpperCase();
  };

  const renderAvatar = (size = "h-8 w-8") => {
    const ac = profile?.avatarConfig;
    if (ac && AVATAR_ICONS[ac.id]) {
      return (
        <div className={cn(size, "flex items-center justify-center rounded-full text-white", AVATAR_BG[ac.id])}>
          {AVATAR_ICONS[ac.id]}
        </div>
      );
    }
    if (session?.user?.image) {
      return <img src={session.user.image} alt="" className={cn(size, "rounded-full object-cover")} />;
    }
    return (
      <div className={cn(size, "flex items-center justify-center rounded-full bg-neutral-900 text-[10px] font-medium text-white")}>
        {getInitials()}
      </div>
    );
  };

  const userRole = profile?.role || "parent";
  const dashRoute = DASH_ROUTES[userRole] || "parent";
  const partner = profile?.partner || null;

  const roleLabel =
    userRole === "enseignant" ? tUser("roleTeacher")
    : userRole === "ecole" ? tUser("roleSchool")
    : userRole === "ong" ? tUser("roleNgo")
    : userRole === "parent" ? tUser("roleParent")
    : tUser("member");

  const spaceLabel =
    userRole === "enseignant" ? tUser("spaceTeacher")
    : userRole === "ecole" ? tUser("spaceSchool")
    : userRole === "ong" ? tUser("spaceNgo")
    : tUser("spaceParent");

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href));

  function NavItem({ href, label, onClick, className }: { href: string; label: string; onClick?: () => void; className?: string }) {
    const active = isActive(href);
    return (
      <Link
        href={href}
        onClick={onClick}
        className={cn(
          "whitespace-nowrap rounded-full px-5 py-2 text-sm font-medium transition-colors lg:px-5 xl:px-6",
          active ? "bg-white text-gray-800 shadow-sm" : "text-gray-500 hover:text-orange-600",
          isRTL ? "font-amiri" : "font-inter",
          className
        )}
      >
        {label}
      </Link>
    );
  }

  function RegionSelector({ compact }: { compact?: boolean }) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button
            type="button"
            aria-label={tNav("Region")}
            className={cn(
              "inline-flex h-10 items-center justify-between gap-2 rounded-xl border-2 border-gray-200 bg-white text-sm font-semibold text-gray-800 shadow-sm transition",
              "hover:border-orange-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-orange-500/25",
              "data-[state=open]:border-orange-500 data-[state=open]:ring-2 data-[state=open]:ring-orange-500/20",
              compact ? "min-w-[7.5rem] px-2.5" : "min-w-[10.5rem] px-3.5",
              isRTL && "font-amiri"
            )}
          >
            <span className="flex min-w-0 items-center gap-2">
              <img
                src={`https://flagcdn.com/w20/${selectedCountry.toLowerCase()}.png`}
                alt=""
                className="h-3.5 w-5 shrink-0 rounded-sm object-cover"
              />
              <span className="truncate" dir="ltr">
                {selectedCountry}
                {!compact && (
                  <>
                    <span className="text-gray-300"> · </span>
                    {langCode}
                  </>
                )}
              </span>
            </span>
            <ChevronDown className="h-4 w-4 shrink-0 text-gray-500" />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isRTL ? "start" : "end"}
          dir={isRTL ? "rtl" : "ltr"}
          className="w-72 max-h-[55vh] overflow-y-auto rounded-2xl border border-gray-100 bg-white p-3 shadow-lg"
        >
          <DropdownMenuLabel className="text-[11px] font-medium text-neutral-400">{tNav("Region")}</DropdownMenuLabel>
          {finalCountries.map((code) => {
            const region = regions[code];
            return (
              <div key={code} className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-neutral-50">
                <button type="button" onClick={() => handleRegionChange(code, region.langs[0])} className="flex items-center gap-2 text-start">
                  <img src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`} alt="" className="h-2.5 w-auto" />
                  <span className="text-xs font-medium text-neutral-700">{region.name}</span>
                </button>
                <div className="flex gap-0.5">
                  {region.langs.map((l) => (
                    <button
                      key={l}
                      type="button"
                      onClick={() => handleRegionChange(code, l)}
                      className={cn(
                        "rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase transition",
                        selectedCountry === code && locale.endsWith(l)
                          ? "bg-orange-500 text-white"
                          : "text-gray-500 hover:text-orange-600"
                      )}
                    >
                      {l}
                    </button>
                  ))}
                </div>
              </div>
            );
          })}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <header
      className={cn("fixed inset-x-0 top-0 z-[120] border-b border-gray-100 bg-white", isRTL ? "font-amiri" : "font-inter")}
      dir={isRTL ? "rtl" : "ltr"}
      style={{ height: LUXURY.headerHeight }}
    >
      <div className="mx-auto flex h-full max-w-[120rem] items-center px-4 sm:px-6 lg:px-7">
        <div className="grid w-full grid-cols-2 items-center lg:grid-cols-[1fr_auto_1fr]">
        <Link href="/" className="flex shrink-0 items-center gap-2 justify-self-start" dir="ltr">
          <Image src="/assets/img/logo.png" alt="FreeGeny" width={32} height={32} className="h-8 w-8" />
          <span className="font-inter hidden text-base font-semibold tracking-tight text-gray-800 sm:inline" dir="ltr">
            Free<span className="text-orange-600">Geny</span>
          </span>
        </Link>

        <div className="hidden items-center justify-center gap-6 lg:col-start-2 lg:flex xl:gap-8">
          <nav className="flex max-h-fit shrink-0 items-center gap-1.5 rounded-full bg-[#F9FAFB] p-1.5 lg:gap-2 lg:p-2">
            {navLinks.map((item) => (
              <NavItem key={item.href} href={item.href} label={item.label} />
            ))}
          </nav>
          <RegionSelector />
        </div>

        <div className="col-start-2 flex shrink-0 items-center justify-self-end gap-2.5 sm:gap-4 lg:col-start-3">
          <div className="shrink-0 lg:hidden">
            <RegionSelector compact />
          </div>
          {session ? (
            <>
              <Link
                href="/dashboard/messages"
                className="relative inline-flex size-10 items-center justify-center rounded-full bg-[#F2F4F7] text-[#667085] transition hover:bg-gray-100 hover:text-gray-800"
                title={tUser("messaging")}
              >
                <MessageCircle className="h-[17px] w-[17px] stroke-[1.75]" />
              </Link>

              <button
                type="button"
                onClick={() => openNotificationPanel()}
                className="relative inline-flex size-10 items-center justify-center rounded-full bg-[#F2F4F7] text-[#667085] transition hover:bg-gray-100 hover:text-gray-800"
                title={tUser("notifications")}
              >
                <Bell className="h-[17px] w-[17px] stroke-[1.75]" />
                {(profile?.notifCount ?? 0) > 0 && (
                  <span className="absolute end-2 top-2 flex h-4 min-w-4 items-center justify-center rounded-full bg-orange-500 px-1 text-[9px] font-bold text-white">
                    {profile!.notifCount > 9 ? "9+" : profile!.notifCount}
                  </span>
                )}
              </button>

              <NotificationPanel />

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="rounded-full transition hover:opacity-80">
                    {renderAvatar()}
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align={isRTL ? "start" : "end"}
                  dir={isRTL ? "rtl" : "ltr"}
                  className="w-72 rounded-2xl border border-gray-100 bg-white p-0 shadow-lg"
                >
                  <div className="px-4 py-4">
                    <div className="flex items-center gap-3">
                      {renderAvatar("h-10 w-10")}
                      <div className="min-w-0 flex-1 text-start">
                        <p className="truncate text-sm font-semibold text-neutral-900">{session.user?.name}</p>
                        <p className="truncate text-xs text-neutral-400" dir="ltr">
                          @{profile?.username || session.user?.email?.split("@")[0]}
                        </p>
                        <p className={cn("mt-0.5 text-[11px] text-neutral-400", isRTL && "font-amiri")}>{roleLabel}</p>
                      </div>
                    </div>
                  </div>

                  {partner && (
                    <div className="px-4 pb-3">
                      <p className={cn("mb-2 text-[10px] font-medium text-neutral-400", isRTL && "font-amiri")}>
                        {tUser("linkedParent")}
                      </p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <div className="relative flex h-7 w-7 items-center justify-center rounded-full bg-neutral-100 text-[10px] font-semibold text-neutral-600">
                            {partner.fullName?.[0]?.toUpperCase()}
                            <span className={cn("absolute -bottom-px -end-px h-1.5 w-1.5 rounded-full", partner.isOnline ? "bg-emerald-500" : "bg-neutral-300")} />
                          </div>
                          <span className="text-xs font-medium text-neutral-700">{partner.fullName?.split(" ")[0]}</span>
                        </div>
                        <div className="flex gap-1">
                          <Link href="/dashboard/messages" className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700">
                            <MessageCircle className="h-3.5 w-3.5" />
                          </Link>
                          <button type="button" className="rounded-lg p-1.5 text-neutral-400 hover:text-neutral-700">
                            <Mic className="h-3.5 w-3.5" />
                          </button>
                        </div>
                      </div>
                    </div>
                  )}

                  {profile && !profile.profileComplete && (
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings" className="text-red-600">
                        <AlertCircle className="h-4 w-4" />
                        {tUser("completeProfile")}
                      </Link>
                    </DropdownMenuItem>
                  )}

                  <div className="space-y-0.5 p-1.5">
                    <DropdownMenuItem asChild>
                      <Link href={`/dashboard/${dashRoute}`}>
                        <LayoutDashboard className="h-4 w-4 opacity-40" />
                        {spaceLabel}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/history">
                        <Clock className="h-4 w-4 opacity-40" />
                        {tUser("history")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/invite">
                        <UserPlus className="h-4 w-4 opacity-40" />
                        {tUser("inviteMember")}
                      </Link>
                    </DropdownMenuItem>
                    <DropdownMenuItem
                      onSelect={(e) => {
                        e.preventDefault();
                        openNotificationPanel();
                      }}
                      className={cn(isRTL && "font-amiri")}
                    >
                      <Bell className="h-4 w-4 opacity-40" />
                      {tUser("notifications")}
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="bg-neutral-100/80" />

                  <div className="space-y-0.5 p-1.5">
                    <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent("open-theme-modal"))}>
                      <Palette className="h-4 w-4 opacity-40" />
                      {tUser("customization")}
                    </DropdownMenuItem>
                    <DropdownMenuItem asChild>
                      <Link href="/dashboard/settings">
                        <Settings className="h-4 w-4 opacity-40" />
                        {tUser("settings")}
                      </Link>
                    </DropdownMenuItem>
                  </div>

                  <DropdownMenuSeparator className="bg-neutral-100/80" />

                  <div className="p-1.5">
                    <DropdownMenuItem
                      onClick={() => signOut({ callbackUrl: `/${locale}` })}
                      className={cn("text-red-600 focus:bg-red-50 focus:text-red-700", isRTL && "font-amiri")}
                    >
                      <LogOut className="h-4 w-4" />
                      {tAuth("Logout")}
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link
                href="/dashboard/guest"
                className={cn(
                  "hidden text-sm font-medium text-gray-500 transition hover:text-orange-600 lg:inline",
                  isRTL && "font-amiri"
                )}
              >
                {tNav("FreeExplore")}
              </Link>
              <Link
                href="/auth/login"
                className={cn(
                  "hidden text-sm font-medium text-gray-700 transition hover:text-orange-600 lg:inline",
                  isRTL && "font-amiri"
                )}
              >
                {tAuth("Login")}
              </Link>
              <Link
                href="/auth/register"
                className={cn(
                  "fg-header-cta hidden h-11 items-center rounded-full px-5 text-sm font-medium text-white lg:inline-flex",
                  isRTL && "font-amiri"
                )}
              >
                {tAuth("Register")}
              </Link>
            </>
          )}

          <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
            <SheetTrigger asChild>
              <button
                className="inline-flex size-10 items-center justify-center rounded-full text-gray-500 transition hover:bg-gray-100 hover:text-gray-800 lg:hidden"
                aria-label="Menu"
              >
                <Menu className="h-5 w-5 stroke-[1.75]" />
              </button>
            </SheetTrigger>
            <SheetContent
              side={isRTL ? "left" : "right"}
              className="w-[min(100vw,18rem)] border border-gray-100 bg-white p-0 shadow-xl"
            >
              <div className="flex h-full flex-col px-6 py-8" dir={isRTL ? "rtl" : "ltr"}>
                <p className="mb-6 text-base font-semibold text-gray-800 font-inter" dir="ltr">
                  Free<span className="text-orange-600">Geny</span>
                </p>
                <nav className="flex flex-col gap-3">
                  {navLinks.map((item) => (
                    <NavItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      onClick={() => setMobileOpen(false)}
                      className="w-full px-4 py-3 text-[15px]"
                    />
                  ))}
                </nav>
                {!session && (
                  <div className="mt-auto space-y-3 pt-8">
                    <Link
                      href="/auth/login"
                      onClick={() => setMobileOpen(false)}
                      className="block text-center text-sm font-medium text-gray-700 hover:text-orange-600"
                    >
                      {tAuth("Login")}
                    </Link>
                    <Link
                      href="/auth/register"
                      onClick={() => setMobileOpen(false)}
                      className="fg-header-cta block rounded-full py-3 text-center text-sm font-medium text-white"
                    >
                      {tAuth("Register")}
                    </Link>
                  </div>
                )}
              </div>
            </SheetContent>
          </Sheet>
        </div>
        </div>
      </div>
    </header>
  );
}

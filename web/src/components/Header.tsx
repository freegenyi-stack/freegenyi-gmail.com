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
  ShieldCheck,
  Settings,
  LogOut,
  MessageCircle,
  Bell,
  FlaskConical,
  Calculator,
  Feather,
  Paintbrush,
  Rocket,
  Code2,
  AlertCircle,
  Menu,
  Sparkles,
  UserCircle,
} from "lucide-react";
import { NotificationPanel, openNotificationPanel } from "./NotificationCenter";
import CountryUnavailableModal from "./CountryUnavailableModal";
import { isCountryActive } from "@/constants/activeCountry";
import { useTranslations, useLocale } from "next-intl";
import { Link, usePathname, locales } from "@/i18n/routing";
import { useSession, signOut } from "next-auth/react";
import { cn } from "@/lib/utils";
import { getLuxuryAvatar } from "@/lib/teacher/avatar-catalog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import ParentChildSwitcher from "@/components/parent/ParentChildSwitcher";

const AVATAR_ICONS: Record<string, React.ReactNode> = {
  scientist: <FlaskConical className="h-3.5 w-3.5" />,
  math: <Calculator className="h-3.5 w-3.5" />,
  lit: <Feather className="h-3.5 w-3.5" />,
  artist: <Paintbrush className="h-3.5 w-3.5" />,
  astro: <Rocket className="h-3.5 w-3.5" />,
  tech: <Code2 className="h-3.5 w-3.5" />,
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
  isAdmin?: boolean;
  partner: {
    id: number;
    fullName: string;
    role: string;
    image: string | null;
    isOnline: boolean;
  } | null;
}

function UserAvatar({
  profile,
  session,
  userRole,
  size = "h-8 w-8",
  className,
}: {
  profile: UserProfile | null;
  session: ReturnType<typeof useSession>["data"];
  userRole: string;
  size?: string;
  className?: string;
}) {
  const getInitials = () => {
    const name = session?.user?.name?.trim();
    if (!name) return "U";
    const parts = name.split(/\s+/);
    return parts.length >= 2 ? (parts[0][0] + parts[1][0]).toUpperCase() : name[0].toUpperCase();
  };

  const ac = profile?.avatarConfig;
  const imageSrc =
    userRole === "enseignant" && profile?.image
      ? profile.image
      : session?.user?.image || undefined;

  if (imageSrc) {
    return (
      <Avatar className={cn(size, className)}>
        <AvatarImage src={imageSrc} alt="" />
        <AvatarFallback className="bg-neutral-900 text-[10px] text-white">{getInitials()}</AvatarFallback>
      </Avatar>
    );
  }

  if (userRole === "enseignant" && ac?.id) {
    const luxury = getLuxuryAvatar(ac.id);
    if (luxury) {
      const Icon = luxury.icon;
      return (
        <Avatar className={cn(size, className)}>
          <AvatarFallback className={cn("bg-gradient-to-br text-white", luxury.gradient)}>
            <Icon className="h-3.5 w-3.5" />
          </AvatarFallback>
        </Avatar>
      );
    }
  }

  if (ac && AVATAR_ICONS[ac.id]) {
    return (
      <Avatar className={cn(size, className)}>
        <AvatarFallback className={cn("text-white", AVATAR_BG[ac.id])}>{AVATAR_ICONS[ac.id]}</AvatarFallback>
      </Avatar>
    );
  }

  return (
    <Avatar className={cn(size, className)}>
      <AvatarFallback className="bg-neutral-900 text-[10px] font-medium text-white">{getInitials()}</AvatarFallback>
    </Avatar>
  );
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
  const [blockedCountry, setBlockedCountry] = useState<{ code: string; name: string } | null>(null);

  const isRTL = locale === "ar" || locale.endsWith("-ar");

  useEffect(() => {
    if (!session?.user?.email) return;
    const refreshProfile = () => {
      fetch("/api/user/profile")
        .then((r) => r.json())
        .then((data) => {
          if (!data.error) setProfile(data);
        })
        .catch(() => {});
    };
    refreshProfile();
    window.addEventListener("fg-notifications-updated", refreshProfile);
    return () => window.removeEventListener("fg-notifications-updated", refreshProfile);
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

  const helpLinks = [
    { label: tNav("HelpFaq"), href: "/faq" },
    { label: tNav("HelpContact"), href: "/contact" },
    { label: tNav("HelpBlog"), href: "/blog" },
  ];

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

  const requestRegionChange = (code: string, l: string) => {
    if (!isCountryActive(code)) {
      setBlockedCountry({ code, name: regions[code]?.name || code });
      return;
    }
    handleRegionChange(code, l);
  };

  const langCode = locale.includes("-") ? locale.split("-").pop()?.toUpperCase() : locale.toUpperCase();

  const userRole = profile?.role || "parent";
  const dashRoute = DASH_ROUTES[userRole] || "parent";
  const partner = profile?.partner || null;

  const roleLabel =
    userRole === "enseignant"
      ? tUser("roleTeacher")
      : userRole === "ecole"
        ? tUser("roleSchool")
        : userRole === "ong"
          ? tUser("roleNgo")
          : userRole === "parent"
            ? tUser("roleParent")
            : tUser("member");

  const spaceLabel =
    userRole === "enseignant"
      ? tUser("spaceTeacher")
      : userRole === "ecole"
        ? tUser("spaceSchool")
        : userRole === "ong"
          ? tUser("spaceNgo")
          : tUser("spaceParent");

  const isDashboard = pathname?.includes("/dashboard");
  const isParentSpace =
    isDashboard && (userRole === "parent" || userRole === "coparent") && pathname?.includes("/dashboard/parent");

  const isActive = (href: string) => pathname === href || (href !== "/" && pathname?.startsWith(href));

  const helpActive = helpLinks.some((item) => isActive(item.href));

  function NavItem({
    href,
    label,
    onClick,
    className,
  }: {
    href: string;
    label: string;
    onClick?: () => void;
    className?: string;
  }) {
    const active = isActive(href);
    return (
      <Button
        asChild
        variant={active ? "navActive" : "nav"}
        className={cn(isRTL ? "font-ui-ar" : "font-inter", className)}
      >
        <Link href={href} onClick={onClick}>
          {label}
        </Link>
      </Button>
    );
  }

  function HelpNavDropdown({ onSelect }: { onSelect?: () => void }) {
    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant={helpActive ? "navActive" : "nav"}
            className={cn("gap-1", isRTL ? "font-ui-ar" : "font-inter")}
          >
            {tNav("Help")}
            <ChevronDown className="h-3.5 w-3.5 opacity-60" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isRTL ? "start" : "end"}
          className={cn(
            "z-[260] min-w-[11rem] rounded-2xl border border-white/60 bg-white/90 p-1.5 shadow-xl backdrop-blur-xl",
            isRTL && "text-right"
          )}
        >
          {helpLinks.map((item) => (
            <DropdownMenuItem key={item.href} asChild>
              <Link href={item.href} onClick={onSelect} className={cn(isRTL && "font-ui-ar")}>
                {item.label}
              </Link>
            </DropdownMenuItem>
          ))}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  function RegionSelector({ compact, mini, inline }: { compact?: boolean; mini?: boolean; inline?: boolean }) {
    const countryRows = (
      <>
        {finalCountries.map((code) => {
          const region = regions[code];
          return (
            <div key={code} className="flex items-center justify-between rounded-xl px-2 py-2 hover:bg-white/40">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => requestRegionChange(code, region.langs[0])}
                className="h-auto justify-start gap-2 px-1 py-1 font-medium text-neutral-700 hover:bg-transparent"
              >
                <img src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`} alt="" className="h-2.5 w-auto" />
                <span className="text-xs">{region.name}</span>
              </Button>
              <div className="flex gap-0.5">
                {region.langs.map((l) => (
                  <Button
                    key={l}
                    type="button"
                    size="sm"
                    variant={selectedCountry === code && locale.endsWith(l) ? "secondary" : "ghost"}
                    onClick={() => requestRegionChange(code, l)}
                    className={cn(
                      "h-6 min-w-0 rounded-md px-1.5 py-0.5 text-[10px] font-medium uppercase",
                      selectedCountry === code && locale.endsWith(l)
                        ? "bg-orange-500 text-white hover:bg-orange-500"
                        : "text-gray-500 hover:text-orange-600"
                    )}
                  >
                    {l}
                  </Button>
                ))}
              </div>
            </div>
          );
        })}
      </>
    );

    if (inline) {
      return (
        <div className="fg-glass-surface max-h-52 overflow-y-auto rounded-2xl p-2 custom-scroll">
          <p className={cn("mb-1 px-2 text-[10px] font-medium uppercase tracking-widest text-neutral-400", isRTL && "font-ui-ar")}>
            {tNav("Region")}
          </p>
          {countryRows}
        </div>
      );
    }

    return (
      <DropdownMenu modal={false}>
        <DropdownMenuTrigger asChild>
          <Button
            type="button"
            variant="glassTrigger"
            aria-label={tNav("Region")}
            className={cn(
              isRTL && "font-ui-ar",
              mini && "size-9 min-w-0 max-w-none justify-center rounded-full p-0 sm:size-9",
              compact && !mini && "h-9 min-w-0 max-w-[5.5rem] shrink-0 gap-1 rounded-full px-2 sm:max-w-none sm:px-2.5"
            )}
          >
            <span className={cn("flex min-w-0 items-center", mini ? "justify-center" : "gap-1.5 sm:gap-2")}>
              <img
                src={`https://flagcdn.com/w20/${selectedCountry.toLowerCase()}.png`}
                alt=""
                className={cn("shrink-0 rounded-sm object-cover", mini ? "h-3 w-4" : "h-3.5 w-5")}
              />
              {!mini && (
                <span className="truncate text-xs sm:text-sm" dir="ltr">
                  {compact ? langCode : selectedCountry}
                  {!compact && (
                    <>
                      <span className="text-gray-300"> · </span>
                      {langCode}
                    </>
                  )}
                </span>
              )}
            </span>
            {!mini && <ChevronDown className="h-3.5 w-3.5 shrink-0 text-gray-500 sm:h-4 sm:w-4" />}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent
          align={isRTL ? "start" : "end"}
          className={cn(
            "z-[260] max-h-[55vh] w-72 overflow-y-auto rounded-2xl border border-white/60 bg-white/90 p-3 shadow-xl backdrop-blur-xl",
            isRTL && "text-right"
          )}
        >
          <DropdownMenuLabel className="text-[11px] font-medium text-neutral-400">{tNav("Region")}</DropdownMenuLabel>
          {countryRows}
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <>
      <header
        className={cn("fg-glass-header fixed inset-x-0 top-0 z-[120]", isRTL ? "font-ui-ar" : "font-inter")}
        dir={isRTL ? "rtl" : "ltr"}
        style={{
          height: `calc(${LUXURY.headerHeight}px + env(safe-area-inset-top, 0px))`,
          paddingTop: "env(safe-area-inset-top, 0px)",
        }}
      >
        <div
          className="mx-auto flex h-full w-full max-w-[120rem] items-center justify-between gap-2 px-3 sm:gap-3 sm:px-6 lg:justify-start lg:px-7"
          style={{ height: `${LUXURY.headerHeight}px` }}
        >
          <Link href="/" className="flex min-w-0 max-w-[min(42%,9rem)] shrink items-center gap-1.5 sm:max-w-none sm:gap-2 sm:shrink-0" dir="ltr">
            <Image src="/assets/img/logo.png" alt="FreeGeny" width={32} height={32} className="h-8 w-8 shrink-0" />
            <span className="hidden truncate text-base font-semibold tracking-tight text-gray-800 sm:inline font-inter" dir="ltr">
              Free<span className="text-orange-600">Geny</span>
            </span>
          </Link>

          {!isDashboard ? (
            <div className="hidden flex-1 items-center justify-center gap-6 lg:flex xl:gap-8">
              <nav className="fg-glass-pill flex max-h-fit shrink-0 items-center gap-1.5 rounded-full p-1.5 lg:gap-2 lg:p-2">
                {navLinks.map((item) => (
                  <NavItem key={item.href} href={item.href} label={item.label} />
                ))}
                <HelpNavDropdown />
              </nav>
              <RegionSelector />
            </div>
          ) : isParentSpace ? (
            <div className="hidden min-w-0 flex-1 items-center justify-center lg:flex">
              <ParentChildSwitcher />
            </div>
          ) : (
            <div className="hidden flex-1 lg:block" aria-hidden />
          )}

          <div className="flex shrink-0 items-center gap-0.5 sm:gap-1.5">
            {session ? (
              <>
                <Button variant="glassIcon" size="icon" asChild title={tUser("messaging")}>
                  <Link href="/dashboard/messages">
                    <MessageCircle className="h-[16px] w-[16px] stroke-[1.75] sm:h-[17px] sm:w-[17px]" />
                  </Link>
                </Button>

                <Button
                  type="button"
                  variant="glassIcon"
                  size="icon"
                  className="relative"
                  title={tUser("notifications")}
                  onClick={() => openNotificationPanel()}
                >
                  <Bell className="h-[16px] w-[16px] stroke-[1.75] sm:h-[17px] sm:w-[17px]" />
                  {(profile?.notifCount ?? 0) > 0 && (
                    <Badge
                      variant="accent"
                      className="absolute end-0.5 top-0.5 h-4 min-w-4 px-1 text-[9px] ring-2 ring-white/80"
                    >
                      {(profile!.notifCount ?? 0) > 9 ? "9+" : profile!.notifCount}
                    </Badge>
                  )}
                </Button>

                <NotificationPanel />

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="iconLg" className="rounded-full p-0 ring-2 ring-white/70 hover:opacity-90">
                      <UserAvatar profile={profile} session={session} userRole={userRole} size="h-9 w-9 sm:h-8 sm:w-8" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent
                    align={isRTL ? "start" : "end"}
                    className={cn(
                      "w-72 rounded-2xl border border-white/60 bg-white/92 p-0 shadow-xl backdrop-blur-xl",
                      isRTL && "text-right"
                    )}
                  >
                    <div className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <UserAvatar profile={profile} session={session} userRole={userRole} size="h-10 w-10" />
                        <div className="min-w-0 flex-1 text-start">
                          <p className="truncate text-sm font-semibold text-neutral-900">{session.user?.name}</p>
                          <p className="truncate text-xs text-neutral-400" dir="ltr">
                            @{profile?.username || session.user?.email?.split("@")[0]}
                          </p>
                          <p className={cn("mt-0.5 text-[11px] text-neutral-400", isRTL && "font-ui-ar")}>{roleLabel}</p>
                        </div>
                      </div>
                    </div>

                    {partner && (
                      <>
                        <Separator className="mx-4 w-auto" />
                        <div className="px-4 py-3">
                          <p className={cn("mb-2 text-[10px] font-medium text-neutral-400", isRTL && "font-ui-ar")}>
                            {tUser("linkedParent")}
                          </p>
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Avatar className="h-7 w-7">
                                <AvatarFallback className="relative bg-neutral-100 text-[10px] font-semibold text-neutral-600">
                                  {partner.fullName?.[0]?.toUpperCase()}
                                  <span
                                    className={cn(
                                      "absolute -bottom-px -end-px h-1.5 w-1.5 rounded-full",
                                      partner.isOnline ? "bg-emerald-500" : "bg-neutral-300"
                                    )}
                                  />
                                </AvatarFallback>
                              </Avatar>
                              <span className="text-xs font-medium text-neutral-700">{partner.fullName?.split(" ")[0]}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button variant="ghost" size="icon" className="h-8 w-8" asChild>
                                <Link href="/dashboard/messages">
                                  <MessageCircle className="h-3.5 w-3.5" />
                                </Link>
                              </Button>
                            </div>
                          </div>
                        </div>
                      </>
                    )}

                    {profile && !profile.profileComplete && (
                      <DropdownMenuItem asChild>
                        <Link
                          href={userRole === "enseignant" ? "/dashboard/enseignant/profil" : "/dashboard/settings"}
                          className="text-red-600"
                        >
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
                      {profile?.isAdmin && (
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/admin">
                            <ShieldCheck className="h-4 w-4 text-teal-600 opacity-40" />
                            Admin — Console
                          </Link>
                        </DropdownMenuItem>
                      )}
                      {userRole === "enseignant" && (
                        <DropdownMenuItem asChild>
                          <Link href="/dashboard/enseignant/profil">
                            <UserCircle className="h-4 w-4 opacity-40" />
                            {tUser("myProfile")}
                          </Link>
                        </DropdownMenuItem>
                      )}
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
                        className={cn(isRTL && "font-ui-ar")}
                      >
                        <Bell className="h-4 w-4 opacity-40" />
                        {tUser("notifications")}
                      </DropdownMenuItem>
                    </div>

                    <DropdownMenuSeparator className="bg-neutral-100/80" />

                    <div className="space-y-0.5 p-1.5">
                      {userRole !== "enseignant" && (
                        <DropdownMenuItem onClick={() => window.dispatchEvent(new CustomEvent("open-theme-modal"))}>
                          <Palette className="h-4 w-4 opacity-40" />
                          {tUser("customization")}
                        </DropdownMenuItem>
                      )}
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
                        className={cn("text-red-600 focus:bg-red-50 focus:text-red-700", isRTL && "font-ui-ar")}
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
                <Button variant="linkMuted" asChild className={cn("hidden lg:inline-flex", isRTL && "font-ui-ar")}>
                  <Link href="/dashboard/explore">{tNav("FreeExplore")}</Link>
                </Button>
                <Button variant="linkDark" asChild className={cn("hidden lg:inline-flex", isRTL && "font-ui-ar")}>
                  <Link href="/auth/login">{tAuth("Login")}</Link>
                </Button>
                <Button variant="luxury" asChild className={cn("hidden h-11 lg:inline-flex", isRTL && "font-ui-ar")}>
                  <Link href="/auth/register">{tAuth("Register")}</Link>
                </Button>
              </>
            )}

            {!isDashboard && (
              <Sheet open={mobileOpen} onOpenChange={setMobileOpen}>
                <SheetTrigger asChild>
                  <Button variant="glassIcon" size="icon" className="lg:hidden" aria-label="Menu">
                    <Menu className="h-[16px] w-[16px] stroke-[1.75] sm:h-5 sm:w-5" />
                  </Button>
                </SheetTrigger>
                <SheetContent
                  side={isRTL ? "left" : "right"}
                  className="w-[min(100vw,18rem)] border border-white/50 bg-white/85 p-0 shadow-2xl backdrop-blur-xl"
                >
                  <div className="flex h-full flex-col px-6 py-8" dir={isRTL ? "rtl" : "ltr"}>
                    <SheetHeader className="mb-4 text-start">
                      <SheetTitle className="font-inter" dir="ltr">
                        Free<span className="text-orange-600">Geny</span>
                      </SheetTitle>
                    </SheetHeader>
                    <div className="mb-6 lg:hidden">
                      <RegionSelector compact inline />
                    </div>
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
                      <div className="pt-2">
                        <p className={cn("mb-2 px-4 text-[10px] font-medium uppercase tracking-widest text-neutral-400", isRTL && "font-ui-ar")}>
                          {tNav("Help")}
                        </p>
                        {helpLinks.map((item) => (
                          <NavItem
                            key={item.href}
                            href={item.href}
                            label={item.label}
                            onClick={() => setMobileOpen(false)}
                            className="w-full px-4 py-3 text-[15px]"
                          />
                        ))}
                      </div>
                    </nav>
                    {!session && (
                      <div className="mt-auto space-y-3 pt-8">
                        <Button variant="luxury" asChild className="w-full gap-2">
                          <Link href="/dashboard/explore" onClick={() => setMobileOpen(false)}>
                            <Sparkles className="h-4 w-4" />
                            {tNav("FreeExplore")}
                          </Link>
                        </Button>
                        <Button variant="linkDark" asChild className="w-full justify-center">
                          <Link href="/auth/login" onClick={() => setMobileOpen(false)}>
                            {tAuth("Login")}
                          </Link>
                        </Button>
                        <Button variant="luxury" asChild className="w-full">
                          <Link href="/auth/register" onClick={() => setMobileOpen(false)}>
                            {tAuth("Register")}
                          </Link>
                        </Button>
                      </div>
                    )}
                  </div>
                </SheetContent>
              </Sheet>
            )}
          </div>
        </div>
      </header>
      <CountryUnavailableModal
        open={!!blockedCountry}
        countryName={blockedCountry?.name}
        onClose={() => setBlockedCountry(null)}
      />
    </>
  );
}

"use client";

import React, { useState, useEffect, useRef } from "react";

import Image from "next/image";
import { useRegion } from "@/context/RegionContext";
import { REGIONS } from "@/constants/regions";
import { ChevronDown, LayoutDashboard, Clock, UserPlus, Bell, Palette, Settings, LogOut, MessageCircle, Mic, FlaskConical, Calculator, Feather, Paintbrush, Rocket, Code2, AlertCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { clsx, type ClassValue } from "clsx";
import NotificationCenter from "./NotificationCenter";
import { twMerge } from "tailwind-merge";
import { useTranslations, useLocale } from "next-intl";
import { Link, useRouter, usePathname } from "@/i18n/routing";
import { useSession, signOut } from "next-auth/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Map avatar id → Lucide icon
const AVATAR_ICONS: Record<string, React.ReactNode> = {
  scientist: <FlaskConical className="w-5 h-5" />,
  math:      <Calculator className="w-5 h-5" />,
  lit:       <Feather className="w-5 h-5" />,
  artist:    <Paintbrush className="w-5 h-5" />,
  astro:     <Rocket className="w-5 h-5" />,
  tech:      <Code2 className="w-5 h-5" />,
};

const AVATAR_BG: Record<string, string> = {
  scientist: "bg-blue-500",
  math:      "bg-orange-500",
  lit:       "bg-emerald-500",
  artist:    "bg-purple-500",
  astro:     "bg-indigo-500",
  tech:      "bg-slate-700",
};

const ROLE_LABELS: Record<string, string> = {
  parent: "Parent",
  ecole:  "École",
  ong:    "ONG",
};

const DASH_ROUTES: Record<string, string> = {
  parent: "parent",
  ecole:  "ecole",
  ong:    "ong",
};

interface UserProfile {
  id: number;
  fullName: string;
  username: string;
  role: string;
  image: string | null;
  familyId: string | null;
  avatarConfig: { id: string; icon: string; bg: string } | null;
  themeSettings: { primary: string } | null;
  profileComplete: boolean;
  notifCount: number;
  partner: {
    id: number;
    fullName: string;
    role: string;
    image: string | null;
    isOnline: boolean;
    lastLoginAt: string | null;
  } | null;
}

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = useSession();
  const tNav = useTranslations("Nav");
  const tAuth = useTranslations("Auth");
  const locale = useLocale();
  const { selectedCountry, setRegion } = useRegion();
  const [countryOpen, setCountryOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const countryRef = useRef<HTMLDivElement>(null);
  const userMenuRef = useRef<HTMLDivElement>(null);
  const isRTL = (locale === "ar" || locale.endsWith("-ar"));

  // Fetch user profile data
  useEffect(() => {
    if (!session?.user?.email) return;
    fetch("/api/user/profile")
      .then(r => r.json())
      .then(data => { if (!data.error) setProfile(data); })
      .catch(() => {});
  }, [session]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (countryRef.current && !countryRef.current.contains(e.target as Node)) setCountryOpen(false);
      if (userMenuRef.current && !userMenuRef.current.contains(e.target as Node)) setUserMenuOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  const navLinks = [
    { label: tNav("About"),    href: "/about" },
    { label: tNav("Approach"), href: "/approach" },
    { label: tNav("Parents"),  href: "/parents" },
    { label: tNav("Schools"),  href: "/schools" },
    { label: tNav("NGOs"),     href: "/ngos" },
    { label: tNav("Science"),  href: "/science" },
  ];

  const handleRegionChange = (code: string, l: string) => {
    setRegion(code, l);
    setCountryOpen(false);
    
    // Extraire le chemin brut depuis le navigateur et supprimer TOUT préfixe de locale existant
    // (ex: /DZ-ar/auth/register → /auth/register, /fr/about → /about, / → /)
    const rawPath = window.location.pathname;
    const stripped = rawPath
      .replace(/^\/[A-Z]{2}-[a-z]{2}(\/|$)/, "/")  // retire un préfixe composé /XX-xx
      .replace(/^\/[a-z]{2}(\/|$)/, "/");            // retire un préfixe simple /xx
    
    const cleanPath = stripped === "" ? "/" : stripped;
    window.location.href = `/${code}-${l}${cleanPath === "/" ? "/" : cleanPath}${window.location.search}`;
  };

  const sortedCountries = Object.keys(REGIONS).sort((a, b) =>
    (REGIONS as any)[a].name.localeCompare((REGIONS as any)[b].name)
  );
  const finalCountries = [selectedCountry, ...sortedCountries.filter(c => c !== selectedCountry)];

  // Compute initials
  const getInitials = () => {
    const name = session?.user?.name?.trim();
    if (!name) return "U";
    const parts = name.split(/\s+/);
    return parts.length >= 2
      ? (parts[0][0] + parts[1][0]).toUpperCase()
      : name.substring(0, 1).toUpperCase();
  };

  // Avatar content
  const renderAvatar = (size = "w-10 h-10") => {
    const ac = profile?.avatarConfig;
    if (ac && AVATAR_ICONS[ac.id]) {
      return (
        <div className={cn(size, "rounded-full flex items-center justify-center text-white border-2 border-white shadow-md group-hover:scale-105 transition-transform", AVATAR_BG[ac.id])}>
          {AVATAR_ICONS[ac.id]}
        </div>
      );
    }
    if (session?.user?.image) {
      return (
        <div className={cn(size, "rounded-full overflow-hidden border-2 border-white shadow-md group-hover:scale-105 transition-transform")}>
          <img src={session.user.image} alt="Avatar" className="w-full h-full object-cover" />
        </div>
      );
    }
    return (
      <div className={cn(size, "rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-[11px] border-2 border-white shadow-md group-hover:scale-105 transition-transform")}>
        {getInitials()}
      </div>
    );
  };

  const dashRoute = DASH_ROUTES[profile?.role || "parent"] || "parent";
  const notifCount = profile?.notifCount || 0;
  const partner = profile?.partner || null;

  return (
    <>
      <nav
        className="fixed top-0 w-full z-[120] h-[72px] flex items-center"
        style={{ background: "rgba(255,255,255,0.85)", backdropFilter: "blur(12px)", borderBottom: "1px solid rgba(0,0,0,0.05)" }}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="w-[74%] mx-auto flex justify-between items-center pt-2">

          {/* Logo + Country */}
          <div className="flex items-center gap-6">
            <Link href="/" className="flex items-center gap-2 md:gap-3 transition hover:scale-105 group">
              <Image src="/assets/img/logo.png" alt="FreeGeny" width={44} height={44} className="h-9 md:h-11 w-auto" />
              <span className="text-lg md:text-xl text-slate-900 uppercase leading-none font-logo">
                FREE<span className="text-orange-600">GENY</span>
              </span>
            </Link>

            <div className="relative" ref={countryRef}>
              <button
                onClick={() => setCountryOpen(!countryOpen)}
                className="flex items-center gap-2 bg-white/60 border border-slate-200 px-3 py-1.5 rounded-xl hover:bg-white transition text-[10px] font-bold text-slate-600 uppercase"
              >
                <img src={`https://flagcdn.com/w40/${selectedCountry.toLowerCase()}.png`} className="w-5 h-auto" alt={selectedCountry} />
                {selectedCountry}
                <ChevronDown className={cn("w-3 h-3 text-slate-400 transition-transform", countryOpen && "rotate-180")} />
              </button>

              <AnimatePresence>
                {countryOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8, scale: 0.97 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 8, scale: 0.97 }}
                    transition={{ duration: 0.15 }}
                    className={cn("absolute mt-2 w-72 bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-slate-100 p-4 z-[150] max-h-[60vh] overflow-y-auto", isRTL ? "right-0" : "left-0")}
                    style={{ scrollbarWidth: "thin" }}
                  >
                    <p className="text-[9px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3 px-2">{tNav("Region")}</p>
                    {finalCountries.map((code) => {
                      const region = (REGIONS as any)[code];
                      return (
                        <div key={code} className="flex items-center justify-between p-2 hover:bg-slate-50 rounded-xl transition-colors">
                          <div className="flex items-center gap-3 cursor-pointer" onClick={() => handleRegionChange(code, region.langs[0])}>
                            <img src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`} className="w-4 h-auto" alt={code} />
                            <span className="text-xs font-bold text-slate-700">{region.name}</span>
                          </div>
                          <div className="flex gap-1">
                            {region.langs.map((l: string) => (
                              <button key={l} onClick={() => handleRegionChange(code, l)}
                                className={cn("px-2 py-1 text-[9px] font-black rounded-md uppercase", selectedCountry === code && locale.endsWith(l) ? "bg-orange-600 text-white" : "bg-slate-100 text-slate-400 hover:text-orange-600")}>
                                {l}
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>

          {/* Nav Links */}
          <div className="hidden lg:flex items-center gap-7">
            {navLinks.map((item) => (
              <Link key={item.href} href={item.href}
                className={cn("text-[11px] font-black uppercase tracking-wider text-slate-600 hover:text-orange-600 transition-colors", isRTL && "font-amiri text-base tracking-normal")}>
                {item.label}
              </Link>
            ))}
          </div>

          {/* Right: Auth */}
          <div className="flex items-center gap-3">
            {session ? (
              <>
                {/* Chat Button with badge */}
                <button
                  id="open-chat-btn"
                  onClick={() => window.dispatchEvent(new CustomEvent("open-chat"))}
                  className="relative p-2 text-slate-500 hover:text-orange-600 transition-colors group"
                  title="Messagerie"
                >
                  <MessageCircle className="w-5 h-5" />
                  {notifCount > 0 && (
                    <span className="absolute top-1 right-1 min-w-[16px] h-4 bg-orange-600 text-[9px] font-bold text-white flex items-center justify-center rounded-full border-2 border-white shadow-sm px-0.5">
                      {notifCount}
                    </span>
                  )}
                </button>

                {/* User Avatar + Dropdown */}
                <div className="relative" ref={userMenuRef}>
                  <button onClick={() => setUserMenuOpen(!userMenuOpen)} className="flex items-center gap-1.5 focus:outline-none group">
                    {renderAvatar()}
                    <ChevronDown className={cn("w-4 h-4 text-slate-400 group-hover:text-slate-900 transition-all duration-200", userMenuOpen && "rotate-180")} />
                  </button>

                  <AnimatePresence>
                    {userMenuOpen && (
                      <motion.div
                        initial={{ opacity: 0, y: 10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 10, scale: 0.95 }}
                        transition={{ duration: 0.18, ease: "easeOut" }}
                        className={cn("absolute mt-3 w-72 bg-white/98 backdrop-blur-xl rounded-[1.5rem] shadow-[0_20px_80px_rgba(0,0,0,0.12)] border border-slate-100/80 py-2 z-[200] overflow-hidden", isRTL ? "left-0" : "right-0")}
                      >
                        {/* ── User Info Header ── */}
                        <div className="px-5 py-4 border-b border-slate-50 bg-gradient-to-br from-slate-50/80 to-white mb-1">
                          <div className="flex items-center gap-3 mb-3">
                            {renderAvatar("w-12 h-12")}
                            <div className="min-w-0">
                              <p className="text-[9px] font-black uppercase text-green-600 tracking-widest flex items-center gap-1.5 mb-0.5">
                                <span className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" /> Connecté
                              </p>
                              <p className="text-sm font-black text-slate-900 truncate leading-tight">{session.user?.name}</p>
                              <p className="text-[10px] font-black text-orange-600 truncate">
                                @{profile?.username || session.user?.email?.split("@")[0]}
                              </p>
                            </div>
                          </div>
                          <span className="inline-flex items-center px-3 py-1 rounded-full bg-slate-100 text-[9px] font-black uppercase tracking-widest text-slate-600">
                            {ROLE_LABELS[profile?.role || "parent"] || "Membre"}
                          </span>
                        </div>

                        {/* ── Partner Section ── */}
                        {partner && (
                          <div className="px-5 py-3 border-b border-slate-50">
                            <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest mb-2">Parent lié</p>
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <div className="relative">
                                  <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center text-xs font-black text-slate-600">
                                    {partner.fullName?.substring(0, 1).toUpperCase()}
                                  </div>
                                  <span className={cn("absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-white", partner.isOnline ? "bg-green-500" : "bg-slate-300")} />
                                </div>
                                <div>
                                  <p className="text-[11px] font-black text-slate-900 leading-none">{partner.fullName?.split(" ")[0]}</p>
                                  <p className="text-[9px] text-slate-400 font-bold">{partner.isOnline ? "En ligne" : "Hors ligne"}</p>
                                </div>
                              </div>
                              <div className="flex gap-1">
                                <button 
                                  onClick={() => { setUserMenuOpen(false); window.dispatchEvent(new CustomEvent("open-chat", { detail: { userId: partner.id } })); }}
                                  className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-orange-50 hover:text-orange-600 text-slate-400 flex items-center justify-center transition-all hover:shadow-sm" title="Message"
                                >
                                  <MessageCircle className="w-3.5 h-3.5" />
                                </button>
                                <button className="w-8 h-8 rounded-xl bg-slate-50 hover:bg-blue-50 hover:text-blue-600 text-slate-400 flex items-center justify-center transition-all hover:shadow-sm" title="Vocal">
                                  <Mic className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* ── Profile Incomplete Alert ── */}
                        {profile && !profile.profileComplete && (
                          <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center justify-between px-5 py-2.5 text-xs font-bold text-red-600 hover:bg-red-50 transition-all group border-b border-slate-50">
                            <span className="flex items-center gap-2">
                              <AlertCircle className="w-4 h-4" />
                              Compléter mon profil
                            </span>
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                          </Link>
                        )}

                        {/* ── Main Links ── */}
                        <div className="py-1">
                          <Link href={`/dashboard/${dashRoute}`} onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all">
                            <LayoutDashboard className="w-4 h-4 opacity-50" /> Tableau de bord
                          </Link>
                          <Link href="/dashboard/history" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all">
                            <Clock className="w-4 h-4 opacity-50" /> Mon Historique
                          </Link>
                          <Link href="/dashboard/invite" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all">
                            <UserPlus className="w-4 h-4 opacity-50" /> Inviter un membre
                          </Link>
                          <NotificationCenter />
                        </div>

                        <div className="h-px bg-slate-50 my-1" />

                        {/* ── Customization + Settings ── */}
                        <div className="py-1">
                          <button
                            onClick={() => { setUserMenuOpen(false); window.dispatchEvent(new CustomEvent("open-theme-modal")); }}
                            className="w-full flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all">
                            <Palette className="w-4 h-4 opacity-50" /> Personnalisation 🎨
                          </button>
                          <Link href="/dashboard/settings" onClick={() => setUserMenuOpen(false)}
                            className="flex items-center gap-3 px-5 py-2.5 text-xs font-bold text-slate-700 hover:bg-slate-50 hover:text-orange-600 transition-all">
                            <Settings className="w-4 h-4 opacity-50" /> Réglages
                          </Link>
                        </div>

                        {/* ── Sign Out ── */}
                        <div className="border-t border-slate-50 mt-1">
                          <button onClick={() => signOut({ callbackUrl: `/${locale}` })}
                            className="w-full flex items-center gap-3 px-5 py-3 text-xs font-bold text-rose-600 hover:bg-rose-50 transition-all">
                            <LogOut className="w-4 h-4" /> Déconnexion
                          </button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </>
            ) : (
              <>
                <Link href="/dashboard/guest" className="hidden sm:flex items-center gap-1.5 text-[10px] sm:text-[11px] font-black uppercase text-orange-600 tracking-wider hover:bg-orange-50 transition border border-orange-200/50 bg-orange-50/40 px-3.5 py-2 rounded-xl">
                  🧭 {tNav("FreeExplore")}
                </Link>
                <Link href="/auth/login" className="hidden md:block text-[12px] font-black uppercase text-slate-900 tracking-widest hover:text-orange-600 transition p-2">
                  {tAuth("Login")}
                </Link>
                <Link href="/auth/register" className="bg-orange-600 text-white px-3 sm:px-4 py-1.5 rounded-xl font-bold text-[10px] sm:text-[12px] uppercase tracking-widest hover:bg-orange-700 transition">
                  {tAuth("Register")}
                </Link>
              </>
            )}
          </div>

        </div>
      </nav>
      <div className="h-[72px]" />
    </>
  );
}

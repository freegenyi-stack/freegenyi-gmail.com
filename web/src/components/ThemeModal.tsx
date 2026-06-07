"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Moon, Sun, Palette } from "lucide-react";
import { FlaskConical, Calculator, Feather, Paintbrush, Rocket, Code2 } from "lucide-react";
import { useLocale, useTranslations } from "next-intl";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const THEMES = [
  { id: "themeOrange", hex: "#ea580c", class: "bg-orange-500" },
  { id: "themeBlue", hex: "#2563eb", class: "bg-blue-600" },
  { id: "themeGreen", hex: "#059669", class: "bg-emerald-600" },
  { id: "themeViolet", hex: "#7c3aed", class: "bg-violet-600" },
  { id: "themePink", hex: "#db2777", class: "bg-pink-600" },
  { id: "themeSlate", hex: "#475569", class: "bg-slate-600" },
];

const CULTURAL_THEMES = [
  { country: "DZ", name: "Désert Doré", hex: "#b45309", flag: "🇩🇿" },
  { country: "MA", name: "Ocre Marrakech", hex: "#9a3412", flag: "🇲🇦" },
  { country: "TN", name: "Bleu Sidi", hex: "#0369a1", flag: "🇹🇳" },
  { country: "FR", name: "Bleu Élysée", hex: "#1d4ed8", flag: "🇫🇷" },
  { country: "SN", name: "Baobab Vert", hex: "#15803d", flag: "🇸🇳" },
  { country: "INT", name: "Cosmos", hex: "#6d28d9", flag: "🌍" },
];

const AVATARS = [
  { id: "scientist", labelKey: "avatarScientist", icon: <FlaskConical className="w-6 h-6" />, bg: "bg-blue-500" },
  { id: "math", labelKey: "avatarMath", icon: <Calculator className="w-6 h-6" />, bg: "bg-orange-500" },
  { id: "lit", labelKey: "avatarLit", icon: <Feather className="w-6 h-6" />, bg: "bg-emerald-500" },
  { id: "artist", labelKey: "avatarArtist", icon: <Paintbrush className="w-6 h-6" />, bg: "bg-purple-500" },
  { id: "astro", labelKey: "avatarAstro", icon: <Rocket className="w-6 h-6" />, bg: "bg-indigo-500" },
  { id: "tech", labelKey: "avatarTech", icon: <Code2 className="w-6 h-6" />, bg: "bg-slate-700" },
];

export default function ThemeModal() {
  const t = useTranslations("ThemeModal");
  const locale = useLocale();
  const isRTL = locale === "ar" || locale.endsWith("-ar");
  const [isOpen, setIsOpen] = useState(false);
  const [currentColor, setCurrentColor] = useState("#ea580c");
  const [currentAvatarId, setCurrentAvatarId] = useState("");
  const [darkMode, setDarkMode] = useState(false);
  const [saving, setSaving] = useState(false);
  const [tab, setTab] = useState<"theme" | "avatar">("theme");

  useEffect(() => {
    const handler = () => setIsOpen(true);
    window.addEventListener("open-theme-modal", handler);
    return () => window.removeEventListener("open-theme-modal", handler);
  }, []);

  useEffect(() => {
    document.documentElement.style.setProperty("--primary-color", currentColor);
  }, [currentColor]);

  useEffect(() => {
    fetch("/api/user/profile")
      .then((r) => r.json())
      .then((data) => {
        if (data.themeSettings?.primary) setCurrentColor(data.themeSettings.primary);
        if (data.avatarConfig?.id) setCurrentAvatarId(data.avatarConfig.id);
      })
      .catch(() => {});
  }, []);

  const saveTheme = async (hex: string) => {
    setCurrentColor(hex);
    setSaving(true);
    try {
      await fetch("/api/user/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ primary: hex }),
      });
    } finally {
      setSaving(false);
    }
  };

  const saveAvatar = async (id: string) => {
    setCurrentAvatarId(id);
    setSaving(true);
    try {
      const av = AVATARS.find((a) => a.id === id);
      await fetch("/api/user/theme", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ avatar: { id, bg: av?.bg ?? "" } }),
      });
      setTimeout(() => window.location.reload(), 300);
    } finally {
      setSaving(false);
    }
  };

  const labelClass = cn("text-[10px] font-black text-slate-400 uppercase tracking-widest mb-3", isRTL && "font-amiri normal-case text-xs");

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[400] flex items-center justify-center px-4"
          dir={isRTL ? "rtl" : "ltr"}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 24, scale: 0.97 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-lg overflow-hidden border border-slate-100 z-10"
          >
            <div className={cn("flex items-center justify-between p-7 pb-0", isRTL && "flex-row-reverse")}>
              <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white shrink-0" style={{ backgroundColor: currentColor }}>
                  <Palette className="w-5 h-5" />
                </div>
                <div className={isRTL ? "text-right" : "text-left"}>
                  <h2 className={cn("text-xl font-black text-slate-900 tracking-tight", isRTL && "font-amiri")}>{t("title")}</h2>
                  <p className={cn("text-[10px] text-slate-400 font-bold uppercase tracking-widest", isRTL && "font-amiri normal-case text-xs")}>
                    {t("subtitle")}
                  </p>
                </div>
              </div>
              <button onClick={() => setIsOpen(false)} className="w-9 h-9 rounded-xl bg-slate-100 hover:bg-slate-200 flex items-center justify-center text-slate-500 transition-all shrink-0">
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className={cn("flex gap-2 px-7 pt-5", isRTL && "flex-row-reverse")}>
              {(["theme", "avatar"] as const).map((tabKey) => (
                <button
                  key={tabKey}
                  onClick={() => setTab(tabKey)}
                  className={cn(
                    "px-5 py-2 rounded-xl font-black transition-all",
                    isRTL ? "text-sm font-amiri" : "text-[11px] uppercase tracking-widest",
                    tab === tabKey ? "text-white shadow-lg" : "bg-slate-100 text-slate-500 hover:bg-slate-200"
                  )}
                  style={tab === tabKey ? { backgroundColor: currentColor } : {}}
                >
                  {tabKey === "theme" ? `🎨 ${t("tabTheme")}` : `🏆 ${t("tabAvatar")}`}
                </button>
              ))}
            </div>

            <div className="p-7 pt-5 space-y-6">
              {tab === "theme" && (
                <>
                  <div>
                    <p className={labelClass}>{t("primaryColor")}</p>
                    <div className="grid grid-cols-6 gap-2">
                      {THEMES.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => saveTheme(c.hex)}
                          title={t(c.id as "themeOrange")}
                          className={`h-11 rounded-xl ${c.class} transition-all border-2 flex items-center justify-center ${currentColor === c.hex ? "border-slate-900 scale-110 shadow-lg" : "border-transparent opacity-80 hover:opacity-100 hover:scale-105"}`}
                        >
                          {currentColor === c.hex && <Check className="w-4 h-4 text-white" />}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className={labelClass}>{t("culturalThemes")} 🌍</p>
                    <div className="grid grid-cols-3 gap-2">
                      {CULTURAL_THEMES.map((c) => (
                        <button
                          key={c.hex}
                          onClick={() => saveTheme(c.hex)}
                          className={cn(
                            "flex items-center gap-2 p-3 rounded-xl border-2 transition-all",
                            isRTL ? "flex-row-reverse text-right" : "text-left",
                            currentColor === c.hex ? "border-slate-900 bg-slate-50 shadow" : "border-slate-100 hover:border-slate-300"
                          )}
                        >
                          <span className="text-lg">{c.flag}</span>
                          <div>
                            <p className={cn("text-[10px] font-black text-slate-700 leading-none", isRTL && "font-amiri text-xs")}>{c.name}</p>
                          </div>
                          <div className={cn("w-4 h-4 rounded-full border border-white/50 shadow-sm shrink-0", isRTL ? "mr-auto" : "ml-auto")} style={{ backgroundColor: c.hex }} />
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className={cn("flex items-center justify-between p-4 bg-slate-50 rounded-2xl border border-slate-100", isRTL && "flex-row-reverse")}>
                    <div className={cn("flex items-center gap-3", isRTL && "flex-row-reverse")}>
                      {darkMode ? <Moon className="w-5 h-5 text-slate-700 shrink-0" /> : <Sun className="w-5 h-5 text-orange-500 shrink-0" />}
                      <div className={isRTL ? "text-right" : "text-left"}>
                        <p className={cn("text-xs font-black text-slate-900", isRTL && "font-amiri text-sm")}>{t("darkMode")}</p>
                        <p className={cn("text-[10px] text-slate-400 font-bold", isRTL && "font-amiri text-xs")}>{t("darkModeHint")}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => setDarkMode(!darkMode)}
                      className={`w-12 h-6 rounded-full transition-all duration-300 relative shrink-0 ${darkMode ? "bg-slate-800" : "bg-slate-200"}`}
                    >
                      <div className={`absolute top-1 w-4 h-4 rounded-full bg-white shadow transition-all duration-300 ${darkMode ? (isRTL ? "right-1" : "left-7") : isRTL ? "right-7" : "left-1"}`} />
                    </button>
                  </div>
                </>
              )}

              {tab === "avatar" && (
                <div>
                  <p className={labelClass}>{t("chooseAvatar")}</p>
                  <div className="grid grid-cols-3 gap-3">
                    {AVATARS.map((av) => (
                      <button
                        key={av.id}
                        onClick={() => saveAvatar(av.id)}
                        className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 transition-all group ${currentAvatarId === av.id ? "border-slate-900 bg-slate-50 shadow-lg" : "border-slate-100 hover:border-slate-300 hover:bg-slate-50"}`}
                      >
                        <div className={`w-12 h-12 rounded-full ${av.bg} text-white flex items-center justify-center shadow-md transition-transform group-hover:scale-110`}>
                          {av.icon}
                        </div>
                        <span className={cn("text-[10px] font-black text-slate-700 text-center", isRTL && "font-amiri text-xs")}>{t(av.labelKey as "avatarScientist")}</span>
                        {currentAvatarId === av.id && (
                          <span className="w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                            <Check className="w-3 h-3 text-white" />
                          </span>
                        )}
                      </button>
                    ))}
                  </div>
                  <p className={cn("text-[10px] text-slate-400 text-center mt-4 font-bold italic", isRTL && "font-amiri text-xs not-italic")}>
                    {t("reloadHint")}
                  </p>
                </div>
              )}
            </div>

            <div className="px-7 pb-7">
              <button
                onClick={() => setIsOpen(false)}
                className={cn(
                  "w-full py-4 font-black text-white rounded-2xl shadow-xl transition-all hover:opacity-90",
                  isRTL ? "text-sm font-amiri" : "text-[11px] uppercase tracking-widest"
                )}
                style={{ backgroundColor: currentColor }}
              >
                {saving ? t("saving") : `${t("done")} ✓`}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

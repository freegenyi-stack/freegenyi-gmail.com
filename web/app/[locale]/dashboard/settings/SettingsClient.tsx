"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Palette, Shield, CheckCircle, Smartphone, Mail, Lock } from "lucide-react";
import { useTranslations } from "next-intl";
import { updateProfileAction, updatePreferencesAction, updatePasswordAction } from "@/lib/actions/settings";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

export default function SettingsClient({ user, locale }: { user: any; locale: string }) {
  const t = useTranslations("Settings");
  const isRTL = locale === "ar" || locale.endsWith("-ar");

  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "security">("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const themeSettings = user.themeSettings ? JSON.parse(user.themeSettings) : { id: "orange", color: "#f97316" };
  const avatarConfig = user.avatarConfig ? JSON.parse(user.avatarConfig) : { icon: "fox", bg: "bg-orange-600" };

  const themes = [
    { id: "orange", nameKey: "themeSignature" as const, color: "#f97316" },
    { id: "blue", nameKey: "themeOcean" as const, color: "#0ea5e9" },
    { id: "purple", nameKey: "themeRoyal" as const, color: "#8b5cf6" },
    { id: "teal", nameKey: "themeForest" as const, color: "#10b981" },
    { id: "rose", nameKey: "themeEnergy" as const, color: "#f43f5e" },
    { id: "slate", nameKey: "themeNight" as const, color: "#0f172a" },
  ];

  const avatars = [
    { id: "fox", icon: "🦊", bg: "bg-orange-600" },
    { id: "robot", icon: "🤖", bg: "bg-slate-900" },
    { id: "scientist", icon: "👨‍🔬", bg: "bg-blue-600" },
    { id: "rocket", icon: "🚀", bg: "bg-indigo-900" },
    { id: "brain", icon: "🧠", bg: "bg-purple-600" },
    { id: "star", icon: "⭐", bg: "bg-amber-500" },
  ];

  const handleProfileSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateProfileAction(formData);
    if (result.success) toast.success(result.success);
    else toast.error(result.error);
    setIsSubmitting(false);
  };

  const handlePasswordSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    const result = await updatePasswordAction(formData);
    if (result.success) {
      toast.success(result.success);
      (e.target as HTMLFormElement).reset();
    } else toast.error(result.error);
    setIsSubmitting(false);
  };

  const handleUpdatePreference = async (type: "theme" | "avatar", data: { id: string; color?: string; icon?: string; bg?: string }) => {
    const result = await updatePreferencesAction(type, data);
    if (result.success) {
      toast.success(t("prefsSaved"));
      window.location.reload();
    } else toast.error(result.error);
  };

  const tabClass = (tab: typeof activeTab) =>
    cn(
      "w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all",
      activeTab === tab ? "bg-slate-900 text-white shadow-xl" : "bg-white text-slate-500 hover:bg-slate-100",
      isRTL && "flex-row-reverse font-amiri text-sm tracking-normal"
    );

  return (
    <div className="grid lg:grid-cols-4 gap-12" dir={isRTL ? "rtl" : "ltr"}>
      <div className="lg:col-span-1 space-y-2">
        <button onClick={() => setActiveTab("profile")} className={tabClass("profile")}>
          <User className="w-4 h-4" />
          {t("tabProfile")}
        </button>
        <button onClick={() => setActiveTab("appearance")} className={tabClass("appearance")}>
          <Palette className="w-4 h-4" />
          {t("tabAppearance")}
        </button>
        <button onClick={() => setActiveTab("security")} className={tabClass("security")}>
          <Shield className="w-4 h-4" />
          {t("tabSecurity")}
        </button>
      </div>

      <div className="lg:col-span-3">
        {activeTab === "profile" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white"
          >
            <div className={cn("flex items-center gap-4 mb-10", isRTL && "flex-row-reverse")}>
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <h2 className={cn("text-2xl font-black text-slate-900 tracking-tight", isRTL && "font-amiri")}>
                {t("personalInfo")}
              </h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 px-1", isRTL && "font-amiri normal-case")}>
                    {t("fullName")}
                  </label>
                  <div className="relative">
                    <User className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300", isRTL ? "right-4" : "left-4")} />
                    <input
                      name="full_name"
                      defaultValue={user.fullName}
                      required
                      className={cn(
                        "w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold",
                        isRTL ? "pr-12" : "pl-12"
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 px-1", isRTL && "font-amiri normal-case")}>
                    {t("email")}
                  </label>
                  <div className="relative">
                    <Mail className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300", isRTL ? "right-4" : "left-4")} />
                    <input
                      disabled
                      value={user.email}
                      className={cn(
                        "w-full bg-slate-100 border-2 border-slate-100 p-4 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed",
                        isRTL ? "pr-12" : "pl-12"
                      )}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 px-1", isRTL && "font-amiri normal-case")}>
                  {t("phone")}
                </label>
                <div className="relative">
                  <Smartphone className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300", isRTL ? "right-4" : "left-4")} />
                  <input
                    name="phone"
                    defaultValue={user.phone || ""}
                    placeholder={t("phonePlaceholder")}
                    className={cn(
                      "w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold",
                      isRTL ? "pr-12" : "pl-12"
                    )}
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "bg-slate-950 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50",
                  isRTL && "font-amiri text-sm tracking-normal"
                )}
              >
                {isSubmitting ? t("saving") : t("updateProfile")}
              </button>
            </form>
          </motion.div>
        )}

        {activeTab === "appearance" && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white">
              <h3 className={cn("text-2xl font-black text-slate-900 mb-10 tracking-tight", isRTL && "font-amiri text-right")}>
                {t("cockpitTheme")}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {themes.map((th) => (
                  <button
                    key={th.id}
                    onClick={() => handleUpdatePreference("theme", { id: th.id, color: th.color })}
                    className={`group relative p-6 rounded-[2rem] border-2 transition-all text-center ${themeSettings.id === th.id ? "border-orange-500 bg-orange-50/20 shadow-lg" : "border-slate-50 hover:border-slate-200"}`}
                  >
                    <div
                      className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl"
                      style={{ backgroundColor: th.color }}
                    />
                    <span className={cn("text-[10px] font-black uppercase tracking-widest text-slate-600", isRTL && "font-amiri normal-case")}>
                      {t(th.nameKey)}
                    </span>
                    {themeSettings.id === th.id && (
                      <CheckCircle className={cn("absolute top-4 w-4 h-4 text-orange-600", isRTL ? "left-4" : "right-4")} />
                    )}
                  </button>
                ))}
              </div>
            </div>

            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white">
              <h3 className={cn("text-2xl font-black text-slate-900 mb-10 tracking-tight", isRTL && "font-amiri text-right")}>
                {t("expertAvatar")}
              </h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {avatars.map((a) => (
                  <button
                    key={a.id}
                    onClick={() => handleUpdatePreference("avatar", a)}
                    className={`group p-4 rounded-3xl border-2 transition-all text-center ${avatarConfig.id === a.id ? "border-blue-500 bg-blue-50/20 shadow-lg" : "border-slate-50 hover:border-slate-200"}`}
                  >
                    <div className={`w-14 h-14 rounded-2xl mx-auto flex items-center justify-center text-3xl shadow-md ${a.bg}`}>
                      {a.icon}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "security" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white max-w-2xl"
          >
            <div className={cn("flex items-center gap-4 mb-10", isRTL && "flex-row-reverse")}>
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className={cn("text-2xl font-black text-slate-900 tracking-tight", isRTL && "font-amiri")}>
                {t("accountSecurity")}
              </h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 px-1", isRTL && "font-amiri normal-case")}>
                  {t("oldPassword")}
                </label>
                <div className="relative">
                  <Lock className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300", isRTL ? "right-4" : "left-4")} />
                  <input
                    name="old_password"
                    type="password"
                    required
                    className={cn(
                      "w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold",
                      isRTL ? "pr-12" : "pl-12"
                    )}
                  />
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 px-1", isRTL && "font-amiri normal-case")}>
                    {t("newPassword")}
                  </label>
                  <div className="relative">
                    <Lock className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300", isRTL ? "right-4" : "left-4")} />
                    <input
                      name="new_password"
                      type="password"
                      required
                      className={cn(
                        "w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold",
                        isRTL ? "pr-12" : "pl-12"
                      )}
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 px-1", isRTL && "font-amiri normal-case")}>
                    {t("confirmPassword")}
                  </label>
                  <div className="relative">
                    <Lock className={cn("absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300", isRTL ? "right-4" : "left-4")} />
                    <input
                      name="confirm_password"
                      type="password"
                      required
                      className={cn(
                        "w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold",
                        isRTL ? "pr-12" : "pl-12"
                      )}
                    />
                  </div>
                </div>
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className={cn(
                  "w-full bg-slate-900 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl disabled:opacity-50",
                  isRTL && "font-amiri text-sm tracking-normal"
                )}
              >
                {isSubmitting ? t("updating") : t("updatePassword")}
              </button>
            </form>
          </motion.div>
        )}
      </div>
    </div>
  );
}

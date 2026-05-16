"use client";

import React, { useState } from "react";
import { motion } from "framer-motion";
import { User, Palette, Shield, Save, CheckCircle, Smartphone, Mail, Lock } from "lucide-react";
import { updateProfileAction, updatePreferencesAction, updatePasswordAction } from "@/lib/actions/settings";
import { toast } from "sonner";

export default function SettingsClient({ user, locale }: { user: any, locale: string }) {
  const [activeTab, setActiveTab] = useState<"profile" | "appearance" | "security">("profile");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const themeSettings = user.themeSettings ? JSON.parse(user.themeSettings) : { id: "orange", color: "#f97316" };
  const avatarConfig = user.avatarConfig ? JSON.parse(user.avatarConfig) : { icon: "fox", bg: "bg-orange-600" };

  const themes = [
    { id: 'orange', name: 'Signature', color: '#f97316' },
    { id: 'blue', name: 'Océan', color: '#0ea5e9' },
    { id: 'purple', name: 'Royal', color: '#8b5cf6' },
    { id: 'teal', name: 'Forêt', color: '#10b981' },
    { id: 'rose', name: 'Énergie', color: '#f43f5e' },
    { id: 'slate', name: 'Nuit', color: '#0f172a' }
  ];

  const avatars = [
    { id: 'fox', icon: '🦊', bg: 'bg-orange-600' },
    { id: 'robot', icon: '🤖', bg: 'bg-slate-900' },
    { id: 'scientist', icon: '👨‍🔬', bg: 'bg-blue-600' },
    { id: 'rocket', icon: '🚀', bg: 'bg-indigo-900' },
    { id: 'brain', icon: '🧠', bg: 'bg-purple-600' },
    { id: 'star', icon: '⭐', bg: 'bg-amber-500' },
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

  const handleUpdatePreference = async (type: "theme" | "avatar", data: any) => {
    const result = await updatePreferencesAction(type, data);
    if (result.success) {
      toast.success("Préférences enregistrées");
      window.location.reload();
    } else toast.error(result.error);
  };

  return (
    <div className="grid lg:grid-cols-4 gap-12">
      
      {/* Sidebar Navigation */}
      <div className="lg:col-span-1 space-y-2">
        <button 
          onClick={() => setActiveTab("profile")}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === "profile" ? "bg-slate-900 text-white shadow-xl" : "bg-white text-slate-500 hover:bg-slate-100"}`}
        >
          <User className="w-4 h-4" />
          Mon Profil
        </button>
        <button 
          onClick={() => setActiveTab("appearance")}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === "appearance" ? "bg-slate-900 text-white shadow-xl" : "bg-white text-slate-500 hover:bg-slate-100"}`}
        >
          <Palette className="w-4 h-4" />
          Personnalisation
        </button>
        <button 
          onClick={() => setActiveTab("security")}
          className={`w-full flex items-center gap-4 px-6 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest transition-all ${activeTab === "security" ? "bg-slate-900 text-white shadow-xl" : "bg-white text-slate-500 hover:bg-slate-100"}`}
        >
          <Shield className="w-4 h-4" />
          Sécurité
        </button>
      </div>

      {/* Main Content Area */}
      <div className="lg:col-span-3">
        
        {/* PROFILE TAB */}
        {activeTab === "profile" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-orange-50 text-orange-600 rounded-2xl flex items-center justify-center">
                <User className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Informations personnelles</h2>
            </div>

            <form onSubmit={handleProfileSubmit} className="space-y-8">
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nom Complet</label>
                  <div className="relative">
                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      name="full_name"
                      defaultValue={user.fullName}
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      disabled
                      value={user.email}
                      className="w-full bg-slate-100 border-2 border-slate-100 p-4 pl-12 rounded-2xl text-sm font-bold text-slate-400 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Téléphone</label>
                <div className="relative">
                  <Smartphone className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    name="phone"
                    defaultValue={user.phone || ""}
                    placeholder="+213..."
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                  />
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="bg-slate-950 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? "Enregistrement..." : "Mettre à jour le profil"}
              </button>
            </form>
          </motion.div>
        )}

        {/* APPEARANCE TAB */}
        {activeTab === "appearance" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="space-y-8"
          >
            {/* Theme Picker */}
            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white">
              <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Thème du Cockpit</h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-6">
                {themes.map((t) => (
                  <button 
                    key={t.id}
                    onClick={() => handleUpdatePreference("theme", t)}
                    className={`group relative p-6 rounded-[2rem] border-2 transition-all text-center ${themeSettings.id === t.id ? 'border-orange-500 bg-orange-50/20 shadow-lg' : 'border-slate-50 hover:border-slate-200'}`}
                  >
                    <div className="w-12 h-12 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl" style={{ backgroundColor: t.color }}></div>
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-600">{t.name}</span>
                    {themeSettings.id === t.id && <CheckCircle className="absolute top-4 right-4 w-4 h-4 text-orange-600" />}
                  </button>
                ))}
              </div>
            </div>

            {/* Avatar Picker */}
            <div className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white">
              <h3 className="text-2xl font-black text-slate-900 mb-10 tracking-tight">Mon Avatar d'Expert</h3>
              <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-6">
                {avatars.map((a) => (
                  <button 
                    key={a.id}
                    onClick={() => handleUpdatePreference("avatar", a)}
                    className={`group p-4 rounded-3xl border-2 transition-all text-center ${avatarConfig.id === a.id ? 'border-blue-500 bg-blue-50/20 shadow-lg' : 'border-slate-50 hover:border-slate-200'}`}
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

        {/* SECURITY TAB */}
        {activeTab === "security" && (
          <motion.div 
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-[3rem] p-10 md:p-14 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-white max-w-2xl"
          >
            <div className="flex items-center gap-4 mb-10">
              <div className="w-12 h-12 bg-red-50 text-red-600 rounded-2xl flex items-center justify-center">
                <Shield className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-black text-slate-900 tracking-tight">Sécurité du compte</h2>
            </div>

            <form onSubmit={handlePasswordSubmit} className="space-y-8">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Ancien mot de passe</label>
                <div className="relative">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                  <input 
                    name="old_password"
                    type="password"
                    required
                    className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                  />
                </div>
              </div>

              <div className="h-px bg-slate-100" />

              <div className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Nouveau mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      name="new_password"
                      type="password"
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-slate-400 px-1">Confirmation</label>
                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
                    <input 
                      name="confirm_password"
                      type="password"
                      required
                      className="w-full bg-slate-50 border-2 border-slate-100 p-4 pl-12 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                    />
                  </div>
                </div>
              </div>

              <button 
                type="submit"
                disabled={isSubmitting}
                className="w-full bg-slate-900 text-white px-10 py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-red-600 transition-all shadow-xl disabled:opacity-50"
              >
                {isSubmitting ? "Mise à jour..." : "Mettre à jour le mot de passe"}
              </button>
            </form>
          </motion.div>
        )}

      </div>
    </div>
  );
}

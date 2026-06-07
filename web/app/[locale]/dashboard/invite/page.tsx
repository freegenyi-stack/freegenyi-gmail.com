"use client";

import { Link } from "@/i18n/routing";
import React, { useState } from "react";
import { UserPlus, Send, ArrowLeft, CheckCircle, AlertCircle, ChevronDown } from "lucide-react";

import { motion, AnimatePresence } from "framer-motion";
import { sendInvitationAction } from "@/lib/actions/activity";
import { toast } from "sonner";
import { useLocale } from "next-intl";

export default function InvitePage() {
  const locale = useLocale();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);
  const [emailSent, setEmailSent] = useState(true);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSuccessMsg(null);
    setInviteUrl(null);

    const formData = new FormData(e.currentTarget);
    const result = await sendInvitationAction(formData);

    if ("success" in result && result.success) {
      setSuccessMsg(result.success);
      setInviteUrl(result.inviteUrl ?? null);
      setEmailSent(result.emailSent ?? true);
      (e.target as HTMLFormElement).reset();
      toast.success(result.emailSent ? "Invitation envoyée !" : "Invitation créée");
    } else if ("error" in result && result.error) {
      toast.error(result.error);
    }
    setIsSubmitting(false);
  };

  return (
    <div className="bg-slate-50 min-h-full pb-24 font-dm-sans">
      <div className="max-w-2xl mx-auto px-6 py-12">
        
        {/* Header */}
        <div className="mb-12 text-center relative">
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-48 h-48 bg-orange-100/50 rounded-full blur-3xl -z-10" />
          <motion.div 
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-20 h-20 bg-white text-orange-600 rounded-[2.5rem] flex items-center justify-center mx-auto mb-6 shadow-2xl border border-orange-50"
          >
            <UserPlus className="w-8 h-8" />
          </motion.div>
          <h1 className="text-4xl font-black text-slate-900 tracking-tight font-jakarta">Agrandir la Famille 💎</h1>
          <p className="text-slate-500 font-medium mt-3 text-lg">Invitez votre conjoint ou un tuteur à rejoindre votre cockpit FreeGeny.</p>
        </div>

        {/* Status Message */}
        <AnimatePresence>
          {successMsg && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className={`mb-8 p-6 border rounded-3xl flex items-start gap-4 shadow-sm ${
                emailSent
                  ? "bg-green-50 text-green-700 border-green-100"
                  : "bg-amber-50 text-amber-900 border-amber-100"
              }`}
            >
              {emailSent ? (
                <CheckCircle className="w-6 h-6 shrink-0" />
              ) : (
                <AlertCircle className="w-6 h-6 shrink-0" />
              )}
              <div className="min-w-0">
                <p className="text-sm font-bold">{successMsg}</p>
                {inviteUrl && !emailSent && (
                  <p className="mt-2 break-all text-xs font-mono opacity-90">{inviteUrl}</p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Form Card */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-[3rem] p-10 md:p-14 border border-white shadow-[0_40px_100px_rgba(0,0,0,0.04)]"
        >
          <form onSubmit={handleSubmit} className="space-y-8">
            <input type="hidden" name="locale" value={locale} />
            <div className="space-y-3">
              <label className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Email du membre</label>
              <input 
                name="email"
                type="email" 
                required 
                placeholder="exemple@mail.com" 
                className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-sm focus:outline-none focus:border-slate-950 transition-all font-bold text-slate-900 placeholder:text-slate-300 shadow-inner"
              />
            </div>

            <div className="space-y-3">
              <label className="block text-[11px] font-black uppercase text-slate-400 tracking-[0.2em] ml-2">Rôle dans la famille</label>
              <div className="relative">
                <select 
                  name="role" 
                  className="w-full px-6 py-5 bg-slate-50 border-2 border-slate-100 rounded-[1.5rem] text-sm focus:outline-none focus:border-slate-950 transition-all font-bold text-slate-900 appearance-none shadow-inner cursor-pointer"
                >
                  <option value="coparent">Co-parent / Allié éducatif</option>
                  <option value="maman">Maman</option>
                  <option value="papa">Papa</option>
                  <option value="tuteur">Tuteur / Accompagnateur</option>
                </select>
                <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 pointer-events-none" />
              </div>
            </div>

            <div className="pt-6">
              <button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full py-6 bg-slate-950 text-white font-black text-[11px] uppercase tracking-[0.3em] rounded-[1.5rem] hover:bg-orange-600 transition-all transform hover:scale-[1.02] active:scale-[0.98] shadow-2xl flex items-center justify-center gap-4 disabled:opacity-50"
              >
                {isSubmitting ? (
                  "Envoi en cours..."
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Envoyer l'Invitation
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>

        {/* Footer Link */}
        <div className="mt-12 text-center">
          <Link 
            href="/dashboard/parent"
            className="text-[11px] font-black uppercase tracking-widest text-slate-400 hover:text-slate-950 transition-all flex items-center justify-center gap-3 group"
          >
            <ArrowLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
            Retour au Cockpit
          </Link>
        </div>
      </div>
    </div>
  );
}

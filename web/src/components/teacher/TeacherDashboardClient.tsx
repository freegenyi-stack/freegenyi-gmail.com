"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";
import { Palette, GraduationCap, School, BookOpen, Sparkles, ArrowRight, MessageCircle } from "lucide-react";
import { useTranslations } from "next-intl";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type Props = {
  locale: string;
  user: { fullName: string; email: string; image?: string | null };
  profile: {
    schoolName: string;
    subject: string;
    level: string;
    bio: string;
    interests: { creative?: boolean; training?: boolean };
  };
  labels: Record<string, string>;
};

export default function TeacherDashboardClient({ user, profile, labels }: Props) {
  const activeLocale = useLocale();
  const tMsg = useTranslations("Messages");
  const isRTL = activeLocale.endsWith("-ar") || activeLocale === "ar";
  const initials = user.fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-b from-teal-50/80 via-white to-emerald-50/40 font-cairo pb-20" dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto px-6 py-12">
        <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 mb-12">
          <div className="flex items-center gap-5">
            <Avatar className="h-20 w-20 border-4 border-white shadow-xl ring-4 ring-teal-100">
              <AvatarImage src={user.image || undefined} alt={user.fullName} />
              <AvatarFallback className="bg-teal-100 text-teal-700 text-xl font-black">{initials}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 font-reem">{labels.title}</h1>
              <p className="text-slate-500 font-medium">{user.fullName}</p>
              <p className="text-sm text-teal-600 font-bold mt-1">{labels.subtitle}</p>
            </div>
          </div>
          <Link href="/teachers" className="text-[10px] font-black uppercase text-teal-600 hover:underline flex items-center gap-1">
            FreeGeny Enseignant <ArrowRight className={cn("w-3 h-3", isRTL && "rotate-180")} />
          </Link>
        </motion.div>

        <div className="grid md:grid-cols-3 gap-4 mb-10">
          {[
            { icon: School, label: labels.school, value: profile.schoolName || "—" },
            { icon: BookOpen, label: labels.subject, value: profile.subject || "—" },
            { icon: GraduationCap, label: labels.level, value: profile.level || "—" },
          ].map((item, i) => (
            <motion.div key={item.label} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} className="bg-white rounded-2xl p-5 border border-slate-100 shadow-sm">
              <item.icon className="w-5 h-5 text-teal-600 mb-2" />
              <p className="text-[9px] font-black uppercase text-slate-400 tracking-widest">{item.label}</p>
              <p className="font-black text-slate-900 mt-1">{item.value}</p>
            </motion.div>
          ))}
        </div>

        <Link
          href="/dashboard/messages"
          className="block mb-6 bg-gradient-to-r from-teal-600 to-emerald-600 rounded-[2rem] p-6 text-white shadow-xl hover:shadow-2xl transition-shadow"
        >
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6" />
              </div>
              <div>
                <p className="font-black text-lg">{tMsg("title")}</p>
                <p className="text-teal-50 text-sm font-medium">{tMsg("subtitleTeacher")}</p>
              </div>
            </div>
            <ArrowRight className={cn("w-5 h-5 opacity-80", isRTL && "rotate-180")} />
          </div>
        </Link>

        <div className="grid md:grid-cols-2 gap-6">
          <motion.div initial={{ opacity: 0, x: isRTL ? 20 : -20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2rem] p-8 border-2 border-teal-100 shadow-xl">
            <div className="w-14 h-14 bg-teal-600 rounded-2xl flex items-center justify-center mb-5">
              <Palette className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">{labels.creativeTitle}</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">{labels.creativeDesc}</p>
            <button type="button" className="w-full py-3 rounded-xl bg-teal-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-teal-500 transition-colors">
              {labels.creativeCta}
            </button>
            <p className="text-[9px] text-center text-slate-400 mt-3 uppercase font-bold">{labels.comingSoon}</p>
          </motion.div>

          <motion.div initial={{ opacity: 0, x: isRTL ? -20 : 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white rounded-[2rem] p-8 border-2 border-emerald-100 shadow-xl">
            <div className="w-14 h-14 bg-emerald-600 rounded-2xl flex items-center justify-center mb-5">
              <GraduationCap className="w-7 h-7 text-white" />
            </div>
            <h2 className="text-xl font-black text-slate-900 mb-2">{labels.trainingTitle}</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">{labels.trainingDesc}</p>
            <button type="button" className="w-full py-3 rounded-xl bg-emerald-600 text-white font-black uppercase text-[10px] tracking-widest hover:bg-emerald-500 transition-colors">
              {labels.trainingCta}
            </button>
            <p className="text-[9px] text-center text-slate-400 mt-3 uppercase font-bold">{labels.comingSoon}</p>
          </motion.div>
        </div>

        {profile.bio && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.3 }} className="mt-8 bg-white/80 rounded-2xl p-6 border border-slate-100">
            <p className="text-[10px] font-black uppercase text-slate-400 mb-2 flex items-center gap-2"><Sparkles className="w-3 h-3" /> Bio</p>
            <p className="text-slate-600 text-sm italic">{profile.bio}</p>
          </motion.div>
        )}
      </div>
    </div>
  );
}

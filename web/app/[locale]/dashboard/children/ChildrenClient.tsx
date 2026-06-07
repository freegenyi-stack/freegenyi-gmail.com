"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, Calendar, GraduationCap, X, School } from "lucide-react";
import { useTranslations } from "next-intl";
import { addChildAction, deleteChildAction } from "@/lib/actions/children";
import SchoolPicker from "@/components/SchoolPicker";
import { toast } from "sonner";
import { getLocalizedLevel } from "@/lib/utils";
import { cn } from "@/lib/utils";

interface Child {
  id: number;
  fullName: string;
  birthDate: string | null;
  educationLevel: string | null;
  createdAt: Date;
}

export default function ChildrenClient({
  initialChildren,
  locale,
  country,
}: {
  initialChildren: Child[];
  locale: string;
  userName: string;
  country: string;
}) {
  const t = useTranslations("Children");
  const isRTL = locale === "ar" || locale.endsWith("-ar");

  const [children, setChildren] = useState(initialChildren);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedSchool, setSelectedSchool] = useState<{ id: number; name: string } | null>(null);

  const levelsMap: Record<string, string[]> = {
    DZ: ["1AP", "2AP", "3AP", "4AP", "5AP"],
    MA: ["1AP", "2AP", "3AP", "4AP", "5AP", "6AP"],
    TN: ["1ère", "2ème", "3ème", "4ème", "5ème", "6ème"],
    FR: ["CP", "CE1", "CE2", "CM1", "CM2"],
    US: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
    AU: ["Kindergarten", "Year 1", "Year 2", "Year 3", "Year 4", "Year 5", "Year 6"],
    INT: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5", "Grade 6"],
  };
  const levels = levelsMap[country] || levelsMap["FR"];

  const handleDelete = async (id: number) => {
    if (!confirm(t("confirmDelete"))) return;

    const result = await deleteChildAction(id);
    if (result.success) {
      setChildren(children.filter((c) => c.id !== id));
      toast.success(t("deleted"));
    } else {
      toast.error(result.error || t("error"));
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formData = new FormData(e.currentTarget);
    if (selectedSchool) {
      formData.set("schoolId", String(selectedSchool.id));
      formData.set("schoolName", selectedSchool.name);
    }
    const result = await addChildAction(formData);
    if (result.success) {
      setIsModalOpen(false);
      setSelectedSchool(null);
      window.location.reload();
    } else {
      toast.error(result.error || t("error"));
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-12" dir={isRTL ? "rtl" : "ltr"}>
      <div
        className={cn(
          "flex flex-col md:flex-row justify-between items-start md:items-center gap-6 relative",
          isRTL && "md:flex-row-reverse"
        )}
      >
        <div className="absolute -top-32 -left-32 w-96 h-96 bg-blue-100 rounded-full blur-[120px] opacity-40 pointer-events-none" />

        <div className={cn("relative z-10", isRTL && "text-right")}>
          <h1 className={cn("text-4xl md:text-5xl font-black text-slate-900 tracking-tight", isRTL && "font-amiri")}>
            {t("title")}
          </h1>
          <p className={cn("text-slate-500 font-medium mt-2 text-lg", isRTL && "font-lateef text-2xl")}>
            {t("subtitle")}
          </p>
        </div>

        <button
          onClick={() => setIsModalOpen(true)}
          className={cn(
            "flex items-center gap-3 bg-slate-900 text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 shadow-xl hover:shadow-orange-600/20 z-10",
            isRTL && "flex-row-reverse font-amiri text-sm tracking-normal"
          )}
        >
          <Plus className="w-4 h-4" />
          {t("addChild")}
        </button>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 relative z-10">
        <AnimatePresence mode="popLayout">
          {children.map((child, index) => (
            <motion.div
              layout
              key={child.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ delay: index * 0.05 }}
              className="bg-white rounded-[2.5rem] p-8 shadow-[0_32px_80px_rgba(0,0,0,0.03)] border border-slate-50 relative group hover:shadow-[0_40px_100px_rgba(0,0,0,0.06)] transition-all duration-500 overflow-hidden"
            >
              <div className={cn("absolute top-0 p-6 opacity-0 group-hover:opacity-100 transition-opacity", isRTL ? "left-0" : "right-0")}>
                <button
                  onClick={() => handleDelete(child.id)}
                  className="p-3 bg-red-50 text-red-500 rounded-xl hover:bg-red-500 hover:text-white transition-all shadow-sm"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className={cn("flex items-center gap-6 mb-8", isRTL && "flex-row-reverse")}>
                <div className="w-16 h-16 bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl flex items-center justify-center text-2xl shadow-xl">
                  🦊
                </div>
                <div className={isRTL ? "text-right" : ""}>
                  <h3 className={cn("text-xl font-black text-slate-900 tracking-tight", isRTL && "font-amiri")}>
                    {child.fullName}
                  </h3>
                  <div className={cn("flex items-center gap-2 mt-1", isRTL && "flex-row-reverse")}>
                    <span className="w-2 h-2 bg-green-500 rounded-full" />
                    <span className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400", isRTL && "font-amiri normal-case text-xs")}>
                      {t("activeProfile")}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                <div className={cn("flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-3 text-slate-500", isRTL && "flex-row-reverse")}>
                    <GraduationCap className="w-4 h-4" />
                    <span className={cn("text-[11px] font-black uppercase tracking-wider", isRTL && "font-amiri normal-case")}>
                      {t("level")}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {child.educationLevel || t("undefined")}
                  </span>
                </div>

                <div className={cn("flex justify-between items-center p-4 bg-slate-50 rounded-2xl border border-slate-100", isRTL && "flex-row-reverse")}>
                  <div className={cn("flex items-center gap-3 text-slate-500", isRTL && "flex-row-reverse")}>
                    <Calendar className="w-4 h-4" />
                    <span className={cn("text-[11px] font-black uppercase tracking-wider", isRTL && "font-amiri normal-case")}>
                      {t("birth")}
                    </span>
                  </div>
                  <span className="text-xs font-black text-slate-900">
                    {child.birthDate
                      ? new Date(child.birthDate).toLocaleDateString(isRTL ? "ar-DZ" : locale, {
                          day: "numeric",
                          month: "long",
                          year: "numeric",
                        })
                      : t("undefinedFem")}
                  </span>
                </div>
              </div>

              <button
                className={cn(
                  "w-full bg-white border-2 border-slate-100 py-4 rounded-xl text-[10px] font-black uppercase tracking-widest text-slate-700 hover:border-slate-900 transition-all",
                  isRTL && "font-amiri text-sm normal-case"
                )}
              >
                {t("viewStats")}
              </button>
            </motion.div>
          ))}
        </AnimatePresence>

        {children.length === 0 && (
          <div className="col-span-full py-24 text-center bg-white rounded-[3rem] border-2 border-dashed border-slate-100">
            <p className={cn("text-slate-400 font-bold italic", isRTL && "font-lateef text-xl not-italic")}>
              {t("empty")}
            </p>
          </div>
        )}
      </div>

      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center p-6">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md"
              onClick={() => setIsModalOpen(false)}
            />

            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-xl bg-white rounded-[3rem] shadow-2xl overflow-hidden"
              dir={isRTL ? "rtl" : "ltr"}
            >
              <div className="p-10 md:p-12">
                <div className={cn("flex justify-between items-start mb-10", isRTL && "flex-row-reverse")}>
                  <div className={isRTL ? "text-right" : ""}>
                    <h2 className={cn("text-3xl font-black text-slate-900 tracking-tight", isRTL && "font-amiri")}>
                      {t("modalTitle")}
                    </h2>
                    <p className={cn("text-slate-400 font-medium mt-1 uppercase text-[10px] tracking-widest italic", isRTL && "font-lateef text-base not-italic normal-case")}>
                      {t("modalSubtitle")}
                    </p>
                  </div>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="p-2 bg-slate-100 rounded-xl hover:bg-slate-200 transition-colors"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>

                <form onSubmit={handleAddSubmit} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 px-1", isRTL && "font-amiri normal-case")}>
                        {t("firstName")}
                      </label>
                      <input
                        name="prenom"
                        type="text"
                        required
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                        placeholder={t("firstNamePlaceholder")}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 px-1", isRTL && "font-amiri normal-case")}>
                        {t("lastName")}
                      </label>
                      <input
                        name="nom"
                        type="text"
                        required
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                        placeholder={t("lastNamePlaceholder")}
                      />
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <label className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 px-1", isRTL && "font-amiri normal-case")}>
                        {t("birthDate")}
                      </label>
                      <input
                        name="naissance"
                        type="date"
                        required
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className={cn("text-[10px] font-black uppercase tracking-widest text-slate-400 px-1", isRTL && "font-amiri normal-case")}>
                        {t("schoolLevel")}
                      </label>
                      <select
                        name="niveau"
                        className="w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl focus:border-slate-900 transition-all outline-none text-sm font-bold appearance-none cursor-pointer"
                      >
                        {levels.map((l) => (
                          <option key={l} value={l}>
                            {getLocalizedLevel(l, country, isRTL)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label
                      className={cn(
                        "text-[10px] font-black uppercase tracking-widest text-slate-400 px-1 flex items-center gap-2",
                        isRTL && "font-amiri normal-case flex-row-reverse"
                      )}
                    >
                      <School className="w-3.5 h-3.5" /> {t("schoolOptional")}
                    </label>
                    <SchoolPicker value={selectedSchool} onChange={setSelectedSchool} country={country} />
                  </div>

                  <div className="pt-6">
                    <button
                      type="submit"
                      disabled={isSubmitting}
                      className={cn(
                        "w-full bg-slate-950 text-white py-5 rounded-2xl text-[11px] font-black uppercase tracking-widest hover:bg-orange-600 transition-all duration-300 shadow-xl hover:shadow-orange-600/20 disabled:opacity-50 disabled:cursor-not-allowed",
                        isRTL && "font-amiri text-sm tracking-normal"
                      )}
                    >
                      {isSubmitting ? t("creating") : t("createProfile")}
                    </button>
                  </div>
                </form>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

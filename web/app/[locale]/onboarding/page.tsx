"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronRight, ChevronLeft, Check, Smartphone, Users, GraduationCap, Globe, MapPin, Calendar, School } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { SORTED_REGIONS } from "@/constants/regions";
import { useTranslations, useLocale } from "next-intl";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type Step = 1 | 2 | 3;

interface OnboardingData {
  role: "Maman" | "Papa" | "Tuteur";
  phone: string;
  spouse_email: string;
  child: {
    name: string;
    country: string;
    level: string;
    region: string;
    age: string;
    school: string;
  };
}

const levels: Record<string, string[]> = {
  DZ: ["1AP", "2AP", "3AP", "4AP", "5AP"],
  FR: ["CP", "CE1", "CE2", "CM1", "CM2"],
  MA: ["1AEP", "2AEP", "3AEP", "4AEP", "5AEP", "6AEP"],
  TN: ["1ère", "2ème", "3ème", "4ème", "5ème", "6ème"],
  INT: ["Grade 1", "Grade 2", "Grade 3", "Grade 4", "Grade 5"],
};

export default function OnboardingPage() {
  const t = useTranslations("Onboarding");
  const locale = useLocale();
  const isRTL = (locale === "ar" || locale.endsWith("-ar"));
  
  const [step, setStep] = useState<Step>(1);
  const [data, setData] = useState<OnboardingData>({
    role: "Maman",
    phone: "",
    spouse_email: "",
    child: {
      name: "",
      country: "DZ",
      level: "1AP",
      region: "Alger 16000",
      age: "",
      school: "",
    },
  });

  const steps = [
    { id: 1, title: t("Steps.Excellence"), color: "bg-orange-600" },
    { id: 2, title: t("Steps.Family"), color: "bg-blue-600" },
    { id: 3, title: t("Steps.Genius"), color: "bg-green-600" },
  ];

  const nextStep = () => step < 3 && setStep((s) => (s + 1) as Step);
  const prevStep = () => step > 1 && setStep((s) => (s - 1) as Step);

  return (
    <div className="min-h-[calc(100dvh-64px)] flex items-center justify-center p-4 md:p-10 bg-slate-50/50 interface-child" dir={isRTL ? "rtl" : "ltr"}>
      <motion.div 
        layout
        className="w-full max-w-[1200px] bg-white rounded-[3.5rem] shadow-[0_40px_100px_-20px_rgba(0,0,0,0.08)] border border-white/20 flex flex-col lg:flex-row overflow-hidden min-h-[700px]"
      >
        {/* Left Panel */}
        <div className={cn(
          "w-full lg:w-[42%] p-10 md:p-20 flex flex-col justify-between relative transition-colors duration-700",
          step === 1 ? "bg-slate-950" : step === 2 ? "bg-slate-900" : "bg-zinc-950",
          isRTL ? "lg:order-2" : "lg:order-1"
        )}>
          <AnimatePresence mode="wait">
            <motion.div
              key={step}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              className={cn("absolute top-10", isRTL ? "right-10" : "left-10")}
            >
              <span className={cn(
                "inline-block px-4 py-2 text-white text-[10px] font-bold uppercase tracking-[0.2em] rounded-md shadow-lg",
                step === 1 ? "bg-orange-600" : step === 2 ? "bg-blue-600" : "bg-green-600"
              )}>
                {steps[step - 1].title}
              </span>
            </motion.div>
          </AnimatePresence>

          <div className="flex-1" />

          <div className="space-y-6 relative z-10">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="step1" initial={{ opacity: 0, x: isRTL ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRTL ? -30 : 30 }} className="space-y-6">
                  <h1 className={cn("text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter text-white", isRTL && "font-ui-ar")}>{t("LeftPanel.Step1.Title")}</h1>
                  <div className={cn("grid grid-cols-2 gap-4 text-[12px] font-semibold text-slate-500 uppercase tracking-widest leading-relaxed", isRTL && "font-ui-ar text-lg tracking-normal")}>
                    <div className="space-y-4">
                      {t.raw("LeftPanel.Step1.Items").slice(0, 3).map((item: string) => (
                        <p key={item} className="text-slate-400">• {item}</p>
                      ))}
                    </div>
                    <div className="space-y-4">
                      {t.raw("LeftPanel.Step1.Items").slice(3).map((item: string) => (
                        <p key={item} className="text-slate-400">• {item}</p>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
              {step === 2 && (
                <motion.div key="step2" initial={{ opacity: 0, x: isRTL ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRTL ? -30 : 30 }} className="space-y-6">
                  <h1 className={cn("text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter text-white", isRTL && "font-ui-ar")}>{t("LeftPanel.Step2.Title")}</h1>
                  <p className={cn("text-blue-400 font-semibold text-sm tracking-[0.2em] uppercase", isRTL && "font-ui-ar text-xl tracking-normal")}>{t("LeftPanel.Step2.Subtitle")}</p>
                </motion.div>
              )}
              {step === 3 && (
                <motion.div key="step3" initial={{ opacity: 0, x: isRTL ? 30 : -30 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: isRTL ? -30 : 30 }} className="space-y-6">
                  <h1 className={cn("text-5xl md:text-6xl font-extrabold leading-tight tracking-tighter text-white", isRTL && "font-ui-ar")}>{t("LeftPanel.Step3.Title")}</h1>
                  <p className={cn("text-green-400 font-semibold text-sm tracking-[0.2em] uppercase italic", isRTL && "font-ui-ar text-xl tracking-normal")}>{t("LeftPanel.Step3.Subtitle")}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          <div className={cn("absolute bottom-12 flex gap-4", isRTL ? "left-12" : "right-12")}>
            {steps.map((s) => (
              <div key={s.id} className={cn("h-1.5 rounded-full transition-all duration-500", step === s.id ? cn("w-12", step === 1 ? "bg-orange-600" : step === 2 ? "bg-blue-600" : "bg-green-600") : "bg-slate-800 w-4")} />
            ))}
          </div>
        </div>

        {/* Right Panel (Form) */}
        <div className={cn("flex-1 p-10 md:p-16 flex flex-col justify-center relative bg-white", isRTL ? "lg:order-1" : "lg:order-2")}>
          <div className="max-w-md mx-auto w-full space-y-12">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div key="form1" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                  <div className="text-center space-y-4">
                    <h2 className={cn("text-4xl font-extrabold text-slate-900 tracking-tight", isRTL && "font-ui-ar text-5xl")}>{t("Form.Step1.Greeting")}</h2>
                    <p className={cn("text-slate-400 font-semibold text-[10px] uppercase tracking-[0.2em] italic", isRTL && "font-ui-ar text-lg tracking-normal")}>{t("Form.Step1.Tag")}</p>
                  </div>
                  <div className="space-y-8">
                    <div className={cn("grid grid-cols-3 gap-3", isRTL && "flex-row-reverse")}>
                      {(["Maman", "Papa", "Tuteur"] as const).map((role) => (
                        <button key={role} onClick={() => setData({ ...data, role })} className={cn("py-4 border-2 rounded-2xl text-center font-bold transition-all uppercase text-[10px] h-14 flex items-center justify-center", data.role === role ? "bg-slate-950 text-white border-slate-950 shadow-lg" : "bg-white text-slate-400 border-slate-100 hover:border-slate-200", isRTL && "font-ui-ar text-base")}>{role}</button>
                      ))}
                    </div>
                    <div className="space-y-2">
                      <label className={cn("text-[10px] font-bold uppercase tracking-widest text-slate-300 ml-1", isRTL && "font-ui-ar text-sm tracking-normal")}>{t("Form.Step1.PhoneLabel")}</label>
                      <div className="relative group">
                        <Smartphone className={cn("absolute top-1/2 -translate-y-1/2 w-5 h-5 text-slate-300 group-focus-within:text-orange-600 transition-colors", isRTL ? "right-4" : "left-4")} />
                        <input type="tel" placeholder="+213..." value={data.phone} onChange={(e) => setData({ ...data, phone: e.target.value })} className={cn("w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-950 outline-none focus:border-orange-600 focus:bg-white transition-all text-[16px]", isRTL ? "pr-12" : "pl-12")} />
                      </div>
                    </div>
                  </div>
                  <button onClick={nextStep} disabled={!data.phone} className={cn("w-full bg-slate-950 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-orange-600 transition-all disabled:opacity-50 disabled:cursor-not-allowed group", isRTL && "font-ui-ar text-xl tracking-normal")}>
                    {t("Form.Step1.Next")} {isRTL ? <ChevronLeft className="inline-block w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" /> : <ChevronRight className="inline-block w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" />}
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div key="form2" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-10">
                  <div className="text-center space-y-4">
                    <h2 className={cn("text-4xl font-extrabold text-slate-900 tracking-tight", isRTL && "font-ui-ar text-5xl")}>{t("Form.Step2.Title")}</h2>
                    <p className={cn("text-slate-400 font-semibold text-[10px] uppercase tracking-[0.2em] italic", isRTL && "font-ui-ar text-lg tracking-normal")}>{t("Form.Step2.Tag")}</p>
                  </div>
                  <div className="bg-slate-50 border border-slate-100 rounded-[2.5rem] p-8 space-y-6 text-center">
                    <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-3xl flex items-center justify-center mx-auto mb-4"><Users className="w-8 h-8" /></div>
                    <p className={cn("text-[13px] text-slate-600 font-semibold", isRTL && "font-lateef text-2xl")}>{t("Form.Step2.Desc")}</p>
                    <input type="email" placeholder={t("Form.Step2.EmailPlaceholder")} value={data.spouse_email} onChange={(e) => setData({ ...data, spouse_email: e.target.value })} className={cn("w-full bg-white border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-950 outline-none focus:border-blue-600 transition-all text-[16px]", isRTL && "text-right")} />
                  </div>
                  <div className={cn("flex gap-4", isRTL && "flex-row-reverse")}>
                    <button onClick={prevStep} className="px-8 py-5 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:text-slate-900 hover:border-slate-300 transition-all">{isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}</button>
                    <button onClick={nextStep} className={cn("flex-1 bg-slate-950 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-blue-600 transition-all", isRTL && "font-ui-ar text-xl tracking-normal")}>{t("Form.Step2.Next")}</button>
                  </div>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div key="form3" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="space-y-8">
                  <div className="text-center space-y-4">
                    <h2 className={cn("text-4xl font-extrabold text-slate-900 tracking-tight", isRTL && "font-ui-ar text-5xl")}>{t("Form.Step3.Title")}</h2>
                    <p className={cn("text-orange-600 font-semibold text-[10px] uppercase tracking-[0.2em] italic", isRTL && "font-ui-ar text-lg tracking-normal")}>{t("Form.Step3.Tag")}</p>
                  </div>
                  <div className="grid grid-cols-1 gap-4 overflow-y-auto max-h-[400px] pr-2 custom-scroll">
                    <div className="space-y-2">
                      <label className={cn("text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1", isRTL && "font-ui-ar text-sm tracking-normal mr-1")}>{t("Form.Step3.ChildName")}</label>
                      <input type="text" placeholder={t("Form.Step3.ChildName")} value={data.child.name} onChange={(e) => setData({ ...data, child: { ...data.child, name: e.target.value } })} className={cn("w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-950 focus:border-green-600 outline-none transition-all text-[16px]", isRTL && "text-right")} />
                    </div>
                    <div className={cn("grid grid-cols-2 gap-4", isRTL && "flex-row-reverse")}>
                      <div className="space-y-2">
                        <label className={cn("text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1", isRTL && "font-ui-ar text-sm tracking-normal mr-1")}>{t("Form.Step3.Country")}</label>
                        <select
                          value={data.child.country}
                          onChange={(e) => {
                            const newCountry = e.target.value;
                            const availableLevels = levels[newCountry] || levels.INT;
                            setData({ ...data, child: { ...data.child, country: newCountry, level: availableLevels[0] } });
                          }}
                          className={cn("w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-950 outline-none appearance-none text-[16px]", isRTL && "text-right")}
                        >
                          {SORTED_REGIONS.map(([code, region]) => (
                            <option key={code} value={code}>{region.name}</option>
                          ))}
                        </select>
                      </div>
                      <div className="space-y-2">
                        <label className={cn("text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1", isRTL && "font-ui-ar text-sm tracking-normal mr-1")}>{t("Form.Step3.Level")}</label>
                        <select value={data.child.level} onChange={(e) => setData({ ...data, child: { ...data.child, level: e.target.value } })} className={cn("w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-950 outline-none appearance-none text-[16px]", isRTL && "text-right")}>
                          {(levels[data.child.country] || levels.INT).map((lvl) => (
                            <option key={lvl} value={lvl}>{lvl}</option>
                          ))}
                        </select>
                      </div>
                    </div>
                    <div className={cn("grid grid-cols-2 gap-4", isRTL && "flex-row-reverse")}>
                      <div className="space-y-2">
                        <label className={cn("text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1", isRTL && "font-ui-ar text-sm tracking-normal mr-1")}>{t("Form.Step3.Age")}</label>
                        <input type="number" placeholder={t("Form.Step3.Age")} min="5" max="13" value={data.child.age} onChange={(e) => setData({ ...data, child: { ...data.child, age: e.target.value } })} className={cn("w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-950 outline-none text-[16px]", isRTL && "text-right")} />
                      </div>
                      <div className="space-y-2">
                        <label className={cn("text-[9px] font-bold text-slate-400 uppercase tracking-widest ml-1", isRTL && "font-ui-ar text-sm tracking-normal mr-1")}>{t("Form.Step3.Region")}</label>
                        <input type="text" placeholder={t("Form.Step3.Region")} value={data.child.region} onChange={(e) => setData({ ...data, child: { ...data.child, region: e.target.value } })} className={cn("w-full bg-slate-50 border-2 border-slate-100 p-4 rounded-2xl font-bold text-slate-950 outline-none text-[16px]", isRTL && "text-right")} />
                      </div>
                    </div>
                  </div>
                  <div className={cn("flex gap-4 pt-4", isRTL && "flex-row-reverse")}>
                    <button onClick={prevStep} className="px-8 py-5 border-2 border-slate-100 rounded-2xl font-bold text-slate-400 hover:text-slate-900 transition-all">{isRTL ? <ChevronRight className="w-5 h-5" /> : <ChevronLeft className="w-5 h-5" />}</button>
                    <button onClick={() => (window.location.href = "/dashboard")} className={cn("flex-1 bg-green-600 text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-xl hover:bg-slate-950 transition-all", isRTL && "font-ui-ar text-xl tracking-normal")}>{t("Form.Step3.CTA")}</button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ArrowLeft, BookOpen, Clock } from "lucide-react";
import OrgPrimaryCta from "@/components/org/OrgPrimaryCta";

type Variant = "schools" | "ngos";

const config = {
  schools: {
    ns: "OrgSchools" as const,
    backHref: "/schools",
    registerType: "ecole",
  },
  ngos: {
    ns: "OrgNgos" as const,
    backHref: "/ngos",
    registerType: "ong",
  },
};

const modules = ["m1", "m2", "m3", "m4"] as const;

export default function OrgFormationPage({ variant }: { variant: Variant }) {
  const c = config[variant];
  const t = useTranslations(c.ns);
  const accentText = variant === "schools" ? "text-indigo-600" : "text-amber-600";
  const accentBg = variant === "schools" ? "bg-indigo-50" : "bg-amber-50";
  const accentBtn =
    variant === "schools"
      ? "bg-indigo-600 hover:bg-indigo-700"
      : "bg-amber-500 hover:bg-amber-600";

  return (
    <main className="bg-white min-h-screen font-dm-sans pt-8 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href={c.backHref}
          className={`inline-flex items-center gap-2 text-sm font-bold ${accentText} mb-8 hover:underline`}
        >
          <ArrowLeft className="w-4 h-4" /> {t("backToLanding")}
        </Link>

        <h1 className="text-4xl font-black text-slate-900 font-jakarta mb-3">{t("trainingPageTitle")}</h1>
        <p className="text-slate-600 mb-4">{t("trainingPageSubtitle")}</p>
        <p className="text-sm text-slate-500 mb-10 leading-relaxed">{t("trainingIntro")}</p>

        <div className="space-y-4 mb-16">
          {modules.map((key, i) => (
            <div
              key={key}
              className="flex gap-4 p-5 rounded-2xl border-2 border-slate-100 hover:border-slate-200 transition-colors"
            >
              <div className={`w-10 h-10 rounded-xl ${accentBg} flex items-center justify-center shrink-0`}>
                <BookOpen className={`w-5 h-5 ${accentText}`} />
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <h3 className="font-black text-slate-900 text-sm">
                    {i + 1}. {t(`training.${key}.title`)}
                  </h3>
                  <span className="text-[10px] font-black uppercase text-slate-400 flex items-center gap-1 shrink-0">
                    <Clock className="w-3 h-3" /> {t(`training.${key}.duration`)}
                  </span>
                </div>
                <p className="text-sm text-slate-600">{t(`training.${key}.desc`)}</p>
              </div>
            </div>
          ))}
        </div>

        <div className={`rounded-3xl p-8 ${accentBg} border-2 border-slate-100 text-center`}>
          <h2 className="text-xl font-black text-slate-900 mb-2">{t("trainingCtaTitle")}</h2>
          <p className="text-sm text-slate-600 mb-6">{t("trainingCtaDesc")}</p>
          <OrgPrimaryCta
            variant={variant}
            className={`inline-flex items-center gap-2 text-white px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[11px] shadow-xl transition-all ${accentBtn}`}
          />
        </div>
      </div>
    </main>
  );
}

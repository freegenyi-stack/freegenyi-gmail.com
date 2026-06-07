"use client";

import React, { useState } from "react";
import { Link } from "@/i18n/routing";
import { useTranslations } from "next-intl";
import { ChevronDown, ArrowLeft } from "lucide-react";

type Variant = "schools" | "ngos";

const config = {
  schools: { ns: "OrgSchools" as const, backHref: "/schools", accent: "indigo" },
  ngos: { ns: "OrgNgos" as const, backHref: "/ngos", accent: "amber" },
};

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6", "q7", "q8"] as const;

export default function OrgFaqPage({ variant }: { variant: Variant }) {
  const c = config[variant];
  const t = useTranslations(c.ns);
  const [open, setOpen] = useState<string | null>("q1");
  const accentText = variant === "schools" ? "text-indigo-600" : "text-amber-600";

  return (
    <main className="bg-white min-h-screen font-dm-sans pt-8 pb-20 px-6">
      <div className="max-w-3xl mx-auto">
        <Link
          href={c.backHref}
          className={`inline-flex items-center gap-2 text-sm font-bold ${accentText} mb-8 hover:underline`}
        >
          <ArrowLeft className="w-4 h-4" /> {t("backToLanding")}
        </Link>

        <h1 className="text-4xl font-black text-slate-900 font-jakarta mb-3">{t("faqPageTitle")}</h1>
        <p className="text-slate-600 mb-10">{t("faqPageSubtitle")}</p>

        <div className="space-y-3">
          {faqKeys.map((key) => {
            const isOpen = open === key;
            return (
              <div key={key} className="border-2 border-slate-100 rounded-2xl overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : key)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left font-black text-slate-900 hover:bg-slate-50 transition-colors"
                >
                  <span className="text-sm">{t(`faq.${key}.q`)}</span>
                  <ChevronDown
                    className={`w-5 h-5 shrink-0 text-slate-400 transition-transform ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                {isOpen && (
                  <div className="px-5 pb-4 text-sm text-slate-600 leading-relaxed border-t border-slate-50 pt-3">
                    {t(`faq.${key}.a`)}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </main>
  );
}

"use client";

import React from "react";
import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, RefreshCcw, ShieldCheck, Upload, FileText } from "lucide-react";
import { LoadCanvasTemplateNoReload } from "react-simple-captcha";

type DocDict = {
  docStepTitle: string;
  docStepDesc: string;
  docPv: string;
  docLicence: string;
  docDeclaration: string;
  docId: string;
  docStatuts: string;
  docRecepisse: string;
  privateLicence: string;
  privateDeclaration: string;
  instCheck: string;
  instCheckDesc: string;
  orgCheck: string;
  orgCheckDesc: string;
  registerSchoolButton: string;
  registerNgoButton: string;
  securityCodePlaceholder: string;
};

const DEV_SKIP_DOCS = process.env.NEXT_PUBLIC_FREEGENY_DEV_AUTO_APPROVE === "true";

function FileField({ name, label, isArabic, required = true }: { name: string; label: string; isArabic: boolean; required?: boolean }) {
  return (
    <label className="block space-y-1.5 text-left">
      <span className={`text-[10px] font-black uppercase text-slate-600 tracking-wider ${isArabic ? "text-right block" : ""}`}>{label}{!required ? " (optionnel)" : ""}</span>
      <div className="border-2 border-dashed border-slate-200 rounded-xl p-3 bg-white hover:border-indigo-300 transition-colors">
        <input
          type="file"
          name={name}
          required={required}
          accept=".pdf,.jpg,.jpeg,.png,.webp"
          className={`w-full text-[10px] file:mr-2 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:font-bold file:uppercase ${isArabic ? "text-right" : ""}`}
        />
        <p className={`text-[9px] text-slate-400 mt-1 flex items-center gap-1 ${isArabic ? "flex-row-reverse justify-end" : ""}`}>
          <FileText className="w-3 h-3" /> PDF ou photo
        </p>
      </div>
    </label>
  );
}

type Props = {
  userType: "ecole" | "ong";
  institutionType: string;
  privateDocType: "licence" | "declaration";
  setPrivateDocType: (v: "licence" | "declaration") => void;
  isArabic: boolean;
  isSubmitting: boolean;
  captchaValue: string;
  setCaptchaValue: (v: string) => void;
  onBack: () => void;
  onReloadCaptcha: () => void;
  d: DocDict;
};

export default function RegisterOrgDocumentsStep({
  userType,
  institutionType,
  privateDocType,
  setPrivateDocType,
  isArabic,
  isSubmitting,
  captchaValue,
  setCaptchaValue,
  onBack,
  onReloadCaptcha,
  d,
}: Props) {
  const isEcole = userType === "ecole";
  const accent = isEcole ? "indigo" : "amber";
  const docRequired = !DEV_SKIP_DOCS;
  const effectiveInstitutionType =
    institutionType === "Privée" ? "Privée" : "Publique";

  return (
    <motion.div
      key={`step4-${userType}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: -20 }}
      className="space-y-3 flex-1 min-h-0"
    >
      {DEV_SKIP_DOCS ? (
        <div
          className="rounded-2xl px-4 py-3 text-center border-2"
          style={{
            backgroundColor: isEcole ? "rgba(238,242,255,0.6)" : "rgba(255,251,235,0.6)",
            borderColor: isEcole ? "#c7d2fe" : "#fde68a",
          }}
        >
          <p className="text-[10px] font-black uppercase text-orange-600 mb-1">
            {isArabic ? "وضع تجريبي محلي" : "Mode test local"}
          </p>
          <p className="text-[9px] font-bold text-slate-600 leading-snug">
            {isArabic
              ? "لا حاجة لرفع الوثائق — اضغط تسجيل المؤسسة للوصول مباشرة إلى لوحة التحكم."
              : "Aucun document requis — cliquez sur Enregistrer pour accéder au dashboard."}
          </p>
        </div>
      ) : (
        <>
          <div
            className="rounded-2xl p-4 space-y-3 border-2"
            style={{
              backgroundColor: isEcole ? "rgba(238,242,255,0.4)" : "rgba(255,251,235,0.4)",
              borderColor: isEcole ? "#c7d2fe" : "#fde68a",
            }}
          >
            <div className="text-center space-y-1">
              <Upload className="w-6 h-6 mx-auto" style={{ color: isEcole ? "#4f46e5" : "#d97706" }} />
              <h3 className="text-sm font-black text-slate-950 uppercase tracking-tighter font-jakarta">{d.docStepTitle}</h3>
              <p className="text-slate-500 font-bold text-[9px] leading-snug max-w-md mx-auto">{d.docStepDesc}</p>
            </div>
            <div className="space-y-2 max-w-md mx-auto">
              {isEcole && effectiveInstitutionType === "Publique" && (
                <>
                  <FileField name="doc_pvInstallation" label={d.docPv} isArabic={isArabic} required={docRequired} />
                  <FileField name="doc_idCard" label={d.docId} isArabic={isArabic} required={docRequired} />
                </>
              )}
              {isEcole && effectiveInstitutionType === "Privée" && (
                <>
                  <div className="grid grid-cols-2 gap-2">
                    <button type="button" onClick={() => setPrivateDocType("licence")} className={`py-1.5 rounded-lg border-2 font-black text-[8px] uppercase ${privateDocType === "licence" ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-100 text-slate-400"}`}>{d.privateLicence}</button>
                    <button type="button" onClick={() => setPrivateDocType("declaration")} className={`py-1.5 rounded-lg border-2 font-black text-[8px] uppercase ${privateDocType === "declaration" ? "bg-indigo-600 border-indigo-600 text-white" : "bg-white border-slate-100 text-slate-400"}`}>{d.privateDeclaration}</button>
                  </div>
                  <FileField name={privateDocType === "licence" ? "doc_licence" : "doc_declaration"} label={privateDocType === "licence" ? d.docLicence : d.docDeclaration} isArabic={isArabic} required={docRequired} />
                  <FileField name="doc_idCard" label={d.docId} isArabic={isArabic} required={docRequired} />
                </>
              )}
              {!isEcole && (
                <>
                  <FileField name="doc_statuts" label={d.docStatuts} isArabic={isArabic} required={docRequired} />
                  <FileField name="doc_recepisse" label={d.docRecepisse} isArabic={isArabic} required={docRequired} />
                  <FileField name="doc_idCard" label={d.docId} isArabic={isArabic} required={docRequired} />
                </>
              )}
            </div>
          </div>
          <div className="rounded-2xl p-3 border border-slate-100">
            <div className="flex flex-col sm:flex-row items-center gap-3">
              <div className="relative shrink-0">
                <div className="bg-white p-2 rounded-xl border shadow-sm flex justify-center">
                  <div className="scale-75 contrast-125 rounded-lg overflow-hidden">
                    <LoadCanvasTemplateNoReload />
                  </div>
                </div>
                <button type="button" onClick={onReloadCaptcha} className={`absolute text-white p-1 rounded-full shadow-lg ${isArabic ? "-left-1 -top-1" : "-right-1 -top-1"}`} style={{ backgroundColor: isEcole ? "#4f46e5" : "#d97706" }}>
                  <RefreshCcw className="w-3 h-3" />
                </button>
              </div>
              <div className="flex-1 w-full">
                <div className="relative">
                  <ShieldCheck className={`absolute top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 ${isArabic ? "right-3" : "left-3"}`} />
                  <input type="text" placeholder={d.securityCodePlaceholder} value={captchaValue} onChange={(e) => setCaptchaValue(e.target.value)} className={`w-full bg-white border-2 py-2 rounded-xl outline-none font-black text-xs tracking-[0.2em] ${isArabic ? "pr-10 pl-3 text-right" : "pl-10 pr-3"}`} />
                </div>
              </div>
            </div>
          </div>
        </>
      )}

      <input type="hidden" name="private_doc_type" value={privateDocType} />

      <div className="flex gap-3 justify-center pt-1 shrink-0">
        <button type="button" onClick={onBack} className="px-6 border-2 border-slate-100 rounded-2xl text-slate-400 hover:bg-slate-50 transition-all shadow-sm flex items-center justify-center">
          {isArabic ? <ArrowRight size={20} /> : <ArrowLeft size={20} />}
        </button>
        <button
          type="submit"
          disabled={isSubmitting}
          className={`px-10 bg-slate-950 text-white py-3 rounded-2xl font-black uppercase tracking-widest text-[10px] hover:bg-${accent}-600 transition-all shadow-2xl flex items-center justify-center gap-3 disabled:opacity-50`}
        >
          {isSubmitting ? (
            <RefreshCcw className="w-4 h-4 animate-spin" />
          ) : isEcole ? (
            d.registerSchoolButton
          ) : (
            d.registerNgoButton
          )}
        </button>
      </div>
    </motion.div>
  );
}

"use client";



import React, { useState } from "react";

import { Link } from "@/i18n/routing";

import { Clock, XCircle, CheckCircle2, Upload, FileText, ArrowRight } from "lucide-react";

import { resubmitVerificationAction } from "@/lib/actions/org_verification";

import { getOrgDashboardPath } from "@/lib/orgVerification.shared";

import { toast } from "sonner";



type Props = {

  variant: "ecole" | "ong";

  status: "pending" | "approved" | "rejected";

  trackingCode: string;

  rejectionReason?: string | null;

  productName: string;

  labels: {

    pendingTitle: string;

    pendingDesc: string;

    rejectedTitle: string;

    rejectedDesc: string;

    approvedTitle: string;

    approvedDesc: string;

    trackingLabel: string;

    accessErp: string;

    resubmit: string;

    resubmitting: string;

    docPv: string;

    docLicence: string;

    docDeclaration: string;

    docId: string;

    docStatuts: string;

    docRecepisse: string;

    privateLicence: string;

    privateDeclaration: string;

  };

  institutionType?: string;

};



function FileField({ name, label }: { name: string; label: string }) {

  return (

    <label className="block space-y-2">

      <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider">{label}</span>

      <div className="relative border-2 border-dashed border-slate-200 rounded-xl p-4 hover:border-orange-300 transition-colors bg-white">

        <input type="file" name={name} accept=".pdf,.jpg,.jpeg,.png,.webp" className="w-full text-xs file:mr-3 file:py-2 file:px-4 file:rounded-lg file:border-0 file:bg-slate-900 file:text-white file:font-bold file:text-[10px] file:uppercase" />

        <p className="text-[9px] text-slate-400 mt-2 flex items-center gap-1"><FileText className="w-3 h-3" /> PDF ou photo (max 10 Mo)</p>

      </div>

    </label>

  );

}



export default function OrgVerificationDashboard({

  variant,

  status,

  trackingCode,

  rejectionReason,

  productName,

  labels,

  institutionType,

}: Props) {

  const [privateDocType, setPrivateDocType] = useState<"licence" | "declaration">("licence");

  const [submitting, setSubmitting] = useState(false);

  const accent = variant === "ecole" ? "indigo" : "amber";



  const handleResubmit = async (e: React.FormEvent<HTMLFormElement>) => {

    e.preventDefault();

    setSubmitting(true);

    const fd = new FormData(e.currentTarget);

    fd.append("private_doc_type", privateDocType);

    const result = await resubmitVerificationAction(fd);

    if ("success" in result && result.success) {

      toast.success("Dossier renvoyé avec succès");

      window.location.reload();

    } else {

      toast.error("error" in result ? result.error : "Erreur");

    }

    setSubmitting(false);

  };



  if (status === "pending") {

    return (

      <div className={`bg-${accent}-50 border-2 border-${accent}-100 rounded-[2.5rem] p-10 text-center max-w-2xl mx-auto`}>

        <Clock className={`w-12 h-12 text-${accent}-600 mx-auto mb-4`} style={{ color: variant === "ecole" ? "#4f46e5" : "#d97706" }} />

        <h2 className="text-2xl font-black text-slate-900 mb-3">{labels.pendingTitle}</h2>

        <p className="text-slate-600 mb-6 leading-relaxed">{labels.pendingDesc}</p>

        <div className="inline-block bg-white px-6 py-3 rounded-xl border border-slate-200">

          <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">{labels.trackingLabel}</p>

          <p className="text-lg font-black text-slate-900 font-mono">{trackingCode}</p>

        </div>

      </div>

    );

  }



  if (status === "rejected") {

    return (

      <div className="max-w-2xl mx-auto space-y-8">

        <div className="bg-red-50 border-2 border-red-100 rounded-[2.5rem] p-10 text-center">

          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />

          <h2 className="text-2xl font-black text-slate-900 mb-3">{labels.rejectedTitle}</h2>

          <p className="text-slate-600 mb-4">{labels.rejectedDesc}</p>

          {rejectionReason && (

            <p className="text-sm text-red-700 bg-white rounded-xl p-4 border border-red-100 font-medium">{rejectionReason}</p>

          )}

        </div>

        <form onSubmit={handleResubmit} className="bg-white border-2 border-slate-100 rounded-[2.5rem] p-8 space-y-4">

          <h3 className="font-black text-slate-900 flex items-center gap-2"><Upload className="w-5 h-5" /> {labels.resubmit}</h3>

          {variant === "ecole" && institutionType === "Privée" && (

            <div className="grid grid-cols-2 gap-3">

              <button type="button" onClick={() => setPrivateDocType("licence")} className={`py-2 rounded-xl border-2 text-[10px] font-black uppercase ${privateDocType === "licence" ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-100 text-slate-400"}`}>{labels.privateLicence}</button>

              <button type="button" onClick={() => setPrivateDocType("declaration")} className={`py-2 rounded-xl border-2 text-[10px] font-black uppercase ${privateDocType === "declaration" ? "bg-indigo-600 border-indigo-600 text-white" : "border-slate-100 text-slate-400"}`}>{labels.privateDeclaration}</button>

            </div>

          )}

          {variant === "ecole" && institutionType === "Publique" && (

            <>

              <FileField name="doc_pvInstallation" label={labels.docPv} />

              <FileField name="doc_idCard" label={labels.docId} />

            </>

          )}

          {variant === "ecole" && institutionType === "Privée" && (

            <>

              <FileField name={privateDocType === "licence" ? "doc_licence" : "doc_declaration"} label={privateDocType === "licence" ? labels.docLicence : labels.docDeclaration} />

              <FileField name="doc_idCard" label={labels.docId} />

            </>

          )}

          {variant === "ong" && (

            <>

              <FileField name="doc_statuts" label={labels.docStatuts} />

              <FileField name="doc_recepisse" label={labels.docRecepisse} />

              <FileField name="doc_idCard" label={labels.docId} />

            </>

          )}

          <button type="submit" disabled={submitting} className="w-full bg-slate-950 text-white py-3 rounded-xl font-black uppercase tracking-widest text-[10px] hover:bg-orange-600 transition-all disabled:opacity-50">

            {submitting ? labels.resubmitting : labels.resubmit}

          </button>

        </form>

      </div>

    );

  }



  return (

    <div className="bg-emerald-50 border-2 border-emerald-100 rounded-[2.5rem] p-10 text-center max-w-2xl mx-auto">

      <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto mb-4" />

      <h2 className="text-2xl font-black text-slate-900 mb-3">{labels.approvedTitle}</h2>

      <p className="text-slate-600 mb-6 leading-relaxed">{labels.approvedDesc}</p>

      <Link

        href={getOrgDashboardPath(variant)}

        className={`inline-flex items-center gap-2 px-8 py-4 rounded-2xl font-black uppercase tracking-widest text-[10px] text-white transition-all shadow-xl ${

          variant === "ecole" ? "bg-indigo-600 hover:bg-indigo-700" : "bg-amber-500 hover:bg-amber-600"

        }`}

      >

        {labels.accessErp} — {productName} <ArrowRight className="w-4 h-4" />

      </Link>

    </div>

  );

}



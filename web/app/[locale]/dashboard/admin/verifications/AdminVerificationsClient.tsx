"use client";

import React, { useState } from "react";
import { reviewVerificationAction } from "@/lib/actions/org_verification";
import { parseVerificationDocuments } from "@/lib/admin/verification-documents";
import { toast } from "sonner";
import { CheckCircle2, XCircle, Building2, Heart, GraduationCap, FileText, ExternalLink } from "lucide-react";

type Row = {
  id: number;
  trackingCode: string;
  status: string;
  orgType: string;
  institutionSubtype: string | null;
  documents: string | null;
  rejectionReason: string | null;
  userName: string | null;
  userEmail: string;
  userPhone: string | null;
  createdAt: string;
};

export default function AdminVerificationsClient({ rows }: { rows: Row[] }) {
  const [loading, setLoading] = useState<number | null>(null);
  const [rejectId, setRejectId] = useState<number | null>(null);
  const [rejectReason, setRejectReason] = useState("");

  const handleReview = async (id: number, action: "approve" | "reject", reason?: string) => {
    setLoading(id);
    const result = await reviewVerificationAction(id, action, reason);
    if ("success" in result && result.success) {
      toast.success(action === "approve" ? "Approuvé" : "Refusé");
      window.location.reload();
    } else {
      toast.error("error" in result ? result.error : "Erreur");
    }
    setLoading(null);
    setRejectId(null);
  };

  if (rows.length === 0) {
    return <p className="text-slate-500 bg-white rounded-2xl p-8 border border-slate-100">Aucun dossier pour le moment.</p>;
  }

  return (
    <div className="space-y-4">
      {rows.map((row) => {
        const docItems = parseVerificationDocuments(row.documents);
        const isEcole = row.orgType === "ecole";
        const isTeacher = row.orgType === "enseignant";
        const OrgIcon = isTeacher ? GraduationCap : isEcole ? Building2 : Heart;
        const orgLabel = isTeacher ? "Enseignant" : isEcole ? "École" : "ONG";
        return (
          <div key={row.id} className="bg-white rounded-2xl border border-slate-100 p-6 shadow-sm">
            <div className="flex flex-wrap items-start justify-between gap-4 mb-4">
              <div className="flex items-center gap-3">
                <OrgIcon className={`w-5 h-5 ${isTeacher ? "text-teal-600" : isEcole ? "text-indigo-600" : "text-amber-600"}`} />
                <div>
                  <p className="font-black text-slate-900">{row.userName}</p>
                  <p className="text-xs text-slate-500">{row.userEmail}{row.userPhone ? ` · ${row.userPhone}` : ""}</p>
                  <p className="text-[10px] font-mono text-orange-600 mt-1">{row.trackingCode}</p>
                </div>
              </div>
              <span className={`text-[10px] font-black uppercase px-3 py-1 rounded-full ${
                row.status === "approved" ? "bg-emerald-100 text-emerald-700" :
                row.status === "rejected" ? "bg-red-100 text-red-700" :
                "bg-amber-100 text-amber-700"
              }`}>
                {row.status}
              </span>
            </div>
            <p className="text-xs text-slate-500 mb-3">
              {orgLabel} — {row.institutionSubtype ?? "—"}
            </p>
            {docItems.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-4">
                {docItems.map((item, i) =>
                  item.kind === "dev" ? (
                    <span
                      key={`dev-${i}`}
                      className="inline-flex items-center gap-1.5 rounded-xl bg-amber-50 px-3 py-1.5 text-[11px] font-medium text-amber-900 ring-1 ring-amber-200"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {item.message}
                    </span>
                  ) : (
                    <a
                      key={item.key}
                      href={item.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-xl bg-slate-100 px-3 py-1.5 text-[11px] font-semibold text-slate-700 transition hover:bg-teal-50 hover:text-teal-800"
                    >
                      <FileText className="h-3.5 w-3.5" />
                      {item.label}
                      <ExternalLink className="h-3 w-3 opacity-50" />
                    </a>
                  )
                )}
              </div>
            )}
            {row.status === "pending" && (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  disabled={loading === row.id}
                  onClick={() => handleReview(row.id, "approve")}
                  className="inline-flex items-center gap-2 bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" /> Approuver
                </button>
                <button
                  type="button"
                  onClick={() => setRejectId(row.id)}
                  className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                >
                  <XCircle className="w-4 h-4" /> Refuser
                </button>
              </div>
            )}
            {rejectId === row.id && (
              <div className="mt-4 flex gap-2">
                <input
                  type="text"
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  placeholder="Motif du refus..."
                  className="flex-1 border-2 border-slate-100 rounded-xl px-3 py-2 text-sm"
                />
                <button
                  type="button"
                  onClick={() => handleReview(row.id, "reject", rejectReason)}
                  className="bg-red-600 text-white px-4 py-2 rounded-xl text-[10px] font-black uppercase"
                >
                  Confirmer
                </button>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}

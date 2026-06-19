"use client";

import React, { useTransition } from "react";
import { updateContactStatusAction } from "@/lib/actions/admin_modules";
import { adminSelectClass } from "@/components/admin/adminFormStyles";
import { toast } from "sonner";

type Row = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
  message: string;
  status: string;
  createdAt: Date;
};

export default function AdminContactsClient({ rows }: { rows: Row[] }) {
  const [pending, startTransition] = useTransition();

  const setStatus = (id: number, status: string) => {
    startTransition(async () => {
      const res = await updateContactStatusAction(id, status);
      if ("error" in res && res.error) toast.error(res.error);
    });
  };

  return (
    <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white">
      <table className="w-full min-w-[640px] text-left text-sm">
        <thead className="border-b bg-slate-50 text-[10px] font-black uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Contact</th>
            <th className="px-4 py-3">Message</th>
            <th className="px-4 py-3">Statut</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {rows.map((r) => (
            <tr key={r.id}>
              <td className="px-4 py-3 align-top">
                <p className="font-bold">{r.name}</p>
                <p className="text-xs text-slate-500">{r.email}</p>
                <p className="text-[10px] text-slate-400 mt-1">{new Date(r.createdAt).toLocaleString("fr-FR")}</p>
              </td>
              <td className="px-4 py-3 align-top max-w-md">
                {r.subject && <p className="text-xs font-bold text-slate-600 mb-1">{r.subject}</p>}
                <p className="text-slate-700">{r.message.slice(0, 300)}</p>
              </td>
              <td className="px-4 py-3 align-top">
                <select
                  disabled={pending}
                  value={r.status}
                  onChange={(e) => setStatus(r.id, e.target.value)}
                  className={`${adminSelectClass} text-xs`}
                >
                  <option value="pending">En attente</option>
                  <option value="in_progress">En cours</option>
                  <option value="resolved">Résolu</option>
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      {rows.length === 0 && <p className="p-8 text-center text-sm text-slate-500">Aucun message contact.</p>}
    </div>
  );
}

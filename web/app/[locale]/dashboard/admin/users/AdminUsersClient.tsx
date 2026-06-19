"use client";

import React, { useTransition } from "react";
import type { AdminUserRow } from "@/lib/admin/stats.server";
import { setUserBannedAction, setUserRoleAction } from "@/lib/actions/admin_modules";
import { adminSelectClass } from "@/components/admin/adminFormStyles";
import { toast } from "sonner";

const ROLES = ["parent", "coparent", "enseignant", "admin", "ecole", "ong"] as const;

export default function AdminUsersClient({ users }: { users: AdminUserRow[] }) {
  const [pending, startTransition] = useTransition();

  const changeRole = (userId: number, role: string) => {
    startTransition(async () => {
      const res = await setUserRoleAction(userId, role);
      if ("error" in res && res.error) toast.error(res.error);
      else toast.success("Rôle mis à jour");
    });
  };

  const toggleBan = (userId: number, banned: boolean) => {
    startTransition(async () => {
      const res = await setUserBannedAction(userId, !banned);
      if ("error" in res && res.error) toast.error(res.error);
      else toast.success(banned ? "Compte débloqué" : "Compte bloqué");
    });
  };

  const impersonate = (userId: number) => {
    startTransition(async () => {
      const res = await fetch("/api/admin/impersonate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });
      const data = (await res.json()) as { redirect?: string; error?: string; targetName?: string };
      if (!res.ok) {
        toast.error(data.error || "Erreur");
        return;
      }
      toast.success(`Connecté comme ${data.targetName || "utilisateur"}`);
      window.location.href = data.redirect || "/dashboard/parent";
    });
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <a
          href="/api/admin/users/export"
          className="rounded-xl bg-slate-900 px-4 py-2 text-xs font-black uppercase text-white hover:bg-orange-600"
        >
          Exporter CSV
        </a>
      </div>
      <div className="overflow-x-auto rounded-2xl border border-slate-200 bg-white shadow-sm">
      <table className="w-full min-w-[800px] text-left text-sm">
        <thead className="border-b border-slate-100 bg-slate-50 text-[10px] font-black uppercase text-slate-500">
          <tr>
            <th className="px-4 py-3">Utilisateur</th>
            <th className="px-4 py-3">E-mail</th>
            <th className="px-4 py-3">Rôle</th>
            <th className="px-4 py-3">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-100">
          {users.map((u) => (
            <tr key={u.id} className="hover:bg-slate-50/80">
              <td className="px-4 py-3 font-bold text-slate-900">
                {u.fullName || "—"}
                {u.username ? (
                  <span className="block text-xs font-medium text-slate-500">@{u.username}</span>
                ) : null}
              </td>
              <td className="px-4 py-3 text-slate-600">{u.email}</td>
              <td className="px-4 py-3">
                <select
                  disabled={pending}
                  value={u.role ?? "parent"}
                  onChange={(e) => changeRole(u.id, e.target.value)}
                  className={adminSelectClass + " text-xs"}
                >
                  {ROLES.map((r) => (
                    <option key={r} value={r}>
                      {r}
                    </option>
                  ))}
                </select>
              </td>
              <td className="px-4 py-3">
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => toggleBan(u.id, u.isBanned)}
                    className={`rounded-lg px-3 py-1 text-[10px] font-black uppercase ${
                      u.isBanned ? "bg-emerald-100 text-emerald-800" : "bg-red-100 text-red-800"
                    }`}
                  >
                    {u.isBanned ? "Débloquer" : "Bloquer"}
                  </button>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() => impersonate(u.id)}
                    className="rounded-lg bg-violet-100 px-3 py-1 text-[10px] font-black uppercase text-violet-800"
                  >
                    Impersonate
                  </button>
                </div>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}

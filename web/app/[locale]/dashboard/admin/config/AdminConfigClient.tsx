"use client";

import React, { useTransition } from "react";
import { updateAppSettingAction } from "@/lib/actions/admin_settings";
import { toast } from "sonner";
import type { AppSettingRow } from "@/lib/admin/settings.server";

const TOGGLES: { key: string; label: string; desc: string }[] = [
  { key: "maintenance_mode", label: "Mode maintenance", desc: "Affiche une page maintenance aux visiteurs non-admin." },
  { key: "registration_open", label: "Inscriptions ouvertes", desc: "Autorise les nouvelles inscriptions." },
  { key: "library_public", label: "Bibliothèque publique", desc: "Catalogue visible côté parents (si livres publiés)." },
];

export default function AdminConfigClient({ settings }: { settings: AppSettingRow[] }) {
  const [pending, startTransition] = useTransition();
  const map = Object.fromEntries(settings.map((s) => [s.key, s.value]));

  const toggle = (key: string) => {
    const current = map[key] === "true";
    startTransition(async () => {
      const res = await updateAppSettingAction(key, current ? "false" : "true");
      if ("error" in res && res.error) toast.error(res.error);
      else toast.success("Paramètre mis à jour");
    });
  };

  return (
    <ul className="space-y-3">
      {TOGGLES.map(({ key, label, desc }) => {
        const on = map[key] === "true";
        return (
          <li key={key} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-slate-100 px-4 py-3">
            <div>
              <p className="font-bold text-slate-900">{label}</p>
              <p className="text-sm text-slate-500">{desc}</p>
            </div>
            <button
              type="button"
              disabled={pending}
              onClick={() => toggle(key)}
              className={`rounded-xl px-4 py-2 text-xs font-black uppercase ${
                on ? "bg-emerald-600 text-white" : "bg-slate-200 text-slate-600"
              }`}
            >
              {on ? "Activé" : "Désactivé"}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

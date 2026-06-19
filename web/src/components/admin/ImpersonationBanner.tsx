"use client";

import React, { useTransition } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export default function ImpersonationBanner() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();

  const stop = () => {
    startTransition(async () => {
      const res = await fetch("/api/admin/impersonate", { method: "DELETE" });
      const data = (await res.json()) as { redirect?: string; error?: string };
      if (!res.ok) {
        toast.error(data.error || "Erreur");
        return;
      }
      toast.success("Impersonation terminée");
      router.push(data.redirect || "/dashboard/admin");
      router.refresh();
    });
  };

  return (
    <div className="fixed bottom-4 left-1/2 z-[200] -translate-x-1/2 rounded-2xl border border-amber-300 bg-amber-50 px-4 py-2 shadow-lg flex items-center gap-3">
      <span className="text-xs font-bold text-amber-900">Mode impersonation actif</span>
      <button
        type="button"
        disabled={pending}
        onClick={stop}
        className="rounded-lg bg-amber-600 px-3 py-1 text-[10px] font-black uppercase text-white"
      >
        Revenir admin
      </button>
    </div>
  );
}

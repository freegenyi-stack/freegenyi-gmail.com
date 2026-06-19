"use client";

import React, { useCallback, useEffect, useMemo, useState } from "react";
import { listNotificationRecipientsAction } from "@/lib/actions/admin_modules";
import type { AdminNotificationTarget, NotificationRecipient } from "@/lib/admin/mailing.server";
import { adminFieldClass } from "@/components/admin/adminFormStyles";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Check, Loader2, Search, UserCheck, Users } from "lucide-react";

export const ADMIN_RECIPIENT_TARGETS: {
  value: AdminNotificationTarget;
  label: string;
  hint: string;
}[] = [
  { value: "all", label: "Tous", hint: "Tous les comptes inscrits" },
  { value: "parent", label: "Parents", hint: "Rôle parent" },
  { value: "coparent", label: "Co-parents", hint: "Rôle co-parent" },
  { value: "enseignant", label: "Enseignants", hint: "Rôle enseignant" },
  { value: "admin", label: "Admins", hint: "Administrateurs" },
  { value: "ecole", label: "Écoles", hint: "Comptes école" },
  { value: "ong", label: "ONG", hint: "Comptes ONG" },
];

export type RecipientSelectionMode = "all" | "custom";

function recipientLabel(user: NotificationRecipient): string {
  return user.fullName?.trim() || user.username || user.email.split("@")[0] || `User #${user.id}`;
}

function initials(user: NotificationRecipient): string {
  const name = recipientLabel(user);
  const parts = name.split(/\s+/).filter(Boolean);
  if (parts.length >= 2) return (parts[0][0] + parts[1][0]).toUpperCase();
  return name.slice(0, 2).toUpperCase();
}

export type AdminUserRecipientPickerProps = {
  target: AdminNotificationTarget;
  onTargetChange: (target: AdminNotificationTarget) => void;
  selectionMode: RecipientSelectionMode;
  onSelectionModeChange: (mode: RecipientSelectionMode) => void;
  selectedIds: number[];
  onSelectedIdsChange: (ids: number[]) => void;
  roleCounts: Record<string, number>;
  totalUsers: number;
  maxBroadcast?: number;
};

export function AdminUserRecipientPicker({
  target,
  onTargetChange,
  selectionMode,
  onSelectionModeChange,
  selectedIds,
  onSelectedIdsChange,
  roleCounts,
  totalUsers,
  maxBroadcast = 500,
}: AdminUserRecipientPickerProps) {
  const [loadingRecipients, setLoadingRecipients] = useState(false);
  const [recipients, setRecipients] = useState<NotificationRecipient[]>([]);
  const [groupTotal, setGroupTotal] = useState(0);
  const [search, setSearch] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const groupCount = (t: AdminNotificationTarget) =>
    t === "all" ? totalUsers : roleCounts[t] ?? 0;

  const activeTarget = ADMIN_RECIPIENT_TARGETS.find((t) => t.value === target)!;
  const recipientCount = selectionMode === "all" ? groupCount(target) : selectedIds.length;

  useEffect(() => {
    const timer = setTimeout(() => setDebouncedSearch(search.trim()), 280);
    return () => clearTimeout(timer);
  }, [search]);

  const loadRecipients = useCallback(async () => {
    setLoadingRecipients(true);
    try {
      const res = await listNotificationRecipientsAction(target, debouncedSearch || undefined);
      if ("error" in res && res.error) {
        toast.error(res.error);
        return;
      }
      if ("users" in res) {
        setRecipients(res.users);
        setGroupTotal(res.total);
      }
    } finally {
      setLoadingRecipients(false);
    }
  }, [target, debouncedSearch]);

  useEffect(() => {
    if (selectionMode === "custom") void loadRecipients();
  }, [selectionMode, loadRecipients]);

  const handleTargetChange = (next: AdminNotificationTarget) => {
    onTargetChange(next);
    onSelectionModeChange("all");
    onSelectedIdsChange([]);
    setSearch("");
    setDebouncedSearch("");
    setRecipients([]);
  };

  const handleModeChange = (mode: RecipientSelectionMode) => {
    onSelectionModeChange(mode);
    if (mode === "all") onSelectedIdsChange([]);
  };

  const visibleIds = useMemo(() => recipients.map((r) => r.id), [recipients]);

  const toggleUser = (id: number) => {
    onSelectedIdsChange(
      selectedIds.includes(id) ? selectedIds.filter((x) => x !== id) : [...selectedIds, id]
    );
  };

  const selectVisible = () => {
    onSelectedIdsChange([...new Set([...selectedIds, ...visibleIds])]);
  };

  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-black uppercase text-slate-500">1. Choisir un groupe</p>
        <div className="flex flex-wrap gap-2">
          {ADMIN_RECIPIENT_TARGETS.map((t) => {
            const count = groupCount(t.value);
            const active = target === t.value;
            return (
              <button
                key={t.value}
                type="button"
                onClick={() => handleTargetChange(t.value)}
                className={cn(
                  "rounded-xl border px-3 py-2 text-left transition",
                  active
                    ? "border-orange-500 bg-orange-50 shadow-sm"
                    : "border-slate-200 bg-white hover:border-slate-300 hover:bg-slate-50"
                )}
              >
                <span className={cn("block text-xs font-black", active ? "text-orange-700" : "text-slate-800")}>
                  {t.label}
                </span>
                <span className="text-[10px] font-bold text-slate-500">
                  {count} compte{count > 1 ? "s" : ""}
                </span>
              </button>
            );
          })}
        </div>
        <p className="mt-2 text-xs text-slate-500">{activeTarget.hint}</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-black uppercase text-slate-500">2. Portée dans le groupe</p>
        <div className="grid gap-2 sm:grid-cols-2">
          <button
            type="button"
            onClick={() => handleModeChange("all")}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 text-left transition",
              selectionMode === "all"
                ? "border-slate-900 bg-slate-900 text-white"
                : "border-slate-200 bg-white hover:bg-slate-50"
            )}
          >
            <Users className="h-5 w-5 shrink-0 opacity-80" />
            <span>
              <span className="block text-sm font-black">Tout le groupe</span>
              <span className={cn("text-xs", selectionMode === "all" ? "text-slate-300" : "text-slate-500")}>
                {groupCount(target)} personne{groupCount(target) > 1 ? "s" : ""}
              </span>
            </span>
            {selectionMode === "all" && <Check className="ml-auto h-4 w-4" />}
          </button>
          <button
            type="button"
            onClick={() => handleModeChange("custom")}
            className={cn(
              "flex items-center gap-3 rounded-xl border p-3 text-left transition",
              selectionMode === "custom"
                ? "border-orange-500 bg-orange-50"
                : "border-slate-200 bg-white hover:bg-slate-50"
            )}
          >
            <UserCheck className="h-5 w-5 shrink-0 text-orange-600" />
            <span>
              <span className="block text-sm font-black text-slate-900">Personnes précises</span>
              <span className="text-xs text-slate-500">
                {selectedIds.length > 0
                  ? `${selectedIds.length} sélectionné${selectedIds.length > 1 ? "s" : ""}`
                  : "Choisir dans la liste"}
              </span>
            </span>
            {selectionMode === "custom" && <Check className="ml-auto h-4 w-4 text-orange-600" />}
          </button>
        </div>
      </div>

      {selectionMode === "custom" && (
        <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
          <p className="mb-2 text-xs font-black uppercase text-slate-500">3. Sélectionner des personnes</p>
          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par nom, e-mail ou identifiant…"
              className={`w-full py-2 pl-10 pr-3 ${adminFieldClass}`}
            />
          </div>
          <div className="mb-2 flex flex-wrap items-center justify-between gap-2">
            <span className="text-xs font-bold text-slate-600">
              {selectedIds.length} sélectionné{selectedIds.length > 1 ? "s" : ""}
              {groupTotal > recipients.length ? ` · ${recipients.length} affichés sur ${groupTotal}` : ""}
            </span>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={selectVisible}
                className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-black uppercase text-slate-700 ring-1 ring-slate-200 hover:bg-slate-100"
              >
                Tout afficher
              </button>
              <button
                type="button"
                onClick={() => onSelectedIdsChange([])}
                className="rounded-lg bg-white px-2.5 py-1 text-[10px] font-black uppercase text-slate-500 ring-1 ring-slate-200 hover:bg-slate-100"
              >
                Effacer
              </button>
            </div>
          </div>
          <div className="max-h-64 overflow-y-auto rounded-xl border border-slate-200 bg-white">
            {loadingRecipients ? (
              <div className="flex items-center justify-center gap-2 py-12 text-sm text-slate-500">
                <Loader2 className="h-4 w-4 animate-spin" />
                Chargement…
              </div>
            ) : recipients.length === 0 ? (
              <p className="py-10 text-center text-sm text-slate-500">Aucun utilisateur trouvé.</p>
            ) : (
              <ul className="divide-y divide-slate-100">
                {recipients.map((user) => {
                  const checked = selectedIds.includes(user.id);
                  return (
                    <li key={user.id}>
                      <label
                        className={cn(
                          "flex cursor-pointer items-center gap-3 px-3 py-2.5 transition hover:bg-orange-50/60",
                          checked && "bg-orange-50"
                        )}
                      >
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleUser(user.id)}
                          className="rounded border-slate-300 text-orange-600 focus:ring-orange-500"
                        />
                        <span
                          className={cn(
                            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-xs font-black",
                            checked ? "bg-orange-500 text-white" : "bg-slate-100 text-slate-600"
                          )}
                        >
                          {initials(user)}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-sm font-bold text-slate-900">
                            {recipientLabel(user)}
                          </span>
                          <span className="block truncate text-xs text-slate-500">{user.email}</span>
                        </span>
                        {checked && <Check className="h-4 w-4 shrink-0 text-orange-600" />}
                      </label>
                    </li>
                  );
                })}
              </ul>
            )}
          </div>
          {groupTotal > maxBroadcast && (
            <p className="mt-2 text-xs text-amber-700">
              Ce groupe dépasse {maxBroadcast} comptes — affinez avec la recherche ou sélectionnez des personnes
              précises.
            </p>
          )}
        </div>
      )}

      <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-3 text-sm">
        <span className="font-bold text-slate-800">
          {recipientCount} destinataire{recipientCount > 1 ? "s" : ""}
        </span>
        <span className="text-slate-400"> · </span>
        <span className="text-slate-600">
          {activeTarget.label}
          {selectionMode === "custom" ? " (sélection personnalisée)" : " (groupe entier)"}
        </span>
      </div>
    </div>
  );
}

export function useRecipientCount(
  target: AdminNotificationTarget,
  selectionMode: RecipientSelectionMode,
  selectedIds: number[],
  roleCounts: Record<string, number>,
  totalUsers: number
) {
  const groupCount = (t: AdminNotificationTarget) =>
    t === "all" ? totalUsers : roleCounts[t] ?? 0;
  return selectionMode === "all" ? groupCount(target) : selectedIds.length;
}

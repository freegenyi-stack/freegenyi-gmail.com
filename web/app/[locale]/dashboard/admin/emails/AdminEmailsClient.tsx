"use client";

import React, { useMemo, useState } from "react";
import { sendAdminEmailAction } from "@/lib/actions/admin_modules";
import type { AdminContactOption, AdminEmailTarget, AdminNotificationTarget } from "@/lib/admin/mailing.server";
import { FREEGENY_EMAILS } from "@/lib/site-emails";
import { adminFieldClass, adminSelectClass, adminTextareaClass } from "@/components/admin/adminFormStyles";
import {
  AdminUserRecipientPicker,
  useRecipientCount,
  type RecipientSelectionMode,
} from "@/components/admin/AdminUserRecipientPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { Check, Mail, Users } from "lucide-react";

const MAX_BROADCAST = 500;

const EXTRA_TARGETS: { value: AdminEmailTarget; label: string; hint: string }[] = [
  { value: "contact_form", label: "Contacts web", hint: "Messages du formulaire contact" },
  { value: "manual", label: "Adresses libres", hint: "E-mails saisis manuellement" },
];

function isUserTarget(t: AdminEmailTarget): t is AdminNotificationTarget {
  return t !== "contact_form" && t !== "manual";
}

export default function AdminEmailsClient({
  contacts,
  roleCounts,
  totalUsers,
  contactFormTotal,
}: {
  contacts: AdminContactOption[];
  roleCounts: Record<string, number>;
  totalUsers: number;
  contactFormTotal: number;
}) {
  const [sending, setSending] = useState(false);
  const [fromKey, setFromKey] = useState<keyof typeof FREEGENY_EMAILS>("contact");
  const [subject, setSubject] = useState("");
  const [body, setBody] = useState("");

  const [target, setTarget] = useState<AdminEmailTarget>("all");
  const [selectionMode, setSelectionMode] = useState<RecipientSelectionMode>("all");
  const [selectedUserIds, setSelectedUserIds] = useState<number[]>([]);
  const [selectedContactIds, setSelectedContactIds] = useState<number[]>([]);
  const [manualEmails, setManualEmails] = useState("");
  const [contactSearch, setContactSearch] = useState("");

  const fromEntries = Object.entries(FREEGENY_EMAILS) as [keyof typeof FREEGENY_EMAILS, string][];

  const userRecipientCount = useRecipientCount(
    isUserTarget(target) ? target : "all",
    selectionMode,
    selectedUserIds,
    roleCounts,
    totalUsers
  );

  const recipientCount = useMemo(() => {
    if (target === "manual") {
      return manualEmails
        .split(/[,;\n]+/)
        .map((e) => e.trim())
        .filter((e) => e.includes("@")).length;
    }
    if (target === "contact_form") {
      return selectionMode === "all" ? contactFormTotal : selectedContactIds.length;
    }
    return userRecipientCount;
  }, [target, selectionMode, selectedContactIds, manualEmails, contactFormTotal, userRecipientCount]);

  const filteredContacts = useMemo(() => {
    const q = contactSearch.trim().toLowerCase();
    if (!q) return contacts;
    return contacts.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.email.toLowerCase().includes(q) ||
        (c.subject ?? "").toLowerCase().includes(q)
    );
  }, [contacts, contactSearch]);

  const handleTargetChange = (next: AdminEmailTarget) => {
    setTarget(next);
    setSelectionMode("all");
    setSelectedUserIds([]);
    setSelectedContactIds([]);
    setContactSearch("");
  };

  const toggleContact = (id: number) => {
    setSelectedContactIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const canSend =
    subject.trim().length > 0 &&
    body.trim().length > 0 &&
    recipientCount > 0 &&
    recipientCount <= MAX_BROADCAST &&
    !(target === "contact_form" && selectionMode === "custom" && selectedContactIds.length === 0) &&
    !(isUserTarget(target) && selectionMode === "custom" && selectedUserIds.length === 0);

  const handleSend = async () => {
    if (sending || !canSend) return;
    setSending(true);
    try {
      const res = await sendAdminEmailAction({
        fromKey,
        subject,
        body,
        target,
        selectionMode: isUserTarget(target) || target === "contact_form" ? selectionMode : undefined,
        userIds: isUserTarget(target) && selectionMode === "custom" ? selectedUserIds : undefined,
        contactIds: target === "contact_form" && selectionMode === "custom" ? selectedContactIds : undefined,
        manualEmails: target === "manual" ? manualEmails : undefined,
      });
      if ("error" in res && res.error) {
        toast.error(res.error);
        return;
      }
      const failed = "failed" in res ? res.failed : 0;
      toast.success(
        `${"sent" in res ? res.sent : 0} e-mail(s) envoyé(s)${failed ? ` · ${failed} échec(s)` : ""}`
      );
      setSubject("");
      setBody("");
      setManualEmails("");
      setSelectedUserIds([]);
      setSelectedContactIds([]);
      setSelectionMode("all");
    } catch {
      toast.error("Erreur réseau ou serveur. Réessayez.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm">Boîtes expéditeur</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-2">
            {fromEntries.map(([key, value]) => (
              <span
                key={key}
                className="rounded-lg bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 ring-1 ring-slate-200"
              >
                {key}: {value}
              </span>
            ))}
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Mail className="h-4 w-4 text-orange-500" />
              Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-600">Expéditeur</span>
              <select
                value={fromKey}
                onChange={(e) => setFromKey(e.target.value as keyof typeof FREEGENY_EMAILS)}
                className={adminSelectClass}
              >
                {fromEntries.map(([key, value]) => (
                  <option key={key} value={key}>
                    {key} — {value}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-600">Objet *</span>
              <input value={subject} onChange={(e) => setSubject(e.target.value)} className={adminFieldClass} />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-600">Message *</span>
              <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={10} className={adminTextareaClass} />
            </label>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-4 w-4 text-orange-500" />
              Destinataires
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="mb-2 text-xs font-black uppercase text-slate-500">Cible spéciale</p>
              <div className="flex flex-wrap gap-2">
                {EXTRA_TARGETS.map((t) => {
                  const active = target === t.value;
                  const count = t.value === "contact_form" ? contactFormTotal : 0;
                  return (
                    <button
                      key={t.value}
                      type="button"
                      onClick={() => handleTargetChange(t.value)}
                      className={cn(
                        "rounded-xl border px-3 py-2 text-left transition",
                        active
                          ? "border-violet-500 bg-violet-50 shadow-sm"
                          : "border-slate-200 bg-white hover:border-slate-300"
                      )}
                    >
                      <span className={cn("block text-xs font-black", active ? "text-violet-700" : "text-slate-800")}>
                        {t.label}
                      </span>
                      {t.value === "contact_form" && (
                        <span className="text-[10px] font-bold text-slate-500">{count} contact{count > 1 ? "s" : ""}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {isUserTarget(target) && (
              <AdminUserRecipientPicker
                target={target}
                onTargetChange={(t) => handleTargetChange(t)}
                selectionMode={selectionMode}
                onSelectionModeChange={setSelectionMode}
                selectedIds={selectedUserIds}
                onSelectedIdsChange={setSelectedUserIds}
                roleCounts={roleCounts}
                totalUsers={totalUsers}
                maxBroadcast={MAX_BROADCAST}
              />
            )}

            {target === "contact_form" && (
              <div className="space-y-4">
                <button
                  type="button"
                  onClick={() => handleTargetChange("all")}
                  className="text-xs font-black uppercase text-orange-600 hover:underline"
                >
                  ← Groupes utilisateurs
                </button>
                <p className="text-xs text-slate-500">Messages reçus via le formulaire de contact du site.</p>
                <div className="grid gap-2 sm:grid-cols-2">
                  <button
                    type="button"
                    onClick={() => setSelectionMode("all")}
                    className={cn(
                      "rounded-xl border p-3 text-left text-sm font-black transition",
                      selectionMode === "all" ? "border-slate-900 bg-slate-900 text-white" : "border-slate-200 bg-white"
                    )}
                  >
                    Tous les contacts ({contactFormTotal})
                  </button>
                  <button
                    type="button"
                    onClick={() => setSelectionMode("custom")}
                    className={cn(
                      "rounded-xl border p-3 text-left text-sm font-black transition",
                      selectionMode === "custom" ? "border-orange-500 bg-orange-50" : "border-slate-200 bg-white"
                    )}
                  >
                    Sélection précise ({selectedContactIds.length})
                  </button>
                </div>
                {selectionMode === "custom" && (
                  <div className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
                    <input
                      value={contactSearch}
                      onChange={(e) => setContactSearch(e.target.value)}
                      placeholder="Rechercher un contact…"
                      className={`mb-3 w-full ${adminFieldClass}`}
                    />
                    <ul className="max-h-64 space-y-1 overflow-y-auto rounded-xl border border-slate-200 bg-white">
                      {filteredContacts.map((c) => {
                        const checked = selectedContactIds.includes(c.id);
                        return (
                          <li key={c.id}>
                            <label
                              className={cn(
                                "flex cursor-pointer items-start gap-2 px-3 py-2.5 text-sm hover:bg-orange-50/60",
                                checked && "bg-orange-50"
                              )}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleContact(c.id)}
                                className="mt-1 rounded border-slate-300"
                              />
                              <span>
                                <span className="font-bold text-slate-900">{c.name}</span>
                                <span className="block text-xs text-slate-500">{c.email}</span>
                                {c.subject && (
                                  <span className="block text-[10px] text-slate-400">{c.subject}</span>
                                )}
                              </span>
                              {checked && <Check className="ml-auto h-4 w-4 text-orange-600" />}
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
                <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-3 text-sm">
                  <span className="font-bold text-slate-800">{recipientCount} destinataire{recipientCount > 1 ? "s" : ""}</span>
                  <span className="text-slate-400"> · </span>
                  <span className="text-slate-600">Contacts web</span>
                </div>
              </div>
            )}

            {target === "manual" && (
              <div className="space-y-3">
                <button
                  type="button"
                  onClick={() => handleTargetChange("all")}
                  className="text-xs font-black uppercase text-orange-600 hover:underline"
                >
                  ← Groupes utilisateurs
                </button>
                <label className="block">
                  <span className="mb-1 block text-xs font-black uppercase text-slate-600">
                    Adresses e-mail (virgule ou retour ligne)
                  </span>
                  <textarea
                    value={manualEmails}
                    onChange={(e) => setManualEmails(e.target.value)}
                    rows={5}
                    className={adminTextareaClass}
                    placeholder="parent@example.com&#10;enseignant@example.com"
                  />
                </label>
                <div className="rounded-xl border border-dashed border-orange-200 bg-orange-50/50 px-4 py-3 text-sm">
                  <span className="font-bold text-slate-800">{recipientCount} adresse{recipientCount > 1 ? "s" : ""}</span>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">
          {canSend
            ? `Prêt à envoyer ${recipientCount} e-mail${recipientCount > 1 ? "s" : ""} depuis ${FREEGENY_EMAILS[fromKey]}.`
            : recipientCount > MAX_BROADCAST
              ? `Trop de destinataires (max. ${MAX_BROADCAST}).`
              : "Complétez le message et choisissez des destinataires."}
        </p>
        <button
          type="button"
          disabled={sending || !canSend}
          onClick={() => void handleSend()}
          className="rounded-xl bg-slate-900 px-6 py-2.5 text-xs font-black uppercase text-white hover:bg-orange-600 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
        >
          {sending ? "Envoi en cours…" : `Envoyer · ${recipientCount}`}
        </button>
      </div>
    </div>
  );
}

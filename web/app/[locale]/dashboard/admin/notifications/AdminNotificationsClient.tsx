"use client";

import React, { useState } from "react";
import { sendAdminNotificationAction } from "@/lib/actions/admin_modules";
import type { AdminNotificationTarget } from "@/lib/admin/mailing.server";
import { adminFieldClass, adminTextareaClass } from "@/components/admin/adminFormStyles";
import {
  AdminUserRecipientPicker,
  useRecipientCount,
  type RecipientSelectionMode,
} from "@/components/admin/AdminUserRecipientPicker";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Bell, ChevronRight } from "lucide-react";

const MAX_BROADCAST = 500;

export default function AdminNotificationsClient({
  pushCount,
  pendingContacts,
  roleCounts,
  totalUsers,
}: {
  pushCount: number;
  pendingContacts: number;
  roleCounts: Record<string, number>;
  totalUsers: number;
}) {
  const [sending, setSending] = useState(false);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [link, setLink] = useState("/dashboard/parent");
  const [sendPush, setSendPush] = useState(true);

  const [target, setTarget] = useState<AdminNotificationTarget>("all");
  const [selectionMode, setSelectionMode] = useState<RecipientSelectionMode>("all");
  const [selectedIds, setSelectedIds] = useState<number[]>([]);

  const recipientCount = useRecipientCount(target, selectionMode, selectedIds, roleCounts, totalUsers);

  const canSend =
    title.trim().length > 0 &&
    content.trim().length > 0 &&
    recipientCount > 0 &&
    recipientCount <= MAX_BROADCAST &&
    !(selectionMode === "custom" && selectedIds.length === 0);

  const handleSend = async () => {
    if (sending || !canSend) return;
    setSending(true);
    try {
      const res = await sendAdminNotificationAction({
        title,
        content,
        link,
        target,
        sendPush,
        selectionMode,
        userIds: selectionMode === "custom" ? selectedIds : undefined,
      });
      if ("error" in res && res.error) {
        toast.error(res.error);
        return;
      }
      toast.success(`Notification envoyée à ${"sent" in res ? res.sent : 0} utilisateur(s)`);
      setTitle("");
      setContent("");
      setSelectedIds([]);
      setSelectionMode("all");
    } catch {
      toast.error("Erreur réseau ou serveur. Réessayez.");
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase text-slate-500">Abonnements push</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-slate-900">{pushCount}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle className="text-sm uppercase text-slate-500">Contacts en attente</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-black text-slate-900">{pendingContacts}</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-4 w-4 text-orange-500" />
              Message
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-600">Titre *</span>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className={adminFieldClass}
                placeholder="Ex. Maintenance prévue"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-600">Message *</span>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={5}
                className={adminTextareaClass}
                placeholder="Contenu de la notification…"
              />
            </label>
            <label className="block">
              <span className="mb-1 block text-xs font-black uppercase text-slate-600">Lien (optionnel)</span>
              <input
                value={link}
                onChange={(e) => setLink(e.target.value)}
                className={adminFieldClass}
                placeholder="/dashboard/parent"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-bold text-slate-700">
              <input
                type="checkbox"
                checked={sendPush}
                onChange={(e) => setSendPush(e.target.checked)}
                className="rounded border-slate-300"
              />
              Envoyer aussi une notification push
            </label>
          </CardContent>
        </Card>

        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>Destinataires</CardTitle>
          </CardHeader>
          <CardContent>
            <AdminUserRecipientPicker
              target={target}
              onTargetChange={setTarget}
              selectionMode={selectionMode}
              onSelectionModeChange={setSelectionMode}
              selectedIds={selectedIds}
              onSelectedIdsChange={setSelectedIds}
              roleCounts={roleCounts}
              totalUsers={totalUsers}
              maxBroadcast={MAX_BROADCAST}
            />
            {sendPush && (
              <p className="mt-3 text-xs text-slate-500">
                <ChevronRight className="mr-1 inline h-3 w-3 text-orange-500" />
                Push envoyé aux appareils abonnés
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <p className="text-sm text-slate-600">
          {canSend
            ? `Prêt à envoyer à ${recipientCount} personne${recipientCount > 1 ? "s" : ""}.`
            : recipientCount > MAX_BROADCAST
              ? `Trop de destinataires (max. ${MAX_BROADCAST} par envoi).`
              : selectionMode === "custom" && selectedIds.length === 0
                ? "Sélectionnez au moins une personne ou choisissez « Tout le groupe »."
                : "Remplissez le titre et le message pour continuer."}
        </p>
        <button
          type="button"
          disabled={sending || !canSend}
          onClick={() => void handleSend()}
          className="rounded-xl bg-orange-600 px-6 py-2.5 text-xs font-black uppercase text-white hover:bg-orange-700 disabled:cursor-not-allowed disabled:opacity-50 active:scale-[0.98]"
        >
          {sending ? "Envoi en cours…" : `Envoyer · ${recipientCount}`}
        </button>
      </div>

      <details className="rounded-2xl border border-slate-200 bg-white p-4">
        <summary className="cursor-pointer text-sm font-black text-slate-700">Outils techniques (scripts serveur)</summary>
        <div className="mt-3 space-y-2 text-sm text-slate-600">
          <p>
            <code className="rounded bg-slate-100 px-1">npm run digest:teacher-weekly</code> — digest hebdo automatique
          </p>
          <p>
            <code className="rounded bg-slate-100 px-1">npm run email:test</code> — test SMTP
          </p>
          <p>
            <code className="rounded bg-slate-100 px-1">npm run push:keys</code> — clés VAPID
          </p>
        </div>
      </details>
    </div>
  );
}

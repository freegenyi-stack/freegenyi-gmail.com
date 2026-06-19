import React from "react";
import { countContactFormRecipients, listAdminContactOptions } from "@/lib/admin/mailing.server";
import { getExtendedStats } from "@/lib/admin/modules.server";
import { getAdminDashboardStats } from "@/lib/admin/stats.server";
import AdminEmailsClient from "./AdminEmailsClient";

export default async function AdminEmailsPage() {
  const [contacts, stats, dash, contactFormTotal] = await Promise.all([
    listAdminContactOptions(),
    getExtendedStats(),
    getAdminDashboardStats(),
    countContactFormRecipients(),
  ]);

  return (
    <div className="mx-auto max-w-6xl space-y-6">
      <div>
        <h1 className="text-3xl font-black text-slate-900">E-mails</h1>
        <p className="text-sm text-slate-500">
          Choisissez une boîte, rédigez et ciblez un groupe entier ou des personnes précises
        </p>
      </div>
      <AdminEmailsClient
        contacts={contacts}
        roleCounts={stats.roles}
        totalUsers={dash.usersTotal}
        contactFormTotal={contactFormTotal}
      />
    </div>
  );
}

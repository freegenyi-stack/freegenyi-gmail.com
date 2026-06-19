import React from "react";
import { requireAdminPage } from "@/lib/admin/requireAdmin";
import AdminShell from "@/components/admin/AdminShell";

export default async function AdminDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { email } = await requireAdminPage(locale);

  return <AdminShell adminEmail={email}>{children}</AdminShell>;
}

import React from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getVerificationForUser } from "@/lib/actions/org_verification";
import { parseMetadata } from "@/lib/teacher/profile.server";
import TeacherShell from "@/components/teacher/TeacherShell";
import type { TeacherVerificationInfo } from "@/components/teacher/TeacherVerificationBanner";

export default async function TeacherDashboardLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  let verification: TeacherVerificationInfo | null = null;

  if (user?.role === "enseignant") {
    const row = await getVerificationForUser(user.id);
    const meta = parseMetadata(user.metadata);
    const status = (row?.status ?? meta.verificationStatus ?? "pending") as TeacherVerificationInfo["status"];
    verification = {
      status,
      trackingCode: row?.trackingCode ?? (meta.trackingCode as string) ?? null,
      rejectionReason: row?.rejectionReason ?? null,
    };
  }

  return <TeacherShell verification={verification}>{children}</TeacherShell>;
}

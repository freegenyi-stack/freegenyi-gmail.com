import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, children as childrenTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import RegisterWizard from "@/components/register/RegisterWizard";
import {
  isUserFullyOnboarded,
  resolveDashboardSegment,
} from "@/lib/auth/dashboard-route";
import { isRegisterRoleHidden } from "@/constants/publicNav";
import { isAdminEmail } from "@/lib/admin/requireAdmin";

export default async function OnboardingServerPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string }>;
}) {
  const { locale } = await params;
  const { type: typeParam } = await searchParams;
  const session = await auth();

  // Redirection stricte si non connecté
  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  if (isAdminEmail(session.user.email)) {
    redirect(`/${locale}/dashboard/admin`);
  }

  // Interroger la base de données EN TEMPS RÉEL pour contourner les jetons obsolètes
  const [user] = await db
    .select({ id: users.id, onboardingStep: users.onboardingStep, role: users.role })
    .from(users)
    .where(eq(users.email, session.user.email));

  let hasChildren = false;
  if (user) {
    const childrenCount = await db
      .select({ id: childrenTable.id })
      .from(childrenTable)
      .where(eq(childrenTable.parentId, user.id));
    hasChildren = childrenCount.length > 0;
  }

  const isTeacherFlow = typeParam === "enseignant" || user?.role === "enseignant";

  // Écoles / ONG masqués → repasser en parent et wizard (phase 2 plus tard)
  if (user && isRegisterRoleHidden(user.role ?? "")) {
    await db
      .update(users)
      .set({ role: "parent", onboardingStep: 1, metadata: null, updatedAt: new Date() })
      .where(eq(users.id, user.id));
  } else if (user && isUserFullyOnboarded(user.role, user.onboardingStep)) {
    redirect(`/${locale}/dashboard/${resolveDashboardSegment(user.role)}`);
  }

  return (
    <RegisterWizard
      locale={locale}
      mode="google"
      initialRole={isTeacherFlow ? "enseignant" : "parent"}
    />
  );
}

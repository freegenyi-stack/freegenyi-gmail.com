import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, children as childrenTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import ClientOnboarding from "./ClientOnboarding";

export default async function OnboardingServerPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  // Redirection stricte si non connecté
  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
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

  // Redirection intelligente selon le rôle
  // Si onboarding_step >= 4 : profil validé, on redirige vers le bon cockpit
  if (user && user.onboardingStep! >= 4) {
    const userRole = user.role || 'parent';
    const dashRoute = userRole === 'ecole' ? 'ecole' : userRole === 'ong' ? 'ong' : 'parent';
    redirect(`/${locale}/dashboard/${dashRoute}`);
  }

  return <ClientOnboarding locale={locale} />;
}

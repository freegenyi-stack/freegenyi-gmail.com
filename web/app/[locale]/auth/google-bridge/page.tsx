import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  isUserFullyOnboarded,
  resolveDashboardSegment,
} from "@/lib/auth/dashboard-route";
import { isRegisterRoleHidden } from "@/constants/publicNav";
import { isAdminEmail } from "@/lib/admin/requireAdmin";

/**
 * Point d'atterrissage après OAuth Google (login ou inscription).
 * Compte déjà complet → dashboard du bon rôle, jamais re-onboarding.
 */
export default async function GoogleBridgePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ type?: string; from?: string }>;
}) {
  const { locale } = await params;
  const { type: typeParam, from: fromParam } = await searchParams;
  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  if (isAdminEmail(session.user.email)) {
    redirect(`/${locale}/dashboard/admin`);
  }

  const fromRegister = fromParam === "register";
  const isTeacherIntent = typeParam === "enseignant";
  const registerRole = isTeacherIntent ? "enseignant" : "parent";

  const redirectToRegisterGoogle = () => {
    redirect(`/${locale}/auth/register?google=1&type=${registerRole}`);
  };

  const [user] = await db
    .select({
      role: users.role,
      onboardingStep: users.onboardingStep,
    })
    .from(users)
    .where(eq(users.email, session.user.email.toLowerCase()))
    .limit(1);

  if (!user) {
    if (fromRegister) {
      redirectToRegisterGoogle();
    }
    const onboardingType = isTeacherIntent ? "?type=enseignant" : "";
    redirect(`/${locale}/dashboard/onboarding${onboardingType}`);
  }

  // Écoles / ONG masqués — ne pas envoyer vers leur dashboard (phase 2)
  if (isRegisterRoleHidden(user.role ?? "")) {
    if (fromRegister) {
      redirectToRegisterGoogle();
    }
    redirect(`/${locale}/dashboard/onboarding?type=parent`);
  }

  if (isUserFullyOnboarded(user.role, user.onboardingStep)) {
    const segment = resolveDashboardSegment(user.role);
    redirect(`/${locale}/dashboard/${segment}`);
  }

  if (fromRegister) {
    redirectToRegisterGoogle();
  }

  const isTeacher = isTeacherIntent || user.role === "enseignant";
  const onboardingType = isTeacher ? "?type=enseignant" : "";
  redirect(`/${locale}/dashboard/onboarding${onboardingType}`);
}

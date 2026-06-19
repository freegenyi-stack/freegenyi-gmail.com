import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren, isAdultProfileComplete } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import ProfileCompleteBanner from "@/components/family/ProfileCompleteBanner";
import PedagogyWallClient from "@/components/pedagogy/PedagogyWallClient";

export default async function ParentMurPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user || user.onboardingStep! < 4) {
    redirect(`/${locale}/dashboard/onboarding`);
  }
  if (!isFamilyAdult(user.role)) {
    redirect(`/${locale}/dashboard/parent`);
  }

  const childrenData = await getFamilyChildren(user);
  const childLevels = [
    ...new Set(childrenData.map((c) => c.educationLevel).filter((l): l is string => !!l)),
  ];

  const profileComplete = await isAdultProfileComplete(user.id, user.role);

  return (
    <div>
      <ProfileCompleteBanner locale={locale} role={user.role || "parent"} complete={profileComplete} />
      <PedagogyWallClient role="parent" childLevels={childLevels} />
    </div>
  );
}

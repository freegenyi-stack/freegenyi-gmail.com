import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import AllyOnboardingWizard from "@/components/family/AllyOnboardingWizard";
import { getInvitationByToken } from "@/lib/family/server";

export default async function InviteAcceptPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ token?: string }>;
}) {
  const { locale } = await params;
  const { token } = await searchParams;

  if (!token) {
    redirect(`/${locale}/auth/login`);
  }

  const inv = await getInvitationByToken(token);
  if (!inv || !inv.familyId) {
    redirect(`/${locale}/auth/login?error=invalid_invite`);
  }

  if (inv.expiresAt && new Date(inv.expiresAt) < new Date()) {
    redirect(`/${locale}/auth/login?error=expired_invite`);
  }

  const [inviter] = await db
    .select({ fullName: users.fullName })
    .from(users)
    .where(eq(users.id, inv.parentId))
    .limit(1);

  const session = await auth();
  if (session?.user?.email) {
    const [user] = await db
      .select({ role: users.role, familyId: users.familyId })
      .from(users)
      .where(eq(users.email, session.user.email.toLowerCase()))
      .limit(1);

    if (
      user?.role === "coparent" &&
      user.familyId === inv.familyId &&
      session.user.email.toLowerCase() === inv.invitedEmail.toLowerCase()
    ) {
      redirect(`/${locale}/dashboard/parent`);
    }
  }

  return (
    <Suspense fallback={<div className="flex min-h-[50vh] items-center justify-center text-neutral-400">…</div>}>
      <AllyOnboardingWizard
        locale={locale}
        token={token}
        invitedEmail={inv.invitedEmail}
        inviterName={inviter?.fullName || "Un parent"}
      />
    </Suspense>
  );
}

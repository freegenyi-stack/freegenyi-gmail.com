import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdultProfileComplete } from "@/lib/family/server";
import { getTranslations } from "next-intl/server";
import ParentShell, { ParentPageHeader } from "@/components/parent/ParentShell";
import CompleteProfileClient from "./CompleteProfileClient";

export default async function CompleteProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/auth/login`);

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.role !== "coparent") redirect(`/${locale}/dashboard/parent`);

  const complete = await isAdultProfileComplete(userId, user.role);
  if (complete) redirect(`/${locale}/dashboard/parent`);

  const t = await getTranslations("CompleteProfile");

  return (
    <ParentShell>
      <div className="mx-auto max-w-lg">
        <ParentPageHeader badge={t("badge")} title={t("title")} subtitle={t("subtitle")} premium />
        <CompleteProfileClient locale={locale} />
      </div>
    </ParentShell>
  );
}

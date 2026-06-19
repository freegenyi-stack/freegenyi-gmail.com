import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { getTranslations } from "next-intl/server";
import ChildrenClient from "./ChildrenClient";
import ParentShell, { ParentPageHeader } from "@/components/parent/ParentShell";
import { isFamilyAdult } from "@/lib/family/constants";

export default async function ChildrenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`);
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  const { getFamilyChildren } = await import("@/lib/family/server");
  const childrenData = await getFamilyChildren(user);
  const isParentContext = isFamilyAdult(user.role);
  const t = isParentContext ? await getTranslations("Children") : null;

  const client = (
    <ChildrenClient
      initialChildren={childrenData}
      locale={locale}
      userName={user.fullName || "Parent"}
      country={locale.includes("-") ? locale.split("-")[0] : "DZ"}
      variant={isParentContext ? "parent" : "default"}
    />
  );

  if (isParentContext && t) {
    return (
      <ParentShell>
        <ParentPageHeader title={t("title")} subtitle={t("subtitle")} badge={t("badge")} premium />
        {client}
      </ParentShell>
    );
  }

  return (
    <div className="min-h-full bg-slate-50 pb-24 font-dm-sans">
      <div className="mx-auto max-w-7xl px-6 py-12 md:px-12">{client}</div>
    </div>
  );
}

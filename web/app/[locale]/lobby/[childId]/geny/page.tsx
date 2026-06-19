import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { childDevicePairings, children as childrenTable, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { userCanAccessChild } from "@/lib/family/server";
import { getChildSessionFromCookies } from "@/lib/child-session";
import { getPendingWorksheetsForChild } from "@/lib/parent/parent-worksheets.server";
import LobbyGenyClient from "./LobbyGenyClient";

export default async function LobbyGenyPage({
  params,
}: {
  params: Promise<{ locale: string; childId: string }>;
}) {
  const { locale, childId: childIdStr } = await params;
  const childId = parseInt(childIdStr, 10);
  if (Number.isNaN(childId)) notFound();

  const child = await db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.id, childId))
    .then((r) => r[0]);
  if (!child) notFound();

  let allowed = false;
  const session = await auth();
  if (session?.user?.email) {
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (user) allowed = await userCanAccessChild(user, child);
  } else {
    const childSession = await getChildSessionFromCookies();
    if (childSession?.childId === childId) {
      const [pairing] = await db
        .select()
        .from(childDevicePairings)
        .where(
          and(
            eq(childDevicePairings.childId, childId),
            eq(childDevicePairings.deviceToken, childSession.deviceToken)
          )
        )
        .limit(1);
      allowed = !!pairing;
    }
  }

  if (!allowed) redirect(`/${locale}/child`);

  const worksheets = await getPendingWorksheetsForChild(childId);
  const isRTL = locale.startsWith("ar");

  return (
    <div className="min-h-screen bg-[#020617] font-dm-sans">
      <LobbyGenyClient childId={childId} locale={locale} worksheets={worksheets} isRTL={isRTL} />
    </div>
  );
}

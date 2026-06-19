import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { childDevicePairings, children as childrenTable, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { userCanAccessChild } from "@/lib/family/server";
import { getChildSessionFromCookies } from "@/lib/child-session";
import { listChildAtelierMissions } from "@/lib/child/gamification.server";
import ChildMissionsClient from "@/components/child/ChildMissionsClient";

async function requireChildAccess(locale: string, childId: number) {
  const session = await auth();
  const childSession = await getChildSessionFromCookies();

  const child = await db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.id, childId))
    .then((res) => res[0]);

  if (!child) notFound();

  let allowed = false;
  if (session?.user?.email) {
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (user) allowed = await userCanAccessChild(user, child);
  } else if (childSession?.childId === childId) {
    const [pairing] = await db
      .select()
      .from(childDevicePairings)
      .where(and(eq(childDevicePairings.childId, childId), eq(childDevicePairings.deviceToken, childSession.deviceToken)))
      .limit(1);
    allowed = !!pairing;
  }

  if (!allowed) redirect(`/${locale}/child`);
  return child;
}

export default async function ChildMissionsPage({
  params,
}: {
  params: Promise<{ locale: string; childId: string }>;
}) {
  const { locale, childId: childIdRaw } = await params;
  const childId = parseInt(childIdRaw, 10);
  if (Number.isNaN(childId)) notFound();

  await requireChildAccess(locale, childId);
  const missions = await listChildAtelierMissions(childId);

  return <ChildMissionsClient childId={childId} missions={missions} />;
}

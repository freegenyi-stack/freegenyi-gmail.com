import React from "react";
import { db } from "@/db";
import { children as childrenTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { users } from "@/db/schema";
import LobbyClient from "./LobbyClient";
import { userCanAccessChild } from "@/lib/family/server";
import { getChildSessionFromCookies } from "@/lib/child-session";
import { childDevicePairings } from "@/db/schema";
import { and } from "drizzle-orm";

export default async function ChildLobbyPage({
  params,
}: {
  params: Promise<{ locale: string; childId: string }>;
}) {
  const { locale, childId } = await params;
  const session = await auth();
  const childSession = await getChildSessionFromCookies();
  const parsedChildId = parseInt(childId, 10);

  const child = await db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.id, parsedChildId))
    .then((res) => res[0]);

  if (!child) {
    notFound();
  }

  let allowed = false;

  if (session?.user?.email) {
    const [user] = await db
      .select()
      .from(users)
      .where(eq(users.email, session.user.email))
      .limit(1);
    if (user) {
      allowed = await userCanAccessChild(user, child);
    }
  } else if (childSession?.childId === parsedChildId) {
    const [pairing] = await db
      .select()
      .from(childDevicePairings)
      .where(
        and(
          eq(childDevicePairings.childId, parsedChildId),
          eq(childDevicePairings.deviceToken, childSession.deviceToken)
        )
      )
      .limit(1);
    allowed = !!pairing;
  }

  if (!allowed) {
    redirect(`/${locale}/child`);
  }

  const stats = {
    xp: 1250,
    level: 5,
    progress: 66,
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-dm-sans">
      <LobbyClient child={child} locale={locale} stats={stats} isChildMode={!session?.user} />
    </div>
  );
}

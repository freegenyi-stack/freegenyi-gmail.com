import React from "react";
import { db } from "@/db";
import { children as childrenTable } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import LobbyClient from "./LobbyClient";

export default async function ChildLobbyPage({
  params,
}: {
  params: Promise<{ locale: string; childId: string }>;
}) {
  const { locale, childId } = await params;
  const session = await auth();

  // Basic security: Must be logged in as parent to access lobby (or child if we implement separate login later)
  if (!session?.user) {
    redirect(`/${locale}/auth/login`);
  }

  const child = await db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.id, parseInt(childId)))
    .then(res => res[0]);

  if (!child) {
    notFound();
  }

  // XP and Stats (Mocked for now as in PHP)
  const stats = {
    xp: 1250,
    level: 5,
    progress: 66,
  };

  return (
    <div className="min-h-screen bg-[#020617] text-white overflow-hidden relative font-dm-sans">
      <LobbyClient 
        child={child} 
        locale={locale} 
        stats={stats}
      />
    </div>
  );
}

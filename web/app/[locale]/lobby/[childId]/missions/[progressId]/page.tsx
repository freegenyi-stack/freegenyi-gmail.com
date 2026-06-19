import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { childDevicePairings, children as childrenTable, users } from "@/db/schema";
import { and, eq } from "drizzle-orm";
import { userCanAccessChild } from "@/lib/family/server";
import { getChildSessionFromCookies } from "@/lib/child-session";
import { getChildMissionResource } from "@/lib/child/gamification.server";
import { isActivityKind } from "@/lib/authoring/types";
import { buildSchoolHeader } from "@/lib/authoring/document-header";
import type { AuthoringUser } from "@/lib/authoring/session";
import ChildMissionPlayer from "@/components/child/ChildMissionPlayer";
import ChildMissionDocumentPlayer from "@/components/child/ChildMissionDocumentPlayer";

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
}

async function headerForResource(ownerUserId: number) {
  const [teacher] = await db
    .select({ id: users.id, email: users.email, fullName: users.fullName, role: users.role, metadata: users.metadata })
    .from(users)
    .where(eq(users.id, ownerUserId))
    .limit(1);

  if (!teacher) {
    return { schoolName: "", teacherName: "", subjects: [], levels: [], schoolYear: "" };
  }

  let metadata: Record<string, unknown> = {};
  try {
    metadata = teacher.metadata ? (JSON.parse(teacher.metadata) as Record<string, unknown>) : {};
  } catch {
    metadata = {};
  }

  const authoringUser: AuthoringUser = {
    id: teacher.id,
    email: teacher.email,
    fullName: teacher.fullName,
    role: "enseignant",
    metadata,
  };

  return buildSchoolHeader(authoringUser);
}

export default async function ChildMissionPlayPage({
  params,
}: {
  params: Promise<{ locale: string; childId: string; progressId: string }>;
}) {
  const { locale, childId: childIdRaw, progressId: progressIdRaw } = await params;
  const childId = parseInt(childIdRaw, 10);
  const progressId = parseInt(progressIdRaw, 10);
  if (Number.isNaN(childId) || Number.isNaN(progressId)) notFound();

  await requireChildAccess(locale, childId);

  const mission = await getChildMissionResource(progressId, childId);
  if (!mission) notFound();

  if (isActivityKind(mission.resource.kind)) {
    return (
      <div className="min-h-screen bg-[#020617] p-4 text-white">
        <ChildMissionPlayer childId={childId} progressId={progressId} resource={mission.resource} locale={locale} />
      </div>
    );
  }

  if (mission.resource.kind === "document") {
    const header = await headerForResource(mission.resource.ownerUserId);
    return (
      <div className="min-h-screen bg-[#020617] p-4 text-white">
        <ChildMissionDocumentPlayer
          childId={childId}
          progressId={progressId}
          resource={mission.resource}
          header={header}
        />
      </div>
    );
  }

  notFound();
}

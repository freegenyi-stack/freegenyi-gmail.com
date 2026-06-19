import React, { Suspense } from "react";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren } from "@/lib/family/server";
import { requireAuthoringUser } from "@/lib/authoring/session";
import { listAuthoringResources } from "@/lib/authoring/resources.server";
import { listFamilyAuthoringAssignments } from "@/lib/authoring/assignments.server";
import { listAuthoringFolders } from "@/lib/authoring/folders.server";
import ParentAtelierUnifiedClient, { type ParentAtelierTab } from "@/components/parent/ParentAtelierUnifiedClient";
import { getSelectedChildId } from "@/lib/parent/selected-child";

function resolveTab(
  raw: string | undefined,
  hasCreate: boolean,
  hasAssignmentHighlight: boolean
): ParentAtelierTab {
  if (hasAssignmentHighlight && !raw) return "missions";
  if (raw === "missions") return "missions";
  if (raw === "create" && hasCreate) return "create";
  if (raw === "geny" || raw === "printables" || raw === "exercices") return "geny";
  return "geny";
}

export default async function ParentAtelierPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ assignment?: string; tab?: string }>;
}) {
  const { locale } = await params;
  const { assignment: assignmentRaw, tab: tabRaw } = await searchParams;
  const highlightAssignmentId = assignmentRaw ? parseInt(assignmentRaw, 10) : null;

  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) redirect(`/${locale}/auth/login`);

  const authoringUser = await requireAuthoringUser();
  const children = await getFamilyChildren(user);
  const childIds = children.map((c) => c.id);
  const selectedChildId = await getSelectedChildId(childIds);

  const [assignments, resources, folders] = await Promise.all([
    listFamilyAuthoringAssignments(childIds),
    authoringUser ? listAuthoringResources(authoringUser.id, "parent") : Promise.resolve([]),
    authoringUser ? listAuthoringFolders(authoringUser.id, "parent") : Promise.resolve([]),
  ]);

  const showCreateTab = !!authoringUser;
  const initialTab = resolveTab(
    tabRaw,
    showCreateTab,
    !!(highlightAssignmentId && !Number.isNaN(highlightAssignmentId))
  );

  return (
    <Suspense fallback={<div className="min-h-[40vh] animate-pulse rounded-3xl bg-orange-50" />}>
      <ParentAtelierUnifiedClient
        children={children.map((c) => ({
          id: c.id,
          fullName: c.fullName,
          educationLevel: c.educationLevel,
        }))}
        selectedChildId={selectedChildId}
        assignments={assignments}
        highlightAssignmentId={
          highlightAssignmentId && !Number.isNaN(highlightAssignmentId) ? highlightAssignmentId : null
        }
        resources={resources}
        folders={folders}
        showCreateTab={showCreateTab}
        initialTab={initialTab}
      />
    </Suspense>
  );
}

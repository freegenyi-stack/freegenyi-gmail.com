import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren } from "@/lib/family/server";
import { resolveFamilyProgressForAssignment, resolveFamilyProgressForResource } from "@/lib/authoring/assignments.server";
import { getAuthoringResource, getAuthoringResourceForFamily } from "@/lib/authoring/resources.server";
import { requireAuthoringUser } from "@/lib/authoring/session";
import { isActivityKind } from "@/lib/authoring/types";
import AtelierActivityClient from "@/components/atelier/AtelierActivityClient";
import ParentAtelierFocusFrame from "@/components/parent/ParentAtelierFocusFrame";

export const dynamic = "force-dynamic";

export default async function ParentAtelierActivitePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; id: string }>;
  searchParams: Promise<{ assignment?: string }>;
}) {
  const { locale, id } = await params;
  const { assignment: assignmentParam } = await searchParams;
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) redirect(`/${locale}/auth/login`);

  const resourceId = parseInt(id, 10);
  if (Number.isNaN(resourceId)) notFound();

  const authoringUser = await requireAuthoringUser();
  let resource = authoringUser ? await getAuthoringResource(resourceId, authoringUser.id, "parent") : null;
  let readOnly = false;

  if (!resource) {
    const children = await getFamilyChildren(user);
    const childIds = children.map((c) => c.id);
    resource = await getAuthoringResourceForFamily(resourceId, childIds);
    readOnly = true;
  }

  if (!resource || !isActivityKind(resource.kind)) notFound();

  let progressId: number | null = null;
  if (readOnly) {
    const children = await getFamilyChildren(user);
    const childIds = children.map((c) => c.id);
    const assignmentId = assignmentParam ? parseInt(assignmentParam, 10) : null;
    if (assignmentId != null && !Number.isNaN(assignmentId)) {
      progressId = await resolveFamilyProgressForResource({
        childIds,
        resourceId,
        assignmentId,
      });
    } else {
      progressId = await resolveFamilyProgressForResource({ childIds, resourceId });
    }
  }

  return (
    <ParentAtelierFocusFrame>
      <AtelierActivityClient
        resource={resource}
        backHref="/dashboard/parent/atelier"
        readOnly={readOnly}
        progressId={progressId}
      />
    </ParentAtelierFocusFrame>
  );
}

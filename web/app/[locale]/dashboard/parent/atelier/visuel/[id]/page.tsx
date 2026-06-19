import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren } from "@/lib/family/server";
import { getAuthoringResource, getAuthoringResourceForFamily } from "@/lib/authoring/resources.server";
import { resolveFamilyProgressForResource } from "@/lib/authoring/assignments.server";
import { requireAuthoringUser } from "@/lib/authoring/session";
import AtelierVisualClient from "@/components/atelier/AtelierVisualClient";

export default async function ParentAtelierVisualPage({
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

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
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

  if (!resource || resource.kind !== "visual") notFound();

  if (readOnly) {
    const children = await getFamilyChildren(user);
    const childIds = children.map((c) => c.id);
    const assignmentId = assignmentParam ? parseInt(assignmentParam, 10) : null;
    await resolveFamilyProgressForResource({
      childIds,
      resourceId,
      assignmentId: assignmentId != null && !Number.isNaN(assignmentId) ? assignmentId : null,
    });
  }

  return (
    <AtelierVisualClient
      resource={resource}
      backHref="/dashboard/parent/atelier"
      readOnly={readOnly}
      showActions={!readOnly}
    />
  );
}

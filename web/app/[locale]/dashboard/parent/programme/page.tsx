import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildProgramHub } from "@/lib/curriculum/hub.server";
import ProgrammeHubClient from "@/components/curriculum/ProgrammeHubClient";
import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren, userCanAccessChild } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { normalizeChildLevel } from "@/lib/curriculum/progress.server";

export default async function ParentProgrammePage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string }>;
  searchParams: Promise<{ child?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) redirect("/dashboard");

  const sp = await searchParams;
  const childId = sp.child ? parseInt(sp.child, 10) : null;
  let level = "1AP" as const;

  if (childId) {
    const [child] = await db.select().from(children).where(eq(children.id, childId)).limit(1);
    if (child && (await userCanAccessChild(user, child))) {
      level = normalizeChildLevel(child.educationLevel);
    }
  }

  const hub = await buildProgramHub("DZ", level);
  if (!hub) redirect("/dashboard/parent");

  const { locale } = await params;

  return (
    <ProgrammeHubClient
      hub={hub}
      mode="parent"
      basePath={`/${locale}/dashboard/parent/programme`}
    />
  );
}

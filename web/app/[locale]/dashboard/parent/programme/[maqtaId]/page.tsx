import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildProgramSectionDetail } from "@/lib/curriculum/hub.server";
import ProgrammeSectionClient from "@/components/curriculum/ProgrammeSectionClient";
import type { CurriculumSubject } from "@/lib/curriculum/types";
import { normalizeChildLevel } from "@/lib/curriculum/progress.server";
import { db } from "@/db";
import { children, users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { userCanAccessChild, getFamilyChildren } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";

export default async function ParentProgrammeSectionPage({
  params,
  searchParams,
}: {
  params: Promise<{ locale: string; maqtaId: string }>;
  searchParams: Promise<{ subject?: string; child?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) redirect("/dashboard");

  const { locale, maqtaId } = await params;
  const sp = await searchParams;
  const subject = (sp.subject ?? "ar_islam_civique") as CurriculumSubject;
  let level = "1AP" as const;
  let selectedChildId: number | null = sp.child ? parseInt(sp.child, 10) : null;

  const familyChildren = await getFamilyChildren(user);
  const childOptions = familyChildren.map((c) => ({ id: c.id, fullName: c.fullName }));

  if (selectedChildId) {
    const [child] = await db.select().from(children).where(eq(children.id, selectedChildId)).limit(1);
    if (child && (await userCanAccessChild(user, child))) {
      level = normalizeChildLevel(child.educationLevel);
    } else {
      selectedChildId = null;
    }
  }

  const detail = await buildProgramSectionDetail("DZ", level, subject, maqtaId);
  if (!detail) redirect(`/${locale}/dashboard/parent/programme`);

  return (
    <ProgrammeSectionClient
      detail={detail}
      mode="parent"
      backHref={`/${locale}/dashboard/parent/programme${selectedChildId ? `?child=${selectedChildId}` : ""}`}
      subject={subject}
      children={childOptions}
      selectedChildId={selectedChildId ?? childOptions[0]?.id ?? null}
    />
  );
}

import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdminEmail } from "@/lib/admin/requireAdmin";
import { getFamilyChildren, isAdultProfileComplete } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { getSelectedChildId } from "@/lib/parent/selected-child";

export async function requireParentPage(locale: string) {
  const session = await auth();
  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);

  if (!user || user.onboardingStep! < 4) {
    redirect(`/${locale}/dashboard/onboarding`);
  }

  if (isAdminEmail(session.user.email)) {
    redirect(`/${locale}/dashboard/admin`);
  }

  if (!isFamilyAdult(user.role)) {
    redirect(`/${locale}/dashboard/${user.role === "enseignant" ? "enseignant" : "parent"}`);
  }

  const childrenData = await getFamilyChildren(user);
  const childIds = childrenData.map((c) => c.id);
  const selectedChildId = await getSelectedChildId(childIds);
  const profileComplete = await isAdultProfileComplete(user.id, user.role);

  let partner: { id: number; fullName: string | null; lastLoginAt: Date | null } | null = null;
  if (user.familyId) {
    const members = await db
      .select({ id: users.id, fullName: users.fullName, lastLoginAt: users.lastLoginAt })
      .from(users)
      .where(eq(users.familyId, user.familyId));
    partner = members.find((m) => m.id !== user.id) ?? null;
  }

  return {
    user: {
      id: user.id,
      fullName: user.fullName || session.user.name || "",
      email: user.email,
      role: user.role,
      familyId: user.familyId,
      metadata: user.metadata,
    },
    children: childrenData,
    selectedChildId,
    profileComplete,
    partner,
  };
}

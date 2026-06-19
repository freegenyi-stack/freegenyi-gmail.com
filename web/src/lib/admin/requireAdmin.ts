import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { Session } from "next-auth";
import { getImpersonationCookies } from "@/lib/admin/impersonate";

export function isAdminEmail(email: string): boolean {
  const admins = (process.env.FREEGENY_ADMIN_EMAILS || "")
    .split(",")
    .map((e) => e.trim().toLowerCase())
    .filter(Boolean);
  return admins.length > 0 && admins.includes(email.toLowerCase());
}

async function resolveAdminEmail(session: Session | null): Promise<string | null> {
  if (!session?.user?.email) return null;
  if (isAdminEmail(session.user.email)) return session.user.email;

  const imp = (session.user as { impersonating?: boolean; realAdminId?: number }).realAdminId;
  if (imp) {
    const [admin] = await db.select({ email: users.email }).from(users).where(eq(users.id, imp)).limit(1);
    if (admin?.email && isAdminEmail(admin.email)) return admin.email;
  }

  const cookies = await getImpersonationCookies();
  if (cookies) {
    const [admin] = await db
      .select({ email: users.email })
      .from(users)
      .where(eq(users.id, cookies.adminUserId))
      .limit(1);
    if (admin?.email && isAdminEmail(admin.email)) return admin.email;
  }

  return null;
}

export async function requireAdminPage(locale: string): Promise<{ email: string }> {
  const session = await auth();
  const email = await resolveAdminEmail(session);
  if (!email) {
    redirect(`/${locale}/dashboard/parent`);
  }
  return { email };
}

export async function requireAdminSession(): Promise<{ email: string } | { error: string }> {
  const session = await auth();
  const email = await resolveAdminEmail(session);
  if (!email) return { error: "Accès admin requis." };
  return { email };
}

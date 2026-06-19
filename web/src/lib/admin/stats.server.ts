import { db } from "@/db";
import { users, organizationVerifications, libraryBooks } from "@/db/schema";
import { eq, sql } from "drizzle-orm";

export type AdminDashboardStats = {
  usersTotal: number;
  usersByRole: Record<string, number>;
  pendingVerifications: number;
  publishedBooks: number;
};

export async function getAdminDashboardStats(): Promise<AdminDashboardStats> {
  const [userCount] = await db.select({ count: sql<number>`count(*)::int` }).from(users);
  const roleRows = await db
    .select({ role: users.role, count: sql<number>`count(*)::int` })
    .from(users)
    .groupBy(users.role);
  const [pending] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(organizationVerifications)
    .where(eq(organizationVerifications.status, "pending"));
  const [books] = await db
    .select({ count: sql<number>`count(*)::int` })
    .from(libraryBooks)
    .where(eq(libraryBooks.isPublished, true));

  const usersByRole: Record<string, number> = {};
  for (const row of roleRows) {
    if (row.role) usersByRole[row.role] = row.count;
  }

  return {
    usersTotal: userCount?.count ?? 0,
    usersByRole,
    pendingVerifications: pending?.count ?? 0,
    publishedBooks: books?.count ?? 0,
  };
}

export type AdminUserRow = {
  id: number;
  email: string;
  username: string | null;
  fullName: string | null;
  role: string | null;
  createdAt: string;
  lastLoginAt: string | null;
  isBanned: boolean;
};

export async function listAdminUsers(limit = 200): Promise<AdminUserRow[]> {
  const rows = await db
    .select({
      id: users.id,
      email: users.email,
      username: users.username,
      fullName: users.fullName,
      role: users.role,
      createdAt: users.createdAt,
      lastLoginAt: users.lastLoginAt,
      lockedUntil: users.lockedUntil,
    })
    .from(users)
    .orderBy(sql`${users.createdAt} DESC`)
    .limit(limit);

  return rows.map((r) => ({
    id: r.id,
    email: r.email,
    username: r.username,
    fullName: r.fullName,
    role: r.role,
    createdAt: r.createdAt?.toISOString() ?? "",
    lastLoginAt: r.lastLoginAt?.toISOString() ?? null,
    isBanned: Boolean(r.lockedUntil && r.lockedUntil > new Date()),
  }));
}

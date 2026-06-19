import { db } from "@/db";
import { contactSubmissions, users } from "@/db/schema";
import { and, eq, ilike, inArray, or, sql } from "drizzle-orm";

export type AdminEmailGroup =
  | "all_users"
  | "parents"
  | "teachers"
  | "admins"
  | "contact_form"
  | "custom";

export type AdminNotificationTarget =
  | "all"
  | "parent"
  | "coparent"
  | "enseignant"
  | "admin"
  | "ecole"
  | "ong";

export type NotificationRecipient = {
  id: number;
  fullName: string | null;
  email: string;
  username: string | null;
  role: string | null;
};

function roleCondition(target: AdminNotificationTarget) {
  if (target === "all") return undefined;
  return eq(users.role, target);
}

export async function countNotificationRecipients(target: AdminNotificationTarget): Promise<number> {
  const roleFilter = roleCondition(target);
  const [row] = roleFilter
    ? await db.select({ count: sql<number>`count(*)::int` }).from(users).where(roleFilter)
    : await db.select({ count: sql<number>`count(*)::int` }).from(users);
  return row?.count ?? 0;
}

export async function listNotificationRecipients(
  target: AdminNotificationTarget,
  opts?: { search?: string; limit?: number }
): Promise<NotificationRecipient[]> {
  const limit = opts?.limit ?? 200;
  const search = opts?.search?.trim();
  const roleFilter = roleCondition(target);

  const searchFilter = search
    ? or(
        ilike(users.fullName, `%${search}%`),
        ilike(users.email, `%${search}%`),
        ilike(users.username, `%${search}%`)
      )
    : undefined;

  const whereClause =
    roleFilter && searchFilter ? and(roleFilter, searchFilter) : roleFilter ?? searchFilter;

  const base = db
    .select({
      id: users.id,
      fullName: users.fullName,
      email: users.email,
      username: users.username,
      role: users.role,
    })
    .from(users)
    .orderBy(sql`${users.fullName} ASC NULLS LAST`, sql`${users.email} ASC`)
    .limit(limit);

  return whereClause ? base.where(whereClause) : base;
}

export async function resolveUserIdsForNotificationTarget(
  target: AdminNotificationTarget,
  selectedIds?: number[]
): Promise<number[]> {
  if (selectedIds?.length) {
    const roleFilter = roleCondition(target);
    const rows = roleFilter
      ? await db
          .select({ id: users.id })
          .from(users)
          .where(and(inArray(users.id, selectedIds), roleFilter))
      : await db
          .select({ id: users.id })
          .from(users)
          .where(inArray(users.id, selectedIds));
    return rows.map((r) => r.id);
  }

  if (target === "all") {
    const rows = await db.select({ id: users.id }).from(users);
    return rows.map((r) => r.id);
  }
  const rows = await db
    .select({ id: users.id })
    .from(users)
    .where(eq(users.role, target));
  return rows.map((r) => r.id);
}

export async function resolveEmailsForNotificationTarget(
  target: AdminNotificationTarget,
  selectedIds?: number[]
): Promise<string[]> {
  const ids = await resolveUserIdsForNotificationTarget(target, selectedIds);
  if (ids.length === 0) return [];
  const rows = await db
    .select({ email: users.email })
    .from(users)
    .where(inArray(users.id, ids));
  return [...new Set(rows.map((r) => r.email.toLowerCase()))];
}

export type AdminEmailTarget = AdminNotificationTarget | "contact_form" | "manual";

export async function countContactFormRecipients(): Promise<number> {
  const [row] = await db.select({ count: sql<number>`count(*)::int` }).from(contactSubmissions);
  return row?.count ?? 0;
}

export async function resolveContactFormEmails(contactIds?: number[]): Promise<string[]> {
  if (contactIds?.length) {
    const rows = await db
      .select({ email: contactSubmissions.email })
      .from(contactSubmissions)
      .where(inArray(contactSubmissions.id, contactIds));
    return [...new Set(rows.map((r) => r.email.toLowerCase()))];
  }
  const rows = await db
    .select({ email: contactSubmissions.email })
    .from(contactSubmissions)
    .orderBy(sql`${contactSubmissions.createdAt} DESC`)
    .limit(500);
  return [...new Set(rows.map((r) => r.email.toLowerCase()))];
}

export async function resolveEmailsForAdminGroup(
  group: AdminEmailGroup,
  customEmails?: string[]
): Promise<string[]> {
  if (group === "custom") {
    return (customEmails ?? [])
      .map((e) => e.trim().toLowerCase())
      .filter((e) => e.includes("@"));
  }

  if (group === "contact_form") {
    const rows = await db
      .select({ email: contactSubmissions.email })
      .from(contactSubmissions)
      .orderBy(sql`${contactSubmissions.createdAt} DESC`)
      .limit(500);
    return [...new Set(rows.map((r) => r.email.toLowerCase()))];
  }

  const roleFilter =
    group === "all_users"
      ? undefined
      : group === "parents"
        ? inArray(users.role, ["parent", "coparent"])
        : group === "teachers"
          ? eq(users.role, "enseignant")
          : eq(users.role, "admin");

  const rows = roleFilter
    ? await db.select({ email: users.email }).from(users).where(roleFilter)
    : await db.select({ email: users.email }).from(users);

  return [...new Set(rows.map((r) => r.email.toLowerCase()))];
}

export type AdminContactOption = {
  id: number;
  name: string;
  email: string;
  subject: string | null;
};

export async function listAdminContactOptions(limit = 200): Promise<AdminContactOption[]> {
  return db
    .select({
      id: contactSubmissions.id,
      name: contactSubmissions.name,
      email: contactSubmissions.email,
      subject: contactSubmissions.subject,
    })
    .from(contactSubmissions)
    .orderBy(sql`${contactSubmissions.createdAt} DESC`)
    .limit(limit);
}

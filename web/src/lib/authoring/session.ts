import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import type { AuthoringOwnerRole } from "./types";

export type AuthoringUser = {
  id: number;
  email: string;
  fullName: string | null;
  role: AuthoringOwnerRole;
  metadata: Record<string, unknown>;
};

const AUTHOR_ROLES = ["enseignant", "parent", "coparent"] as const;

function mapAuthoringRole(role: string): AuthoringOwnerRole {
  if (role === "enseignant") return "enseignant";
  return "parent";
}

function parseMetadata(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function requireAuthoringUser(): Promise<AuthoringUser | null> {
  const session = await auth();
  if (!session?.user?.email) return null;

  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      role: users.role,
      metadata: users.metadata,
    })
    .from(users)
    .where(eq(users.email, session.user.email.toLowerCase()))
    .limit(1);

  if (!row?.role || !AUTHOR_ROLES.includes(row.role as (typeof AUTHOR_ROLES)[number])) return null;

  return {
    id: row.id,
    email: row.email,
    fullName: row.fullName,
    role: mapAuthoringRole(row.role),
    metadata: parseMetadata(row.metadata),
  };
}

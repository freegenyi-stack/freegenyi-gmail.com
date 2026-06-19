import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isMessagingRole } from "./messaging-policy";

export type MessagingUser = {
  id: number;
  email: string;
  fullName: string | null;
  username: string | null;
  role: string | null;
  familyId: string | null;
  image: string | null;
  lastLoginAt: Date | null;
  lastSeenAt: Date | null;
  metadata: Record<string, unknown>;
};

export function parseUserMetadata(raw: string | null): Record<string, unknown> {
  if (!raw) return {};
  try {
    return JSON.parse(raw) as Record<string, unknown>;
  } catch {
    return {};
  }
}

export async function requireMessagingUser(): Promise<MessagingUser | null> {
  const session = await auth();
  if (!session?.user?.email) return null;

  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      username: users.username,
      role: users.role,
      familyId: users.familyId,
      image: users.image,
      lastLoginAt: users.lastLoginAt,
      lastSeenAt: users.lastSeenAt,
      metadata: users.metadata,
    })
    .from(users)
    .where(eq(users.email, session.user.email.toLowerCase()))
    .limit(1);

  if (!row) return null;
  if (!isMessagingRole(row.role)) return null;

  return {
    ...row,
    metadata: parseUserMetadata(row.metadata),
  };
}

export async function getMessagingUserById(userId: number): Promise<MessagingUser | null> {
  const [row] = await db
    .select({
      id: users.id,
      email: users.email,
      fullName: users.fullName,
      username: users.username,
      role: users.role,
      familyId: users.familyId,
      image: users.image,
      lastLoginAt: users.lastLoginAt,
      lastSeenAt: users.lastSeenAt,
      metadata: users.metadata,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!row) return null;
  return { ...row, metadata: parseUserMetadata(row.metadata) };
}

export function isOnline(lastSeenAt: Date | null, lastLoginAt?: Date | null): boolean {
  const ref = lastSeenAt || lastLoginAt;
  if (!ref) return false;
  return Date.now() - new Date(ref).getTime() < 5 * 60 * 1000;
}

export function toUserPreview(user: MessagingUser): import("./types").ChatUserPreview {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    role: user.role,
    image: user.image,
    isOnline: isOnline(user.lastSeenAt, user.lastLoginAt),
    lastSeenAt: user.lastSeenAt?.toISOString() ?? null,
  };
}

export function displayName(user: Pick<MessagingUser, "fullName" | "username" | "email">): string {
  return user.fullName?.trim() || user.username || user.email.split("@")[0];
}

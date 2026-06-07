import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export type MessagingUser = {
  id: number;
  email: string;
  fullName: string | null;
  username: string | null;
  role: string | null;
  familyId: string | null;
  image: string | null;
  lastLoginAt: Date | null;
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
      metadata: users.metadata,
    })
    .from(users)
    .where(eq(users.email, session.user.email.toLowerCase()))
    .limit(1);

  if (!row) return null;

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
      metadata: users.metadata,
    })
    .from(users)
    .where(eq(users.id, userId))
    .limit(1);

  if (!row) return null;
  return { ...row, metadata: parseUserMetadata(row.metadata) };
}

export function isOnline(lastLoginAt: Date | null): boolean {
  if (!lastLoginAt) return false;
  return Date.now() - new Date(lastLoginAt).getTime() < 5 * 60 * 1000;
}

export function toUserPreview(user: MessagingUser): import("./types").ChatUserPreview {
  return {
    id: user.id,
    fullName: user.fullName,
    username: user.username,
    role: user.role,
    image: user.image,
    isOnline: isOnline(user.lastLoginAt),
  };
}

export function displayName(user: Pick<MessagingUser, "fullName" | "username" | "email">): string {
  return user.fullName?.trim() || user.username || user.email.split("@")[0];
}

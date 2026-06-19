import { cookies } from "next/headers";

export const IMPERSONATE_UID = "fg_impersonate_uid";
export const IMPERSONATE_ADMIN = "fg_impersonate_admin";

export async function getImpersonationCookies() {
  const jar = await cookies();
  const uid = jar.get(IMPERSONATE_UID)?.value;
  const adminId = jar.get(IMPERSONATE_ADMIN)?.value;
  if (!uid || !adminId) return null;
  const targetId = parseInt(uid, 10);
  const adminUserId = parseInt(adminId, 10);
  if (Number.isNaN(targetId) || Number.isNaN(adminUserId)) return null;
  return { targetId, adminUserId };
}

export async function setImpersonationCookies(targetUserId: number, adminUserId: number) {
  const jar = await cookies();
  const opts = {
    httpOnly: true,
    sameSite: "lax" as const,
    path: "/",
    maxAge: 60 * 60 * 4,
  };
  jar.set(IMPERSONATE_UID, String(targetUserId), opts);
  jar.set(IMPERSONATE_ADMIN, String(adminUserId), opts);
}

export async function clearImpersonationCookies() {
  const jar = await cookies();
  jar.delete(IMPERSONATE_UID);
  jar.delete(IMPERSONATE_ADMIN);
}

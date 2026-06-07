import { cookies } from "next/headers";
import { createHmac, timingSafeEqual } from "crypto";

const COOKIE_NAME = "fg_child_device";
const MAX_AGE_SEC = 60 * 60 * 24 * 180; // 6 mois

function secret(): string {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-child-session-secret";
}

export type ChildSessionPayload = {
  childId: number;
  deviceToken: string;
  exp: number;
};

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export function encodeChildSession(childId: number, deviceToken: string): string {
  const exp = Math.floor(Date.now() / 1000) + MAX_AGE_SEC;
  const body = Buffer.from(JSON.stringify({ childId, deviceToken, exp }), "utf8").toString("base64url");
  const sig = sign(body);
  return `${body}.${sig}`;
}

export function decodeChildSession(raw: string | undefined): ChildSessionPayload | null {
  if (!raw) return null;
  const [body, sig] = raw.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    if (
      expected.length !== sig.length ||
      !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))
    ) {
      return null;
    }
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as ChildSessionPayload;
    if (!parsed.childId || !parsed.deviceToken || !parsed.exp) return null;
    if (parsed.exp < Math.floor(Date.now() / 1000)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export async function getChildSessionFromCookies(): Promise<ChildSessionPayload | null> {
  const jar = await cookies();
  return decodeChildSession(jar.get(COOKIE_NAME)?.value);
}

export async function setChildSessionCookie(childId: number, deviceToken: string) {
  const jar = await cookies();
  jar.set(COOKIE_NAME, encodeChildSession(childId, deviceToken), {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: MAX_AGE_SEC,
  });
}

export async function clearChildSessionCookie() {
  const jar = await cookies();
  jar.delete(COOKIE_NAME);
}

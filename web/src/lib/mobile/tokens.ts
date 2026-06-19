import { createHmac, timingSafeEqual } from "crypto";

const PARENT_MAX_AGE_SEC = 60 * 60 * 24 * 30; // 30 jours
const CHILD_MAX_AGE_SEC = 60 * 60 * 24 * 180; // 6 mois — aligné cookie enfant

function secret(): string {
  return process.env.AUTH_SECRET || process.env.NEXTAUTH_SECRET || "dev-mobile-token-secret";
}

function sign(payload: string): string {
  return createHmac("sha256", secret()).update(payload).digest("base64url");
}

export type MobileParentPayload = {
  typ: "parent";
  userId: number;
  exp: number;
};

export type MobileChildPayload = {
  typ: "child";
  childId: number;
  deviceToken: string;
  exp: number;
};

export type MobileTokenPayload = MobileParentPayload | MobileChildPayload;

function encodePayload(payload: MobileTokenPayload): string {
  const body = Buffer.from(JSON.stringify(payload), "utf8").toString("base64url");
  return `${body}.${sign(body)}`;
}

function decodePayload(raw: string | null | undefined): MobileTokenPayload | null {
  if (!raw) return null;
  const token = raw.startsWith("Bearer ") ? raw.slice(7).trim() : raw.trim();
  const [body, sig] = token.split(".");
  if (!body || !sig) return null;
  const expected = sign(body);
  try {
    if (expected.length !== sig.length || !timingSafeEqual(Buffer.from(expected), Buffer.from(sig))) {
      return null;
    }
  } catch {
    return null;
  }
  try {
    const parsed = JSON.parse(Buffer.from(body, "base64url").toString("utf8")) as MobileTokenPayload;
    if (!parsed?.typ || !parsed.exp || parsed.exp < Math.floor(Date.now() / 1000)) return null;
    if (parsed.typ === "parent" && !parsed.userId) return null;
    if (parsed.typ === "child" && (!parsed.childId || !parsed.deviceToken)) return null;
    return parsed;
  } catch {
    return null;
  }
}

export function encodeMobileParentToken(userId: number): string {
  return encodePayload({
    typ: "parent",
    userId,
    exp: Math.floor(Date.now() / 1000) + PARENT_MAX_AGE_SEC,
  });
}

export function encodeMobileChildToken(childId: number, deviceToken: string): string {
  return encodePayload({
    typ: "child",
    childId,
    deviceToken,
    exp: Math.floor(Date.now() / 1000) + CHILD_MAX_AGE_SEC,
  });
}

export function decodeMobileToken(authorizationHeader: string | null): MobileTokenPayload | null {
  return decodePayload(authorizationHeader);
}

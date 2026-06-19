import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { childDevicePairings } from "@/db/schema";
import { decodeMobileToken, type MobileChildPayload, type MobileParentPayload } from "./tokens";
import { userCanAccessChild } from "@/lib/family/server";

export async function requireMobileParent(
  request: Request
): Promise<{ user: typeof users.$inferSelect } | NextResponse> {
  const payload = decodeMobileToken(request.headers.get("authorization"));
  if (!payload || payload.typ !== "parent") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const p = payload as MobileParentPayload;
  const [user] = await db.select().from(users).where(eq(users.id, p.userId)).limit(1);
  if (!user) return NextResponse.json({ error: "user_not_found" }, { status: 401 });
  return { user };
}

export async function requireMobileChild(
  request: Request
): Promise<{ childId: number; deviceToken: string } | NextResponse> {
  const payload = decodeMobileToken(request.headers.get("authorization"));
  if (!payload || payload.typ !== "child") {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }
  const p = payload as MobileChildPayload;
  const [pairing] = await db
    .select()
    .from(childDevicePairings)
    .where(
      and(
        eq(childDevicePairings.childId, p.childId),
        eq(childDevicePairings.deviceToken, p.deviceToken)
      )
    )
    .limit(1);
  if (!pairing) return NextResponse.json({ error: "device_not_paired" }, { status: 401 });
  return { childId: p.childId, deviceToken: p.deviceToken };
}

export async function requireMobileParentOrChildForChildId(
  request: Request,
  childId: number
): Promise<
  | { mode: "parent"; user: typeof users.$inferSelect }
  | { mode: "child"; childId: number; deviceToken: string }
  | NextResponse
> {
  const payload = decodeMobileToken(request.headers.get("authorization"));
  if (!payload) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  if (payload.typ === "child") {
    if (payload.childId !== childId) {
      return NextResponse.json({ error: "forbidden" }, { status: 403 });
    }
    const childAuth = await requireMobileChild(request);
    if (childAuth instanceof NextResponse) return childAuth;
    return { mode: "child", ...childAuth };
  }

  if (payload.typ === "parent") {
    const parentAuth = await requireMobileParent(request);
    if (parentAuth instanceof NextResponse) return parentAuth;
    const { children: childrenTable } = await import("@/db/schema");
    const [childRow] = await db
      .select()
      .from(childrenTable)
      .where(eq(childrenTable.id, childId))
      .limit(1);
    if (!childRow) return NextResponse.json({ error: "not_found" }, { status: 404 });
    const allowed = await userCanAccessChild(parentAuth.user, childRow);
    if (!allowed) return NextResponse.json({ error: "forbidden" }, { status: 403 });
    return { mode: "parent", user: parentAuth.user };
  }

  return NextResponse.json({ error: "unauthorized" }, { status: 401 });
}

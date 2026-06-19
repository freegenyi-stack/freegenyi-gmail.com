import { NextResponse } from "next/server";
import { db } from "@/db";
import { childDevicePairings, childPairingCodes, children } from "@/db/schema";
import { eq, and, gt } from "drizzle-orm";
import { generateDeviceToken } from "@/lib/family/server";
import { encodeMobileChildToken } from "@/lib/mobile/tokens";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { code?: string; deviceLabel?: string };
    const normalized = body.code?.trim().toUpperCase();
    if (!normalized) {
      return NextResponse.json({ error: "invalid_code" }, { status: 400 });
    }

    const [pairing] = await db
      .select()
      .from(childPairingCodes)
      .where(and(eq(childPairingCodes.code, normalized), gt(childPairingCodes.expiresAt, new Date())))
      .limit(1);

    if (!pairing) {
      return NextResponse.json({ error: "code_expired_or_invalid" }, { status: 400 });
    }

    const [child] = await db
      .select({ id: children.id, fullName: children.fullName })
      .from(children)
      .where(eq(children.id, pairing.childId))
      .limit(1);

    if (!child) {
      return NextResponse.json({ error: "child_not_found" }, { status: 404 });
    }

    const deviceToken = generateDeviceToken();
    await db.insert(childDevicePairings).values({
      childId: pairing.childId,
      deviceToken,
      deviceLabel: body.deviceLabel?.trim() || "Mobile",
      lastUsedAt: new Date(),
    });

    const accessToken = encodeMobileChildToken(pairing.childId, deviceToken);

    return NextResponse.json({
      accessToken,
      childId: child.id,
      childName: child.fullName,
      paired: true,
      needsPin: true,
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

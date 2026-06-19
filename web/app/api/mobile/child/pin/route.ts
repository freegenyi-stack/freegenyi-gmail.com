import { NextResponse } from "next/server";
import { db } from "@/db";
import { childDevicePairings, children } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { decodeMobileToken } from "@/lib/mobile/tokens";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { pin?: string };
    const pin = body.pin?.trim();
    if (!pin || !/^\d{4}$/.test(pin)) {
      return NextResponse.json({ error: "pin_required" }, { status: 400 });
    }

    const session = decodeMobileToken(request.headers.get("authorization"));
    if (!session || session.typ !== "child") {
      return NextResponse.json({ error: "device_not_paired" }, { status: 401 });
    }

    const [pairing] = await db
      .select()
      .from(childDevicePairings)
      .where(
        and(
          eq(childDevicePairings.childId, session.childId),
          eq(childDevicePairings.deviceToken, session.deviceToken)
        )
      )
      .limit(1);

    if (!pairing) {
      return NextResponse.json({ error: "device_not_recognized" }, { status: 401 });
    }

    const [child] = await db
      .select({
        id: children.id,
        fullName: children.fullName,
        accessPinHash: children.accessPinHash,
        learningProfile: children.learningProfile,
      })
      .from(children)
      .where(eq(children.id, session.childId))
      .limit(1);

    if (!child?.accessPinHash) {
      return NextResponse.json({ error: "pin_not_set" }, { status: 400 });
    }

    const ok = await bcrypt.compare(pin, child.accessPinHash);
    if (!ok) {
      return NextResponse.json({ error: "invalid_pin" }, { status: 401 });
    }

    await db
      .update(childDevicePairings)
      .set({ lastUsedAt: new Date() })
      .where(eq(childDevicePairings.id, pairing.id));

    return NextResponse.json({
      success: true,
      childId: child.id,
      childName: child.fullName,
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

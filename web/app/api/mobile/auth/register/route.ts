import { NextResponse } from "next/server";
import { registerParentMobile } from "@/lib/mobile/register-parent.server";
import type { MobileParentRegisterPayload } from "@/lib/mobile/types";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as MobileParentRegisterPayload;
    const result = await registerParentMobile(body);

    if (!result.ok) {
      return NextResponse.json({ error: result.code || "register_failed", message: result.error }, { status: 400 });
    }

    return NextResponse.json({
      accessToken: result.accessToken,
      userId: result.userId,
      trackingCode: result.trackingCode,
      onboarded: true,
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { requireMobileParent } from "@/lib/mobile/require-mobile-auth";
import { setChildPinForUser } from "@/lib/mobile/parent-child.server";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ childId: string }> }
) {
  const auth = await requireMobileParent(request);
  if (auth instanceof NextResponse) return auth;

  const { childId: childIdStr } = await params;
  const childId = parseInt(childIdStr, 10);
  if (Number.isNaN(childId)) {
    return NextResponse.json({ error: "invalid_child_id" }, { status: 400 });
  }

  const body = (await request.json()) as { pin?: string };
  if (!body.pin) {
    return NextResponse.json({ error: "missing_pin" }, { status: 400 });
  }

  const result = await setChildPinForUser(auth.user, childId, body.pin);
  if ("error" in result) {
    return NextResponse.json({ error: result.code, message: result.error }, { status: 400 });
  }

  return NextResponse.json({ ok: true });
}

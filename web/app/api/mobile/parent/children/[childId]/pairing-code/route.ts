import { NextResponse } from "next/server";
import { requireMobileParent } from "@/lib/mobile/require-mobile-auth";
import { createChildPairingCodeForUser } from "@/lib/mobile/pairing.server";

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

  const result = await createChildPairingCodeForUser(auth.user.id, childId);
  if ("error" in result) {
    const status = result.code === "forbidden" ? 403 : result.code === "not_found" ? 404 : 400;
    return NextResponse.json({ error: result.code || "pairing_failed", message: result.error }, { status });
  }

  return NextResponse.json(result);
}

import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { getMobileChildLibraryPayload } from "@/lib/mobile/child-library.server";

export async function GET(request: Request) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const payload = await getMobileChildLibraryPayload(auth.childId);
  return NextResponse.json(payload);
}

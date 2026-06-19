import { NextResponse } from "next/server";
import { checkUserAvailability } from "@/lib/actions/auth_elite";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const field = searchParams.get("field");
  const value = searchParams.get("value")?.trim();

  if ((field !== "email" && field !== "username") || !value) {
    return NextResponse.json({ error: "invalid_params" }, { status: 400 });
  }

  const result = await checkUserAvailability(field, value);
  if ("error" in result && result.error) {
    return NextResponse.json({ available: false, error: result.error });
  }
  return NextResponse.json({ available: result.available ?? true });
}

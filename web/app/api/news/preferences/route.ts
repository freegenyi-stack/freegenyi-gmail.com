import { NextRequest, NextResponse } from "next/server";
import { getNewsPreferencesAction, updateNewsPreferencesAction } from "@/lib/actions/news_preferences";

export async function GET() {
  const result = await getNewsPreferencesAction();
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 401 });
  }
  return NextResponse.json(result);
}

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const result = await updateNewsPreferencesAction(formData);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json(result);
}

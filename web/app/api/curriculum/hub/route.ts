import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { buildProgramHub } from "@/lib/curriculum/hub.server";
import type { CurriculumCountry, CurriculumLevel } from "@/lib/curriculum/types";

export async function GET(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const country = (searchParams.get("country") ?? "DZ") as CurriculumCountry;
  const level = (searchParams.get("level") ?? "1AP") as CurriculumLevel;

  const hub = await buildProgramHub(country, level);
  if (!hub) {
    return NextResponse.json({ error: "hub_not_found" }, { status: 404 });
  }

  return NextResponse.json(hub);
}

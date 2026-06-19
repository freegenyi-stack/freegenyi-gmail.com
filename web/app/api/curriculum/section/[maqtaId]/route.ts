import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { buildProgramSectionDetail } from "@/lib/curriculum/hub.server";
import type { CurriculumCountry, CurriculumLevel, CurriculumSubject } from "@/lib/curriculum/types";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ maqtaId: string }> }
) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { maqtaId } = await params;
  const { searchParams } = new URL(request.url);
  const country = (searchParams.get("country") ?? "DZ") as CurriculumCountry;
  const level = (searchParams.get("level") ?? "1AP") as CurriculumLevel;
  const subject = searchParams.get("subject") as CurriculumSubject | null;

  if (!subject || (subject !== "ar_islam_civique" && subject !== "math_est")) {
    return NextResponse.json({ error: "invalid_subject" }, { status: 400 });
  }

  const detail = await buildProgramSectionDetail(country, level, subject, maqtaId);
  if (!detail) {
    return NextResponse.json({ error: "section_not_found" }, { status: 404 });
  }

  return NextResponse.json(detail);
}

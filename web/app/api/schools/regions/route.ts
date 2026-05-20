import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { regions } from "@/db/schema";
import { eq, asc } from "drizzle-orm";
import { verifyRequestSecurity } from "@/lib/antiScrape";

export async function GET(req: NextRequest) {
  try {
    // Verify anti-scraping and rate limiting constraints
    const security = verifyRequestSecurity(req, 20); // Max 20 region loads per minute
    if (!security.allowed && security.errorResponse) {
      return NextResponse.json(
        { error: security.errorResponse.error },
        { status: security.errorResponse.status }
      );
    }
    const { searchParams } = new URL(req.url);
    const countryCode = searchParams.get("country") || "DZ";

    const results = await db
      .select({
        id: regions.id,
        code: regions.code,
        nameLocal: regions.nameLocal,
        nameFr: regions.nameFr,
      })
      .from(regions)
      .where(eq(regions.countryCode, countryCode))
      .orderBy(asc(regions.code));

    return NextResponse.json(results);
  } catch (error) {
    return NextResponse.json({ error: "Failed to load regions" }, { status: 500 });
  }
}

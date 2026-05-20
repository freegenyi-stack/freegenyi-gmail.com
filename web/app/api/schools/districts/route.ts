import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { districts, regions } from "@/db/schema";
import { eq, asc, and } from "drizzle-orm";
import { verifyRequestSecurity } from "@/lib/antiScrape";

/**
 * GET /api/schools/districts?region=01&country=DZ
 * Returns communes (districts) for a given wilaya (region code)
 */
export async function GET(req: NextRequest) {
  try {
    // Verify anti-scraping and rate limiting constraints
    const security = verifyRequestSecurity(req, 30); // Max 30 district loads per minute
    if (!security.allowed && security.errorResponse) {
      return NextResponse.json(
        { error: security.errorResponse.error },
        { status: security.errorResponse.status }
      );
    }
    const { searchParams } = new URL(req.url);
    const regionCode = searchParams.get("region") || "";
    const countryCode = searchParams.get("country") || "DZ";

    if (!regionCode) return NextResponse.json([]);

    const results = await db
      .select({
        id: districts.id,
        code: districts.code,
        nameLocal: districts.nameLocal,
        nameFr: districts.nameFr,
      })
      .from(districts)
      .innerJoin(regions, eq(districts.regionId, regions.id))
      .where(
        and(
          eq(regions.code, regionCode),
          eq(regions.countryCode, countryCode)
        )
      )
      .orderBy(asc(districts.nameFr));

    return NextResponse.json(results);
  } catch (error) {
    console.error("Districts fetch error:", error);
    return NextResponse.json({ error: "Failed to load districts" }, { status: 500 });
  }
}

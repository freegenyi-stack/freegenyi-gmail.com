import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { schools, districts, regions } from "@/db/schema";
import { ilike, eq, and, or } from "drizzle-orm";
import { verifyRequestSecurity } from "@/lib/antiScrape";

export async function GET(req: NextRequest) {
  try {
    // Verify anti-scraping and rate limiting constraints
    const security = verifyRequestSecurity(req, 45); // Max 45 searches per minute
    if (!security.allowed && security.errorResponse) {
      return NextResponse.json(
        { error: security.errorResponse.error },
        { status: security.errorResponse.status }
      );
    }
    const { searchParams } = new URL(req.url);
    const q = searchParams.get("q") || "";
    const regionCode = searchParams.get("region") || "";
    const districtCode = searchParams.get("district") || "";
    const countryCode = searchParams.get("country") || "DZ";
    const typeStr = searchParams.get("type");
    const typeId = typeStr ? parseInt(typeStr) : null;
    const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);

    if (q.length < 2 && !regionCode && !districtCode) {
      return NextResponse.json([]);
    }

    // Build query with joins
    const results = await db
      .select({
        id: schools.id,
        code: schools.code,
        nameLocal: schools.nameLocal,
        nameFr: schools.nameFr,
        type: schools.type,
        districtCode: districts.code,
        districtNameFr: districts.nameFr,
        districtNameLocal: districts.nameLocal,
        regionCode: regions.code,
        regionNameFr: regions.nameFr,
        regionNameLocal: regions.nameLocal,
      })
      .from(schools)
      .innerJoin(districts, eq(schools.districtId, districts.id))
      .innerJoin(regions, eq(districts.regionId, regions.id))
      .where(
        and(
          eq(schools.isActive, true),
          eq(regions.countryCode, countryCode),
          regionCode ? eq(regions.code, regionCode) : undefined,
          districtCode ? eq(districts.code, districtCode) : undefined,
          typeId ? eq(schools.type, typeId) : undefined,
          q.length >= 2
            ? or(
                ilike(schools.nameLocal, `%${q}%`),
                ilike(schools.nameFr, `%${q}%`)
              )
            : undefined
        )
      )
      .orderBy(schools.nameFr)
      .limit(limit);

    return NextResponse.json(results);
  } catch (error) {
    console.error("School search error:", error);
    return NextResponse.json({ error: "Search failed" }, { status: 500 });
  }
}

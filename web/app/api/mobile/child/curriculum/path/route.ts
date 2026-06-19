import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import {
  buildPathResponse,
  loadBundleFromFiles,
} from "@/lib/curriculum/loader.server";
import {
  findActiveBundle,
  getCompletedCompetencyIds,
  normalizeChildLevel,
  parseSubjectParam,
} from "@/lib/curriculum/progress.server";
import { db } from "@/db";
import { children } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: Request) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(request.url);
  const subject = parseSubjectParam(searchParams.get("subject"));
  if (!subject) {
    return NextResponse.json({ error: "invalid_subject" }, { status: 400 });
  }

  const [child] = await db
    .select({ educationLevel: children.educationLevel })
    .from(children)
    .where(eq(children.id, auth.childId))
    .limit(1);

  const level = normalizeChildLevel(child?.educationLevel);
  const country = "DZ" as const;

  const bundle = await loadBundleFromFiles(country, level, subject);
  if (!bundle) {
    return NextResponse.json({ error: "bundle_not_found" }, { status: 404 });
  }

  const dbBundle = await findActiveBundle(country, level, subject);
  const completed = dbBundle
    ? await getCompletedCompetencyIds(auth.childId, dbBundle.id)
    : new Set<string>();

  const completedNodeIds = new Set(
    [...completed].filter((id) => bundle.nodes.some((n) => n.nodeId === id))
  );

  const path = buildPathResponse(bundle, completedNodeIds);
  return NextResponse.json(path);
}

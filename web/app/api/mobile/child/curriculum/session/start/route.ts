import { NextResponse } from "next/server";
import { requireMobileChild } from "@/lib/mobile/require-mobile-auth";
import { loadBundleFromFiles } from "@/lib/curriculum/loader.server";
import { buildSessionPayload } from "@/lib/curriculum/session-builder.server";
import {
  findActiveBundle,
  normalizeChildLevel,
  parseSubjectParam,
  persistSession,
} from "@/lib/curriculum/progress.server";
import type { SessionSource } from "@/lib/curriculum/types";
import { db } from "@/db";
import { children } from "@/db/schema";
import { eq } from "drizzle-orm";

type StartBody = {
  subject?: string;
  competencyId?: string;
  source?: SessionSource;
  itemsMin?: number;
  itemsMax?: number;
};

export async function POST(request: Request) {
  const auth = await requireMobileChild(request);
  if (auth instanceof NextResponse) return auth;

  let body: StartBody;
  try {
    body = (await request.json()) as StartBody;
  } catch {
    return NextResponse.json({ error: "invalid_json" }, { status: 400 });
  }

  const subject = parseSubjectParam(body.subject ?? null);
  const competencyId = body.competencyId?.trim();
  if (!subject || !competencyId) {
    return NextResponse.json({ error: "subject_and_competency_required" }, { status: 400 });
  }

  const source: SessionSource = body.source ?? "official_path";

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

  const payload = buildSessionPayload({
    bundle,
    competencyId,
    source,
    itemsMin: body.itemsMin,
    itemsMax: body.itemsMax,
  });

  if ("error" in payload) {
    return NextResponse.json({ error: payload.error }, { status: 404 });
  }

  const dbBundle = await findActiveBundle(country, level, subject);
  await persistSession(auth.childId, dbBundle?.id ?? null, payload);

  return NextResponse.json({ session: payload });
}

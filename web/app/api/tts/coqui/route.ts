import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { childDevicePairings } from "@/db/schema";
import { getChildSessionFromCookies } from "@/lib/child-session";
import { synthesizeSpeech } from "@/lib/tts/synthesize.server";
import { checkTtsRateLimit } from "@/lib/tts/rate-limit.server";
import { and, eq } from "drizzle-orm";

async function assertTtsAccess(): Promise<boolean> {
  const session = await auth();
  if (session?.user?.id) return true;

  const childSession = await getChildSessionFromCookies();
  if (!childSession) return false;

  const [pairing] = await db
    .select()
    .from(childDevicePairings)
    .where(
      and(
        eq(childDevicePairings.childId, childSession.childId),
        eq(childDevicePairings.deviceToken, childSession.deviceToken)
      )
    )
    .limit(1);

  return !!pairing;
}

export async function POST(req: NextRequest) {
  if (!(await assertTtsAccess())) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const body = (await req.json()) as { text?: string; language?: string };
  const text = body.text?.trim();
  if (!text) {
    return NextResponse.json({ error: "Texte requis" }, { status: 400 });
  }

  const session = await auth();
  const rateKey = session?.user?.id ? `user:${session.user.id}` : `ip:${req.headers.get("x-forwarded-for") ?? "anon"}`;
  const rate = checkTtsRateLimit(rateKey);
  if (!rate.ok) {
    return NextResponse.json(
      { error: `Trop de requêtes TTS — réessayez dans ${rate.retryAfterSec}s` },
      { status: 429, headers: { "Retry-After": String(rate.retryAfterSec) } }
    );
  }

  const result = await synthesizeSpeech(text, body.language || "fr");
  if (!result.ok) {
    return NextResponse.json({ error: result.error, fallback: true }, { status: 503 });
  }

  const audio = Buffer.from(result.audioBase64, "base64");
  return new NextResponse(audio, {
    headers: {
      "Content-Type": result.mimeType,
      "X-TTS-Engine": result.engine,
      "Cache-Control": "no-store",
    },
  });
}

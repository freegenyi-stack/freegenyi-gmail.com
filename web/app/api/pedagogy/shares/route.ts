import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import {
  createPedagogyShare,
  getTeacherLeaderboard,
  listPedagogySharesForUser,
} from "@/lib/pedagogy/shares.server";

async function getSessionUser() {
  const session = await auth();
  if (!session?.user?.email) return null;
  const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
  return user ?? null;
}

export async function GET(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });

  const role = user.role || "parent";
  if (!["parent", "coparent", "enseignant"].includes(role)) {
    return NextResponse.json({ error: "Accès réservé aux parents et enseignants." }, { status: 403 });
  }

  const level = req.nextUrl.searchParams.get("level") || undefined;
  const mine = req.nextUrl.searchParams.get("mine") === "1";
  const leaderboard = req.nextUrl.searchParams.get("leaderboard") === "1";

  if (leaderboard) {
    const top = await getTeacherLeaderboard(8);
    return NextResponse.json({ leaderboard: top }, { headers: { "Cache-Control": "no-store" } });
  }

  const shares = await listPedagogySharesForUser(user.id, role, { level, mine });
  return NextResponse.json({ shares }, { headers: { "Cache-Control": "no-store" } });
}

export async function POST(req: NextRequest) {
  const user = await getSessionUser();
  if (!user) return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  if (user.role !== "enseignant") {
    return NextResponse.json({ error: "Seuls les enseignants peuvent publier." }, { status: 403 });
  }

  const formData = await req.formData();
  const result = await createPedagogyShare(user.id, formData);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: 400 });
  }
  return NextResponse.json({ id: result.id }, { status: 201 });
}

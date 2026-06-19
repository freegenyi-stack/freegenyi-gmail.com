import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isFamilyAdult } from "@/lib/family/constants";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
  }

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || !isFamilyAdult(user.role)) {
    return NextResponse.json({ error: "Non autorisé" }, { status: 403 });
  }

  let partnerUserId: number | null = null;
  let partnerName: string | null = null;

  if (user.familyId) {
    const members = await db
      .select({ id: users.id, fullName: users.fullName })
      .from(users)
      .where(eq(users.familyId, user.familyId));
    const partner = members.find((m) => m.id !== user.id);
    if (partner) {
      partnerUserId = partner.id;
      partnerName = partner.fullName;
    }
  }

  return NextResponse.json({
    partnerUserId,
    partnerName,
    genyHint: true,
  });
}

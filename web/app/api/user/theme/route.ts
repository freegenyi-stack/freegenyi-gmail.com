import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: NextRequest) {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const body = await req.json();
    const updates: Record<string, string> = {};

    if (body.primary) {
      updates.themeSettings = JSON.stringify({ primary: body.primary });
    }

    if (body.avatar) {
      updates.avatarConfig = JSON.stringify(body.avatar);
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "Aucune donnée" }, { status: 400 });
    }

    await db
      .update(users)
      .set(updates as any)
      .where(eq(users.email, session.user.email));

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Theme API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

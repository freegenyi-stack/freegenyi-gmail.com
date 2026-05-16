import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, and, ne } from "drizzle-orm";

export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.email) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    const [user] = await db
      .select({
        id: users.id,
        fullName: users.fullName,
        username: users.username,
        role: users.role,
        phone: users.phone,
        image: users.image,
        familyId: users.familyId,
        avatarConfig: users.avatarConfig,
        themeSettings: users.themeSettings,
        lastLoginAt: users.lastLoginAt,
      })
      .from(users)
      .where(eq(users.email, session.user.email));

    if (!user) {
      return NextResponse.json({ error: "Utilisateur introuvable" }, { status: 404 });
    }

    // Profile completeness check
    const profileComplete = !!(user.fullName && user.username && user.phone);

    // Find linked partner (same familyId, different user)
    let partner = null;
    if (user.familyId) {
      const allFamilyMembers = await db
        .select({
          id: users.id,
          fullName: users.fullName,
          role: users.role,
          lastLoginAt: users.lastLoginAt,
          image: users.image,
        })
        .from(users)
        .where(
          and(
            eq(users.familyId, user.familyId),
            ne(users.id, user.id)
          )
        );

      if (allFamilyMembers.length > 0) {
        const p = allFamilyMembers[0];
        const lastLogin = p.lastLoginAt ? new Date(p.lastLoginAt).getTime() : 0;
        const isOnline = Date.now() - lastLogin < 5 * 60 * 1000; // 5 minutes
        partner = {
          id: p.id,
          fullName: p.fullName,
          role: p.role,
          image: p.image,
          isOnline,
          lastLoginAt: p.lastLoginAt,
        };
      }
    }

    // Parse configs
    const avatarConfig = user.avatarConfig ? JSON.parse(user.avatarConfig) : null;
    const themeSettings = user.themeSettings ? JSON.parse(user.themeSettings) : null;

    return NextResponse.json({
      id: user.id,
      fullName: user.fullName,
      username: user.username,
      role: user.role,
      image: user.image,
      familyId: user.familyId,
      avatarConfig,
      themeSettings,
      profileComplete,
      partner,
      notifCount: 0, // Phase 5 will populate this
    });
  } catch (error) {
    console.error("Header API error:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}

import { NextResponse } from "next/server";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq, ilike } from "drizzle-orm";
import bcrypt from "bcryptjs";
import { encodeMobileParentToken } from "@/lib/mobile/tokens";
import { isUserFullyOnboarded } from "@/lib/auth/dashboard-route";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { email?: string; password?: string };
    const loginId = body.email?.trim();
    const password = body.password;

    if (!loginId || !password) {
      return NextResponse.json({ error: "missing_credentials" }, { status: 400 });
    }

    const emailForLookup = loginId.toLowerCase();
    const [user] = await db
      .select({
        id: users.id,
        email: users.email,
        fullName: users.fullName,
        role: users.role,
        onboardingStep: users.onboardingStep,
        passwordHash: users.passwordHash,
        lockedUntil: users.lockedUntil,
      })
      .from(users)
      .where(
        emailForLookup.includes("@")
          ? eq(users.email, emailForLookup)
          : ilike(users.username, loginId)
      )
      .limit(1);

    if (!user?.passwordHash) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    if (user.lockedUntil && new Date(user.lockedUntil) > new Date()) {
      return NextResponse.json({ error: "account_locked" }, { status: 403 });
    }

    const ok = await bcrypt.compare(password, user.passwordHash);
    if (!ok) {
      return NextResponse.json({ error: "invalid_credentials" }, { status: 401 });
    }

    await db
      .update(users)
      .set({ loginAttempts: 0, lastLoginAt: new Date(), lockedUntil: null })
      .where(eq(users.id, user.id));

    const accessToken = encodeMobileParentToken(user.id);
    const onboarded = isUserFullyOnboarded(user.role, user.onboardingStep);

    return NextResponse.json({
      accessToken,
      user: {
        id: user.id,
        email: user.email,
        fullName: user.fullName,
        role: user.role,
        onboardingStep: user.onboardingStep ?? 1,
        onboarded,
      },
    });
  } catch {
    return NextResponse.json({ error: "server_error" }, { status: 500 });
  }
}

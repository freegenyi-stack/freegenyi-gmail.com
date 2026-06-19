import { NextResponse } from "next/server";
import { requireMobileParent } from "@/lib/mobile/require-mobile-auth";
import { isUserFullyOnboarded } from "@/lib/auth/dashboard-route";

export async function GET(request: Request) {
  const auth = await requireMobileParent(request);
  if (auth instanceof NextResponse) return auth;
  const { user } = auth;

  return NextResponse.json({
    user: {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
      onboardingStep: user.onboardingStep ?? 1,
      onboarded: isUserFullyOnboarded(user.role, user.onboardingStep),
    },
  });
}

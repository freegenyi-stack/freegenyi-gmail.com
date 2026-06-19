import { NextResponse } from "next/server";
import { requireMobileParent } from "@/lib/mobile/require-mobile-auth";
import { getFamilyChildren } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";

export async function GET(request: Request) {
  const auth = await requireMobileParent(request);
  if (auth instanceof NextResponse) return auth;

  const { user } = auth;
  if (!isFamilyAdult(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const children = await getFamilyChildren(user);
  return NextResponse.json({
    children: children.map((c) => ({
      id: c.id,
      fullName: c.fullName,
      educationLevel: c.educationLevel,
      firstName: c.fullName.split(" ")[0],
    })),
  });
}

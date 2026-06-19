import { NextResponse } from "next/server";
import { requireMobileParent } from "@/lib/mobile/require-mobile-auth";
import { getFamilyChildren } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { getUnifiedParentHistory } from "@/lib/parent/parent-history.server";

export async function GET(request: Request) {
  const auth = await requireMobileParent(request);
  if (auth instanceof NextResponse) return auth;

  if (!isFamilyAdult(auth.user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const children = await getFamilyChildren(auth.user);
  const childIds = children.map((c) => c.id);
  const childNames = Object.fromEntries(children.map((c) => [c.id, c.fullName]));

  const limit = parseInt(new URL(request.url).searchParams.get("limit") || "60", 10);
  const items = await getUnifiedParentHistory(auth.user.id, childIds, childNames, limit);

  return NextResponse.json({
    items: items.map((item) => ({
      id: item.id,
      source: item.source,
      type: item.type,
      title: item.title,
      detail: item.detail,
      childName: item.childName,
      date: item.date.toISOString(),
    })),
  });
}

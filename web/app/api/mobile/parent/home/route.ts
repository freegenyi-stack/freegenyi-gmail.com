import { NextResponse } from "next/server";
import { requireMobileParent } from "@/lib/mobile/require-mobile-auth";
import { getFamilyChildren } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import { listChildAtelierMissions } from "@/lib/child/gamification.server";
import { getPendingWorksheetsForChild } from "@/lib/parent/parent-worksheets.server";
import { parseChildLearningProfileJson } from "@/lib/child/learning-profile";

export async function GET(request: Request) {
  const auth = await requireMobileParent(request);
  if (auth instanceof NextResponse) return auth;

  const { user } = auth;
  if (!isFamilyAdult(user.role)) {
    return NextResponse.json({ error: "forbidden" }, { status: 403 });
  }

  const children = await getFamilyChildren(user);
  const summaries = await Promise.all(
    children.map(async (child) => {
      const [missions, worksheets] = await Promise.all([
        listChildAtelierMissions(child.id, 50),
        getPendingWorksheetsForChild(child.id, 10),
      ]);
      const pendingMissions = missions.filter(
        (m) => m.status === "pending" || m.status === "in_progress"
      ).length;
      const profile = parseChildLearningProfileJson(child.learningProfile);
      return {
        id: child.id,
        fullName: child.fullName,
        firstName: child.fullName.split(" ")[0],
        educationLevel: child.educationLevel,
        pendingMissions,
        pendingGeny: worksheets.length,
        learningMode: profile.learningMode,
        dailyScreenMinutes: profile.dailyScreenMinutes ?? 20,
      };
    })
  );

  return NextResponse.json({
    user: {
      id: user.id,
      fullName: user.fullName,
      email: user.email,
    },
    children: summaries,
    totals: {
      children: summaries.length,
      pendingMissions: summaries.reduce((s, c) => s + c.pendingMissions, 0),
      pendingGeny: summaries.reduce((s, c) => s + c.pendingGeny, 0),
    },
  });
}

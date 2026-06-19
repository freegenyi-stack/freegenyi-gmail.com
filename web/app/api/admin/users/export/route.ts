import { NextResponse } from "next/server";
import { requireAdminSession } from "@/lib/admin/requireAdmin";
import { listAdminUsers } from "@/lib/admin/stats.server";

export async function GET() {
  const admin = await requireAdminSession();
  if ("error" in admin) {
    return NextResponse.json({ error: admin.error }, { status: 401 });
  }

  const users = await listAdminUsers(5000);
  const header = "id,fullName,email,username,role,isBanned,createdAt\n";
  const lines = users.map((u) =>
    [
      u.id,
      `"${(u.fullName ?? "").replace(/"/g, '""')}"`,
      u.email,
      u.username ?? "",
      u.role ?? "",
      u.isBanned ? "1" : "0",
      u.createdAt ?? "",
    ].join(",")
  );

  const csv = header + lines.join("\n");

  return new NextResponse(csv, {
    headers: {
      "Content-Type": "text/csv; charset=utf-8",
      "Content-Disposition": 'attachment; filename="freegeny-users.csv"',
    },
  });
}

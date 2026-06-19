import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { buildProgramHub } from "@/lib/curriculum/hub.server";
import ProgrammeHubClient from "@/components/curriculum/ProgrammeHubClient";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function TeacherProgrammePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.role !== "teacher") redirect("/dashboard");

  const hub = await buildProgramHub("DZ", "1AP");
  if (!hub) redirect("/dashboard/enseignant");

  const { locale } = await params;

  return (
    <ProgrammeHubClient
      hub={hub}
      mode="teacher"
      basePath={`/${locale}/dashboard/enseignant/programme`}
    />
  );
}

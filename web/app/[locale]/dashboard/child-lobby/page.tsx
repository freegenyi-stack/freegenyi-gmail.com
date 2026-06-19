import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren } from "@/lib/family/server";

export default async function ChildLobbyRedirectPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (session?.user?.email) {
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (user) {
      const kids = await getFamilyChildren(user);
      if (kids[0]) {
        redirect(`/${locale}/lobby/${kids[0].id}`);
      }
    }
  }

  redirect(`/${locale}/child`);
}

import React from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { isAdultProfileComplete } from "@/lib/family/server";
import CompleteProfileClient from "./CompleteProfileClient";

export default async function CompleteProfilePage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();
  if (!session?.user?.id) redirect(`/${locale}/auth/login`);

  const userId = parseInt(session.user.id, 10);
  const [user] = await db.select().from(users).where(eq(users.id, userId)).limit(1);
  if (!user || user.role !== "coparent") redirect(`/${locale}/dashboard/parent`);

  const complete = await isAdultProfileComplete(userId, user.role);
  if (complete) redirect(`/${locale}/dashboard/parent`);

  return <CompleteProfileClient locale={locale} />;
}

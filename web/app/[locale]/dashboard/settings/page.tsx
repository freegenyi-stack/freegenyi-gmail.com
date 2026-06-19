import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { redirect } from "next/navigation";
import { isFamilyAdult } from "@/lib/family/constants";
import SettingsClient from "./SettingsClient";

export default async function SettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`);
  }

  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  if (isFamilyAdult(user.role)) {
    redirect(`/${locale}/dashboard/parent/reglages`);
  }

  return (
    <div className="bg-slate-50 min-h-full pb-24 font-dm-sans">
      <div className="max-w-6xl mx-auto px-6 md:px-12 py-12">
        <header className="mb-12">
          <h1 className="text-4xl font-black text-slate-900 tracking-tight font-jakarta">Configuration</h1>
          <p className="text-slate-500 font-medium mt-2">Gérez votre profil et personnalisez votre expérience.</p>
        </header>

        <SettingsClient user={user} locale={locale} />
      </div>
    </div>
  );
}

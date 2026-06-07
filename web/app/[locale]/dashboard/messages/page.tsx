import React, { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import MessagesClient from "@/components/messages/MessagesClient";
import { isAdultProfileComplete } from "@/lib/family/server";
import { isFamilyAdult } from "@/lib/family/constants";
import ProfileCompleteBanner from "@/components/family/ProfileCompleteBanner";

function MessagesLoading() {
  return (
    <div className="flex min-h-[50vh] items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-orange-500 border-t-transparent" />
    </div>
  );
}

export default async function MessagesPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.email) {
    redirect(`/${locale}/auth/login`);
  }

  const [user] = await db
    .select({ id: users.id, role: users.role })
    .from(users)
    .where(eq(users.email, session.user.email));

  const role = user?.role || "parent";
  const profileComplete = user ? await isAdultProfileComplete(user.id, role) : true;

  if (isFamilyAdult(role) && !profileComplete) {
    return (
      <div className="min-h-full bg-slate-50 px-4 py-8">
        <div className="mx-auto max-w-2xl">
          <ProfileCompleteBanner locale={locale} role={role} complete={false} />
          <p className="text-center text-sm text-slate-500">
            La messagerie enseignant sera disponible après vérification de votre identité.
          </p>
        </div>
      </div>
    );
  }

  return (
    <Suspense fallback={<MessagesLoading />}>
      <MessagesClient role={role === "coparent" ? "parent" : role} />
    </Suspense>
  );
}

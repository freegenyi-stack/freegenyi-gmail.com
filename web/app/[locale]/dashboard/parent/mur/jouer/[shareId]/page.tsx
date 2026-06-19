import React from "react";
import { notFound, redirect } from "next/navigation";
import { auth } from "@/auth";
import { db } from "@/db";
import { users } from "@/db/schema";
import { eq } from "drizzle-orm";
import { getFamilyChildren } from "@/lib/family/server";
import { getMurShareForPlay } from "@/lib/authoring/attempts.server";
import MurActivityPlayClient from "@/components/pedagogy/MurActivityPlayClient";

export const dynamic = "force-dynamic";

export default async function ParentMurJouerPage({
  params,
}: {
  params: Promise<{ locale: string; shareId: string }>;
}) {
  const { locale, shareId: shareIdParam } = await params;
  const session = await auth();
  if (!session?.user?.email) redirect(`/${locale}/auth/login`);

  const [user] = await db.select().from(users).where(eq(users.email, session.user.email));
  if (!user) redirect(`/${locale}/auth/login`);

  const shareId = parseInt(shareIdParam, 10);
  if (Number.isNaN(shareId)) notFound();

  const share = await getMurShareForPlay(shareId);
  if (!share?.authoringResourceId) notFound();

  const children = await getFamilyChildren(user);

  return (
    <div className="min-h-full bg-[#FFFBF7]">
      <div className="mx-auto max-w-3xl">
        <MurActivityPlayClient
          shareId={shareId}
          shareTitle={share.title}
          contentJson={share.contentJson}
          h5pLibrary={share.h5pLibrary}
          resourceId={share.authoringResourceId}
          resourceTitle={share.resourceTitle}
          locale={locale}
          children={children.map((c) => ({ id: c.id, fullName: c.fullName }))}
        />
      </div>
    </div>
  );
}

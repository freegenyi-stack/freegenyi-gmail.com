import { auth } from "@/auth";
import { db } from "@/db";
import { childDevicePairings, users } from "@/db/schema";
import { eq, and } from "drizzle-orm";
import { listChildAssignedBooks, listContinueReading } from "@/lib/library/books.server";
import { getLibraryDiscovery, bookCoverSrc } from "@/lib/library/discovery.server";
import { audiencesForContext } from "@/lib/library/audience";
import { getFamilyChildren, userCanAccessChild } from "@/lib/family/server";
import { redirect, notFound } from "next/navigation";
import { getChildSessionFromCookies } from "@/lib/child-session";
import BibliothequeClient from "@/app/[locale]/dashboard/parent/bibliotheque/BibliothequeClient";

export default async function ChildLobbyBibliothequePage({
  params,
}: {
  params: Promise<{ locale: string; childId: string }>;
}) {
  const { locale, childId: childIdStr } = await params;
  const childId = parseInt(childIdStr, 10);
  if (Number.isNaN(childId)) notFound();

  const session = await auth();
  const childSession = await getChildSessionFromCookies();
  let allowed = false;

  if (session?.user?.email) {
    const [user] = await db.select().from(users).where(eq(users.email, session.user.email)).limit(1);
    if (user) {
      const children = await getFamilyChildren(user);
      const child = children.find((c) => c.id === childId);
      if (child) allowed = await userCanAccessChild(user, child);
    }
  } else if (childSession?.childId === childId) {
    const [pairing] = await db
      .select()
      .from(childDevicePairings)
      .where(
        and(
          eq(childDevicePairings.childId, childId),
          eq(childDevicePairings.deviceToken, childSession.deviceToken)
        )
      )
      .limit(1);
    allowed = !!pairing;
  }

  if (!allowed) redirect(`/${locale}/child`);

  const childAudiences = audiencesForContext("child");

  const [assignedBooks, continueReading, discovery] = await Promise.all([
    listChildAssignedBooks(childId),
    listContinueReading([childId], 6),
    getLibraryDiscovery(6, childAudiences),
  ]);

  const progressMap = Object.fromEntries(continueReading.map((c) => [c.bookId, c.percent]));

  return (
    <div className="min-h-screen bg-[#020617] p-6 text-white sm:p-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-2xl font-black sm:text-3xl">Ma bibliothèque</h1>
        <p className="mt-1 text-sm text-slate-400">Tes livres assignés par l&apos;école.</p>
        <div className="mt-8">
          <BibliothequeClient
            books={assignedBooks}
            assignments={[]}
            continueReading={continueReading}
            progressMap={progressMap}
            discovery={discovery}
            basePath={`/lobby/${childId}/bibliotheque`}
            childId={childId}
            dark
            userId={null}
          />
        </div>
      </div>
    </div>
  );
}

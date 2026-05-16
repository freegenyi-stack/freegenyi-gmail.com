import React from "react";
import { auth } from "@/auth";
import { db } from "@/db";
import { users, children as childrenTable } from "@/db/schema";
import { eq, desc } from "drizzle-orm";
import { redirect } from "next/navigation";
import ChildrenClient from "./ChildrenClient";

export default async function ChildrenPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const session = await auth();

  if (!session?.user?.id) {
    redirect(`/${locale}/auth/login`);
  }

  // Fetch parent data
  const [user] = await db
    .select()
    .from(users)
    .where(eq(users.id, parseInt(session.user.id)));

  if (!user) {
    redirect(`/${locale}/auth/login`);
  }

  // Fetch children list
  const childrenData = await db
    .select()
    .from(childrenTable)
    .where(eq(childrenTable.parentId, user.id))
    .orderBy(desc(childrenTable.createdAt));

  return (
    <div className="bg-slate-50 min-h-[calc(100vh-4rem)] pb-24 font-dm-sans">
      <div className="max-w-7xl mx-auto px-6 md:px-12 py-12">
        <ChildrenClient 
          initialChildren={childrenData} 
          locale={locale}
          userName={user.fullName || "Parent"}
        />
      </div>
    </div>
  );
}

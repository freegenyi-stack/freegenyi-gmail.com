import React from "react";
import ParentHistoryClient from "@/components/parent/ParentHistoryClient";
import { getUnifiedParentHistory } from "@/lib/parent/parent-history.server";
import { requireParentPage } from "@/lib/parent/requireParentPage";

export default async function ParentHistoryPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, children } = await requireParentPage(locale);
  const childNames = Object.fromEntries(children.map((c) => [c.id, c.fullName]));
  const history = await getUnifiedParentHistory(
    user.id,
    children.map((c) => c.id),
    childNames,
    80
  );

  return <ParentHistoryClient history={history} />;
}

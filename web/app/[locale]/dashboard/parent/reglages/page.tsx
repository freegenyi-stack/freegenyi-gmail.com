import React from "react";
import ParentSettingsClient from "@/components/parent/ParentSettingsClient";
import { parseParentPreferences } from "@/lib/parent/parent-settings";
import { requireParentPage } from "@/lib/parent/requireParentPage";

export default async function ParentSettingsPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const { user, children, selectedChildId } = await requireParentPage(locale);

  return (
    <ParentSettingsClient
      children={children.map((c) => ({
        id: c.id,
        fullName: c.fullName,
        learningProfile: c.learningProfile,
      }))}
      selectedChildId={selectedChildId}
      preferences={parseParentPreferences(user.metadata)}
    />
  );
}

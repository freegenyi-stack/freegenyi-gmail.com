"use client";

import React from "react";
import type { ChildLearningProfile } from "@/lib/child/learning-profile";
import ChildNeedsStep from "./ChildNeedsStep";
import ChildLearningPreferencesStep from "./ChildLearningPreferencesStep";

type Props = {
  childAge: string;
  value: ChildLearningProfile;
  onChange: (next: ChildLearningProfile) => void;
  /** @deprecated Utiliser ChildNeedsStep ou ChildLearningPreferencesStep séparément */
  variant?: "all" | "needs" | "learning";
};

export default function ChildLearningProfileStep({
  childAge,
  value,
  onChange,
  variant = "all",
}: Props) {
  if (variant === "needs") {
    return <ChildNeedsStep value={value} onChange={onChange} />;
  }
  if (variant === "learning") {
    return <ChildLearningPreferencesStep childAge={childAge} value={value} onChange={onChange} />;
  }

  return (
    <div className="space-y-8">
      <ChildNeedsStep value={value} onChange={onChange} />
      <ChildLearningPreferencesStep childAge={childAge} value={value} onChange={onChange} />
    </div>
  );
}

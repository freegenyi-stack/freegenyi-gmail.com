"use client";

import React from "react";
import { useTranslations } from "next-intl";
import { Link } from "@/i18n/routing";
import { ArrowLeft } from "lucide-react";
import { cn } from "@/lib/utils";
import type { TeacherPublicProfile } from "@/lib/teacher/profile.types";
import { teacherProfileBackHref } from "@/lib/teacher/profile-links";
import TeacherPublicProfileCard from "./TeacherPublicProfileCard";

export default function TeacherPublicProfileView({
  profile,
  viewerRole,
}: {
  profile: TeacherPublicProfile;
  viewerRole?: string | null;
}) {
  const t = useTranslations("TeacherProfile");
  const backHref = teacherProfileBackHref(viewerRole);
  const parentView = viewerRole === "parent" || viewerRole === "coparent";

  return (
    <div>
      <Link
        href={backHref}
        className={cn(
          "mb-6 inline-flex items-center gap-2 text-sm font-black text-slate-600",
          parentView ? "hover:text-orange-600" : "hover:text-teal-600"
        )}
      >
        <ArrowLeft className="h-4 w-4" />
        {t("backToWall")}
      </Link>
      <TeacherPublicProfileCard profile={profile} viewerRole={viewerRole} />
    </div>
  );
}

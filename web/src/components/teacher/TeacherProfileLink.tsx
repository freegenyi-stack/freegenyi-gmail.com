"use client";

import React from "react";
import { Link } from "@/i18n/routing";
import { teacherPublicProfileHref } from "@/lib/teacher/profile-links";
import { cn } from "@/lib/utils";

type Props = {
  teacherId: number;
  viewerRole?: string | null;
  className?: string;
  children: React.ReactNode;
  /** Nom seul — style lien discret */
  variant?: "default" | "name";
};

/** Clic avatar / nom → carte publique enseignant (parents & collègues). */
function isParentViewer(role?: string | null) {
  return role === "parent" || role === "coparent";
}

export default function TeacherProfileLink({
  teacherId,
  viewerRole,
  className,
  children,
  variant = "default",
}: Props) {
  const href = teacherPublicProfileHref(viewerRole, teacherId);
  const parentView = isParentViewer(viewerRole);

  return (
    <Link
      href={href}
      className={cn(
        variant === "name" &&
          (parentView
            ? "font-black text-slate-900 hover:text-orange-600 hover:underline"
            : "font-black text-slate-900 hover:text-teal-600 hover:underline"),
        variant === "default" &&
          (parentView
            ? "shrink-0 rounded-full transition hover:opacity-90 hover:ring-2 hover:ring-orange-300/60"
            : "shrink-0 rounded-full transition hover:opacity-90 hover:ring-2 hover:ring-teal-300/60"),
        className
      )}
    >
      {children}
    </Link>
  );
}

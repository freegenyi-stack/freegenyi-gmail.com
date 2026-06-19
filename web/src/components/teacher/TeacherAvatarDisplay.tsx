"use client";

import React from "react";
import { cn } from "@/lib/utils";
import { getLuxuryAvatar } from "@/lib/teacher/avatar-catalog";

type Props = {
  fullName: string;
  image?: string | null;
  avatarConfig?: { id: string; style?: string } | null;
  avatarMode?: "photo" | "catalog";
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
};

const SIZES = {
  sm: "h-10 w-10 text-sm",
  md: "h-14 w-14 text-lg",
  lg: "h-20 w-20 text-2xl",
  xl: "h-28 w-28 text-3xl",
};

export default function TeacherAvatarDisplay({
  fullName,
  image,
  avatarConfig,
  avatarMode = "catalog",
  size = "md",
  className,
}: Props) {
  const sizeClass = SIZES[size];
  const initials = fullName
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (avatarMode === "photo" && image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={image}
        alt=""
        className={cn(sizeClass, "rounded-2xl object-cover shadow-lg ring-2 ring-white", className)}
      />
    );
  }

  const luxury = getLuxuryAvatar(avatarConfig?.id);
  if (luxury) {
    const Icon = luxury.icon;
    return (
      <div
        className={cn(
          sizeClass,
          "flex items-center justify-center rounded-2xl bg-gradient-to-br text-white shadow-lg ring-2",
          luxury.gradient,
          luxury.ring,
          className
        )}
      >
        <Icon className={size === "xl" ? "h-10 w-10" : size === "lg" ? "h-8 w-8" : "h-5 w-5"} />
      </div>
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "flex items-center justify-center rounded-2xl bg-gradient-to-br from-teal-500 to-emerald-700 font-black text-white shadow-lg",
        className
      )}
    >
      {initials}
    </div>
  );
}

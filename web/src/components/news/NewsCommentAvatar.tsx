"use client";

import React from "react";
import {
  Calculator,
  Code2,
  Feather,
  FlaskConical,
  Paintbrush,
  Rocket,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { getLuxuryAvatar } from "@/lib/teacher/avatar-catalog";
import type { NewsCommentAuthor } from "@/lib/news/comments.server";

const PARENT_ICONS: Record<string, React.ReactNode> = {
  scientist: <FlaskConical className="h-3.5 w-3.5" />,
  math: <Calculator className="h-3.5 w-3.5" />,
  lit: <Feather className="h-3.5 w-3.5" />,
  artist: <Paintbrush className="h-3.5 w-3.5" />,
  astro: <Rocket className="h-3.5 w-3.5" />,
  tech: <Code2 className="h-3.5 w-3.5" />,
};

const PARENT_BG: Record<string, string> = {
  scientist: "bg-sky-600",
  math: "bg-orange-600",
  lit: "bg-emerald-600",
  artist: "bg-violet-600",
  astro: "bg-indigo-600",
  tech: "bg-neutral-800",
};

type Props = {
  author: NewsCommentAuthor;
  size?: "sm" | "md" | "lg" | "sticker";
  className?: string;
};

const SIZE_CLASS = {
  sm: "h-8 w-8 text-[10px]",
  md: "h-10 w-10 text-xs",
  lg: "h-12 w-12 text-sm",
  sticker: "h-14 w-14 text-base",
};

export default function NewsCommentAvatar({ author, size = "md", className }: Props) {
  const sizeClass = SIZE_CLASS[size];
  const initials = author.name
    .split(/\s+/)
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  if (author.role === "enseignant") {
    if (author.image) {
      return (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={author.image}
          alt=""
          className={cn(sizeClass, "shrink-0 rounded-full object-cover ring-2 ring-white shadow-md", className)}
        />
      );
    }
    const luxury = author.avatarConfig?.id ? getLuxuryAvatar(author.avatarConfig.id) : null;
    if (luxury) {
      const Icon = luxury.icon;
      return (
        <div
          className={cn(
            sizeClass,
            "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br text-white shadow-md ring-2 ring-white",
            luxury.gradient,
            className
          )}
        >
          <Icon className={size === "lg" || size === "sticker" ? "h-5 w-5" : "h-3.5 w-3.5"} />
        </div>
      );
    }
  }

  const ac = author.avatarConfig;
  if (ac?.id && PARENT_ICONS[ac.id]) {
    return (
      <div
        className={cn(
          sizeClass,
          "flex shrink-0 items-center justify-center rounded-full text-white shadow-md ring-2 ring-white",
          PARENT_BG[ac.id],
          className
        )}
      >
        {PARENT_ICONS[ac.id]}
      </div>
    );
  }

  if (author.image) {
    return (
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={author.image}
        alt=""
        className={cn(sizeClass, "shrink-0 rounded-full object-cover ring-2 ring-white shadow-md", className)}
      />
    );
  }

  return (
    <div
      className={cn(
        sizeClass,
        "flex shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-slate-700 to-slate-900 font-bold text-white shadow-md ring-2 ring-white",
        className
      )}
    >
      {initials || "?"}
    </div>
  );
}

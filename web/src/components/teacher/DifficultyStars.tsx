"use client";

import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

type Props = {
  level: number;
  max?: number;
  size?: "sm" | "md";
  className?: string;
};

export default function DifficultyStars({ level, max = 3, size = "sm", className }: Props) {
  const clamped = Math.min(max, Math.max(1, level));
  const iconClass = size === "sm" ? "h-3.5 w-3.5" : "h-4 w-4";

  return (
    <span className={cn("inline-flex items-center gap-0.5", className)} aria-label={`Difficulté ${clamped}/${max}`}>
      {Array.from({ length: max }, (_, i) => (
        <Star
          key={i}
          className={cn(iconClass, i < clamped ? "fill-amber-400 text-amber-400" : "text-slate-200")}
        />
      ))}
    </span>
  );
}

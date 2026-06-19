"use client";

import { cn } from "@/lib/utils";
import { useId } from "react";

type Props = {
  className?: string;
  dotColor?: string;
  spacing?: number;
};

export default function DotPattern({ className, dotColor = "rgba(15, 23, 42, 0.12)", spacing = 22 }: Props) {
  const id = useId().replace(/:/g, "");
  return (
    <svg
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 h-full w-full", className)}
    >
      <defs>
        <pattern id={`dot-${id}`} x="0" y="0" width={spacing} height={spacing} patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.2" fill={dotColor} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill={`url(#dot-${id})`} />
    </svg>
  );
}

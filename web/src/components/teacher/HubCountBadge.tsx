"use client";

import { cn } from "@/lib/utils";

export default function HubCountBadge({ count, className }: { count: number; className?: string }) {
  if (!count || count <= 0) return null;
  const label = count > 99 ? "99+" : String(count);
  return (
    <span
      className={cn(
        "absolute -end-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-black text-white shadow-md ring-2 ring-white",
        className
      )}
    >
      {label}
    </span>
  );
}

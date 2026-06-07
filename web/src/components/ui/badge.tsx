import * as React from "react";
import { cn } from "@/lib/utils";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: "default" | "accent" | "outline";
}

function Badge({ className, variant = "default", ...props }: BadgeProps) {
  return (
    <div
      className={cn(
        "inline-flex items-center justify-center rounded-full px-2 py-0.5 text-[10px] font-bold tabular-nums transition-colors",
        variant === "default" && "bg-slate-900 text-white",
        variant === "accent" && "bg-gradient-to-r from-orange-500 to-amber-500 text-white shadow-sm",
        variant === "outline" && "border border-slate-200 text-slate-600 bg-white",
        className
      )}
      {...props}
    />
  );
}

export { Badge };

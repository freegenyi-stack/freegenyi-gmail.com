import React from "react";
import { cn } from "@/lib/utils";

export default function ParentAtelierFocusFrame({
  children,
  className,
  wide,
}: {
  children: React.ReactNode;
  className?: string;
  wide?: boolean;
}) {
  return (
    <div className={cn("min-h-screen bg-[#FFFBF7] p-4 sm:p-6", className)}>
      <div className={cn("mx-auto w-full", wide ? "max-w-6xl" : "max-w-4xl")}>{children}</div>
    </div>
  );
}

"use client";

import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

export default function AuroraBackground({ className, children }: Props) {
  return (
    <div className={cn("relative overflow-hidden", className)}>
      <div className="pointer-events-none absolute inset-0" aria-hidden>
        <div className="fg-aurora-blob fg-aurora-blob-1" />
        <div className="fg-aurora-blob fg-aurora-blob-2" />
        <div className="fg-aurora-blob fg-aurora-blob-3" />
        <div className="absolute inset-0 bg-gradient-to-b from-white/20 via-transparent to-white/60" />
      </div>
      {children}
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type BorderBeamProps = {
  className?: string;
  size?: number;
  duration?: number;
  delay?: number;
  colorFrom?: string;
  colorTo?: string;
  borderWidth?: number;
};

export function BorderBeam({
  className,
  size = 200,
  duration = 8,
  delay = 0,
  colorFrom = "#f97316",
  colorTo = "#2dd4bf",
  borderWidth = 1.5,
}: BorderBeamProps) {
  return (
    <div
      className={cn("pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]", className)}
      style={{ padding: borderWidth }}
    >
      <motion.div
        className="absolute inset-[-100%] opacity-90"
        style={{
          background: `conic-gradient(from 0deg, transparent 0deg, ${colorFrom} 60deg, ${colorTo} 120deg, transparent 180deg)`,
        }}
        animate={{ rotate: 360 }}
        transition={{
          duration,
          delay,
          repeat: Infinity,
          ease: "linear",
        }}
      />
      <div
        className="absolute rounded-[inherit] bg-inherit"
        style={{ inset: borderWidth }}
      />
    </div>
  );
}

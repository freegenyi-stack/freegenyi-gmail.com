"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Accent = "orange" | "teal" | "slate" | "gold" | "violet";

const accentStyles: Record<
  Accent,
  { ring: string; glow: string; icon: string; shine: string }
> = {
  orange: {
    ring: "from-orange-400 via-amber-300 to-orange-500",
    glow: "shadow-[0_0_40px_-8px_rgba(234,88,12,0.45)]",
    icon: "text-orange-600",
    shine: "from-orange-200/0 via-orange-100/80 to-orange-200/0",
  },
  teal: {
    ring: "from-teal-400 via-emerald-300 to-teal-500",
    glow: "shadow-[0_0_40px_-8px_rgba(20,184,166,0.4)]",
    icon: "text-teal-600",
    shine: "from-teal-200/0 via-teal-100/80 to-teal-200/0",
  },
  slate: {
    ring: "from-slate-400 via-slate-300 to-slate-500",
    glow: "shadow-[0_0_32px_-10px_rgba(15,23,42,0.25)]",
    icon: "text-slate-700",
    shine: "from-slate-200/0 via-white/60 to-slate-200/0",
  },
  gold: {
    ring: "from-amber-400 via-yellow-300 to-orange-400",
    glow: "shadow-[0_0_48px_-6px_rgba(245,158,11,0.5)]",
    icon: "text-amber-700",
    shine: "from-amber-200/0 via-amber-100/90 to-amber-200/0",
  },
  violet: {
    ring: "from-violet-400 via-purple-300 to-violet-500",
    glow: "shadow-[0_0_40px_-8px_rgba(139,92,246,0.35)]",
    icon: "text-violet-600",
    shine: "from-violet-200/0 via-violet-100/70 to-violet-200/0",
  },
};

type Props = {
  icon: LucideIcon;
  accent?: Accent;
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animate?: boolean;
};

const sizeMap = {
  sm: { box: "h-10 w-10", icon: "h-4 w-4", ring: "p-[2px]" },
  md: { box: "h-14 w-14", icon: "h-6 w-6", ring: "p-[2.5px]" },
  lg: { box: "h-16 w-16", icon: "h-7 w-7", ring: "p-[3px]" },
  xl: { box: "h-20 w-20", icon: "h-9 w-9", ring: "p-[3px]" },
};

export default function LuxuryIcon({
  icon: Icon,
  accent = "orange",
  size = "md",
  className,
  animate = true,
}: Props) {
  const s = sizeMap[size];
  const styles = accentStyles[accent];

  const inner = (
    <>
      <div
        className={cn(
          "absolute inset-0 rounded-2xl bg-gradient-to-br opacity-90",
          s.ring,
          styles.ring
        )}
      />
      <div
        className={cn(
          "relative flex h-full w-full items-center justify-center rounded-[14px] bg-white",
          styles.glow
        )}
      >
        <Icon className={cn(s.icon, styles.icon, "relative z-10")} strokeWidth={1.75} />
        <div className="fg-icon-shine pointer-events-none absolute inset-0 overflow-hidden rounded-[14px]">
          <div className={cn("fg-icon-shine-bar absolute inset-y-0 w-1/2 bg-gradient-to-r opacity-0", styles.shine)} />
        </div>
      </div>
    </>
  );

  if (!animate) {
    return <div className={cn("relative inline-flex shrink-0", s.box, className)}>{inner}</div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, rotate: -8 }}
      whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ scale: 1.06, rotate: 3 }}
      className={cn("relative inline-flex shrink-0", s.box, className)}
    >
      {inner}
    </motion.div>
  );
}

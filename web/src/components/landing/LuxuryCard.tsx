"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  accent?: "orange" | "teal" | "slate";
};

const accentBorder = {
  orange: "hover:border-orange-200 hover:shadow-[0_24px_60px_-20px_rgba(234,88,12,0.18)]",
  teal: "hover:border-teal-200 hover:shadow-[0_24px_60px_-20px_rgba(20,184,166,0.16)]",
  slate: "hover:border-slate-300 hover:shadow-[0_24px_60px_-24px_rgba(15,23,42,0.12)]",
};

export default function LuxuryCard({ children, className, featured, accent = "orange" }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative overflow-hidden rounded-3xl border transition-all duration-500",
        featured
          ? "border-slate-800/10 bg-gradient-to-br from-slate-900 via-slate-900 to-slate-800 text-white shadow-[0_32px_64px_-24px_rgba(15,23,42,0.45)]"
          : cn(
              "border-slate-200/80 bg-white/80 backdrop-blur-sm shadow-[0_8px_40px_-16px_rgba(15,23,42,0.08)]",
              accentBorder[accent]
            ),
        className
      )}
    >
      {!featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-orange-100/40 blur-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
        />
      )}
      {featured && (
        <div
          aria-hidden
          className="pointer-events-none absolute -left-12 -top-12 h-40 w-40 rounded-full bg-orange-500/20 blur-3xl"
        />
      )}
      <div className="relative z-10 p-6 md:p-8">{children}</div>
    </motion.div>
  );
}

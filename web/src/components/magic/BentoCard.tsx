"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import type { ReactNode } from "react";

type Props = {
  children: ReactNode;
  className?: string;
  featured?: boolean;
  icon?: ReactNode;
  delay?: number;
};

export default function BentoCard({ children, className, featured, icon, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -6 }}
      className={cn(
        "group relative overflow-hidden rounded-[1.75rem] border p-6 transition-shadow duration-500 md:p-8",
        featured
          ? "border-slate-900/10 bg-slate-950 text-white shadow-2xl shadow-slate-900/25 fg-bento-glow-dark"
          : "border-white/70 bg-white/75 shadow-lg shadow-slate-900/5 backdrop-blur-xl fg-bento-glow",
        className
      )}
    >
      <div
        className={cn(
          "pointer-events-none absolute -end-16 -top-16 h-40 w-40 rounded-full blur-3xl transition-opacity duration-500 group-hover:opacity-100",
          featured ? "bg-orange-500/25 opacity-60" : "bg-orange-400/20 opacity-40"
        )}
      />
      {icon && (
        <div
          className={cn(
            "relative mb-5 flex h-14 w-14 items-center justify-center rounded-2xl shadow-inner transition-transform duration-500 group-hover:scale-110",
            featured
              ? "bg-white/10 text-orange-300 ring-1 ring-white/20"
              : "bg-gradient-to-br from-orange-50 to-teal-50 text-orange-600 ring-1 ring-orange-100/80"
          )}
        >
          {icon}
        </div>
      )}
      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}

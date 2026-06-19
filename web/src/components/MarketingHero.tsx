"use client";

import React from "react";
import { motion } from "framer-motion";
import { AuroraBackground, DotPattern } from "@/components/magic";
import { cn } from "@/lib/utils";

interface MarketingHeroProps {
  title: string;
  subtitle: string;
  badge?: string;
  gradient?: string;
}

export default function MarketingHero({
  title,
  subtitle,
  badge,
  gradient = "from-orange-50/80 via-white to-teal-50/50",
}: MarketingHeroProps) {
  return (
    <AuroraBackground
      className={cn(
        "fg-marketing-hero relative -mt-[var(--header-height,72px)] bg-gradient-to-b pt-[calc(var(--header-height,72px)+6rem)] pb-20 lg:pt-[calc(var(--header-height,72px)+8rem)] lg:pb-28",
        gradient
      )}
    >
      <DotPattern className="opacity-50" spacing={24} dotColor="rgba(15, 23, 42, 0.08)" />

      <div className="relative z-10 mx-auto max-w-7xl px-6 text-center">
        {badge && (
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-8 inline-flex items-center gap-2 rounded-full border border-orange-200/60 bg-white/70 px-4 py-2 text-[10px] font-black uppercase tracking-[0.2em] text-orange-700 shadow-sm backdrop-blur-md"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-orange-500 animate-pulse" />
            {badge}
          </motion.div>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.05 }}
          className="mx-auto mb-5 max-w-4xl font-reem text-4xl font-black leading-[1.08] tracking-tight text-slate-900 md:text-6xl lg:text-7xl"
        >
          {title}
        </motion.h1>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="mx-auto mb-6 h-1 w-24 rounded-full bg-gradient-to-r from-orange-500 via-amber-400 to-teal-500"
        />
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.12 }}
          className="mx-auto max-w-2xl text-lg font-medium leading-relaxed text-slate-600 md:text-xl"
        >
          {subtitle}
        </motion.p>
      </div>
    </AuroraBackground>
  );
}

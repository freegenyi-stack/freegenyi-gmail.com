"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";

type Props = {
  icon: LucideIcon;
  title: string;
  description: string;
  isRTL?: boolean;
  delay?: number;
};

export default function FeatureTile({ icon: Icon, title, description, isRTL, delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -4 }}
      className={cn(
        "rounded-2xl border border-white/80 bg-white/90 p-5 shadow-[0_8px_32px_-16px_rgba(15,23,42,0.08)] ring-1 ring-orange-50 backdrop-blur-sm",
        isRTL && "text-right"
      )}
    >
      <div
        className={cn(
          "mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-50 to-amber-50 text-orange-600 ring-1 ring-orange-100/80",
          isRTL && "ms-auto"
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.5} />
      </div>
      <h3 className={cn("font-semibold text-slate-900", isRTL && "font-ui-ar text-lg")}>{title}</h3>
      <p className={cn("mt-2 text-sm leading-relaxed text-slate-600", isRTL && "font-lateef text-base")}>
        {description}
      </p>
    </motion.div>
  );
}

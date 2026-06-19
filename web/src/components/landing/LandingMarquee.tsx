"use client";

import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

type Props = {
  items: string[];
  className?: string;
};

export default function LandingMarquee({ items, className }: Props) {
  const loop = [...items, ...items];

  return (
    <div dir="ltr" className={cn("relative overflow-hidden border-y border-slate-100/80 bg-slate-50/50 py-4", className)}>
      <div aria-hidden className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-white to-transparent" />
      <div aria-hidden className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-white to-transparent" />
      <div className="fg-marquee-track flex w-max gap-4 px-4">
        {loop.map((item, i) => (
          <motion.span
            key={`${item}-${i}`}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: (i % items.length) * 0.05 }}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-slate-200/80 bg-white px-5 py-2 text-xs font-semibold text-slate-700 shadow-sm"
          >
            <span className="h-1.5 w-1.5 rounded-full bg-gradient-to-r from-orange-500 to-amber-400" />
            {item}
          </motion.span>
        ))}
      </div>
    </div>
  );
}

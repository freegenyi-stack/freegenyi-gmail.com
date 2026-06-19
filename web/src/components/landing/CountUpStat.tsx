"use client";

import { motion, useInView, animate } from "framer-motion";
import { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

type Props = {
  value: number;
  suffix?: string;
  label: string;
  delay?: number;
  className?: string;
};

export default function CountUpStat({ value, suffix = "", label, delay = 0, className }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { once: true, amount: 0.5 });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    const controls = animate(0, value, {
      duration: 1.4,
      delay,
      ease: [0.22, 1, 0.36, 1],
      onUpdate: (v) => setCount(Math.round(v)),
    });
    return () => controls.stop();
  }, [inView, value, delay]);

  return (
    <motion.div
      ref={ref}
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "relative overflow-hidden rounded-2xl border border-slate-200/80 bg-white/90 p-5 shadow-[0_8px_32px_-12px_rgba(15,23,42,0.08)] backdrop-blur-sm",
        className
      )}
    >
      <div aria-hidden className="absolute -right-4 -top-4 h-16 w-16 rounded-full bg-orange-100/50 blur-xl" />
      <p className="relative text-3xl font-bold tabular-nums tracking-tight text-slate-900">
        {count}
        {suffix}
      </p>
      <p className="relative mt-1.5 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-500">
        {label}
      </p>
    </motion.div>
  );
}

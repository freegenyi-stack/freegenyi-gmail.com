"use client";

import React, { useEffect, useState } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  value: number;
  label: string;
  suffix?: string;
  delay?: number;
};

function AnimatedNumber({ target, suffix }: { target: number; suffix: string }) {
  const [count, setCount] = useState(0);
  useEffect(() => {
    let start = 0;
    const step = target / 80;
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else setCount(Math.floor(start));
    }, 16);
    return () => clearInterval(timer);
  }, [target]);
  return (
    <>
      {count}
      {suffix}
    </>
  );
}

export default function StatPill({ value, label, suffix = "", delay = 0 }: Props) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ delay, duration: 0.4 }}
      className="fg-stat-pill group text-center"
    >
      <p className="text-2xl font-black tabular-nums text-slate-900 md:text-3xl">
        <AnimatedNumber target={value} suffix={suffix} />
      </p>
      <p className="mt-1 text-[10px] font-bold uppercase tracking-wider text-slate-400 transition-colors group-hover:text-orange-600">
        {label}
      </p>
    </motion.div>
  );
}

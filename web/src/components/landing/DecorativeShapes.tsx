"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";
import { useRef } from "react";

type ShapeFieldProps = {
  className?: string;
  children?: React.ReactNode;
  /** Parallax intensity 0–1 */
  intensity?: number;
};

export function ShapeField({ className, children, intensity = 0.15 }: ShapeFieldProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [40 * intensity, -40 * intensity]);

  return (
    <div ref={ref} className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}>
      <motion.div style={{ y }} className="absolute inset-0">
        {children}
      </motion.div>
    </div>
  );
}

export function DecoCircle({
  className,
  size = 120,
  delay = 0,
}: {
  className?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, scale: 0.8 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("fg-shape-float absolute rounded-full border border-orange-200/60 bg-orange-50/30", className)}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
    />
  );
}

export function DecoRing({
  className,
  size = 160,
  delay = 0,
}: {
  className?: string;
  size?: number;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, rotate: -20 }}
      whileInView={{ opacity: 1, rotate: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 1, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "fg-shape-spin-slow absolute rounded-full border-2 border-dashed border-teal-300/50",
        className
      )}
      style={{ width: size, height: size, animationDelay: `${delay}s` }}
    />
  );
}

export function DecoRect({
  className,
  width = 80,
  height = 80,
  delay = 0,
  rotate = 12,
}: {
  className?: string;
  width?: number;
  height?: number;
  delay?: number;
  rotate?: number;
}) {
  return (
    <motion.div
      aria-hidden
      initial={{ opacity: 0, y: 20, rotate: rotate - 8 }}
      whileInView={{ opacity: 1, y: 0, rotate }}
      viewport={{ once: true }}
      transition={{ duration: 0.7, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(
        "absolute rounded-2xl bg-gradient-to-br from-orange-100/50 to-teal-100/40 ring-1 ring-slate-200/60",
        className
      )}
      style={{ width, height }}
    />
  );
}

export function DecoLine({
  className,
  delay = 0,
}: {
  className?: string;
  delay?: number;
}) {
  return (
    <motion.div
      aria-hidden
      initial={{ scaleX: 0, opacity: 0 }}
      whileInView={{ scaleX: 1, opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.9, delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn("absolute h-px origin-left bg-gradient-to-r from-orange-300/60 via-teal-300/40 to-transparent", className)}
    />
  );
}

/** Preset hero decoration cluster */
export function HeroDecorations({ isRTL }: { isRTL?: boolean }) {
  return (
    <ShapeField className="z-0">
      <DecoCircle className={cn("top-8 opacity-70", isRTL ? "left-[8%]" : "right-[12%]")} size={140} delay={0.1} />
      <DecoRing className={cn("top-[35%] opacity-60", isRTL ? "right-[5%]" : "left-[3%]")} size={200} delay={0.2} />
      <DecoRect
        className={cn("top-[18%] opacity-80", isRTL ? "right-[18%]" : "left-[14%]")}
        width={64}
        height={64}
        rotate={-15}
        delay={0.15}
      />
      <DecoRect
        className={cn("bottom-[20%] opacity-70", isRTL ? "left-[10%]" : "right-[8%]")}
        width={48}
        height={96}
        rotate={22}
        delay={0.25}
      />
      <DecoLine className={cn("top-[55%] w-32", isRTL ? "right-[20%] origin-right" : "left-[18%]")} delay={0.3} />
      <div
        aria-hidden
        className={cn(
          "fg-hero-glow absolute rounded-full blur-3xl",
          isRTL ? "left-0 top-1/4" : "right-0 top-1/4"
        )}
      />
    </ShapeField>
  );
}

export function SectionDecorations({ variant = "default" }: { variant?: "default" | "warm" | "cool" }) {
  const warm = variant === "warm";
  const cool = variant === "cool";

  return (
    <ShapeField intensity={0.2} className="z-0">
      <DecoCircle
        className={cn("top-12 opacity-50", warm ? "right-[6%]" : cool ? "left-[4%]" : "right-[10%]")}
        size={100}
      />
      <DecoRing
        className={cn("bottom-16 opacity-40", warm ? "left-[8%]" : cool ? "right-[6%]" : "left-[12%]")}
        size={140}
        delay={0.1}
      />
      <DecoRect
        className={cn("top-1/2 opacity-60", warm ? "left-[5%]" : "right-[4%]")}
        width={56}
        height={56}
        rotate={-8}
        delay={0.15}
      />
    </ShapeField>
  );
}

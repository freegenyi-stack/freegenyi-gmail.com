"use client";

import { motion, useInView, type Variants } from "framer-motion";
import { useRef, type ReactNode } from "react";
import { cn } from "@/lib/utils";

type BlurFadeProps = {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  offset?: number;
  direction?: "up" | "down" | "left" | "right";
  blur?: string;
  inViewMargin?: string;
};

export function BlurFade({
  children,
  className,
  delay = 0,
  duration = 0.5,
  offset = 12,
  direction = "up",
  blur = "10px",
  inViewMargin = "-40px",
}: BlurFadeProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: inViewMargin as `${number}px` });

  const axis = direction === "left" || direction === "right" ? "x" : "y";
  const sign =
    direction === "down" || direction === "right" ? -1 : 1;

  const variants: Variants = {
    hidden: {
      [axis]: sign * offset,
      opacity: 0,
      filter: `blur(${blur})`,
    },
    visible: {
      [axis]: 0,
      opacity: 1,
      filter: "blur(0px)",
    },
  };

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={isInView ? "visible" : "hidden"}
      variants={variants}
      transition={{ duration, delay: 0.04 + delay, ease: [0.22, 1, 0.36, 1] }}
      className={cn(className)}
    >
      {children}
    </motion.div>
  );
}

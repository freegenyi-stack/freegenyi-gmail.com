"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { ScrollReveal } from "./ScrollReveal";
import { DecoRing, DecoRect } from "./DecorativeShapes";

type Props = {
  src: string;
  alt: string;
  quote?: string;
  isRTL?: boolean;
  className?: string;
};

export default function HeroFrame({ src, alt, quote, isRTL, className }: Props) {
  return (
    <ScrollReveal variant="scale" delay={0.15} className={cn("relative mx-auto w-full max-w-sm md:max-w-md", className)}>
      <DecoRing
        className={cn("absolute z-0 opacity-50", isRTL ? "-left-6 top-8" : "-right-6 top-8")}
        size={120}
      />
      <DecoRect
        className={cn("absolute z-0 opacity-60", isRTL ? "-right-4 bottom-12" : "-left-4 bottom-12")}
        width={40}
        height={72}
        rotate={isRTL ? -18 : 18}
      />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        className="relative z-10"
      >
        <div className="overflow-hidden rounded-[2rem] border border-slate-200/80 bg-white p-2 shadow-[0_32px_64px_-24px_rgba(15,23,42,0.18)]">
          <motion.div
            whileHover={{ scale: 1.02 }}
            transition={{ type: "spring", stiffness: 300, damping: 24 }}
            className="overflow-hidden rounded-[1.5rem]"
          >
            <Image
              src={src}
              alt={alt}
              width={560}
              height={560}
              priority
              className="aspect-square w-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).src = "/assets/img/hero_elite.png";
              }}
            />
          </motion.div>
        </div>
      </motion.div>

      {quote && (
        <motion.div
          initial={{ opacity: 0, y: 20, filter: "blur(6px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true }}
          transition={{ delay: 0.4, duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className={cn(
            "absolute -bottom-6 z-20 max-w-[88%] rounded-2xl border border-slate-200/80 bg-white/95 p-4 shadow-[0_20px_50px_-20px_rgba(15,23,42,0.15)] backdrop-blur-md",
            isRTL ? "right-0" : "left-0"
          )}
        >
          <p className={cn("text-sm font-medium leading-snug text-slate-700", isRTL && "font-ui-ar text-base")}>
            {quote}
          </p>
        </motion.div>
      )}
    </ScrollReveal>
  );
}

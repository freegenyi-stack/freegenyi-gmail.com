"use client";

import { motion } from "framer-motion";
import { BookOpen, Globe, Sparkles, Zap, Brain, Star } from "lucide-react";
import { cn } from "@/lib/utils";
import DotPattern from "@/components/magic/DotPattern";

function Float({ delay = 0, className, children }: { delay?: number; className?: string; children: React.ReactNode }) {
  return (
    <motion.div
      animate={{ y: [0, -12, 0] }}
      transition={{ duration: 5 + delay, repeat: Infinity, ease: "easeInOut", delay }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export default function HeroShowcase({ isRTL }: { isRTL?: boolean }) {
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[420px] lg:max-w-none">
      <DotPattern className="opacity-40 [mask-image:radial-gradient(ellipse_at_center,black,transparent_75%)]" />

      <motion.div
        animate={{ scale: [1, 1.08, 1], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 7, repeat: Infinity }}
        className={cn(
          "absolute h-48 w-48 rounded-full bg-orange-400/30 blur-3xl",
          isRTL ? "left-0 top-8" : "right-0 top-8"
        )}
      />
      <motion.div
        animate={{ scale: [1, 1.12, 1], opacity: [0.3, 0.55, 0.3] }}
        transition={{ duration: 9, repeat: Infinity, delay: 1 }}
        className={cn(
          "absolute h-40 w-40 rounded-full bg-teal-400/25 blur-3xl",
          isRTL ? "bottom-12 right-4" : "bottom-12 left-4"
        )}
      />

      <motion.div
        animate={{ rotate: 360 }}
        transition={{ duration: 28, repeat: Infinity, ease: "linear" }}
        className="absolute inset-[12%] rounded-full border border-dashed border-slate-200/80"
      />

      <Float
        className="absolute left-1/2 top-1/2 z-20 w-[58%] -translate-x-1/2 -translate-y-1/2"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
          className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950 p-5 shadow-2xl shadow-orange-500/20"
        >
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-orange-500/20 via-transparent to-teal-500/15" />
          <div className="relative flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-orange-500 to-amber-400 shadow-lg shadow-orange-500/40">
              <Globe className="h-6 w-6 text-white" strokeWidth={1.75} />
            </div>
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-orange-300/90">Portal</p>
              <p className="text-lg font-bold text-white">World</p>
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-2">
            {[Brain, Star, Zap].map((Icon, i) => (
              <motion.div
                key={i}
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                className="flex h-10 items-center justify-center rounded-xl bg-white/5 ring-1 ring-white/10"
              >
                <Icon className="h-4 w-4 text-orange-200" />
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Float>

      <Float
        delay={0.5}
        className={cn(
          "absolute top-[18%] z-10 w-[42%] rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-md",
          isRTL ? "right-[2%] rotate-[6deg]" : "left-[2%] -rotate-[6deg]"
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-teal-50 text-teal-600">
          <BookOpen className="h-4 w-4" />
        </div>
        <p className="mt-2 text-xs font-bold text-slate-800">Local</p>
        <div className="mt-2 h-1.5 w-full overflow-hidden rounded-full bg-slate-100">
          <motion.div
            animate={{ width: ["30%", "78%", "55%"] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="h-full rounded-full bg-gradient-to-r from-teal-400 to-teal-600"
          />
        </div>
      </Float>

      <Float
        delay={1}
        className={cn(
          "absolute bottom-[16%] z-10 w-[42%] rounded-2xl border border-slate-200/80 bg-white/90 p-4 shadow-xl backdrop-blur-md",
          isRTL ? "left-[2%] -rotate-[5deg]" : "right-[2%] rotate-[5deg]"
        )}
      >
        <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-violet-50 text-violet-600">
          <Sparkles className="h-4 w-4" />
        </div>
        <p className="mt-2 text-xs font-bold text-slate-800">Magic</p>
        <div className="mt-2 flex gap-1">
          {[0, 1, 2, 3].map((i) => (
            <motion.span
              key={i}
              animate={{ scale: [1, 1.4, 1] }}
              transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.15 }}
              className="h-1.5 w-1.5 rounded-full bg-violet-400"
            />
          ))}
        </div>
      </Float>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 3.5, repeat: Infinity }}
        className={cn(
          "absolute z-30 rounded-full border border-orange-200 bg-white px-3 py-1 text-[10px] font-bold text-orange-600 shadow-lg",
          isRTL ? "bottom-[8%] right-[10%]" : "bottom-[8%] left-[10%]"
        )}
      >
        +16 langues
      </motion.div>
    </div>
  );
}

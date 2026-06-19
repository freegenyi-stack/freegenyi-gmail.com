"use client";

import type { ReactNode } from "react";
import { useRef } from "react";
import { motion, useInView, useScroll, useTransform } from "framer-motion";
import { cn } from "@/lib/utils";

type Variant =
  | "hero"
  | "classroom"
  | "about"
  | "testimonials"
  | "gallery"
  | "events"
  | "stats"
  | "cta";

/* ── Palette Padora ── */
const C = {
  orange: "#F97316",
  coral: "#FB7185",
  teal: "#14B8A6",
  mint: "#5EEAD4",
  amber: "#FBBF24",
  violet: "#A78BFA",
  sky: "#38BDF8",
  rose: "#FDA4AF",
} as const;

function StarBurst({ className, size = 48, fill = "currentColor" }: { className?: string; size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <path d="M50 4 L58 38 L92 38 L64 58 L74 92 L50 70 L26 92 L36 58 L8 38 L42 38 Z" fill={fill} />
    </svg>
  );
}

function Sparkle({ className, size = 14, fill = "currentColor" }: { className?: string; size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" className={className}>
      <path d="M12 0 L13.5 9 L22.5 10.5 L13.5 12 L12 21 L10.5 12 L1.5 10.5 L10.5 9 Z" fill={fill} />
    </svg>
  );
}

function Asterisk({ className, size = 32, stroke = "currentColor" }: { className?: string; size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" stroke={stroke} strokeWidth="7" strokeLinecap="round">
      <line x1="50" y1="12" x2="50" y2="88" />
      <line x1="12" y1="50" x2="88" y2="50" />
      <line x1="24" y1="24" x2="76" y2="76" />
      <line x1="76" y1="24" x2="24" y2="76" />
    </svg>
  );
}

function Hexagon({ className, size = 56, fill = "currentColor", stroke = "currentColor" }: { className?: string; size?: number; fill?: string; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <polygon points="50,4 93,27 93,73 50,96 7,73 7,27" fill={fill} fillOpacity="0.35" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

function Octagon({ className, size = 40, stroke = "currentColor" }: { className?: string; size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <polygon points="30,5 70,5 95,30 95,70 70,95 30,95 5,70 5,30" fill="none" stroke={stroke} strokeWidth="2.5" strokeDasharray="6 4" />
    </svg>
  );
}

function Pentagon({ className, size = 44, fill = "currentColor", stroke = "currentColor" }: { className?: string; size?: number; fill?: string; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className}>
      <polygon points="50,6 94,38 76,92 24,92 6,38" fill={fill} fillOpacity="0.3" stroke={stroke} strokeWidth="2" />
    </svg>
  );
}

function Blob({ className, size = 80, fill = "currentColor" }: { className?: string; size?: number; fill?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 120 120" className={className}>
      <path
        d="M60 8 C88 8 108 28 112 52 C116 76 98 104 68 110 C38 116 12 96 8 68 C4 40 32 8 60 8 Z"
        fill={fill}
        fillOpacity="0.4"
      />
    </svg>
  );
}

function DoodleRing({ className, size = 64, stroke = "currentColor" }: { className?: string; size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
      <path d="M50 8 C72 6 90 22 92 44 C94 68 74 92 48 92 C22 92 6 70 8 46 C10 22 28 10 50 8 Z" />
      <path d="M50 22 C64 20 76 30 78 44 C80 60 66 76 50 76 C34 76 22 62 22 46 C22 32 36 24 50 22 Z" strokeDasharray="4 6" strokeWidth="1.5" />
    </svg>
  );
}

function Squiggle({ className, stroke = "currentColor" }: { className?: string; stroke?: string }) {
  return (
    <svg className={className} viewBox="0 0 120 24" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round">
      <path d="M4 12 C 20 2, 28 22, 44 12 S 68 2, 84 12 S 100 22, 116 12" />
    </svg>
  );
}

function ZigZag({ className, stroke = "currentColor" }: { className?: string; stroke?: string }) {
  return (
    <svg className={className} viewBox="0 0 80 32" fill="none" stroke={stroke} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 24 L18 8 L32 24 L46 8 L60 24 L74 8" />
    </svg>
  );
}

function PlusMark({ className, size = 28, stroke = "currentColor" }: { className?: string; size?: number; stroke?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" className={className} fill="none" stroke={stroke} strokeWidth="10" strokeLinecap="round">
      <line x1="50" y1="18" x2="50" y2="82" />
      <line x1="18" y1="50" x2="82" y2="50" />
    </svg>
  );
}

function DotCluster({ className, color = "currentColor" }: { className?: string; color?: string }) {
  return (
    <svg className={className} viewBox="0 0 48 48">
      <circle cx="10" cy="10" r="4" fill={color} opacity="0.7" />
      <circle cx="24" cy="6" r="3" fill={color} opacity="0.5" />
      <circle cx="38" cy="14" r="4" fill={color} opacity="0.65" />
      <circle cx="8" cy="28" r="3" fill={color} opacity="0.55" />
      <circle cx="22" cy="24" r="5" fill={color} opacity="0.8" />
      <circle cx="36" cy="32" r="3" fill={color} opacity="0.5" />
      <circle cx="14" cy="40" r="4" fill={color} opacity="0.7" />
      <circle cx="32" cy="42" r="3" fill={color} opacity="0.55" />
    </svg>
  );
}

function FloatShape({
  children,
  className,
  delay = 0,
  duration = 6,
  y = 12,
  rotate = 6,
}: {
  children: ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  y?: number;
  rotate?: number;
}) {
  return (
    <motion.div
      className={className}
      animate={{ y: [0, -y, 0], rotate: [0, rotate, 0] }}
      transition={{ duration, delay, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}

function SpinRing({ className, size = 112, duration = 32, color = "currentColor" }: { className?: string; size?: number; duration?: number; color?: string }) {
  return (
    <motion.div
      animate={{ rotate: 360 }}
      transition={{ duration, repeat: Infinity, ease: "linear" }}
      className={className}
      style={{ width: size, height: size, color }}
    >
      <div className="h-full w-full rounded-full border-2 border-dashed border-current opacity-50" />
    </motion.div>
  );
}

/** Grand blob coloré — révélé au scroll */
function ScrollRevealBlob({
  className,
  color,
  size = 280,
  delay = 0,
}: {
  className?: string;
  color: string;
  size?: number;
  delay?: number;
}) {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <motion.div
      ref={ref}
      className={cn("absolute rounded-full blur-3xl", className)}
      style={{ width: size, height: size, backgroundColor: color }}
      initial={{ scale: 0.5, opacity: 0 }}
      animate={inView ? { scale: 1, opacity: 1 } : { scale: 0.5, opacity: 0 }}
      transition={{ duration: 1.1, delay, ease: [0.22, 1, 0.36, 1] }}
    />
  );
}

/** Forme en parallax léger au scroll */
function ScrollParallaxShape({
  children,
  className,
  yRange = [-30, 30] as [number, number],
}: {
  children: ReactNode;
  className?: string;
  yRange?: [number, number];
}) {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], yRange);

  return (
    <motion.div ref={ref} style={{ y }} className={className}>
      {children}
    </motion.div>
  );
}

export default function PadoraDecor({ variant = "hero", className }: { variant?: Variant; className?: string }) {
  return (
    <div className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)} aria-hidden>
      {variant === "hero" && (
        <>
          <ScrollRevealBlob className="-left-24 top-0" color={`${C.teal}55`} size={320} />
          <ScrollRevealBlob className="-right-20 bottom-0" color={`${C.orange}50`} size={360} delay={0.15} />
          <ScrollParallaxShape className="absolute right-[8%] top-[12%]" yRange={[-20, 40]}>
            <FloatShape duration={7}>
              <StarBurst size={72} fill={C.orange} className="opacity-70 drop-shadow-sm" />
            </FloatShape>
          </ScrollParallaxShape>
          <ScrollParallaxShape className="absolute left-[2%] top-[18%]" yRange={[30, -25]}>
            <FloatShape delay={0.5} duration={8} rotate={-8}>
              <Blob size={140} fill={C.mint} />
            </FloatShape>
          </ScrollParallaxShape>
          <SpinRing className="absolute right-[14%] top-[36%]" size={160} color={C.coral} />
          <FloatShape className="absolute bottom-16 left-[6%]" delay={1} y={10}>
            <Asterisk size={52} stroke={C.amber} className="opacity-75" />
          </FloatShape>
          <motion.div
            className="absolute bottom-10 right-[8%]"
            animate={{ rotate: [12, 22, 12] }}
            transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
          >
            <Pentagon size={64} fill={C.violet} stroke={C.violet} className="opacity-60" />
          </motion.div>
          <FloatShape className="absolute right-[26%] top-[14%]" delay={0.2} y={6}>
            <PlusMark size={32} stroke={C.sky} className="opacity-65" />
          </FloatShape>
          <Squiggle className="absolute left-[14%] top-[50%] h-8 w-40 opacity-70" stroke={C.coral} />
          <ZigZag className="absolute right-[6%] bottom-[26%] h-10 w-24 opacity-60" stroke={C.teal} />
          <DotCluster className="absolute left-[40%] top-[10%] h-12 w-12" color={C.orange} />
        </>
      )}

      {variant === "classroom" && (
        <>
          <ScrollRevealBlob className="-right-16 top-1/2 -translate-y-1/2" color={`${C.amber}45`} size={240} />
          <FloatShape className="absolute left-4 top-4">
            <StarBurst size={48} fill={C.orange} className="opacity-75" />
          </FloatShape>
          <motion.div
            animate={{ scale: [1, 1.12, 1] }}
            transition={{ duration: 5, repeat: Infinity }}
            className="absolute right-6 top-6 h-28 w-28 rounded-full bg-gradient-to-br from-teal-300/50 to-emerald-200/20 ring-2 ring-teal-400/40"
          />
          <FloatShape className="absolute bottom-6 left-[16%]" delay={0.4}>
            <Octagon size={52} stroke={C.coral} className="opacity-70" />
          </FloatShape>
          <DoodleRing className="absolute bottom-2 right-[10%] h-20 w-20 opacity-65" stroke={C.teal} size={80} />
          <PlusMark className="absolute left-[36%] top-4 opacity-60" size={32} stroke={C.violet} />
          <DotCluster className="absolute right-[28%] bottom-8 h-10 w-10" color={C.rose} />
        </>
      )}

      {variant === "about" && (
        <>
          <ScrollRevealBlob className="-left-20 top-1/4" color={`${C.violet}40`} size={300} delay={0.1} />
          <ScrollParallaxShape className="absolute -right-8 top-[15%]" yRange={[-35, 35]}>
            <SpinRing size={150} duration={40} color={C.orange} />
          </ScrollParallaxShape>
          <FloatShape className="absolute left-2 bottom-12" delay={0.2}>
            <Hexagon size={88} fill={C.teal} stroke={C.teal} className="opacity-70" />
          </FloatShape>
          <FloatShape className="absolute right-[8%] bottom-6" delay={0.5}>
            <StarBurst size={56} fill={C.amber} className="opacity-75" />
          </FloatShape>
          <Squiggle className="absolute left-[26%] top-4 h-6 w-32 opacity-70" stroke={C.coral} />
          <Blob className="absolute right-[20%] top-8 opacity-80" size={100} fill={C.sky} />
          <ZigZag className="absolute left-8 top-[32%] h-7 w-20 opacity-55" stroke={C.mint} />
        </>
      )}

      {variant === "stats" && (
        <>
          <ScrollRevealBlob className="left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2" color={`${C.orange}30`} size={400} />
          <Asterisk className="absolute left-[5%] top-1/2 h-14 w-14 -translate-y-1/2 opacity-70" stroke={C.orange} />
          <Octagon className="absolute right-[4%] top-1/2 h-16 w-16 -translate-y-1/2 opacity-65" stroke={C.teal} size={64} />
          <PlusMark className="absolute left-[40%] top-2 opacity-55" size={28} stroke={C.amber} />
          <Squiggle className="absolute right-[16%] bottom-2 h-5 w-28 opacity-60" stroke={C.coral} />
        </>
      )}

      {variant === "testimonials" && (
        <>
          <ScrollRevealBlob className="-right-24 bottom-0" color={`${C.rose}40`} size={260} />
          <FloatShape className="absolute left-[2%] top-4">
            <StarBurst size={40} fill={C.coral} className="opacity-75" />
          </FloatShape>
          <DoodleRing className="absolute right-[4%] top-8 opacity-60" stroke={C.teal} size={72} />
          <FloatShape className="absolute bottom-4 left-[8%]" delay={0.3}>
            <Hexagon size={56} fill={C.violet} stroke={C.violet} className="opacity-65" />
          </FloatShape>
          <DotCluster className="absolute right-[20%] bottom-8 h-11 w-11" color={C.orange} />
          <Sparkle className="absolute left-[44%] top-2 opacity-70" size={20} fill={C.amber} />
        </>
      )}

      {variant === "gallery" && (
        <>
          <ScrollRevealBlob className="-left-16 top-0" color={`${C.sky}38`} size={280} delay={0.12} />
          <ScrollParallaxShape className="absolute left-4 bottom-4" yRange={[25, -20]}>
            <SpinRing size={110} duration={28} color={C.orange} />
          </ScrollParallaxShape>
          <FloatShape className="absolute right-4 top-4" delay={0.3}>
            <Octagon size={56} stroke={C.amber} className="opacity-70" />
          </FloatShape>
          <FloatShape className="absolute right-[16%] bottom-8" delay={0.6}>
            <Asterisk size={40} stroke={C.teal} className="opacity-65" />
          </FloatShape>
          <PlusMark className="absolute left-[32%] top-6 opacity-55" size={28} stroke={C.coral} />
          <Squiggle className="absolute right-[6%] top-[38%] h-5 w-24 opacity-50" stroke={C.violet} />
        </>
      )}

      {variant === "events" && (
        <>
          <ScrollRevealBlob className="right-0 top-1/2 -translate-y-1/2" color={`${C.mint}42`} size={250} />
          <FloatShape className="absolute left-3 top-3">
            <StarBurst size={44} fill={C.orange} className="opacity-75" />
          </FloatShape>
          <FloatShape className="absolute right-4 bottom-4" delay={0.5}>
            <Hexagon size={68} fill={C.teal} stroke={C.teal} className="opacity-65" />
          </FloatShape>
          <Squiggle className="absolute right-[20%] top-4 h-5 w-28 opacity-65" stroke={C.coral} />
          <Blob className="absolute left-[10%] bottom-6 opacity-75" size={90} fill={C.amber} />
          <ZigZag className="absolute right-[38%] bottom-10 h-6 w-16 opacity-55" stroke={C.violet} />
        </>
      )}

      {variant === "cta" && (
        <>
          <FloatShape className="absolute left-4 top-1/3" y={6}>
            <StarBurst size={48} fill="rgba(255,255,255,0.25)" />
          </FloatShape>
          <DotCluster className="absolute right-8 top-4 h-10 w-10" color="rgba(255,255,255,0.35)" />
          <Squiggle className="absolute left-[18%] bottom-6 h-5 w-28 opacity-40" stroke="rgba(255,255,255,0.3)" />
          <PlusMark className="absolute right-[16%] bottom-8 opacity-35" size={28} stroke="rgba(255,255,255,0.35)" />
          <motion.div
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute right-6 top-1/2 h-4 w-4 rounded-full bg-white/30"
          />
        </>
      )}
    </div>
  );
}

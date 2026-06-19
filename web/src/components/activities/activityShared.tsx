"use client";

import { motion, useReducedMotion, type HTMLMotionProps } from "framer-motion";
import { CheckCircle2, ChevronLeft, ChevronRight, Volume2, XCircle } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";
import type { ActivityLang } from "@/types/activity";

export function pickLang(fr: string, ar: string, _langue: ActivityLang): string {
  return fr?.trim() ? fr : ar?.trim() ? ar : fr || ar || "";
}

export function activityFontClass(langue: ActivityLang): string {
  return langue === "ar" ? "font-[family-name:var(--font-amiri)]" : "";
}

type ActivityRootProps = {
  langue: ActivityLang;
  children: ReactNode;
  className?: string;
};

export function ActivityRoot({ langue, children, className }: ActivityRootProps) {
  return (
    <div
      dir={langue === "ar" ? "rtl" : "ltr"}
      className={cn("w-full bg-[#FFFBF5] p-4 md:p-8", activityFontClass(langue), className)}
    >
      {children}
    </div>
  );
}

export function ActivityMotionSection({
  children,
  className,
  ...props
}: HTMLMotionProps<"div"> & { children: ReactNode }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      initial={reduceMotion ? false : { opacity: 0, y: 32 }}
      animate={{ opacity: 1, y: 0 }}
      exit={reduceMotion ? undefined : { opacity: 0, y: -32 }}
      transition={{ duration: 0.4, ease: "easeOut" }}
      className={className}
      {...props}
    >
      {children}
    </motion.div>
  );
}

export function PrimaryButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-[48px] min-w-[48px] rounded-2xl bg-[#F97316] px-6 py-4 text-xl font-bold text-white shadow-[0_6px_0_#EA6C0A] transition-all duration-100 select-none active:translate-y-1 active:shadow-[0_2px_0_#EA6C0A] disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

export function SecondaryButton({
  children,
  onClick,
  disabled,
  className,
}: {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}) {
  return (
    <motion.button
      type="button"
      whileTap={disabled ? undefined : { scale: 0.96 }}
      onClick={onClick}
      disabled={disabled}
      className={cn(
        "min-h-[48px] min-w-[48px] rounded-2xl border-2 border-[#E4E4E7] bg-transparent px-5 py-3 text-base font-semibold text-[#3F3F46] transition-all duration-100 disabled:cursor-not-allowed disabled:opacity-60",
        className
      )}
    >
      {children}
    </motion.button>
  );
}

export function AudioButton({ url, label }: { url?: string | null; label: string }) {
  if (!url) return null;
  return (
    <button
      type="button"
      aria-label={label}
      onClick={() => {
        const audio = new Audio(url);
        void audio.play();
      }}
      className="flex min-h-[48px] min-w-[48px] items-center justify-center rounded-full border-2 border-[#F59E0B] bg-[#FEF3C7] p-3 text-[#F97316] shadow-sm transition-transform active:scale-95"
    >
      <Volume2 size={24} />
    </button>
  );
}

export function FeedbackBlock({
  correct,
  message,
  langue,
}: {
  correct: boolean;
  message?: string;
  langue: ActivityLang;
}) {
  if (!message) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      className={cn(
        "mt-4 flex items-start gap-3 rounded-2xl p-4 text-lg",
        correct ? "bg-[#D1FAE5] text-[#065F46]" : "bg-[#FEE2E2] text-[#991B1B]"
      )}
    >
      {correct ? (
        <CheckCircle2 className="shrink-0 text-[#10B981]" size={28} />
      ) : (
        <XCircle className="shrink-0 text-[#EF4444]" size={28} />
      )}
      <p dir={langue === "ar" ? "rtl" : "ltr"}>{message}</p>
    </motion.div>
  );
}

export function NavChevron({
  direction,
  langue,
}: {
  direction: "prev" | "next";
  langue: ActivityLang;
}) {
  const isRtl = langue === "ar";
  if (direction === "prev") {
    return isRtl ? <ChevronRight size={24} /> : <ChevronLeft size={24} />;
  }
  return isRtl ? <ChevronLeft size={24} /> : <ChevronRight size={24} />;
}

export function shuffleArray<T>(items: T[]): T[] {
  const copy = [...items];
  for (let i = copy.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}

export function normalizeHex(color: string): string {
  return color.trim().toLowerCase();
}

const ARABIC_DIGITS = ["٠", "١", "٢", "٣", "٤", "٥", "٦", "٧", "٨", "٩"];

export function formatNumber(n: number, langue: ActivityLang, useArabicDigits?: boolean): string {
  if (langue === "ar" || useArabicDigits) {
    return String(n)
      .split("")
      .map((d) => (d >= "0" && d <= "9" ? ARABIC_DIGITS[Number(d)] : d))
      .join("");
  }
  return String(n);
}

export function shakeAnimation(reduceMotion: boolean | null) {
  if (reduceMotion) return {};
  return {
    animate: { x: [0, -8, 8, -8, 8, 0] },
    transition: { duration: 0.4 },
  };
}

export function successPulse(reduceMotion: boolean | null) {
  if (reduceMotion) return {};
  return {
    animate: { scale: [1, 1.08, 1] },
    transition: { duration: 0.4, ease: "easeOut" as const },
  };
}

"use client";

import { Link } from "@/i18n/routing";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";

type Props = {
  title: string;
  description: string;
  href: string;
  cta: string;
  icon: LucideIcon;
  coverClass: string;
  isRTL?: boolean;
  delay?: number;
};

export default function ClassroomCard({
  title,
  description,
  href,
  cta,
  icon: Icon,
  coverClass,
  isRTL,
  delay = 0,
}: Props) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.2 }}
      transition={{ duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] }}
      whileHover={{ y: -8 }}
      className="group flex h-full flex-col overflow-hidden rounded-[1.75rem] bg-white shadow-[0_12px_48px_-20px_rgba(15,23,42,0.12)] ring-1 ring-slate-100/80"
    >
      <div className={cn("relative flex h-48 items-center justify-center overflow-hidden", coverClass)}>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.45),transparent_55%)]" />
        <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/20 blur-2xl" />
        <motion.div
          whileHover={{ scale: 1.06, rotate: 3 }}
          transition={{ type: "spring", stiffness: 300, damping: 20 }}
          className="relative flex h-20 w-20 items-center justify-center rounded-[1.25rem] bg-white shadow-[0_8px_30px_-8px_rgba(15,23,42,0.15)] ring-1 ring-white/80"
        >
          <Icon className="h-9 w-9 text-orange-500" strokeWidth={1.5} />
        </motion.div>
      </div>
      <div className={cn("flex flex-1 flex-col p-6 md:p-7", isRTL && "text-right")}>
        <h3 className={cn("font-landing-display text-xl font-bold text-slate-900 md:text-2xl", isRTL && "font-ui-ar")}>
          {title}
        </h3>
        <p className={cn("mt-2 flex-1 text-sm leading-relaxed text-slate-600", isRTL && "font-lateef text-base")}>
          {description}
        </p>
        <Link
          href={href}
          className={cn(
            "mt-5 inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-4 py-2 text-sm font-semibold text-orange-600 transition-colors hover:bg-orange-100",
            isRTL && "flex-row-reverse self-end"
          )}
        >
          {cta}
          <ArrowUpRight className={cn("h-4 w-4", isRTL && "-scale-x-100")} />
        </Link>
      </div>
    </motion.article>
  );
}

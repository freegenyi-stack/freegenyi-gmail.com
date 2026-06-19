"use client";

import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

type Props = {
  children: React.ReactNode;
  className?: string;
  featured?: boolean;
  accent?: "orange" | "teal" | "slate";
};

const accentShadow = {
  orange: "hover:shadow-[6px_6px_0_0_#ea580c]",
  teal: "hover:shadow-[6px_6px_0_0_#14b8a6]",
  slate: "hover:shadow-[6px_6px_0_0_#0f172a]",
};

export default function PopCard({ children, className, featured, accent = "orange" }: Props) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ type: "spring", stiffness: 400, damping: 22 }}
      className={cn(
        "rounded-[1.5rem] border-2 bg-white p-5 transition-shadow duration-300 md:p-7",
        featured
          ? "border-slate-900 bg-slate-900 text-white shadow-[5px_5px_0_0_#ea580c]"
          : cn("border-slate-900 shadow-[4px_4px_0_0_#0f172a]", accentShadow[accent]),
        className
      )}
    >
      {children}
    </motion.div>
  );
}

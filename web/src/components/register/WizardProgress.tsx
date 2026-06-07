"use client";

import { motion } from "framer-motion";

type Props = {
  step: number;
  total: number;
  isRTL?: boolean;
};

export default function WizardProgress({ step, total, isRTL }: Props) {
  const pct = (step / total) * 100;

  return (
    <div className="w-full" dir={isRTL ? "rtl" : "ltr"}>
      <div className="h-2 w-full overflow-hidden rounded-full bg-neutral-200 sm:h-1.5">
        <motion.div
          className="h-full rounded-full bg-orange-500"
          initial={false}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        />
      </div>
    </div>
  );
}

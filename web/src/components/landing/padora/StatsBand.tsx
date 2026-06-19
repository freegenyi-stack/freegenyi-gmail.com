"use client";

import { cn } from "@/lib/utils";
import { NumberTicker } from "@/components/magicui/number-ticker";

type Stat = { value: number; suffix: string; label: string };

export default function StatsBand({ stats, isRTL }: { stats: Stat[]; isRTL?: boolean }) {
  return (
    <div className="fg-padora-sand border-y border-orange-100/60 py-14 md:py-20">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 px-4 sm:px-6 md:grid-cols-5 md:gap-6">
        {stats.map((s, i) => (
          <div key={s.label} className={cn("text-center", isRTL && "font-lateef")}>
            <p className="text-4xl font-bold tabular-nums text-orange-600 md:text-5xl">
              <NumberTicker value={s.value} delay={i * 0.08} className="text-orange-600" />
              {s.suffix}
            </p>
            <p className="mt-2 text-xs font-semibold uppercase tracking-wider text-slate-600">{s.label}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

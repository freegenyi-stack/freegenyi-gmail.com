"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

type Item = { name: string; quote: string };

export default function TestimonialsCarousel({
  items,
  isRTL,
}: {
  items: Item[];
  isRTL?: boolean;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const id = setInterval(() => setIndex((i) => (i + 1) % items.length), 6000);
    return () => clearInterval(id);
  }, [items.length]);

  const prev = () => setIndex((i) => (i - 1 + items.length) % items.length);
  const next = () => setIndex((i) => (i + 1) % items.length);

  const item = items[index];

  return (
    <div className="relative mx-auto max-w-3xl">
      <div className="overflow-hidden rounded-[2rem] bg-white p-8 shadow-[0_20px_60px_-24px_rgba(15,23,42,0.12)] ring-1 ring-orange-100/80 md:p-12">
        <Quote className="h-10 w-10 text-orange-200" strokeWidth={1.25} />

        <AnimatePresence mode="wait">
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className={cn("mt-6", isRTL && "text-right")}
          >
            <p className={cn("text-lg leading-relaxed text-slate-700 md:text-xl", isRTL && "font-ui-ar")}>
              « {item.quote} »
            </p>
            <p className={cn("mt-6 text-sm font-bold text-orange-600", isRTL && "font-ui-ar text-base")}>
              {item.name}
            </p>
          </motion.div>
        </AnimatePresence>
      </div>

      <div className="mt-6 flex items-center justify-center gap-4">
        <button
          type="button"
          onClick={prev}
          aria-label="Previous"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-600 transition hover:bg-orange-50"
        >
          <ChevronLeft className={cn("h-5 w-5", isRTL && "rotate-180")} />
        </button>
        <div className="flex gap-2">
          {items.map((_, i) => (
            <button
              key={i}
              type="button"
              aria-label={`Slide ${i + 1}`}
              onClick={() => setIndex(i)}
              className={cn(
                "h-2 rounded-full transition-all",
                i === index ? "w-6 bg-orange-500" : "w-2 bg-orange-200"
              )}
            />
          ))}
        </div>
        <button
          type="button"
          onClick={next}
          aria-label="Next"
          className="flex h-10 w-10 items-center justify-center rounded-full border border-orange-200 bg-white text-orange-600 transition hover:bg-orange-50"
        >
          <ChevronRight className={cn("h-5 w-5", isRTL && "rotate-180")} />
        </button>
      </div>
    </div>
  );
}

"use client";

import { motion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

export type GalleryItem = {
  label: string;
  icon: LucideIcon;
  /** Dégradé CSS inline — garantit l’affichage des couleurs */
  gradient: string;
  accent: string;
  pattern?: "dots" | "rings" | "waves";
};

const patterns = {
  dots: "bg-[radial-gradient(circle,rgba(255,255,255,0.35)_1.5px,transparent_1.5px)] bg-[length:14px_14px]",
  rings: "bg-[radial-gradient(circle_at_center,transparent_48%,rgba(255,255,255,0.22)_49%,rgba(255,255,255,0.22)_51%,transparent_52%)] bg-[length:32px_32px]",
  waves: "bg-[repeating-linear-gradient(-45deg,rgba(255,255,255,0.08)_0px,rgba(255,255,255,0.08)_2px,transparent_2px,transparent_10px)]",
};

export default function PhotoGallery({
  items,
  isRTL,
}: {
  items: GalleryItem[];
  isRTL?: boolean;
}) {
  return (
    <div className="fg-snap-x flex gap-4 overflow-x-auto pb-2 md:grid md:grid-cols-3 md:gap-5 md:overflow-visible lg:grid-cols-6">
      {items.map((item, i) => {
        const Icon = item.icon;
        const pattern = patterns[item.pattern ?? (["dots", "rings", "waves", "dots", "rings", "waves"][i] as GalleryItem["pattern"])];

        return (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ delay: i * 0.06, duration: 0.5 }}
            whileHover={{ y: -6 }}
            className="fg-snap-item group min-w-[70vw] shrink-0 md:min-w-0"
          >
            <div
              className="relative aspect-[4/5] overflow-hidden rounded-3xl shadow-lg ring-1 ring-white/70"
              style={{ background: item.gradient }}
            >
              {/* Motif de fond */}
              <div className={cn("absolute inset-0 opacity-80", pattern)} />

              {/* Reflet lumineux */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_18%,rgba(255,255,255,0.55),transparent_55%)]" />

              {/* Forme décorative */}
              <div
                className="absolute -right-6 -top-6 h-28 w-28 rounded-full opacity-30 blur-sm"
                style={{ backgroundColor: item.accent }}
              />
              <div
                className="absolute -bottom-8 -left-4 h-24 w-24 rounded-full opacity-25 blur-md"
                style={{ backgroundColor: item.accent }}
              />

              {/* Icône centrale */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="flex h-[4.5rem] w-[4.5rem] items-center justify-center rounded-2xl bg-white/85 shadow-md ring-1 ring-white/90 transition-transform duration-300 group-hover:scale-110 md:h-16 md:w-16">
                  <Icon className="h-8 w-8 md:h-9 md:w-9" style={{ color: item.accent }} strokeWidth={1.5} />
                </div>
              </div>

              {/* Numéro */}
              <div
                className="absolute left-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-xs font-bold shadow-sm"
                style={{ color: item.accent }}
              >
                {i + 1}
              </div>

              {/* Légende */}
              <div className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/40 via-black/20 to-transparent px-4 pb-4 pt-10">
                <p
                  className={cn(
                    "text-sm font-semibold text-white drop-shadow-md",
                    isRTL && "font-ui-ar text-base text-right"
                  )}
                >
                  {item.label}
                </p>
              </div>
            </div>
          </motion.div>
        );
      })}
    </div>
  );
}

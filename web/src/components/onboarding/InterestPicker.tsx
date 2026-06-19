"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations } from "next-intl";
import { Check, Sparkles } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  MAX_NOTIFICATION_INTERESTS,
  NOTIFICATION_INTEREST_TOPICS,
} from "@/lib/onboarding/interest-topics";

type Props = {
  value: string[];
  onChange: (ids: string[]) => void;
  className?: string;
  compact?: boolean;
};

export default function InterestPicker({ value, onChange, className, compact }: Props) {
  const t = useTranslations("InterestTopics");

  const toggle = (id: string) => {
    if (value.includes(id)) {
      onChange(value.filter((x) => x !== id));
      return;
    }
    if (value.length < MAX_NOTIFICATION_INTERESTS) {
      onChange([...value, id]);
    }
  };

  const isComplete = value.length === MAX_NOTIFICATION_INTERESTS;
  const remaining = MAX_NOTIFICATION_INTERESTS - value.length;

  return (
    <div className={cn("space-y-3", className)}>
      <div>
        <p className={cn("font-black text-slate-900", compact ? "text-xs uppercase tracking-wide" : "text-sm")}>
          {t("title")}
        </p>
        <p className={cn("text-slate-500 font-medium mt-0.5", compact ? "text-[11px]" : "text-xs")}>
          {isComplete ? t("subtitleDone") : t("subtitlePick", { count: remaining })}
        </p>
      </div>

      <div className={cn("flex flex-wrap gap-2", compact && "gap-1.5")}>
        {NOTIFICATION_INTEREST_TOPICS.map((topic) => {
          const selected = value.includes(topic.id);
          const disabled = !selected && value.length >= MAX_NOTIFICATION_INTERESTS;
          const Icon = topic.icon;

          return (
            <motion.button
              key={topic.id}
              type="button"
              disabled={disabled}
              onClick={() => toggle(topic.id)}
              whileTap={{ scale: 0.92 }}
              animate={selected ? { scale: [1, 1.08, 1] } : { scale: 1 }}
              transition={{ duration: 0.25 }}
              className={cn(
                "relative inline-flex items-center gap-1.5 rounded-2xl border-2 font-bold transition-all",
                compact ? "px-2.5 py-1.5 text-[11px]" : "px-3 py-2 text-xs",
                selected ? topic.active : topic.idle,
                disabled && "opacity-40 cursor-not-allowed",
                !disabled && !selected && "hover:scale-[1.03] active:scale-95"
              )}
            >
              <Icon className={cn(compact ? "w-3.5 h-3.5" : "w-4 h-4", "shrink-0")} />
              <span>{t(`topics.${topic.id}`)}</span>
              <AnimatePresence>
                {selected && (
                  <motion.span
                    initial={{ scale: 0, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    exit={{ scale: 0, opacity: 0 }}
                    className="ml-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-white/25"
                  >
                    <Check className="h-2.5 w-2.5" strokeWidth={3} />
                  </motion.span>
                )}
              </AnimatePresence>
            </motion.button>
          );
        })}
      </div>

      <AnimatePresence>
        {isComplete && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -4 }}
            className="flex items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-500 to-teal-500 px-4 py-3 text-white shadow-lg"
          >
            <motion.span
              animate={{ rotate: [0, 12, -8, 0] }}
              transition={{ repeat: 2, duration: 0.4 }}
            >
              <Sparkles className="h-5 w-5" />
            </motion.span>
            <span className="text-sm font-black tracking-wide">{t("noted")}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

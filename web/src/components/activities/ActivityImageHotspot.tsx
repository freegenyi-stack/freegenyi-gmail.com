"use client";

import { useState } from "react";
import { motion, useReducedMotion } from "framer-motion";
import {
  ActivityMotionSection,
  ActivityRoot,
  AudioButton,
  FeedbackBlock,
  pickLang,
  shakeAnimation,
} from "./activityShared";
import type { ActivityAnswerEntry, ActivityLang, ImageHotspotContent } from "@/types/activity";
import { cn } from "@/lib/utils";

type Props = {
  content: ImageHotspotContent;
  langue: ActivityLang;
  onAnswer?: (correct: boolean) => void;
  onStepComplete?: () => void;
  onRecordAnswer?: (entry: ActivityAnswerEntry) => void;
  disabled?: boolean;
};

export function ActivityImageHotspot({ content, langue, onAnswer, onStepComplete, onRecordAnswer, disabled }: Props) {
  const reduceMotion = useReducedMotion();
  const [revealed, setRevealed] = useState<string | null>(null);
  const [completed, setCompleted] = useState(false);
  const [feedback, setFeedback] = useState<{ correct: boolean; label: string } | null>(null);

  const handleZoneClick = (zoneId: string, correct: boolean, label: string) => {
    if (disabled || completed) return;
    setRevealed(zoneId);
    setFeedback({ correct, label });
    onRecordAnswer?.({ index: 0, questionId: zoneId, label, answer: zoneId, correct });
    onAnswer?.(correct);
    if (correct) {
      setCompleted(true);
      onStepComplete?.();
    } else {
      window.setTimeout(() => {
        setRevealed(null);
        setFeedback(null);
      }, 800);
    }
  };

  return (
    <ActivityRoot langue={langue}>
      <ActivityMotionSection>
        <div className="mb-4 flex items-start gap-3">
          <p className="flex-1 text-xl font-bold text-[#18181B] md:text-2xl">
            {pickLang(content.instruction_fr, content.instruction_ar, langue)}
          </p>
          <AudioButton
            url={content.instruction_audio_url}
            label={langue === "ar" ? "استماع" : "Écouter"}
          />
        </div>

        <motion.div
          className="relative mx-auto w-full max-w-2xl overflow-hidden rounded-3xl shadow-[0_4px_24px_rgba(0,0,0,0.08)]"
          {...(feedback && !feedback.correct ? shakeAnimation(reduceMotion) : {})}
        >
          <img
            src={content.image_url}
            alt=""
            className="block h-auto w-full select-none"
            draggable={false}
          />
          {content.zones.map((zone) => {
            const isRevealed = revealed === zone.id;
            const size = zone.rayon_percent * 2;
            return (
              <button
                key={zone.id}
                type="button"
                disabled={disabled || completed}
                aria-label={pickLang(zone.label_fr, zone.label_ar, langue)}
                onClick={() =>
                  handleZoneClick(
                    zone.id,
                    zone.correct,
                    pickLang(zone.label_fr, zone.label_ar, langue)
                  )
                }
                className={cn(
                  "absolute rounded-full transition-opacity",
                  isRevealed
                    ? zone.correct
                      ? "animate-ping bg-[#10B981] opacity-60"
                      : "bg-[#EF4444] opacity-60"
                    : "cursor-pointer opacity-0 hover:bg-white hover:opacity-20"
                )}
                style={{
                  left: `${zone.x_percent - zone.rayon_percent}%`,
                  top: `${zone.y_percent - zone.rayon_percent}%`,
                  width: `${size}%`,
                  aspectRatio: "1 / 1",
                }}
              />
            );
          })}
        </motion.div>

        {feedback && (
          <FeedbackBlock
            correct={feedback.correct}
            message={feedback.label}
            langue={langue}
          />
        )}

        {completed && (
          <p className="mt-4 text-center text-lg font-bold text-[#10B981]">
            {langue === "ar" ? "أحسنت!" : "Bravo !"}
          </p>
        )}
      </ActivityMotionSection>
    </ActivityRoot>
  );
}

export default ActivityImageHotspot;
